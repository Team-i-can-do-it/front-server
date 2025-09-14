import ApiClient from '@_api/ApiClient';

export type GachaItem = {
  id: number | string;
  name: string;
  imageUrl: string;
  quantity: number;
  point: number;
};

export type GachaDetail = {
  id: number | string;
  name: string;
  imageUrl: string;
  quantity: number;
  point: number;

  brandName?: string;
  discount?: number;
  expireDate?: string;
  description?: string;
};

export type ItemGetType = 'CHEAP' | 'EXPENSIVE' | 'POPULAR';

export async function getGacha(itemGetType: ItemGetType) {
  const { data } = await ApiClient.get<{
    status: number;
    message: string;
    result: GachaItem[] | null | undefined; // ⬅️ 혹시 모를 null
  }>('/pointShop', { params: { itemGetType } });

  const list = data?.result;
  return Array.isArray(list) ? list.filter(Boolean) : [];
}

export async function getGachaItem(itemId: string | number) {
  const { data } = await ApiClient.get<{
    status: number;
    message: string;
    result: GachaDetail;
  }>(`/pointShop/${itemId}`);
  return data.result;
}
