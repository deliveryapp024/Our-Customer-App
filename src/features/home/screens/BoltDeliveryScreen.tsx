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

const boltItems = [
    {
        id: '1',
        name: 'Swift Burger',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC5vARZsW5066UvblgoPxPCIbg0144cPv7c9etHqj_c_Vz115R9N8sM0CSGW_UKDmzhMrFoLrOv2JfL9rjggmwLfchZ-N9TEI3RgkIMgsGY4js8ok-bPsERSAmc1VBC1ZV4gIywnz1L4TrVqXxcDwOKptJ_A5Qhg02W85oUNPn9-ywmRanfzc6Oj-fZVEgVf5LmEf9qzLHjLk-WmwIUvAZwmstPFUEhp-mhFclgyuwkAPsMARIe1l3cUvJn-_e7l5KXmlT13VPwwjG',
        price: 8.99,
        originalPrice: 10.99,
        deliveryTime: '10 mins',
    },
    {
        id: '2',
        name: 'Neon Sushi',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaK6mw5c3Q_hcTp6lr_TM7flUgPK9FzKZGh-OD0tYb823z-UYIiD66RIHuRaRR-np55RRnZ5yH-f2Nny41ughY6YJjAzsXg0HB1G_lMxrLleUVOXbEQtNf4_cKSLx2sf18u9Ca7JNAzGE5bSgzwKRl9r8gpMBBn3_GY-iOWdiruHr2FkZkND6bl3eXhgVcln1OzualX7XrYBT9DyFd64LDiwMsCHBtWQHZ60NTdW-YG4B1UvyD3hWbxPJP_UL9aNYd60Whc8_KSr3j',
        price: 12.49,
        deliveryTime: '10 mins',
    },
    {
        id: '3',
        name: 'Rapid Pizza',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMvLCScxy017OTGm6tb2FnoFuY3QhMDYlZQB2oOwS2yTpoR9LygWU5lpmue3Wv892Sshz75Zmid8BjeUW0z0aZ5_jY-JhDTYDSdKmwTgJ5cSZy6jnUD-ksNuIAl8VdtPUF0wBB5GgKXHJ7-mfIrufXdn7SA2ZWvvZDiD7ueVkgWqM3wnA5xr-dw3X2iGJfeR8iTXWZiWdBCdHeGdEHR1A8U0jc7D3zYNMQyVYKeA2t0CjUNDs_hKd7W_AiSNs0mJiuc86mea1arMdu',
        price: 9.99,
        deliveryTime: '12 mins',
    },
    {
        id: '4',
        name: 'Paradise Biryani',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDL_hv9NIrd8zZtdLBqQHd-5MAAQSZMqYtMgg9wmoQSUBWyydGORerIaxcxEZPObCaVmlJt7-T1Fpn_oeLFSW-qjcvK69sKfe-QJPFj7Vhnd_5OTsKvcRAHXmFdPVdJLkOcR_XyZ5oos10D-T81uS-b98KedNVLtQvAvnWv4cLponieo9yYw5ZrBAGjdoqn9wTaY4NZGOomdAkK8rVyVUtTT2RfZpdzE6UOhEe_2QhmCJRL_deG1zh8rt4CvLWMg_XI5yLBwogF944',
        price: 11.29,
        deliveryTime: '10 mins',
    },
];

const categories = [
    { id: '1', name: 'Dairy', icon: '🥛' },
    { id: '2', name: 'Fruits', icon: '🍎' },
    { id: '3', name: 'Veggies', icon: '🥬' },
    { id: '4', name: 'Snacks', icon: '🍿' },
    { id: '5', name: 'Drinks', icon: '🥤' },
];

export const BoltDeliveryScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <View style={styles.headerCenter}>
                    <View style={styles.boltBadge}>
                        <Text style={styles.boltIcon}>⚡</Text>
                    </View>
                    <Text style={styles.headerTitle}>Bolt</Text>
                    <Text style={styles.headerSubtitle}>10-15 min delivery</Text>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>

            {/* Timer Banner */}
            <View style={styles.timerBanner}>
                <Text style={styles.timerIcon}>⏱️</Text>
                <Text style={styles.timerText}>
                    Order in <Text style={styles.timerHighlight}>4:32</Text> for guaranteed 10-min delivery
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}>
                    {categories.map((cat) => (
                        <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                            <View style={styles.categoryIcon}>
                                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                            </View>
                            <Text style={styles.categoryName}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Popular Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Most Popular</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.itemsGrid}>
                    {boltItems.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.deliveryBadge}>
                                <Text style={styles.deliveryBadgeText}>{item.deliveryTime}</Text>
                            </View>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                                {item.originalPrice && (
                                    <Text style={styles.originalPrice}>
                                        ₹{item.originalPrice.toFixed(2)}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.addButtonText}>ADD</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>🚀</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>How Bolt Works</Text>
                        <Text style={styles.infoText}>
                            Items are picked from nearby dark stores and delivered in under 15 minutes. No minimum order required!
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
        alignItems: 'center',
    },
    boltBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    boltIcon: {
        fontSize: 18,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#00E5FF',
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcon: {
        fontSize: 18,
    },
    timerBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00E5FF',
        paddingVertical: 10,
        marginBottom: 16,
    },
    timerIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    timerText: {
        fontSize: 14,
        color: '#000000',
    },
    timerHighlight: {
        fontWeight: 'bold',
    },
    categoriesContainer: {
        marginBottom: 24,
    },
    categoriesContent: {
        paddingHorizontal: 16,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#00E5FF33',
    },
    categoryEmoji: {
        fontSize: 24,
    },
    categoryName: {
        fontSize: 12,
        color: '#FFFFFF',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    seeAllText: {
        fontSize: 14,
        color: '#00E5FF',
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 8,
    },
    itemCard: {
        width: (width - 40) / 2,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 12,
        position: 'relative',
    },
    deliveryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#00E5FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 1,
    },
    deliveryBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
    },
    itemImage: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        marginBottom: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 14,
        color: '#6B6B6B',
        textDecorationLine: 'line-through',
    },
    addButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    infoCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        backgroundColor: '#0A2A2A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    infoIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#9E9E9E',
        lineHeight: 20,
    },
    bottomSpacing: {
        height: 40,
    },
});

export default BoltDeliveryScreen;
