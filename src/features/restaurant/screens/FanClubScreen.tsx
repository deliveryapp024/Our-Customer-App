import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../../../components/ui/BackButton';

type Props = { navigation: NativeStackNavigationProp<any> };

const perks = [
    { id: '1', icon: '🎁', title: '10% Off All Orders', description: 'Exclusive member discount' },
    { id: '2', icon: '🚚', title: 'Free Delivery', description: 'No delivery fee ever' },
    { id: '3', icon: '⭐', title: 'Priority Support', description: 'Skip the queue' },
    { id: '4', icon: '🎂', title: 'Birthday Treat', description: 'Free dessert on your birthday' },
];

const tiers = [
    { name: 'Bronze', orders: 10, icon: '🥉', current: true },
    { name: 'Silver', orders: 25, icon: '🥈', current: false },
    { name: 'Gold', orders: 50, icon: '🥇', current: false },
    { name: 'Platinum', orders: 100, icon: '💎', current: false },
];

export const FanClubScreen: React.FC<Props> = ({ navigation }) => {
    const currentOrders = 15;
    const nextTierOrders = 25;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Fan Club</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    // Image from restaurant_fan_club_loyalty design
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4DSeZGWbVfWaQoBSz8Po_e1FFHAbCJ0JhqkgFkPwawDxyTSAis4sMfbDvnLeuf-MBjWpE_suGdsAtx2KubTjwitJ8LMQcWXpWMcXKzIID8xf_y-E5XDl-W3fdwg47nz7AwXB7LZzt24YcM5vcrHpW1ymKAJv2NYU2QpfCvM8GoC71kqoRyaiSqj6yycxt8ABQIO689Sgg2fbTxzqZ2Jx5_aD8ORgSHAb_DvR_U-I57I-x0pJinAJAUJWMwP6uWO4pHQQPIgW4lqVh' }} style={styles.restaurantImage} />
                    <Text style={styles.restaurantName}>The Gourmet Kitchen</Text>
                    <View style={styles.tierBadge}><Text style={styles.tierIcon}>🥉</Text><Text style={styles.tierText}>Bronze Member</Text></View>
                    <View style={styles.progressSection}>
                        <Text style={styles.progressLabel}>{currentOrders} / {nextTierOrders} orders to Silver</Text>
                        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${(currentOrders / nextTierOrders) * 100}%` }]} /></View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Perks</Text>
                    {perks.map((perk) => (
                        <View key={perk.id} style={styles.perkCard}>
                            <Text style={styles.perkIcon}>{perk.icon}</Text>
                            <View style={styles.perkInfo}><Text style={styles.perkTitle}>{perk.title}</Text><Text style={styles.perkDescription}>{perk.description}</Text></View>
                            <Text style={styles.perkCheck}>✓</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Loyalty Tiers</Text>
                    <View style={styles.tiersRow}>
                        {tiers.map((tier) => (
                            <View key={tier.name} style={[styles.tierCard, tier.current && styles.tierCardActive]}>
                                <Text style={styles.tierEmoji}>{tier.icon}</Text>
                                <Text style={styles.tierName}>{tier.name}</Text>
                                <Text style={styles.tierOrders}>{tier.orders}+</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.orderButton}><Text style={styles.orderButtonText}>ORDER NOW</Text></TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    placeholder: { width: 40 },
    heroCard: { marginHorizontal: 16, padding: 24, backgroundColor: '#1A1A1A', borderRadius: 24, alignItems: 'center', marginBottom: 24 },
    restaurantImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 },
    restaurantName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
    tierBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A1A0A', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginBottom: 16 },
    tierIcon: { fontSize: 16, marginRight: 8 },
    tierText: { fontSize: 14, fontWeight: '600', color: '#FFB300' },
    progressSection: { width: '100%' },
    progressLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 8, textAlign: 'center' },
    progressBar: { height: 8, backgroundColor: '#2A2A2A', borderRadius: 4 },
    progressFill: { height: '100%', backgroundColor: '#FFB300', borderRadius: 4 },
    section: { paddingHorizontal: 16, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
    perkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 8 },
    perkIcon: { fontSize: 24, marginRight: 12 },
    perkInfo: { flex: 1 },
    perkTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
    perkDescription: { fontSize: 12, color: '#9E9E9E' },
    perkCheck: { fontSize: 16, color: '#00C853' },
    tiersRow: { flexDirection: 'row', gap: 8 },
    tierCard: { flex: 1, padding: 12, backgroundColor: '#1A1A1A', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A' },
    tierCardActive: { borderColor: '#FFB300' },
    tierEmoji: { fontSize: 24, marginBottom: 8 },
    tierName: { fontSize: 12, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
    tierOrders: { fontSize: 10, color: '#9E9E9E' },
    orderButton: { marginHorizontal: 16, backgroundColor: '#00E5FF', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
    orderButtonText: { fontSize: 16, fontWeight: 'bold', color: '#000000' },
});

export default FanClubScreen;
