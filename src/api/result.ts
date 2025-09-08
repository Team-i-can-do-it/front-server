import ApiClient from '@_api/ApiClient';

export type MyResult = { name: string; score: number };

export async function getMyResult(): Promise<MyResult> {
  const { data } = await ApiClient.get('/results/me');
  return data;
}
