import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
    FlatList,
    Linking,
    RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MagnifyingGlass, Lightning, Storefront, Tag, Hamburger, Pizza, IceCream, Coffee, BowlFood, CookingPot, CaretDown, Microphone } from 'phosphor-react-native';
import { SCREENS, FEATURE_FLAGS } from '../../../constants';
import { homeApi, HomeResponse, Restaurant, rescueApi } from '../../../api';
import type { MainCard } from '../../../api/homeApi';
import { AnimatedButton } from '../../../components/ui/AnimatedButton';
import { AnimatedCard } from '../../../components/ui/AnimatedCard';
import { GlassmorphismCard } from '../../../components/ui/GlassmorphismCard';
import { HomeSkeleton } from '../../../components/ui/Skeleton';
import { AnimatedRestaurantCard } from '../../../components/ui/AnimatedRestaurantCard';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useAuthStore } from '../../../store/authStore';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

// Phosphor icon components for categories
const categoryIcons: Record<string, React.FC<{ size?: number; color?: string; weight?: any }>> = {
    '1': Hamburger,
    '2': Pizza,
    '3': IceCream,
    '4': Coffee,
    '5': BowlFood,
    '6': CookingPot,
};

// Quick actions with Phosphor icons
const quickActions = [
    { id: '1', name: 'Bolt', IconComponent: Lightning, color: '#00E5FF', enabled: FEATURE_FLAGS.ENABLE_BOLT_DELIVERY },
    { id: '2', name: '99 Store', IconComponent: Storefront, color: '#FFB300', enabled: FEATURE_FLAGS.ENABLE_NINETY_NINE_STORE },
    { id: '3', name: 'Offers', IconComponent: Tag, color: '#FF5252', enabled: FEATURE_FLAGS.ENABLE_FLASH_DEALS },
    { id: '4', name: 'Dining', IconComponent: BowlFood, color: '#00C853', enabled: FEATURE_FLAGS.ENABLE_DINING_OUT },
].filter(action => action.enabled);

