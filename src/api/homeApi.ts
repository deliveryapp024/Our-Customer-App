import api from './client';

// Types for Home API response
export interface HomeTheme {
    headerGradientTop: string;
    headerGradientBottom: string;
    contentBackgroundColor: string;
}

export interface BannerItem {
    id: string;
    imageUrl: string;
    deeplink?: string;
}

export interface CategoryTile {
    id: string;
    name: string;
    icon: string;
    deeplink?: string;
}

export interface HomeSection {
    type: 'banner_carousel' | 'category_grid' | 'restaurant_list';
    data: {
        title?: string;
        items?: BannerItem[];
        tiles?: CategoryTile[];
        restaurants?: any[];
    };
}

export interface HomeResponse {
    layoutVersion: number;
    theme: HomeTheme;
    sections: HomeSection[];
}

// Customer nearby branches params (avoid conflict with restaurantsApi names)
export interface NearbyBranchesParams {
    latitude: number;
    longitude: number;
    radius?: number; // in km
}

// Fetch home layout
export const fetchHome = async () => {
    return api.get<HomeResponse>('/home');
};

// Fetch nearby restaurants (public seller discovery endpoint)
export const fetchNearbyBranches = async (params: NearbyBranchesParams) => {
    const { latitude, longitude, radius = 10 } = params;
    return api.get<any[]>(
        `/seller/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
};

export default {
    fetchHome,
    fetchNearbyBranches,
};
