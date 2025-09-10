import { useParams, useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: '레어 아이템', price: 5000, img: '/item1.png' },
  { id: 2, name: '노말 아이템', price: 1000, img: '/item2.png' },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p className="p-6">상품을 찾을 수 없습니다.</p>;

  return (
    <main className="mx-auto w-[min(100vw,390px)] py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-500 hover:text-gray-700"
      >
        ← 뒤로가기
      </button>

      <img
        src={product.img}
        alt={product.name}
        className="w-40 h-40 mx-auto mb-6"
      />
      <h1 className="typo-h2-sb-20 text-center">{product.name}</h1>
      <p className="typo-body1-m-20 text-center text-brand-violet-500">
        {product.price.toLocaleString()}원
      </p>

      <button className="mt-6 w-full bg-brand-violet-500 text-white py-3 rounded-lg">
        구매하기
      </button>
    </main>
  );
}
