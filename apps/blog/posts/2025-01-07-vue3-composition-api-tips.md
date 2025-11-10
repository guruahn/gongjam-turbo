---
title: "Vue3 Composition API 활용 팁"
date: 2025-01-07
tags: ["vue", "composition-api", "best-practices"]
description: "Vue3 Composition API를 효과적으로 사용하기 위한 실전 팁과 베스트 프랙티스를 공유합니다."
author: "Jeongwoo Ahn"
---

# Vue3 Composition API 활용 팁

Vue3 Composition API를 사용하면서 알게 된 유용한 팁들을 공유합니다.

## 1. Composables로 로직 재사용

Composables는 Vue3에서 로직을 재사용하는 가장 좋은 방법입니다.

### useMouse 예제

\`\`\`typescript
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
\`\`\`

### 사용 예시

\`\`\`vue
<script setup lang="ts">
import { useMouse } from '@/composables/useMouse';

const { x, y } = useMouse();
</script>

<template>
  <div>Mouse position: {{ x }}, {{ y }}</div>
</template>
\`\`\`

## 2. Computed vs Watch

`computed`는 값을 계산하고, `watch`는 사이드 이펙트를 수행합니다.

\`\`\`typescript
import { ref, computed, watch } from 'vue';

const firstName = ref('Jeongwoo');
const lastName = ref('Ahn');

// ✅ Good: computed로 파생 값 계산
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// ❌ Bad: watch로 파생 값 계산 (안티패턴)
const fullNameBad = ref('');
watch([firstName, lastName], () => {
  fullNameBad.value = `${firstName.value} ${lastName.value}`;
});

// ✅ Good: watch로 사이드 이펙트 (API 호출 등)
watch(fullName, async (newName) => {
  await logNameChange(newName);
});
\`\`\`

## 3. TypeScript 타입 추론

`ref`와 `reactive`의 타입을 명시적으로 지정할 수 있습니다.

\`\`\`typescript
import { ref, reactive } from 'vue';

interface User {
  name: string;
  age: number;
}

// ref with explicit type
const user = ref<User>({ name: 'Jeongwoo', age: 30 });

// reactive with interface
const state = reactive<User>({
  name: 'Jeongwoo',
  age: 30,
});
\`\`\`

## 4. defineProps with TypeScript

\`\`\`vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number; // optional
}

const props = withDefaults(defineProps<Props>(), {
  count: 0, // default value
});
</script>
\`\`\`

## 5. Provide/Inject 패턴

컴포넌트 트리 전체에서 데이터를 공유할 때 사용합니다.

\`\`\`typescript
// Parent.vue
import { provide, ref } from 'vue';

const theme = ref('dark');
provide('theme', theme);
\`\`\`

\`\`\`typescript
// Child.vue
import { inject } from 'vue';

const theme = inject<Ref<string>>('theme');
\`\`\`

## 결론

Vue3 Composition API는 강력하고 유연한 도구입니다. 위의 팁들을 활용하면 더 깔끔하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.

다음 글에서는 Vue3 성능 최적화 기법에 대해 다루겠습니다! 💡
