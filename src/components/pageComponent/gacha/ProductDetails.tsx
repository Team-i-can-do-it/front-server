import VioletTag from '@_components/common/Tag';
import { getDDay } from '@_utils/productUtils';
import { isSoldout } from '@_utils/productUtils';
import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomSheet from './BottomSheet';
import useModalStore from '@_store/dialogStore';
import { useToast } from '@_hooks/useToast';
import { useAuthStore } from '@_store/authStore';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getGachaItem,
  type GachaDetail,
  buyGachaItem,
} from '@_api/GachaApiClient';

import { getMyPage, type MyPageResult } from '@_api/MemberApiClient';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const clearAuth = useAuthStore((s) => s.clear);
  const qc = useQueryClient();

  // 상품 상세
  const { data, isLoading, isError, error } = useQuery<GachaDetail>({
    queryKey: ['point-shop', 'detail', id ?? ''],
    queryFn: () => getGachaItem(id as string),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1,
  });

  // 내 포인트
  const { data: me } = useQuery<MyPageResult>({
    queryKey: ['my-page'],
    queryFn: getMyPage,
    staleTime: 60_000,
    retry: 1,
  });
  const myPoint = me?.point ?? 0;

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

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    return Math.max(
      0,
      Math.round((product.price * (100 - product.discount)) / 100),
    );
  }, [product]);

  const expired = useMemo(() => {
    if (!product?.expireDate) return false;
    const end = new Date(product.expireDate);
    end.setHours(23, 59, 59, 999);
    return new Date() > end;
  }, [product?.expireDate]);

  const [open, setOpen] = useState(false);

  // 구매 mutation (v4/v5 상태 호환)
  const { mutate: purchase, isPending } = useMutation({
    // ❌ 잘못된 코드: buyGachaItem(vars.itemId, { phone: String })
    // ✅ 올바른 호출: 두 번째 인자는 '문자열 phone' 이여야 함
    mutationFn: async (vars: {
      itemId: string;
      phone?: string;
      finalPrice: number;
    }) => buyGachaItem(vars.itemId, vars.phone),

    onMutate: async (vars) => {
      if (import.meta.env.DEV) {
        console.groupCollapsed('[BUY][onMutate] optimistic update');
        console.log('vars', vars);
        console.groupEnd();
      }
      await Promise.all([
        qc.cancelQueries({ queryKey: ['my-page'] }),
        qc.cancelQueries({ queryKey: ['point-shop', 'detail', id ?? ''] }),
      ]);

      const prevMe = qc.getQueryData<MyPageResult>(['my-page']);
      const prevDetail = qc.getQueryData<GachaDetail>([
        'point-shop',
        'detail',
        id ?? '',
      ]);

      if (prevMe) {
        qc.setQueryData(['my-page'], {
          ...prevMe,
          point: Math.max(0, (prevMe.point ?? 0) - vars.finalPrice),
        } as MyPageResult);
      }
      if (prevDetail) {
        qc.setQueryData(['point-shop', 'detail', id ?? ''], {
          ...prevDetail,
          quantity: Math.max(0, (prevDetail.quantity ?? 0) - 1),
        } as GachaDetail);
      }

      return { prevMe, prevDetail };
    },
    onError: (err: any, vars, ctx) => {
      if (import.meta.env.DEV) {
        console.groupCollapsed('[BUY][FAIL]');
        console.log('request.vars', vars);
        if (err?.response) {
          const { status, data, headers, config } = err.response;
          console.log('response.status', status);
          console.log('response.data', data);
          console.log('response.headers', headers);
          console.log('response.config', {
            url: config?.url,
            method: config?.method,
            params: config?.params,
            data: config?.data,
          });
        } else {
          console.log('no response (network error?)', err?.message);
        }
        console.error('error object', err);
        console.groupEnd();
      }
      if (ctx?.prevMe) qc.setQueryData(['my-page'], ctx.prevMe);
      if (ctx?.prevDetail)
        qc.setQueryData(['point-shop', 'detail', id ?? ''], ctx.prevDetail);

      const status = err?.response?.status;
      if (status === 401) {
        clearAuth();
        navigate('/welcome', { replace: true });
        toast('로그인이 필요합니다.', 'error');
        return;
      }
      if (status === 400)
        toast('포인트가 부족하거나 요청이 올바르지 않습니다.', 'error');
      else if (status === 404) toast('상품을 찾을 수 없습니다.', 'error');
      else if (status === 409)
        toast('품절되었거나 구매 조건을 만족하지 않습니다.', 'error');
      else if (status === 410) toast('유효기간이 만료된 상품입니다.', 'error');
      else toast('결제에 실패했습니다. 다시 시도해주세요.', 'error');
    },
    onSuccess: () => {
      if (import.meta.env.DEV) console.debug('[BUY][SUCCESS]');
      openPurchaseComplete();
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['my-page'] });
      qc.invalidateQueries({ queryKey: ['point-history'] });
      qc.invalidateQueries({ queryKey: ['point-shop', 'detail', id ?? ''] });
      qc.invalidateQueries({ queryKey: ['point-shop', 'list'] });
    },
  });

  const isBuying = isPending;

  const openPurchaseConfirm = (phone?: string) => {
    if (!product) return;
    if (product.status === 'soldout' || expired) {
      toast('구매할 수 없는 상품입니다.', 'error');
      return;
    }
    if (isBuying) return;

    if (myPoint < finalPrice) {
      toast('포인트가 부족합니다.', 'error');
      return;
    }

    useModalStore.getState().open({
      title: '주문 확인',
      description: (
        <>
          <p className="mb-1">
            내 포인트{' '}
            <span className="text-brand-violet-500 font-semibold">
              {myPoint.toLocaleString()}P
            </span>
            중{' '}
            <span className="font-semibold">
              {finalPrice.toLocaleString()}P
            </span>{' '}
            를 사용해 구매하시겠어요?
          </p>
          <p className="text-gray-500">
            결제 후 잔액 <b>{(myPoint - finalPrice).toLocaleString()}P</b>
          </p>
        </>
      ),
      buttonLayout: 'doubleVioletCancel',
      cancelText: '취소',
      confirmText: isBuying ? '구매 중…' : '구매하기',
      onConfirm: () => {
        purchase({ itemId: String(product.id), phone, finalPrice });
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

  // ===== 렌더링 =====
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
  if (!product) return <p className="p-6">상품을 찾을 수 없습니다.</p>;

  const soldout = isSoldout(product);
  const buyDisabled = soldout || expired || isBuying;

  return (
    <main>
      <div className="flex flex-col">
        <div className="p-6 bg-[#fafafa]">
          <VioletTag
            size="sm"
            label={soldout ? 'D-0' : getDDay(product.expireDate)}
          />
          <img
            src={product.img}
            alt={product.product_name}
            className="w-[50%] h-[50%] mx-auto pt-4 pb-12"
          />
        </div>

        <div className="px-6 flex flex-col justify-between">
          <div className="flex flex-col items-start my-6">
            <p className="typo-label4-m-12 text-[#8b8b8b]">
              {product.brand_name}
            </p>
            <h1 className="typo-h3-sb-20 text-center pb-3">
              {product.product_name}
            </h1>

            {product.discount > 0 && (
              <p className="typo-label4-m-12 text-status-danger pb-1">
                {product.discount}%{' '}
                <span className="ml-2 typo-label4-m-12 text-[#8b8b8b] line-through">
                  {product.price.toLocaleString()} point
                </span>
              </p>
            )}

            <p className="typo-h2-sb-20 text-black-base">
              {finalPrice.toLocaleString()}
              <span className="ml-0.5 typo-h4-sb-16 text-brand-violet-400">
                point
              </span>
            </p>
          </div>

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
                  - 인식 불가 시, 바코드 하단 번호 입력으로 결제 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 z-50 w-[min(100vw,var(--mobile-w))] pb-10 px-6 py-3 bg-white border-t border-border-25">
        <button
          disabled={buyDisabled}
          onClick={() => setOpen(true)}
          className={`w-full typo-button-b-16 py-3 rounded-xl cursor-pointer ${
            buyDisabled
              ? 'bg-material-dimmed/50 cursor-not-allowed'
              : 'bg-material-dimmed hover:bg-brand-violet-500'
          } text-white transition-colors duration-200 ease-out`}
        >
          {expired
            ? '구매 불가(기간 만료)'
            : soldout
            ? '품절'
            : isBuying
            ? '구매 중…'
            : '구매하기'}
        </button>
      </div>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={(phone) => {
          setOpen(false);
          openPurchaseConfirm(phone);
        }}
      />
    </main>
  );
}
