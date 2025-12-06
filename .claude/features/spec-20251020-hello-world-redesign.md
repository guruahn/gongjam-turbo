# Hello World 앱 프로필 페이지 디자인 및 레이아웃 구현

## 개발 진행 규칙

> 아래 규칙을 유념해서 진행해줘.

- "코드를 수정해줘" 라고 지시하기 전까지 수정하지 않는다.
- feature에 대해 약간이라도 이해하지 못한 부분이 있으면 그냥 넘어가지 말고 질문을 통해 명확하게 이해하도록 해줘.
- 큰 틀에서 다음의 순서로 진행한다:
  0. feature 이름: **hello-world-redesign**
  1. 현재 프로젝트에 대한 이해 ✅
  2. 추가할 feature에 대한 이해 ✅
  3. feature 추가를 위해 구조 변경이 필요한지 여부 ✅
  4. 대략적인 작업 계획을 순서대로 정리 ✅
  5. 작업 단위는 서로 의존성이 없는 선에서 클로드코드가 한 세션에 해결할 수 있을 정도의 사이즈내로 쪼개기 ✅
  6. feature 추가를 위한 준비가 끝나면 코딩을 시작하기 전에 .claude 폴더에 spec 문서로 남기기 ✅
- spec 문서를 작성 완료했다면 세션을 종료해.

## 추가전 참고문서

- 프로젝트 구조: CLAUDE.md
- 참고 디자인: https://nuxt-tailwind-blog.netlify.app/
- 참고 디자인 스크린샷:
  - Desktop: `.playwright-mcp/claudedocs/reference-site-desktop.png`
  - Mobile: `.playwright-mcp/claudedocs/reference-site-mobile.png`

## 프로젝트 아키텍처 이해

### 마이크로 프론트엔드 구조 (Module Federation)

