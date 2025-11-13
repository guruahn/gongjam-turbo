---
title: JavaScript Set 객체, 제대로 활용하기
description: Set객체를 주저하는 이들을 위하여
date: 2025-11-14
category: tech
tags: [javascript, set, data-structure, performance, es6]
author: Jeongwoo Ahn
thumbnail: https://images.jeongwoo.in/blog/1_CASQU6s7jopGwx67RbC7eQ-다음에서-변환-webp.jpeg
---

# JavaScript Set 객체, 제대로 활용하기

![썸네일 이미지](https://images.jeongwoo.in/blog/1_CASQU6s7jopGwx67RbC7eQ-다음에서-변환-webp.jpeg)

## 들어가며

코드 리뷰를 하다 보면 배열 중복 제거를 위해 `[...new Set(arr)]`를 쓰는 걸 자주 봅니다. 저도 그렇게 쓰다가 문득 이런 생각이 들었습니다.

"Set이 이것만 하려고 있는 건 아닐 텐데?"

[Set 객체](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set)는 ES6에서 추가된 컬렉션 타입입니다. 값의 목록을 다루지만, 배열과는 다른 특징을 가지고 있습니다.

```javascript
const mySet = new Set([1, 2, 3]);
mySet.add(4); // {1, 2, 3, 4}
mySet.add(3); // 중복은 무시됩니다. {1, 2, 3, 4}
```

중복을 허용하지 않는다는 건 알고 있었습니다. 하지만 실무에서 더 잘 활용할 수 있는 방법을 정리해봤습니다.

## 장점 1: 값에는 모든 유형이 가능

Set은 원시값뿐만 아니라 객체, DOM 요소, Symbol까지 담을 수 있습니다.

```javascript
const mySet = new Set([1, 2, 3]);

// 객체 추가
const userObj = { name: "jwahn" };
mySet.add(userObj);
console.log(mySet); // Set(4) {1, 2, 3, {name: "jwahn"}}

// DOM 요소 추가
const headerElement = document.getElementById('header');
mySet.add(headerElement);
console.log(mySet); // Set(5) {1, 2, 3, Object, div#header}

// Symbol 추가
const uniqueId = Symbol();
mySet.add(uniqueId);
console.log(mySet); // Set(6) {1, 2, 3, Object, div#header, Symbol()}
```

실무에서 이벤트 리스너 관리나 컴포넌트 인스턴스를 추적할 때 유용했습니다.

## 장점 2: 직관적인 기본 메서드

Set의 API는 매우 직관적입니다.

```javascript
const mySet = new Set();

mySet.add(5);      // 추가
mySet.has(5);      // true - 존재 확인
mySet.delete(5);   // 삭제
mySet.clear();     // 전체 비우기
mySet.size;        // 요소 개수 (메서드가 아닌 속성)
```

처음 보는 사람도 메서드명만 보고 무엇을 하는지 바로 알 수 있습니다.

## 장점 3: 값 비교 시 형변환 없음

배열이나 객체와 달리 Set은 값을 비교할 때 자동 형변환을 하지 않습니다.

```javascript
// 객체의 경우 - 형변환 발생
const obj = { 0: 'zero' };
console.log(obj['0']);  // 'zero' - 숫자 0이 문자열 '0'으로 변환됨
console.log(obj[0]);    // 'zero' - 동일한 결과

// Set의 경우 - 형변환 없음
const mySet = new Set([0]);
console.log(mySet.has('0')); // false - 엄격한 타입 비교
console.log(mySet.has(0));   // true
```

이 특성 덕분에 타입 안전성이 높아집니다. 특히 TypeScript와 함께 사용할 때 예상치 못한 버그를 줄일 수 있습니다.

## 장점 4: 배열보다 빠른 검색 성능

Set은 내부적으로 해시 테이블 구조로 되어있어 `has()` 메서드의 시간 복잡도가 **O(1)**입니다. 배열의 `includes()`는 O(n)이죠.

```javascript
// 배열 검색 - O(n)
const arr = [1, 2, 3, 4, 5];
arr.includes(3); // 최악의 경우 배열 전체를 순회

// Set 검색 - O(1)
const mySet = new Set([1, 2, 3, 4, 5]);
mySet.has(3); // 즉시 결과 반환
```

우리 팀에서 태그 필터링 기능을 만들 때 선택된 태그 목록을 Set으로 관리했습니다. 수백 개의 아이템을 필터링하는데도 체감 성능 차이가 확연했습니다.

```javascript
const selectedTags = new Set(['javascript', 'vue', 'typescript']);

// 빠른 필터링
const filteredPosts = posts.filter(post =>
  post.tags.some(tag => selectedTags.has(tag))
);
```

## 장점 5: 배열 및 이터레이터로 쉽게 변환

Set은 배열로 쉽게 변환할 수 있습니다.

```javascript
const mySet = new Set([1, 2, 3]);

// Array.from 사용
console.log(Array.from(mySet)); // [1, 2, 3]

// Spread Operator 사용
console.log([...mySet]); // [1, 2, 3]
```

이터레이터로도 변환 가능합니다.

```javascript
const mySet = new Set(["foo", "bar", "baz"]);
const setIterator = mySet.keys();

console.log(setIterator.next().value); // "foo"
console.log(setIterator.next().value); // "bar"
console.log(setIterator.next().value); // "baz"
```

## 장점 6: 집합 연산 메서드 (ES2025)

최근 JavaScript에 추가된 집합 연산 메서드들이 매우 강력합니다.

```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

// 합집합 (union)
console.log(setA.union(setB)); // Set(5) {1, 2, 3, 4, 5}

// 교집합 (intersection)
console.log(setA.intersection(setB)); // Set(1) {3}

// 차집합 (difference)
console.log(setA.difference(setB)); // Set(2) {1, 2}

// 대칭차 (symmetricDifference)
console.log(setA.symmetricDifference(setB)); // Set(4) {1, 2, 4, 5}

// 부분집합 확인 (isSubsetOf)
const setC = new Set([1, 2]);
console.log(setC.isSubsetOf(setA)); // true

// 상위집합 확인 (isSupersetOf)
console.log(setA.isSupersetOf(setC)); // true

// 서로소 확인 (isDisjointFrom)
const setD = new Set([6, 7]);
console.log(setA.isDisjointFrom(setD)); // true
```

권한 관리 시스템을 만들 때 이 메서드들이 정말 유용했습니다.

```javascript
const userPermissions = new Set(['read', 'write']);
const requiredPermissions = new Set(['read', 'write', 'delete']);

// 사용자가 필요한 권한을 모두 가지고 있는지 확인
const hasAllPermissions = requiredPermissions.isSubsetOf(userPermissions);

// 부족한 권한 확인
const missingPermissions = requiredPermissions.difference(userPermissions);
console.log([...missingPermissions]); // ['delete']
```

## 실무 활용 팁

### 1. 중복 제거는 기본

가장 흔한 사용 사례입니다.

```javascript
const numbers = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4]
```

### 2. 배열 교집합/합집합 구하기

```javascript
const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4];

// 교집합
const intersection = arr1.filter(x => arr2.includes(x));
// 또는 Set 사용
const intersectionSet = new Set(arr1).intersection(new Set(arr2));

// 합집합
const union = [...new Set([...arr1, ...arr2])];
```

### 3. 유니크한 이벤트 리스너 관리

```javascript
const listeners = new Set();

function addListener(callback) {
  listeners.add(callback);
}

function removeListener(callback) {
  listeners.delete(callback);
}

function notifyAll(data) {
  listeners.forEach(listener => listener(data));
}
```

## 주의사항

Set은 객체 참조로 값을 비교합니다.

```javascript
const mySet = new Set();
mySet.add({ name: 'jwahn' });
mySet.add({ name: 'jwahn' }); // 다른 객체로 인식됨
console.log(mySet.size); // 2 (중복 제거 안 됨)
```

객체 내용이 같아도 참조가 다르면 다른 값으로 취급합니다. 이럴 때는 직렬화하거나 Map을 사용하는 게 나을 수 있습니다.

## 마치며

Set은 작지만 강력한 도구입니다. 단순히 배열 중복 제거용으로만 쓰기엔 아깝습니다.

여러분은 Set을 어떻게 활용하고 계신가요? 공유하고 싶은 활용법이 있다면 [guruahn@gmail.com](mailto:guruahn@gmail.com)으로 이메일 주세요!
