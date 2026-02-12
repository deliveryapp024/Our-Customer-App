import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
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

const ecoStats = {
    co2Saved: 12.5,
    plasticAvoided: 45,
    treesEquivalent: 2,
    ordersEcoFriendly: 23,
};

const achievements = [
    { id: '1', icon: '🌱', title: 'Eco Starter', description: 'Made 5 eco-friendly orders', earned: true },
    { id: '2', icon: '🌿', title: 'Green Guardian', description: '10 plastic-free orders', earned: true },
    { id: '3', icon: '🌳', title: 'Forest Friend', description: 'Saved 5kg CO2', earned: false },
    { id: '4', icon: '🌍', title: 'Planet Protector', description: '50 eco orders', earned: false },
];

const ecoTips = [
    { id: '1', icon: '🥤', title: 'Skip the straw', description: 'Say no to plastic straws' },
    { id: '2', icon: '🍽️', title: 'No cutlery', description: 'Use your own utensils' },
    { id: '3', icon: '📦', title: 'Eco packaging', description: 'Choose sustainable packing' },
];

export const EcoDashboardScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Eco Impact</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroEmoji}>🌍</Text>
                    <Text style={styles.heroTitle}>Your Eco Impact</Text>
                    <Text style={styles.heroSubtitle}>
                        Thank you for making sustainable choices!
                    </Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{ecoStats.co2Saved}kg</Text>
                        <Text style={styles.statLabel}>CO₂ Saved</Text>
                        <Text style={styles.statIcon}>💨</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{ecoStats.plasticAvoided}</Text>
                        <Text style={styles.statLabel}>Plastics Avoided</Text>
                        <Text style={styles.statIcon}>🚫</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{ecoStats.treesEquivalent}</Text>
                        <Text style={styles.statLabel}>Trees Equivalent</Text>
                        <Text style={styles.statIcon}>🌳</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{ecoStats.ordersEcoFriendly}</Text>
                        <Text style={styles.statLabel}>Eco Orders</Text>
                        <Text style={styles.statIcon}>♻️</Text>
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.achievementsGrid}>
                        {achievements.map((achievement) => (
                            <View
                                key={achievement.id}
                                style={[
                                    styles.achievementCard,
                                    !achievement.earned && styles.achievementCardLocked,
                                ]}>
                                <Text style={styles.achievementIcon}>
                                    {achievement.earned ? achievement.icon : '🔒'}
                                </Text>
                                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                                <Text style={styles.achievementDescription}>
                                    {achievement.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Eco Tips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Eco Tips</Text>
                    {ecoTips.map((tip) => (
                        <View key={tip.id} style={styles.tipCard}>
                            <View style={styles.tipIcon}>
                                <Text style={styles.tipEmoji}>{tip.icon}</Text>
                            </View>
                            <View style={styles.tipInfo}>
                                <Text style={styles.tipTitle}>{tip.title}</Text>
                                <Text style={styles.tipDescription}>{tip.description}</Text>
                            </View>
                            <TouchableOpacity style={styles.tipAction}>
                                <Text style={styles.tipActionText}>Enable</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Share Card */}
                <TouchableOpacity style={styles.shareCard}>
                    <Text style={styles.shareEmoji}>📱</Text>
                    <View style={styles.shareInfo}>
                        <Text style={styles.shareTitle}>Share Your Impact</Text>
                        <Text style={styles.shareSubtitle}>
                            Inspire others to make eco-friendly choices
                        </Text>
                    </View>
                    <Text style={styles.shareArrow}>→</Text>
                </TouchableOpacity>

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
    heroCard: {
        marginHorizontal: 16,
        padding: 32,
        backgroundColor: '#0A2A1A',
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#00C85333',
    },
    heroEmoji: {
        fontSize: 56,
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 8,
        marginBottom: 24,
    },
    statCard: {
        width: (width - 40) / 2,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        position: 'relative',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00C853',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    statIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
        fontSize: 20,
        opacity: 0.5,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    achievementCard: {
        width: (width - 48) / 2,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00C85333',
    },
    achievementCardLocked: {
        opacity: 0.5,
        borderColor: '#2A2A2A',
    },
    achievementIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    achievementDescription: {
        fontSize: 11,
        color: '#9E9E9E',
        textAlign: 'center',
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    tipIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0A2A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    tipEmoji: {
        fontSize: 20,
    },
    tipInfo: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    tipDescription: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    tipAction: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#00C853',
    },
    tipActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    shareCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
    },
    shareEmoji: {
        fontSize: 32,
        marginRight: 16,
    },
    shareInfo: {
        flex: 1,
    },
    shareTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    shareSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    shareArrow: {
        fontSize: 20,
        color: '#00C853',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default EcoDashboardScreen;
