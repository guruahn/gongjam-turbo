/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Module Federation Remote: helloWorld
declare module 'helloWorld/App' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Module Federation Remote: blog
declare module 'blog/App' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'blog/BlogRouter' {
  import { Router } from 'vue-router';
  const router: Router;
  export default router;
}

declare module 'blog/BlogListPage' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'blog/BlogPostPage' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'guestbook/App' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'guestbook/GuestbookRouter' {
  import { Router } from 'vue-router';
  const router: Router;
  export default router;
}

declare module 'guestbook/GuestbookListPage' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'guestbook/GuestbookAdminPage' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_HELLO_HOME_URL: string;
  readonly VITE_BLOG_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
