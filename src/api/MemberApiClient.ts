import ApiClient from '@_api/ApiClient';

export type MyPageResponse = {
  status: number;
  message: string;
  result: {
    name: string;
    point: number;
    mbtiId: number | string;
    mbtiName: string;
  };
};

export type MyPageResult = {
  name: string;
  point: number;
  mbtiId: number | string;
  mbtiName: string;
};

export async function getMyPage() {
  const { data } = await ApiClient.get<MyPageResponse>('/member/myPage');
  return data.result; // { name, point, mbtiId, mbtiName }
}
