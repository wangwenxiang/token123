'use client';

import React, { useState, useMemo } from 'react';
import type { Site } from '@/types';
import SiteCard from './SiteCard';
import { filterSites, getMainListSites } from '@/lib/siteFilters';

interface HomeClientProps {
  initialSites: Site[];
}

const CATEGORIES = [
  { label: '全部', value: 'all' },
  { label: 'GPT', value: 'gpt' },
  { label: 'Claude', value: 'claude' },
  { label: 'Gemini', value: 'gemini' },
  { label: '多模型', value: 'multi' },
];

export default function HomeClient({ initialSites }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const featuredSites = useMemo(() => {
    return initialSites.filter((site) => site.featured);
  }, [initialSites]);

  const displayedSites = useMemo(() => {
    return filterSites(
      getMainListSites(initialSites),
      {
        category: activeCategory,
        searchTerm: '',
        paymentMethods: [],
        onlyFreeTier: false,
      },
    );
  }, [initialSites, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50/30 via-white to-white selection:bg-indigo-100 selection:text-indigo-900">

      {/* Compact Hero Section */}
      <div className="bg-gradient-to-r from-indigo-50/50 via-white to-blue-50/50 border-b border-indigo-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 pb-3">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 mb-0.5">
              AI Token 中转站<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">导航</span>
            </h1>
            <p className="text-xs text-gray-500">
              汇集优质 API 中转服务，快速对比价格与支持模型
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Featured Strip — ultra compact */}
        <section className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {featuredSites.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50/60 to-white px-3 py-2 hover:shadow-sm hover:border-indigo-200 transition-all"
              >
                <div className="w-8 h-8 flex-shrink-0 rounded-lg shadow-sm border border-gray-200/80 flex items-center justify-center overflow-hidden bg-white">
                  {site.logoPath ? (
                    <img src={site.logoPath} alt="" className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-indigo-500">
                      {site.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-gray-900 truncate">{site.name}</div>
                  <div className="text-[10px] text-gray-500 truncate">{site.featuredReason || site.description}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Categories & Filters */}
        <section className="mb-6">
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              所有站点
            </h2>

            {/* Category Tabs */}
            <div className="hidden sm:flex p-1 bg-gray-100 rounded-xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeCategory === cat.value
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-900/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Mobile Category Dropdown */}
          <div className="sm:hidden -mx-4 px-4 overflow-x-auto mt-3 pb-2">
            <div className="flex space-x-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3 py-1.5 whitespace-nowrap text-xs font-medium rounded-full border ${
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
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">未找到相关中转站</h3>
              <p className="text-sm text-gray-500">尝试切换分类或调整筛选条件</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                查看全部站点 &rarr;
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
