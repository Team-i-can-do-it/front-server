import VioletTag from '@_components/common/Tag';
import { useToast } from '@_hooks/useToast';

type ProductCardProps = {
  product: {
    id: number;
    product_name: string;
    brand_name: string;
    discount: number;
    price: number;
    img: string;
    expireDate: string;
    status: 'active' | 'soldout';
  };
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const toast = useToast();
  const isSoldout = product.status === 'soldout';

  const handleClick = () => {
    if (isSoldout) {
      toast('판매가 완료된 상품이에요', 'info');
      return;
    }
    onClick();
  };

  function getDDay(expireDate: string) {
    const today = new Date();
    const target = new Date(expireDate);

    // 자정 기준으로 계산 (시분초 무시)
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return '만료됨';
    if (days === 0) return 'D-Day';
    return `D-${days}`;
  }

  return (
    <article
      className="bg-white p-2  border-b border-border-25
    hover:shadow-md transition"
    >
      {/* 유효기간 태그 */}
      {product.expireDate && (
        <VioletTag
          size="sm"
          // 판매완료면 무조건 D-0
          label={isSoldout ? 'D-0' : getDDay(product.expireDate)}
        />
      )}
      <button
        onClick={handleClick}
        className="relative w-full flex gap-5 items-center pt-2 py-2 px-5 cursor-pointer"
      >
        {/* 이미지 + soldout 오버레이 */}
        <div className="relative w-[100px] h-[80px] shrink-0">
          <img
            src={product.img}
            alt={product.product_name}
            className={`w-full h-full object-cover ${
              isSoldout ? 'opacity-50 grayscale' : ''
            }`}
          />
          {isSoldout && (
            <div className="absolute inset-0 flex items-center justify-center bg-material-dimmed">
              <VioletTag label={'판매완료'} />
            </div>
          )}
        </div>

        {/* 텍스트영역 */}
        <div className="flex flex-col text-left">
          <div className="mb-3">
            <p className="typo-label4-m-12 text-text-200">
              {product.brand_name}
            </p>
            <p className="typo-h4-sb-16 text-black-base">
              {product.product_name}
            </p>
          </div>
          <div className="flex gap-0.5">
            <p className="typo-h3-sb-18 text-status-danger">
              {product.discount}%
            </p>
            <p className="typo-h3-sb-18 text-black-base">
              {product.price.toLocaleString()}
              <span className="ml-0.5 typo-h4-sb-16 text-brand-violet-400">
                point
              </span>
            </p>
          </div>
        </div>
      </button>
    </article>
  );
}
