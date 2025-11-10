# Blog Writer Setup Guide

blog-writer 에이전트를 사용하여 블로그 글을 작성하고 이미지를 R2에 업로드하는 가이드입니다.

## 설정

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Cloudflare R2 Configuration
R2_ENDPOINT=https://bf34de8e27727475cf0b7f8dbf6f35a5.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id-here
R2_SECRET_ACCESS_KEY=your-secret-access-key-here
R2_BUCKET_NAME=blog-images
R2_PUBLIC_URL=https://your-public-r2-domain.com
```

**주의**: `.env` 파일은 `.gitignore`에 추가되어 있는지 확인하세요.

### 2. 의존성 설치

```bash
pnpm install
```

이 명령어는 다음 패키지를 설치합니다:
- `@aws-sdk/client-s3`: Cloudflare R2 업로드용 (S3 호환 API)
- `tsx`: TypeScript 스크립트 실행용

### 3. 설정 확인

```bash
# 환경변수가 제대로 로드되는지 확인
node -e "console.log(process.env.R2_ENDPOINT)"
```

## 사용 방법

### 1. Blog Writer 에이전트 활성화

Claude Code에서 다음 명령어를 실행하세요:

```
/blog-writer
```

또는 자연스럽게 요청하세요:

```
블로그 글 써줘: JavaScript Set 객체 활용하기
독서 리뷰 써줘: 팀 토폴로지
회고 글 써줘
```

### 2. 글 작성 프로세스

1. **주제 확정**: 어떤 글을 쓸지 논의
2. **카테고리 선택**: 기술/팀운영/독서/회고/취미 중 선택
3. **이미지 컨셉**: 은유적 이미지 아이디어 논의
4. **이미지 생성**: Claude가 16:9 비율 이미지 생성
5. **R2 업로드**: 이미지를 Cloudflare R2에 업로드
6. **글 작성**: 이미지 URL이 포함된 마크다운 글 작성

### 3. 이미지 업로드

생성된 이미지를 R2에 업로드하려면:

```bash
# 기본 사용법
pnpm upload:image /path/to/image.png

# 커스텀 파일명 지정
pnpm upload:image /path/to/image.png blog-20251110-javascript-set-thumbnail.png
```

성공하면 다음과 같은 출력이 나타납니다:

```
📤 업로드 시작: blog-20251110-javascript-set-thumbnail.png
   경로: blog/blog-20251110-javascript-set-thumbnail.png
   Content-Type: image/png
✅ 업로드 성공!
   URL: https://your-public-r2-domain.com/blog/blog-20251110-javascript-set-thumbnail.png

