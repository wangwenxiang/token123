'use client';

import React, { useMemo, useState } from 'react';
import type { EvidenceLevel, RankingItem, RankingScores, RiskLevel, ScenarioTag } from '@/types';

interface HomeClientProps {
  rankings: RankingItem[];
}

const EVIDENCE_LABELS: Record<EvidenceLevel, { label: string; className: string; helper: string }> = {
  model_pricing: {
    label: '模型级价目表',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    helper: '官网公开模型与单价，可进入主榜',
  },
  billing_public: {
    label: '计费体系公开',
    className: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    helper: '公开充值、折扣或计费口径，需继续实测模型价',
  },
  free_trial: {
    label: '免费体验',
    className: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    helper: '适合作为试用入口，不代表付费最低价',
  },
  community_channel: {
    label: '高风险社群',
    className: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    helper: '不参与综合评分，需自行甄别风险',
  },
};

const RISK_LABELS: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: '低风险',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  medium: {
    label: '中风险',
    className: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  },
  high: {
    label: '高风险',
    className: 'bg-red-50 text-red-700 ring-red-600/20',
  },
};

const SCORE_LABELS: Array<{ key: keyof RankingScores; label: string; weight: string }> = [
  { key: 'price', label: '价格竞争力', weight: '35%' },
  { key: 'reliability', label: '可靠性', weight: '30%' },
  { key: 'coverage', label: '模型覆盖', weight: '15%' },
  { key: 'transparency', label: '价格透明度', weight: '10%' },
  { key: 'chinaFriendly', label: '国内友好度', weight: '10%' },
];

type SortKey = 'score' | keyof RankingScores | 'verifiedAt';
type ScenarioKey = 'overall' | 'cheap_claude' | 'transparent_pricing' | 'china_friendly' | 'free_trial';

const SORT_LABELS: Record<SortKey, string> = {
  score: '综合分',
  price: '价格竞争力',
  reliability: '可靠性',
  coverage: '模型覆盖',
  transparency: '透明度',
  chinaFriendly: '国内友好度',
  verifiedAt: '最近核验',
};

const SCENARIOS: Array<{ key: ScenarioKey; label: string; description: string; sortKey: SortKey; tag?: ScenarioTag }> = [
  { key: 'overall', label: '综合推荐', description: '按综合分排序', sortKey: 'score' },
  { key: 'cheap_claude', label: '最便宜 Claude', description: '低价 Claude 优先', sortKey: 'price', tag: 'cheap_claude' },
  { key: 'transparent_pricing', label: '价格透明', description: '模型级证据优先', sortKey: 'transparency', tag: 'transparent_pricing' },
  { key: 'china_friendly', label: '国内友好', description: '访问和支付更顺', sortKey: 'chinaFriendly', tag: 'china_friendly' },
  { key: 'free_trial', label: '免费试用', description: '低门槛体验入口', sortKey: 'score', tag: 'free_trial' },
];

const EVIDENCE_PRIORITY: Record<EvidenceLevel, number> = {
  model_pricing: 0,
  billing_public: 1,
  free_trial: 2,
  community_channel: 3,
};

function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const config = EVIDENCE_LABELS[level];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${config.className}`}
      title={config.helper}
    >
      {config.label}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const config = RISK_LABELS[level];

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${config.className}`}>
      {config.label}
    </span>
  );
}

