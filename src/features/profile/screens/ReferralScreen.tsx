import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

const rewards = [
    { id: '1', icon: '🎁', title: 'Friend gets ₹10', description: 'On their first order' },
    { id: '2', icon: '💰', title: 'You get ₹10', description: 'When they complete an order' },
    { id: '3', icon: '🔁', title: 'Unlimited referrals', description: 'Keep earning rewards' },
];

const referralHistory = [
    { id: '1', name: 'Priya S.', status: 'completed', earned: 10, date: '2 days ago' },
    { id: '2', name: 'Rahul K.', status: 'pending', earned: 0, date: '1 week ago' },
    { id: '3', name: 'Amit M.', status: 'completed', earned: 10, date: '2 weeks ago' },
];

export const ReferralScreen: React.FC<Props> = ({ navigation }) => {
    const referralCode = 'FOODIE2024';
    const totalEarned = 50;
    const pendingEarnings = 10;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Get ₹10 off your first food delivery! Use my code: ${referralCode} | Download: https://app.link/invite/${referralCode}`,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
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
                <Text style={styles.headerTitle}>Refer & Earn</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroEmoji}>🎉</Text>
                    <Text style={styles.heroTitle}>Earn ₹10 for every friend!</Text>
                    <Text style={styles.heroSubtitle}>
                        Share your code with friends and earn rewards when they order
                    </Text>

                    {/* Referral Code */}
                    <View style={styles.codeContainer}>
                        <Text style={styles.codeLabel}>Your referral code</Text>
                        <View style={styles.codeBox}>
                            <Text style={styles.codeText}>{referralCode}</Text>
                            <TouchableOpacity style={styles.copyButton}>
                                <Text style={styles.copyIcon}>📋</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Text style={styles.shareIcon}>📤</Text>
                        <Text style={styles.shareText}>Share with Friends</Text>
                    </TouchableOpacity>
                </View>

                {/* Earnings Card */}
                <View style={styles.earningsCard}>
                    <View style={styles.earningItem}>
                        <Text style={styles.earningValue}>₹{totalEarned}</Text>
                        <Text style={styles.earningLabel}>Total Earned</Text>
                    </View>
                    <View style={styles.earningDivider} />
                    <View style={styles.earningItem}>
                        <Text style={styles.earningValuePending}>₹{pendingEarnings}</Text>
                        <Text style={styles.earningLabel}>Pending</Text>
                    </View>
                </View>

                {/* How It Works */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How It Works</Text>
                    {rewards.map((reward) => (
                        <View key={reward.id} style={styles.rewardItem}>
                            <View style={styles.rewardIcon}>
                                <Text style={styles.rewardEmoji}>{reward.icon}</Text>
                            </View>
                            <View style={styles.rewardInfo}>
                                <Text style={styles.rewardTitle}>{reward.title}</Text>
                                <Text style={styles.rewardDescription}>{reward.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Referral History */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Referrals</Text>
                    {referralHistory.map((referral) => (
                        <View key={referral.id} style={styles.historyItem}>
                            <View style={styles.historyAvatar}>
                                <Text style={styles.avatarText}>
                                    {referral.name.charAt(0)}
                                </Text>
                            </View>
                            <View style={styles.historyInfo}>
                                <Text style={styles.historyName}>{referral.name}</Text>
                                <Text style={styles.historyDate}>{referral.date}</Text>
                            </View>
                            <View style={styles.historyStatus}>
                                {referral.status === 'completed' ? (
                                    <>
                                        <Text style={styles.earnedText}>+₹{referral.earned}</Text>
                                        <Text style={styles.completedText}>Completed</Text>
                                    </>
                                ) : (
                                    <Text style={styles.pendingText}>Pending</Text>
                                )}
                            </View>
                        </View>
                    ))}
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
    heroCard: {
        marginHorizontal: 16,
        padding: 24,
        backgroundColor: '#0A2A2A',
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    heroEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
        marginBottom: 24,
    },
    codeContainer: {
        width: '100%',
        marginBottom: 16,
    },
    codeLabel: {
        fontSize: 12,
        color: '#9E9E9E',
        textAlign: 'center',
        marginBottom: 8,
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#00E5FF',
    },
    codeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00E5FF',
        letterSpacing: 2,
        marginRight: 12,
    },
    copyButton: {
        padding: 4,
    },
    copyIcon: {
        fontSize: 20,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00E5FF',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
    },
    shareIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    shareText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    earningsCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    earningItem: {
        flex: 1,
        alignItems: 'center',
    },
    earningValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00E5FF',
        marginBottom: 4,
    },
    earningValuePending: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFB300',
        marginBottom: 4,
    },
    earningLabel: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    earningDivider: {
        width: 1,
        backgroundColor: '#2A2A2A',
        marginHorizontal: 16,
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
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rewardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rewardEmoji: {
        fontSize: 24,
    },
    rewardInfo: {
        flex: 1,
    },
    rewardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    rewardDescription: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    historyAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    historyInfo: {
        flex: 1,
    },
    historyName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    historyDate: {
        fontSize: 12,
        color: '#6B6B6B',
    },
    historyStatus: {
        alignItems: 'flex-end',
    },
    earnedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00C853',
    },
    completedText: {
        fontSize: 11,
        color: '#00C853',
    },
    pendingText: {
        fontSize: 12,
        color: '#FFB300',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default ReferralScreen;
