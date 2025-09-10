import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterTab from '@_pageComponent/gacha/FilterTab';
import ProductCard from '@_pageComponent/gacha/ProductCard';

export default function GachaPage() {
  const [filter, setFilter] = useState<'high' | 'low'>('low');
  const navigate = useNavigate();

  const products = [
    { id: 1, name: '레어 아이템', price: 5000, img: '/item1.png' },
    { id: 2, name: '노말 아이템', price: 1000, img: '/item2.png' },
  ];

  const sorted = [...products].sort((a, b) =>
    filter === 'high' ? b.price - a.price : a.price - b.price,
  );

  return (
    <main
      className="flex flex-col justify-between gpa-1
    py-3"
    >
      <div className="flex justify-end">
        <FilterTab filter={filter} onChange={setFilter} />
      </div>
      <div>
        <ul className="mt-4 grid grid-cols-2 gap-4">
          {sorted.map((p) => (
            <li key={p.id}>
              <ProductCard
                product={p}
                onClick={() => navigate(`/gacha/${p.id}`)}
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
