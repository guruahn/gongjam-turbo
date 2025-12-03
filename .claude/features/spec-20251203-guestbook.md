# Feature Specification: Guestbook (무기명 방명록)

**Feature Name**: `guestbook`
**작성일**: 2025-12-03
**Phase**: 신규 기능 개발
**관련 링크**:
- 태스크: TBD
- 피그마: TBD

---

## 1. 기능 개요

### 1.1 목적 및 설명
방문자들이 짧은 방문 후기를 남길 수 있는 무기명 방명록 시스템입니다. 닉네임과 귀여운 동물 프로필 이미지를 선택하여 간단하게 메시지를 남길 수 있으며, 관리자 승인을 통해 악의적인 메시지를 필터링하여 건전한 커뮤니티 환경을 유지합니다.

### 1.2 사용자 스토리

#### 방문자 (작성자)
- ✍️ 닉네임과 귀여운 동물 프로필 이미지를 선택하여 280자 이내의 방문 후기를 작성합니다
- 🎨 12개의 귀여운 동물 이미지 중 마음에 드는 프로필을 선택할 수 있습니다 (기본값: 랜덤)
- 📝 작성한 메시지는 관리자 승인 대기 상태가 되며, 승인 후 공개됩니다
- 📱 모바일, 태블릿, 데스크톱 모든 환경에서 편리하게 작성할 수 있습니다
- 📋 최신 방문 후기들을 카드 형태로 무한 스크롤로 탐색합니다

#### 관리자
- 🔐 Supabase Auth를 통해 안전하게 로그인합니다
- 👀 승인 대기 중인 메시지를 검토합니다
- ✅ 적절한 메시지는 승인하여 공개합니다
- ❌ 부적절한 메시지는 거부하여 비공개 처리합니다
- 📊 관리자 전용 페이지에서 승인/거부 기능을 사용합니다

### 1.3 성공 지표 및 KPI
- ✅ 방문자가 3번의 클릭 이내에 메시지를 작성하고 제출할 수 있음
- ✅ 관리자가 승인/거부를 5초 이내에 처리할 수 있음
- ✅ 무한 스크롤: 30개씩 로드, 스크롤 하단 도달 시 자동 로드
- ✅ 성능: 초기 로딩 1초 이내, 추가 로딩 500ms 이내
- ✅ 반응형: 모바일(320px+), 태블릿(768px+), 데스크톱(1024px+) 지원
- ✅ 접근성: WCAG 2.1 AA 수준 준수

---

## 2. 기술 요구사항

### 2.1 시스템 아키텍처

#### Module Federation 구조
```
apps/_shell (Host App, Port 3000)
├─ /guestbook → apps/guestbook (Remote App, Port 3003)
└─ Module Federation: 동적 로드

apps/guestbook (Remote App, Port 3003)
├─ Exposes: ./GuestbookShell (셸 컴포넌트)
├─ Exposes: ./App (메인 앱)
├─ Exposes: ./bootstrap (부트스트랩)
├─ Exposes: ./GuestbookRouter (라우터)
├─ Exposes: ./GuestbookListPage (목록 페이지)
├─ Exposes: ./GuestbookAdminPage (관리자 페이지)
├─ 독립 실행 가능 (standalone)
└─ Supabase 통합 (인증, 데이터베이스)
```

#### 디렉토리 구조
```
apps/guestbook/
├── src/
│   ├── pages/
│   │   ├── GuestbookListPage.vue    # 방명록 목록 + 작성 폼
│   │   └── GuestbookAdminPage.vue   # 관리자 페이지
│   ├── components/
│   │   ├── GuestbookCard.vue        # 방명록 메시지 카드
│   │   ├── GuestbookForm.vue        # 작성 폼
│   │   ├── ProfileSelector.vue      # 프로필 이미지 선택기
│   │   ├── InfiniteScroll.vue       # 무한 스크롤 래퍼
│   │   └── AdminPanel.vue           # 관리자 승인/거부 패널
│   ├── composables/
│   │   ├── useGuestbook.ts          # 방명록 데이터 로직
│   │   ├── useAuth.ts               # Supabase 인증
│   │   └── useInfiniteScroll.ts     # 무한 스크롤 로직
│   ├── types/
│   │   └── guestbook.ts             # TypeScript 타입 정의
│   ├── utils/
│   │   ├── supabase.ts              # Supabase 클라이언트
│   │   └── validation.ts            # 입력 검증 유틸
│   ├── assets/
│   │   └── profiles/                # 프로필 이미지 (12개)
│   │       ├── cat.png
│   │       ├── dog.png
│   │       ├── rabbit.png
│   │       ├── hamster.png
│   │       ├── fox.png
│   │       ├── bear.png
│   │       ├── panda.png
│   │       ├── koala.png
│   │       ├── penguin.png
│   │       ├── owl.png
│   │       ├── seal.png
│   │       └── otter.png
│   ├── router.ts                    # 방명록 라우터
│   ├── bootstrap.ts                 # 부트스트랩
│   ├── GuestbookShell.vue          # 셸 컴포넌트
│   ├── App.vue                      # 앱 루트
│   └── main.ts                      # 앱 진입점
├── .env.development                 # 로컬 환경변수
├── .env.production                  # 배포 환경변수
├── vite.config.ts                   # Vite + Module Federation
├── vitest.config.ts                 # Vitest 설정
├── tailwind.config.js               # Tailwind CSS 설정
├── package.json
└── tsconfig.json
```

