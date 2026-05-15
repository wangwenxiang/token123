import type { PaymentMethod } from '../types/index.ts';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  alipay: 'Alipay',
  wechat: 'Wechat',
  crypto: 'Crypto',
  creditcard: 'Visa',
};

export function getPaymentMethodLabels(paymentMethods: PaymentMethod[]): string[] {
  if (paymentMethods.length === 0) {
    return [];
  }
  return paymentMethods.map((method) => PAYMENT_METHOD_LABELS[method]);
}

export function getMinRechargeLabel(minRecharge: string | null): string | null {
  if (!minRecharge) {
    return null;
  }
  const value = minRecharge.trim();
  if (!value || value === '未知') {
    return null;
  }
  return value.endsWith('起') || value === '免费' ? value : `${value} 起`;
}

export function getFreeTierLabel(hasFreeTier: boolean | null): string | null {
  if (hasFreeTier === true) {
    return '免费试用';
  }
  if (hasFreeTier === false) {
    return '无免费额度';
  }
  return null;
}

export function getVerificationLabel(lastVerified: string | null): string | null {
  if (!lastVerified) {
    return null;
  }
  return `核验：${lastVerified}`;
}

export function isVerificationStale(lastVerified: string | null, now = new Date()): boolean {
  if (!lastVerified) {
    return false;
  }
  const verifiedAt = new Date(`${lastVerified}T00:00:00Z`);
  if (Number.isNaN(verifiedAt.getTime())) {
    return false;
  }
  const ageMs = now.getTime() - verifiedAt.getTime();
  return ageMs > 30 * 24 * 60 * 60 * 1000;
}
