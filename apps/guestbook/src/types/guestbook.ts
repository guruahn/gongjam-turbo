// 프로필 이미지 타입 (30개)
export type ProfileImage =
  | 'pig'
  | 'mouse'
  | 'sheep'
  | 'hippo'
  | 'clown-fish'
  | 'walrus'
  | 'lion'
  | 'parrot'
  | 'owl'
  | 'bullfinch'
  | 'crab'
  | 'panda'
  | 'whale'
  | 'ladybug'
  | 'frog'
  | 'giraffe'
  | 'beetle'
  | 'snake'
  | 'chicken'
  | 'spider'
  | 'penguin'
  | 'rabbit'
  | 'lama'
  | 'fox'
  | 'flamingo'
  | 'rhino'
  | 'dog'
  | 'beaver'
  | 'gorilla'
  | 'zebra';

// 방명록 상태
export type GuestbookStatus = 'pending' | 'approved' | 'rejected';

// 방명록 엔트리 (데이터베이스 레코드)
export interface GuestbookEntry {
  id: string; // UUID (Supabase 자동 생성)
  nickname: string; // 닉네임 (최대 20자)
  profile_image: string; // 프로필 이미지 URL
  message: string; // 메시지 내용 (최대 280자)
  status: GuestbookStatus; // 승인 상태
  created_at: string; // ISO 8601 timestamp
  approved_at?: string; // 승인 시간 (승인된 경우)
  rejected_at?: string; // 거부 시간 (거부된 경우)
}

// 방명록 작성 폼 데이터
export interface GuestbookFormData {
  nickname: string;
  profile_image: ProfileImage;
  message: string;
}

// 관리자 액션
export interface GuestbookAdminAction {
  entry_id: string;
  action: 'approve' | 'reject';
}

// 페이지네이션 파라미터
export interface PaginationParams {
  page: number;
  limit: number;
}

// 방명록 목록 응답
export interface GuestbookListResponse {
  entries: GuestbookEntry[];
  total: number;
  page: number;
  hasMore: boolean;
}

// 프로필 이미지 목록 (URL 매핑용)
export const PROFILE_IMAGES: ProfileImage[] = [
  'pig',
  'mouse',
  'sheep',
  'hippo',
  'clown-fish',
  'walrus',
  'lion',
  'parrot',
  'owl',
  'bullfinch',
  'crab',
  'panda',
  'whale',
  'ladybug',
  'frog',
  'giraffe',
  'beetle',
  'snake',
  'chicken',
  'spider',
  'penguin',
  'rabbit',
  'lama',
  'fox',
  'flamingo',
  'rhino',
  'dog',
  'beaver',
  'gorilla',
  'zebra',
];

// 프로필 이미지 URL 매핑 (Cloudflare R2)
export const PROFILE_IMAGE_URLS: Record<ProfileImage, string> = {
  pig: 'https://images.jeongwoo.in/profiles/pig.png',
  mouse: 'https://images.jeongwoo.in/profiles/mouse.png',
  sheep: 'https://images.jeongwoo.in/profiles/sheep.png',
  hippo: 'https://images.jeongwoo.in/profiles/hippo.png',
  'clown-fish': 'https://images.jeongwoo.in/profiles/clown-fish.png',
  walrus: 'https://images.jeongwoo.in/profiles/walrus.png',
  lion: 'https://images.jeongwoo.in/profiles/lion.png',
  parrot: 'https://images.jeongwoo.in/profiles/parrot.png',
  owl: 'https://images.jeongwoo.in/profiles/owl.png',
  bullfinch: 'https://images.jeongwoo.in/profiles/bullfinch.png',
  crab: 'https://images.jeongwoo.in/profiles/crab.png',
  panda: 'https://images.jeongwoo.in/profiles/panda.png',
  whale: 'https://images.jeongwoo.in/profiles/whale.png',
  ladybug: 'https://images.jeongwoo.in/profiles/ladybug.png',
  frog: 'https://images.jeongwoo.in/profiles/frog.png',
  giraffe: 'https://images.jeongwoo.in/profiles/giraffe.png',
  beetle: 'https://images.jeongwoo.in/profiles/beetle.png',
  snake: 'https://images.jeongwoo.in/profiles/snake.png',
  chicken: 'https://images.jeongwoo.in/profiles/chicken.png',
  spider: 'https://images.jeongwoo.in/profiles/spider.png',
  penguin: 'https://images.jeongwoo.in/profiles/penguin.png',
  rabbit: 'https://images.jeongwoo.in/profiles/rabbit.png',
  lama: 'https://images.jeongwoo.in/profiles/lama.png',
  fox: 'https://images.jeongwoo.in/profiles/fox.png',
  flamingo: 'https://images.jeongwoo.in/profiles/flamingo.png',
  rhino: 'https://images.jeongwoo.in/profiles/rhino.png',
  dog: 'https://images.jeongwoo.in/profiles/dog.png',
  beaver: 'https://images.jeongwoo.in/profiles/beaver.png',
  gorilla: 'https://images.jeongwoo.in/profiles/gorilla.png',
  zebra: 'https://images.jeongwoo.in/profiles/zebra.png',
};
