import api from './client';

// Types for Search
export interface SearchSuggestion {
    _id: string;
    name: string;
    type: 'product' | 'category' | 'restaurant';
    image?: string;
}

export interface SearchResponse {
    results: SearchSuggestion[];
    typoCorrected: boolean;
    originalQuery: string;
    correctedQuery: string;
}

// Search suggestions
export const fetchSearchSuggestions = async (query: string) => {
    return api.get<SearchResponse>(`/search/v1/suggest?q=${encodeURIComponent(query)}`);
};

export default {
    fetchSearchSuggestions,
};
