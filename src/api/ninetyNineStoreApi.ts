import api from './client';

export type NinetyNinePriceFilterType = 'below' | 'at_or_below';
export type NinetyNineBranchStrategy = 'nearest_to_user' | 'primary_branch' | 'all_branches';

export interface NinetyNineCampaignDisplayConfig {
    headerTitle: string;
    headerSubtitle: string;
    bannerColor: string;
    bannerTextColor: string;
    maxItemsToShow: number;
    sortBy: 'price_asc' | 'price_desc' | 'newest' | 'manual';
}

export interface NinetyNineCampaign {
    id: string;
    title: string;
    maxPrice: number;
    priceFilterType: NinetyNinePriceFilterType;
    branchStrategy: NinetyNineBranchStrategy;
    displayConfig: NinetyNineCampaignDisplayConfig;
}

export interface NinetyNineCategory {
    id: string;
    name: string;
    count: number;
}

export interface NinetyNineStoreItem {
    productId: string;
    name: string;
    image: string;
    quantity: string;
    categoryId: string | null;
    effectivePrice: number;
    originalPrice: number;
    sellerId: string;
    branch: {
        branchId: string;
        name: string;
        city: string;
        distanceKm: number | null;
    };
    isFeatured: boolean;
}

export interface NinetyNineStorePayload {
    campaign: NinetyNineCampaign;
    categories: NinetyNineCategory[];
    items: NinetyNineStoreItem[];
}

interface NinetyNineStoreQuery {
    lat?: number;
    lng?: number;
    branchId?: string;
}

export const getActiveNinetyNineStore = async (query: NinetyNineStoreQuery = {}) => {
    const params = new URLSearchParams();

    if (Number.isFinite(query.lat)) {
        params.append('lat', String(query.lat));
    }
    if (Number.isFinite(query.lng)) {
        params.append('lng', String(query.lng));
    }
    if (query.branchId) {
        params.append('branchId', query.branchId);
    }

    const suffix = params.toString();
    const endpoint = suffix
        ? `/marketing/ninety-nine-store/active?${suffix}`
        : '/marketing/ninety-nine-store/active';

    return api.get<NinetyNineStorePayload | null>(endpoint);
};

export default {
    getActiveNinetyNineStore,
};