```
┌─────────────────────────────────────────┐
│  _shell 앱 (Shell Application)          │
│  ┌─────────────────────────────────┐    │
│  │  ShellLayout (from @gongjam/ui) │    │
│  │  ├─ Navigation Bar              │    │
│  │  ├─ <router-view />             │    │
│  │  │   ↓ 동적 로드                 │    │
│  │  │   hello-world 앱 콘텐츠       │    │
│  │  └─ Footer                      │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**실행 방식**:
- `pnpm dev:all`: _shell과 hello-world 앱을 동시에 실행
- _shell 앱이 vue-router로 라우팅 관리
- hello-world 앱은 Module Federation으로 동적 로드

**라우팅**:
- `/`: hello-world 앱
- `/hello`: hello-world 앱 (동일)
- `/home`: hello-world 앱 (추가 필요) ← **이번 작업에서 추가**

## 기능 정의

### 🎯 Feature 정의

**문제**:
1. 현재 hello-world 앱은 단순한 "Hello World" 텍스트와 버튼만 있음
2. ShellLayout이 기본 구조만 있고 네비게이션/푸터 콘텐츠가 없음
3. 다크모드 미구현
4. `/home` 라우트가 없음

**목표**: 참고 사이트(https://nuxt-tailwind-blog.netlify.app/)와 유사한 프로페셔널한 프로필/포트폴리오 페이지로 전환

**주요 기능**:
1. **ShellLayout 완성**: 네비게이션 바 + 푸터 + 다크모드
2. **라우팅 추가**: `/home` 경로 추가 (/, /hello, /home 모두 동일 화면)
3. **프로필 페이지**: hello-world 앱에 프로필 콘텐츠 구현
4. **다크모드**: 전역 테마 전환 기능
5. **반응형 디자인**: 모바일/태블릿/데스크톱 지원

### 🏗️ 기술적 제약사항 및 구조 변경

**현재 상태**:
- ✅ Vue3 + TypeScript + Tailwind CSS 모노레포
- ✅ Module Federation 기반 마이크로 프론트엔드
- ✅ _shell 앱에 vue-router 설치됨
- ✅ packages/ui/src/ShellLayout.vue 기본 구조 존재
- ✅ packages/ui/src/assets/my-face-transparent.png 존재
- ❌ ShellLayout에 네비게이션/푸터 없음
- ❌ 다크모드 미구현
- ❌ `/home` 라우트 없음

**구조 변경 필요성**:
- packages/ui/src/ShellLayout.vue 수정 (네비게이션 + 푸터 추가)
- apps/_shell/src/router.ts에 `/home` 라우트 추가
- apps/_shell/tailwind.config.js에 다크모드 설정 추가
- apps/hello-world/src/App.vue 전면 재구성
- apps/hello-world/tailwind.config.js에 다크모드 설정 추가
- packages/ui/src/index.ts에 이미지 asset export 추가

**기존 코드 영향**:
- ✅ 기존 Button.vue 컴포넌트는 유지
- ✅ _shell의 기존 라우팅 구조는 확장만 함
- ✅ hello-world 앱은 독립적으로 변경 (다른 앱에 영향 없음)

### 📊 우선순위

**필수 구현 항목** (Priority 1):
1. ShellLayout 네비게이션 바 (Hello, Blog, GuestBook 메뉴)
2. ShellLayout 푸터 (소셜 링크, 저작권)
3. `/home` 라우트 추가
4. 프로필 카드 (이름, 이메일, GitHub, 사진)
5. 인사말 섹션
6. 포트폴리오 타임라인
7. 다크모드 토글 기능

**선택 구현 항목** (Priority 2):
- 스크롤 애니메이션 (제외하기로 결정)
- Blog, GuestBook 페이지 (미래 작업)

### 🔄 운영 관련

**테스트 전략**:
- _shell 앱: ShellLayout 테스트 작성 (네비게이션, 다크모드, 푸터)
- hello-world 앱: App.vue 테스트 업데이트
- 통합 테스트: `pnpm dev:all` 실행 확인
- 빌드 검증: `pnpm turbo build`
- 타입 체크: `pnpm turbo type-check`
- 테스트 실행: `pnpm turbo test`

**모니터링**:
- `pnpm dev:all` 실행 후 브라우저에서 확인
- 라우팅 동작: `/`, `/hello`, `/home` 모두 동일 화면
- 다크모드 localStorage 동작 확인
- 반응형 디자인 테스트

**잠재적 리스크**:
- Module Federation 빌드 이슈 → 기존 구조 유지로 완화
- 다크모드 색상 가독성 → 참고 사이트 색상 참조
- 이미지 파일 크기 → 추후 최적화 고려

## 기술적 세부 사항

### 네비게이션 메뉴 구성
- **Hello**: `/hello` (hello-world 앱)
- **Blog**: `/blog` (미구현, 준비 중 표시 또는 비활성화)
- **GuestBook**: `/guestbook` (미구현, 준비 중 표시 또는 비활성화)

### 라우팅 설정 (apps/_shell/src/router.ts)
```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/hello',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/home',  // ← 추가
    component: () => import('helloWorld/App'),
  },
  // 미래: /blog, /guestbook
];
```

### 개인 정보
- 이름: **Jeongwoo Ahn**
- 이메일: **guruahn@gmail.com**
- GitHub: **https://github.com/guruahn**
- 프로필 이미지: `packages/ui/src/assets/my-face-transparent.png`
- 직함: Full Stack Developer (더미)
- 위치: Seoul, South Korea (더미)

### 포트폴리오 구조
각 포트폴리오 항목:
- **제목**: 프로젝트 또는 경력 이름 (링크 가능)
- **기간**: YYYY-MM ~ YYYY-MM
- **설명**: 2-3줄 설명
- **기술 스택**: 사용 기술 목록 (선택적)

더미 데이터 예시 (3-5개):
1. Senior Software Engineer at Tech Company (2020-현재)
2. Full Stack Developer at Startup (2018-2020)
3. Personal Project: Open Source Contribution
4. Education: Computer Science Degree

### 반응형 디자인 브레이크포인트
- **Mobile**: < 768px (1열 레이아웃)
- **Tablet**: 768px ~ 1024px (1열 레이아웃)
- **Desktop**: > 1024px (2열 레이아웃: 왼쪽 프로필 카드 + 오른쪽 메인 콘텐츠)

### 다크모드 구현 방식
- Tailwind CSS `dark:` 클래스 사용
- `tailwind.config.js`에 `darkMode: 'class'` 설정
- ShellLayout에서 최상위 div에 `dark` 클래스 토글
- localStorage에 테마 저장 (`theme: 'light' | 'dark'`)
- 초기 로드 시 localStorage 또는 시스템 선호도 확인

### 색상 팔레트 (참고 사이트 기반)
- **Light Mode**:
  - Background: white, gray-50, gray-100
  - Text: gray-800, gray-900
  - Accent: blue-500, blue-600
- **Dark Mode**:
  - Background: gray-800, gray-900, black
  - Text: gray-100, gray-200, white
  - Accent: blue-400, blue-500

## 기술적 제한사항

### 필수 준수 사항
- ✅ 함수 단위 테스트 작성 (Vitest)
- ✅ 엄격한 TypeScript 적용 (`strict: true`)
- ✅ 기존 Button 컴포넌트에 영향 없음
- ✅ Module Federation 구조 유지
- ✅ 모든 변경사항은 CLAUDE.md 문서에 업데이트
- ✅ `pnpm turbo build`, `type-check`, `test` 모두 통과
- ✅ `pnpm dev:all` 실행 시 정상 동작

### 코드 품질 기준
- ESLint + Prettier 규칙 준수
- Vue3 Composition API 사용 (`<script setup lang="ts">`)
- Props 및 Emits 타입 정의
- 접근성 고려 (semantic HTML, ARIA labels)

## 작업 계획 및 순서

### 세션 1: ShellLayout 완성 및 _shell 앱 라우팅 업데이트

**목표**: ShellLayout에 네비게이션/푸터 추가 및 _shell 앱 라우팅 확장

**작업 내용**:

1. **packages/ui/src/index.ts 수정**
   - 이미지 asset export 추가
   - `export { default as MyFaceImage } from './assets/my-face-transparent.png'` 확인
   - 또는 Vite의 `?url` import 방식 사용

2. **packages/ui/vite.config.ts 검토**
   - assets 폴더가 빌드에 포함되는지 확인
   - 필요시 `assetsInclude` 설정 추가

3. **packages/ui/src/ShellLayout.vue 전면 구현**
   - **네비게이션 바**:
     * 로고 영역 (좌측): "Jeongwoo Ahn" 텍스트 또는 로고
     * 메뉴 (중앙/우측): Hello, Blog, GuestBook
     * 다크모드 토글 버튼 (우측, moon/sun 아이콘)
     * 모바일: 햄버거 메뉴로 변환
     * router-link 사용 (`to="/hello"`, `to="/blog"`, `to="/guestbook"`)

   - **다크모드 로직**:
     * `ref<boolean>` 상태로 다크모드 추적
     * `onMounted`에서 localStorage 확인 (`theme` 키)
     * 토글 버튼 클릭 시:
       - 최상위 div 또는 body에 `dark` 클래스 추가/제거
       - localStorage에 저장
       - 다른 마이크로 앱에도 적용되도록 body 또는 html 태그에 클래스 토글

   - **푸터**:
     * 소셜 링크 아이콘 (GitHub, LinkedIn, Email)
     * 아이콘은 SVG 또는 이모지 사용
     * 링크: GitHub (https://github.com/guruahn), Email (mailto:guruahn@gmail.com)
     * 저작권 표시: "Copyright © 2025 • Jeongwoo Ahn"
     * 중앙 정렬, 적절한 간격

   - **반응형 디자인**:
     * 모바일: 햄버거 메뉴, 세로 배치
     * 태블릿/데스크톱: 가로 메뉴 바
     * Tailwind breakpoints 사용 (`md:`, `lg:`)

4. **apps/_shell/tailwind.config.js 수정**
   - `darkMode: 'class'` 설정 추가
   - 필요시 커스텀 색상 확장

5. **apps/_shell/src/router.ts 수정**
   - `/home` 라우트 추가:
     ```typescript
     {
       path: '/home',
       component: () => import('helloWorld/App'),
     }
     ```

6. **packages/ui 빌드 및 검증**
   - `pnpm --filter @gongjam/ui build`
   - `pnpm --filter @gongjam/ui type-check`
   - dist 폴더에 ShellLayout 타입 선언 생성 확인

7. **_shell 앱 테스트 작성**
   - `apps/_shell/src/__tests__/ShellLayout.spec.ts` (또는 기존 테스트 업데이트)
   - 네비게이션 메뉴 렌더링 확인
   - 다크모드 토글 동작 테스트
   - 푸터 렌더링 확인
   - router-link 확인

**완료 조건**:
- ✅ ShellLayout에 네비게이션, 푸터, 다크모드 완전 구현
- ✅ `/`, `/hello`, `/home` 라우트 모두 설정됨
- ✅ 다크모드 토글 동작 확인
- ✅ packages/ui 빌드 성공
- ✅ _shell 앱 테스트 통과
- ✅ 참고 사이트와 유사한 디자인

**의존성**: 없음 (독립적인 작업)

---

### 세션 2: hello-world 앱 프로필 페이지 구현

**목표**: hello-world 앱을 프로필 페이지로 전면 재구성

**작업 내용**:

1. **apps/hello-world/tailwind.config.js 수정**
   - `darkMode: 'class'` 설정 추가
   - 필요시 커스텀 색상 확장

2. **apps/hello-world/src/App.vue 전면 재구성**
   - **중요**: ShellLayout을 사용하지 않음 (_shell이 제공)
   - 프로필 페이지 콘텐츠만 구현

   - **레이아웃 구조** (2열 그리드):
     ```vue
     <template>
       <div class="profile-page container mx-auto p-4">
         <div class="grid lg:grid-cols-3 gap-8">
           <!-- 왼쪽: 프로필 카드 (1/3) -->
           <aside class="lg:col-span-1">
             <div class="profile-card">
               <!-- 프로필 내용 -->
             </div>
           </aside>

           <!-- 오른쪽: 메인 콘텐츠 (2/3) -->
           <main class="lg:col-span-2">
             <!-- 인사말, 기술스택, 포트폴리오 -->
           </main>
         </div>
       </div>
     </template>
     ```

   - **왼쪽: 프로필 카드**:
     * 프로필 이미지:
       - `import MyFaceImage from '@gongjam/ui'` (또는 직접 import)
       - 원형, 중앙 정렬, 적절한 크기
     * 이름: "Jeongwoo Ahn" (h1, 볼드, 큰 폰트)
     * 직함: "Full Stack Developer" (부제목, 회색)
     * 정보 목록:
       - 이메일: guruahn@gmail.com (아이콘 + 링크, mailto:)
       - 위치: Seoul, South Korea (아이콘 + 텍스트)
       - GitHub: github.com/guruahn (아이콘 + 링크, https://)
     * 카드 스타일:
       - Light: 흰색 배경, 그림자, 둥근 모서리
       - Dark: 회색 배경 (`bg-gray-800`), 텍스트 흰색

   - **오른쪽: 메인 콘텐츠**:
     * **인사말 섹션**:
       - 제목: "👋 Hola, Good Day!" (h2, 큰 폰트)
       - 내용: Lorem ipsum 더미 텍스트 (2-3 문단)
       - Dark 모드 색상 적용

     * **기술 스택 섹션**:
       - Frontend (h3): Vue, React, TypeScript, Tailwind CSS
       - Backend (h3): Node.js, Python
       - 아이콘 또는 로고 이미지 (간단한 이모지도 가능)
       - 그리드 또는 플렉스 레이아웃

     * **포트폴리오 타임라인**:
       - 제목: "💼 Experience & Portfolio" (h2)
       - 각 항목:
         * 아이콘 (좌측, 원형 배경, 파란색 또는 테마 색상)
         * 제목 (h3, 링크 가능: `<a>` 태그 또는 router-link)
         * 기간 (`<time>` 태그, 작은 텍스트, 회색)
         * 설명 (`<p>` 태그, 2-3줄)
         * 기술 스택 태그 (선택적, 배지 형식: `bg-blue-100 dark:bg-blue-900`)
       - 타임라인 스타일: 참고 사이트와 유사하게 구현
       - 더미 데이터 3-5개 항목

3. **더미 데이터 구조화**
   - TypeScript interface 정의:
     ```typescript
     interface PortfolioItem {
       id: string;
       icon: string; // 이모지 또는 아이콘 클래스
       title: string;
       link?: string;
       period: string;
       description: string;
       tags?: string[];
     }
     ```
   - `ref<PortfolioItem[]>` 또는 const로 더미 데이터 배열 생성
   - 예시 데이터:
     ```typescript
     const portfolio: PortfolioItem[] = [
       {
         id: '1',
         icon: '💼',
         title: 'Senior Software Engineer at FANG',
         link: '#',
         period: '2020 - Currently',
         description: 'Leading full-stack development...',
         tags: ['Vue3', 'TypeScript', 'Node.js'],
       },
       // ... 더 많은 항목
     ];
     ```

4. **스타일링**
   - Tailwind CSS 클래스 전면 사용
   - 다크모드 색상 전체 적용:
     * `dark:bg-gray-900`, `dark:text-white`
     * `dark:bg-gray-800` (카드 배경)
     * `dark:border-gray-700` (테두리)
   - 반응형 그리드: `lg:grid-cols-3`, `md:grid-cols-1`
   - 그림자, 여백, 타이포그래피 세밀하게 조정
   - 참고 사이트의 시각적 계층 구조 참고

5. **로컬 테스트**
   - `pnpm dev:all` 실행
   - 브라우저에서 http://localhost:5173 접속 (_shell 포트)
   - `/`, `/hello`, `/home` 라우트 확인
   - 다크모드 토글 테스트
   - 반응형 디자인 확인 (브라우저 개발자 도구)

**완료 조건**:
- ✅ App.vue가 참고 사이트와 유사한 프로필 페이지 구현
- ✅ 프로필 카드의 모든 정보 표시
- ✅ 포트폴리오 타임라인 3-5개 항목 표시
- ✅ 다크모드 색상 전체 적용
- ✅ 모바일/태블릿/데스크톱 반응형 동작
- ✅ `pnpm dev:all` 실행 시 정상 표시

**의존성**: 세션 1 완료 필요 (ShellLayout 완성 및 @gongjam/ui 빌드)

---

### 세션 3: 테스트 및 검증

**목표**: 전체 시스템 테스트 및 문서 업데이트

**작업 내용**:

1. **_shell 앱 테스트 검증**
   - `apps/_shell/src/__tests__/` 기존 테스트 확인 및 업데이트
   - ShellLayout 렌더링 테스트
   - 라우팅 테스트 (`/`, `/hello`, `/home`)
   - 다크모드 토글 테스트

2. **hello-world 앱 테스트 업데이트**
   - `apps/hello-world/src/__tests__/App.spec.ts` 수정
   - 프로필 정보 렌더링 확인 (이름, 이메일, GitHub)
   - 포트폴리오 항목 렌더링 확인
   - 다크모드 클래스 적용 확인 (선택적)

3. **전체 빌드 검증**
   - `pnpm turbo build`: 모든 패키지 빌드 성공
     * packages/ui
     * apps/_shell
     * apps/hello-world
   - `pnpm turbo type-check`: TypeScript 타입 오류 없음
   - `pnpm turbo test`: 모든 테스트 통과
   - `pnpm turbo lint`: ESLint 오류 없음

4. **통합 테스트 (수동)**
   - `pnpm dev:all` 실행
   - _shell 앱 브라우저 접속 (기본 http://localhost:5173)
   - **라우팅 테스트**:
     * `/` 접속 → hello-world 프로필 페이지 표시
     * `/hello` 접속 → 동일 페이지 표시
     * `/home` 접속 → 동일 페이지 표시
   - **다크모드 테스트**:
     * 토글 버튼 클릭 → 전체 페이지 다크모드 전환
     * localStorage 확인 (개발자 도구)
     * 페이지 새로고침 → 테마 유지 확인
   - **반응형 디자인 테스트**:
     * 모바일 (375px): 1열 레이아웃, 햄버거 메뉴
     * 태블릿 (768px): 1열 레이아웃
     * 데스크톱 (1024px+): 2열 레이아웃
   - **링크 테스트**:
     * 이메일 링크 → mailto: 동작
     * GitHub 링크 → 새 탭에서 열림
     * 네비게이션 메뉴 → 라우팅 동작
   - **시각적 검증**:
     * 참고 사이트와 비교
     * 색상, 간격, 타이포그래피 확인

5. **CLAUDE.md 문서 업데이트**
   - 새로운 Phase 섹션 추가 또는 기존 섹션 업데이트
   - **Phase 4: 프로필 페이지 및 레이아웃 완성** (예시)
   - 완료 항목 체크리스트:
     * ShellLayout 네비게이션/푸터 완성
     * hello-world 프로필 페이지 구현
     * 다크모드 기능 추가
     * `/home` 라우트 추가
     * 반응형 디자인 적용
   - 기술 스택 정보:
     * Module Federation
     * vue-router
     * 다크모드 (localStorage + Tailwind)
   - 실행 방법:
     * `pnpm dev:all`: 전체 앱 개발 서버 실행
     * `pnpm build`: 전체 빌드
   - 스크린샷 또는 미리보기 추가 (선택적)

**완료 조건**:
- ✅ _shell 앱 테스트 통과
- ✅ hello-world 앱 테스트 통과
- ✅ `pnpm turbo build`, `type-check`, `test`, `lint` 모두 통과
- ✅ `pnpm dev:all` 실행 시 전체 기능 정상 동작
- ✅ 모든 라우트 (`/`, `/hello`, `/home`) 동작 확인
- ✅ 다크모드 전체 적용 확인
- ✅ 반응형 디자인 동작 확인
- ✅ CLAUDE.md 문서 업데이트 완료

**의존성**: 세션 1, 2 완료 필요

---

## 작업 순서 요약

```
세션 1: ShellLayout + _shell 라우팅
  ├─ packages/ui/ShellLayout.vue 완성
  ├─ apps/_shell/router.ts에 /home 추가
  ├─ apps/_shell/tailwind.config.js 다크모드 설정
  └─ _shell 앱 테스트 작성
  ↓
