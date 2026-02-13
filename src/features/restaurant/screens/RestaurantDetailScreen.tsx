import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TextInput,
    ScrollView,
    FlatList,
    RefreshControl,
    AccessibilityInfo,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MagnifyingGlass } from 'phosphor-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { restaurantsApi, Restaurant, MenuItem } from '../../../api';
import { useCartStore } from '../../../store/cartStore';
import { SCREENS } from '../../../constants';
import { BackButton } from '../../../components/ui/BackButton';
import { useQuery } from '@tanstack/react-query';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

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

const fallbackOffers = [
    { id: '1', text: 'Flat 20% OFF above â‚¹500', code: 'SAVE20' },
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

    const [ttlSeconds, setTtlSeconds] = useState(300);
    const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

    // Toast: "Updated just now" (debounced)
    const [toastVisible, setToastVisible] = useState(false);
    const lastToastAtRef = React.useRef<number>(0);
    const lastProfileUpdatedAtRef = React.useRef<string | null>(null);
    const isFirstDataRef = React.useRef(true);

    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled()
            .then((v) => setReduceMotionEnabled(!!v))
            .catch(() => setReduceMotionEnabled(false));
    }, []);

    const menuQuery = useQuery({
        queryKey: ['restaurantMenu', String(restaurantId || '')],
        enabled: !!restaurantId,
        queryFn: async () => {
            const res = await restaurantsApi.fetchRestaurantMenu(String(restaurantId));
            if (!res.success) throw new Error(res.error || 'Failed to load menu');
            return res.data;
        },
        staleTime: ttlSeconds * 1000,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        const data = menuQuery.data;
        if (!data) return;

        setRestaurant((prev) => ({ ...prev, ...data.restaurant }));
        setMenuItems(data.items || []);
        setMenuCategories(data.categories || ['Recommended']);
        setApiFailed(false);

        const serverTtl = Number(data.restaurant?.publicProfile?.cacheConfig?.ttlSeconds);
        if ([30, 60, 180, 300, 900].includes(serverTtl)) {
            setTtlSeconds(serverTtl);
        }

        const profileUpdatedAt = data.restaurant?.publicProfile?.profileUpdatedAt || null;
        if (isFirstDataRef.current) {
            isFirstDataRef.current = false;
            lastProfileUpdatedAtRef.current = profileUpdatedAt;
            return;
        }

        if (profileUpdatedAt && profileUpdatedAt !== lastProfileUpdatedAtRef.current) {
            const now = Date.now();
            if (now - lastToastAtRef.current > 30_000) {
                lastToastAtRef.current = now;
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 2000);
            }
            lastProfileUpdatedAtRef.current = profileUpdatedAt;
        }
    }, [menuQuery.data]);

    useEffect(() => {
        if (!menuQuery.isError) return;
        setApiFailed(true);
        if (__DEV__) {
            setMenuItems(mockMenuItems);
            setMenuCategories(['Recommended', 'Combos', 'Main Course', 'Starters', 'Desserts']);
        }
    }, [menuQuery.isError]);

    const [selectedCategory, setSelectedCategory] = useState('Recommended');
    const [foodFilter, setFoodFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const { items: storeItems, addItem: addCartItem, removeItem: removeCartItem, setCouponCode, couponCode: selectedCouponCode } = useCartStore();

    // Scroll tracking for parallax and sticky header
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Coupon carousel state (UI Polish Appendix A)
    const couponListRef = React.useRef<FlatList<any> | null>(null);
    const [couponIndex, setCouponIndex] = useState(0);
    const [isCarouselInteracting, setIsCarouselInteracting] = useState(false);
    const [isVerticalScrolling, setIsVerticalScrolling] = useState(false);
    const couponProgress = useSharedValue(0); // 0..1
    const rotationTimerRef = React.useRef<any>(null);
    const progressTimerRef = React.useRef<any>(null);
    const progressStartRef = React.useRef<number>(0);
    const progressElapsedRef = React.useRef<number>(0); // ms

    const couponCards = React.useMemo(() => {
        const branchCoupons = (restaurant as any)?.publicProfile?.coupons;
        if (Array.isArray(branchCoupons) && branchCoupons.length > 0) {
            return branchCoupons
                .slice()
                .sort((a: any, b: any) => (Number(a?.displayOrder) || 0) - (Number(b?.displayOrder) || 0))
                .map((c: any, idx: number) => ({
                    id: `${String(c?.couponCode || idx)}`,
                    code: String(c?.couponCode || '').toUpperCase(),
                    text: String(c?.badgeText || c?.couponCode || '').trim(),
                    backgroundColor: String(c?.backgroundColor || '#1A1A1A'),
                    textColor: String(c?.textColor || '#FFFFFF'),
                }))
                .filter((c: any) => c.code.length > 0);
        }
        // Fallback for now (keeps UI stable if branch has no configured coupons).
        return fallbackOffers.map((o) => ({
            id: o.id,
            code: o.code,
            text: o.text,
            backgroundColor: '#1A1A1A',
            textColor: '#FFFFFF',
        }));
    }, [restaurant]);

    const couponCardWidth = width - 64;
    const couponProgressBarStyle = useAnimatedStyle(() => ({
        width: couponProgress.value * couponCardWidth,
    }));

    const stopCouponRotationTimer = () => {
        if (rotationTimerRef.current) clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
    };

    const stopCouponProgressTimer = () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
    };

    const pauseCouponProgress = () => {
        if (!progressTimerRef.current) return;
        const now = Date.now();
        progressElapsedRef.current += Math.max(0, now - progressStartRef.current);
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
    };

    const startCouponProgress = (durationMs: number) => {
        // Resume from elapsed (freeze behavior)
        const elapsed = Math.min(progressElapsedRef.current, durationMs);
        couponProgress.value = durationMs > 0 ? elapsed / durationMs : 0;

        progressStartRef.current = Date.now();
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        progressTimerRef.current = setInterval(() => {
            const now = Date.now();
            const currentElapsed = elapsed + Math.max(0, now - progressStartRef.current);
            const p = durationMs > 0 ? Math.min(1, currentElapsed / durationMs) : 1;
            couponProgress.value = p;
        }, 50);
    };

    const resetCouponProgress = () => {
        progressElapsedRef.current = 0;
        couponProgress.value = 0;
    };

    const shouldAutoRotateCoupons =
        !reduceMotionEnabled &&
        couponCards.length >= 2 &&
        !isCarouselInteracting &&
        !isVerticalScrolling;

    useEffect(() => {
        // Always stop rotation timer before re-evaluating.
        stopCouponRotationTimer();

        if (!shouldAutoRotateCoupons) return;

        // Start progress from current elapsed (usually 0 after reset)
        startCouponProgress(4000);

        rotationTimerRef.current = setInterval(() => {
            setCouponIndex((prev) => {
                const next = (prev + 1) % couponCards.length;
                resetCouponProgress();
                // Scroll first, then progress restarts from 0.
                couponListRef.current?.scrollToIndex?.({ index: next, animated: true });
                startCouponProgress(4000);
                return next;
            });
        }, 4000);

        return () => {
            // Preserve progress elapsed when leaving "auto-rotate" mode.
            pauseCouponProgress();
            stopCouponRotationTimer();
            stopCouponProgressTimer();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldAutoRotateCoupons, couponCards.length]);

    // Parallax image style
    const imageAnimatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, 200],
            [0, -100],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(
            scrollY.value,
            [0, 150],
            [1, 0],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            scrollY.value,
            [0, 200],
            [1, 1.1],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ translateY }, { scale }],
            opacity,
        };
    });

    // Sticky header background opacity
    const headerAnimatedStyle = useAnimatedStyle(() => {
        const backgroundOpacity = interpolate(
            scrollY.value,
            [100, 200],
            [0, 1],
            Extrapolate.CLAMP
        );
        return {
            backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity * 0.9})`,
        };
    });

    // Search bar morphing animation: icon â†’ full bar
    const searchBarAnimatedStyle = useAnimatedStyle(() => {
        const progress = interpolate(
            scrollY.value,
            [100, 200],
            [0, 1],
            Extrapolate.CLAMP
        );

        // Width: 85px (icon + "search" text on one line) â†’ full width
        const width = interpolate(
            scrollY.value,
            [100, 200],
            [90, 280], // Start at 85px to fit icon + "search" text horizontally
            Extrapolate.CLAMP
        );

        // Background: transparent when icon, opaque when bar
        const backgroundColor = progress > 0.3
            ? '#1A1A1A'  // Opaque when scrolled
            : '#1A1A1A00'; // Transparent when on image (icon mode)

        return {
            width,
            backgroundColor,
        };
    });

    // Search input text opacity (hidden when icon, visible when bar)
    const searchInputAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [120, 180],
            [0, 1],
            Extrapolate.CLAMP
        );
        return {
            opacity,
        };
    });

    // Search icon scale animation
    const searchIconAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [100, 200],
            [1, 0.8],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }],
        };
    });

    // "search" text label opacity (visible when icon, fades out when bar expands)
    const searchLabelAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [100, 160],
            [1, 0],
            Extrapolate.CLAMP
        );
        return {
            opacity,
        };
    });

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

    // Filter items by category AND search query
    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = selectedCategory === 'Recommended' || item.category === selectedCategory;
        const foodType = (item as any)?.foodType || ((item as any)?.isVeg ? 'veg' : 'nonveg');
        const matchesFood =
            foodFilter === 'all' ||
            (foodFilter === 'veg' && foodType === 'veg') ||
            (foodFilter === 'nonveg' && foodType === 'nonveg');
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesFood && matchesSearch;
    });

    // Show loading state while fetching
    if (menuQuery.isLoading && !navRestaurant) {
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

            {/* Parallax Header Image */}
            <Animated.View style={[styles.parallaxImageContainer, imageAnimatedStyle]}>
                <Image
                    source={{ uri: restaurant.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe1xuBri4Ex6KQBM0qQWWV0dkxfv7Xwp0fwXQ4u9f9-fVnzGNVWDRZtF_Kt7jW6PxtoD7_uZ2aQLPZuVWbehy0BD6d_h5jrivCLkvBNdc2d6YPfgK7q2kaU1AZeXwROYx9E1ih55VNuVEOAVpxbP-aUkbJhZwZlb_UgyH3am3w1OWTolOEHdxkqJWslSk9IH-N0jl1QxqanUBnDH4CvCqZRFnq2w-_zWF5BbPEUM-bVHKF8CWCI_CIVm2QNrOx1nsENAxqR-jThNu6' }}
                    style={styles.coverImage}
                    resizeMode="cover"
                />
            </Animated.View>

            {/* Sticky Glassmorphism Header */}
            <Animated.View style={[styles.stickyHeader, headerAnimatedStyle]}>
                <View style={styles.headerContent}>
                    <BackButton onPress={() => navigation.goBack()} />

                    {/* Morphing Search: Icon â†’ Bar (RIGHT SIDE) */}
                    <Animated.View style={[styles.glassSearchContainer, searchBarAnimatedStyle]}>
                        <Animated.View style={searchIconAnimatedStyle}>
                            <MagnifyingGlass size={18} color="#9E9E9E" weight="bold" />
                        </Animated.View>
                        {/* "search" label - visible in icon mode, fades out */}
                        <Animated.Text style={[styles.searchLabel, searchLabelAnimatedStyle]}>
                            search
                        </Animated.Text>
                        <Animated.View style={[styles.searchInputWrapper, searchInputAnimatedStyle]}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search menu items..."
                                placeholderTextColor="#9E9E9E"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={() => setIsSearching(true)}
                                onBlur={() => !searchQuery && setIsSearching(false)}
                            />
                        </Animated.View>
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Text style={styles.clearButton}>âœ•</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </View>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        tintColor="#00E5FF"
                        refreshing={menuQuery.isRefetching}
                        onRefresh={() => {
                            // Manual refresh always available (Polling + TTL plan)
                            menuQuery.refetch();
                        }}
                    />
                }
                onScrollBeginDrag={() => {
                    setIsVerticalScrolling(true);
                    pauseCouponProgress();
                }}
                onScrollEndDrag={() => setIsVerticalScrolling(false)}
                onMomentumScrollEnd={() => setIsVerticalScrolling(false)}
            >
                {/* Restaurant Info */}
                <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantHeader}>
                        <Text style={styles.restaurantName}>{restaurant.name}</Text>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{restaurant.rating} â˜…</Text>
                        </View>
                    </View>
                    <Text style={styles.cuisineText}>
                        {restaurant.cuisines?.join(' â€¢ ')} â€¢ {restaurant.priceLevel}
                    </Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>ðŸ“ 2.5 km away</Text>
                        <Text style={styles.metaText}>ðŸ• {restaurant.deliveryTime}</Text>
                    </View>
                </View>
                {/* Coupons (Auto-rotating carousel) */}
                <View style={styles.offersContainer}>
                    <FlatList
                        ref={(r) => { couponListRef.current = r; }}
                        data={couponCards}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => String(item.id)}
                        snapToInterval={couponCardWidth + 12}
                        decelerationRate="fast"
                        contentContainerStyle={styles.offersContent}
                        onScrollBeginDrag={() => {
                            setIsCarouselInteracting(true);
                            pauseCouponProgress();
                        }}
                        onMomentumScrollEnd={(e) => {
                            const x = e.nativeEvent.contentOffset.x;
                            const idx = Math.round(x / (couponCardWidth + 12));
                            setCouponIndex(Math.max(0, Math.min(idx, couponCards.length - 1)));
                            resetCouponProgress();
                            progressElapsedRef.current = 0;
                            setIsCarouselInteracting(false);
                        }}
                        renderItem={({ item, index }) => {
                            const isSelected = (selectedCouponCode || '') === item.code;
                            const isActive = index === couponIndex;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => setCouponCode(item.code)}
                                    style={[
                                        styles.offerCard,
                                        {
                                            width: couponCardWidth,
                                            backgroundColor: item.backgroundColor,
                                            borderColor: isSelected ? '#00E5FF' : '#00E5FF33',
                                        },
                                    ]}
                                >
                                    <View style={styles.offerRow}>
                                        <Text style={styles.offerIcon}>🏷️</Text>
                                        <View style={styles.offerTextWrap}>
                                            <Text style={[styles.offerText, { color: item.textColor }]} numberOfLines={1}>
                                                {item.text}
                                            </Text>
                                            <Text style={[styles.offerCode, { color: item.textColor }]} numberOfLines={1}>
                                                Use {item.code}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.offerProgressTrack}>
                                        <Animated.View
                                            style={[
                                                styles.offerProgressFill,
                                                isActive ? couponProgressBarStyle : { width: 0 },
                                            ]}
                                        />
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                {/* Menu Categories + Veg Filter */}
                <View style={styles.categoriesBar}>
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

                    <View style={styles.foodFilter}>
                        <TouchableOpacity
                            style={[styles.foodFilterChip, foodFilter === 'all' && styles.foodFilterChipActive]}
                            onPress={() => setFoodFilter('all')}>
                            <Text style={[styles.foodFilterText, foodFilter === 'all' && styles.foodFilterTextActive]}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.foodFilterChip, foodFilter === 'veg' && styles.foodFilterChipActive]}
                            onPress={() => setFoodFilter('veg')}>
                            <Text style={[styles.foodFilterText, foodFilter === 'veg' && styles.foodFilterTextActive]}>Veg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.foodFilterChip, foodFilter === 'nonveg' && styles.foodFilterChipActive]}
                            onPress={() => setFoodFilter('nonveg')}>
                            <Text style={[styles.foodFilterText, foodFilter === 'nonveg' && styles.foodFilterTextActive]}>Non</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Loading State */}
                {menuQuery.isLoading && (
                    <View style={styles.menuLoadingContainer}>
                        <ActivityIndicator size="large" color="#00E5FF" />
                        <Text style={styles.menuLoadingText}>Loading menu...</Text>
                    </View>
                )}

                {/* Menu Empty State */}
                {!menuQuery.isLoading && menuItems.length === 0 && !apiFailed && (
                    <View style={styles.menuEmptyContainer}>
                        <Text style={styles.menuEmptyIcon}>ðŸ½ï¸</Text>
                        <Text style={styles.menuEmptyTitle}>No Menu Available</Text>
                        <Text style={styles.menuEmptyText}>
                            This restaurant hasn't added any items yet.
                        </Text>
                    </View>
                )}

                {/* Dev Mode Mock Data Notice */}
                {!menuQuery.isLoading && apiFailed && __DEV__ && (
                    <View style={styles.devNoticeContainer}>
                        <Text style={styles.devNoticeText}>
                            âš ï¸ API failed - showing mock data for development
                        </Text>
                    </View>
                )}

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {filteredItems.map((item) => (
                        <View key={getItemKey(item)} style={styles.menuItem}>
                            <View style={styles.menuItemInfo}>
                                {item.isBestseller && (
                                    <View style={styles.bestsellerBadge}>
                                        <Text style={styles.bestsellerText}>â˜… Bestseller</Text>
                                    </View>
                                )}
                                {(() => {
                                    const ft = (item as any)?.foodType || ((item as any)?.isVeg ? 'veg' : 'nonveg');
                                    const isVeg = ft === 'veg';
                                    return (
                                        <View style={styles.itemTitleRow}>
                                            <View style={[styles.foodBadge, isVeg ? styles.foodBadgeVeg : styles.foodBadgeNonVeg]}>
                                                <Text style={styles.foodBadgeText}>{isVeg ? '[V]' : '[N]'}</Text>
                                            </View>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                        </View>
                                    );
                                })()}
                                <View style={styles.priceRow}>
                                    <Text style={styles.itemPrice}>â‚¹{item.price.toFixed(2)}</Text>
                                    {item.originalPrice && (
                                        <Text style={styles.originalPrice}>
                                            â‚¹{item.originalPrice.toFixed(2)}
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
                                            <Text style={styles.quantityButtonText}>âˆ’</Text>
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
            </Animated.ScrollView>

            {/* Toast: Updated just now */}
            {toastVisible && (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>Updated just now</Text>
                </View>
            )}

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
                        <Text style={styles.cartTotal}>â‚¹{totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.cartAction}>
                        <Text style={styles.cartActionText}>View Cart</Text>
                        <Text style={styles.cartArrow}>â†’</Text>
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
    // Parallax Image Styles
    parallaxImageContainer: {
        height: 220,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    // Sticky Glassmorphism Header
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingTop: 12,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Push search to right
    },
    // Glassmorphism Search Bar
    glassSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center icon when small
        backgroundColor: '#1A1A1A00', // Start transparent
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#00E5FF20', // Subtle cyan border
        overflow: 'hidden',
    },
    searchInputWrapper: {
        flex: 1,
        marginLeft: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        padding: 0,
    },
    searchLabel: {
        fontSize: 11,
        color: '#9E9E9E',
        marginLeft: 3,
        flexShrink: 1,
    },
    clearButton: {
        fontSize: 14,
        color: '#9E9E9E',
        paddingHorizontal: 4,
    },
    restaurantInfo: {
        padding: 16,
        paddingTop: 240, // Space for parallax image (220) + overlap
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
        backgroundColor: '#000000',
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
        paddingRight: 28,
    },
    offerCard: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    offerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    offerTextWrap: {
        flex: 1,
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
    offerProgressTrack: {
        height: 3,
        backgroundColor: '#00000040',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 10,
    },
    offerProgressFill: {
        height: 3,
        backgroundColor: '#00E5FF',
        borderRadius: 3,
    },
    categoriesBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    categoriesContainer: {
        flex: 1,
    },
    categoriesContent: {
        padding: 16,
        paddingRight: 8,
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
    foodFilter: {
        flexDirection: 'row',
        marginRight: 12,
        backgroundColor: '#1A1A1A',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        overflow: 'hidden',
    },
    foodFilterChip: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    foodFilterChipActive: {
        backgroundColor: '#00E5FF',
    },
    foodFilterText: {
        fontSize: 12,
        color: '#9E9E9E',
        fontWeight: '600',
    },
    foodFilterTextActive: {
        color: '#000000',
    },
    menuContainer: {
        padding: 16,
    },
    menuItem: {
        flexDirection: 'row',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
        paddingBottom: 16,
    },
    menuItemInfo: {
        flex: 1,
        paddingRight: 16,
    },
    itemTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    foodBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        minWidth: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
    foodBadgeVeg: {
        backgroundColor: '#00C853',
    },
    foodBadgeNonVeg: {
        backgroundColor: '#FF5252',
    },
    foodBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF',
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
        flex: 1,
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
        width: 100,
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
    toast: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 96,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#00E5FF33',
        alignItems: 'center',
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
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

