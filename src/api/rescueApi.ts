import api from './client';

export interface RescueItem {
  id: string;
  campaignId: string;
  sourceType: 'manual' | 'auto';
  reasonCode: 'near_expiry' | 'overstock' | 'low_demand' | 'manual';
  rescuePrice: number;
  originalPrice: number;
  discountAmount: number;
  validUntil: string;
  quantityCap: number;
  isActive: boolean;
  product: {
    id: string;
    name: string;
    image: string;
    quantity: string;
  };
  branch: {
    id: string;
    name: string;
    city: string;
  };
}

export interface RescueActivePayload {
  campaign: {
    id: string;
    title: string;
    maxRescuePrice: number;
    displayConfig?: {
      badgeText?: string;
      badgeColor?: string;
      textColor?: string;
      cardColor?: string;
      sortBy?: string;
    };
    startAt: string;
    endAt: string;
  };
  items: RescueItem[];
}

export const getActiveRescue = async () => api.get<RescueActivePayload | null>('/marketing/rescue/active');
export const getBranchRescue = async (branchId: string) => api.get<{ items: RescueItem[] }>(`/marketing/rescue/branch/${branchId}`);

export default {
  getActiveRescue,
  getBranchRescue,
};
