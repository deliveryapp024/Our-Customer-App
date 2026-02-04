import React, { useState } from 'react';
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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';

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
    { id: '1', name: 'Bolt', icon: '⚡', color: '#00E5FF' },
    { id: '2', name: '99 Store', icon: '🏪', color: '#FFB300' },
    { id: '3', name: 'Offers', icon: '🏷️', color: '#FF5252' },
    { id: '4', name: 'Dining', icon: '🍽️', color: '#00C853' },
];

const restaurants = [
    {
        id: '1',
        name: 'The Gourmet Kitchen',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
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
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        rating: 4.5,
        cuisines: ['Fast Food', 'American'],
        deliveryTime: '15-25 mins',
        priceLevel: '$',
        hasOffer: false,
    },
    {
        id: '3',
        name: 'Spice Garden',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        rating: 4.6,
        cuisines: ['Indian', 'North Indian'],
        deliveryTime: '25-35 mins',
        priceLevel: '$$',
        hasOffer: true,
        offerText: '20% OFF',
    },
    {
        id: '4',
        name: 'Sushi Master',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
        rating: 4.9,
        cuisines: ['Japanese', 'Sushi'],
        deliveryTime: '30-40 mins',
        priceLevel: '$$$',
        hasOffer: false,
    },
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [location] = useState('Camp, Belagavi');

    const renderRestaurantCard = ({ item }: { item: typeof restaurants[0] }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => navigation.navigate(SCREENS.RESTAURANT_DETAIL, { restaurant: item })}
            activeOpacity={0.9}>
            <View style={styles.restaurantImageContainer}>
                <Image
                    source={{ uri: item.image }}
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
                        <Text style={styles.ratingText}>{item.rating} ★</Text>
                    </View>
                </View>
                <Text style={styles.cuisineText} numberOfLines={1}>
                    {item.cuisines.join(' • ')} • {item.priceLevel}
                </Text>
                <Text style={styles.deliveryText}>🕐 {item.deliveryTime}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <View>
                        <Text style={styles.locationLabel}>{location}</Text>
                        <Text style={styles.locationAddress}>Home • 45-2/A Main Street</Text>
                    </View>
                    <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
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
                            ]}>
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
                    data={restaurants}
                    renderItem={renderRestaurantCard}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.restaurantList}
                />

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Explore by Category</Text>
                </View>

                <View style={styles.categoriesContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity key={category.id} style={styles.categoryItem}>
                            <View style={styles.categoryIcon}>
                                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                            </View>
                            <Text style={styles.categoryName}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

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
});

export default HomeScreen;