세션 2: hello-world 프로필 페이지
  ├─ apps/hello-world/App.vue 전면 재구성
  ├─ apps/hello-world/tailwind.config.js 다크모드 설정
  └─ pnpm dev:all 로컬 테스트
  ↓
세션 3: 통합 테스트 및 검증
  ├─ 전체 빌드 검증
  ├─ 수동 통합 테스트
  └─ CLAUDE.md 업데이트
  ↓
✅ Feature 완료
```

## 기술 스택

- **Vue3**: 3.5.13 (Composition API)
- **TypeScript**: 5.6.3 (strict mode)
- **Tailwind CSS**: 3.4.17 (dark mode)
- **vue-router**: 4.4.5
- **Vite**: 6.0.3
- **Module Federation**: @originjs/vite-plugin-federation 1.4.1
- **Vitest**: 3.2.4 (테스트)
- **@vue/test-utils**: 2.4.6 (컴포넌트 테스트)
- **happy-dom**: 20.0.0 (테스트 환경)

## 예상 결과물

### 파일 변경 목록
- **수정**:
  - `packages/ui/src/ShellLayout.vue` ⭐ 주요 변경
  - `packages/ui/src/index.ts` (이미지 export)
  - `apps/_shell/src/router.ts` (/home 라우트 추가)
  - `apps/_shell/tailwind.config.js` (다크모드 설정)
  - `apps/hello-world/src/App.vue` ⭐ 주요 변경
  - `apps/hello-world/tailwind.config.js` (다크모드 설정)
  - `.claude/CLAUDE.md` (문서 업데이트)

- **신규 생성** (선택적):
  - `apps/_shell/src/__tests__/ShellLayout.spec.ts` (또는 기존 업데이트)

- **업데이트**:
  - `apps/hello-world/src/__tests__/App.spec.ts`

### 화면 구성 (데스크톱)
```
┌──────────────────────────────────────────────────────┐
│ [Logo] Jeongwoo   Hello  Blog  GuestBook  🌙 Toggle  │ ← ShellLayout Nav
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌───────────┐  ┌───────────────────────────────┐   │
│  │ Profile   │  │  👋 Hola, Good Day!           │   │
│  │  Card     │  │  Lorem ipsum dolor sit...     │   │
│  │           │  │                                │   │
│  │ [Image]   │  │  Frontend: [Icons]            │   │
│  │  Name     │  │  Backend: [Icons]             │   │
│  │  Email    │  │                                │   │
│  │  GitHub   │  │  💼 Experience & Portfolio    │   │
│  │           │  │  • Senior Engineer (2020-)    │   │
│  └───────────┘  │  • Developer (2018-2020)      │   │
│                 │  • Open Source Project        │   │
│                 └───────────────────────────────┘   │
│                                                       │
├──────────────────────────────────────────────────────┤
│ [GitHub] [LinkedIn] [Email]   © 2025 Jeongwoo Ahn   │ ← ShellLayout Footer
└──────────────────────────────────────────────────────┘
```

### 화면 구성 (모바일)
```
┌──────────────────────────┐
│ [Logo]  Jeongwoo    ☰  🌙│ ← ShellLayout Nav (햄버거)
├──────────────────────────┤
│  ┌──────────────────┐    │
│  │  Profile Card    │    │
│  │    [Image]       │    │
│  │     Name         │    │
│  │    Email         │    │
│  └──────────────────┘    │
│                          │
│  👋 Hola, Good Day!     │
│  Lorem ipsum...         │
│                          │
│  Frontend: [Icons]      │
│  Backend: [Icons]       │
│                          │
│  💼 Experience          │
│  • Senior Engineer      │
│  • Developer            │
│                          │
├──────────────────────────┤
│ [Icons] © 2025          │ ← ShellLayout Footer
└──────────────────────────┘
```

## 참고 자료

- Tailwind CSS Dark Mode: https://tailwindcss.com/docs/dark-mode
- Vue3 Composition API: https://vuejs.org/guide/introduction.html
- vue-router: https://router.vuejs.org/
- Module Federation: https://github.com/originjs/vite-plugin-federation
- Vitest: https://vitest.dev/
- 참고 디자인: https://nuxt-tailwind-blog.netlify.app/

---

**작성일**: 2025-10-20
**작성자**: Claude Code
**Feature 이름**: hello-world-redesign
**상태**: 준비 완료 - 코딩 시작 대기 중

---

## 추가 참고 사항

### pnpm dev:all 실행 흐름
1. `pnpm dev:shell`: _shell 앱 개발 서버 시작 (기본 포트: 5173)
2. `pnpm dev:hello`: hello-world 앱 개발 서버 시작 (기본 포트: 3000)
3. Module Federation으로 _shell이 hello-world를 동적 로드
4. 브라우저에서 _shell 포트로 접속 → 전체 앱 동작

### 다크모드 동작 방식
1. ShellLayout에서 다크모드 토글 버튼 클릭
2. `<html>` 또는 `<body>` 태그에 `dark` 클래스 추가/제거
3. Tailwind의 `dark:` variant가 자동으로 스타일 적용
4. localStorage에 `theme` 키로 저장 (`'light'` 또는 `'dark'`)
5. 페이지 새로고침 시 localStorage 읽어서 초기 테마 적용

### 중요 체크 포인트
- ✅ _shell 앱이 ShellLayout을 사용하므로, ShellLayout 수정이 핵심
- ✅ hello-world 앱은 ShellLayout을 직접 사용하지 않음 (콘텐츠만 제공)
- ✅ `/`, `/hello`, `/home` 모두 동일한 hello-world 앱을 보여줌
- ✅ 다크모드는 전역적으로 적용되어야 함 (ShellLayout + hello-world)
- ✅ Module Federation 빌드 설정은 기존 유지 (수정 불필요)
