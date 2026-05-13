import { z } from 'zod';

export const PriceTierSchema = z.enum(['free', 'budget', 'standard']);
export type PriceTier = z.infer<typeof PriceTierSchema>;

export const ModelCategorySchema = z.enum(['gpt', 'claude', 'gemini', 'multi', 'domestic']);
export type ModelCategory = z.infer<typeof ModelCategorySchema>;

export const SiteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL format'),
  description: z.string().max(30, 'Description must be 30 characters or less'),
  models: z.array(ModelCategorySchema).min(1, 'At least one model category is required'),
  priceTier: PriceTierSchema,
  featured: z.boolean(),
});

export type Site = z.infer<typeof SiteSchema>;

export const SiteListSchema = z.array(SiteSchema);
