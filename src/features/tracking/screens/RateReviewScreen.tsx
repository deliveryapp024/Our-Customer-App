import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

export const RateReviewScreen: React.FC<Props> = ({ navigation, route }) => {
    const orderId = route.params?.orderId || '#8821';
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [tips] = useState([
        { id: '1', emoji: '👍', label: 'Good' },
        { id: '2', emoji: '⚡', label: 'Fast' },
        { id: '3', emoji: '🔥', label: 'Hot' },
        { id: '4', emoji: '📦', label: 'Packed Well' },
    ]);
    const [selectedTips, setSelectedTips] = useState<string[]>([]);

    const toggleTip = (tipId: string) => {
        setSelectedTips((prev) =>
            prev.includes(tipId) ? prev.filter((t) => t !== tipId) : [...prev, tipId],
        );
    };

    const handleSubmit = () => {
        // Submit review - all fields optional
        navigation.goBack();
    };

    const handleSkip = () => {
        // Skip review completely
        navigation.goBack();
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
                <Text style={styles.headerTitle}>Rate Your Order</Text>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Order Card */}
                <View style={styles.orderCard}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100' }}
                        style={styles.orderImage}
                    />
                    <View style={styles.orderInfo}>
                        <Text style={styles.restaurantName}>The Gourmet Kitchen</Text>
                        <Text style={styles.orderDetails}>Order {orderId} • 3 items</Text>
                    </View>
                </View>

                {/* Star Rating */}
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingTitle}>How was your food?</Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                activeOpacity={0.7}>
                                <Text
                                    style={[
                                        styles.star,
                                        star <= rating && styles.starActive,
                                    ]}>
                                    ★
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.ratingLabel}>
                        {rating === 0 && 'Tap to rate'}
                        {rating === 1 && 'Poor'}
                        {rating === 2 && 'Fair'}
                        {rating === 3 && 'Good'}
                        {rating === 4 && 'Very Good'}
                        {rating === 5 && 'Excellent!'}
                    </Text>
                </View>

                {/* Quick Tips */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>Quick tips</Text>
                    <View style={styles.tipsGrid}>
                        {tips.map((tip) => (
                            <TouchableOpacity
                                key={tip.id}
                                style={[
                                    styles.tipButton,
                                    selectedTips.includes(tip.id) && styles.tipButtonSelected,
                                ]}
                                onPress={() => toggleTip(tip.id)}>
                                <Text style={styles.tipEmoji}>{tip.emoji}</Text>
                                <Text
                                    style={[
                                        styles.tipLabel,
                                        selectedTips.includes(tip.id) && styles.tipLabelSelected,
                                    ]}>
                                    {tip.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Review Text */}
                <View style={styles.reviewContainer}>
                    <Text style={styles.reviewTitle}>Write a review (optional)</Text>
                    <TextInput
                        style={styles.reviewInput}
                        placeholder="Tell us about your experience..."
                        placeholderTextColor="#6B6B6B"
                        multiline
                        numberOfLines={4}
                        value={review}
                        onChangeText={setReview}
                        textAlignVertical="top"
                    />
                </View>

                {/* Add Photo */}
                <TouchableOpacity style={styles.addPhotoButton}>
                    <Text style={styles.addPhotoIcon}>📷</Text>
                    <Text style={styles.addPhotoText}>Add Photo or Video</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    activeOpacity={0.8}>
                    <Text style={styles.submitText}>Submit Review</Text>
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
    skipText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    orderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    orderImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    orderInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    orderDetails: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    ratingContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    ratingTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    star: {
        fontSize: 44,
        color: '#2A2A2A',
    },
    starActive: {
        color: '#FFB300',
    },
    ratingLabel: {
        fontSize: 16,
        color: '#9E9E9E',
    },
    tipsContainer: {
        marginBottom: 24,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    tipsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    tipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    tipButtonSelected: {
        borderColor: '#00E5FF',
        backgroundColor: '#0A2A2A',
    },
    tipEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    tipLabel: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    tipLabelSelected: {
        color: '#00E5FF',
    },
    reviewContainer: {
        marginBottom: 16,
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    reviewInput: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
        height: 120,
    },
    addPhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderStyle: 'dashed',
        marginBottom: 100,
    },
    addPhotoIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    addPhotoText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A1A1A',
        padding: 16,
        paddingBottom: 30,
    },
    submitButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});

export default RateReviewScreen;
