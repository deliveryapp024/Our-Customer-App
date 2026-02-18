import api from './client';

export interface FlashDealItem {
    id: string;
    restaurantName: string;
    image: string;
    originalPrice: number;
    dealPrice: number;
    discount: string;
    endsIn: number;
    claimed: number;
    total: number;
}

export interface FlashDealConfig {
    title: string;
    bannerText: string;
    bannerColor: string;
    bannerTextColor: string;
    marqueeSpeed: number;
    marqueeReverse: boolean;
    deals: FlashDealItem[];
}

export const getActiveFlashDeal = async () => {
    return api.get<FlashDealConfig | null>('/marketing/flash-deals/active');
};

export default {
    getActiveFlashDeal,
};
