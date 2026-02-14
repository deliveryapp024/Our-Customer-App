import api from './client';

export type ReviewCustomer = {
    _id: string;
    name: string;
    profileImage?: string | null;
    profileImageType?: string | null;
    profileAvatarId?: string | null;
};

export type BranchReview = {
    _id: string;
    branch: string;
    customer: ReviewCustomer;
    rating: number;
    food?: number;
    service?: number;
    delivery?: number;
    comment?: string;
    tags?: string[];
    images?: string[];
    isVerifiedPurchase?: boolean;
    createdAt?: string;
};

export type ListBranchReviewsResponse = {
    items: BranchReview[];
    nextCursor: string | null;
};

export const listBranchReviews = async (branchId: string, limit = 20, cursor?: string) => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    if (cursor) {
        params.set('cursor', cursor);
    }
    return api.get<ListBranchReviewsResponse>(`/branches/${branchId}/reviews?${params.toString()}`);
};

export const createBranchReview = async (
    branchId: string,
    payload: {
        rating: number;
        food?: number;
        service?: number;
        delivery?: number;
        comment?: string;
        tags?: string[];
        images?: string[];
        orderId?: string;
    }
) => {
    return api.post<{ _id: string }>(`/branches/${branchId}/reviews`, payload);
};

export const uploadReviewMedia = async (formData: FormData) => {
    return api.postFormData<{ imageUrl: string; imageKey: string }>('/reviews/media/upload', formData);
};

export default {
    listBranchReviews,
    createBranchReview,
    uploadReviewMedia,
};
