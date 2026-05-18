'use client';

import React, { useMemo, useState } from 'react';
import type { EvidenceLevel, RankingItem, RankingScores, Site } from '@/types';

interface HomeClientProps {
  initialSites: Site[];
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

const SCORE_LABELS: Array<{ key: keyof RankingScores; label: string; weight: string }> = [
  { key: 'price', label: '价格竞争力', weight: '35%' },
  { key: 'reliability', label: '可靠性', weight: '30%' },
  { key: 'coverage', label: '模型覆盖', weight: '15%' },
  { key: 'transparency', label: '价格透明度', weight: '10%' },
  { key: 'chinaFriendly', label: '国内友好度', weight: '10%' },
];

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

export default function HomeClient({ rankings }: HomeClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mainRankings = useMemo(
    () => rankings.filter((item) => item.participatesInMainRanking),
    [rankings],
  );
  const topThree = mainRankings.slice(0, 3);
  const communityEntry = rankings.find((item) => item.evidenceLevel === 'community_channel');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="border-b border-slate-200 bg-white/85">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Evidence-first ranking
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              AI Token 中转站权威榜单
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              按价格、可靠性和透明度综合排序。榜单只使用可核实证据，不把社区传言作为主排名依据。
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-950">Top 3 当前推荐</h2>
              <p className="mt-1 text-xs text-gray-500">先看最值得试的三个入口，再看完整评分依据。</p>
            </div>
            <span className="hidden rounded-full bg-white px-3 py-1 text-xs text-gray-500 ring-1 ring-gray-200 sm:inline-flex">
              核验日期：2026-05-18
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {topThree.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[104px] gap-3 rounded-xl border border-indigo-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <RankingLogo item={item} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600">#{item.rank}</span>
                    <h3 className="truncate text-sm font-bold text-gray-950">{item.name}</h3>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-gray-700">{item.positioning}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-gray-500">{item.priceHighlight}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-950">综合榜规则</h2>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                综合分 = 价格竞争力 35% + 可靠性 30% + 模型覆盖 15% + 价格透明度 10% + 国内友好度 10%。
                榜单按当前产品推荐价值排序，不只按分数机械排序。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EVIDENCE_LABELS) as EvidenceLevel[]).map((level) => (
                <EvidenceBadge key={level} level={level} />
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-base font-bold text-gray-950">当前权威榜单 v1</h2>
            <p className="mt-1 text-xs text-gray-500">
              主榜只展示已具备可核实价格或计费依据的站点；点击“展开”查看评分拆解和证据来源。
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {mainRankings.map((item) => {
              const expanded = expandedId === item.id;

              return (
                <article key={item.id} className="p-4">
                  <div className="grid gap-3 lg:grid-cols-[56px_minmax(160px,1.1fr)_92px_132px_minmax(180px,1fr)_minmax(180px,1fr)_112px_96px] lg:items-center">
                    <div className="flex items-center gap-3 lg:block">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-extrabold text-gray-700">
                        {item.rank}
                      </span>
                      <div className="lg:hidden">
                        <EvidenceBadge level={item.evidenceLevel} />
                      </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                      <RankingLogo item={item} />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-950">{item.name}</h3>
                        <p className="truncate text-xs text-gray-500">{item.positioning}</p>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-gray-400 lg:hidden">综合分</div>
                      <div className="text-base font-extrabold text-gray-950">{item.score?.toFixed(1)}</div>
                    </div>

                    <div className="hidden lg:block">
                      <EvidenceBadge level={item.evidenceLevel} />
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-gray-400 lg:hidden">价格亮点</div>
                      <p className="text-xs leading-5 text-gray-700">{item.priceHighlight}</p>
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-gray-400 lg:hidden">风险提示</div>
                      <p className="text-xs leading-5 text-amber-700">{item.riskNote}</p>
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-gray-400 lg:hidden">最近核验</div>
                      <p className="text-xs text-gray-600">{item.verifiedAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : item.id)}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600"
                      >
                        {expanded ? '收起' : '展开'}
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
                          <p className="text-xs font-bold text-gray-900">评分拆解</p>
                          <p className="mt-0.5 text-[11px] text-gray-500">
                            当前核验结果仅代表 v1 榜单口径；计费体系公开项仍需继续实测。
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
                    </div>
                  )}
                </article>
              );
            })}
          </div>
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
