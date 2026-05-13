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
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      {/* 顶部 Header */}
      <header className="mb-10 text-center md:text-left md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">token123.xyz</h1>
          <p className="text-gray-600">AI Token 中转站导航网站，一眼识别关键信息，快速跳转合适的服务。</p>
        </div>
        
        {/* 搜索框 */}
        <div className="mt-4 md:mt-0 w-full md:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索中转站名称或简介..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </header>

      {/* 精选推荐区 (只有在未搜索和未筛选时展示，或者要求常驻？PM说：“首屏看到「精选推荐」区... 向下浏览全量分类列表，通过分类标签或搜索进一步筛选”。如果用户筛选了，推荐区通常可以隐藏或保持。一般保持最简单就是一直展示推荐区，或者只过滤全量列表。PM没有明确要求隐藏推荐区，但我可以将其隐藏，或者保持。我们过滤全量列表 `displayedSites`，推荐区 `featuredSites` 不随搜索过滤，或者一起过滤？PM说“精选推荐区...向下浏览全量分类列表，通过分类标签或搜索进一步筛选”。意思是搜索和过滤作用于全量列表。为了安全，推荐区保持静态。Wait, I will keep it statically displaying features sites, as is standard.) */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-blue-600 mr-2">✦</span> 精选推荐
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredSites.map((site) => (
            <SiteCard key={site.name} site={site} />
          ))}
        </div>
      </section>

      {/* 分类导航栏 */}
      <nav className="mb-8 overflow-x-auto pb-2">
        <ul className="flex space-x-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <button
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 全量中转站卡片网格列表 */}
      <section>
        {displayedSites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedSites.map((site) => (
              <SiteCard key={site.name} site={site} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            暂无相关中转站
          </div>
        )}
      </section>
    </main>
  );
}
