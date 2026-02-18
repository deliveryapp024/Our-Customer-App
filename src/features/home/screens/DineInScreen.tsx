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
import { BackButton } from '../../../components/ui/BackButton';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface Restaurant {
    id: string;
    name: string;
    image: string;
    rating: number;
    cuisine: string;
    location: string;
    distance: string;
    discount: string;
    tableFor: string;
    priceRange: string;
}

// Images from dining_out_discovery_feed design
const dineInRestaurants: Restaurant[] = [
    {
        id: '1',
        name: 'The Gourmet Kitchen',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqqTiN1dhT5dCugD0v8WlEZudmhA5xvvOtYa59g9enwAuEf2eQKnRCOgW6Xyf9I6-6gc1dHznfkxFZwytC1UGr4jSHDnViZtE0LrKj2J5clBc3shkWWQ3bKsdsEcDg8tyEetrFsieLE-54XqK8pDaL32E_ng2akbVhbD9YqyvK8WdlAITRIHO_vUOF3rf12p6PR02DnbDaJrUU-qO9Bvc77ciDadzrkQF_D8u38hFJ0pgMCdRlG2k5o-r6UqUVIKwm7FYLuraUJ59U',
        rating: 4.8,
        cuisine: 'Continental, Italian',
        location: 'Camp Area',
        distance: '1.2 km',
        discount: '20% OFF',
        tableFor: '2-6',
        priceRange: '',
    },
    {
        id: '2',
        name: 'Spice Garden',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwU7Aw-djD82T_HiBcJeZQYYwhSob1ftFoy_-LoDZ4KQVzY_DrbPt8-F-JaM-LIJkbcHB0PipVezmL9DKqa8OW0kepAbDZxitF7uZJn2Ybhi5uLhFRDes5HB27AI-RJtlr7nPm6xa7GmHB45HLGQT1ABRO9nGatNkGbzqIV1FWartun9zjSH3wmEIqInU2lnBvLJha5zm95MCyBdj-IGKQJjr1vaJN_7Acitb1Huf-zplyDVuNDMmzcgzVc8QjGbnNHwxyP-NPhuIp',
        rating: 4.6,
        cuisine: 'North Indian, Mughlai',
        location: 'MG Road',
        distance: '2.5 km',
        discount: '15% OFF',
        tableFor: '2-8',
        priceRange: '',
    },
    {
        id: '3',
        name: 'Sushi Master',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpVdOCfYUXsUTWXNOmhRKv9is_U4CtlHqbFv8HXP8oGmsg83MUaxWSUg2_VLnUUxpCVwnn-d5kHlg7Ju_fLL69bNHtv7XKUQexirABgfUsqQJhYa0VnQo4rsywD-asRuofyX7gdvhT2UfJX47JNxOGKtb9E1M88Iyl9lFQZlJxdnp4C309T4q2xjTiVVyHBUDnUXBataLN4akLxeVaq1zUMmU4aMyxrTdmy5DEzLI_vWYBvGUx-ctKrTSoTmmTiZrX8FaRhoIsKmO_',
        rating: 4.9,
        cuisine: 'Japanese, Sushi',
        location: 'Downtown',
        distance: '3.0 km',
        discount: '10% OFF',
        tableFor: '2-4',
        priceRange: '',
    },
];

export const DineInScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Dine-Out</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterIcon}></Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TouchableOpacity style={styles.searchBar}>
                <Text style={styles.searchIcon}>Search</Text>
                <Text style={styles.searchPlaceholder}>Search restaurants for dining</Text>
            </TouchableOpacity>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}>
                {['All', 'Fine Dining', 'Casual', 'Rooftop', 'Family', 'Romantic'].map(
                    (filter, index) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterTab, index === 0 && styles.filterTabActive]}>
                            <Text
                                style={[
                                    styles.filterText,
                                    index === 0 && styles.filterTextActive,
                                ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ),
                )}
            </ScrollView>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Featured Banner */}
                <View style={styles.featuredBanner}>
                    <Text style={styles.featuredEmoji}></Text>
                    <View style={styles.featuredContent}>
                        <Text style={styles.featuredTitle}>Reserve & Save</Text>
                        <Text style={styles.featuredSubtitle}>
                            Book a table and get up to 30% off on your bill
                        </Text>
                    </View>
                </View>

                {/* Restaurants List */}
                <Text style={styles.sectionTitle}>Popular Near You</Text>

                {dineInRestaurants.map((restaurant) => (
                    <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
                        <Image
                            source={{ uri: restaurant.image }}
                            style={styles.restaurantImage}
                            resizeMode="cover"
                        />
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{restaurant.discount}</Text>
                        </View>
                        <View style={styles.restaurantInfo}>
                            <View style={styles.restaurantHeader}>
                                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingText}>{restaurant.rating} </Text>
                                </View>
                            </View>
                            <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaText}> {restaurant.location}</Text>
                                <Text style={styles.metaText}> {restaurant.distance}</Text>
                                <Text style={styles.metaText}> {restaurant.priceRange}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableIcon}></Text>
                                <Text style={styles.tableText}>
                                    Tables for {restaurant.tableFor} available
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.bookButton}>
                                <Text style={styles.bookButtonText}>BOOK TABLE</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterIcon: {
        fontSize: 18,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    searchPlaceholder: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    filtersContainer: {
        marginBottom: 16,
    },
    filtersContent: {
        paddingHorizontal: 16,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        marginRight: 8,
    },
    filterTabActive: {
        backgroundColor: '#00C853',
    },
    filterText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    filterTextActive: {
        fontWeight: '600',
    },
    featuredBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: 20,
        backgroundColor: '#0A2A1A',
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#00C85333',
    },
    featuredEmoji: {
        fontSize: 40,
        marginRight: 16,
    },
    featuredContent: {
        flex: 1,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    featuredSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    restaurantCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        overflow: 'hidden',
    },
    restaurantImage: {
        width: '100%',
        height: 180,
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#00C853',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    discountText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    restaurantInfo: {
        padding: 16,
    },
    restaurantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    restaurantName: {
        fontSize: 18,
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
        fontSize: 12,
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
        marginBottom: 12,
    },
    metaText: {
        fontSize: 12,
        color: '#6B6B6B',
        marginRight: 4,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    tableIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    tableText: {
        fontSize: 13,
        color: '#00C853',
    },
    bookButton: {
        backgroundColor: '#00C853',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    bookButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default DineInScreen;
