import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../../store/authStore';
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface SettingItem {
    id: string;
    icon: string;
    label: string;
    type: 'toggle' | 'link' | 'value';
    value?: string;
    enabled?: boolean;
}

type SettingItemType = 
    | { id: string; icon: string; label: string; type: 'toggle'; enabled: boolean }
    | { id: string; icon: string; label: string; type: 'link' }
    | { id: string; icon: string; label: string; type: 'value'; value: string };

const settingsGroups: { title: string; items: SettingItemType[] }[] = [
    {
        title: 'Notifications',
        items: [
            { id: '1', icon: '🔔', label: 'Push Notifications', type: 'toggle', enabled: true },
            { id: '2', icon: '📧', label: 'Email Updates', type: 'toggle', enabled: false },
            { id: '3', icon: '💬', label: 'SMS Alerts', type: 'toggle', enabled: true },
            { id: '4', icon: '🎁', label: 'Promotional Offers', type: 'toggle', enabled: true },
        ],
    },
    {
        title: 'Account',
        items: [
            { id: '5', icon: '📱', label: 'Change Phone Number', type: 'link' },
            { id: '6', icon: '📧', label: 'Update Email', type: 'link' },
            { id: '7', icon: '🔒', label: 'Privacy Settings', type: 'link' },
            { id: '8', icon: '🌐', label: 'Language', type: 'value', value: 'English' },
        ],
    },
    {
        title: 'App Preferences',
        items: [
            { id: '9', icon: '🌙', label: 'Dark Mode', type: 'toggle', enabled: true },
            { id: '10', icon: '📍', label: 'Location Services', type: 'toggle', enabled: true },
            { id: '11', icon: '💾', label: 'Clear Cache', type: 'link' },
        ],
    },
    {
        title: 'Legal',
        items: [
            { id: '12', icon: '📄', label: 'Terms of Service', type: 'link' },
            { id: '13', icon: '🔐', label: 'Privacy Policy', type: 'link' },
            { id: '14', icon: '📜', label: 'Licenses', type: 'link' },
        ],
    },
];

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const [settings, setSettings] = useState<{ [key: string]: boolean }>({
        '1': true,
        '2': false,
        '3': true,
        '4': true,
        '9': true,
        '10': true,
    });
    const logout = useAuthStore((state) => state.logout);

    const toggleSetting = (id: string) => {
        setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteAccount = () => {
        // Show confirmation dialog
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {settingsGroups.map((group) => (
                    <View key={group.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{group.title}</Text>
                        {group.items.map((item) => (
                            <View key={item.id} style={styles.settingItem}>
                                <Text style={styles.settingIcon}>{item.icon}</Text>
                                <Text style={styles.settingLabel}>{item.label}</Text>
                                {item.type === 'toggle' && (
                                    <Switch
                                        value={settings[item.id]}
                                        onValueChange={() => toggleSetting(item.id)}
                                        trackColor={{ false: '#2A2A2A', true: '#00E5FF66' }}
                                        thumbColor={settings[item.id] ? '#00E5FF' : '#6B6B6B'}
                                    />
                                )}
                                {item.type === 'value' && (
                                    <Text style={styles.settingValue}>{item.value}</Text>
                                )}
                                {item.type === 'link' && (
                                    <Text style={styles.settingArrow}>→</Text>
                                )}
                            </View>
                        ))}
                    </View>
                ))}

                {/* Danger Zone */}
                <View style={styles.dangerZone}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutIcon}>🚪</Text>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteAccount}>
                        <Text style={styles.deleteIcon}>🗑️</Text>
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>CustomerApp</Text>
                    <Text style={styles.appVersion}>Version 1.0.0 (Build 100)</Text>
                    <Text style={styles.appCopyright}>© 2026 Your Company</Text>
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
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9E9E9E',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    settingIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    settingLabel: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    settingValue: {
        fontSize: 14,
        color: '#00E5FF',
    },
    settingArrow: {
        fontSize: 16,
        color: '#9E9E9E',
    },
    dangerZone: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FFB30033',
    },
    logoutIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    logoutText: {
        fontSize: 16,
        color: '#FFB300',
        fontWeight: '500',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF525233',
    },
    deleteIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    deleteText: {
        fontSize: 16,
        color: '#FF5252',
        fontWeight: '500',
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    appName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 12,
        color: '#6B6B6B',
        marginBottom: 4,
    },
    appCopyright: {
        fontSize: 12,
        color: '#4A4A4A',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default SettingsScreen;
