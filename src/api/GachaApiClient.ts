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

export type BaseResponse<T> = {
  status: number;
  message: string;
  result: T;
};

export type ItemGetType = 'CHEAP' | 'EXPENSIVE' | 'POPULAR';

export async function getGacha(itemGetType: ItemGetType) {
  const { data } = await ApiClient.get<{
    status: number;
    message: string;
    result: GachaItem[] | null | undefined;
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

const normalizePhone = (s?: string) => (s ?? '').replace(/\D/g, '');
// 구매 요청 (서버 스펙에 맞춰 body 키 이름 조정 가능)

export async function buyGachaItem(itemId: string, phone?: string) {
  const number = normalizePhone(phone);
  if (!number) {
    // 개발 편의를 위해 콘솔 출력 후 에러
    if (import.meta.env.DEV) console.error('[BUY][ERROR] phone is empty');
    throw new Error('전화번호가 비어있습니다.');
  }

  const url = `/pointShop/${itemId}/buy`;
  const params = { number: String(number) };

  if (import.meta.env.DEV) {
    console.debug('[BUY][REQ]', { url, params });
  }

  try {
    const { data } = await ApiClient.post<BaseResponse<{}>>(url, null, {
      params,
    });
    if (import.meta.env.DEV) console.debug('[BUY][RES]', data);
    return data.result;
  } catch (err: any) {
    // 여기서도 한 번 찍어주면 원인 파악 쉬움
    if (import.meta.env.DEV) {
      console.groupCollapsed('[BUY][AXIOS ERROR]');
      if (err?.response) {
        const { status, data, headers, config } = err.response;
        console.log('status', status);
        console.log('data', data);
        console.log('headers', headers);
        console.log('config', {
          url: config?.url,
          method: config?.method,
          params: config?.params,
          data: config?.data,
        });
      } else {
        console.log('no response (network error?)', err?.message);
      }
      console.error('error object', err);
      console.groupEnd();
    }
    throw err; // 상위(onError)에서 처리
  }
}
