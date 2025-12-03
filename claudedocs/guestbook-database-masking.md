# 방명록 Pending 메시지 데이터베이스 레벨 마스킹

## 현재 구현 (2025-12-04)

현재는 프론트엔드에서 pending 메시지를 마스킹하고 있습니다:

```typescript
// apps/guestbook/src/utils/supabase.ts
const maskedEntries = (data || []).map(entry => {
  if (entry.status === 'pending') {
    return {
      ...entry,
      message: '🔒 승인 대기 중인 메시지입니다.',
    };
  }
  return entry;
}) as GuestbookEntry[];
```

**장점:**
- 간단한 구현
- 클라이언트 코드만 수정하면 됨

**단점:**
- 실제 메시지 내용이 네트워크를 통해 전송됨 (보안 취약)
- 브라우저 개발자 도구로 원본 메시지 확인 가능

## 권장 구현: 데이터베이스 레벨 마스킹

### 방법 1: Supabase RPC 함수 생성

Supabase Dashboard → SQL Editor에서 다음 SQL을 실행:

```sql
-- RPC 함수 생성: pending 메시지는 마스킹된 내용 반환
CREATE OR REPLACE FUNCTION fetch_guestbook_entries_masked(
  page_num INT,
  page_size INT
)
RETURNS TABLE (
  id UUID,
  nickname TEXT,
  profile_image TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ge.id,
    ge.nickname,
    ge.profile_image,
    CASE
      WHEN ge.status = 'pending' THEN '🔒 승인 대기 중인 메시지입니다.'
      ELSE ge.message
    END AS message,
    ge.status,
    ge.created_at,
    ge.approved_at,
    ge.rejected_at
  FROM guestbook_entries ge
  WHERE ge.status IN ('approved', 'pending')
  ORDER BY ge.created_at DESC
  OFFSET page_num * page_size
  LIMIT page_size;
END;
$$;

-- 익명 사용자도 RPC 함수 실행 가능하도록 권한 부여
GRANT EXECUTE ON FUNCTION fetch_guestbook_entries_masked(INT, INT) TO anon;
GRANT EXECUTE ON FUNCTION fetch_guestbook_entries_masked(INT, INT) TO authenticated;
```

### 방법 2: Postgres View 사용

```sql
-- View 생성: pending 메시지 마스킹
CREATE OR REPLACE VIEW guestbook_entries_masked AS
SELECT
  id,
  nickname,
  profile_image,
  CASE
    WHEN status = 'pending' THEN '🔒 승인 대기 중인 메시지입니다.'
    ELSE message
  END AS message,
  status,
  created_at,
  approved_at,
  rejected_at
FROM guestbook_entries
WHERE status IN ('approved', 'pending');

-- View 접근 권한 부여
GRANT SELECT ON guestbook_entries_masked TO anon;
GRANT SELECT ON guestbook_entries_masked TO authenticated;
```

## 프론트엔드 수정

### RPC 함수 사용 시

```typescript
// apps/guestbook/src/utils/supabase.ts
export async function fetchGuestbookEntries(page: number, limit: number) {
  const { data, error } = await supabase
    .rpc('fetch_guestbook_entries_masked', {
      page_num: page,
      page_size: limit,
    });

  if (error) {
    throw new Error(`Failed to fetch guestbook entries: ${error.message}`);
  }

  // 전체 개수는 별도 쿼리로 가져오기
  const { count } = await supabase
    .from('guestbook_entries')
    .select('*', { count: 'exact', head: true })
    .in('status', ['approved', 'pending']);

  return {
    entries: (data || []) as GuestbookEntry[],
    total: count || 0,
    hasMore: (count || 0) > (page + 1) * limit,
  };
}
```

### View 사용 시

```typescript
// apps/guestbook/src/utils/supabase.ts
export async function fetchGuestbookEntries(page: number, limit: number) {
  const { data, error, count } = await supabase
    .from('guestbook_entries_masked')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    throw new Error(`Failed to fetch guestbook entries: ${error.message}`);
  }

  return {
    entries: (data || []) as GuestbookEntry[],
    total: count || 0,
    hasMore: (count || 0) > (page + 1) * limit,
  };
}
```

## 보안 고려사항

1. **RLS (Row Level Security)** 확인
   - `guestbook_entries` 테이블에 RLS가 활성화되어 있는지 확인
   - 익명 사용자가 pending/approved만 조회 가능하도록 정책 설정

```sql
-- RLS 활성화
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- 익명 사용자 조회 정책
CREATE POLICY "Allow anonymous read approved and pending"
ON guestbook_entries
FOR SELECT
TO anon
USING (status IN ('approved', 'pending'));

-- 인증된 사용자 조회 정책
CREATE POLICY "Allow authenticated read approved and pending"
ON guestbook_entries
FOR SELECT
TO authenticated
USING (status IN ('approved', 'pending'));
```

2. **API Key 보안**
   - 현재 `VITE_SUPABASE_KEY`는 익명 키(anon key)를 사용
   - 서비스 키(service key)는 절대 클라이언트에 노출하지 말 것

## 추천 방법

**View 사용 (방법 2)**을 추천합니다:
- 구현이 간단
- 프론트엔드 코드 변경 최소화
- 성능 우수 (RPC 함수보다 빠름)
- Supabase의 자동 타입 생성 지원

## 적용 순서

1. Supabase Dashboard → SQL Editor → View 생성 SQL 실행
2. `apps/guestbook/src/utils/supabase.ts` 수정 (from 'guestbook_entries' → 'guestbook_entries_masked')
3. 테스트: pending 메시지가 마스킹되어 표시되는지 확인
4. 브라우저 개발자 도구로 네트워크 요청 확인 → 원본 메시지가 전송되지 않는지 확인

## 참고

- 현재 구현(프론트엔드 마스킹)도 기능적으로는 동작하지만, 보안상 데이터베이스 레벨 마스킹이 더 안전합니다.
- 실제 프로덕션 환경에서는 데이터베이스 레벨 마스킹을 권장합니다.
