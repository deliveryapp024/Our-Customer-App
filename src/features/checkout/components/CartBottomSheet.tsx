import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useCartStore } from '../../../store/cartStore';

const { height } = Dimensions.get('window');

interface CartBottomSheetProps {
    onCheckout: () => void;
    onClose: () => void;
}

export const CartBottomSheet: React.FC<CartBottomSheetProps> = ({
    onCheckout,
    onClose,
}) => {
    const { items, restaurantName, getTotal, getItemCount, removeItem, addItem } =
        useCartStore();

    const deliveryFee = 2.99;
    const subtotal = getTotal();
    const total = subtotal + deliveryFee;

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🛒</Text>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtitle}>
                    Add items from a restaurant to get started
                </Text>
                <TouchableOpacity style={styles.browseButton} onPress={onClose}>
                    <Text style={styles.browseButtonText}>Browse Restaurants</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerHandle} />
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Your Cart</Text>
                    <Text style={styles.restaurantName}>{restaurantName}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
            </View>

            {/* Items */}
            <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
                {items.map((cartItem) => (
                    <View key={cartItem.menuItem.id} style={styles.cartItem}>
                        <Image
                            source={{ uri: cartItem.menuItem.image }}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <View style={styles.itemInfo}>
                            <View style={styles.vegIndicator}>
                                <View
                                    style={[
                                        styles.vegDot,
                                        { backgroundColor: cartItem.menuItem.isVeg ? '#00C853' : '#FF5252' },
                                    ]}
                                />
                            </View>
                            <Text style={styles.itemName} numberOfLines={2}>
                                {cartItem.menuItem.name}
                            </Text>
                            <Text style={styles.itemPrice}>
                                ₹{(cartItem.menuItem.price * cartItem.quantity).toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => removeItem(cartItem.menuItem.id)}>
                                <Text style={styles.quantityButtonText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() =>
                                    addItem(
                                        useCartStore.getState().restaurantId!,
                                        useCartStore.getState().restaurantName!,
                                        cartItem.menuItem,
                                    )
                                }>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Add More Items */}
                <TouchableOpacity style={styles.addMoreButton} onPress={onClose}>
                    <Text style={styles.addMoreIcon}>+</Text>
                    <Text style={styles.addMoreText}>Add more items</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bill Summary */}
            <View style={styles.billContainer}>
                <Text style={styles.billTitle}>Bill Details</Text>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Item Total</Text>
                    <Text style={styles.billValue}>₹{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <Text style={styles.billValue}>₹{deliveryFee.toFixed(2)}</Text>
                </View>
                <View style={[styles.billRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>TO PAY</Text>
                    <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
                <View style={styles.checkoutInfo}>
                    <Text style={styles.checkoutItems}>{getItemCount()} ITEMS</Text>
                    <Text style={styles.checkoutTotal}>₹{total.toFixed(2)}</Text>
                </View>
                <View style={styles.checkoutAction}>
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    <Text style={styles.checkoutArrow}>→</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: height * 0.85,
    },
    emptyContainer: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 40,
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B6B6B',
        textAlign: 'center',
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    browseButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    headerHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#4A4A4A',
        borderRadius: 2,
        marginBottom: 16,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    restaurantName: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 24,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    itemsContainer: {
        maxHeight: height * 0.35,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    vegIndicator: {
        width: 14,
        height: 14,
        borderWidth: 1,
        borderColor: '#00C853',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00E5FF',
        borderRadius: 20,
        paddingHorizontal: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
        paddingHorizontal: 8,
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#00E5FF33',
        borderRadius: 12,
        borderStyle: 'dashed',
        marginTop: 12,
        marginBottom: 16,
    },
    addMoreIcon: {
        fontSize: 20,
        color: '#00E5FF',
        marginRight: 8,
    },
    addMoreText: {
        fontSize: 14,
        color: '#00E5FF',
    },
    billContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    billTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    billLabel: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    billValue: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    checkoutButton: {
        backgroundColor: '#00E5FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 30,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    checkoutInfo: {
        flexDirection: 'row',
        gap: 10,
    },
    checkoutItems: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    checkoutTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    checkoutAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    checkoutArrow: {
        fontSize: 18,
        color: '#000000',
    },
});

export default CartBottomSheet;
