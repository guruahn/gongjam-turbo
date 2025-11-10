---
title: "My First Blog Post"
date: 2025-01-01
tags: ["vue", "typescript", "blogging"]
description: "블로그 시스템을 만들면서 첫 번째 글을 작성합니다. Vue3와 TypeScript로 마크다운 기반 블로그를 구축하는 여정을 공유합니다."
thumbnail: "/images/thumbnails/first-post.jpg"
author: "Jeongwoo Ahn"
---

# My First Blog Post

안녕하세요! 블로그 시스템을 처음 만들면서 작성하는 첫 번째 글입니다.

## 블로그 시스템 소개

이 블로그는 **Vue3**와 **TypeScript**로 만들어진 정적 사이트 생성(SSG) 기반 블로그입니다.

### 주요 기능

- 📝 마크다운 기반 글 작성
- 🎨 Tailwind CSS 스타일링
- 🌓 다크모드 지원
- 🏷️ 태그 기반 필터링
- 📱 반응형 레이아웃

## 코드 예제

TypeScript로 간단한 함수를 작성해봅시다:

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! You are ${user.age} years old.`;
}

const user: User = { name: 'Jeongwoo', age: 30 };
console.log(greetUser(user)); // Hello, Jeongwoo! You are 30 years old.
\`\`\`

## Vue3 Composition API

Vue3의 Composition API를 사용하면 더 나은 타입 추론과 로직 재사용이 가능합니다:

\`\`\`vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref<number>(0);
const doubled = computed(() => count.value * 2);

function increment(): void {
  count.value++;
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
\`\`\`

## 마무리

이 블로그 시스템은 Module Federation을 사용한 마이크로 프론트엔드 아키텍처로 구성되어 있습니다. 앞으로 더 많은 기능을 추가하고, 유용한 기술 글을 공유하겠습니다!

다음 글에서는 Module Federation에 대해 더 자세히 다루겠습니다. 🚀
