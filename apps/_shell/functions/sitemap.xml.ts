/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Pages Function
 * https://jeongwoo.in/sitemap.xml 요청을 처리하여 R2의 sitemap.xml 반환
 */

interface Env {
  BLOG_BUCKET: R2Bucket;
}

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    // R2에서 sitemap.xml 가져오기
    const object = await context.env.BLOG_BUCKET.get('sitemap.xml');

    if (!object) {
      return new Response('Sitemap not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // R2 객체를 Response로 변환
    return new Response(object.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 1시간 캐싱
        'X-Content-Source': 'cloudflare-r2',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);

    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
