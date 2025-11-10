import { onMounted, onUnmounted } from 'vue';

export interface SEOMetaTags {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
  author?: string;
  publishedTime?: string;
  tags?: string[];
}

/**
 * SEO 메타 태그 생성 및 관리
 */
export function useHead(meta: SEOMetaTags) {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://jeongwoo.in';
  const fullUrl = meta.url ? `${baseUrl}${meta.url}` : baseUrl;
  const defaultImage = `${baseUrl}/images/og-default.jpg`;

  // 메타 태그 생성
  const metaTags: Array<{ property?: string; name?: string; content: string }> = [
    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:image', content: meta.image || defaultImage },
    { property: 'og:type', content: meta.type || 'website' },
    { property: 'og:url', content: fullUrl },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    { name: 'twitter:image', content: meta.image || defaultImage },

    // Standard meta tags
    { name: 'description', content: meta.description },
  ];

  // Article-specific meta tags
  if (meta.type === 'article') {
    if (meta.author) {
      metaTags.push({ property: 'article:author', content: meta.author });
    }
    if (meta.publishedTime) {
      metaTags.push({ property: 'article:published_time', content: meta.publishedTime });
    }
    if (meta.tags && meta.tags.length > 0) {
      meta.tags.forEach((tag) => {
        metaTags.push({ property: 'article:tag', content: tag });
      });
    }
  }

  // DOM 조작: 메타 태그 추가/업데이트
  const addedElements: HTMLMetaElement[] = [];

  onMounted(() => {
    // 페이지 타이틀 설정
    document.title = meta.title;

    // 메타 태그 추가
    metaTags.forEach((tag) => {
      const selector = tag.property
        ? `meta[property="${tag.property}"]`
        : `meta[name="${tag.name}"]`;

      let metaElement = document.querySelector<HTMLMetaElement>(selector);

      if (!metaElement) {
        metaElement = document.createElement('meta');
        if (tag.property) {
          metaElement.setAttribute('property', tag.property);
        } else if (tag.name) {
          metaElement.setAttribute('name', tag.name);
        }
        document.head.appendChild(metaElement);
        addedElements.push(metaElement);
      }

      metaElement.setAttribute('content', tag.content);
    });
  });

  // 컴포넌트 언마운트 시 정리 (선택적)
  onUnmounted(() => {
    // 추가한 메타 태그 제거 (SPA에서 페이지 전환 시 정리)
    addedElements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
  });
}

/**
 * 블로그 글용 SEO 메타 태그 생성
 */
export function useBlogPostMeta(post: {
  title: string;
  description: string;
  slug: string;
  thumbnail?: string;
  author?: string;
  date: string;
  tags: string[];
}) {
  useHead({
    title: `${post.title} | Jeongwoo Ahn's Blog`,
    description: post.description,
    image: post.thumbnail,
    type: 'article',
    url: `/blog/${post.slug}`,
    author: post.author || 'Jeongwoo Ahn',
    publishedTime: post.date,
    tags: post.tags,
  });
}

/**
 * 블로그 목록 페이지용 SEO 메타 태그
 */
export function useBlogListMeta() {
  useHead({
    title: "Blog | Jeongwoo Ahn's Portfolio",
    description:
      'Vue3, TypeScript, 웹 개발에 대한 기술 블로그입니다. 프론트엔드 개발 경험과 팁을 공유합니다.',
    type: 'website',
    url: '/blog',
  });
}
