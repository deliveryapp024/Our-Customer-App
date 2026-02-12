import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    Image,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchApi, SearchSuggestion, categoriesApi } from '../../../api';
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: any;
};

const recentSearches = ['Sushi', 'Vegan Burger', 'Tacos', 'Pasta'];

// Images from search_&_trends design
const trendingSearches = [
    { id: '1', name: 'Biryani', trend: 'UP 24%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWwfrdEbNZoBdvm9QdpYfRrA_riCOpmkHgQlE84Wk9Xnx8RE3vmnm3BcSH0v7PGB8ishKC-hl4eGNqIxlVa7BBEqNJkxPg6fJd_MAqT_IlGkh5MHw02uTGO6eBdGZ2yjplRarw-LvoyYJ_QiQVVBoo8JpFV3AP7KhRCL8q5e-IEgpxogFtqrt_R5GMQKkenXNq8dJArHnASp39TYNHxPa7nFcRkZIdsQdCrTs8qLX1iRZMgg6DBGnzIE8EEnCY4bpuE5wVv2tTIKFD' },
    { id: '2', name: 'Pizza', trend: 'UP 18%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCgCzfzsXmdxE49M2spCuYQGsmg5smGrLpYbC8UEIwAmeCZfR7zgAsEkLWrjfnk0JdhgE7lwTI-6HO1LAUELFcCbDMNuBjsN0n4Gnii8aCZbRylecEDpFJ0FGl9L3_IUzC6e8jUFL9tR-p27Uiiv_uWhtxs4uTtLuzLyymUSYd6sXWmlGZKciiXn0hFDDEayKmNzqwZmBHavxOFIeg7dTO2YIKk97rZXbC6VzUoNdbobf8dWVvQzBgoNoDCP7Fb6vsOvRGW3xBE1Bb' },
    { id: '3', name: 'Burgers', trend: 'UP 12%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5Ej-PpCNf_gobGCKoZXoiNjNpjMOHA9ibfqYU1TSZrIT-v2JqLVmcFVgh8apXS5b0P5dGtkqgkDM1VWF6Hi36qoh3F4h89TyLeujF8P8uQzQuihF1T2GLhU09uCX-OuNSGeJj3MeBAXJJxXyfrCa-87O83mj7xbMfwuccPq8SXvp3Vgl0UUVuxKrrE-mJnYGr_DID5RBzKafEH54-OQtpfWmp6ARCsO4PpL64WN--hL2V25YA2UdbfHD3ab823xFQK4bTSYc2QvcD' },
    { id: '4', name: 'Healthy', trend: 'UP 31%', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAnnN7SMnl_G1WavrnyXgwEM0WF1IsZOLbYsR6LE2FgW1OIHQa5r0P8Sb8MEac07iVkABdNVNyGIFgGTKPYyGfJHwRWU1aGF0M4Y25avKcreOukkZDN2oIztMWICjfpMTQFMX7sB8QcQPCo1ru2_9ysH7Nf8LG0Rut6Lk9-B0ZoIGuf8A-8myhSkjVHoaMMNRWGin5-xZ5Y-WBj405Z7_BjB9d_3wmvuqqzrks6t_kJa5oMJzeSN0UXJi6s8uLT-t5TNYAVlbpSTeS' },
];

type CategoryProduct = {
    _id: string;
    name: string;
    price?: number;
    image?: string;
    description?: string;
    branchId?: string | null;
    sellerName?: string | null;
    branchName?: string | null;
    branchAddress?: string | null;
    branchLocation?: { latitude?: number; longitude?: number } | null;
};

export const SearchScreen: React.FC<Props> = ({ navigation, route }) => {
    const categoryId = route?.params?.categoryId as string | undefined;
    const categoryName = route?.params?.categoryName as string | undefined;
    const [query, setQuery] = useState('');
    const [recent, setRecent] = useState(recentSearches);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([]);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!categoryId) return;
        setCategoryLoading(true);
        setError(null);
        categoriesApi.fetchProductsByCategory(categoryId).then((result: any) => {
            if (result?.success) {
                setCategoryProducts(Array.isArray(result.data) ? result.data : []);
            } else {
                setCategoryProducts([]);
                setError(result?.error || 'Failed to load category products');
            }
            setCategoryLoading(false);
        });
    }, [categoryId]);

    const clearRecent = () => setRecent([]);
    const removeSearch = (item: string) => setRecent(recent.filter((r) => r !== item));

    // Debounced search
    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            setError(null);
            const result = await searchApi.fetchSearchSuggestions(query.trim());
            if (result.success) {
                setSuggestions(result.data.results || []);
            } else {
                setError(result.error || 'Search failed');
                setSuggestions([]);
            }
            setLoading(false);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Search & Trends</Text>
                <TouchableOpacity style={styles.cartButton}>
                    <Text style={styles.cartIcon}>🛒</Text>
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search biryani, pizza, or dessert"
                    placeholderTextColor="#6B6B6B"
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                />
                <TouchableOpacity style={styles.voiceButton}>
                    <Text style={styles.voiceIcon}>🎤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Category products */}
                {categoryId && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{categoryName || 'Category'} Items</Text>
                        {categoryLoading ? (
                            <ActivityIndicator size="small" color="#00E5FF" style={styles.suggestionsLoader} />
                        ) : categoryProducts.length > 0 ? (
                            <View style={styles.suggestionsContainer}>
                                {categoryProducts.map((item) => (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            if (!item.branchId) return;
                                            navigation.navigate('RestaurantDetail', {
                                                restaurant: {
                                                    _id: item.branchId,
                                                    name: item.branchName || item.sellerName || 'Restaurant',
                                                    address: item.branchAddress || '',
                                                    location: item.branchLocation || undefined,
                                                    image: item.image,
                                                },
                                            });
                                        }}
                                    >
                                        <Text style={styles.suggestionIcon}>🍽️</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.suggestionText}>{item.name}</Text>
                                            {!!item.price && (
                                                <Text style={styles.suggestionType}>Rs {item.price}</Text>
                                            )}
                                            {!item.branchId && (
                                                <Text style={styles.noBranchText}>No active branch linked</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noResultsText}>No products found for this category</Text>
                        )}
                    </View>
                )}

                {/* Search Suggestions (Live) */}
                {query.length >= 2 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Suggestions</Text>
                        {loading ? (
                            <ActivityIndicator size="small" color="#00E5FF" style={styles.suggestionsLoader} />
                        ) : suggestions.length > 0 ? (
                            <View style={styles.suggestionsContainer}>
                                {suggestions.map((item) => (
                                    <TouchableOpacity 
                                        key={`${item.type}-${item._id}`} 
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            setQuery(item.name);
                                            // TODO: Navigate to search results
                                        }}>
                                        <Text style={styles.suggestionIcon}>
                                            {item.type === 'product' ? '🍽️' : item.type === 'category' ? '📂' : '🏪'}
                                        </Text>
                                        <Text style={styles.suggestionText}>{item.name}</Text>
                                        <Text style={styles.suggestionType}>{item.type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noResultsText}>No suggestions found</Text>
                        )}
                        {error && __DEV__ && (
                            <Text style={styles.errorText}>Debug: {error}</Text>
                        )}
                    </View>
                )}

                {/* Recent Searches */}
                {recent.length > 0 && query.length < 2 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            <TouchableOpacity onPress={clearRecent}>
                                <Text style={styles.clearText}>Clear All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tagsContainer}>
                            {recent.map((item) => (
                                <TouchableOpacity key={item} style={styles.tag}>
                                    <Text style={styles.tagText}>{item}</Text>
                                    <TouchableOpacity onPress={() => removeSearch(item)}>
                                        <Text style={styles.tagClose}>×</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Trending Searches */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trending Searches</Text>
                    <View style={styles.trendingGrid}>
                        {trendingSearches.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.trendingCard}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.trendingImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.trendingInfo}>
                                    <Text style={styles.trendingName}>{item.name}</Text>
                                    <Text style={styles.trendingTrend}>{item.trend}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Promotional Banner */}
                <TouchableOpacity style={styles.promoBanner}>
                    <Text style={styles.promoTitle}>Midnight Cravings?</Text>
                    <Text style={styles.promoSubtitle}>
                        Get 40% OFF on all late-night orders.
                    </Text>
                    <View style={styles.promoButton}>
                        <Text style={styles.promoButtonText}>ORDER NOW</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    cartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartIcon: {
        fontSize: 18,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 14,
    },
    voiceButton: {
        padding: 8,
    },
    voiceIcon: {
        fontSize: 18,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    clearText: {
        fontSize: 14,
        color: '#00E5FF',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 8,
    },
    tagClose: {
        fontSize: 16,
        color: '#9E9E9E',
    },
    trendingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },
    trendingCard: {
        width: '48%',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    trendingImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    trendingInfo: {
        flex: 1,
    },
    trendingName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    trendingTrend: {
        fontSize: 12,
        color: '#00E5FF',
    },
    promoBanner: {
        marginHorizontal: 16,
        backgroundColor: '#0A2A2A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    promoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    promoSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 16,
    },
    promoButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    promoButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    suggestionsLoader: {
        marginTop: 12,
    },
    suggestionsContainer: {
        marginTop: 12,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        marginBottom: 8,
    },
    suggestionIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    suggestionText: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
    },
    suggestionType: {
        fontSize: 12,
        color: '#9E9E9E',
        textTransform: 'capitalize',
    },
    noResultsText: {
        fontSize: 14,
        color: '#9E9E9E',
        marginTop: 12,
        fontStyle: 'italic',
    },
    errorText: {
        fontSize: 12,
        color: '#FF5252',
        marginTop: 8,
    },
    noBranchText: {
        fontSize: 11,
        color: '#FF8A65',
        marginTop: 2,
    },
});

export default SearchScreen;
