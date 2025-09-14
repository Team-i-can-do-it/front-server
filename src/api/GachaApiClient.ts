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
/* =========================
   구매 내역 조회
   서버 응답: /pointShop/pointHistory
   {
     "status": ...,
     "message": "...",
     "result": [
       { "createdAt": "2025-09-14T21:32:15.983Z", "name": "string", "imageUrl": "string", "point": 1234, "number": "string" }
     ]
   }
   ========================= */
export type PurchaseHistory = {
  id: string; // 합성 id (createdAt+idx) 또는 서버 제공 id
  date: string; // YYYY-MM-DD
  productName: string; // name -> productName
  brandName: string; // name에서 첫 토큰 추출
  price: number; // point의 절대값 (표시는 화면에서 - 처리)
  phoneNumber: string; // number 원본
  imageUrl?: string;
};

// 서버 타입
type PurchaseHistoryRaw = {
  createdAt: string;
  name: string;
  imageUrl?: string;
  point: number;
  number: string;
};

function toYMD(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 예: "올리브영 모바일 상품권 (1만원)" -> "올리브영"
function extractBrand(name: string): string {
  const m = String(name)
    .trim()
    .match(/^[^\s(［\[]+/);
  return m ? m[0] : '';
}

function mapRawToHistory(r: PurchaseHistoryRaw, idx: number): PurchaseHistory {
  const date = toYMD(r.createdAt);
  const productName = r.name ?? '';
  const brandName = extractBrand(productName);
  const price = Math.abs(Number(r.point) || 0); // 내부는 양수로 유지
  return {
    id: `${r.createdAt}-${idx}`,
    date,
    productName,
    brandName,
    price,
    phoneNumber: r.number ?? '',
    imageUrl: r.imageUrl,
  };
}

export async function getPurchaseHistory(): Promise<PurchaseHistory[]> {
  const { data } = await ApiClient.get<BaseResponse<PurchaseHistoryRaw[]>>(
    '/pointShop/pointHistory',
  );

  const list = Array.isArray(data?.result) ? data.result : [];
  // 최신순 정렬
  return list
    .map(mapRawToHistory)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
