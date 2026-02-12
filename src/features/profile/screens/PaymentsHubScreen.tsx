import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface PaymentMethod {
    id: string;
    type: 'wallet' | 'upi' | 'card' | 'netbanking';
    icon: string;
    name: string;
    detail?: string;
    balance?: number;
    isDefault?: boolean;
}

const paymentMethods: PaymentMethod[] = [
    { id: '1', type: 'wallet', icon: '💼', name: 'App Wallet', balance: 124.50, isDefault: true },
    { id: '2', type: 'upi', icon: '🔵', name: 'Google Pay', detail: 'user@okaxis' },
    { id: '3', type: 'upi', icon: '🟣', name: 'PhonePe', detail: 'user@ybl' },
    { id: '4', type: 'card', icon: '💳', name: 'Visa •••• 4242', detail: 'Expires 12/26' },
    { id: '5', type: 'card', icon: '💳', name: 'Mastercard •••• 8888', detail: 'Expires 08/25' },
];

const quickActions = [
    { id: '1', icon: '➕', label: 'Add Money' },
    { id: '2', icon: '🔄', label: 'Send' },
    { id: '3', icon: '📜', label: 'History' },
    { id: '4', icon: '🎁', label: 'Offers' },
];

export const PaymentsHubScreen: React.FC<Props> = ({ navigation }) => {
    const [walletBalance] = useState(124.50);

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
                <Text style={styles.headerTitle}>Payments & Wallet</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Wallet Card */}
                <View style={styles.walletCard}>
                    <View style={styles.walletHeader}>
                        <Text style={styles.walletIcon}>💰</Text>
                        <View style={styles.walletInfo}>
                            <Text style={styles.walletLabel}>Wallet Balance</Text>
                            <Text style={styles.walletBalance}>₹{walletBalance.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={styles.quickActions}>
                        {quickActions.map((action) => (
                            <TouchableOpacity key={action.id} style={styles.quickAction}>
                                <View style={styles.quickActionIcon}>
                                    <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                                </View>
                                <Text style={styles.quickActionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* UPI Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>UPI</Text>
                        <TouchableOpacity>
                            <Text style={styles.addText}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>
                    {paymentMethods
                        .filter((m) => m.type === 'upi')
                        .map((method) => (
                            <TouchableOpacity key={method.id} style={styles.paymentItem}>
                                <Text style={styles.paymentIcon}>{method.icon}</Text>
                                <View style={styles.paymentInfo}>
                                    <Text style={styles.paymentName}>{method.name}</Text>
                                    <Text style={styles.paymentDetail}>{method.detail}</Text>
                                </View>
                                <View style={styles.radioOuter}>
                                    <View style={styles.radioInner} />
                                </View>
                            </TouchableOpacity>
                        ))}
                </View>

                {/* Cards Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Cards</Text>
                        <TouchableOpacity>
                            <Text style={styles.addText}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>
                    {paymentMethods
                        .filter((m) => m.type === 'card')
                        .map((method) => (
                            <TouchableOpacity key={method.id} style={styles.paymentItem}>
                                <Text style={styles.paymentIcon}>{method.icon}</Text>
                                <View style={styles.paymentInfo}>
                                    <Text style={styles.paymentName}>{method.name}</Text>
                                    <Text style={styles.paymentDetail}>{method.detail}</Text>
                                </View>
                                <TouchableOpacity style={styles.deleteButton}>
                                    <Text style={styles.deleteIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                </View>

                {/* Other Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>More Options</Text>
                    <TouchableOpacity style={styles.optionItem}>
                        <Text style={styles.optionIcon}>🏦</Text>
                        <Text style={styles.optionText}>Net Banking</Text>
                        <Text style={styles.optionArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionItem}>
                        <Text style={styles.optionIcon}>💵</Text>
                        <Text style={styles.optionText}>Cash on Delivery</Text>
                        <Text style={styles.optionArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionItem}>
                        <Text style={styles.optionIcon}>🎫</Text>
                        <Text style={styles.optionText}>Gift Cards</Text>
                        <Text style={styles.optionArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Security Notice */}
                <View style={styles.securityNotice}>
                    <Text style={styles.securityIcon}>🔒</Text>
                    <Text style={styles.securityText}>
                        Your payment information is encrypted and secure. We never store your card CVV.
                    </Text>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    walletCard: {
        marginHorizontal: 16,
        backgroundColor: '#0A2A2A',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    walletHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    walletIcon: {
        fontSize: 40,
        marginRight: 16,
    },
    walletInfo: {
        flex: 1,
    },
    walletLabel: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 4,
    },
    walletBalance: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    quickAction: {
        alignItems: 'center',
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionEmoji: {
        fontSize: 20,
    },
    quickActionLabel: {
        fontSize: 12,
        color: '#FFFFFF',
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    addText: {
        fontSize: 14,
        color: '#00E5FF',
    },
    paymentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    paymentIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    paymentDetail: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#00E5FF',
    },
    deleteButton: {
        padding: 8,
    },
    deleteIcon: {
        fontSize: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    optionIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
    },
    optionArrow: {
        fontSize: 16,
        color: '#9E9E9E',
    },
    securityNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
    },
    securityIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    securityText: {
        flex: 1,
        fontSize: 12,
        color: '#9E9E9E',
        lineHeight: 18,
    },
    bottomSpacing: {
        height: 40,
    },
});

export default PaymentsHubScreen;
