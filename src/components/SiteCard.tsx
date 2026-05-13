import React, { useState } from 'react';
import { Site, PriceTier } from '@/types';

interface SiteCardProps {
  site: Site;
  className?: string;
}

const PRICE_TIER_CONFIG: Record<PriceTier, { label: string; colorClass: string }> = {
  free: { label: '免费额度', colorClass: 'bg-green-100 text-green-800' },
  budget: { label: '低价优惠', colorClass: 'bg-blue-100 text-blue-800' },
  standard: { label: '标准价格', colorClass: 'bg-gray-100 text-gray-800' },
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
  const logoUrl = `https://icon.horse/icon/${domain}`; // Using a free favicon service as fallback

  return (
    <div className={`flex flex-col p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow h-full ${site.featured ? 'ring-2 ring-blue-400/50 bg-blue-50/10' : ''} ${className}`}>
      {/* Header: Logo and Title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
          {!imageError ? (
            <img 
              src={logoUrl} 
              alt={`${site.name} logo`} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-gray-400 text-lg font-bold">
              {site.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-lg text-gray-900 truncate flex-1" title={site.name}>
          {site.name}
        </h3>
      </div>

      {/* Tags: Price and Models */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Price Badge */}
        <span className={`px-2 py-1 text-xs font-medium rounded-md ${PRICE_TIER_CONFIG[site.priceTier].colorClass}`}>
          {PRICE_TIER_CONFIG[site.priceTier].label}
        </span>
        
        {/* Model Tags (Max 3) */}
        {site.models.slice(0, 3).map((model) => (
          <span key={model} className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600">
            {MODEL_LABEL_CONFIG[model] || model}
          </span>
        ))}
        {site.models.length > 3 && (
          <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-500">
            +{site.models.length - 3}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1" title={site.description}>
        {site.description}
      </p>

      {/* Footer / Action */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <a 
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          访问
        </a>
      </div>
    </div>
  );
}
