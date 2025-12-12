/**
 * Cloudflare Workers OCR API
 * Google Cloud Vision API를 사용하여 이미지에서 텍스트를 추출합니다.
 * API 키를 프론트엔드에 노출하지 않기 위한 프록시 역할을 합니다.
 */

interface Env {
  GOOGLE_CLOUD_PROJECT_ID: string;
  GOOGLE_CLOUD_PRIVATE_KEY: string;
  GOOGLE_CLOUD_CLIENT_EMAIL: string;
}

interface OcrRequest {
  imageBase64: string;
  languageHints?: string[];
}

interface OcrResponse {
  text: string;
  confidence: number;
  error?: string;
}

/**
 * CORS 헤더 생성
 */
function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3004',
    'https://jeongwoo.in',
    'https://bookly.jeongwoo.in'
  ];

  const responseOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': responseOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * OPTIONS 요청 처리 (CORS preflight)
 */
function handleOptions(request: Request): Response {
  const origin = request.headers.get('Origin');
  return new Response(null, {
    headers: corsHeaders(origin),
  });
}

/**
 * Google Cloud Vision API 호출
 */
async function callVisionAPI(
  imageBase64: string,
  languageHints: string[],
  env: Env
): Promise<OcrResponse> {
  const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate`;

  // Google Cloud Vision API 요청 바디
  const requestBody = {
    requests: [
      {
        image: {
          content: imageBase64,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults: 1,
          },
        ],
        imageContext: {
          languageHints,
        },
      },
    ],
  };

  try {
    // Google Cloud 서비스 계정 인증 토큰 생성
    const now = Math.floor(Date.now() / 1000);
    const jwtHeader = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const jwtClaim = {
      iss: env.GOOGLE_CLOUD_CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/cloud-vision',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // JWT 생성을 위해 Web Crypto API 사용
    const encoder = new TextEncoder();
    const headerBase64 = btoa(JSON.stringify(jwtHeader)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const claimBase64 = btoa(JSON.stringify(jwtClaim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signatureInput = `${headerBase64}.${claimBase64}`;

    // Private key import
    const privateKeyPem = env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n');
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = privateKeyPem.substring(
      pemHeader.length,
      privateKeyPem.length - pemFooter.length
    ).trim();

    // Base64 decode
    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Sign
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      encoder.encode(signatureInput)
    );

    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const jwt = `${signatureInput}.${signatureBase64}`;

    // Access token 요청
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Failed to get access token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json<{ access_token: string }>();
    const accessToken = tokenData.access_token;

    // Vision API 호출
    const visionResponse = await fetch(visionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      throw new Error(`Vision API error: ${errorText}`);
    }

    const visionData = await visionResponse.json<any>();

    // 응답 파싱
    const response = visionData.responses?.[0];
    if (!response) {
      throw new Error('No response from Vision API');
    }

    if (response.error) {
      throw new Error(`Vision API error: ${response.error.message}`);
    }

    const textAnnotations = response.textAnnotations;
    if (!textAnnotations || textAnnotations.length === 0) {
      return {
        text: '',
        confidence: 0,
        error: '텍스트를 인식하지 못했습니다.',
      };
    }

    // 첫 번째 annotation이 전체 텍스트
    const fullText = textAnnotations[0].description || '';
    const confidence = textAnnotations[0].confidence || 0.95;

    return {
      text: fullText.trim(),
      confidence,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      text: '',
      confidence: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * POST 요청 처리
 */
async function handlePost(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin');

  try {
    const body = await request.json<OcrRequest>();

    if (!body.imageBase64) {
      return new Response(
        JSON.stringify({ error: 'imageBase64 is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }

    const languageHints = body.languageHints || ['ko', 'en'];

    const result = await callVisionAPI(body.imageBase64, languageHints, env);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(origin),
      },
    });
  } catch (error) {
    console.error('Request Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin),
        },
      }
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // /api/ocr 엔드포인트만 허용
    if (url.pathname !== '/api/ocr') {
      return new Response('Not Found', { status: 404 });
    }

    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    if (request.method === 'POST') {
      return handlePost(request, env);
    }

    return new Response('Method Not Allowed', { status: 405 });
  },
};
