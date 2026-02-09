import api from './client';

// Types for Category
export interface Category {
    _id: string;
    name: string;
    icon?: string;
    image?: string;
    description?: string;
    isActive?: boolean;
}

// Fetch all categories
export const fetchCategories = async () => {
    return api.get<Category[]>('/categories');
};

// Fetch products by category
export const fetchProductsByCategory = async (categoryId: string) => {
    return api.get(`/products/${categoryId}`);
};

// Fetch single product
export const fetchProduct = async (productId: string) => {
    return api.get(`/product/${productId}`);
};

// Fetch related products
export const fetchRelatedProducts = async (productId: string) => {
    return api.get(`/product/${productId}/related`);
};

export default {
    fetchCategories,
    fetchProductsByCategory,
    fetchProduct,
    fetchRelatedProducts,
};
