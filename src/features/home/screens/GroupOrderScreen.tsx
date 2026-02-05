import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    StatusBar,
    StyleSheet,
    Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface GroupMember {
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
    itemCount: number;
    total: number;
}

const members: GroupMember[] = [
    { id: '1', name: 'You', avatar: '👤', isHost: true, itemCount: 2, total: 18.50 },
    { id: '2', name: 'Priya', avatar: '👩', isHost: false, itemCount: 1, total: 12.00 },
    { id: '3', name: 'Rahul', avatar: '👨', isHost: false, itemCount: 0, total: 0 },
];

export const GroupOrderScreen: React.FC<Props> = ({ navigation }) => {
    const [groupCode] = useState('GRPFOOD2024');
    const [isLobbyOpen, setIsLobbyOpen] = useState(true);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Join my group order! Use code: ${groupCode} or click: https://app.link/group/${groupCode}`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const totalItems = members.reduce((sum, m) => sum + m.itemCount, 0);
    const totalAmount = members.reduce((sum, m) => sum + m.total, 0);

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
                <Text style={styles.headerTitle}>Group Order</Text>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Text style={styles.shareIcon}>📤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Group Code Card */}
                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}>Share this code with friends</Text>
                    <View style={styles.codeBox}>
                        <Text style={styles.codeText}>{groupCode}</Text>
                        <TouchableOpacity style={styles.copyButton}>
                            <Text style={styles.copyIcon}>📋</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.inviteButton} onPress={handleShare}>
                        <Text style={styles.inviteIcon}>✉️</Text>
                        <Text style={styles.inviteText}>Invite Friends</Text>
                    </TouchableOpacity>
                </View>

                {/* Restaurant Info */}
                <View style={styles.restaurantCard}>
                    // Image from group_order_collaboration_hub design
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrmY6BTt-h9SoXRwL0sRcAHapG4E07BkBy2bGFt0YKL7y1F2TcDdpHfn4SZJic9EgcgKomK64FaikUxcNH_zy5faQdlrx2rCaaMy6Nw6K28xihuSRMVzvejBWOWLgR6feasAxakrlcPz_0W7Xctuqpj_ncoqmwdrJiKTAd0T69AkcfPUCe9uEQqCPpSKPBXCu82nw-cJn_l_NHL8Z-Ogf-jQLOve8gWzLHfsnr1b2tjW1s4uv_JvYjG-yuTOxTlP9LMKEgcPvt_6XC' }}
                        style={styles.restaurantImage}
                    />
                    <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>The Gourmet Kitchen</Text>
                        <Text style={styles.restaurantMeta}>Everyone orders from this restaurant</Text>
                    </View>
                </View>

                {/* Members List */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Group Members ({members.length})</Text>
                        {isLobbyOpen && (
                            <View style={styles.openBadge}>
                                <Text style={styles.openBadgeText}>OPEN</Text>
                            </View>
                        )}
                    </View>

                    {members.map((member) => (
                        <View key={member.id} style={styles.memberCard}>
                            <View style={styles.memberAvatar}>
                                <Text style={styles.avatarText}>{member.avatar}</Text>
                            </View>
                            <View style={styles.memberInfo}>
                                <View style={styles.memberNameRow}>
                                    <Text style={styles.memberName}>{member.name}</Text>
                                    {member.isHost && (
                                        <View style={styles.hostBadge}>
                                            <Text style={styles.hostBadgeText}>HOST</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.memberStatus}>
                                    {member.itemCount > 0
                                        ? `${member.itemCount} items • $${member.total.toFixed(2)}`
                                        : 'Browsing menu...'}
                                </Text>
                            </View>
                            {member.itemCount > 0 && (
                                <View style={styles.checkIcon}>
                                    <Text style={styles.checkText}>✓</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Add to Your Order */}
                <TouchableOpacity style={styles.addItemsButton}>
                    <Text style={styles.addItemsIcon}>➕</Text>
                    <Text style={styles.addItemsText}>Add Items to Your Order</Text>
                </TouchableOpacity>

                {/* Group Total */}
                <View style={styles.totalCard}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Group Total</Text>
                        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalSubLabel}>Total Items</Text>
                        <Text style={styles.totalSubValue}>{totalItems}</Text>
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.checkoutButton}>
                    <View style={styles.checkoutInfo}>
                        <Text style={styles.checkoutItems}>{totalItems} ITEMS</Text>
                        <Text style={styles.checkoutTotal}>${totalAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.checkoutAction}>
                        <Text style={styles.checkoutText}>Place Group Order</Text>
                        <Text style={styles.checkoutArrow}>→</Text>
                    </View>
                </TouchableOpacity>
            </View>
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
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareIcon: {
        fontSize: 18,
    },
    codeCard: {
        marginHorizontal: 16,
        padding: 20,
        backgroundColor: '#0A2A2A',
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    codeLabel: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 12,
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    codeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00E5FF',
        letterSpacing: 2,
        marginRight: 12,
    },
    copyButton: {
        padding: 4,
    },
    copyIcon: {
        fontSize: 18,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00E5FF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    inviteIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    inviteText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    restaurantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        marginBottom: 24,
    },
    restaurantImage: {
        width: 56,
        height: 56,
        borderRadius: 12,
        marginRight: 12,
    },
    restaurantInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    restaurantMeta: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginRight: 8,
    },
    openBadge: {
        backgroundColor: '#00C853',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    openBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    memberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
    },
    memberInfo: {
        flex: 1,
    },
    memberNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    memberName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginRight: 8,
    },
    hostBadge: {
        backgroundColor: '#FFB300',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    hostBadgeText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000000',
    },
    memberStatus: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#00C853',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    addItemsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#00E5FF',
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    addItemsIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    addItemsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00E5FF',
    },
    totalCard: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00E5FF',
    },
    totalSubLabel: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    totalSubValue: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    bottomSpacing: {
        height: 120,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 30,
        backgroundColor: '#1A1A1A',
    },
    checkoutButton: {
        backgroundColor: '#00E5FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
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

export default GroupOrderScreen;
