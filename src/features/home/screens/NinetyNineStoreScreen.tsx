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

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

const categories = [
    { id: '1', name: 'All', isActive: true },
    { id: '2', name: 'Snacks', isActive: false },
    { id: '3', name: 'Drinks', isActive: false },
    { id: '4', name: 'Daily Essentials', isActive: false },
];

const products = [
    { id: '1', name: 'Lay\'s Classic Chips', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200', price: 0.99, quantity: '50g' },
    { id: '2', name: 'Coca Cola', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200', price: 0.99, quantity: '330ml' },
    { id: '3', name: 'Oreo Cookies', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200', price: 0.99, quantity: '120g' },
    { id: '4', name: 'Maggi Noodles', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200', price: 0.99, quantity: '70g' },
    { id: '5', name: 'Parle-G Biscuits', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200', price: 0.99, quantity: '100g' },
    { id: '6', name: 'Pepsi', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200', price: 0.99, quantity: '330ml' },
];

export const NinetyNineStoreScreen: React.FC<Props> = ({ navigation }) => {
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
                <View style={styles.headerCenter}>
                    <View style={styles.storeBadge}>
                        <Text style={styles.storeText}>99</Text>
                    </View>
                    <Text style={styles.headerTitle}>99 Store</Text>
                </View>
                <TouchableOpacity style={styles.cartButton}>
                    <Text style={styles.cartIcon}>🛒</Text>
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Value Banner */}
            <View style={styles.valueBanner}>
                <Text style={styles.bannerEmoji}>💰</Text>
                <Text style={styles.bannerText}>
                    Everything at just <Text style={styles.bannerPrice}>$0.99</Text> or less!
                </Text>
            </View>

            {/* Categories */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryTab, cat.isActive && styles.categoryTabActive]}>
                        <Text
                            style={[
                                styles.categoryText,
                                cat.isActive && styles.categoryTextActive,
                            ]}>
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Products Grid */}
                <View style={styles.productsGrid}>
                    {products.map((product) => (
                        <View key={product.id} style={styles.productCard}>
                            <View style={styles.priceBadge}>
                                <Text style={styles.priceBadgeText}>$0.99</Text>
                            </View>
                            <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.productName} numberOfLines={2}>
                                {product.name}
                            </Text>
                            <Text style={styles.productQuantity}>{product.quantity}</Text>
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.addButtonText}>ADD</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Savings Banner */}
                <View style={styles.savingsBanner}>
                    <Text style={styles.savingsIcon}>🎉</Text>
                    <View style={styles.savingsContent}>
                        <Text style={styles.savingsTitle}>You're saving big!</Text>
                        <Text style={styles.savingsText}>
                            Average savings of 40% compared to regular prices
                        </Text>
                    </View>
                </View>

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
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
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
    cartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cartIcon: {
        fontSize: 18,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#FF5252',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    valueBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFB300',
        paddingVertical: 10,
        marginBottom: 16,
    },
    bannerEmoji: {
        fontSize: 18,
        marginRight: 8,
    },
    bannerText: {
        fontSize: 14,
        color: '#000000',
    },
    bannerPrice: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    categoriesContainer: {
        marginBottom: 16,
    },
    categoriesContent: {
        paddingHorizontal: 16,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        marginRight: 8,
    },
    categoryTabActive: {
        backgroundColor: '#FFB300',
    },
    categoryText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    categoryTextActive: {
        color: '#000000',
        fontWeight: '600',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 8,
    },
    productCard: {
        width: (width - 40) / 2,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 12,
        position: 'relative',
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
        marginBottom: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
        height: 36,
    },
    productQuantity: {
        fontSize: 12,
        color: '#6B6B6B',
        marginBottom: 12,
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
    savingsBanner: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        backgroundColor: '#2A1A0A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFB30033',
    },
    savingsIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    savingsContent: {
        flex: 1,
    },
    savingsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    savingsText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default NinetyNineStoreScreen;
