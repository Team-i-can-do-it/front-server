import VioletTag from '@_components/common/Tag';
import { getDDay } from '@_utils/productUtils';
import { isSoldout } from '@_utils/productUtils';
import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomSheet from './BottomSheet';
import useModalStore from '@_store/dialogStore';
import { useToast } from '@_hooks/useToast';
import { useAuthStore } from '@_store/authStore';

import { useQuery } from '@tanstack/react-query';
import { getGachaItem, type GachaDetail } from '@_api/GachaApiClient';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const clearAuth = useAuthStore((s) => s.clear);

  const { data, isLoading, isError, error } = useQuery<GachaDetail>({
    queryKey: ['point-shop', 'detail', id ?? ''],
    queryFn: () => getGachaItem(id as string),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });

  const product = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return null;
    return {
      id: data.id,
      product_name: data.name,
      brand_name: data.brandName ?? '',
      discount: data.discount ?? 0,
      price: data.point,
      img: data.imageUrl || '/images/gacha.svg',
      expireDate: data.expireDate ?? '',
      status:
        (data.quantity ?? 0) > 0 ? ('active' as const) : ('soldout' as const),
      count: data.quantity ?? 0,
    };
  }, [data]);

  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="h-40 bg-bg-10 animate-pulse rounded mb-4" />
        <div className="h-6 w-28 bg-bg-10 animate-pulse rounded mb-2" />
        <div className="h-6 w-40 bg-bg-10 animate-pulse rounded mb-2" />
        <div className="h-10 w-56 bg-bg-10 animate-pulse rounded" />
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
      <p className="p-6 text-status-danger">상품 정보를 불러오지 못했습니다.</p>
    );
  }
  if (!product) {
    return <p className="p-6">상품을 찾을 수 없습니다.</p>;
  }

  const soldout = isSoldout(product);

  const openPurchaseConfirm = () => {
    useModalStore.getState().open({
      title: '주문 확인',
      description: (
        <>
          <p>
            <span className="text-brand-violet-500 font-semibold">
              {'(내 포인트 총액)'}P
            </span>
            를 사용하여 구매하시겠어요?
          </p>
          <p className="text-gray-500">
            결제후 잔액 {'(내 포인트 총액 - 상품금액)'}
          </p>
        </>
      ),
      buttonLayout: 'doubleVioletCancel',
      cancelText: '취소',
      confirmText: '구매하기',
      onConfirm: async () => {
        try {
          const success = true;
          if (success) openPurchaseComplete();
          else throw new Error('결제 실패');
        } catch (err) {
          console.error('결제 실패:', err);
          toast('결제에 실패했습니다. 다시 시도해주세요.', 'error');
        }
      },
    });
  };

  const openPurchaseComplete = () => {
    useModalStore.getState().open({
      title: '결제가 완료되었습니다',
      description: (
        <>
          <p>주문이 정상적으로 완료되었습니다.</p>
          <p className="text-gray-500">
            상세 내역은 마이페이지에서 확인해 주세요.
          </p>
        </>
      ),
      buttonLayout: 'single',
      confirmText: '닫기',
    });
  };

  return (
    <main>
      <div className="flex flex-col">
        <div className="p-6 bg-[#fafafa]">
          <VioletTag
            size="sm"
            // 판매완료면 무조건 D-0
            label={soldout ? 'D-0' : getDDay(product.expireDate)}
          />
          <img
            src={product.img}
            alt={product.product_name}
            className="w-[50%] h-[50%] mx-auto pt-4 pb-12"
          />
        </div>
        <div className="px-6 flex flex-col justify-between">
          {/* 가격 부분 */}
          <div className="flex flex-col items-start my-6">
            <p className="typo-label4-m-12 text-[#8b8b8b]">
              {product.brand_name}
            </p>
            <h1 className="typo-h3-sb-20 text-center pb-3">
              {product.product_name}
            </h1>
            <p className="typo-label4-m-12 text-status-danger pb-1">
              {product.discount}%{' '}
              <span className="ml-2 typo-label4-m-12 text-[#8b8b8b] line-through">
                {product.price.toLocaleString()} point
              </span>
            </p>

            <p className="typo-h2-sb-20 text-black-base">
              {(
                product.price -
                product.price * (product.discount / 100)
              ).toLocaleString()}
              <span className="ml-0.5 typo-h4-sb-16 text-brand-violet-400">
                point
              </span>
            </p>
          </div>

          {/* 설명부분 */}
          <div className="w-full">
            <div className="flex justify-between py-3 border-b border-border-25">
              <p className="typo-label4-m-14 text-gray-500">잔여수량</p>
              <span className="typo-label2-r-12 text-gray-500">
                {product.count}개
              </span>
            </div>
            <div className="typo-body3-r-14 text-text-200">
              <div className="pb-3">
                <p className="typo-label3-m-14 text-text-500 py-3">이용안내</p>
                <p>- 본 기프트카드는 결제 시 입력한 전화번호로 전송됩니다.</p>
                <p>- 본 기프트카드는 재충전이 불가합니다.</p>
              </div>
              <div className="pb-3">
                <p className="typo-label3-m-14 text-text-500 py-3">결제방법</p>
                <p>
                  - 상품 바코드 스캔 {'>'} 모바일 상품권 바코드 스캔 {'>'}{' '}
                  결제완료
                </p>
                <p>
                  - 바코드 인식이 안될 경우, 바코드 하단의 번호를 입력하여 결제
                  가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 하단 고정 버튼 */}
      <div
        className="fixed bottom-0 z-50 w-[min(100vw,var(--mobile-w))] 
        pb-10 px-6 py-3 bg-white border-t border-border-25"
      >
        <button
          onClick={() => setOpen(true)}
          className="w-full typo-button-b-16 py-3 rounded-xl cursor-pointer
        bg-material-dimmed
        hover:bg-brand-violet-500 text-white 
        transition-colors duration-200 ease-out"
        >
          구매하기
        </button>
      </div>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          openPurchaseConfirm();
        }}
      />
    </main>
  );
}
