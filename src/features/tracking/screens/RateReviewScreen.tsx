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
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { BackButton } from '../../../components/ui/BackButton';
import { customerApi } from '../../../api';
import { CustomModal } from '../../../components/ui/CustomModal';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

export const RateReviewScreen: React.FC<Props> = ({ navigation, route }) => {
    const orderId = route.params?.orderId || '#8821';
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [tips] = useState([
        { id: '1', emoji: '??', label: 'Good' },
        { id: '2', emoji: '?', label: 'Fast' },
        { id: '3', emoji: '??', label: 'Hot' },
        { id: '4', emoji: '??', label: 'Packed Well' },
    ]);
    const [selectedTips, setSelectedTips] = useState<string[]>([]);
    const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const toggleTip = (tipId: string) => {
        setSelectedTips((prev) =>
            prev.includes(tipId) ? prev.filter((t) => t !== tipId) : [...prev, tipId],
        );
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setErrorModalVisible(true);
    };

    const handleUploadPhoto = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 1,
        });

        if (result.didCancel || !result.assets?.length) {
            return;
        }

        const asset = result.assets[0];
        if (!asset.uri || !asset.type || !asset.fileName) {
            showError('Could not read selected image. Please try another photo.');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: asset.uri,
                type: asset.type,
                name: asset.fileName,
            } as any);

            const uploadResponse = await customerApi.uploadProfileImage(formData);
            if (!uploadResponse.success) {
                showError(uploadResponse.error || 'Failed to upload image. Please try again.');
                return;
            }

            setUploadedMediaUrl(uploadResponse.data.imageUrl);
        } catch {
            showError('Failed to upload image. Please check your connection and retry.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = () => {
        navigation.goBack();
    };

    const handleSkip = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Rate Your Order</Text>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.orderCard}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMd4hcbYRiik7yUchVf4T6ukX0uuAgveYEpJ1GXiCRv2bEd8vUWg-PnALtRkZfb-mOJIR59TSigydxDcGVC4ZKz3q0OgyzXWImb7dzlt3KO2Wzw1qdeEyPLL3Ig9Yn3cLaaxUHSaDaK1q-mg24bW_KKeI2AOxm9J9BMWJYfCYwdYDgDnHIYMiBueRRBYBI5IqUMqf1_h3UMCE87kuDJLVy2MNc4wFO_7DGbCSqldxpG7Bj0aFV4caHNZsLVvRD-R1n4BxkMHyxbhjk' }}
                        style={styles.orderImage}
                    />
                    <View style={styles.orderInfo}>
                        <Text style={styles.restaurantName}>The Gourmet Kitchen</Text>
                        <Text style={styles.orderDetails}>Order {orderId} • 3 items</Text>
                    </View>
                </View>

                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingTitle}>How was your food?</Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                activeOpacity={0.7}>
                                <Text style={[styles.star, star <= rating && styles.starActive]}>?</Text>
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

                <TouchableOpacity style={styles.addPhotoButton} onPress={handleUploadPhoto} disabled={isUploading}>
                    {isUploading ? (
                        <>
                            <ActivityIndicator color="#00E5FF" />
                            <Text style={styles.addPhotoText}> Uploading photo...</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.addPhotoIcon}>??</Text>
                            <Text style={styles.addPhotoText}>{uploadedMediaUrl ? 'Replace Photo' : 'Add Photo'}</Text>
                        </>
                    )}
                </TouchableOpacity>

                {uploadedMediaUrl && (
                    <View style={styles.uploadedPreviewContainer}>
                        <Image source={{ uri: uploadedMediaUrl }} style={styles.uploadedPreviewImage} />
                        <TouchableOpacity onPress={() => setUploadedMediaUrl(null)} style={styles.removePhotoButton}>
                            <Text style={styles.removePhotoText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    activeOpacity={0.8}>
                    <Text style={styles.submitText}>Submit Review</Text>
                </TouchableOpacity>
            </View>

            <CustomModal
                visible={errorModalVisible}
                title="Upload Error"
                message={errorMessage}
                icon="?"
                buttons={[{ text: 'OK', style: 'default' }]}
                onClose={() => setErrorModalVisible(false)}
            />
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
        marginBottom: 24,
    },
    addPhotoIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    addPhotoText: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    uploadedPreviewContainer: {
        marginBottom: 100,
    },
    uploadedPreviewImage: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 10,
    },
    removePhotoButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    removePhotoText: {
        color: '#FF5252',
        fontSize: 13,
        fontWeight: '600',
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
