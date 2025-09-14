// 이거 네이밍 스네이크로 헤야할지 카멜로해야할지 모르겠ㄷ.
import { usePurchaseHistory } from '@_hooks/usePurchaseHistory';

type MyPurchaseHistoryProps = {};

function formatPhone(raw: string) {
  if (!raw) return '';

  // 1) 마스킹 번호 처리(예: 010****1234 → 010-****-1234)
  const masked = raw.replace(/[^\d*]/g, '');
  if (/^\d{3}\*+\d{4}$/.test(masked)) {
    return masked.replace(/^(\d{3})(\*+)(\d{4})$/, '$1-$2-$3');
  }

  // 2) +82 / 82 국제번호 → 국내 표기
  let s = raw.trim().replace(/\s+/g, '');
  s = s.replace(/^\+82/, '0').replace(/^82/, '0');

  // 3) 숫자만 추출 후 길이별 하이픈 포맷
  const d = s.replace(/\D/g, '');
  if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'); // 010-1234-5678
  if (d.length === 10)
    return d.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3'); // 02-1234-5678 / 031-123-4567 등

  return raw;
}

export default function MyPurchaseHistory({}: MyPurchaseHistoryProps) {
  // const MOCK_PURCHASE_HISTORY: PurchaseHistory[] = [

  //   {
  //     id: '1',
  //     date: '2025-08-08',
  //     productName: 'CU 모바일 상품권',
  //     brandName: 'CU',
  //     price: 3000,
  //     phoneNumber: '010-0000-0000',
  //     imageUrl: '/images/gacha.svg',
  //   },
  //   {
  //     id: '2',
  //     date: '2025-07-20',
  //     productName: '올리브영 모바일 상품권',
  //     brandName: '올리브영',
  //     price: 5000,
  //     phoneNumber: '010-1111-2222',
  //     imageUrl: '/images/gacha.svg',
  //   },
  // ];

  const { data, isLoading, isError } = usePurchaseHistory();
  const list = data ?? [];
  const hasData = list.length > 0;

  if (isLoading) {
    return (
      <div className="pt-9 px-2">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-bg-10" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-9 px-2">
        <p className="text-center text-status-danger typo-body2-r-16 py-10">
          구매 내역을 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-9">
      {hasData ? (
        list.map((data) => (
          <section
            key={data.id}
            className="mb-5 flex flex-col gap-4 border-b border-border-25"
          >
            <p className="typo-h3-sb-18 text-text-900">{data.date}</p>
            <div className="flex gap-5 p-3 mb-5">
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                {data.imageUrl && (
                  <img
                    src={data.imageUrl}
                    alt={data.productName}
                    className="size-20 object-contain"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="typo-label4-m-12 text-text-200">
                  {data.brandName}
                </p>
                <p className="typo-h4-sb-16 text-black-base">
                  {data.productName}
                </p>
                <p className="typo-h4-sb-16 text-brand-violet-500 mt-1">
                  {data.price.toLocaleString()} point
                </p>
                <p className="typo-label4-m-14 text-text-200 mt-1">
                  {formatPhone(data.phoneNumber)}
                </p>
              </div>
            </div>
          </section>
        ))
      ) : (
        <p className="text-center text-text-400 typo-body2-r-16 py-10">
          구매 내역이 없습니다.
        </p>
      )}
    </div>
  );
}
