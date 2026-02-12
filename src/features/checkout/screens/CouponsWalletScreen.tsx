import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    onApplyCoupon?: (code: string) => void;
};

interface Coupon {
    id: string;
    code: string;
    title: string;
    description: string;
    discount: string;
    minOrder: number;
    expiresIn: string;
    isApplicable: boolean;
}

const coupons: Coupon[] = [
    {
        id: '1',
        code: 'WELCOME50',
        title: '50% OFF',
        description: 'Get 50% off on your first order',
        discount: 'up to ₹15',
        minOrder: 20,
        expiresIn: '2 days',
        isApplicable: true,
    },
    {
        id: '2',
        code: 'FREEDEL',
        title: 'Free Delivery',
        description: 'Free delivery on orders above ₹25',
        discount: 'Save ₹4.99',
        minOrder: 25,
        expiresIn: '5 days',
        isApplicable: true,
    },
    {
        id: '3',
        code: 'PARTY30',
        title: '30% OFF',
        description: 'Weekend special on all orders',
        discount: 'up to ₹20',
        minOrder: 50,
        expiresIn: '1 day',
        isApplicable: false,
    },
    {
        id: '4',
        code: 'SWIGGY100',
        title: 'Flat ₹10 OFF',
        description: 'Flat discount on selected restaurants',
        discount: '₹10',
        minOrder: 30,
        expiresIn: '7 days',
        isApplicable: true,
    },
];

export const CouponsWalletScreen: React.FC<Props> = ({ navigation, onApplyCoupon }) => {
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const handleApply = (code: string) => {
        setAppliedCoupon(code);
        onApplyCoupon?.(code);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Coupons & Offers</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Enter Coupon Code */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.couponInput}
                    placeholder="Enter coupon code"
                    placeholderTextColor="#6B6B6B"
                    value={couponCode}
                    onChangeText={setCouponCode}
                    autoCapitalize="characters"
                />
                <TouchableOpacity
                    style={[styles.applyButton, !couponCode && styles.applyButtonDisabled]}
                    disabled={!couponCode}>
                    <Text style={styles.applyButtonText}>APPLY</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Available Coupons */}
                <Text style={styles.sectionTitle}>Available Coupons</Text>

                {coupons.map((coupon) => (
                    <View
                        key={coupon.id}
                        style={[
                            styles.couponCard,
                            !coupon.isApplicable && styles.couponCardDisabled,
                        ]}>
                        <View style={styles.couponLeft}>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{coupon.title}</Text>
                            </View>
                        </View>
                        <View style={styles.couponRight}>
                            <View style={styles.couponHeader}>
                                <Text style={styles.couponCode}>{coupon.code}</Text>
                                <Text style={styles.expiresText}>Expires in {coupon.expiresIn}</Text>
                            </View>
                            <Text style={styles.couponDescription}>{coupon.description}</Text>
                            <View style={styles.couponFooter}>
                                <Text style={styles.minOrderText}>
                                    Min. order: ₹{coupon.minOrder} • {coupon.discount}
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.couponApplyButton,
                                        !coupon.isApplicable && styles.couponApplyButtonDisabled,
                                    ]}
                                    disabled={!coupon.isApplicable}
                                    onPress={() => handleApply(coupon.code)}>
                                    <Text
                                        style={[
                                            styles.couponApplyText,
                                            !coupon.isApplicable && styles.couponApplyTextDisabled,
                                        ]}>
                                        {coupon.isApplicable ? 'APPLY' : 'NOT APPLICABLE'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Terms */}
                <View style={styles.termsContainer}>
                    <Text style={styles.termsTitle}>Terms & Conditions</Text>
                    <Text style={styles.termsText}>
                        • Coupons are valid for limited time only{'\n'}
                        • Cannot be combined with other offers{'\n'}
                        • Valid on selected restaurants only{'\n'}
                        • Maximum discount limits apply
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 24,
        gap: 12,
    },
    couponInput: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    applyButton: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 24,
        borderRadius: 12,
        justifyContent: 'center',
    },
    applyButtonDisabled: {
        backgroundColor: '#2A2A2A',
    },
    applyButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    couponCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        overflow: 'hidden',
    },
    couponCardDisabled: {
        opacity: 0.5,
    },
    couponLeft: {
        width: 80,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    discountBadge: {
        transform: [{ rotate: '-90deg' }],
        width: 80,
    },
    discountText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    couponRight: {
        flex: 1,
        padding: 16,
    },
    couponHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    couponCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    expiresText: {
        fontSize: 11,
        color: '#FFB300',
    },
    couponDescription: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 12,
    },
    couponFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    minOrderText: {
        fontSize: 12,
        color: '#6B6B6B',
    },
    couponApplyButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    couponApplyButtonDisabled: {
        borderColor: '#4A4A4A',
    },
    couponApplyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00E5FF',
    },
    couponApplyTextDisabled: {
        color: '#6B6B6B',
    },
    termsContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
    },
    termsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    termsText: {
        fontSize: 12,
        color: '#6B6B6B',
        lineHeight: 20,
    },
    bottomSpacing: {
        height: 40,
    },
});

export default CouponsWalletScreen;
