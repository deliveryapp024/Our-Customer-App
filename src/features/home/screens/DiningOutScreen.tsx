import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ComingSoonScreen from '../../../components/ComingSoonScreen';
import { FEATURE_FLAGS } from '../../../constants';
import { BackButton } from '../../../components/ui/BackButton';

const { width } = Dimensions.get('window');

interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    distance: string;
    priceForTwo: string;
    image: string;
    offers: string[];
    hasTableBooking: boolean;
    waitTime?: string;
}

const DINING_CATEGORIES = [
    { id: '1', name: 'Trending', icon: '🔥' },
    { id: '2', name: 'Romantic', icon: '💕' },
    { id: '3', name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: '4', name: 'Rooftop', icon: '🌆' },
    { id: '5', name: 'Buffet', icon: '🍽️' },
    { id: '6', name: 'Cafe', icon: '☕' },
];

// Images from dining_out_discovery_feed design
const MOCK_RESTAURANTS: Restaurant[] = [
    {
        id: '1',
        name: 'The Grand Pavilion',
        cuisine: 'Multi-Cuisine • Fine Dining',
        rating: 4.5,
        distance: '2.3 km',
        priceForTwo: '₹1,500',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqqTiN1dhT5dCugD0v8WlEZudmhA5xvvOtYa59g9enwAuEf2eQKnRCOgW6Xyf9I6-6gc1dHznfkxFZwytC1UGr4jSHDnViZtE0LrKj2J5clBc3shkWWQ3bKsdsEcDg8tyEetrFsieLE-54XqK8pDaL32E_ng2akbVhbD9YqyvK8WdlAITRIHO_vUOF3rf12p6PR02DnbDaJrUU-qO9Bvc77ciDadzrkQF_D8u38hFJ0pgMCdRlG2k5o-r6UqUVIKwm7FYLuraUJ59U',
        offers: ['20% OFF', 'Free Dessert'],
        hasTableBooking: true,
        waitTime: '15 min',
    },
    {
        id: '2',
        name: 'Sky Lounge & Bar',
        cuisine: 'Continental • Rooftop',
        rating: 4.3,
        distance: '3.1 km',
        priceForTwo: '₹2,000',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4dEvPWoHC0f2U1T8KMeirU5V1DHMw3nIgxZ4H2lxpjwxJrSg9A3qDE8mz8toFq7MPoeh5yyxcFlRVtd3swIjs3QzLtj1znkjbSo6f42Fypb0k7658C9L4Va30rO2r5ckQ_Ma1dqYKhtmEiJUCybe_1CS4z6ZpJ0oytN6EfpMp9r2BQWON20ZW2PldsJiDSkSeKtBqobyGkpHbEt1zgAqX03k93Ee2kn6MSy8t5XpzmH6yj7CrY1OsQmRObWwZT7E6JunV6-oXkjRO',
        offers: ['1+1 on Drinks'],
        hasTableBooking: true,
    },
    {
        id: '3',
        name: 'Spice Garden',
        cuisine: 'North Indian • Mughlai',
        rating: 4.2,
        distance: '1.8 km',
        priceForTwo: '₹800',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwU7Aw-djD82T_HiBcJeZQYYwhSob1ftFoy_-LoDZ4KQVzY_DrbPt8-F-JaM-LIJkbcHB0PipVezmL9DKqa8OW0kepAbDZxitF7uZJn2Ybhi5uLhFRDes5HB27AI-RJtlr7nPm6xa7GmHB45HLGQT1ABRO9nGatNkGbzqIV1FWartun9zjSH3wmEIqInU2lnBvLJha5zm95MCyBdj-IGKQJjr1vaJN_7Acitb1Huf-zplyDVuNDMmzcgzVc8QjGbnNHwxyP-NPhuIp',
        offers: ['Flat 30% OFF'],
        hasTableBooking: true,
        waitTime: '5 min',
    },
    {
        id: '4',
        name: 'Cafe Latte',
        cuisine: 'Cafe • Italian',
        rating: 4.4,
        distance: '0.9 km',
        priceForTwo: '₹600',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpVdOCfYUXsUTWXNOmhRKv9is_U4CtlHqbFv8HXP8oGmsg83MUaxWSUg2_VLnUUxpCVwnn-d5kHlg7Ju_fLL69bNHtv7XKUQexirABgfUsqQJhYa0VnQo4rsywD-asRuofyX7gdvhT2UfJX47JNxOGKtb9E1M88Iyl9lFQZlJxdnp4C309T4q2xjTiVVyHBUDnUXBataLN4akLxeVaq1zUMmU4aMyxrTdmy5DEzLI_vWYBvGUx-ctKrTSoTmmTiZrX8FaRhoIsKmO_',
        offers: ['Buy 1 Get 1 Coffee'],
        hasTableBooking: false,
    },
];

const CUISINES = ['All', 'North Indian', 'Chinese', 'Italian', 'Continental', 'Japanese', 'Mexican'];

