// 이거 네이밍 스네이크로 헤야할지 카멜로해야할지 모르겠ㄷ.

type PurchaseHistory = {
  id: string;
  date: string; // 구매 날짜 (YYYY-MM-DD)
  productName: string;
  brandName: string;
  price: number; // 포인트
  phoneNumber: string;
  imageUrl?: string; // 상품 이미지
};

export default function MyPurchaseHistory() {
  const MOCK_PURCHASE_HISTORY: PurchaseHistory[] = [
    {
      id: '1',
      date: '2025-08-08',
      productName: 'CU 모바일 상품권',
      brandName: 'CU',
      price: 3000,
      phoneNumber: '010-0000-0000',
      imageUrl: '/images/gacha.svg',
    },
    {
      id: '2',
      date: '2025-07-20',
      productName: '올리브영 모바일 상품권',
      brandName: '올리브영',
      price: 5000,
      phoneNumber: '010-1111-2222',
      imageUrl: '/images/gacha.svg',
    },
  ];
  const hasData = MOCK_PURCHASE_HISTORY.length > 0;

  return (
    <div className="pt-9">
      {hasData ? (
        MOCK_PURCHASE_HISTORY.map((data) => (
          <section key={data.id} className="mb-5 flex flex-col gap-4">
            <p className="typo-h3-sb-18 text-text-900">{data.date}</p>
            <div className="flex gap-5 p-3 mb-5">
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                {data.imageUrl && (
                  <img
                    src={data.imageUrl}
                    alt={data.productName}
                    className="size-20 object-contain"
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
                  {data.phoneNumber}
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
