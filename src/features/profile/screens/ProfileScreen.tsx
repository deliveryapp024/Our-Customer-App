import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../../store/authStore';
import { SCREENS } from '../../../constants';
import { getAvatarOptionById } from '../../../constants/avatars';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

const menuItems = [
    { id: '1', icon: '??', label: 'Your Orders', screen: SCREENS.ORDER_HISTORY },
    { id: '2', icon: '??', label: 'Favorites', screen: SCREENS.FAVORITES },
    { id: '3', icon: '??', label: 'Saved Addresses', screen: SCREENS.SAVED_ADDRESSES },
    { id: '4', icon: '??', label: 'Payments', screen: SCREENS.PAYMENTS_HUB },
    { id: '5', icon: '??', label: 'Refer & Earn', screen: null },
    { id: '6', icon: '??', label: 'Settings', screen: SCREENS.SETTINGS },
    { id: '7', icon: '?', label: 'Help & Support', screen: SCREENS.HELP_SUPPORT },
];

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const { user, logout } = useAuthStore();
    const selectedAvatar = getAvatarOptionById(user?.profileAvatarId);

    const handleLogout = async () => {
        await logout();
    };

    const handleMenuPress = (screen: string | null) => {
        if (screen) {
            navigation.navigate(screen);
        }
    };

    const renderAvatar = () => {
        if (user?.profileImageType === 'upload' && user?.profileImage) {
            return <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />;
        }

        if (user?.profileImageType === 'avatar' && selectedAvatar) {
            return (
                <View style={[styles.avatarEmojiContainer, { backgroundColor: selectedAvatar.bgColor }]}>
                    <Text style={styles.avatarEmoji}>{selectedAvatar.emoji}</Text>
                </View>
            );
        }

        return (
            <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || '??'}
            </Text>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editIcon}>??</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>{renderAvatar()}</View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
                        <Text style={styles.profilePhone}>{user?.phone || '+91 XXXXXXXXXX'}</Text>
                        {user?.email && <Text style={styles.profileEmail}>{user.email}</Text>}
                    </View>
                </View>

                <TouchableOpacity style={styles.membershipCard}>
                    <View style={styles.membershipInfo}>
                        <Text style={styles.membershipBadge}>ONE</Text>
                        <Text style={styles.membershipTitle}>Swiggy One Member</Text>
                        <Text style={styles.membershipSubtitle}>Free delivery on all orders</Text>
                    </View>
                    <Text style={styles.membershipArrow}>?</Text>
                </TouchableOpacity>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>23</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>?240</Text>
                        <Text style={styles.statLabel}>Saved</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>4.8</Text>
                        <Text style={styles.statLabel}>Avg Rating</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => handleMenuPress(item.screen)}>
                            <Text style={styles.menuIcon}>{item.icon}</Text>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.menuArrow}>?</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutIcon}>??</Text>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>

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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIcon: {
        fontSize: 16,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarEmojiContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 30,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    profilePhone: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    membershipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFB30033',
    },
    membershipInfo: {
        flex: 1,
    },
    membershipBadge: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFB300',
        backgroundColor: '#FFB30033',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    membershipTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    membershipSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    membershipArrow: {
        fontSize: 20,
        color: '#FFB300',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00E5FF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#2A2A2A',
    },
    menuContainer: {
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    menuArrow: {
        fontSize: 16,
        color: '#9E9E9E',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF525233',
    },
    logoutIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    logoutText: {
        fontSize: 16,
        color: '#FF5252',
        fontWeight: '500',
    },
    versionText: {
        fontSize: 12,
        color: '#4A4A4A',
        textAlign: 'center',
        marginTop: 24,
    },
    bottomSpacing: {
        height: 100,
    },
});

export default ProfileScreen;
