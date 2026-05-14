'use client';

import React, { useState, useMemo } from 'react';
import type { PaymentMethod, Site } from '@/types';
import SiteCard from './SiteCard';
import { filterSites } from '@/lib/siteFilters';

interface HomeClientProps {
  initialSites: Site[];
}

const CATEGORIES = [
  { label: '全部', value: 'all' },
  { label: 'GPT', value: 'gpt' },
  { label: 'Claude', value: 'claude' },
  { label: 'Gemini', value: 'gemini' },
  { label: '多模型', value: 'multi' },
  { label: '国产模型', value: 'domestic' },
];

const PAYMENT_FILTERS: { label: string; value: PaymentMethod }[] = [
  { label: '支付宝', value: 'alipay' },
  { label: '微信', value: 'wechat' },
];

export default function HomeClient({ initialSites }: HomeClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [onlyFreeTier, setOnlyFreeTier] = useState(false);

  const featuredSites = useMemo(() => {
    return initialSites.filter((site) => site.featured);
  }, [initialSites]);

  const displayedSites = useMemo(() => {
    return filterSites(initialSites, {
      category: activeCategory,
      searchTerm,
      paymentMethods: selectedPaymentMethods,
      onlyFreeTier,
    });
  }, [initialSites, activeCategory, searchTerm, selectedPaymentMethods, onlyFreeTier]);

  const togglePaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethods((current) =>
      current.includes(method)
        ? current.filter((item) => item !== method)
        : [...current, method],
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Compact Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4 sm:pt-8 sm:pb-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              AI Token 中转站<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">导航</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-2xl mx-auto">
              汇集全网优质 API 中转服务，快速对比价格与支持模型
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="搜索中转站名称或模型..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50/60 px-4 py-3">
          <h2 className="text-sm font-bold text-indigo-950 mb-2">怎么选中转站？</h2>
          <div className="grid gap-2 text-xs sm:grid-cols-3 text-indigo-900">
            <p><span className="font-semibold">1.</span> 先挑「免费试用」的，零成本试。</p>
            <p><span className="font-semibold">2.</span> 看支付是否方便，避免注册后不能付。</p>
            <p><span className="font-semibold">3.</span> 小额充值测模型质量，别一次充太多。</p>
          </div>
        </section>
        
        {/* 精选推荐区 - 常驻显示 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </span>
              精选推荐
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {featuredSites.map((site) => (
              <div key={site.name} className="relative">
                <SiteCard site={site} />
              </div>
            ))}
          </div>
        </section>

        {/* Categories / Filter Section */}
        <section className="mb-6">
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {searchTerm ? '搜索结果' : '所有站点'}
            </h2>
            
            {/* Category Tabs */}
            <div className="hidden sm:flex p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeCategory === cat.value
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-900/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ring-1 ring-inset transition-colors ${
                onlyFreeTier
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                  : 'bg-gray-50 text-gray-600 ring-gray-500/10 hover:bg-gray-100'
              }`}>
                <input
                  type="checkbox"
                  checked={onlyFreeTier}
                  onChange={(event) => setOnlyFreeTier(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                仅看免费额度
              </label>

              {PAYMENT_FILTERS.map((method) => {
                const active = selectedPaymentMethods.includes(method.value);
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => togglePaymentMethod(method.value)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ring-1 ring-inset transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                        : 'bg-gray-50 text-gray-600 ring-gray-500/10 hover:bg-gray-100'
                    }`}
                  >
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Mobile Category Dropdown (simplified as a scrollable row for now) */}
          <div className="sm:hidden -mx-4 px-4 overflow-x-auto mt-4 pb-2">
            <div className="flex space-x-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 whitespace-nowrap text-sm font-medium rounded-full border ${
                    activeCategory === cat.value
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Site Grid */}
        <section>
          {displayedSites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedSites.map((site) => (
                <SiteCard key={site.name} site={site} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">未找到相关中转站</h3>
              <p className="text-gray-500">尝试更换搜索词或选择其他分类</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                  setSelectedPaymentMethods([]);
                  setOnlyFreeTier(false);
                }}
                className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                清除所有过滤条件 &rarr;
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
