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
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { restaurantsApi, Restaurant, MenuItem } from '../../../api';
import { useCartStore } from '../../../store/cartStore';
import { SCREENS } from '../../../constants';
import { BackButton } from '../../../components/ui/BackButton';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

const menuCategories = ['Recommended', 'Combos', 'Main Course', 'Starters', 'Desserts'];

// Mock menu items for fallback
const mockMenuItems: MenuItem[] = [
    {
        _id: '1',
        name: 'Truffle Mushroom Risotto',
        description: 'Creamy arborio rice cooked with wild mushrooms, black truffle oil, and aged parmesan cheese.',
        price: 24.00,
        originalPrice: 30.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCph6QQr9sw-e2qtkW0Ujmnbhcgylk7axX8zUgxt6BfUUN_7OpXbYnTqOtF7j3QgEVtX-h0O9I5PbyquS3LHPuX3Fq2mqe4t8KBnGmGJIqfCy7dsJ1syoGjeHxSlf10NXv7qkVAM6eI244t8Juz62V6iH3r2Pbea8hKBLrafV9__qJFW4tSrRLzHgKzAurpAyF1RPhnZs0NGw7IPaZcB_-SoT86FOHRbXVZv0qJm8P3faAW_TCu8EDYBgSsHR9cD2-AYmMw0puxeKgf',
        isVeg: true,
        isBestseller: true,
        category: 'Recommended',
    },
    {
        _id: '2',
        name: 'Spicy Tuna Tartare',
        description: 'Fresh yellowfin tuna cubes marinated in soy, sesame oil, and chili, served with crispy wonton chips.',
        price: 18.50,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaeJpHQ9VxZtom_8j6qUq3p1_o0JyU5Ob1bI4jLGAlY7LCq42Yc65yri4zdtm1MD2qXlDj0PfSL6_Ohau5ni3raOf-VrhSdTLmIDhCgS6YKLd53FQjNzzYoBvDrODljOCNNUnWD9zSiuOFCiQKuoofedw9xCASgRlBskoDA2EK-Rfg9zmvCsrtXZJj5Ra1inyxbfwAbYv58iJ5O44tGqFAa08k_Ix358z74Nt5PYze9JURo8GIN0ir9opNOVBNaBOqx2hom6lm745p',
        isVeg: false,
        isBestseller: false,
        category: 'Recommended',
    },
    {
        _id: '3',
        name: 'Avocado & Quinoa Salad',
        description: 'Organic quinoa, ripe avocado, cherry tomatoes, cucumber, and lemon vinaigrette.',
        price: 16.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4pgP27mhURLdWTQ2DJvv0hs3aZQoxLtSe5t2UXk9GlzcFrfvdN4mZXjoBcznHOyRT0F3Pbg0AXE_6Hg9J6wVqYFZ0uNCBbxf17DSzjWlmozISIwijRGMfXfXBQcPAJbkfkNz6xRbh2ZEuHPKq8T293d72aztpE7PhwOyQQqyUBqStprg6RfHoKxCN8i9Ov-tI3o_0BgDZilmraz3awkxvZZgcZZZzdOZvS04hmPPprAGYj6_5bEFPBoLdrqmxL5EtSlQ-fMa14zgY',
        isVeg: true,
        isBestseller: false,
        category: 'Starters',
    },
    {
        _id: '4',
        name: 'Sushi Platter Deluxe',
        description: '24 pieces of assorted nigiri, sashimi, and maki rolls. Serves 2.',
        price: 45.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIjQ1MczSUGCtPAcRActJ1jO1suMFfvrkLV2R6TrR6ikEwFO19nDOA7t7-uCbau8QsMkOwv5TAQPMGEMhDy-OhZQOjHJoVHhbGmSjTuayqHMfQ71szlq-qqu8E3NjzLwlAs0COLHLNMiCdnw8QwhDRhaLt1zLLeVl2SSxt5-CsVeUuPpq4GvXkXx_YueTwvavQmw-T7Ce5j1gKV6hhVLwDbkeBpkavWjN6mLb_bzZn6NwvwwnsX9x-wvqs95-bMZ2Uq6VLwwJz1S71',
        isVeg: false,
        isBestseller: true,
        category: 'Combos',
    },
];

const offers = [
    { id: '1', text: 'Flat 20% OFF above ₹500', code: 'SAVE20' },
    { id: '2', text: 'Free Delivery on first order', code: 'FREEDEL' },
];

