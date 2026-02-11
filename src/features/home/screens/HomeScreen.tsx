import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS, FEATURE_FLAGS } from '../../../constants';
import { homeApi, HomeResponse, Restaurant } from '../../../api';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

// Mock data
const categories = [
    { id: '1', name: 'Burgers', icon: '🍔' },
    { id: '2', name: 'Pizza', icon: '🍕' },
    { id: '3', name: 'Desserts', icon: '🍰' },
    { id: '4', name: 'Drinks', icon: '🥤' },
    { id: '5', name: 'Biryani', icon: '🍛' },
    { id: '6', name: 'Chinese', icon: '🥡' },
];

const quickActions = [
    { id: '1', name: 'Bolt', icon: '⚡', color: '#00E5FF', enabled: FEATURE_FLAGS.ENABLE_BOLT_DELIVERY },
    { id: '2', name: '99 Store', icon: '🏪', color: '#FFB300', enabled: FEATURE_FLAGS.ENABLE_NINETY_NINE_STORE },
    { id: '3', name: 'Offers', icon: '🏷️', color: '#FF5252', enabled: FEATURE_FLAGS.ENABLE_FLASH_DEALS },
    { id: '4', name: 'Dining', icon: '🍽️', color: '#00C853', enabled: FEATURE_FLAGS.ENABLE_DINING_OUT },
].filter(action => action.enabled);

// Mock restaurants (dev-only fallback). For pilot/release we prefer real API data.
const restaurants = [
    {
        id: '1',
        name: 'The Gourmet Kitchen',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh2fIAp9oyd2iKcXdCrUMWQo-idGSY6th2lWcn9JIWULsmhc9WMTTqCmUdFV-PqxqxB9w5UEdfyYF0-jhhPpJz1GJhYuuyTp3snHteh1RUOXUvzOsfLXdiBsMXmrUHqwfmNDqOc6L2jBSJiNSrv844oTPWPbTQDs6snW2cs85oeWC0vTEegACwjG3td5PpsC8Pa07tJPbnHgLKopcnHh7Bcrrm4eLldCAfitrNBxdqO3xzNizP-0HxQEu4LbZBZprZfRFIO3blYvEi',
        rating: 4.8,
        cuisines: ['Continental', 'Italian'],
        deliveryTime: '20-30 mins',
        priceLevel: '$$',
        hasOffer: true,
        offerText: 'FREE DELIVERY',
    },
    {
        id: '2',
        name: 'Urban Bites',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg1Hac2hi31tHaIUsrco1AUdt9EwRhBjTeJ3P0Wh5_6TYMKDCzlx8UHu4liDZJoxSLtlN9yUJMirrP59RBel6fq_yvagtQ2XsWO7CQuEnAgYLYtyYWl46XdXVo-pDxv1HDLsghJ-asBzkhLggH7_cKYmWOkbEeeuj1jHPnpBxb0EwkPM_gDt3d6abw5g5zkPkHHLjcwt4zcH12yKVWS9vGeZqAQes3BSZwlMiZJiq9rYZYvnMQFd_eUcWTbc2KvdcRF7B1Xu9gUcUq',
        rating: 4.5,
        cuisines: ['Fast Food', 'American'],
        deliveryTime: '15-25 mins',
        priceLevel: '$',
        hasOffer: false,
    },
    {
        id: '3',
        name: 'Cyan Spice',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI-c8QszP_pPOf7jrVL7irkdep3O0vXq7fcjUszzjAPHTYBS9_kjmyeo1C8rklt2ijyKoSf8NjFzyODh_PkBjP-EIA4m-EKe2vKa-dD-AxDu9CvyT99y_8pbR_FWCKEeMhU6PHhXMx3E7O2vsHKBYN34Dxps657IB_gJptLzaHnSar11u5njYhUEfV0NPB07XzvYB_P0JCEer0iC38mDX-ilCaGtX6Hjtge7WeB39DbZ2wsUSETZKRYjGETA9eiaPUmRLEIrb4FBUW',
        rating: 4.6,
        cuisines: ['Thai', 'Asian'],
        deliveryTime: '25-35 mins',
        priceLevel: '$$',
        hasOffer: true,
        offerText: '20% OFF',
    },
    {
        id: '4',
        name: 'Paradise Biryani',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDL_hv9NIrd8zZtdLBqQHd-5MAAQSZMqYtMgg9wmoQSUBWyydGORerIaxcxEZPObCaVmlJt7-T1Fpn_oeLFSW-qjcvK69sKfe-QJPFj7Vhnd_5OTsKvcRAHXmFdPVdJLkOcR_XyZ5oos10D-T81uS-b98KedNVLtQvAvnWv4cLponieo9yYw5ZrBAGjdoqn9wTaY4NZGOomdAkK8rVyVUtTT2RfZpdzE6UOhEe_2QhmCJRL_deG1zh8rt4CvLWMg_XI5yLBwogF944',
        rating: 4.9,
        cuisines: ['Indian', 'Mughal'],
        deliveryTime: '30-40 mins',
        priceLevel: '$$$',
        hasOffer: false,
    },
];


