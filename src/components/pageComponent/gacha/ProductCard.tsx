import VioletTag from '@_components/common/Tag';

type ProductCardProps = {
  product: {
    id: number;
    product_name: string;
    brand_name: string;
    discount: number;
    price: number;
    img: string;
  };
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <article
      className="bg-white p-2  border-b border-border-25
    hover:shadow-md transition"
    >
      <VioletTag size="sm" label={'D-2'}></VioletTag>
      <button
        onClick={onClick}
        className="w-full flex gap-5 items-center pt-2 py-2 px-5"
      >
        <img
          src={product.img}
          alt={product.product_name}
          className="w-[100px] h-[80px]"
        />
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
