import { z } from 'zod';

export const PriceTierSchema = z.enum(['free', 'budget', 'standard']);
export type PriceTier = z.infer<typeof PriceTierSchema>;

export const ModelCategorySchema = z.enum(['gpt', 'claude', 'gemini', 'multi', 'domestic']);
export type ModelCategory = z.infer<typeof ModelCategorySchema>;

export const PaymentMethodSchema = z.enum(['alipay', 'wechat', 'crypto', 'creditcard']);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const SiteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL format'),
  description: z.string().max(30, 'Description must be 30 characters or less'),
  models: z.array(ModelCategorySchema).min(1, 'At least one model category is required'),
  priceTier: PriceTierSchema,
  featured: z.boolean(),
  featuredReason: z.string().nullable().default(null),
  logoPath: z.string().nullable().default(null),
  paymentMethods: z.array(PaymentMethodSchema).default([]),
  minRecharge: z.string().nullable().default(null),
  hasFreeTier: z.boolean().nullable().default(null),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid verification date').nullable().default(null),
});

export type Site = z.infer<typeof SiteSchema>;

export const SiteListSchema = z.array(SiteSchema);

export const EvidenceLevelSchema = z.enum([
  'model_pricing',
  'billing_public',
  'free_trial',
  'community_channel',
]);
export type EvidenceLevel = z.infer<typeof EvidenceLevelSchema>;

export const ScenarioTagSchema = z.enum([
  'cheap_claude',
  'transparent_pricing',
  'china_friendly',
  'free_trial',
]);
export type ScenarioTag = z.infer<typeof ScenarioTagSchema>;

export const StrengthTagSchema = z.enum([
  'price_advantage',
  'transparent_pricing',
  'stable_service',
  'model_coverage',
  'china_friendly',
  'easy_start',
  'verified_evidence',
  'free_trial',
]);
export type StrengthTag = z.infer<typeof StrengthTagSchema>;

export const RankingScoresSchema = z.object({
  price: z.number().min(0).max(10),
  reliability: z.number().min(0).max(10),
  coverage: z.number().min(0).max(10),
  transparency: z.number().min(0).max(10),
  chinaFriendly: z.number().min(0).max(10),
});
export type RankingScores = z.infer<typeof RankingScoresSchema>;
export const ScoresSchema = RankingScoresSchema;
export type Scores = RankingScores;

export const RankingItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  rank: z.number().int().positive().nullable(),
  score: z.number().min(0).max(100).nullable(),
  evidenceLevel: EvidenceLevelSchema,
  positioning: z.string().min(1),
  priceHighlight: z.string().min(1),
  usageNote: z.string().min(1),
  evidenceUrl: z.string().url().nullable(),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bestFor: z.string().min(1),
  scenarioTags: z.array(ScenarioTagSchema).default([]),
  strengthTags: z.array(StrengthTagSchema).default([]),
  evidenceSummary: z.string().min(1),
  lastVerifiedLabel: z.string().min(1),
  scores: RankingScoresSchema.nullable(),
  logoPath: z.string().nullable().default(null),
  participatesInMainRanking: z.boolean(),
});
export type RankingItem = z.infer<typeof RankingItemSchema>;

export const RankingListSchema = z.array(RankingItemSchema);