function ScoreBreakdown({ scores }: { scores: RankingScores }) {
  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {SCORE_LABELS.map((item) => {
        const score = scores[item.key];

        return (
          <div key={item.key} className="rounded-lg bg-gray-50 p-2">
            <div className="text-[10px] font-medium text-gray-500">{item.label}</div>
            <div className="mt-0.5 flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-gray-900">{score}/10</span>
              <span className="text-[10px] text-gray-400">权重 {item.weight}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RankingLogo({ item }: { item: RankingItem }) {
  return (
    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {item.logoPath ? (
        <img src={item.logoPath} alt="" className="h-full w-full object-contain p-1.5" />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-indigo-500 text-sm font-bold text-white">
          {item.name.charAt(0)}
        </span>
      )}
    </div>
  );
}

function podiumStyle(rank: number | null) {
  if (rank === 1) {
    return {
      article: 'border-amber-300 bg-amber-50/60 shadow-[0_12px_40px_rgba(245,158,11,0.14)]',
      rank: 'bg-amber-400 text-amber-950 ring-2 ring-amber-200',
      label: '金牌低价首选',
      labelClass: 'bg-amber-100 text-amber-800 ring-amber-500/20',
    };
  }
  if (rank === 2) {
    return {
      article: 'border-slate-300 bg-slate-50/80 shadow-[0_10px_32px_rgba(100,116,139,0.12)]',
      rank: 'bg-slate-300 text-slate-950 ring-2 ring-slate-200',
      label: '银牌稳定优选',
      labelClass: 'bg-slate-100 text-slate-700 ring-slate-500/20',
    };
  }
  if (rank === 3) {
    return {
      article: 'border-orange-300 bg-orange-50/60 shadow-[0_10px_32px_rgba(249,115,22,0.12)]',
      rank: 'bg-orange-300 text-orange-950 ring-2 ring-orange-200',
      label: '铜牌短期划算',
      labelClass: 'bg-orange-100 text-orange-800 ring-orange-500/20',
    };
  }
  return null;
}

function getSortValue(item: RankingItem, sortKey: SortKey) {
  if (sortKey === 'score') {
    return item.score ?? 0;
  }
  if (sortKey === 'verifiedAt') {
    return Date.parse(item.verifiedAt) || 0;
  }
  return item.scores?.[sortKey] ?? 0;
}

function sortRankings(items: RankingItem[], sortKey: SortKey) {
  return [...items].sort((a, b) => {
    const valueDiff = getSortValue(b, sortKey) - getSortValue(a, sortKey);
    if (valueDiff !== 0) {
      return valueDiff;
    }
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    const evidenceDiff = EVIDENCE_PRIORITY[a.evidenceLevel] - EVIDENCE_PRIORITY[b.evidenceLevel];
    if (evidenceDiff !== 0) {
      return evidenceDiff;
    }
    return 0;
  });
}

function rankLabel(index: number) {
  if (index === 0) {
    return '金牌';
  }
  if (index === 1) {
    return '银牌';
  }
  if (index === 2) {
    return '铜牌';
  }
  return `#${index + 1}`;
}

export default function HomeClient({ rankings }: HomeClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('overall');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [onlyClaude, setOnlyClaude] = useState(false);
  const [onlyModelPricing, setOnlyModelPricing] = useState(false);
  const [onlyFreeTrial, setOnlyFreeTrial] = useState(false);
  const [hideHighRisk, setHideHighRisk] = useState(true);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const activeScenarioConfig = SCENARIOS.find((scenario) => scenario.key === activeScenario) ?? SCENARIOS[0];
  const mainRankings = useMemo(
    () => {
      const filtered = rankings.filter((item) => {
        if (!item.participatesInMainRanking) {
          return false;
        }
        if (hideHighRisk && item.riskLevel === 'high') {
          return false;
        }
        if (activeScenarioConfig.tag && !item.scenarioTags.includes(activeScenarioConfig.tag)) {
          return false;
        }
        if (onlyClaude && !item.scenarioTags.includes('cheap_claude')) {
          return false;
        }
        if (onlyModelPricing && item.evidenceLevel !== 'model_pricing') {
          return false;
        }
        if (onlyFreeTrial && !item.scenarioTags.includes('free_trial')) {
          return false;
        }
        return true;
      });

      return sortRankings(filtered, sortKey);
    },
    [rankings, activeScenarioConfig.tag, hideHighRisk, onlyClaude, onlyModelPricing, onlyFreeTrial, sortKey],
  );
  const communityEntry = rankings.find((item) => item.evidenceLevel === 'community_channel');
  const lastVerifiedLabel = mainRankings[0]?.lastVerifiedLabel ?? '核验日期待补充';

  function selectScenario(key: ScenarioKey) {
    const scenario = SCENARIOS.find((item) => item.key === key) ?? SCENARIOS[0];
    setActiveScenario(key);
    setSortKey(scenario.sortKey);
    setExpandedId(null);
  }

  function clearFilters() {
    setActiveScenario('overall');
    setSortKey('score');
    setOnlyClaude(false);
    setOnlyModelPricing(false);
    setOnlyFreeTrial(false);
    setHideHighRisk(true);
    setExpandedId(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="border-b border-slate-200 bg-white/85">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              AI Token 中转站权威榜单
            </h1>
            <div className="text-sm text-gray-600 lg:text-right">
              <p>可信榜单 + 场景筛选 + 证据详情，先看该试哪个。</p>
              <p className="mt-0.5 text-xs text-gray-400">{lastVerifiedLabel}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SCENARIOS.map((scenario) => {
              const active = activeScenario === scenario.key;

              return (
                <button
                  key={scenario.key}
                  type="button"
                  onClick={() => selectScenario(scenario.key)}
                  className={`min-w-[112px] rounded-lg border px-3 py-2 text-left transition ${
                    active
                      ? 'border-gray-950 bg-gray-950 text-white'
                      : 'border-slate-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-700'
                  }`}
                >
                  <span className="block text-xs font-bold">{scenario.label}</span>
                  <span className={`mt-0.5 block text-[10px] ${active ? 'text-gray-300' : 'text-gray-400'}`}>
                    {scenario.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs text-gray-500">
              当前视图：{activeScenarioConfig.label}，按 {SORT_LABELS[sortKey]} 降序。高风险项默认隐藏。
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-semibold text-gray-500">
                排序
                <select
                  value={sortKey}
                  onChange={(event) => {
                    setSortKey(event.target.value as SortKey);
                    setExpandedId(null);
                  }}
                  className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-gray-700"
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <option key={key} value={key}>{SORT_LABELS[key]}</option>
                  ))}
                </select>
              </label>
              {[
                ['只看 Claude 可用', onlyClaude, setOnlyClaude],
                ['模型级价目表', onlyModelPricing, setOnlyModelPricing],
                ['免费试用', onlyFreeTrial, setOnlyFreeTrial],
                ['隐藏高风险', hideHighRisk, setHideHighRisk],
              ].map(([label, checked, setter]) => (
                <label key={label as string} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={checked as boolean}
                    onChange={(event) => {
                      (setter as React.Dispatch<React.SetStateAction<boolean>>)(event.target.checked);
                      setExpandedId(null);
                    }}
                    className="h-3.5 w-3.5 rounded border-gray-300"
                  />
                  {label as string}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-gray-950">当前权威榜单</h2>
            <p className="text-xs text-gray-500">{mainRankings.length} 个结果</p>
          </div>

          <div className="divide-y divide-slate-100">
            {mainRankings.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-gray-800">当前筛选没有结果</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 rounded-lg bg-gray-950 px-3 py-2 text-xs font-bold text-white"
                >
                  清除筛选
                </button>
              </div>
            )}

            {mainRankings.map((item, index) => {
              const expanded = expandedId === item.id;
              const displayRank = index + 1;
              const podium = podiumStyle(displayRank);

              return (
                <article
                  key={item.id}
                  className={`relative p-4 transition ${podium ? `border-l-4 ${podium.article}` : ''}`}
                >
                  <div className="grid gap-3 lg:grid-cols-[56px_minmax(220px,1.3fr)_96px_136px_minmax(200px,1fr)_112px_112px] lg:items-center">
                    <div className="flex items-center gap-3 lg:block">
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold ${podium ? podium.rank : 'bg-slate-100 text-gray-700'}`}
                      >
                        {displayRank}
                      </span>
                      <div className="lg:hidden">
                        <EvidenceBadge level={item.evidenceLevel} />
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                      <RankingLogo item={item} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm font-bold text-gray-950">{item.name}</h3>
                          {podium && (
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${podium.labelClass}`}
                            >
                              {rankLabel(index)}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">{item.bestFor}</p>
                        <p className="mt-1 text-[11px] leading-4 text-gray-400">{item.positioning}</p>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-gray-400 lg:hidden">综合分</div>
                      <div className="text-base font-extrabold text-gray-950">{item.score?.toFixed(1)}</div>
                      <div className="mt-0.5 text-[10px] text-gray-400">{SORT_LABELS[sortKey]}排序</div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <EvidenceBadge level={item.evidenceLevel} />
                      <RiskBadge level={item.riskLevel} />
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-gray-400 lg:hidden">价格亮点</div>
                      <p className="text-xs leading-5 text-gray-700">{item.priceHighlight}</p>
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-gray-400 lg:hidden">最近核验</div>
                      <p className="text-xs text-gray-600">{item.lastVerifiedLabel}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : item.id)}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600"
                      >
                        {expanded ? '收起证据' : '查看证据'}
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-gray-950 px-2 py-1 text-xs font-semibold text-white transition hover:bg-indigo-600"
                      >
                        访问
                      </a>
                    </div>
                  </div>

                  {expanded && item.scores && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-white p-3">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-900">证据详情</p>
                          <p className="mt-0.5 text-[11px] text-gray-500">
                            {item.evidenceSummary}
                          </p>
                        </div>
                        {item.evidenceUrl && (
                          <a
                            href={item.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                          >
                            查看证据来源
                          </a>
                        )}
                      </div>
                      <ScoreBreakdown scores={item.scores} />
                      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                        <div className="rounded-lg bg-amber-50 p-3 text-amber-900">
                          <p className="font-bold">风险说明</p>
                          <p className="mt-1 leading-5">{item.riskNote}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3 text-gray-600">
                          <p className="font-bold text-gray-900">不确定项</p>
                          <p className="mt-1 leading-5">计费、模型覆盖和可用性会变化；最终以最新公开价格页和实际账单为准。</p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <button
            type="button"
            onClick={() => setMethodologyOpen(!methodologyOpen)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-sm font-bold text-gray-950">排名方法论</span>
            <span className="text-xs font-semibold text-indigo-600">{methodologyOpen ? '收起' : '展开'}</span>
          </button>
          {methodologyOpen && (
            <div className="mt-3 space-y-3">
              <p className="text-xs leading-5 text-gray-500">
                综合分 = 价格竞争力 35% + 可靠性 30% + 模型覆盖 15% + 价格透明度 10% + 国内友好度 10%。
                高风险社群不进入主榜；价格和可用性以公开页面与实测账单为准。
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(EVIDENCE_LABELS) as EvidenceLevel[]).map((level) => (
                  <EvidenceBadge key={level} level={level} />
                ))}
              </div>
            </div>
          )}
        </section>

        {communityEntry && (
          <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2">
                  <EvidenceBadge level={communityEntry.evidenceLevel} />
                </div>
                <h2 className="text-base font-bold text-amber-950">{communityEntry.name}</h2>
                <p className="mt-1 text-sm text-amber-900">{communityEntry.riskNote}</p>
                <p className="mt-1 text-xs text-amber-800">不参与综合评分；仅作为高风险社群渠道入口保留。</p>
              </div>
              <a
                href={communityEntry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center rounded-lg bg-amber-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-800"
              >
                自行甄别后访问
              </a>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