### 2.2 TypeScript 타입 정의

```typescript
// apps/guestbook/src/types/guestbook.ts

export type ProfileImage =
  | 'cat' | 'dog' | 'rabbit' | 'hamster'
  | 'fox' | 'bear' | 'panda' | 'koala'
  | 'penguin' | 'owl' | 'seal' | 'otter';

export type GuestbookStatus = 'pending' | 'approved' | 'rejected';

export interface GuestbookEntry {
  id: string;                          // UUID (Supabase 자동 생성)
  nickname: string;                    // 닉네임 (최대 20자)
  profile_image: ProfileImage;         // 프로필 이미지 ID
  message: string;                     // 메시지 내용 (최대 280자)
  status: GuestbookStatus;             // 승인 상태
  created_at: string;                  // ISO 8601 timestamp
  approved_at?: string;                // 승인 시간 (승인된 경우)
  rejected_at?: string;                // 거부 시간 (거부된 경우)
}

export interface GuestbookFormData {
  nickname: string;
  profile_image: ProfileImage;
  message: string;
}

export interface GuestbookAdminAction {
  entry_id: string;
  action: 'approve' | 'reject';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface GuestbookListResponse {
  entries: GuestbookEntry[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

### 2.3 기술 스택 선정

| 카테고리 | 기술 | 버전 | 목적 |
|---------|------|------|------|
| **Core** | Vue 3 | 3.5.13 | UI 프레임워크 |
| | TypeScript | 5.6.3 | 타입 안전성 |
| | Vite | 6.0.3 | 빌드 도구 |
| **Module Federation** | @module-federation/vite | 1.9.0 | 마이크로 프론트엔드 |
| **라우팅** | Vue Router | 4.4.5 | SPA 라우팅 |
| **스타일링** | Tailwind CSS | 3.4.17 | 유틸리티 CSS |
| **백엔드** | Supabase | ^2.39.0 | 인증, 데이터베이스, API |
| **테스팅** | Vitest | 3.2.4 | 단위 테스트 |
| | @vue/test-utils | 2.4.6 | Vue 컴포넌트 테스트 |

### 2.4 외부 서비스 연동

#### Supabase 설정
- **Database**: PostgreSQL (Supabase 제공)
- **Authentication**: Supabase Auth (관리자만)
- **Realtime**: 선택적 (실시간 업데이트)
- **Storage**: 프로필 이미지는 로컬 assets 사용

---

## 3. 데이터베이스 스키마

### 3.1 Supabase 테이블 정의

#### `guestbook_entries` 테이블

```sql
CREATE TABLE public.guestbook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname VARCHAR(20) NOT NULL,
  profile_image VARCHAR(20) NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 280),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,

  -- 인덱스
  CONSTRAINT guestbook_entries_pkey PRIMARY KEY (id)
);

-- 인덱스 생성
CREATE INDEX idx_guestbook_status ON public.guestbook_entries(status);
CREATE INDEX idx_guestbook_created_at ON public.guestbook_entries(created_at DESC);
CREATE INDEX idx_guestbook_approved_at ON public.guestbook_entries(approved_at DESC);

-- RLS (Row Level Security) 정책
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- 공개된 메시지는 누구나 읽기 가능
CREATE POLICY "Anyone can read approved entries"
  ON public.guestbook_entries
  FOR SELECT
  USING (status = 'approved');

-- 누구나 메시지 작성 가능 (pending 상태로)
CREATE POLICY "Anyone can insert entries"
  ON public.guestbook_entries
  FOR INSERT
  WITH CHECK (status = 'pending');

-- 관리자만 메시지 승인/거부 가능
CREATE POLICY "Admins can update entries"
  ON public.guestbook_entries
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  ));

-- 관리자만 모든 메시지 읽기 가능
CREATE POLICY "Admins can read all entries"
  ON public.guestbook_entries
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  ));
```

#### `admin_users` 테이블 (관리자 권한 관리)

```sql
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- 유니크 제약
  CONSTRAINT admin_users_user_id_key UNIQUE (user_id),
  CONSTRAINT admin_users_email_key UNIQUE (email)
);

-- RLS 정책
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 관리자는 자신의 정보만 읽기 가능
CREATE POLICY "Admins can read own info"
  ON public.admin_users
  FOR SELECT
  USING (auth.uid() = user_id);
