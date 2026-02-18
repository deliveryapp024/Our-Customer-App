import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
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

interface AICombo {
    id: string;
    title: string;
    description: string;
    items: string[];
    originalPrice: number;
    comboPrice: number;
    savings: number;
    image: string;
    tag: string;
}

// Images from smart_ai_combo_suggestions_1 design
const aiCombos: AICombo[] = [
    {
        id: '1',
        title: 'Perfect Lunch Combo',
        description: 'Based on your preferences for Italian cuisine',
        items: ['Margherita Pizza', 'Garlic Bread', 'Coke 500ml'],
        originalPrice: 28.99,
        comboPrice: 19.99,
        savings: 9.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2k8VWoV8IOtqcEmrnLQaCMyMeZcx5FtM4I8byQwGrmYggiFUHfhvrmpeSO6suqdaTQvWLPXZ_oMLZWxsSnzwMgbedJx4j0cohvGhhKj2LplsywIRgzYiOzD2ZpkL1VfcGPIWSaZ5Ouu9l4oaS6FjSAUGecBX4lb6yY87wAz4mO2MrTwUVfFY9OfkRkIN3Z-B9sR21uj8d2RxhPj4tQSrInNV1n5e874YZc4R-nCZggQc0W3mkM8OUrmsbkdIobGqdNgY6i9YVQuX',
        tag: 'Most Popular',
    },
    {
        id: '2',
        title: 'Healthy Power Bowl',
        description: 'Matches your dietary preferences',
        items: ['Quinoa Salad', 'Grilled Chicken', 'Green Smoothie'],
        originalPrice: 32.00,
        comboPrice: 24.99,
        savings: 7.01,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU4LYjttnH_lTRQWzUEobtvtmXEnItTMyyyk7CYDqIHS5zyssqd3E6C_8rryfnirE-o87g3uzp8IWVQ9wPTTPhSDIkXIl8ILQLgnlixUAyiPwdF3DHXBuGPvvoeGjtbt66f3KWEFkH2AWFXkbnjfMIQmSCfovQ5KVa39-VSZj5QtPyfhpiZktLFmNJZWz8eO3UNGrc_WoDHu0u1cOqu_gm5HPSbLUBSHHvkW8NUOHzxCkQfDIoTAxR7IrZ6n5hxJYe6nUgd1hueINZ',
        tag: 'Health Pick',
    },
    {
        id: '3',
        title: 'Weekend Treat',
        description: 'Perfect for your cheat day!',
        items: ['Double Cheese Burger', 'Large Fries', 'Milkshake'],
        originalPrice: 26.99,
        comboPrice: 18.99,
        savings: 8.00,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy7RwX66CgZaIjdDdXZ51sfPYMg5H944LEwdZXUDSd_852JZJ50HVVM63GYJq80iYMuVm70JAN4RETyBI5Re4DAWem3saqtEpPmRgcYPMEdUjDtRRv6x3IRtP_a0cQqjnbtLwAV6qtgnRTIw7tsoHgbX4dulZYfh9hNLhoYx8g9cjVaINnykU7tRbYzv7aqa7-L1EFDQajaoESpWfqMKsC6t6S9o1V2IKho0EOZVAtq39ZjIISnxZiLGGd4Byl6yPiG_ih8xfp6zJ_',
        tag: 'Value Deal',
    },
];

export const AIComboScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <View style={styles.headerCenter}>
                    <Text style={styles.aiIcon}></Text>
                    <Text style={styles.headerTitle}>AI Smart Combos</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            {/* AI Banner */}
            <View style={styles.aiBanner}>
                <Text style={styles.bannerIcon}></Text>
                <Text style={styles.bannerText}>
                    Personalized combos crafted by AI based on your taste
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* How It Works */}
                <View style={styles.howItWorks}>
                    <Text style={styles.howTitle}>How AI Combos Work</Text>
                    <View style={styles.stepsRow}>
                        <View style={styles.step}>
                            <View style={styles.stepIcon}>
                                <Text style={styles.stepEmoji}></Text>
                            </View>
                            <Text style={styles.stepText}>We analyze{'\n'}your orders</Text>
                        </View>
                        <View style={styles.stepArrow}>
                            <Text style={styles.arrowText}></Text>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepIcon}>
                                <Text style={styles.stepEmoji}></Text>
                            </View>
                            <Text style={styles.stepText}>AI finds{'\n'}best combos</Text>
                        </View>
                        <View style={styles.stepArrow}>
                            <Text style={styles.arrowText}></Text>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepIcon}>
                                <Text style={styles.stepEmoji}></Text>
                            </View>
                            <Text style={styles.stepText}>You save{'\n'}money!</Text>
                        </View>
                    </View>
                </View>

                {/* AI Combos */}
                <Text style={styles.sectionTitle}>Recommended for You</Text>

                {aiCombos.map((combo) => (
                    <View key={combo.id} style={styles.comboCard}>
                        <Image
                            source={{ uri: combo.image }}
                            style={styles.comboImage}
                            resizeMode="cover"
                        />
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>{combo.tag}</Text>
                        </View>
                        <View style={styles.comboContent}>
                            <Text style={styles.comboTitle}>{combo.title}</Text>
                            <Text style={styles.comboDescription}>{combo.description}</Text>

                            {/* Items List */}
                            <View style={styles.itemsList}>
                                {combo.items.map((item, index) => (
                                    <View key={index} style={styles.itemRow}>
                                        <Text style={styles.itemBullet}></Text>
                                        <Text style={styles.itemName}>{item}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Price Row */}
                            <View style={styles.priceRow}>
                                <View style={styles.priceInfo}>
                                    <Text style={styles.comboPrice}>{combo.comboPrice.toFixed(2)}</Text>
                                    <Text style={styles.originalPrice}>{combo.originalPrice.toFixed(2)}</Text>
                                </View>
                                <View style={styles.savingsBadge}>
                                    <Text style={styles.savingsText}>Save {combo.savings.toFixed(2)}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.addButton}>
                                <Text style={styles.addButtonText}>ADD COMBO</Text>
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
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    aiBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6B4EFF',
        paddingVertical: 10,
        marginBottom: 16,
    },
    bannerIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    bannerText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    howItWorks: {
        marginHorizontal: 16,
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        marginBottom: 24,
    },
    howTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    stepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    step: {
        alignItems: 'center',
        flex: 1,
    },
    stepIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6B4EFF33',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepEmoji: {
        fontSize: 20,
    },
    stepText: {
        fontSize: 11,
        color: '#9E9E9E',
        textAlign: 'center',
    },
    stepArrow: {
        paddingHorizontal: 4,
    },
    arrowText: {
        fontSize: 16,
        color: '#6B4EFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    comboCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        overflow: 'hidden',
    },
    comboImage: {
        width: '100%',
        height: 140,
    },
    tagBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#6B4EFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    comboContent: {
        padding: 16,
    },
    comboTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    comboDescription: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 12,
    },
    itemsList: {
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemBullet: {
        fontSize: 12,
        color: '#6B4EFF',
        marginRight: 8,
    },
    itemName: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    priceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    comboPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00E5FF',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 16,
        color: '#6B6B6B',
        textDecorationLine: 'line-through',
    },
    savingsBadge: {
        backgroundColor: '#00C85333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    savingsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00C853',
    },
    addButton: {
        backgroundColor: '#6B4EFF',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default AIComboScreen;
