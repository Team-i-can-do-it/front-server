import VioletTag from '@_components/common/Tag';
import { useToast } from '@_hooks/useToast';
import { type Product } from '@_types/product';
import { getDDay } from '@_utils/productUtils';

type ProductCardProps = {
  product: Product;
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
              {(
                product.price -
                product.price * (product.discount / 100)
              ).toLocaleString()}
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