export const RestaurantDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    // Get restaurant from navigation params or use default
    const navRestaurant = route.params?.restaurant;
    const restaurantId = route.params?.restaurantId || navRestaurant?._id || navRestaurant?.id;

    const [restaurant, setRestaurant] = useState<Partial<Restaurant>>(navRestaurant || {});
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [menuCategories, setMenuCategories] = useState<string[]>([]);
    const [apiFailed, setApiFailed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch restaurant details and menu if restaurantId is provided
    useEffect(() => {
        if (restaurantId) {
            fetchRestaurantData(restaurantId);
        }
    }, [restaurantId]);

    const fetchRestaurantData = async (id: string) => {
        setLoading(true);
        setError(null);

        // Fetch restaurant details
        const restaurantResult = await restaurantsApi.fetchRestaurantDetails(id);
        if (restaurantResult.success) {
            setRestaurant(prev => ({ ...prev, ...restaurantResult.data }));
        } else if (__DEV__) {
            setError(`Failed to load restaurant: ${restaurantResult.error}`);
        }

        // Fetch menu
        const menuResult = await restaurantsApi.fetchRestaurantMenu(id);
        if (menuResult.success) {
            setMenuItems(menuResult.data.items || []);
            setMenuCategories(menuResult.data.categories || ['Recommended']);
            setApiFailed(false);
        } else {
            console.log('Menu fetch failed:', menuResult.error);
            setApiFailed(true);
            // Only use mock data in dev mode when API fails
            if (__DEV__) {
                setMenuItems(mockMenuItems);
                setMenuCategories(['Recommended', 'Combos', 'Main Course', 'Starters', 'Desserts']);
            }
        }

        setLoading(false);
    };

    const [selectedCategory, setSelectedCategory] = useState('Recommended');
    const { items: storeItems, addItem: addCartItem, removeItem: removeCartItem } = useCartStore();

    // API menu items use `_id`; mock fallback uses `id`. Normalize to a single key.
    const getItemKey = (item: any) => String(item?._id || item?.id);

    const getCartCount = (itemKey: string) => {
        const found = storeItems.find((entry) => entry.menuItem.id === itemKey);
        return found?.quantity || 0;
    };

    const addToCart = (item: any) => {
        const key = getItemKey(item);
        addCartItem(
            String(restaurantId || restaurant?._id || ''),
            String(restaurant.name || 'Restaurant'),
            {
                id: key,
                name: item.name,
                description: item.description || '',
                price: Number(item.price) || 0,
                originalPrice: item.originalPrice,
                image: item.image || '',
                category: item.category || 'Recommended',
                isVeg: !!item.isVeg,
                isBestseller: !!item.isBestseller,
                isAvailable: item.isAvailable !== false,
            }
        );
    };

    const removeFromCart = (item: any) => {
        removeCartItem(getItemKey(item));
    };

    const totalItems = storeItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = storeItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    const filteredItems = menuItems.filter(
        (item) => selectedCategory === 'Recommended' || item.category === selectedCategory,
    );

    // Show loading state while fetching
    if (loading && !navRestaurant) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#00E5FF" />
                <Text style={styles.loadingText}>Loading restaurant...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header Image */}
            <View style={styles.headerImage}>
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe1xuBri4Ex6KQBM0qQWWV0dkxfv7Xwp0fwXQ4u9f9-fVnzGNVWDRZtF_Kt7jW6PxtoD7_uZ2aQLPZuVWbehy0BD6d_h5jrivCLkvBNdc2d6YPfgK7q2kaU1AZeXwROYx9E1ih55VNuVEOAVpxbP-aUkbJhZwZlb_UgyH3am3w1OWTolOEHdxkqJWslSk9IH-N0jl1QxqanUBnDH4CvCqZRFnq2w-_zWF5BbPEUM-bVHKF8CWCI_CIVm2QNrOx1nsENAxqR-jThNu6' }}
                    style={styles.coverImage}
                    resizeMode="cover"
                />
                <View style={styles.headerOverlay}>
                    <BackButton onPress={() => navigation.goBack()} />
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>🔍</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionIcon}>❤️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Restaurant Info */}
                <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantHeader}>
                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{restaurant.rating} ★</Text>
                        </View>
                    </View>
                    <Text style={styles.cuisineText}>
                        {restaurant.cuisines?.join(' • ')} • {restaurant.priceLevel}
                    </Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>📍 2.5 km away</Text>
                        <Text style={styles.metaText}>🕐 {restaurant.deliveryTime}</Text>
                    </View>
                </View>

                {/* Offers */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.offersContainer}
                    contentContainerStyle={styles.offersContent}>
                    {offers.map((offer) => (
                        <View key={offer.id} style={styles.offerCard}>
                            <Text style={styles.offerIcon}>🏷️</Text>
                            <View>
                                <Text style={styles.offerText}>{offer.text}</Text>
                                <Text style={styles.offerCode}>Use {offer.code}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Menu Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}>
                    {menuCategories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryTab,
                                selectedCategory === category && styles.categoryTabActive,
                            ]}
                            onPress={() => setSelectedCategory(category)}>
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive,
                                ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Menu Loading State */}
                {loading && (
                    <View style={styles.menuLoadingContainer}>
                        <ActivityIndicator size="large" color="#00E5FF" />
                        <Text style={styles.menuLoadingText}>Loading menu...</Text>
                    </View>
                )}

                {/* Menu Empty State */}
                {!loading && menuItems.length === 0 && !apiFailed && (
                    <View style={styles.menuEmptyContainer}>
                        <Text style={styles.menuEmptyIcon}>🍽️</Text>
                        <Text style={styles.menuEmptyTitle}>No Menu Available</Text>
                        <Text style={styles.menuEmptyText}>
                            This restaurant hasn't added any items yet.
                        </Text>
                    </View>
                )}

                {/* Dev Mode Mock Data Notice */}
                {!loading && apiFailed && __DEV__ && (
                    <View style={styles.devNoticeContainer}>
                        <Text style={styles.devNoticeText}>
                            ⚠️ API failed - showing mock data for development
                        </Text>
                    </View>
                )}

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {filteredItems.map((item) => (
                        <View key={getItemKey(item)} style={styles.menuItem}>
                            <View style={styles.menuItemInfo}>
                                <View style={styles.vegIndicator}>
                                    <View
                                        style={[
                                            styles.vegDot,
                                            { backgroundColor: item.isVeg ? '#00C853' : '#FF5252' },
                                        ]}
                                    />
                                </View>
                                {item.isBestseller && (
                                    <View style={styles.bestsellerBadge}>
                                        <Text style={styles.bestsellerText}>★ Bestseller</Text>
                                    </View>
                                )}
                                <Text style={styles.itemName}>{item.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>
                                            ₹{item.originalPrice.toFixed(2)}
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.itemDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                            </View>
                            <View style={styles.menuItemImage}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                                {getCartCount(getItemKey(item)) ? (
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => removeFromCart(item)}>
                                            <Text style={styles.quantityButtonText}>−</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{getCartCount(getItemKey(item))}</Text>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => addToCart(item)}>
                                            <Text style={styles.quantityButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => addToCart(item)}>
                                        <Text style={styles.addButtonText}>ADD</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Cart Bar */}
            {totalItems > 0 && (
                <TouchableOpacity
                    style={styles.cartBar}
                    activeOpacity={0.9}
                    onPress={() =>
                        navigation.navigate(SCREENS.CHECKOUT, {
                            branchId: restaurantId,
                            deliveryLocation: route.params?.deliveryLocation || { latitude: 15.8497, longitude: 74.4977 },
                        })
                    }
                >
                    <View style={styles.cartInfo}>
                        <Text style={styles.cartItems}>{totalItems} ITEMS</Text>
                        <Text style={styles.cartTotal}>₹{totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.cartAction}>
                        <Text style={styles.cartActionText}>View Cart</Text>
                        <Text style={styles.cartArrow}>→</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9E9E9E',
    },
    menuLoadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    menuLoadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#9E9E9E',
    },
    menuEmptyContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    menuEmptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    menuEmptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    menuEmptyText: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
    },
    devNoticeContainer: {
        backgroundColor: '#FFB30020',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    devNoticeText: {
        fontSize: 12,
        color: '#FFB300',
        textAlign: 'center',
    },
    headerImage: {
        height: 200,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 18,
    },
    restaurantInfo: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    ratingBadge: {
        backgroundColor: '#00C853',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cuisineText: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
    },
    metaText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    offersContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    offersContent: {
        padding: 16,
        gap: 12,
    },
    offerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    offerIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    offerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    offerCode: {
        fontSize: 12,
        color: '#00E5FF',
    },
    categoriesContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    categoriesContent: {
        padding: 16,
        gap: 8,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        marginRight: 8,
    },
    categoryTabActive: {
        backgroundColor: '#00E5FF',
    },
    categoryText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    categoryTextActive: {
        color: '#000000',
        fontWeight: '600',
    },
    menuContainer: {
        padding: 16,
    },
    menuItem: {
        flexDirection: 'row',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
        paddingBottom: 24,
    },
    menuItemInfo: {
        flex: 1,
        paddingRight: 16,
    },
    vegIndicator: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#00C853',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    bestsellerBadge: {
        backgroundColor: '#FFB300',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    bestsellerText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    originalPrice: {
        fontSize: 14,
        color: '#6B6B6B',
        textDecorationLine: 'line-through',
    },
    itemDescription: {
        fontSize: 14,
        color: '#6B6B6B',
        lineHeight: 20,
    },
    menuItemImage: {
        alignItems: 'center',
    },
    itemImage: {
        width: 120,
        height: 100,
        borderRadius: 12,
    },
    addButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: -15,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00E5FF',
        borderRadius: 20,
        marginTop: -15,
        paddingHorizontal: 8,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        paddingHorizontal: 8,
    },
    bottomSpacing: {
        height: 100,
    },
    cartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#00E5FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 30,
    },
    cartInfo: {
        flexDirection: 'row',
        gap: 10,
    },
    cartItems: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    cartTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    cartAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cartActionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    cartArrow: {
        fontSize: 18,
        color: '#000000',
    },
});

export default RestaurantDetailScreen;
