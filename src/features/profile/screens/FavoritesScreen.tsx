import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

const favoriteRestaurants = [
    {
        id: '1',
        name: 'The Artisan Bistro',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiBrDIIvz5ukilkUr5abN7At_p0rUjDVV183nWpqbqNNP46vzRhxiebZMMVsTqdNlKVCEdoBBKeLOZ7mIUfTWoZ6NLE3AI979k4XvYVP7qvucUF0VwqJ8oCpaBNgvgRKIB8qI0z7SSNK0KGKF4pTffD9ty0A5TjWctmrHYCs61IkMYrMk6vCYzP-tIKXuwwHJJPvGxkKyIV1KRSb7DfITJrfo5YsXcTh_OI_byM62ofozugLIR1WfF-xS1hKLUdskYIy2X8mDrp-Cs',
        rating: 4.8,
        cuisines: ['French', 'Continental'],
        deliveryTime: '25-30 mins',
    },
    {
        id: '2',
        name: 'Sushiya Premium',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy2JWhew5CgfpodCa4i-xgNuXo7DZyYuviP2RP8r0pc69KM6516e0cFiu5e6ICOOIj6AYDgxAy1qTTlQ1yB0ncaA5gqYSNXA2Y2HjoHlbE6fm5tLpmgc-TRsTTRxtzZjbHFBK4i4Mgrye8nzY7cCMm-6eCDI3XC6iBEcOpVlj8IRRsQJWPhLvQSgNxy--uCuI0F8LWjQUr_HcXRhLh0UIqmPnTczAbvl_jCO3W5rbUqFoVdHsQeSgIptmCRbTTKixzyDCC6zfs1unm',
        rating: 4.9,
        cuisines: ['Japanese', 'Sushi'],
        deliveryTime: '35-40 mins',
    },
    {
        id: '3',
        name: 'Azure Grill',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9gtaQytElKxzVh7BbTGuisdJzaPSDOx8HVKmVvZR85XXHzq5bv5Ymb9MQklBM1IGurrrtpCKJFE2RNwASfvKJMPomFDDWAKUZoZhkdybnnnSRF_iRkWPWYyJeBT22ajXcTV2J_N86tm2lsNCEJHZDL2U3oCwWAVRT2WdpeouIiE-uGOLdZ0E52VFxEvVpBr6Ae3GjsQXoV5KcAMbb1sN8uqCYkYgmPopCQ1vsYIrAfpGkoSssYyGLNBM1IC8U1_d7tZzmeIdBXxpi',
        rating: 4.7,
        cuisines: ['Mediterranean', 'Seafood'],
        deliveryTime: '20-25 mins',
    },
];

export const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
    const handleRestaurantPress = (restaurant: typeof favoriteRestaurants[0]) => {
        navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurant });
    };

    const handleRemoveFavorite = (id: string) => {
        // Remove from favorites
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favorites</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{favoriteRestaurants.length}</Text>
                        <Text style={styles.statLabel}>Favorites</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Dishes</Text>
                    </View>
                </View>

                {/* Favorite Restaurants */}
                <Text style={styles.sectionTitle}>Restaurants</Text>
                {favoriteRestaurants.map((restaurant) => (
                    <TouchableOpacity
                        key={restaurant.id}
                        style={styles.restaurantCard}
                        onPress={() => handleRestaurantPress(restaurant)}
                        activeOpacity={0.9}>
                        <Image
                            source={{ uri: restaurant.image }}
                            style={styles.restaurantImage}
                            resizeMode="cover"
                        />
                        <View style={styles.restaurantInfo}>
                            <View style={styles.restaurantHeader}>
                                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                                <TouchableOpacity
                                    style={styles.heartButton}
                                    onPress={() => handleRemoveFavorite(restaurant.id)}>
                                    <Text style={styles.heartIcon}>❤️</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ratingRow}>
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingText}>{restaurant.rating} ★</Text>
                                </View>
                                <Text style={styles.cuisineText}>
                                    {restaurant.cuisines.join(' • ')}
                                </Text>
                            </View>
                            <Text style={styles.deliveryText}>🕐 {restaurant.deliveryTime}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Empty State */}
                {favoriteRestaurants.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>❤️</Text>
                        <Text style={styles.emptyTitle}>No favorites yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Start adding restaurants and dishes to your favorites
                        </Text>
                        <TouchableOpacity style={styles.exploreButton}>
                            <Text style={styles.exploreText}>Explore Restaurants</Text>
                        </TouchableOpacity>
                    </View>
                )}

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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5252',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#2A2A2A',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    restaurantImage: {
        width: 100,
        height: 100,
    },
    restaurantInfo: {
        flex: 1,
        padding: 12,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },
    heartButton: {
        padding: 4,
    },
    heartIcon: {
        fontSize: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingBadge: {
        backgroundColor: '#00C853',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    cuisineText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    deliveryText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    exploreText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default FavoritesScreen;
