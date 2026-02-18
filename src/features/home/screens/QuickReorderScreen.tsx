import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../../../components/ui/BackButton';

type Props = { navigation: NativeStackNavigationProp<any> };

// Images from quick_reorder_tab design
const recentOrders = [
    { id: '1', restaurant: 'The Gourmet Kitchen', items: 'Truffle Burger, Fries', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJSBTTnNUXcD3_SoZwkxgwXxnPtQtcW0UTj4fBxvUiAv1RagWpe6nAG9qcP4lMAa_IBQw5hnEP0nSs4XimXjgt30c_jFPc5oDdOH0fUDP0h5R1hk4_usQhnSjW43FGVFmL4Sm5ujbpP_NcYoJ-R0U6QTw4YdoN1gc_UvIJKNXT9hNF_WpIBWw-v-8qJqJAOcA4vK-vPnweo2wzug4qmIj0Q-VhXqXhU1J5JOE_fxrgn1QDChZrCyKb33pkVmjauzf56Jh5N-6va7Ep', total: 24.50, date: '2 days ago' },
    { id: '2', restaurant: 'Urban Bites', items: 'Chicken Wings x2', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgU30K_DDlUza7issKtXAqH2jcxdgPvIUcPcA_pLhJnT0J2_wstQnxPy7G4DkJwm1vf8lVcyeJWognRxj07vh4ci-DKWAiHYN17UIlOATBqiPVxESS0kgwveeA0H1sv48wbe-QgjRaKFBCZEdG7dYC-Uq6uyq0494hSVdr2wks0gJa4jS85Mdu65SyisF0hyEOdy6Io2j9tu_F8ocm-5SGmGUaVozXTeEWRPtLAcMXYswIAj_Uzd_xweUHfk65YXQiSX0N1OUkNeJ6', total: 18.00, date: '5 days ago' },
    { id: '3', restaurant: 'Spice Garden', items: 'Butter Chicken, Naan', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwgnwfFcajDszaP5Q-wB8CN8FLRpOWJV_W98-6zl4Cgw5ksmMH3pN0hmXtncTKBUVE5GKSFgw4ezoBrliGMYh4V6pdHetpfzxXUtxSfNTL1JTFq2OMEP8NLVb-t2OnxTFQrgNyvM3gx0dGdnOK5I7xm8e9t7zanXNM08DnpcSwZdx92I04EjO6CD0MvreVujDF30GEZ6iRNXFGB-pPHZecbTMDJVOEDgscOtmxFEUkGj7859XF1fiwKxrsDYPbqmbZXK7tDwSlXSUn', total: 22.00, date: '1 week ago' },
];

export const QuickReorderScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Quick Reorder</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.heroSection}>
                    <Text style={styles.heroEmoji}>Reorder</Text>
                    <Text style={styles.heroTitle}>Reorder in one tap!</Text>
                    <Text style={styles.heroSubtitle}>Your recent favorites ready to order again</Text>
                </View>

                <Text style={styles.sectionTitle}>Recent Orders</Text>
                {recentOrders.map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                        <Image source={{ uri: order.image }} style={styles.orderImage} />
                        <View style={styles.orderInfo}>
                            <Text style={styles.restaurantName}>{order.restaurant}</Text>
                            <Text style={styles.orderItems}>{order.items}</Text>
                            <Text style={styles.orderDate}>{order.date}</Text>
                        </View>
                        <View style={styles.orderAction}>
                            <Text style={styles.orderTotal}>{order.total.toFixed(2)}</Text>
                            <TouchableOpacity style={styles.reorderButton}><Text style={styles.reorderText}>REORDER</Text></TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={styles.tipCard}>
                    <Text style={styles.tipIcon}></Text>
                    <Text style={styles.tipText}>Tip: Long press to customize your order before reordering</Text>
                </View>
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
    heroSection: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 },
    heroEmoji: { fontSize: 48, marginBottom: 12 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    heroSubtitle: { fontSize: 14, color: '#9E9E9E', textAlign: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', paddingHorizontal: 16, marginBottom: 16 },
    orderCard: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, marginBottom: 12 },
    orderImage: { width: 70, height: 70, borderRadius: 12, marginRight: 12 },
    orderInfo: { flex: 1 },
    restaurantName: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
    orderItems: { fontSize: 14, color: '#9E9E9E', marginBottom: 4 },
    orderDate: { fontSize: 12, color: '#6B6B6B' },
    orderAction: { alignItems: 'flex-end' },
    orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    reorderButton: { backgroundColor: '#00E5FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    reorderText: { fontSize: 12, fontWeight: 'bold', color: '#000000' },
    tipCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 12 },
    tipIcon: { fontSize: 20, marginRight: 12 },
    tipText: { flex: 1, fontSize: 14, color: '#9E9E9E' },
});

export default QuickReorderScreen;
