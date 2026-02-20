import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { BackButton } from '../../../components/ui/BackButton';
import { CartSwitchModal } from '../../../components/ui/CartSwitchModal';
import { ninetyNineStoreApi, NinetyNineStoreItem, NinetyNineCategory } from '../../../api';
import { useCartStore } from '../../../store/cartStore';
import { SCREENS } from '../../../constants';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 40) / 2;

export const NinetyNineStoreScreen: React.FC<Props> = ({ navigation }) => {
    const {
        restaurantId: cartRestaurantId,
        restaurantName: cartRestaurantName,
        items: cartItems,
        addItem,
        clearCart,
    } = useCartStore();

    const [activeCategoryId, setActiveCategoryId] = useState('all');
    const [switchModalVisible, setSwitchModalVisible] = useState(false);
    const [pendingItem, setPendingItem] = useState<NinetyNineStoreItem | null>(null);

    const campaignQuery = useQuery({
        queryKey: ['ninetyNineStoreCampaign'],
        queryFn: async () => {
            const response = await ninetyNineStoreApi.getActiveNinetyNineStore();
            if (!response.success) {
                throw new Error(response.error || 'Failed to load 99 Store');
            }
            return response.data;
        },
        staleTime: 60 * 1000,
    });

    const campaign = campaignQuery.data?.campaign || null;
    const categories: NinetyNineCategory[] = campaignQuery.data?.categories || [];
    const allItems: NinetyNineStoreItem[] = useMemo(
        () => campaignQuery.data?.items || [],
        [campaignQuery.data?.items],
    );

    const visibleItems = useMemo(() => {
        if (activeCategoryId === 'all') return allItems;
        return allItems.filter((item) => item.categoryId === activeCategoryId);
    }, [allItems, activeCategoryId]);

    const getCartQuantity = (item: NinetyNineStoreItem) => {
        const existing = cartItems.find((cartItem) => cartItem.menuItem.id === item.productId);
        return existing?.quantity || 0;
    };

    const addItemToCart = (item: NinetyNineStoreItem) => {
        addItem(
            item.branch.branchId,
            item.branch.name,
            {
                id: item.productId,
                name: item.name,
                description: '',
                price: item.effectivePrice,
                originalPrice: item.originalPrice > item.effectivePrice ? item.originalPrice : undefined,
                image: item.image,
                category: item.categoryId || 'all',
                isVeg: true,
                isAvailable: true,
            }
        );
    };

    const onPressAdd = (item: NinetyNineStoreItem) => {
        if (cartRestaurantId && cartRestaurantId !== item.branch.branchId) {
            setPendingItem(item);
            setSwitchModalVisible(true);
            return;
        }

        addItemToCart(item);
    };

    const onConfirmSwitchAndAdd = () => {
        if (!pendingItem) {
            setSwitchModalVisible(false);
            return;
        }

        clearCart();
        addItemToCart(pendingItem);
        setPendingItem(null);
        setSwitchModalVisible(false);
    };

    const onCancelSwitch = () => {
        setPendingItem(null);
        setSwitchModalVisible(false);
    };

    const renderCategory = ({ item }: { item: NinetyNineCategory }) => {
        const isActive = activeCategoryId === item.id;
        return (
            <TouchableOpacity
                style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                onPress={() => setActiveCategoryId(item.id)}
                activeOpacity={0.8}>
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                    {item.name} ({item.count})
                </Text>
            </TouchableOpacity>
        );
    };

    const renderProductCard = (item: NinetyNineStoreItem) => {
        const qty = getCartQuantity(item);
        const showOriginal = item.originalPrice > item.effectivePrice;

        return (
            <View key={`${item.productId}_${item.branch.branchId}`} style={styles.productCard}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurantId: item.branch.branchId })}>
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceBadgeText}>Rs.{item.effectivePrice.toFixed(0)}</Text>
                    </View>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                    </Text>
                    {item.quantity ? (
                        <Text style={styles.productQuantity}>{item.quantity}</Text>
                    ) : null}
                    <Text style={styles.branchName} numberOfLines={1}>
                        {item.branch.name}
                    </Text>
                    {showOriginal ? (
                        <Text style={styles.originalPrice}>Rs.{item.originalPrice.toFixed(0)}</Text>
                    ) : (
                        <View style={styles.originalPricePlaceholder} />
                    )}
                </TouchableOpacity>

                {qty > 0 ? (
                    <View style={styles.quantityControls}>
                        <Text style={styles.quantityText}>{qty} in cart</Text>
                        <TouchableOpacity
                            style={styles.addMoreButton}
                            onPress={() => onPressAdd(item)}
                            activeOpacity={0.8}>
                            <Text style={styles.addMoreButtonText}>ADD +</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => onPressAdd(item)}
                        activeOpacity={0.8}>
                        <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderContent = () => {
        if (campaignQuery.isLoading) {
            return (
                <View style={styles.centerState}>
                    <ActivityIndicator size="large" color="#00E5FF" />
                    <Text style={styles.stateText}>Loading 99 Store...</Text>
                </View>
            );
        }

        if (campaignQuery.isError) {
            return (
                <View style={styles.centerState}>
                    <Text style={styles.stateTitle}>Unable to load 99 Store</Text>
                    <Text style={styles.stateText}>Please try again.</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => campaignQuery.refetch()}
                        activeOpacity={0.8}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!campaign || allItems.length === 0) {
            return (
                <View style={styles.centerState}>
                    <Text style={styles.stateTitle}>99 Store is coming soon</Text>
                    <Text style={styles.stateText}>Deals will appear here after campaign setup.</Text>
                </View>
            );
        }

        return (
            <>
                <View style={[styles.valueBanner, { backgroundColor: campaign.displayConfig.bannerColor || '#FFB300' }]}>
                    <Text style={[styles.bannerText, { color: campaign.displayConfig.bannerTextColor || '#000000' }]}>
                        {campaign.priceFilterType === 'below'
                            ? `Everything under Rs.${campaign.maxPrice}`
                            : `Everything at Rs.${campaign.maxPrice} or less`}
                    </Text>
                </View>

                <FlatList
                    horizontal
                    data={categories.length > 0 ? categories : [{ id: 'all', name: 'All', count: allItems.length }]}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCategory}
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.productsGrid}>
                        {visibleItems.map(renderProductCard)}
                    </View>
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <View style={styles.headerCenter}>
                    <View style={styles.storeBadge}>
                        <Text style={styles.storeText}>99</Text>
                    </View>
                    <Text style={styles.headerTitle}>{campaign?.displayConfig?.headerTitle || '99 Store'}</Text>
                </View>
                <View style={styles.headerRightSpacer} />
            </View>

            {renderContent()}

            <CartSwitchModal
                visible={switchModalVisible}
                oldBranchName={cartRestaurantName}
                newBranchName={pendingItem?.branch?.name}
                onCancel={onCancelSwitch}
                onConfirm={onConfirmSwitchAndAdd}
            />
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
        paddingTop: 12,
        paddingBottom: 12,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    storeBadge: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#FFB300',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    storeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerRightSpacer: {
        width: 40,
    },
    valueBanner: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginBottom: 12,
    },
    bannerText: {
        fontSize: 14,
        fontWeight: '700',
    },
    categoriesContainer: {
        marginBottom: 12,
    },
    categoriesContent: {
        paddingHorizontal: 16,
    },
    categoryTab: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        marginRight: 8,
    },
    categoryTabActive: {
        backgroundColor: '#FFB300',
    },
    categoryText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#000000',
        fontWeight: '700',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 8,
    },
    productCard: {
        width: PRODUCT_CARD_WIDTH,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 12,
        position: 'relative',
        marginBottom: 8,
    },
    priceBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFB300',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 1,
    },
    priceBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000000',
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: '#2A2A2A',
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
        minHeight: 34,
    },
    productQuantity: {
        fontSize: 12,
        color: '#9E9E9E',
        marginBottom: 4,
    },
    branchName: {
        fontSize: 12,
        color: '#00E5FF',
        marginBottom: 4,
    },
    originalPrice: {
        fontSize: 12,
        color: '#6B6B6B',
        textDecorationLine: 'line-through',
        marginBottom: 8,
    },
    originalPricePlaceholder: {
        height: 20,
    },
    addButton: {
        backgroundColor: '#FFB300',
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    quantityText: {
        fontSize: 12,
        color: '#9E9E9E',
        flex: 1,
    },
    addMoreButton: {
        backgroundColor: '#FFB300',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 16,
    },
    addMoreButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000000',
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    stateTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    stateText: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
        marginTop: 10,
    },
    retryButton: {
        marginTop: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#00E5FF',
        borderRadius: 14,
    },
    retryButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default NinetyNineStoreScreen;
