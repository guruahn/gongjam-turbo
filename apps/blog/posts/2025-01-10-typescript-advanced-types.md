---
title: "TypeScript 고급 타입 활용법"
date: 2025-01-10
tags: ["typescript", "advanced", "types"]
description: "TypeScript의 고급 타입 기능을 활용하여 더 안전하고 표현력 있는 코드를 작성하는 방법을 알아봅니다."
author: "Jeongwoo Ahn"
---

# TypeScript 고급 타입 활용법

TypeScript의 고급 타입 시스템을 활용하면 런타임 오류를 컴파일 타임에 잡아낼 수 있습니다.

## 1. Union Types와 Type Narrowing

\`\`\`typescript
type Status = 'loading' | 'success' | 'error';

function handleStatus(status: Status) {
  if (status === 'loading') {
    console.log('Loading...');
  } else if (status === 'success') {
    console.log('Success!');
  } else {
    console.log('Error occurred');
  }
}
\`\`\`

## 2. Discriminated Unions

\`\`\`typescript
interface LoadingState {
  type: 'loading';
}

interface SuccessState {
  type: 'success';
  data: string;
}

interface ErrorState {
  type: 'error';
  error: Error;
}

type State = LoadingState | SuccessState | ErrorState;

function render(state: State) {
  switch (state.type) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data; // TypeScript knows 'data' exists
    case 'error':
      return state.error.message; // TypeScript knows 'error' exists
  }
}
\`\`\`

## 3. Mapped Types

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email: string;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick specific properties
type UserNameAndEmail = Pick<User, 'name' | 'email'>;

// Omit specific properties
type UserWithoutEmail = Omit<User, 'email'>;
\`\`\`

## 4. Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUserName(): string {
  return 'Jeongwoo';
}

type UserNameType = ReturnType<typeof getUserName>; // string
\`\`\`

## 5. Template Literal Types

\`\`\`typescript
type Color = 'red' | 'blue' | 'green';
type Size = 'small' | 'medium' | 'large';

type CombinedClass = \`\${Color}-\${Size}\`;
// 'red-small' | 'red-medium' | 'red-large' | 'blue-small' | ...
\`\`\`

## 6. Utility Types

TypeScript는 많은 유용한 유틸리티 타입을 제공합니다:

\`\`\`typescript
// Record: Create an object type with specific keys and values
type PageInfo = Record<'home' | 'about' | 'contact', { title: string }>;

const pages: PageInfo = {
  home: { title: 'Home Page' },
  about: { title: 'About Page' },
  contact: { title: 'Contact Page' },
};

// NonNullable: Exclude null and undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// Parameters: Extract function parameter types
function greet(name: string, age: number) {
  console.log(\`Hello \${name}, you are \${age} years old\`);
}

type GreetParams = Parameters<typeof greet>; // [string, number]
\`\`\`

## 결론

TypeScript의 고급 타입 시스템은 처음에는 복잡해 보일 수 있지만, 익숙해지면 매우 강력한 도구가 됩니다. 타입 안전성을 유지하면서도 코드의 유연성을 높일 수 있습니다.

다음 글에서는 TypeScript Generic 패턴에 대해 더 깊이 다루겠습니다! 🔥