```

### 3.2 Supabase Edge Functions (선택적)

관리자 승인/거부 로직을 Edge Function으로 구현하여 추가 검증 로직을 추가할 수 있습니다.

```typescript
// supabase/functions/approve-entry/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { entry_id, action } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser(
    req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
  )

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 승인/거부 처리
  const updateData = action === 'approve'
    ? { status: 'approved', approved_at: new Date().toISOString() }
    : { status: 'rejected', rejected_at: new Date().toISOString() }

  const { data, error } = await supabase
    .from('guestbook_entries')
    .update(updateData)
    .eq('id', entry_id)
    .select()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 4. UI/UX 설계

### 4.1 레이아웃 구조

#### 방명록 목록 페이지 (`/guestbook`)
```
┌─────────────────────────────────────────┐
│         Header (ShellLayout)            │
├─────────────────────────────────────────┤
│                                         │
│  📝 방명록 작성 폼                       │
│  ┌───────────────────────────────────┐  │
│  │ 닉네임: [________]  (최대 20자)  │  │
│  │                                   │  │
│  │ 프로필: 🐱 🐶 🐰 🐹 🦊 🐻        │  │
│  │         (12개 선택, 기본 랜덤)    │  │
│  │                                   │  │
│  │ 메시지: [___________________]    │  │
│  │        (최대 280자, 3줄)         │  │
│  │                                   │  │
│  │              [작성하기 버튼]       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  📋 방명록 목록 (무한 스크롤)            │
│  ┌───────────────────────────────────┐  │
│  │ 🐱 고양이                          │  │
│  │    안녕하세요! 멋진 사이트네요.    │  │
│  │    2025-12-03 14:30               │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 🐶 강아지                          │  │
│  │    좋은 정보 감사합니다!           │  │
│  │    2025-12-03 13:45               │  │
│  └───────────────────────────────────┘  │
│  ...                                    │
│  [로딩 중...]                           │
│                                         │
└─────────────────────────────────────────┘
```

#### 관리자 페이지 (`/guestbook/admin`)
```
┌─────────────────────────────────────────┐
│         Header (ShellLayout)            │
├─────────────────────────────────────────┤
│  🔐 관리자 페이지                        │
│                                         │
│  📊 대시보드                             │
│  ┌──────────┬──────────┬──────────┐    │
│  │ 승인 대기 │  승인 완료 │  거부됨  │    │
│  │    12    │    145    │    8     │    │
│  └──────────┴──────────┴──────────┘    │
│                                         │
│  ⏳ 승인 대기 중 (12개)                  │
│  ┌───────────────────────────────────┐  │
│  │ 🐱 고양이                          │  │
│  │    테스트 메시지입니다.            │  │
│  │    2025-12-03 15:00               │  │
│  │    [✅ 승인] [❌ 거부]            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 🦊 여우                            │  │
│  │    안녕하세요!                     │  │
│  │    2025-12-03 14:55               │  │
│  │    [✅ 승인] [❌ 거부]            │  │
│  └───────────────────────────────────┘  │
│  ...                                    │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 컴포넌트 설계

#### GuestbookCard.vue
- **Props**: `entry: GuestbookEntry`
- **레이아웃**:
  - 프로필 이미지 (왼쪽 상단, 48x48px)
  - 닉네임 (볼드, 16px)
  - 메시지 (14px, 최대 3줄)
  - 작성 시간 (12px, 회색)
- **반응형**:
  - 모바일: 전체 너비
  - 태블릿: 2열 그리드
  - 데스크톱: 3열 그리드

#### GuestbookForm.vue
- **Props**: 없음
- **State**:
  - `nickname: string`
  - `selectedProfile: ProfileImage`
  - `message: string`
- **Validation**:
  - 닉네임: 1-20자, 필수
  - 메시지: 1-280자, 필수
  - 프로필: 12개 중 선택 (기본 랜덤)
- **Submit**: Supabase API 호출, 성공 시 폼 초기화

#### ProfileSelector.vue
- **Props**: `modelValue: ProfileImage`
- **Emits**: `update:modelValue`
- **레이아웃**:
  - 12개 프로필 이미지 그리드 (3x4 또는 4x3)
  - 선택된 프로필에 테두리 표시
  - 호버 시 스케일 애니메이션

### 4.3 다크모드 지원
- Tailwind CSS `dark:` 클래스 사용
- 블로그 앱과 동일한 다크모드 시스템 적용
- `class="dark"` 토글로 전환

---

## 5. API 설계

### 5.1 Supabase API 활용

#### supabase 초기화 in Vue3
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

```

#### 방명록 목록 조회 (공개된 메시지만)
```typescript
// GET /guestbook (승인된 메시지만)
async function fetchGuestbookEntries(page: number, limit: number) {
  const { data, error, count } = await supabase
    .from('guestbook_entries')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order('approved_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (error) throw error

  return {
    entries: data,
    total: count,
    hasMore: count > (page + 1) * limit
  }
}
```