export const DiningOutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    if (!FEATURE_FLAGS.ENABLE_DINING_OUT) {
        return (
            <ComingSoonScreen
                title="Dining Out is disabled for the pilot"
                subtitle="This screen currently uses mock data. Enable FEATURE_FLAGS.ENABLE_DINING_OUT only after wiring real APIs."
            />
        );
    }

    const [selectedCategory, setSelectedCategory] = useState('1');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const renderCategoryItem = ({ item }: { item: typeof DINING_CATEGORIES[0] }) => (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.categoryItemActive,
            ]}
            onPress={() => setSelectedCategory(item.id)}
        >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text
                style={[
                    styles.categoryText,
                    selectedCategory === item.id && styles.categoryTextActive,
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
        >
            <Image source={{ uri: item.image }} style={styles.restaurantImage} />

            {/* Offers Badge */}
            {item.offers.length > 0 && (
                <View style={styles.offerBadge}>
                    <Text style={styles.offerBadgeText}>{item.offers[0]}</Text>
                </View>
            )}

            <View style={styles.restaurantInfo}>
                <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>★ {item.rating}</Text>
                    </View>
                </View>

                <Text style={styles.cuisineText}>{item.cuisine}</Text>

                <View style={styles.restaurantMeta}>
                    <Text style={styles.metaText}>📍 {item.distance}</Text>
                    <Text style={styles.metaText}>💰 {item.priceForTwo} for two</Text>
                </View>

                {/* Table Booking Section */}
                <View style={styles.bookingSection}>
                    {item.hasTableBooking ? (
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() => navigation.navigate('TableReservation', { restaurant: item })}
                        >
                            <Text style={styles.bookButtonText}>🪑 Book Table</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.noBookingText}>Walk-in only</Text>
                    )}

                    {item.waitTime && (
                        <View style={styles.waitTimeBadge}>
                            <Text style={styles.waitTimeText}>⏱️ {item.waitTime} wait</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Dine-Out</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search restaurants, cuisines..."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Categories */}
                <FlatList
                    data={DINING_CATEGORIES}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                />

                {/* Cuisine Filter */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.cuisineFilter}
                    contentContainerStyle={styles.cuisineFilterContent}
                >
                    {CUISINES.map((cuisine) => (
                        <TouchableOpacity
                            key={cuisine}
                            style={[
                                styles.cuisineChip,
                                selectedCuisine === cuisine && styles.cuisineChipActive,
                            ]}
                            onPress={() => setSelectedCuisine(cuisine)}
                        >
                            <Text
                                style={[
                                    styles.cuisineChipText,
                                    selectedCuisine === cuisine && styles.cuisineChipTextActive,
                                ]}
                            >
                                {cuisine}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Near You</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All →</Text>
                    </TouchableOpacity>
                </View>

                {/* Restaurant List */}
                {MOCK_RESTAURANTS.map((restaurant) => (
                    <View key={restaurant.id}>
                        {renderRestaurantCard({ item: restaurant })}
                    </View>
                ))}

                {/* Promotional Banner */}
                <View style={styles.promoBanner}>
                    <Text style={styles.promoTitle}>🎉 First Dine-Out?</Text>
                    <Text style={styles.promoText}>
                        Get FLAT 50% OFF on your first table booking!
                    </Text>
                    <TouchableOpacity style={styles.promoButton}>
                        <Text style={styles.promoButtonText}>Explore Offers</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    filterButton: {
        padding: 8,
    },
    filterIcon: {
        fontSize: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 48,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
    },
    categoriesList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 12,
        minWidth: 80,
    },
    categoryItemActive: {
        backgroundColor: '#00E5FF',
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    categoryText: {
        color: '#9E9E9E',
        fontSize: 12,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: '#000',
    },
    cuisineFilter: {
        marginBottom: 16,
    },
    cuisineFilterContent: {
        paddingHorizontal: 16,
    },
    cuisineChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    cuisineChipActive: {
        backgroundColor: '#00E5FF',
        borderColor: '#00E5FF',
    },
    cuisineChipText: {
        color: '#9E9E9E',
        fontSize: 14,
        fontWeight: '500',
    },
    cuisineChipTextActive: {
        color: '#000',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    seeAllText: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: '600',
    },
    restaurantCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    restaurantImage: {
        width: '100%',
        height: 160,
        backgroundColor: '#333',
    },
    offerBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FF5252',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    offerBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    restaurantInfo: {
        padding: 16,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    restaurantName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        backgroundColor: '#00C853',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    ratingText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    cuisineText: {
        color: '#9E9E9E',
        fontSize: 14,
        marginBottom: 8,
    },
    restaurantMeta: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    metaText: {
        color: '#9E9E9E',
        fontSize: 13,
        marginRight: 16,
    },
    bookingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bookButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    bookButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
    },
    noBookingText: {
        color: '#666',
        fontSize: 13,
    },
    waitTimeBadge: {
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    waitTimeText: {
        color: '#FFA500',
        fontSize: 12,
        fontWeight: '600',
    },
    promoBanner: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        marginHorizontal: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    promoTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    promoText: {
        color: '#9E9E9E',
        fontSize: 14,
        marginBottom: 16,
    },
    promoButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    promoButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default DiningOutScreen;
