import api from './client';

export interface VoiceOrderIntentRequest {
    transcript: string;
    locale?: string;
    context?: {
        latitude?: number;
        longitude?: number;
        activeBranchId?: string;
    };
}

export interface VoiceOrderIntentResponse {
    intent: 'order' | 'search' | 'help' | 'unknown';
    confidence?: number;
    confidenceThreshold?: number;
    needsClarification?: boolean;
    clarificationQuestions?: string[];
    safeMode?: boolean;
    activeProvider?: string;
    message?: string;
    entities?: {
        items?: Array<{ name: string; quantity?: number }>;
        branchId?: string;
        category?: string;
    };
}

export interface VoiceOrderPreviewResponse {
    intent: string;
    items: Array<{
        requestedName: string;
        found: boolean;
        quantity?: number;
        reason?: string;
        matchScore?: number;
        explanation?: string;
        product?: {
            id: string;
            name: string;
            price: number;
            image: string;
            quantityLabel?: string;
            sellerId?: string;
            branchId?: string | null;
            branchName?: string | null;
        };
    }>;
}

export interface VoiceOrderConfirmResponse {
    cartDraft: Array<{
        productId: string;
        name: string;
        quantity: number;
        unitPrice: number;
        image?: string;
        branchId?: string | null;
    }>;
    message: string;
}

export const parseVoiceOrderIntent = async (payload: VoiceOrderIntentRequest) => {
    return api.post<VoiceOrderIntentResponse>('/ai/order-intent', payload);
};

export const previewVoiceOrderIntent = async (payload: {
    intent?: string;
    entities: VoiceOrderIntentResponse['entities'];
    context?: VoiceOrderIntentRequest['context'];
}) => {
    return api.post<VoiceOrderPreviewResponse>('/ai/order-preview', payload);
};

export const confirmVoiceOrderIntent = async (payload: {
    previewItems: VoiceOrderPreviewResponse['items'];
}) => {
    return api.post<VoiceOrderConfirmResponse>('/ai/order-confirm', payload);
};

export default {
    parseVoiceOrderIntent,
    previewVoiceOrderIntent,
    confirmVoiceOrderIntent,
};