#### 방명록 작성
```typescript
// POST /guestbook
async function createGuestbookEntry(formData: GuestbookFormData) {
  const { data, error } = await supabase
    .from('guestbook_entries')
    .insert({
      nickname: formData.nickname,
      profile_image: formData.profile_image,
      message: formData.message,
      status: 'pending' // 기본값: 승인 대기
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

#### 관리자: 모든 메시지 조회
```typescript
// GET /guestbook/admin
async function fetchAllEntries(status?: GuestbookStatus) {
  let query = supabase
    .from('guestbook_entries')
    .select('*')

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data
}
```

#### 관리자: 승인/거부
```typescript
// PATCH /guestbook/:id
async function updateEntryStatus(entryId: string, action: 'approve' | 'reject') {
  const updateData = action === 'approve'
    ? {
        status: 'approved',
        approved_at: new Date().toISOString()
      }
    : {
        status: 'rejected',
        rejected_at: new Date().toISOString()
      }

  const { data, error } = await supabase
    .from('guestbook_entries')
    .update(updateData)
    .eq('id', entryId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### 5.2 에러 처리

```typescript
// apps/guestbook/src/utils/errors.ts

export class GuestbookError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'GuestbookError'
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
} as const

export function handleSupabaseError(error: unknown): GuestbookError {
  if (error instanceof Error) {
    // Supabase 에러 코드에 따라 분류
    if (error.message.includes('JWT')) {
      return new GuestbookError(
        ERROR_CODES.UNAUTHORIZED,
        '인증이 필요합니다.',
        error
      )
    }
    // ... 기타 에러 처리
  }

  return new GuestbookError(
    ERROR_CODES.SERVER_ERROR,
    '알 수 없는 오류가 발생했습니다.',
    error
  )
}
```

---

## 6. 화면 구조

### 6.1 라우터 설정

#### Shell Router (`apps/_shell/src/router.ts`)
```typescript
{
  path: '/guestbook/:pathMatch(.*)*',
  component: () => import('guestbook/GuestbookShell'),
  props: { mode: 'federated', basePath: '/guestbook' },
}
```

#### Guestbook Router (`apps/guestbook/src/router.ts`)
```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'GuestbookList',
    component: GuestbookListPage,
    meta: { title: '방명록' }
  },
  {
    path: '/admin',
    name: 'GuestbookAdmin',
    component: GuestbookAdminPage,
    meta: {
      title: '방명록 관리',
      requiresAuth: true
    },
    beforeEnter: async (to, from, next) => {
      // 관리자 권한 확인
      const { isAdmin } = useAuth()
      if (await isAdmin()) {
        next()
      } else {
        next('/')
      }
    }
  }
]
```

### 6.2 Navigation Guard

```typescript
// apps/guestbook/src/router.ts

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { isAuthenticated } = useAuth()
    if (!await isAuthenticated()) {
      // 로그인 페이지로 리다이렉트
      next('/guestbook')
      return
    }
  }
  next()
})
```

---

## 7. 구현 단계 (Phase별)

### Phase 1: 프로젝트 설정 및 기본 구조 (1-2일)

#### 1.1 프로젝트 초기화 (2시간)
- **작업 내용**:
  - `apps/guestbook` 디렉토리 생성
  - `package.json` 설정
  - Vite + Module Federation 설정
  - TypeScript 설정
  - Tailwind CSS 설정
- **선행 조건**: 없음
- **산출물**:
  - `vite.config.ts`
  - `tailwind.config.js`
  - `tsconfig.json`
  - `package.json`
- **검증 방법**: `pnpm --filter guestbook dev` 실행 확인

#### 1.2 Supabase 설정 (2시간)
- **작업 내용**:
  - Supabase 프로젝트 생성
  - 데이터베이스 테이블 생성 (SQL 스크립트 실행)
  - RLS 정책 설정
  - 관리자 계정 생성
  - `.env` 파일 설정
- **선행 조건**: Supabase 계정
- **산출물**:
  - `.env.development`
  - `.env.production`
  - `supabase/schema.sql`
- **검증 방법**: Supabase Dashboard에서 테이블 확인

#### 1.3 타입 정의 및 유틸리티 (1시간)
- **작업 내용**:
  - TypeScript 타입 정의 (`types/guestbook.ts`)
  - Supabase 클라이언트 초기화 (`utils/supabase.ts`)
  - 입력 검증 유틸리티 (`utils/validation.ts`)
- **선행 조건**: Phase 1.2 완료
- **산출물**:
  - `src/types/guestbook.ts`
  - `src/utils/supabase.ts`
  - `src/utils/validation.ts`
- **검증 방법**: TypeScript 컴파일 확인

#### 1.4 프로필 이미지 준비 (1시간)
- **작업 내용**:
  - 무료 귀여운 동물 이미지 12개 수집 (예: Unsplash, Pexels, Flaticon)
  - 이미지 최적화 (WebP, 128x128px)
  - `assets/profiles/` 디렉토리에 저장
- **선행 조건**: 없음
- **산출물**: `src/assets/profiles/*.webp` (12개)
- **검증 방법**: 이미지 파일 확인

### Phase 2: 방명록 목록 및 작성 기능 (2-3일)

#### 2.1 Composables 구현 (3시간)
- **작업 내용**:
  - `useGuestbook.ts`: 방명록 CRUD 로직
  - `useInfiniteScroll.ts`: 무한 스크롤 로직
  - `useAuth.ts`: Supabase 인증 로직
- **선행 조건**: Phase 1 완료
- **산출물**:
  - `src/composables/useGuestbook.ts`
  - `src/composables/useInfiniteScroll.ts`
  - `src/composables/useAuth.ts`
- **검증 방법**: 단위 테스트 작성 및 실행

#### 2.2 ProfileSelector 컴포넌트 (2시간)
- **작업 내용**:
  - 12개 프로필 이미지 그리드 렌더링
  - 선택 상태 관리 (v-model)
  - 호버 애니메이션
  - 반응형 레이아웃
- **선행 조건**: Phase 1.4 완료
- **산출물**: `src/components/ProfileSelector.vue`
- **검증 방법**: Storybook 또는 수동 테스트

#### 2.3 GuestbookForm 컴포넌트 (3시간)
- **작업 내용**:
  - 닉네임 입력 필드
  - ProfileSelector 통합
  - 메시지 텍스트 영역 (280자 제한)
  - 폼 검증
  - Submit 핸들러 (Supabase API 호출)
  - 로딩 및 에러 상태 처리
- **선행 조건**: Phase 2.1, 2.2 완료
- **산출물**: `src/components/GuestbookForm.vue`
- **검증 방법**:
  - 작성 폼 제출 후 Supabase에서 데이터 확인
  - 검증 오류 케이스 테스트

#### 2.4 GuestbookCard 컴포넌트 (2시간)
- **작업 내용**:
  - 프로필 이미지 렌더링
  - 닉네임, 메시지, 작성 시간 표시
  - 반응형 카드 레이아웃
  - 다크모드 스타일
- **선행 조건**: Phase 1.4 완료
- **산출물**: `src/components/GuestbookCard.vue`
- **검증 방법**: Storybook 또는 수동 테스트

#### 2.5 InfiniteScroll 컴포넌트 (2시간)
- **작업 내용**:
  - Intersection Observer API 활용
  - 스크롤 하단 감지
  - 로딩 스피너 표시
  - 에러 처리
- **선행 조건**: Phase 2.1 완료
- **산출물**: `src/components/InfiniteScroll.vue`
- **검증 방법**: 무한 스크롤 동작 확인

#### 2.6 GuestbookListPage 구현 (3시간)
- **작업 내용**:
  - GuestbookForm 통합
  - GuestbookCard 목록 렌더링
  - InfiniteScroll 통합
  - 상태 관리 (로딩, 에러, 빈 상태)
  - 반응형 그리드 레이아웃
- **선행 조건**: Phase 2.1-2.5 완료
- **산출물**: `src/pages/GuestbookListPage.vue`
- **검증 방법**:
  - 목록 페이지 렌더링 확인
  - 무한 스크롤 동작 확인
  - 작성 후 목록에 추가되지 않음 확인 (pending 상태)

### Phase 3: 관리자 페이지 (2일)

#### 3.1 관리자 인증 구현 (3시간)
- **작업 내용**:
  - Supabase Auth 통합
  - 로그인 폼 컴포넌트
  - 관리자 권한 확인 로직
  - Navigation Guard 설정
- **선행 조건**: Phase 2.1 완료
- **산출물**:
  - `src/composables/useAuth.ts` (확장)
  - `src/components/LoginForm.vue`
- **검증 방법**:
  - 로그인 성공/실패 케이스 확인
  - 비인증 접근 시 리다이렉트 확인

#### 3.2 AdminPanel 컴포넌트 (3시간)
- **작업 내용**:
  - 승인 대기 메시지 목록
  - 승인/거부 버튼
  - 승인/거부 API 호출
  - 낙관적 업데이트 (Optimistic Update)
  - 에러 처리
- **선행 조건**: Phase 3.1 완료
- **산출물**: `src/components/AdminPanel.vue`
- **검증 방법**:
  - 승인 버튼 클릭 시 목록에서 제거 확인
  - 거부 버튼 클릭 시 목록에서 제거 확인

#### 3.3 GuestbookAdminPage 구현 (3시간)
- **작업 내용**:
  - 대시보드 통계 (승인 대기, 승인 완료, 거부됨 개수)
  - AdminPanel 통합
  - 필터링 (상태별)
  - 검색 기능 (선택적)
- **선행 조건**: Phase 3.1, 3.2 완료
- **산출물**: `src/pages/GuestbookAdminPage.vue`
- **검증 방법**:
  - 관리자 페이지 접근 확인
  - 대시보드 통계 정확성 확인
  - 승인/거부 후 통계 업데이트 확인

### Phase 4: Module Federation 통합 (1일)

#### 4.1 GuestbookShell 구현 (2시간)
- **작업 내용**:
  - Bootstrap 로직 구현
  - Federated 모드 지원
  - 라우터 통합
- **선행 조건**: Phase 2, 3 완료
- **산출물**:
  - `src/GuestbookShell.vue`
  - `src/bootstrap.ts`
- **검증 방법**: Standalone 모드 실행 확인

#### 4.2 Shell Router 통합 (1시간)
- **작업 내용**:
  - `apps/_shell/src/router.ts`에 `/guestbook` 라우트 추가
  - `apps/_shell/vite.config.ts`에 `guestbook` remote 추가
- **선행 조건**: Phase 4.1 완료
- **산출물**:
  - `apps/_shell/src/router.ts` (수정)
  - `apps/_shell/vite.config.ts` (수정)
- **검증 방법**: Shell에서 `/guestbook` 접근 확인

#### 4.3 환경변수 및 빌드 설정 (1시간)
- **작업 내용**:
  - `.env.development`, `.env.production` 설정
  - `turbo.json`에 `guestbook` 앱 추가
  - `package.json`에 `dev:guestbook` 스크립트 추가
  - `dev:all` 스크립트에 `guestbook` 추가
- **선행 조건**: Phase 4.2 완료
- **산출물**:
  - `.env.development`, `.env.production`
  - `turbo.json` (수정)
  - `package.json` (수정)
- **검증 방법**: `pnpm dev:all` 실행 확인

### Phase 5: 테스트 및 최적화 (2일)

#### 5.1 단위 테스트 작성 (4시간)
- **작업 내용**:
  - Composables 테스트
  - 컴포넌트 테스트 (Vue Test Utils)
  - 유틸리티 함수 테스트
- **선행 조건**: Phase 1-4 완료
- **산출물**: `src/**/__tests__/*.spec.ts`
- **검증 방법**: `pnpm --filter guestbook test` 실행, 커버리지 80% 이상

#### 5.2 E2E 테스트 (선택적) (3시간)
- **작업 내용**:
  - Playwright 설정
  - 방명록 작성 시나리오
  - 관리자 승인 시나리오
- **선행 조건**: Phase 5.1 완료
- **산출물**: `e2e/**/*.spec.ts`
- **검증 방법**: E2E 테스트 통과

#### 5.3 성능 최적화 (2시간)
- **작업 내용**:
  - 이미지 lazy loading
  - 컴포넌트 코드 스플리팅
  - Supabase 쿼리 최적화
  - 번들 크기 분석
- **선행 조건**: Phase 1-4 완료
- **산출물**: 최적화된 빌드
- **검증 방법**:
  - Lighthouse 점수 90점 이상
  - 번들 크기 < 200KB (gzipped)

#### 5.4 접근성 개선 (1시간)
- **작업 내용**:
  - ARIA 속성 추가
  - 키보드 네비게이션 지원
  - 스크린 리더 지원
- **선행 조건**: Phase 1-4 완료
- **산출물**: 접근성 개선된 컴포넌트
- **검증 방법**:
  - axe-core 검사 통과
  - 키보드만으로 모든 기능 사용 가능

### Phase 6: 배포 및 문서화 (1일)

#### 6.1 배포 설정 (2시간)
- **작업 내용**:
  - 배포 환경변수 설정
  - Cloudflare Pages 또는 Vercel 설정
  - Supabase Production 설정
- **선행 조건**: Phase 1-5 완료
- **산출물**: 배포된 앱
- **검증 방법**: Production URL 접근 확인

#### 6.2 문서화 (2시간)
- **작업 내용**:
  - README.md 작성
  - API 문서 작성
  - 관리자 가이드 작성
- **선행 조건**: Phase 1-6.1 완료
- **산출물**:
  - `apps/guestbook/README.md`
  - `.claude/CLAUDE.md` 업데이트
- **검증 방법**: 문서 검토

---

## 8. 보안 고려사항

### 8.1 입력 검증
- **클라이언트 측**:
  - 닉네임: 1-20자, XSS 방지 (HTML 이스케이프)
  - 메시지: 1-280자, XSS 방지
  - 프로필 이미지: 12개 정의된 값만 허용
- **서버 측 (Supabase)**:
  - RLS 정책으로 권한 제어
  - SQL CHECK 제약으로 데이터 무결성 보장

### 8.2 인증 및 권한
- **관리자 인증**:
  - Supabase Auth JWT 토큰 사용
  - HttpOnly 쿠키로 토큰 저장 (XSS 방지)
  - CSRF 토큰 (선택적)
- **권한 관리**:
  - `admin_users` 테이블로 관리자 권한 관리
  - RLS 정책으로 관리자만 모든 메시지 조회/수정 가능

### 8.3 Rate Limiting
- **Supabase Edge Functions**:
  - 작성: 1분당 5회 제한 (IP 기반)
  - 조회: 1분당 60회 제한
- **구현 방법**:
  - Supabase Edge Functions에서 Redis 또는 Upstash 사용
  - 또는 클라이언트 측 throttling (임시)

### 8.4 스팸 방지
- **작성 시간 제한**:
  - 같은 IP에서 1분 이내 재작성 불가
  - 쿠키/localStorage로 추적
- **내용 필터링**:
  - 욕설 필터링 (선택적, 라이브러리 사용)
  - URL 패턴 감지 (스팸 링크 방지)
- **관리자 승인**:
  - 모든 메시지는 관리자 승인 후 공개

### 8.5 개인정보 보호
- **최소 정보 수집**:
  - 닉네임만 수집 (이메일, 전화번호 등 수집 안 함)
- **익명성 보장**:
  - IP 주소 저장 안 함 (선택적, 스팸 방지 목적으로만 사용)
- **데이터 보관 기간**:
  - 거부된 메시지는 30일 후 자동 삭제 (선택적)

---

## 9. 테스트 계획

### 9.1 단위 테스트

#### Composables
```typescript
// src/composables/__tests__/useGuestbook.spec.ts

describe('useGuestbook', () => {
  it('should fetch approved entries', async () => {
    const { entries, fetchEntries } = useGuestbook()
    await fetchEntries(0, 30)
    expect(entries.value.length).toBeGreaterThan(0)
    expect(entries.value.every(e => e.status === 'approved')).toBe(true)
  })

  it('should create entry with pending status', async () => {
    const { createEntry } = useGuestbook()
    const entry = await createEntry({
      nickname: 'Test',
      profile_image: 'cat',
      message: 'Test message'
    })
    expect(entry.status).toBe('pending')
  })
})
```

#### Components
```typescript
// src/components/__tests__/GuestbookForm.spec.ts

describe('GuestbookForm', () => {
  it('should validate nickname length', async () => {
    const wrapper = mount(GuestbookForm)
    const input = wrapper.find('input[name="nickname"]')
    await input.setValue('a'.repeat(21)) // 21자
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('닉네임은 20자 이하')
  })

  it('should submit with valid data', async () => {
    const wrapper = mount(GuestbookForm)
    await wrapper.find('input[name="nickname"]').setValue('Test')
    await wrapper.find('textarea[name="message"]').setValue('Hello')
    await wrapper.find('form').trigger('submit')
    // expect submit to be called
  })
})
```

### 9.2 통합 테스트

#### Supabase API
```typescript
// src/utils/__tests__/supabase.spec.ts

describe('Supabase API', () => {
  it('should fetch entries with pagination', async () => {
    const result = await fetchGuestbookEntries(0, 10)
    expect(result.entries).toHaveLength(10)
    expect(result.hasMore).toBeDefined()
  })

  it('should enforce RLS for admin actions', async () => {
    // 비인증 사용자는 승인/거부 불가
    await expect(
      updateEntryStatus('some-id', 'approve')
    ).rejects.toThrow('Unauthorized')
  })
})
```

### 9.3 E2E 테스트 (선택적)

```typescript
// e2e/guestbook.spec.ts (Playwright)

test.describe('Guestbook', () => {
  test('should submit guestbook entry', async ({ page }) => {
    await page.goto('/guestbook')

    await page.fill('input[name="nickname"]', 'E2E Test')
    await page.click('[data-profile="cat"]')
    await page.fill('textarea[name="message"]', 'E2E test message')
    await page.click('button[type="submit"]')

    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('admin should approve entry', async ({ page }) => {
    // 관리자 로그인
    await page.goto('/guestbook/admin')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')

    // 첫 번째 승인 대기 메시지 승인
    await page.click('.pending-entry:first-child button.approve')
    await expect(page.locator('.success-message')).toBeVisible()
  })
})
```

### 9.4 성능 테스트

#### Lighthouse 기준
- **Performance**: 90점 이상
- **Accessibility**: 95점 이상
- **Best Practices**: 95점 이상
- **SEO**: 90점 이상

#### 로딩 시간
- **초기 로드**: < 1초
- **무한 스크롤 추가 로드**: < 500ms
- **작성 폼 제출**: < 500ms

---

## 10. 향후 확장 가능성

### 10.1 기능 확장

#### 이모지 반응 (Like/Love)
- 각 메시지에 이모지 반응 추가
- Supabase Realtime으로 실시간 업데이트
- 중복 방지 (IP 기반 또는 쿠키)

#### 댓글 기능
- 방명록 메시지에 댓글 스레드 추가
- 깊이 제한 (1단계만)
- 댓글도 승인 프로세스 적용

#### 검색 및 필터
- 닉네임 검색
- 프로필 이미지별 필터
- 날짜 범위 필터

#### 통계 대시보드
- 일일 작성 수 그래프
- 인기 프로필 이미지 통계
- 승인률 통계

### 10.2 기술 개선

#### Realtime 업데이트
- Supabase Realtime 활용
- 새로운 메시지 자동 추가 (WebSocket)
- 관리자 페이지에서 실시간 알림

#### 이미지 최적화
- WebP 포맷 사용
- Lazy loading
- Cloudflare R2 또는 Cloudinary 통합

#### 캐싱
- Supabase Query Cache
- React Query 또는 Vue Query 활용
- CDN 캐싱 (정적 자산)

### 10.3 국제화 (i18n)
- Vue I18n 통합
- 영어/한국어 지원
- 날짜 포맷 로케일별 변경

---

## 11. 프로필 이미지 소스 추천

무료 귀여운 동물 이미지를 제공하는 사이트:

### 11.1 참고 일러스트 사이트
- **Flaticon** (https://www.flaticon.com/)
  - 검색어: "animals"
  - 라이센스: Free (attribution required)
  - 추천 팩: "Anmals|Flat"


### 11.4 추천 프로필 목록 (30개)
1. pig : https://images.jeongwoo.in/profiles/pig.png
2. mouse : https://images.jeongwoo.in/profiles/mouse.png
3. sheep : https://images.jeongwoo.in/profiles/sheep.png
4. hippo : https://images.jeongwoo.in/profiles/hippo.png
5. clown-fish : https://images.jeongwoo.in/profiles/clown-fish.png
6. walrus : https://images.jeongwoo.in/profiles/walrus.png
7. lion : https://images.jeongwoo.in/profiles/lion.png
8. parrot : https://images.jeongwoo.in/profiles/parrot.png
9. owl : https://images.jeongwoo.in/profiles/owl.png
10. bullfinch : https://images.jeongwoo.in/profiles/bullfinch.png
11. crab : https://images.jeongwoo.in/profiles/crab.png
12. panda : https://images.jeongwoo.in/profiles/panda.png
13. whale : https://images.jeongwoo.in/profiles/whale.png
14. ladybug : https://images.jeongwoo.in/profiles/ladybug.png
15. frog : https://images.jeongwoo.in/profiles/frog.png
16. giraffe : https://images.jeongwoo.in/profiles/giraffe.png
17. beetle : https://images.jeongwoo.in/profiles/beetle.png
18. snake : https://images.jeongwoo.in/profiles/snake.png
19. chicken : https://images.jeongwoo.in/profiles/chicken.png
20. spider : https://images.jeongwoo.in/profiles/spider.png
21. penguin : https://images.jeongwoo.in/profiles/penguin.png
22. rabbit : https://images.jeongwoo.in/profiles/rabbit.png
23. lama : https://images.jeongwoo.in/profiles/lama.png
24. fox : https://images.jeongwoo.in/profiles/fox.png
25. flamingo : https://images.jeongwoo.in/profiles/flamingo.png
26. rhino : https://images.jeongwoo.in/profiles/rhino.png
27. dog : https://images.jeongwoo.in/profiles/dog.png
28. beaver : https://images.jeongwoo.in/profiles/beaver.png
29. gorilla : https://images.jeongwoo.in/profiles/gorilla.png
30. zebra : https://images.jeongwoo.in/profiles/zebra.png

---

## 12. 체크리스트

### 개발 전 확인사항
- [ ] Supabase 프로젝트 생성 완료
- [ ] 관리자 계정 설정 완료
- [ ] 프로필 이미지 30개 준비 완료
- [ ] 프로젝트 구조 확인 완료

### Phase 1 완료 조건
- [ ] `pnpm --filter guestbook dev` 실행 성공
- [ ] TypeScript 컴파일 에러 없음
- [ ] Tailwind CSS 적용 확인
- [ ] Supabase 테이블 생성 완료

### Phase 2 완료 조건
- [ ] 방명록 목록 페이지 렌더링
- [ ] 작성 폼 동작 확인
- [ ] Supabase에 데이터 저장 확인
- [ ] 무한 스크롤 동작 확인

### Phase 3 완료 조건
- [ ] 관리자 로그인 동작
- [ ] 승인 대기 목록 표시
- [ ] 승인/거부 기능 동작
- [ ] 승인된 메시지만 목록에 표시

### Phase 4 완료 조건
- [ ] Shell에서 `/guestbook` 접근 가능
- [ ] `pnpm dev:all`로 모든 앱 실행
- [ ] Federation 동작 확인

### Phase 5 완료 조건
- [ ] 단위 테스트 커버리지 80% 이상
- [ ] Lighthouse 점수 90점 이상
- [ ] 접근성 검사 통과

### Phase 6 완료 조건
- [ ] Production 배포 완료
- [ ] 문서화 완료
- [ ] `.claude/CLAUDE.md` 업데이트

---

**최종 업데이트**: 2025-12-03
**작성자**: Claude Code (Feature Specification Architect)