🎉 이미지가 성공적으로 업로드되었습니다!
📋 마크다운에 삽입:
   ![이미지](https://your-public-r2-domain.com/blog/blog-20251110-javascript-set-thumbnail.png)
```

### 4. 마크다운에 이미지 삽입

업로드된 URL을 복사하여 마크다운에 삽입하세요:

```markdown
# JavaScript Set 객체, 제대로 활용하기

![썸네일](https://your-r2-url.com/blog/blog-20251110-javascript-set-thumbnail.png)

## 들어가며

...
```

## 이미지 가이드라인

### 파일명 규칙

```
blog-YYYYMMDD-{slug}-{type}.{ext}

예시:
- blog-20251110-javascript-set-thumbnail.png
- blog-20251110-javascript-set-image1.png
- blog-20251110-team-interview-thumbnail.png
```

### 이미지 사양

- **비율**: 16:9 (1920x1080 또는 1280x720)
- **수량**: 썸네일 1장 + 본문 이미지 1-2장
- **스타일**: 은유적, 미니멀, 감각적

### 은유적 표현 예시

| 주제 | ❌ 직접 표현 | ✅ 은유적 표현 |
|------|-------------|----------------|
| JavaScript 번들링 | 코드 화면 | 묶음 포장된 물건들 |
| 팀 협업 | 회의실 사진 | 퍼즐 조각 맞추기 |
| 독서 | 책 표지 | 창가의 책과 커피 |
| 성능 최적화 | 그래프 | 정리된 작업대 |
| 캠핑 | 텐트 | 별이 보이는 밤하늘 |
| 커피 | 원두 | 김이 오르는 커피 잔 |

## 글 카테고리 및 구조

### 1. 기술 리뷰 (Tech)

**주제 예시**: JavaScript 기능, 프레임워크, 성능 최적화

**구조**:
- 들어가며 (왜 이 주제를?)
- 본문 (개념 + 실용 예제 + 실무 사례)
- 마치며 (핵심 정리)

**예시 제목**:
- "JavaScript Set 객체 활용하기"
- "Vue3 Composition API, 실무에서 어떻게 쓸까?"

### 2. 팀 운영 & 문화 (Team)

**주제 예시**: 면접, 코드 리뷰, 1-on-1

**구조**:
- 상황 (어떤 상황?)
- 고민 과정 (시도와 실패)
- 현재 관점 (지금 생각)
- 질문 (독자에게 던지는 질문)

**예시 제목**:
- "면접은 누구를 위한 것인가"
- "코드 리뷰, 어디까지 해야 할까?"

### 3. 독서 리뷰 (Book)

**주제 예시**: 경영서, 자기계발서, 소설

**구조**:
- 선택 이유
- 인상 깊은 부분 (2-3가지)
- 적용 방법
- 추천

**예시 제목**:
- "『에이트』를 읽고: 관계에 대한 생각"

### 4. 회고 (Retrospective)

**주제 예시**: 연간/프로젝트/학습 회고

**구조**:
- 숫자로 보기
- Keep (계속할 것)
- Problem (개선할 것)
- Insight (배운 것)
- 다음 목표

### 5. 취미 & 일상 (Hobby)

**주제 예시**: 캠핑, 드로잉, 커피

**구조**:
- 이야기 (경험 묘사)
- 개발과의 연결고리
- 나가며

## 작성 스타일

### 톤 & 매너

- ✅ 친근하면서도 전문적
- ✅ 겸손하고 성찰적 ("내가 옳다"보다 "이런 고민을 했다")
- ✅ 경험 기반 (추상 이론 ❌, 실제 사례 ✅)
- ✅ 질문 던지기 (독자에게 생각거리 제공)

### 문체

- 짧은 단락 (3-5문장)
- 명확한 소제목
- 이모지 적절하게 (섹션당 0-1개)
- 코드 예제 중심 (기술 글)

### 이모지 사용 예시

- 기술: 💡 🔧 ⚡ 🎯
- 팀: 👥 🤝 📈 🎯
- 독서: 📚 💭 ✨
- 취미: 🏕️ 🎨 ☕

## 품질 체크리스트

### 내용
- [ ] 실제 경험이나 구체적 예시 포함
- [ ] 독자에게 실용적 가치 제공
- [ ] 겸손하고 성찰적인 톤 유지
- [ ] 질문이나 생각거리 제공

### 형식
- [ ] 단락이 적절한 길이 (3-5문장)
- [ ] 소제목으로 명확히 구분
- [ ] 이모지가 과도하지 않음
- [ ] 코드 예제 실행 가능 (기술 글)

### 이미지
- [ ] 16:9 비율
- [ ] 은유적 표현
- [ ] 미니멀하고 깔끔
- [ ] R2 업로드 완료 및 URL 삽입

## 트러블슈팅

### 환경변수 오류

```
❌ R2_ENDPOINT 환경변수가 설정되지 않았습니다.
```

**해결**: `.env` 파일에 환경변수를 추가하고, 터미널을 재시작하세요.

### 업로드 권한 오류

```
❌ R2 업로드 실패: AccessDenied
```

**해결**: R2 Access Key와 Secret Key가 올바른지 확인하세요.

### tsx 명령어를 찾을 수 없음

```
❌ command not found: tsx
```

**해결**:
```bash
pnpm install
```

## 참고 자료

- **MODE 파일**: `/Users/jeongwooahn/.claude/MODE_Blog_Writer.md`
- **Slash Command**: `/Users/jeongwooahn/Documents/projects/gongjam-www/.claude/commands/blog-writer.md`
- **업로드 스크립트**: `/Users/jeongwooahn/Documents/projects/gongjam-www/scripts/upload-to-r2.ts`

## 예시

### 전체 워크플로우

```bash
# 1. blog-writer 에이전트 활성화
/blog-writer

# 2. 주제 논의
# "JavaScript Set에 대한 기술 글 써줘"

# 3. Claude가 이미지 생성 (DALL-E 등)
# - thumbnail.png
# - image1.png

# 4. 이미지 R2 업로드
pnpm upload:image thumbnail.png blog-20251110-javascript-set-thumbnail.png
pnpm upload:image image1.png blog-20251110-javascript-set-image1.png

# 5. URL 복사 및 마크다운 작성
# Claude가 URL이 포함된 완성된 마크다운 제공

# 6. 블로그에 포스팅
```

## 도움이 필요하신가요?

- **글쓰기 가이드**: MODE 파일 참조
- **이미지 컨셉**: 은유적 표현 예시 참조
- **기술 지원**: Claude Code에서 `/blog-writer` 실행 후 질문
