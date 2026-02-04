import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface HelpCategory {
    id: string;
    icon: string;
    title: string;
    items: string[];
}

const helpCategories: HelpCategory[] = [
    {
        id: '1',
        icon: '📦',
        title: 'Order Issues',
        items: ['Missing items', 'Wrong order', 'Late delivery', 'Food quality'],
    },
    {
        id: '2',
        icon: '💳',
        title: 'Payment & Refunds',
        items: ['Payment failed', 'Request refund', 'Double charged', 'Promo not applied'],
    },
    {
        id: '3',
        icon: '👤',
        title: 'Account & Profile',
        items: ['Update profile', 'Change number', 'Delete account', 'Login issues'],
    },
    {
        id: '4',
        icon: '🚗',
        title: 'Delivery Partner',
        items: ['Rude behavior', 'Wrong delivery', 'Safety concern', 'Tip issue'],
    },
];

const faqs = [
    { id: '1', question: 'How do I track my order?', answer: 'Go to Orders tab and tap on the active order.' },
    { id: '2', question: 'How long does refund take?', answer: 'Refunds are processed within 5-7 business days.' },
    { id: '3', question: 'Can I cancel my order?', answer: 'Yes, before the restaurant starts preparing.' },
];

export const HelpSupportScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

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
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for help..."
                        placeholderTextColor="#6B6B6B"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickAction}>
                        <Text style={styles.quickActionIcon}>💬</Text>
                        <Text style={styles.quickActionText}>Chat with us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <Text style={styles.quickActionIcon}>📞</Text>
                        <Text style={styles.quickActionText}>Call support</Text>
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <Text style={styles.sectionTitle}>Help Topics</Text>
                {helpCategories.map((category) => (
                    <View key={category.id}>
                        <TouchableOpacity
                            style={styles.categoryHeader}
                            onPress={() =>
                                setExpandedCategory(
                                    expandedCategory === category.id ? null : category.id,
                                )
                            }>
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <Text style={styles.expandIcon}>
                                {expandedCategory === category.id ? '−' : '+'}
                            </Text>
                        </TouchableOpacity>
                        {expandedCategory === category.id && (
                            <View style={styles.categoryItems}>
                                {category.items.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.categoryItem}>
                                        <Text style={styles.categoryItemText}>{item}</Text>
                                        <Text style={styles.itemArrow}>→</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                {/* FAQs */}
                <Text style={styles.sectionTitle}>Frequently Asked</Text>
                {faqs.map((faq) => (
                    <View key={faq.id}>
                        <TouchableOpacity
                            style={styles.faqHeader}
                            onPress={() =>
                                setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                            }>
                            <Text style={styles.faqQuestion}>{faq.question}</Text>
                            <Text style={styles.expandIcon}>
                                {expandedFaq === faq.id ? '−' : '+'}
                            </Text>
                        </TouchableOpacity>
                        {expandedFaq === faq.id && (
                            <View style={styles.faqAnswer}>
                                <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                            </View>
                        )}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 14,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    quickAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00E5FF',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    quickActionIcon: {
        fontSize: 18,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
    },
    categoryIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    categoryTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    expandIcon: {
        fontSize: 20,
        color: '#00E5FF',
    },
    categoryItems: {
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        overflow: 'hidden',
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    categoryItemText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    itemArrow: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 16,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
    },
    faqAnswer: {
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#0A2A2A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    faqAnswerText: {
        fontSize: 14,
        color: '#9E9E9E',
        lineHeight: 22,
    },
    bottomSpacing: {
        height: 40,
    },
});

export default HelpSupportScreen;
