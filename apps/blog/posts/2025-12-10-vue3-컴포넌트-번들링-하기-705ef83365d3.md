---
title: vue3 컴포넌트 번들링 하기 📦
description: 
date: 2025-12-10
category: tech
tags: ['Vue3', '번들링', 'Webpack', 'JavaScript', 'Rollup']
author: Jeongwoo Ahn
thumbnail: https://images.jeongwoo.in/blog/20251210-bundling-vue3.png
---

*[이전 블로그에서 작성했던 글](https://jeongwooahn.medium.com/vue3-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%B2%88%EB%93%A4%EB%A7%81-%ED%95%98%EA%B8%B0-705ef83365d3)을 옮겨왔습니다.*

![bundling-vue3](https://images.jeongwoo.in/blog/20251210-bundling-vue3.png)

현시대 프론트엔드 개발자들은 자연스럽게 코드 에디터를 열고 수백 수천 개의 컴포넌트 중 수정이 필요한 컴포넌트를 찾아 수정하고 새로운 컴포넌트를 만들며, 그 컴포넌트를 자유자재로 조합합니다. 더 나아가 외부 프로젝트에 공유하기 위해 패키징을 하고, 패키징된 외부 프로젝트를 우리 프로젝트에 가져와 설치하곤 합니다.

10년 전 페이지에 삽입되던 몇백 줄의 자바스크립트와는 비교할 수 없을 정도로 많은 양의 자바스크립트 모듈들이 어떻게 이렇게 손쉽게 분리, 통합되고 조합될 수 있었을까요.

누군가에게는 당연한 이야기일지 모르지만, 그 시절부터 개발을 해오던 저로서는 자바스크립트가 그때와는 완전히 다른 무언가로 인식됩니다. 그 사이에 도대체 무슨 일이 있었는지 가늠이 안 될 때도 있습니다.

<직업으로서의 소설가>라는 에세이에서 무라카미 하루키는 삼십여 년 전 어쩌다 쓰게 되어버린 첫 소설을 유명 문학잡지 <군조> 신춘문예에 응모했습니다. 얼마 후 잡지사에서 연락이 와 신인상 후보에 올랐다는 소식을 받게 됩니다. 그때 하루키는 이런 생각을 했다고 합니다. "틀림없이 나는 <군조>신인상을 탈 것이라고, 그리고 소설가가 되어 어느 정도의 성공을 거둘 것이라고, 심히 건방진 소리 같지만, 나는 왠지 그렇게 확신했습니다."

이 구절을 읽고 저는 상당히 놀랐습니다. 5년 후의 제 커리어에 대해서도 불안이 가득한데 말이죠. 그리고 10년 전의 자바스크립트는 아마 30년 전의 하루키와 지금의 하루키가 다른 것만큼이나 달라졌을 텐데요. 10년 전에 제가 자바스크립트에 대해 하루키처럼 이런 직관을 할 수 있었다면 어땠을까요. 자바스크립트 그 자신도 상상하지 못했을 겁니다. ([축약된 자바스크립트 역사](https://velog.io/@jmkacc99/JavaScript-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EC%9D%98-%EC%97%AD%EC%82%AC))

다소 엉뚱한 이야기를 했습니다. 어쨌든 자바스크립트는 그 자신과 환경이 아주 빠르게 변화했고 복잡도가 높아졌습니다. 우리가 지금과 같이 많고 많은 모듈을 손쉽게 다룰 수 있게 된 것은 번들러 덕분입니다. 그렇다면 자바스크립트 번들러는 도대체 무슨 일을 하는 걸까요.

## 번들러는 도대체 무슨 일을 하는 걸까 📦

자바스크립트 번들러는 번들을 생성합니다. 번들은 웹 브라우저에 제공되도록 최적화된 정적 파일입니다. 우리가 보통 작성하는 모듈은 복잡한 프론트엔드 시스템과 개발자를 위해 만들어진 구조입니다. 브라우저 입장에서 작성된 것이 아닙니다. 브라우저 입장에서는 중복도 많고 파일 수도 너무 많습니다. **브라우저에서 효율적으로 다룰 수 있도록 최적화된 정적 파일을 만드는 과정이 필요하고 그것이 번들입니다.**

최적화를 위해 번들러는 종속성 그래프를 만듭니다. 최초 진입점에서 시작해 거기서 참조하는 모든 종속성과 그 종속 대상의 종속성을 모두 순회합니다. 의존성 그래프를 통해 번들러는 앱의 어느 위치에서 무엇이 사용되는지 정확히 알 수 있습니다.

![종속성 트리](https://images.jeongwoo.in/blog/20251210-bundling-vue3-tree.png)

처음에 프론트엔드 규모가 작을 때에는 모든 모듈들을 진입점에 파일 하나로 뭉쳐서 만들면 충분했습니다. 이제는 그러기에는 너무 커졌고 번들 과정에 최적화를 위한 많은 요구사항들이 반영되었습니다.

물론 브라우저도 이런 요구사항들을 반영하며 빠르게 변화하고 있습니다. 하지만 그것보다 훨씬 빠른 속도로 자바스크립트 생태계가 변화하고 복잡해지고 있습니다. 그래서 그 간극을 메우기 위한 역할이라고 볼 수 있습니다.

바로 종속성 그래프가 있기 때문에 이것을 기반으로 번들 파일에 여러 최적화를 도입할 수 있습니다. 최적화는 예를 들면 이런 것들입니다.

- 코드 분할
- CSS 인라이닝
- HMR
- 웹브라우저 하위 호환성 보장
- js 파일 외의 css, html, jpg 등 다양한 자원들까지 처리 가능
- 트리 쉐이킹
- 사용하지 않는 소스 코드 제거
- 그 외 여러 가지 자동화

번들링을 해주는 도구는 Webpack과 Parcel.js, Rollup.js, esbuild, Vite 등이 있습니다.

## [웹팩](https://webpack.js.org/concepts/)과 [롤업](https://rollupjs.org/)

HMR 등 강력한 기능을 탑재했던 Webpack은 수년 동안 번들러 중의 원탑이었습니다. 그러나 시간이 지나면서 더 빠르고 새로운 환경에 걸맞은 도구들이 나오기 시작했습니다.

여러 번들러 도구들의 역사와 비교는 [이 글](https://bepyan.github.io/blog/2023/bundlers)을, Webpack과 Rollup.js의 차이에 대해서는 [이 글](https://yoon-dumbo.tistory.com/entry/%EB%A1%A4%EC%97%85%EA%B3%BC-%EC%9B%B9%ED%8C%A9%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90-rollup-vs-webpack)을 통해 보시면 도움이 될 것입니다. 저는 이보다 더 잘 설명하기 어렵고 다양한 도구를 폭넓게 다뤄보지는 못했습니다.

**이 글에서는 롤업을 사용해서 간단한 Vue3 번들을 만들어 보려고 합니다.**

처음부터 ES6 기반으로 만들어진 롤업은 좀 더 가볍고 빠릅니다. 강력한 개발 서버를 제공하는 Vite가 번들링을 롤업으로 사용하면서 더 유명해진 것 같습니다.

## 롤업이란 🍣

롤업은 작은 코드 조각을 라이브러리나 애플리케이션과 같이 더 크고 복잡한 것으로 컴파일하는 JavaScript용 모듈 번들러입니다. 이 번들러는 CommonJS 및 AMD와 같은 이전의 고유한 솔루션 대신 JavaScript ES6 개정판에 포함된 코드 모듈에 대한 새로운 표준 형식을 사용합니다. ES 모듈을 사용하면 자주 사용하는 라이브러리에서 가장 유용한 개별 기능을 자유롭고 원활하게 결합할 수 있습니다. 언젠가는 모든 곳에서 기본적으로 이 기능을 사용할 수 있게 되겠지만, 롤업을 사용하면 지금 바로 사용할 수 있습니다. via [rollup.js#installation](https://rollupjs.org/introduction/#installation)

Vue3 번들링을 위해 사용하게 될 롤업의 기능들은 아래와 같습니다.

- vue
- sass
- copy
- dynamic import 지원을 위한 것
- chunk split
- babel

먼저 롤업을 글로벌로 설치합니다.

```bash
$ npm install --global rollup
```

프로젝트를 하나 만들고 몇 가지 파일을 생성합니다.

```
- assets
  - styles
    - reset.scss
- src
  - hello.vue
- index.js
```

단순히 hello!를 출력하는 Vue 파일을 패키징해서 제공하려고 합니다.

hello.vue를 간단히 작성합니다.

```html
<template>
  <div>
    Hello!
  </div>
</template> 
<style scoped lang='scss'>
$color-primary: #5c7cfa;
div { 
  color: $color-primary; 
}
</style>
```

엔트리 파일로 사용할 index.js를 작성합니다.

```javascript
import Hello from './src/hello.vue';

export { Hello }

```

package.json 파일을 작성합니다.

```
{
  "name": "rollup-study",
  "version": "1.0.0",
  "description": "Project for roll-up study",
  "files": [
    "dist"
  ],
  "main": "/dist/index.js",
  "module": "/dist/index.es.js",
  "scripts": {
    "build": "rollup --config"
  },
  "keywords": [
    "rollup.js"
  ],
  "author": "guruahn@gmail.com",
  "license": "ISC"
}

```

오늘 실험에서 중요한 필드는 아래와 같습니다.

- `main`: `main` 필드는 패키지 사용자가 패키지를 사용할 때 진입되는 경로입니다. /dist/index.js로 설정하겠습니다.
- `module`: ES6 호환 환경에서 패키지를 사용할 경우를 대비하여 `module`도 /dist/index.es.js로 설정하겠습니다.
- `files`: `files` 필드는 패키지가 설치될 때 포함될 항목들을 저장하는 필드입니다. 우리는 dist 폴더에 사용자가 사용할 파일만 변경 혹은 그대로 저장할 것입니다. 이렇게 설정하면 불필요한 파일이 사용자의 node_modules 폴더에 저장되지 않습니다.
- scripts.build: [cli 명령어](https://rollupjs.org/command-line-interface/)로 rollup --config(혹은 -c)라고 했습니다. 뒤에 파일 이름을 사용하면 해당 파일을 설정 파일로 하겠다는 뜻입니다. 파일 이름이 없고 위와 같이 되어 있다면 자동으로 다음과 같은 우선순위로 파일을 로딩합니다. `rollup.config.mjs -> rollup.config.cjs -> rollup.config.js`

`package.json`의 [다른 필드들에 대한 설명은 이곳](https://beomy.github.io/tech/etc/package-json/)에서 보실 수 있습니다.


## 롤업 설정

롤업 설정 `rollup.config.js`는 일단 아래와 같이 시작해 보겠습니다.

### input / output

```javascript
const pkg = JSON.parse(readFileSync('package.json', {encoding: 'utf8'}));
export default [{
  input: './index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'rollupStudy',
      globals: {
        vue: 'Vue',
      },
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
}]
```

이렇게 input, output 두 가지 필드가 있습니다.

- `input`: 번들의 진입점(entry points). 여러 개인 경우 배열 혹은 객체로 표현할 수 있습니다.
- `output`: 청크 파일 생성 옵션.

output에 대해 좀 더 자세히 보면 다음과 같습니다.

- `file`: 저장될 파일 경로 및 이름.
- `format`: `amd`, `cjs`, `es`, `iife`, `umd`, `system` 중 하나가 될 수 있습니다.
- `globals`: `umd/iife` 번들에서 외부 가져오기에 필요한 id: 변수 이름 쌍을 지정합니다.
- `name`: `umd/iife` 번들에서 값을 `export` 할 경우 필수입니다.


### external

우리가 번들링할 rollup-study가 의존하고 있는 외부 패키지가 있다면 해당 패키지의 이름을 명시해야 합니다. `rollup.config.js`에 아래 설정을 추가합니다.

```javascript
external: [
  'vue',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]
```

`external` 필드에 패키지 이름들을 일일이 열거하기 쉽지 않을 수 있기 때문에 `package.json`에 명시된 패키지 이름들을 자동으로 가져올 수 있도록 했습니다. vue는 별도로 명시되어 있지 않아서 직접 추가했습니다.

### plugins

롤업에서 제공하지 않는 수많은 기능들은 [플러그인](https://rollupjs.org/tutorial/#using-plugins)을 통해 확장할 수 있습니다. 우리는 아래와 같은 플러그인을 사용할 것입니다.

```javascript
plugins: [
  vue({
    target: 'node',
    preprocessStyles: true,
    preprocessOptions: {
      sass: { // sass 적용
        includePaths: ['./node_modules'],
      },
    },
    transformAssetUrls: true,
  }),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svg'],
  }),
  commonjs(),
  scss(),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svg'],
    babelHelpers: 'bundled',
    presets: [
      [
        '@babel/preset-env'
      ],
    ],
  }),
  copy({
    targets: [
      {
        src:'assets/styles/reset.css', dest: 'dist/assets/css'
      }
    ]
  }),
]
```

- `vue`: rollup-plugin-vue 설치가 필요합니다. SSR인 경우 target 값은 node로 설정합니다. preprocess 관련 옵션은 sass 적용을 위해 필요합니다.
- `resolve`: @rollup/plugin-node-resolve 설치가 필요합니다. Node.js가 node_modules에 있는 서드파티 모듈들을 사용하기 위한 특정 알고리즘으로 모듈을 찾는 플러그인입니다.
- `commonjs`: @rollup/plugin-commonjs 설치가 필요합니다. CommonJS 모듈을 ES6로 변환하여 롤업 번들에 포함할 수 있도록 하는 롤업 플러그인입니다.
- `scss`: rollup-plugin-scss 설치가 필요합니다.
- `babel`: @rollup/plugin-babel 설치가 필요합니다.
- `copy`: rollup-plugin-copy 설치가 필요합니다. 특정 파일을 그대로 번들링에 포함시키고 싶을 때 사용합니다.

### 결과

아래와 같은 파일이 /dist 폴더에 생성됩니다.

```
- dist
  - assets
  - css
    - reset.css
  - output-b307511b.css
  - index.js
  - index.es.js
```

이제 여기서부터가 시작입니다. 설명은 다소 길었지만, 간단한 설정으로 패키징을 위한 많은 일을 자동화할 수 있게 되었습니다. 앞으로 청크 파일 분리, 다이나믹 임포트 등 다양한 기능들을 추가할 때마다 롤업 설정을 변경해야 할 것입니다.

## 참고문서

- [Rollup.js](https://rollupjs.org/)
- [Vue로 만든 UI 라이브러리를 Rollup으로 번들링 해본 후기](https://velog.io/@sian/Vue%EB%A1%9C-%EB%A7%8C%EB%93%A0-Design-system%EC%9D%84-Rollup%EC%9C%BC%EB%A1%9C-%EB%B2%88%EB%93%A4%EB%A7%81-%ED%95%B4%EB%B3%B8-%ED%9B%84%EA%B8%B0)
- [[ETC] package.json 톺아보기](https://beomy.github.io/tech/etc/package-json/)
- [Tree Shaking과 Module System](http://xn--tree%20shaking%20module%20system-hs30j/)
