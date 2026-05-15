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

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-violet-500', 'bg-cyan-500', 'bg-orange-500',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function SiteCard({ site, featured = false, className = '' }: SiteCardProps) {
  const [imageError, setImageError] = useState(false);
  const isFeatured = featured || site.featured;
  const paymentLabels = getPaymentMethodLabels(site.paymentMethods);
  const freeTierLabel = getFreeTierLabel(site.hasFreeTier);
  const minRechargeLabel = getMinRechargeLabel(site.minRecharge);
  const verificationLabel = getVerificationLabel(site.lastVerified);
  const staleVerification = isVerificationStale(site.lastVerified);
  const trialSignals = [
    ...paymentLabels.map((label) => ({
      key: `payment-${label}`,
      label,
      className: 'text-blue-600',
    })),
    ...(minRechargeLabel
      ? [{ key: 'min-recharge', label: minRechargeLabel, className: '' }]
      : []),
    ...(freeTierLabel
      ? [{
          key: 'free-tier',
          label: freeTierLabel,
          className: site.hasFreeTier === true ? 'text-emerald-600 font-medium' : '',
        }]
      : []),
  ];

  return (
    <div className={`group relative flex rounded-xl border bg-white hover:shadow-md transition-shadow duration-200 ${
      isFeatured
        ? 'p-3 border-indigo-100 shadow-sm ring-1 ring-indigo-400/40'
        : 'p-3 border-gray-100'
    } ${className}`}>

      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-6 -translate-y-1/2 z-10">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 shadow-sm">
            精选
          </span>
        </div>
      )}

      {/* Logo — left column */}
      <div className="w-12 h-12 flex-shrink-0 rounded-xl shadow-sm border border-gray-200/80 flex items-center justify-center overflow-hidden bg-white mr-3">
        {site.logoPath && !imageError ? (
          <img
            src={site.logoPath}
            alt={`${site.name} logo`}
            className="w-8 h-8 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={`w-full h-full flex items-center justify-center text-base font-bold text-white ${getAvatarColor(site.name)}`}>
            {site.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Content — right column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Name + Price */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-sm text-gray-900 truncate tracking-tight" title={site.name}>
            {site.name}
          </h3>
          <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md flex-shrink-0 ${PRICE_TIER_CONFIG[site.priceTier].colorClass}`}>
            {PRICE_TIER_CONFIG[site.priceTier].label}
          </span>
        </div>

        {/* Model Tags */}
        <div className="flex flex-wrap gap-1 mb-1">
          {site.models.slice(0, 3).map((model) => (
            <span key={model} className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {MODEL_LABEL_CONFIG[model] || model}
            </span>
          ))}
          {site.models.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-500/10">
              +{site.models.length - 3}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-1 line-clamp-1" title={site.description}>
          {site.description}
        </p>

        {/* Featured Reason */}
        {isFeatured && site.featuredReason && (
          <p className="text-[11px] text-indigo-600/80 mb-1 leading-snug">
            {site.featuredReason}
          </p>
        )}

        {/* Trial signals — only show when data exists */}
        {trialSignals.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-gray-500 mb-0.5">
            {trialSignals.map((signal, index) => (
              <React.Fragment key={signal.key}>
                {index > 0 && <span className="text-gray-300">·</span>}
                <span className={signal.className}>{signal.label}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {verificationLabel && (
          <div className={`text-[10px] ${staleVerification ? 'text-amber-600' : 'text-gray-400'}`}>
            {verificationLabel}
          </div>
        )}
      </div>

      {/* Visit button — right edge */}
      <div className="flex-shrink-0 flex items-end ml-2">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-900 text-gray-500 hover:text-white text-[10px] font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
        >
          访问
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
