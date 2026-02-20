import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { FunnelSimple, MagnifyingGlass, SlidersHorizontal, Star, Timer } from 'phosphor-react-native';
import { categoriesApi, homeApi, Restaurant } from '../../../api';
import { SCREENS } from '../../../constants';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

type SortMode = 'recommended' | 'rating_desc' | 'eta_asc';

const parseEtaMinutes = (value?: string) => {
    if (!value) return Number.MAX_SAFE_INTEGER;
    const nums = String(value).match(/\d+/g);
    if (!nums || nums.length === 0) return Number.MAX_SAFE_INTEGER;
    return Math.min(...nums.map((n) => Number(n)).filter(Number.isFinite));
};

export const FoodScreen: React.FC<Props> = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [sortMode, setSortMode] = useState<SortMode>('recommended');

    const categoriesQuery = useQuery({
        queryKey: ['foodCategories'],
        queryFn: async () => {
            const response = await categoriesApi.fetchCategories();
            if (!response.success) throw new Error(response.error || 'Failed to load categories');
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const restaurantsQuery = useQuery({
        queryKey: ['foodNearbyRestaurants'],
        queryFn: async () => {
            const response = await homeApi.fetchNearbyBranches({
                latitude: 15.8497,
                longitude: 74.4977,
                radius: 15,
            });
            if (!response.success) throw new Error(response.error || 'Failed to load restaurants');
            return (Array.isArray(response.data) ? response.data : []) as Restaurant[];
        },
        staleTime: 2 * 60 * 1000,
    });

    const categories = useMemo(() => {
        const apiCats = categoriesQuery.data || [];
        return [{ _id: 'all', name: 'All' }, ...apiCats];
    }, [categoriesQuery.data]);

    const filteredRestaurants = useMemo(() => {
        const source = restaurantsQuery.data || [];
        const q = search.trim().toLowerCase();

        const bySearch = source.filter((item: any) => {
            if (!q) return true;
            const name = String(item?.name || item?.storeName || '').toLowerCase();
            const cuisines = Array.isArray(item?.publicProfile?.cuisines)
                ? item.publicProfile.cuisines.join(' ').toLowerCase()
                : '';
            return name.includes(q) || cuisines.includes(q);
        });

        const byCategory =
            selectedCategoryId === 'all'
                ? bySearch
                : bySearch.filter((item: any) => {
                    const category = String(item?.category?._id || item?.category || '');
                    return category === selectedCategoryId;
                });

        const sorted = byCategory.slice();
        if (sortMode === 'rating_desc') {
            sorted.sort((a: any, b: any) => Number(b?.rating || 0) - Number(a?.rating || 0));
        } else if (sortMode === 'eta_asc') {
            sorted.sort((a: any, b: any) => parseEtaMinutes(a?.deliveryTime) - parseEtaMinutes(b?.deliveryTime));
        }

        return sorted;
    }, [restaurantsQuery.data, search, selectedCategoryId, sortMode]);

    const renderRestaurant = ({ item }: { item: any }) => {
        const id = String(item?._id || item?.id || '');
        const name = String(item?.name || item?.storeName || 'Restaurant');
        const img = String(item?.image || '');
        const rating = Number(item?.rating || item?.publicProfile?.ratings?.overall || 0);
        const eta = String(item?.deliveryTime || '30-40 mins');
        const cuisines = Array.isArray(item?.publicProfile?.cuisines) ? item.publicProfile.cuisines : item?.cuisines || [];

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurantId: id, restaurant: item })}>
                <Image source={{ uri: img }} style={styles.cardImage} resizeMode="cover" />
                <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {name}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                        {Array.isArray(cuisines) ? cuisines.join(' • ') : ''}
                    </Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaPill}>
                            <Star size={12} color="#FFB300" weight="fill" />
                            <Text style={styles.metaText}>{rating > 0 ? rating.toFixed(1) : 'New'}</Text>
                        </View>
                        <View style={styles.metaPill}>
                            <Timer size={12} color="#00E5FF" weight="bold" />
                            <Text style={styles.metaText}>{eta}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View style={styles.header}>
                <Text style={styles.title}>Food</Text>
                <View style={styles.sortRow}>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortMode === 'recommended' && styles.sortBtnActive]}
                        onPress={() => setSortMode('recommended')}>
                        <FunnelSimple size={14} color={sortMode === 'recommended' ? '#000' : '#9E9E9E'} weight="bold" />
                        <Text style={[styles.sortTxt, sortMode === 'recommended' && styles.sortTxtActive]}>Recommended</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortMode === 'rating_desc' && styles.sortBtnActive]}
                        onPress={() => setSortMode('rating_desc')}>
                        <Star size={14} color={sortMode === 'rating_desc' ? '#000' : '#9E9E9E'} weight="fill" />
                        <Text style={[styles.sortTxt, sortMode === 'rating_desc' && styles.sortTxtActive]}>Top Rated</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sortBtn, sortMode === 'eta_asc' && styles.sortBtnActive]}
                        onPress={() => setSortMode('eta_asc')}>
                        <SlidersHorizontal size={14} color={sortMode === 'eta_asc' ? '#000' : '#9E9E9E'} weight="bold" />
                        <Text style={[styles.sortTxt, sortMode === 'eta_asc' && styles.sortTxtActive]}>Fastest</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchBar}>
                <MagnifyingGlass size={18} color="#6B6B6B" weight="bold" />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    placeholder="Search restaurants or cuisines"
                    placeholderTextColor="#6B6B6B"
                />
            </View>

            <FlatList
                horizontal
                data={categories}
                keyExtractor={(item: any) => String(item?._id || item?.id)}
                contentContainerStyle={styles.categoryList}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }: { item: any }) => {
                    const id = String(item?._id || item?.id || 'all');
                    const active = selectedCategoryId === id;
                    return (
                        <TouchableOpacity
                            style={[styles.categoryChip, active && styles.categoryChipActive]}
                            onPress={() => setSelectedCategoryId(id)}>
                            <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{item?.name || 'Category'}</Text>
                        </TouchableOpacity>
                    );
                }}
            />

            <FlatList
                data={filteredRestaurants}
                keyExtractor={(item: any) => String(item?._id || item?.id)}
                refreshControl={
                    <RefreshControl
                        refreshing={restaurantsQuery.isRefetching}
                        onRefresh={() => restaurantsQuery.refetch()}
                        tintColor="#00E5FF"
                        colors={['#00E5FF']}
                    />
                }
                contentContainerStyle={styles.listContent}
                renderItem={renderRestaurant}
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <Text style={styles.emptyTitle}>No restaurants found</Text>
                        <Text style={styles.emptySub}>Try changing search or filter.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
    title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 10 },
    sortRow: { flexDirection: 'row', gap: 8 },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 7,
        backgroundColor: '#1A1A1A',
    },
    sortBtnActive: { backgroundColor: '#00E5FF', borderColor: '#00E5FF' },
    sortTxt: { color: '#9E9E9E', fontSize: 12, fontWeight: '600' },
    sortTxtActive: { color: '#000000' },
    searchBar: {
        marginHorizontal: 16,
        borderRadius: 14,
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        paddingHorizontal: 12,
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchInput: { flex: 1, color: '#FFFFFF', paddingVertical: 10, marginLeft: 8 },
    categoryList: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 8 },
    categoryChip: {
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
    },
    categoryChipActive: { borderColor: '#00E5FF', backgroundColor: '#00E5FF22' },
    categoryText: { color: '#9E9E9E', fontSize: 12, fontWeight: '600' },
    categoryTextActive: { color: '#00E5FF' },
    listContent: { paddingHorizontal: 16, paddingBottom: 30, gap: 10 },
    card: {
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: '#222222',
        borderRadius: 14,
        overflow: 'hidden',
    },
    cardImage: { width: '100%', height: 150, backgroundColor: '#1A1A1A' },
    cardBody: { padding: 12 },
    cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    cardSubtitle: { color: '#9E9E9E', fontSize: 12, marginTop: 4 },
    metaRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    metaText: { color: '#CFCFCF', fontSize: 11, fontWeight: '600' },
    emptyWrap: { paddingVertical: 40, alignItems: 'center' },
    emptyTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    emptySub: { color: '#9E9E9E', marginTop: 6 },
});
