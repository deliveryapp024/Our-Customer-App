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

const categories = [
    { id: '1', name: 'All', isActive: true },
    { id: '2', name: 'Snacks', isActive: false },
    { id: '3', name: 'Drinks', isActive: false },
    { id: '4', name: 'Daily Essentials', isActive: false },
];

// Images from 99_store_budget_value design
const products = [
    { id: '1', name: 'Lay\'s Classic Chips', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDxqWBY532UcDPMiDsMEeglf0j4HNGooEZK180SYU1ZNFHiGkfHAHmRNJL5Ekg4tIxmHeq_mNo10rl3F_Zx7ZKMsEc931QZXJ2M4uJ7D7CFnq_CaFD3j6Me9ViRaV1HYqyGcX0dXNVjX6OkwLp-4EhnES3_4E6vJOVz5oAjrOPzgejl2YW0R8FNx9jqbw9VpmhSkgBihX0beVSz2Xs63SkOumXSQDQasD5OD4hWc7bxH4380Y6jSAyEuw3e2oHO_b2O1NLPZhEpj8', price: 0.99, quantity: '50g' },
    { id: '2', name: 'Coca Cola', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVmqF-tem-WMGhgUi36RSOCDRYKaKqBBIGYSnMLNAdyLefcDYBFrUkFmGxLqsdELCXIaoTz2BdAQ0gJOTGMObWUuzCYCE4wSiPjqm-egrZe6wsxh4CZ372_flxlgu2loPXPeSCptnjFfLqOfmWhIKFrUU3PYBnIzDTBJrHWaK3CAucT4MU8_W08L1JUVEhcY1xRln-fL8TqbGt6g5cL7a-nFTIGMcLcwDupWE1XlENaz5CSCnymQzpqhqDx1v1Wqu7R5C1654utIWt', price: 0.99, quantity: '330ml' },
    { id: '3', name: 'Oreo Cookies', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAftZzhEfn20YbCFJsvwkAdP1o_WaErMtpVvRqqaFYVWmTuvzVd5EvsfRlAOfmbLrgejB-IUwQPq0rV800ICniUZQC8PWiiBZVcm8Sp69Th5Wsi22O826aUrWaNbytaSI62bMn04hjCgCuxjX9M3mqYJUCnWo2H12FXZpqrnv6Vntu8xso3FOBmhSNQMfRBOQwIqOYrfzrJGOUBv-_7EI940OAoLOpyvJKvI5NhYS9NA9sr7YNqNffbBlniGJM4PRvRi2FCyCCIOok8', price: 0.99, quantity: '120g' },
    { id: '4', name: 'Maggi Noodles', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvKr3W-rGYrsgB2kxKygnZwnIWBDiSmpeUXhEAkJO4yDexBjTPsVN8sZSveSFNopyChaOAGeqUhWZ2kVmbAp6bGBulUPS9Jt5VsG3wOrH3vyMdkm76SIc2JZRcKzmVJJ1rUiiu_qO5lY3rtUOGH4FhvTi3mjqE0C6RuOzNF1SZuqhDaE0NGWWMe9mm3BbQPlEGK3Fr_XPQEby7p4ZEYtLEJA6tDy3Vio7VEJDUKzl63Cjl-h86fr0ORFuJcskNx3VUFnpqe-qerJh2', price: 0.99, quantity: '70g' },
    { id: '5', name: 'Parle-G Biscuits', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB_tEln8mFX_nXsPEwv81T2calS9M4mubgLGux59LmaCU7_F5qq-87kfPiakeORvJJ5pcY-v85rIcPlxUCCEk9esDOqYRXOTiGLhLbAG8qOWikkm283dFkIJl3_mMNNgShAGfxir9J4wIJkUanGQ2yT_6WfP3ufw7pVaxDJLKLPa4eDe_p4Lm1PujMVaUAsmWHGA1CFkee-1G2Sskw4sVOBtOBm8TWdSC6xurYJagOw8ZMpIGuv5yoO8jA46F0zDdDFjKnuxM-hTTU', price: 0.99, quantity: '100g' },
    { id: '6', name: 'Pepsi', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb2OC6_veVyOKzc3LP2lLTcCwibVH0lMQLAHlb5_eyWIjLsd241bRH0ulTCoXEPUA6Td5CbSrPWvsv5ILohGR-LcRuz68wwlrival7wFTMrgLFKsEmcTnlViwf5NlvPPYEjmEaHRTPW4lwwzhpHKCW7tQVUpG06bMSpxL9vB5-K8uYnLri7ogx5bLkwr-xypBx7FL5YR_T0ECZ3LZq9sJzX5JAMXb4ju0l04e_x-7YbA-G32JbZXNdOlKDBp7oQdcV7MimrmWN0VIe', price: 0.99, quantity: '330ml' },
];

export const NinetyNineStoreScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <View style={styles.headerCenter}>
                    <View style={styles.storeBadge}>
                        <Text style={styles.storeText}>99</Text>
                    </View>
                    <Text style={styles.headerTitle}>99 Store</Text>
                </View>
                <TouchableOpacity style={styles.cartButton}>
                    <Text style={styles.cartIcon}></Text>
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Value Banner */}
            <View style={styles.valueBanner}>
                <Text style={styles.bannerEmoji}></Text>
                <Text style={styles.bannerText}>
                    Everything at just <Text style={styles.bannerPrice}>0.99</Text> or less!
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
                                <Text style={styles.priceBadgeText}>0.99</Text>
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
                    <Text style={styles.savingsIcon}></Text>
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
