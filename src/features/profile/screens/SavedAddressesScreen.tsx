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

interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    icon: string;
    label: string;
    address: string;
    isDefault: boolean;
}

const savedAddresses: Address[] = [
    {
        id: '1',
        type: 'home',
        icon: '🏠',
        label: 'Home',
        address: '45-2/A Main Street, Camp Area, Belagavi, Karnataka 590001',
        isDefault: true,
    },
    {
        id: '2',
        type: 'work',
        icon: '💼',
        label: 'Work',
        address: 'Tech Park, 5th Floor, MG Road, Bangalore, Karnataka 560001',
        isDefault: false,
    },
    {
        id: '3',
        type: 'other',
        icon: '📍',
        label: "Mom's Place",
        address: '123, Gandhi Nagar, Hubli, Karnataka 580001',
        isDefault: false,
    },
];

export const SavedAddressesScreen: React.FC<Props> = ({ navigation }) => {
    const [addresses, setAddresses] = useState(savedAddresses);

    const handleSetDefault = (id: string) => {
        setAddresses((prev) =>
            prev.map((addr) => ({ ...addr, isDefault: addr.id === id })),
        );
    };

    const handleDelete = (id: string) => {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    };

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
                <Text style={styles.headerTitle}>Saved Addresses</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Add New Address */}
                <TouchableOpacity style={styles.addButton}>
                    <View style={styles.addIconContainer}>
                        <Text style={styles.addIcon}>+</Text>
                    </View>
                    <Text style={styles.addText}>Add New Address</Text>
                </TouchableOpacity>

                {/* Current Location */}
                <TouchableOpacity style={styles.currentLocation}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationTitle}>Use Current Location</Text>
                        <Text style={styles.locationSubtitle}>
                            Using GPS to locate you
                        </Text>
                    </View>
                    <Text style={styles.locationArrow}>→</Text>
                </TouchableOpacity>

                {/* Saved Addresses */}
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
                {addresses.map((address) => (
                    <View key={address.id} style={styles.addressCard}>
                        <View style={styles.addressHeader}>
                            <Text style={styles.addressIcon}>{address.icon}</Text>
                            <View style={styles.addressInfo}>
                                <View style={styles.labelRow}>
                                    <Text style={styles.addressLabel}>{address.label}</Text>
                                    {address.isDefault && (
                                        <View style={styles.defaultBadge}>
                                            <Text style={styles.defaultText}>DEFAULT</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.addressText}>{address.address}</Text>
                            </View>
                        </View>
                        <View style={styles.addressActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleSetDefault(address.id)}>
                                <Text style={styles.actionIcon}>✓</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionIcon}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleDelete(address.id)}>
                                <Text style={styles.actionIcon}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#0A2A2A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#00E5FF',
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    addIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addIcon: {
        fontSize: 24,
        color: '#000000',
        fontWeight: 'bold',
    },
    addText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00E5FF',
    },
    currentLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        marginBottom: 24,
    },
    locationIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    locationSubtitle: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    locationArrow: {
        fontSize: 18,
        color: '#00E5FF',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    addressCard: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        marginBottom: 12,
    },
    addressHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    addressIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    addressInfo: {
        flex: 1,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginRight: 8,
    },
    defaultBadge: {
        backgroundColor: '#00E5FF33',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    addressText: {
        fontSize: 14,
        color: '#9E9E9E',
        lineHeight: 20,
    },
    addressActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 14,
    },
    bottomSpacing: {
        height: 40,
    },
});

export default SavedAddressesScreen;
