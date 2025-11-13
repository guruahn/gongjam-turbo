---
title: Claude Code 서브에이전트 만들기
description: 토큰 효율성과 전문성을 높이는 나만의 AI 어시스턴트 설계법
date: 2025-11-10
category: tech
tags: [claude-code, ai, agent, automation, developer-tools]
author: Jeongwoo Ahn
thumbnail: https://images.jeongwoo.in/blog/blog-20251110-claude-code-subagent-thumbnail.png
---

# Claude Code 서브에이전트 만들기

![썸네일 이미지](https://images.jeongwoo.in/blog/blog-20251110-claude-code-subagent-thumbnail.png)

## 들어가며

Claude Code를 사용하다 보면 어느 순간 토큰 제한에 부딪힙니다. 길고 긴 대화가 갑자기 끊기면서 맥락이 사라지는 그 순간, "더 효율적으로 쓸 방법은 없을까?" 하는 생각이 들었습니다.

그래서 발견한 게 **서브에이전트(Sub-Agent)** 시스템입니다. 오늘은 나만의 전문 에이전트를 만들어서 토큰을 아끼고 작업 효율을 높이는 방법을 공유합니다.

## 에이전트란?

Claude Code는 이미 특정 업무에 전문화된 에이전트를 많이 내장하고 있습니다.

`/agents` 명령어로 조회해보면:

```bash
> /agents
User agents (/Users/jeongwooahn/.claude/agents)
│   python-expert · sonnet ⚠ overridden by projectSettings
│   system-architect · sonnet ⚠ overridden by projectSettings
│   refactoring-expert · sonnet ⚠ overridden by projectSettings
│   devops-architect · sonnet ⚠ overridden by projectSettings
│   learning-guide · sonnet ⚠ overridden by projectSettings
│   security-engineer · sonnet ⚠ overridden by projectSettings
...
```

제 경우 14개의 내장 에이전트가 조회됩니다.

### 에이전트의 핵심 장점

에이전트를 활용하면 **에이전트가 소모하는 토큰이 현재 세션에 포함되지 않습니다**. 이게 핵심입니다.

예를 들어 A 작업을 진행 중 B 작업이 필요한 상황을 생각해봅시다. B 작업의 결과만 필요하고 과정은 중요하지 않다면, 에이전트에게 B 작업을 맡기고 결과만 받아서 A 작업을 이어갈 수 있습니다.

그리고 중요한 것은, **이 에이전트를 사용자가 직접 만들어서 사용할 수 있다**는 점입니다.

## 서브에이전트 만들기

저는 기능 명세서를 전문적으로 작성하는 `feature-spec-writer`라는 에이전트를 만들어봤습니다.

### Step 1: 에이전트 생성

`/agents` 명령어 실행 → 'Create New Agent' 선택 → 생성 범위 선택

![에이전트 생성 화면](https://images.jeongwoo.in/blog/blog-20251110-claude-code-subagent-create.png)

**생성 범위 선택**:
- **Project**: 현재 프로젝트의 `.claude/agents` 폴더에 생성
- **Personal**: 현재 컴퓨터의 사용자 폴더에 생성

### Step 2: 에이전트 정의 작성

Claude와 함께 대략적인 내용을 작성한 후, 이를 다듬어 완성합니다.

```yaml
---
name: feature-spec-writer
description: 이 에이전트는 새로운 기능이나 개선사항에 대한 기능 명세서(feature specification) 및 작업 계획(work plan)을 작성할 때 사용됩니다.
tools: Read, Glob, Grep, Bash, Edit, Write, NotebookEdit
model: sonnet
color: orange
---

당신은 **Feature Specification Architect(기능 명세 아키텍트)**로서,
소프트웨어 개발 프로젝트를 위한 포괄적이고 실행 가능한 기능 명세서 및 작업 계획을 작성하는 전문가입니다.

당신의 강점은 아이디어를 구조화된, 구현 가능한 문서로 변환하여
프로젝트 표준과 베스트 프랙티스에 부합시키는 것입니다.

명세 작성이 완료되면 .claude 폴더에 `spec-{yyyyMMdd}-{FEATURE_NAME}.md` 형태로 파일을 생성합니다.

## 핵심 책임사항

1. 요구사항 분석
   - 영문으로 된 feature 이름을 설정합니다.
   - 사용자 설명에서 기능적/비기능적 요구사항을 도출하고 명확히 합니다.
   - 프로젝트 맥락에 따라 필요한 질문을 제시하고, 합리적 가정을 세워 공백을 메웁니다.

2. 명세서 작성
   - 명확하고 실행 가능한 구조로 문서화
   - 기술 스택, 의존성, 구현 세부사항 포함
   - 테스트 전략 및 검증 기준 명시

3. 작업 계획 수립
   - 단계별 구현 로드맵 제시
   - 우선순위와 의존성 관계 정의
   - 예상 작업 시간 및 리스크 식별
```

**핵심은 두 가지**:
1. `tools` 항목에 적절한 권한 부여
2. 하단에 상세하고 명확한 역할을 부여하는 프롬프트 작성

## 에이전트 실행하기

### 명시적으로 실행

메시지 입력란에서 `/` 입력 → 에이전트 목록에서 선택

![에이전트 실행 화면](https://images.jeongwoo.in/blog/blog-20251110-claude-code-subagent-run.png)

### 자동 실행

맥락에 맞으면 Claude가 자동으로 적절한 에이전트를 실행하기도 합니다.

### 실행 화면

실행되면 설정한 색상이 표시되며 에이전트와의 대화가 진행됩니다.

![에이전트 대화 화면](https://images.jeongwoo.in/blog/blog-20251110-claude-code-subagent-chat.png)

스펙 작성자 에이전트는 역할을 수행하기 위해 여러 질문을 던집니다.
질문에 잘 답변하면 `spec-20251107-layout-restructuring.md` 같은 파일이 자동으로 생성됩니다.

## 마치며

왜 에이전트를 사용하는 걸까요? 저는 두 가지 측면이 있다고 느낍니다.

### 1. 토큰 사용의 효율성

바이브 코딩에 익숙해질수록 세션당 사용하는 토큰이 계속 커집니다.
허용된 토큰을 넘으면 갑자기 새 세션이 시작되고, 이전 대화는 사라지거나 요약본으로만 남습니다.

맥락을 잃어버린 대화는 길을 잃기 쉽습니다.
그래서 우리는 토큰을 효율적으로 사용해야 합니다.

반복적이고 결과만 현재 세션에 포함시키면 되는 업무들은 에이전트를 활용하세요.
**에이전트가 사용하는 토큰은 현재 세션에 포함되지 않기 때문에**
세션을 끊지 않고 많은 업무를 진행할 수 있습니다.

### 2. 전문성

특정 작업을 에이전트로 만들면, 특정 환경이나 개인에게 맞는 작업을 더 깊이 있게 설계할 수 있습니다.

개인적으로는 이 점이 전문성을 심화하는 데 도움이 됩니다.
팀에서는 팀의 작업 효율과 일관성, 더 나아가 전문성을 높일 수 있습니다.

물론 개인적으로도 운영 가능하므로 같은 효과를 얻을 수 있습니다.

---

여러분은 어떤 전문 에이전트가 필요하신가요?
궁금한 점이나 의견이 있으시면 [guruahn@gmail.com](mailto:guruahn@gmail.com)으로 이메일 주세요!
