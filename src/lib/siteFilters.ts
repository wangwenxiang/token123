import type { ModelCategory, PaymentMethod, Site } from '../types';

export interface SiteFilterOptions {
  category: string;
  searchTerm: string;
  paymentMethods: PaymentMethod[];
  onlyFreeTier: boolean;
}

export function filterSites(sites: Site[], options: SiteFilterOptions): Site[] {
  let result = [...sites];

  if (options.category !== 'all') {
    result = result.filter((site) => site.models.includes(options.category as ModelCategory));
  }

  if (options.paymentMethods.length > 0) {
    result = result.filter((site) =>
      options.paymentMethods.some((method) => site.paymentMethods.includes(method)),
    );
  }

  if (options.onlyFreeTier) {
    result = result.filter((site) => site.hasFreeTier === true);
  }

  if (options.searchTerm.trim()) {
    const lowerTerm = options.searchTerm.toLowerCase();
    result = result.filter((site) =>
      site.name.toLowerCase().includes(lowerTerm) ||
      site.description.toLowerCase().includes(lowerTerm),
    );
  }

  result.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

  return result;
}