export const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [location] = useState('Camp, Belagavi');
    const [homeData, setHomeData] = useState<HomeResponse | null>(null);
    const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch home data from API
    useEffect(() => {
        const loadHomeData = async () => {
            setLoading(true);
            setError(null);
            const [homeResult, nearbyResult] = await Promise.all([
                homeApi.fetchHome(),
                homeApi.fetchNearbyBranches({
                    latitude: 15.8497,
                    longitude: 74.4977,
                    radius: 15,
                }),
            ]);

            if (homeResult.success) {
                setHomeData(homeResult.data);
            }
            if (nearbyResult.success) {
                setNearbyRestaurants(Array.isArray(nearbyResult.data) ? nearbyResult.data : []);
            }

            if (!homeResult.success && !nearbyResult.success) {
                setError(homeResult.error || nearbyResult.error || 'Failed to load home data');
            }
            setLoading(false);
        };

        loadHomeData();
    }, []);

    // Get categories from API or fallback to mock
    const displayCategories = homeData?.sections?.find(s => s.type === 'category_grid')?.data?.tiles?.map((tile: any) => ({
        id: String(tile?.id || tile?.categoryId || tile?.name),
        name: tile?.name || tile?.label || 'Category',
        icon: tile?.icon || '🍽️',
    })) || categories;

    // Get banner items from API or empty
    const bannerItems = homeData?.sections?.find(s => s.type === 'banner_carousel')?.data?.items || [];

    // Restaurants from API (preferred).
    const apiRestaurantsFromHome =
        homeData?.sections?.find(s => s.type === 'restaurant_list')?.data?.restaurants || [];

    // Prefer dedicated seller endpoint, then /home sections, then dev-only fallback.
    const displayRestaurants =
        (nearbyRestaurants.length > 0)
            ? nearbyRestaurants
            : (apiRestaurantsFromHome.length > 0)
                ? apiRestaurantsFromHome
                : (error ? (__DEV__ ? restaurants : []) : []);

    const renderRestaurantCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurant: item })}
            activeOpacity={0.9}>
            <View style={styles.restaurantImageContainer}>
                <Image
                    source={{ uri: item.image || item.imageUrl }}
                    style={styles.restaurantImage}
                    resizeMode="cover"
                />
                {item.hasOffer && (
                    <View style={styles.offerBadge}>
                        <Text style={styles.offerText}>{item.offerText}</Text>
                    </View>
                )}
            </View>
            <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{item.rating || 4.0} ★</Text>
                    </View>
                </View>
                <Text style={styles.cuisineText} numberOfLines={1}>
                    {(Array.isArray(item.cuisines) && item.cuisines.length > 0 ? item.cuisines.join(' • ') : 'Multi-cuisine')} • {item.priceLevel || '₹₹'}
                </Text>
                <Text style={styles.deliveryText}>🕐 {item.deliveryTime || `${item.prepTimeMin || 30} mins`}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.locationContainer}
                    onPress={() => navigation.navigate(SCREENS.LOCATION_PICKER)}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <View>
                        <Text style={styles.locationLabel}>{location}</Text>
                        <Text style={styles.locationAddress}>Home • 45-2/A Main Street</Text>
                    </View>
                    <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => navigation.navigate(SCREENS.PROFILE)}>
                    <Text style={styles.profileIcon}>👤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => navigation.navigate(SCREENS.SEARCH)}
                    activeOpacity={0.8}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <Text style={styles.searchPlaceholder}>
                        Search for burgers, pizza or groceries
                    </Text>
                </TouchableOpacity>

                {/* Main Cards */}
                <View style={styles.mainCardsContainer}>
                    <TouchableOpacity style={[styles.mainCard, styles.foodCard]}>
                        <View style={styles.cardBadge}>
                            <Text style={styles.cardBadgeText}>30% OFF</Text>
                        </View>
                        <Text style={styles.mainCardTitle}>Food{'\n'}Delivery</Text>
                        <View style={styles.neonBox} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.mainCard, styles.groceryCard]}>
                        <View style={[styles.cardBadge, styles.timeBadge]}>
                            <Text style={styles.cardBadgeText}>10 MINS</Text>
                        </View>
                        <Text style={styles.mainCardTitle}>Instamart{'\n'}Groceries</Text>
                        <View style={[styles.neonBox, styles.greenNeon]} />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.quickActionsContainer}
                    contentContainerStyle={styles.quickActionsContent}>
                    {quickActions.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={[
                                styles.quickActionButton,
                                { backgroundColor: action.id === '1' ? '#00E5FF' : '#2A2A2A' },
                            ]}
                            onPress={() => {
                                if (action.id === '1') navigation.navigate(SCREENS.BOLT_DELIVERY);
                                if (action.id === '2') navigation.navigate(SCREENS.NINETY_NINE_STORE);
                                if (action.id === '3') navigation.navigate(SCREENS.FLASH_DEALS);
                                if (action.id === '4') navigation.navigate(SCREENS.DINE_IN);
                            }}>
                            <Text style={styles.quickActionIcon}>{action.icon}</Text>
                            <Text
                                style={[
                                    styles.quickActionText,
                                    { color: action.id === '1' ? '#000000' : '#FFFFFF' },
                                ]}>
                                {action.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

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
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#00E5FF" />
                    </View>
                ) : (
                    <View style={styles.categoriesContainer}>
                        {displayCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryItem}
                                onPress={() =>
                                    navigation.navigate(SCREENS.SEARCH, {
                                        categoryId: category.id,
                                        categoryName: category.name,
                                    })
                                }
                            >
                                <View style={styles.categoryIcon}>
                                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                                </View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Error message if API fails */}
                {error && __DEV__ && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Debug: {error}</Text>
                    </View>
                )}

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    locationIcon: {
        fontSize: 20,
        marginRight: 8,
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
        fontSize: 10,
        color: '#9E9E9E',
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
    profileIcon: {
        fontSize: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
    },
    searchIcon: {
        fontSize: 16,
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
        fontSize: 16,
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
        backgroundColor: '#00C853',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
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
    categoryEmoji: {
        fontSize: 24,
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
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#FF5252',
    },
});

export default HomeScreen;


