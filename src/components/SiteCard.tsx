import React, { useState } from 'react';
import type { Site, PriceTier } from '@/types';
import {
  getFreeTierLabel,
  getMinRechargeLabel,
  getPaymentMethodLabels,
  getVerificationLabel,
  isVerificationStale,
} from '@/lib/siteDisplay';

interface SiteCardProps {
  site: Site;
  featured?: boolean;
  className?: string;
}

const PRICE_TIER_CONFIG: Record<PriceTier, { label: string; colorClass: string }> = {
  free: { label: '免费额度', colorClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' },
  budget: { label: '低价优惠', colorClass: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20' },
  standard: { label: '标准价格', colorClass: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-500/10' },
};

const MODEL_LABEL_CONFIG: Record<string, string> = {
  gpt: 'GPT',
  claude: 'Claude',
  gemini: 'Gemini',
  multi: '多模型',
  domestic: '国产',
};

const PAYMENT_ICON_CONFIG: Record<string, string> = {
  Alipay: 'A',
  Wechat: '微',
  Crypto: '币',
  Visa: '卡',
};

export default function SiteCard({ site, featured = false, className = '' }: SiteCardProps) {
  const [imageError, setImageError] = useState(false);
  const isFeatured = featured || site.featured;
  const domain = new URL(site.url).hostname;
  const logoUrl = `https://icon.horse/icon/${domain}`;
  const paymentLabels = getPaymentMethodLabels(site.paymentMethods);
  const freeTierLabel = getFreeTierLabel(site.hasFreeTier);
  const minRechargeLabel = getMinRechargeLabel(site.minRecharge);
  const verificationLabel = getVerificationLabel(site.lastVerified);
  const staleVerification = isVerificationStale(site.lastVerified);

  return (
    <div className={`group relative flex flex-col rounded-xl border bg-white hover:shadow-md transition-shadow duration-200 h-full ${
      isFeatured
        ? 'p-4 border-indigo-100 shadow-sm ring-1 ring-indigo-400/40'
        : 'p-3 border-gray-100'
    } ${className}`}>
      
      {/* Featured Badge (Optional purely visual touch) */}
      {isFeatured && (
        <div className="absolute top-0 right-6 -translate-y-1/2">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 shadow-sm">
            精选
          </span>
        </div>
      )}

      {/* Header: Logo and Title */}
      <div className="flex items-center gap-3 mb-2 relative">
        <div className="w-8 h-8 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <img 
              src={logoUrl} 
              alt={`${site.name} logo`} 
              className="w-5 h-5 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-gray-400 text-sm font-bold bg-gray-50 w-full h-full flex items-center justify-center">
              {site.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h3 className="font-bold text-sm text-gray-900 truncate flex-1 tracking-tight" title={site.name}>
          {site.name}
        </h3>
      </div>

      {/* Tags: Price and Models */}
      <div className="flex flex-wrap gap-1 mb-2">
        {/* Price Badge */}
        <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-md ${PRICE_TIER_CONFIG[site.priceTier].colorClass}`}>
          {PRICE_TIER_CONFIG[site.priceTier].label}
        </span>
        
        {/* Model Tags (Max 3) */}
        {site.models.slice(0, 3).map((model) => (
          <span key={model} className="px-1.5 py-0.5 text-xs font-medium rounded-md bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {MODEL_LABEL_CONFIG[model] || model}
          </span>
        ))}
        {site.models.length > 3 && (
          <span className="px-1.5 py-0.5 text-xs font-medium rounded-md bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-500/10">
            +{site.models.length - 3}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-2 line-clamp-2 flex-1" title={site.description}>
        {site.description}
      </p>

      {isFeatured && site.featuredReason && (
        <div className="mb-2 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
          推荐理由：{site.featuredReason}
        </div>
      )}

      {/* Trial decision signals */}
      <div className="space-y-1.5 mb-2 text-xs">
        <div className="flex flex-wrap gap-1">
          {paymentLabels.map((label) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium ring-1 ring-inset ${
                label === '支付方式未验证'
                  ? 'bg-gray-50 text-gray-500 ring-gray-500/10'
                  : 'bg-blue-50 text-blue-700 ring-blue-600/15'
              }`}
            >
              {label !== '支付方式未验证' && (
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-white/70 text-[10px] leading-none">
                  {PAYMENT_ICON_CONFIG[label] || '付'}
                </span>
              )}
              {label}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-500">
          <span>{minRechargeLabel}</span>
          <span
            className={`inline-flex rounded-md px-1.5 py-0.5 font-medium ${
              site.hasFreeTier === true
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                : site.hasFreeTier === null
                  ? 'bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-500/10'
                  : 'text-gray-500'
            }`}
          >
            {freeTierLabel}
          </span>
        </div>

        <div className={`flex flex-wrap items-center gap-1 ${staleVerification ? 'text-amber-700' : 'text-gray-400'}`}>
          <span>{verificationLabel}</span>
          {staleVerification && <span>信息可能过期</span>}
        </div>
      </div>

      {/* Featured Reason */}
      {featured && site.featuredReason && (
        <div className="mb-2 text-xs text-indigo-600/80 leading-relaxed">
          {site.featuredReason}
        </div>
      )}

      {/* Footer / Action */}
      <div className="mt-auto pt-2 border-t border-gray-100/80">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-1.5 px-3 bg-gray-50 hover:bg-gray-900 text-gray-700 hover:text-white text-xs font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          访问官网
          <svg className="ml-1 w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
