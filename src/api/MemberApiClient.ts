import ApiClient from '@_api/ApiClient';

export type MyPageResponse = {
  status: number;
  message: string;
  result: {
    name: string;
    point: number;
    // 백엔드가 64-bit 쓰면 문자열이 안전함 (JS 정밀도 이슈)
    mbtiId: number | string;
    mbtiName: string;
  };
};

export async function getMyPage() {
  const { data } = await ApiClient.get<MyPageResponse>('/member/myPage');
  return data.result; // { name, point, mbtiId, mbtiName }
}
