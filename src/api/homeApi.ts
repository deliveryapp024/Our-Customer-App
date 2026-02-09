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

// Fetch home layout
export const fetchHome = async () => {
    return api.get<HomeResponse>('/home');
};

export default {
    fetchHome,
};
