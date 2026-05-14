import React, { useState } from 'react';
import { Site, PriceTier } from '@/types';

interface SiteCardProps {
  site: Site;
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

export default function SiteCard({ site, className = '' }: SiteCardProps) {
  const [imageError, setImageError] = useState(false);
  const domain = new URL(site.url).hostname;
  const logoUrl = `https://icon.horse/icon/${domain}`;

  return (
    <div className={`group flex flex-col p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 h-full ${site.featured ? 'ring-2 ring-indigo-500/30 bg-gradient-to-b from-indigo-50/50 to-white' : ''} ${className}`}>
      
      {/* Featured Badge (Optional purely visual touch) */}
      {site.featured && (
        <div className="absolute top-0 right-6 -translate-y-1/2">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 shadow-sm">
            精选
          </span>
        </div>
      )}

      {/* Header: Logo and Title */}
      <div className="flex items-center gap-4 mb-4 relative">
        <div className="w-12 h-12 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <img 
              src={logoUrl} 
              alt={`${site.name} logo`} 
              className="w-8 h-8 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-gray-400 text-xl font-bold bg-gray-50 w-full h-full flex items-center justify-center">
              {site.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h3 className="font-bold text-lg text-gray-900 truncate flex-1 tracking-tight" title={site.name}>
          {site.name}
        </h3>
      </div>

      {/* Tags: Price and Models */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Price Badge */}
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${PRICE_TIER_CONFIG[site.priceTier].colorClass}`}>
          {PRICE_TIER_CONFIG[site.priceTier].label}
        </span>
        
        {/* Model Tags (Max 3) */}
        {site.models.slice(0, 3).map((model) => (
          <span key={model} className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {MODEL_LABEL_CONFIG[model] || model}
          </span>
        ))}
        {site.models.length > 3 && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-500/10">
            +{site.models.length - 3}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1 leading-relaxed" title={site.description}>
        {site.description}
      </p>

      {/* Footer / Action */}
      <div className="mt-auto pt-4 border-t border-gray-100/80">
        <a 
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-900 text-gray-700 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          访问官网
          <svg className="ml-1.5 w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
