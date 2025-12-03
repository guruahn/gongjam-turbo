import { createClient } from '@supabase/supabase-js';
import type {
  GuestbookEntry,
  GuestbookFormData,
  GuestbookStatus,
} from '../types/guestbook';

// Supabase 클라이언트 초기화
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase environment variables are not set. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_KEY.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function fetchGuestbookEntries(page: number, limit: number) {
  const { data, error, count } = await supabase
    .from('guestbook_entries_masked')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    throw new Error(`Failed to fetch guestbook entries: ${error.message}`);
  }

  return {
    entries: (data || []) as GuestbookEntry[],
    total: count || 0,
    hasMore: (count || 0) > (page + 1) * limit,
  };
}

// 방명록 엔트리 생성
export async function createGuestbookEntry(formData: GuestbookFormData) {
  // profile_image를 URL로 변환
  const { PROFILE_IMAGE_URLS } = await import('../types/guestbook');
  const profileImageUrl = PROFILE_IMAGE_URLS[formData.profile_image];
  const body = {
    nickname: formData.nickname,
    profile_image: profileImageUrl,
    message: formData.message,
    status: 'pending',
  };
  console.log('Inserting guestbook entry:', body);

  // const { data, error } = await supabase
  //   .from('guestbook_entries')
  //   .insert({
  //     nickname: formData.nickname,
  //     profile_image: profileImageUrl, // URL 전체 저장
  //     message: formData.message,
  //     status: 'pending', // 명시적으로 status 추가
  //   })
  //   .select()
  //   .single();
  const response = await fetch(`${supabaseUrl}/rest/v1/guestbook_entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey, // ⭐ 익명 키 사용
      Authorization: `Bearer ${supabaseKey}`, // ⭐ 익명 키 사용
    },
    body: JSON.stringify(body),
  });
  // if (error) {
  //   console.error('Supabase insert error:', error);
  //   throw new Error(
  //     `Failed to create guestbook entry: ${error.message} (Code: ${error.code})`
  //   );
  // }

  console.log('Insert successful:');
  return response as Response;
}

// 관리자: 모든 메시지 조회
export async function fetchAllEntries(status?: GuestbookStatus) {
  let query = supabase.from('guestbook_entries').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all entries: ${error.message}`);
  }

  return (data || []) as GuestbookEntry[];
}

// 관리자: 승인/거부
export async function updateEntryStatus(
  entryId: string,
  action: 'approve' | 'reject'
) {
  const updateData =
    action === 'approve'
      ? {
          status: 'approved',
          approved_at: new Date().toISOString(),
        }
      : {
          status: 'rejected',
          rejected_at: new Date().toISOString(),
        };

  const { data, error } = await supabase
    .from('guestbook_entries')
    .update(updateData)
    .eq('id', entryId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update entry status: ${error.message}`);
  }

  return data as GuestbookEntry;
}

// 관리자: 통계 조회
export async function fetchGuestbookStats() {
  const { data: pendingData } = await supabase
    .from('guestbook_entries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { data: approvedData } = await supabase
    .from('guestbook_entries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { data: rejectedData } = await supabase
    .from('guestbook_entries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'rejected');

  return {
    pending: pendingData?.length || 0,
    approved: approvedData?.length || 0,
    rejected: rejectedData?.length || 0,
  };
}
