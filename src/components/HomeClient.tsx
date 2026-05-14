'use client';

import React, { useState, useMemo } from 'react';
import { Site, ModelCategory } from '@/types';
import SiteCard from './SiteCard';

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

export default function HomeClient({ initialSites }: HomeClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const featuredSites = useMemo(() => {
    return initialSites.filter((site) => site.featured);
  }, [initialSites]);

  const displayedSites = useMemo(() => {
    let result = [...initialSites];
    
    // 1. Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(site => site.models.includes(activeCategory as ModelCategory));
    }

    // 2. Filter by search term
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(site => 
        site.name.toLowerCase().includes(lowerTerm) || 
        site.description.toLowerCase().includes(lowerTerm)
      );
    }
    
    // 3. Sort: Feature sites first, then alphabetical
    result.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [initialSites, activeCategory, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              AI Token 中转站<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">导航</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              汇集全网优质 API 中转服务。一眼识别关键信息，快速对比价格与支持模型，找到最适合你的开发接入点。
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 border-0 rounded-2xl text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6 shadow-sm transition-all duration-300 bg-white/80 backdrop-blur-md"
                placeholder="搜索中转站名称、模型或特性..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="hidden sm:inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 精选推荐区 - 常驻显示 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </span>
              精选推荐
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredSites.map((site) => (
              <div key={site.name} className="relative">
                <SiteCard site={site} />
              </div>
            ))}
          </div>
        </section>

        {/* Categories / Filter Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between border-b border-gray-200 pb-5">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