const clampNumber = (value: unknown, min: number, max: number): number | undefined => {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return undefined;
    return Math.max(min, Math.min(max, n));
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [location] = useState('Camp, Belagavi');
    const [homeData, setHomeData] = useState<HomeResponse | null>(null);
    const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
    const [rescueItems, setRescueItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const user = useAuthStore((state) => state.user);

    // Scroll tracking for 3D tilt effect
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Fetch home data from API
    const loadHomeData = async (isRefresh = false) => {
        if (!isRefresh) {
            setLoading(true);
        }
        setError(null);
        
        const [homeResult, nearbyResult, rescueResponse] = await Promise.all([
            homeApi.fetchHome(),
            homeApi.fetchNearbyBranches({
                latitude: 15.8497,
                longitude: 74.4977,
                radius: 15,
            }),
            rescueApi.getActiveRescue(),
        ]);

        if (homeResult.success) {
            setHomeData(homeResult.data);
        }
        if (nearbyResult.success) {
            setNearbyRestaurants(Array.isArray(nearbyResult.data) ? nearbyResult.data : []);
        }
        if (rescueResponse.success) {
            const rescueData = rescueResponse.data;
            setRescueItems(rescueData && Array.isArray((rescueData as any).items) ? (rescueData as any).items : []);
        }

        if (!homeResult.success && !nearbyResult.success && !rescueResponse.success) {
            setError(homeResult.error || nearbyResult.error || rescueResponse.error || 'Failed to load home data');
        }
        
        if (!isRefresh) {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHomeData();
    }, []);

    // Pull to refresh handler
    const onRefresh = async () => {
        setRefreshing(true);
        await loadHomeData(true);
        setRefreshing(false);
    };

    // Get categories from API only
    const displayCategories = homeData?.sections?.find(s => s.type === 'category_grid')?.data?.tiles?.map((tile: any) => ({
        id: String(tile?.id || tile?.categoryId || tile?.name),
        name: tile?.name || tile?.label || 'Category',
        icon: tile?.icon || '',
    })) || [];

    const mainCards =
        (homeData?.sections?.find((s) => s.type === 'main_cards')?.data?.cards as MainCard[] | undefined) ?? [];

    const handleMainCardPress = async (deepLink?: string) => {
        if (!deepLink || typeof deepLink !== 'string') return;

        if (deepLink.startsWith('screen:')) {
            const target = deepLink.slice('screen:'.length).trim();
            if (!target) return;

            // Allow either SCREENS key (e.g. BOLT_DELIVERY) or route name (e.g. BoltDelivery).
            const routeFromKey = (SCREENS as any)[target];
            const routeName = typeof routeFromKey === 'string' ? routeFromKey : target;

            // Enforce enabled routes (avoid navigating to disabled screens).
            const enabledRoutes = new Set<string>([
                FEATURE_FLAGS.ENABLE_BOLT_DELIVERY ? SCREENS.BOLT_DELIVERY : '',
                FEATURE_FLAGS.ENABLE_NINETY_NINE_STORE ? SCREENS.NINETY_NINE_STORE : '',
                FEATURE_FLAGS.ENABLE_FLASH_DEALS ? SCREENS.FLASH_DEALS : '',
            ].filter(Boolean));

            if (!enabledRoutes.has(routeName)) return;

            navigation.navigate(routeName as never);
            return;
        }

        if (deepLink.startsWith('url:')) {
            const url = deepLink.slice('url:'.length).trim();
            if (!url) return;
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            }
        }
    };

    // Restaurants from API (preferred).
    const apiRestaurantsFromHome =
        homeData?.sections?.find(s => s.type === 'restaurant_list')?.data?.restaurants || [];

    // Prefer dedicated seller endpoint, then /home sections.
    const displayRestaurants =
        (nearbyRestaurants.length > 0)
            ? nearbyRestaurants
            : apiRestaurantsFromHome;

    // New animated restaurant card with staggered entrance and 3D tilt
    const renderRestaurantCard = ({ item, index }: { item: any; index: number }) => (
        <AnimatedRestaurantCard
            item={item}
            index={index}
            scrollY={scrollY}
            onPress={() => navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurant: item })}
        />
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.locationContainer}
                    onPress={() => navigation.navigate(SCREENS.LOCATION_PICKER)}>
                    <View>
                        <Text style={styles.locationLabel}>{location}</Text>
                        <Text style={styles.locationAddress}>Home  45-2/A Main Street</Text>
                    </View>
                    <CaretDown size={12} color="#9E9E9E" weight="bold" style={styles.dropdownIcon} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => navigation.navigate(SCREENS.PROFILE)}>
                    <View style={styles.profileAvatar}>
                        <Text style={styles.profileInitial}>
                            {String(user?.name || 'U').trim().charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Animated.ScrollView 
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#00E5FF"
                        colors={['#00E5FF']}
                    />
                }>
                {/* Search + Voice row */}
                <View style={styles.searchRow}>
                    <AnimatedButton
                        style={styles.searchBar}
                        onPress={() => navigation.navigate(SCREENS.SEARCH)}>
                        <MagnifyingGlass size={20} color="#6B6B6B" weight="bold" style={styles.searchIcon} />
                        <Text style={styles.searchPlaceholder}>
                            Search for burgers, pizza or groceries
                        </Text>
                    </AnimatedButton>
                    <AnimatedButton
                        style={styles.voiceButton}
                        onPress={() => navigation.navigate(SCREENS.VOICE_ORDER)}>
                        <Microphone size={20} color="#000000" weight="fill" />
                    </AnimatedButton>
                </View>

                {/* Main Cards */}
                {mainCards.length === 0 ? (
                    <View style={styles.mainCardsEmpty}>
                        <Text style={styles.mainCardsEmptyTitle}>Main cards not configured</Text>
                        <Text style={styles.mainCardsEmptySub}>Configure Home main cards from AdminJS.</Text>
                    </View>
                ) : (
                    <View style={styles.mainCardsContainer}>
                        {mainCards.map((card) => {
                            const cardHeight = clampNumber(card.cardHeight, 120, 220) ?? 160;
                            const cardWidth = clampNumber(card.cardWidth, 140, 220);
                            const imageWidth = clampNumber(card.imageWidth, 24, 120) ?? 60;
                            const imageHeight = clampNumber(card.imageHeight, 24, 120) ?? 40;

                            return (
                                <AnimatedCard
                                    key={card.id}
                                    style={{ flex: cardWidth ? undefined : 1 }}
                                    onPress={() => handleMainCardPress(card.deepLink)}>
                                    <GlassmorphismCard
                                        intensity="medium"
                                        borderColor={card.borderColor || '#00E5FF'}
                                        style={[
                                            styles.mainCard,
                                            {
                                                height: cardHeight,
                                                ...(cardWidth ? { width: cardWidth } : null),
                                                backgroundColor: card.backgroundColor || '#0A1A2A',
                                            },
                                        ]}>
                                        {card.badgeText ? (
                                            <View style={[styles.cardBadge, { backgroundColor: card.badgeColor || '#00E5FF' }]}>
                                                <Text style={[styles.cardBadgeText, { color: card.badgeTextColor || '#000000' }]}>
                                                    {card.badgeText}
                                                </Text>
                                            </View>
                                        ) : null}

                                        <Text style={styles.mainCardTitle}>{card.title}</Text>
                                        <Image
                                            source={{ uri: card.imageUrl }}
                                            style={{
                                                position: 'absolute',
                                                bottom: 40,
                                                right: 20,
                                                width: imageWidth,
                                                height: imageHeight,
                                            }}
                                            resizeMode="contain"
                                        />
                                    </GlassmorphismCard>
                                </AnimatedCard>
                            );
                        })}
                    </View>
                )}

                {/* Quick Actions */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.quickActionsContainer}
                    contentContainerStyle={styles.quickActionsContent}>
                    {quickActions.map((action) => {
                        const IconComponent = action.IconComponent;
                        const isPrimary = action.id === '1';
                        return (
                            <AnimatedButton
                                key={action.id}
                                scale={0.92}
                                style={[
                                    styles.quickActionButton,
                                    { backgroundColor: isPrimary ? '#00E5FF' : '#2A2A2A' },
                                ]}
                                onPress={() => {
                                    if (action.id === '1') navigation.navigate(SCREENS.BOLT_DELIVERY);
                                    if (action.id === '2') navigation.navigate(SCREENS.NINETY_NINE_STORE);
                                    if (action.id === '3') navigation.navigate(SCREENS.FLASH_DEALS);
                                    if (action.id === '4') navigation.navigate(SCREENS.DINE_IN);
                                }}>
                                <IconComponent 
                                    size={18} 
                                    color={isPrimary ? '#000000' : '#FFFFFF'} 
                                    weight="bold"
                                    style={styles.quickActionIcon}
                                />
                                <Text
                                    style={[
                                        styles.quickActionText,
                                        { color: isPrimary ? '#000000' : '#FFFFFF' },
                                    ]}>
                                    {action.name}
                                </Text>
                            </AnimatedButton>
                        );
                    })}
                </ScrollView>

                {/* Food Rescue */}
                {rescueItems.length > 0 && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Food Rescue Deals</Text>
                            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.NINETY_NINE_STORE)}>
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.restaurantList}>
                            {rescueItems.slice(0, 12).map((item) => (
                                <TouchableOpacity
                                    key={String(item.id)}
                                    style={styles.rescueCard}
                                    activeOpacity={0.85}
                                    onPress={() => navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurantId: item?.branch?.id })}>
                                    <Image source={{ uri: item?.product?.image }} style={styles.rescueImage} />
                                    <Text style={styles.rescueName} numberOfLines={2}>{item?.product?.name || 'Rescue Item'}</Text>
                                    <Text style={styles.rescueBranch} numberOfLines={1}>{item?.branch?.name || ''}</Text>
                                    <View style={styles.rescuePriceRow}>
                                        <Text style={styles.rescuePrice}>Rs. {Number(item?.rescuePrice || 0).toFixed(0)}</Text>
                                        <Text style={styles.rescueOriginal}>Rs. {Number(item?.originalPrice || 0).toFixed(0)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* Top Recommendations */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Recommendations</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={displayRestaurants}
                    renderItem={renderRestaurantCard}
                    // Prefer _id for real API data, fallback to id for mocks.
                    keyExtractor={(item: any) => String(item?._id || item?.id)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.restaurantList}
                    ListEmptyComponent={
                        <View style={{ paddingVertical: 24, paddingHorizontal: 16 }}>
                            <Text style={{ color: '#9E9E9E', fontSize: 13 }}>
                                No restaurants available yet.
                            </Text>
                        </View>
                    }
                />

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Explore by Category</Text>
                </View>

                {loading ? (
                    <HomeSkeleton />
                ) : (
                    <View style={styles.categoriesContainer}>
                        {displayCategories.map((category, index) => {
                            const IconComponent = categoryIcons[category.id] || BowlFood;
                            return (
                                <AnimatedButton
                                    key={category.id}
                                    scale={0.9}
                                    style={styles.categoryItem}
                                    onPress={() =>
                                        navigation.navigate(SCREENS.SEARCH, {
                                            categoryId: category.id,
                                            categoryName: category.name,
                                        })
                                    }>
                                    <View style={styles.categoryIcon}>
                                        <IconComponent size={28} color="#00E5FF" weight="duotone" />
                                    </View>
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                </AnimatedButton>
                            );
                        })}
                    </View>
                )}

                {/* Error message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => loadHomeData()} style={styles.retryBtn}>
                            <Text style={styles.retryBtnText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </Animated.ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    locationLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    locationAddress: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    dropdownIcon: {
        marginLeft: 8,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    voiceButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#00E5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchPlaceholder: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    mainCardsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    mainCardsEmpty: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
        padding: 14,
    },
    mainCardsEmptyTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    mainCardsEmptySub: {
        color: '#9E9E9E',
        marginTop: 4,
        fontSize: 13,
    },
    mainCard: {
        flex: 1,
        height: 160,
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
    },
    foodCard: {
        backgroundColor: '#0A1A2A',
    },
    groceryCard: {
        backgroundColor: '#0A2A1A',
    },
    cardBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#00E5FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    timeBadge: {
        backgroundColor: '#FFFFFF',
    },
    cardBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
    },
    mainCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 'auto',
    },
    neonBox: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        width: 60,
        height: 40,
        borderWidth: 2,
        borderColor: '#00E5FF',
        borderRadius: 4,
    },
    greenNeon: {
        borderColor: '#00C853',
    },
    quickActionsContainer: {
        marginBottom: 20,
    },
    quickActionsContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    quickActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    quickActionIcon: {
        marginRight: 6,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    seeAllText: {
        fontSize: 14,
        color: '#00E5FF',
    },
    restaurantList: {
        paddingHorizontal: 16,
    },
    rescueCard: {
        width: 170,
        backgroundColor: '#141414',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        padding: 10,
        marginRight: 10,
    },
    rescueImage: {
        width: '100%',
        height: 88,
        borderRadius: 10,
        backgroundColor: '#0F0F0F',
        marginBottom: 8,
    },
    rescueName: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        minHeight: 34,
    },
    rescueBranch: {
        color: '#9E9E9E',
        fontSize: 11,
        marginTop: 2,
        marginBottom: 6,
    },
    rescuePriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rescuePrice: {
        color: '#00E5FF',
        fontSize: 13,
        fontWeight: '800',
        marginRight: 8,
    },
    rescueOriginal: {
        color: '#7A7A7A',
        fontSize: 12,
        textDecorationLine: 'line-through',
    },
    restaurantCard: {
        width: width * 0.65,
        marginRight: 16,
        borderRadius: 16,
        backgroundColor: '#1A1A1A',
        overflow: 'hidden',
    },
    restaurantImageContainer: {
        position: 'relative',
    },
    restaurantImage: {
        width: '100%',
        height: 140,
    },
    offerBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: '#00000099',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    offerText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    restaurantInfo: {
        padding: 12,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00C853',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cuisineText: {
        fontSize: 12,
        color: '#9E9E9E',
        marginBottom: 4,
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    deliveryText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 16,
    },
    categoryItem: {
        alignItems: 'center',
        width: (width - 64) / 4,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },

    categoryName: {
        fontSize: 12,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    bottomSpacing: {
        height: 100,
    },
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    errorContainer: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#2A1A1A',
        borderWidth: 1,
        borderColor: '#FF5252',
        alignItems: 'flex-start',
    },
    errorText: {
        color: '#FFB3B3',
        fontSize: 12,
    },
    retryBtn: {
        marginTop: 8,
        backgroundColor: '#00E5FF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    retryBtnText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '700',
    },
});

export default HomeScreen;


