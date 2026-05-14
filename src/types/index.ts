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
  paymentMethods: z.array(PaymentMethodSchema).default([]),
  minRecharge: z.string().nullable().default(null),
  hasFreeTier: z.boolean().nullable().default(null),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid verification date').nullable().default(null),
});

export type Site = z.infer<typeof SiteSchema>;

export const SiteListSchema = z.array(SiteSchema);
