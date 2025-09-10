import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterTab from '@_pageComponent/gacha/FilterTab';
import ProductCard from '@_pageComponent/gacha/ProductCard';

export default function GachaPage() {
  const [filter, setFilter] = useState<'high' | 'low'>('low');
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      product_name: 'CU 모바일 상품권',
      brand_name: 'CU',
      discount: 10,
      price: 2000,
      img: '/images/gacha.svg',
      expireDate: '2025-09-15',
      status: 'active' as const,
    },
    {
      id: 2,
      product_name: '올리브영 모바일 상품권',
      brand_name: '올리브영',
      discount: 10,
      price: 3000,
      img: '/images/gacha.svg',
      expireDate: '2025-09-30',
      status: 'soldout' as const,
    },
    {
      id: 3,
      product_name: '도서문화상품권',
      brand_name: '북앤라이프',
      discount: 10,
      price: 4000,
      img: '/images/gacha.svg',
      expireDate: '2025-09-12',
      status: 'active' as const,
    },
  ];

  const sorted = [...products].sort((a, b) =>
    filter === 'high' ? b.price - a.price : a.price - b.price,
  );

  return (
    <main
      className="flex flex-col justify-between gap-1
    py-3"
    >
      <div className="flex justify-end">
        <FilterTab filter={filter} onChange={setFilter} />
      </div>
      <div>
        <ul className="flex flex-col gap-2 ">
          {sorted.map((p) => (
            <li key={p.id}>
              <ProductCard
                product={p}
                onClick={() => {
                  if (p.status === 'active') navigate(`/gacha/${p.id}`);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
