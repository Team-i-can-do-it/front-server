import type { Product } from '@_types/product';

export function getDDay(expireDate: string): string {
  const today = new Date();
  const target = new Date(expireDate);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return '만료됨';
  if (days === 0) return 'D-Day';
  return `D-${days}`;
}

export function isSoldout(product: Product): boolean {
  return product.status === 'soldout';
}
