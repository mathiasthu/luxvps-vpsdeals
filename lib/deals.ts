export type DealCategory = 'special-offer' | 'kvm-rootserver' | 'ryzen-kvm';
export type DealBadge = 'hot-deal' | 'best-value' | 'special';

export interface DealSpecs {
  ram: string;
  cpu: string;
  disk: string;
  bandwidth: string;
  location?: string;
}

export interface Deal {
  id: string;
  slug: string;
  name: string;
  category: DealCategory;
  sourceUrl: string;
  price: number;
  priceAnnual?: number;
  specs: DealSpecs;
  badge?: DealBadge;
  inStock: boolean;
  description?: string;
  fetchedAt: string;
}

export const CATEGORY_LABELS: Record<DealCategory, string> = {
  'special-offer': 'Special Offers',
  'kvm-rootserver': 'KVM Root Servers',
  'ryzen-kvm': 'Ryzen KVM',
};

export const BADGE_LABELS: Record<DealBadge, string> = {
  'hot-deal': 'Hot Deal',
  'best-value': 'Best Value',
  'special': 'Special',
};

export const BADGE_COLORS: Record<DealBadge, string> = {
  'hot-deal': 'bg-brand-yellow text-brand-dark',
  'best-value': 'bg-brand-green text-brand-dark',
  'special': 'bg-brand-red text-white',
};

export const CATEGORY_BORDER_COLORS: Record<DealCategory, string> = {
  'special-offer': 'border-l-brand-red',
  'kvm-rootserver': 'border-l-brand-yellow',
  'ryzen-kvm': 'border-l-brand-green',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function assignBadges(deals: Deal[]): Deal[] {
  const byCategory = new Map<DealCategory, Deal[]>();
  for (const deal of deals) {
    const list = byCategory.get(deal.category) ?? [];
    list.push(deal);
    byCategory.set(deal.category, list);
  }

  const result: Deal[] = [];
  for (const [category, categoryDeals] of byCategory) {
    const sorted = [...categoryDeals].sort((a, b) => a.price - b.price);
    const withBadges = categoryDeals.map((deal) => {
      let badge: DealBadge | undefined = deal.badge;
      if (category === 'special-offer') {
        badge = 'special';
      } else if (sorted[0]?.id === deal.id) {
        badge = 'best-value';
      } else if (sorted.length > 1 && sorted[1]?.id === deal.id) {
        badge = 'hot-deal';
      }
      return { ...deal, badge };
    });
    result.push(...withBadges);
  }
  return result;
}

export function formatPrice(
  price: number,
  currency: string,
  rates: Record<string, number>
): string {
  const rate = rates[currency.toLowerCase()] ?? 1;
  const converted = price * rate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}
