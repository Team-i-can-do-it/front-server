import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterTab from '@_pageComponent/gacha/FilterTab';
import ProductCard from '@_pageComponent/gacha/ProductCard';
import { useToast } from '@_hooks/useToast';
import { useAuthStore } from '@_store/authStore';
import { useGacha } from '@_hooks/useGacha';
import type { Product } from '@_types/product';
import type { ItemGetType } from '@_api/GachaApiClient';

type UiFilter = 'low' | 'high';

export default function GachaPage() {
  const [filter, setFilter] = useState<UiFilter>('low'); // 기본: 낮은순
  const navigate = useNavigate();
  const toast = useToast();
  const clearAuth = useAuthStore((s) => s.clear);

  const itemGetType: ItemGetType =
    filter === 'high'
      ? 'EXPENSIVE'
      : /* filter === 'popular' ? 'POPULAR' : */ 'CHEAP';

  const { data, isLoading, isError, error } = useGacha(itemGetType);

  // 서버 응답 → 카드 타입
  const products: Product[] = useMemo(() => {
    return (data ?? []).map((x) => ({
      id: x.id,
      product_name: x.name,
      brand_name: '', // 서버에 없음
      discount: 0, // 서버에 없음
      price: x.point,
      img: x.imageUrl || '/images/gacha.svg',
      expireDate: '', // 서버에 없음
      status: x.quantity > 0 ? 'active' : 'soldout',
      count: x.quantity,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <main className="flex flex-col gap-1 py-3">
        <div className="flex justify-end">
          <FilterTab filter={filter} onChange={setFilter} />
        </div>
        <ul className="flex flex-col gap-2 px-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="h-20 rounded-xl bg-bg-10 animate-pulse" />
          ))}
        </ul>
      </main>
    );
  }

  if (isError) {
    // @ts-ignore axios error guard
    const status = error?.response?.status;
    if (status === 401) {
      clearAuth();
      navigate('/welcome', { replace: true });
      toast('로그인이 필요합니다.', 'error');
      return null;
    }
    return (
      <main className="flex flex-col gap-1 py-3">
        <div className="p-6 text-center text-status-danger">
          상점 목록을 불러오지 못했어요.
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-between gap-1 py-3">
      <div className="flex justify-end">
        <FilterTab filter={filter} onChange={setFilter} />
      </div>

      <div>
        {products.length === 0 ? (
          <p className="px-2 typo-body2-r-16 text-text-500">상품이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {products.map((p) => (
              <li key={String(p.id)}>
                <ProductCard
                  product={p}
                  onClick={() =>
                    p.status === 'active' && navigate(`/gacha/${String(p.id)}`)
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
