type Props = {
  product: { id: number; name: string; price: number; img: string };
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow hover:shadow-md transition flex flex-col items-center p-3"
    >
      <img
        src={product.img}
        alt={product.name}
        className="w-20 h-20 object-contain mb-2"
      />
      <p className="typo-body3-r-14 text-text-700">{product.name}</p>
      <p className="typo-body2-r-16 text-brand-violet-500">
        {product.price.toLocaleString()}원
      </p>
    </button>
  );
}
