import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Modal,
    ActivityIndicator,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS, STORAGE_KEYS, AVATAR_OPTIONS, getAvatarOptionById } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';
import { customerApi } from '../../../api';
import { BackButton } from '../../../components/ui/BackButton';
import { CustomModal } from '../../../components/ui/CustomModal';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [profileImage, setProfileImage] = useState<string | undefined>(user?.profileImage);
    const [profileImageType, setProfileImageType] = useState<'upload' | 'avatar' | undefined>(user?.profileImageType);
    const [profileAvatarId, setProfileAvatarId] = useState<string | undefined>(user?.profileAvatarId);

    const [showActionModal, setShowActionModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const selectedAvatar = useMemo(() => getAvatarOptionById(profileAvatarId), [profileAvatarId]);

    const showError = (message: string) => {
        setErrorMessage(message);
        setErrorModalVisible(true);
    };

    const persistUserLocally = async (nextUser: any) => {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));
    };

    const handlePickPhoto = async () => {
        setShowActionModal(false);

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

        const previousImage = profileImage;
        const previousType = profileImageType;
        const previousAvatarId = profileAvatarId;

        setProfileImage(asset.uri);
        setProfileImageType('upload');
        setProfileAvatarId(undefined);
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
                setProfileImage(previousImage);
                setProfileImageType(previousType);
                setProfileAvatarId(previousAvatarId);
                showError(uploadResponse.error || 'Failed to upload image. Please try again.');
                return;
            }

            setProfileImage(uploadResponse.data.imageUrl);
            setProfileImageType('upload');
            setProfileAvatarId(undefined);
        } catch (error) {
            setProfileImage(previousImage);
            setProfileImageType(previousType);
            setProfileAvatarId(previousAvatarId);
            showError('Failed to upload image. Please check your connection and retry.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSelectAvatar = (avatarId: string) => {
        setProfileAvatarId(avatarId);
        setProfileImageType('avatar');
        setProfileImage(undefined);
        setShowAvatarModal(false);
    };

    const handleRemoveImage = () => {
        setShowActionModal(false);
        setProfileImage(undefined);
        setProfileImageType(undefined);
        setProfileAvatarId(undefined);
    };

    const handleContinue = async () => {
        try {
            setIsSaving(true);

            const payload = {
                name: name.trim() || undefined,
                email: email.trim() || undefined,
                profileImage: profileImage ?? null,
                profileImageType: profileImageType ?? null,
                profileAvatarId: profileAvatarId ?? null,
            };

            const result = await customerApi.updateProfile(payload);

            let latestUser = user;
            if (result.success) {
                const serverUser = (result as any).data?.user;
                if (serverUser) {
                    latestUser = {
                        ...user,
                        id: serverUser._id || user?.id,
                        phone: String(serverUser.phone ?? user?.phone ?? ''),
                        name: serverUser.name,
                        email: serverUser.email,
                        profileImage: serverUser.profileImage,
                        profileImageType: serverUser.profileImageType,
                        profileAvatarId: serverUser.profileAvatarId,
                        createdAt: serverUser.createdAt || user?.createdAt || new Date().toISOString(),
                    };
                }
            }

            if (!latestUser) {
                latestUser = {
                    id: '',
                    phone: '',
                    name: name.trim() || undefined,
                    email: email.trim() || undefined,
                    profileImage,
                    profileImageType,
                    profileAvatarId,
                    createdAt: new Date().toISOString(),
                };
            }

            setUser(latestUser as any);
            await persistUserLocally(latestUser);
            navigation.navigate(SCREENS.DIETARY_PREFERENCES);
        } catch (error) {
            const fallbackUser = {
                ...user,
                name: name.trim() || undefined,
                email: email.trim() || undefined,
                profileImage,
                profileImageType,
                profileAvatarId,
            };
            setUser(fallbackUser as any);
            if (fallbackUser?.id) {
                await persistUserLocally(fallbackUser);
            }
            navigation.navigate(SCREENS.DIETARY_PREFERENCES);
        } finally {
            setIsSaving(false);
        }
    };

    const renderPhotoPreview = () => {
        if (profileImageType === 'upload' && profileImage) {
            return <Image source={{ uri: profileImage }} style={styles.profileImage} />;
        }

        if (profileImageType === 'avatar' && selectedAvatar) {
            return (
                <View style={[styles.avatarPreview, { backgroundColor: selectedAvatar.bgColor }]}>
                    <Text style={styles.avatarPreviewEmoji}>{selectedAvatar.emoji}</Text>
                </View>
            );
        }

        return <Text style={styles.cameraIcon}>??</Text>;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Profile Setup</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.content}>
                <View style={styles.photoContainer}>
                    <View style={styles.photoCircle}>
                        {renderPhotoPreview()}
                        {isUploading && (
                            <View style={styles.uploadOverlay}>
                                <ActivityIndicator color="#00E5FF" />
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.addPhotoButton}
                        activeOpacity={0.8}
                        onPress={() => setShowActionModal(true)}>
                        <Text style={styles.addPhotoIcon}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.photoTitle}>Upload Photo</Text>
                <Text style={styles.photoSubtitle}>Add a face to your profile</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                        style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
                        placeholder="Enter your full name"
                        placeholderTextColor="#6B6B6B"
                        value={name}
                        onChangeText={setName}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                    />

                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                        style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                        placeholder="Enter your email address"
                        placeholderTextColor="#6B6B6B"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, isSaving && styles.buttonDisabled]}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                    disabled={isSaving || isUploading}>
                    {isSaving ? (
                        <ActivityIndicator color="#000000" />
                    ) : (
                        <Text style={styles.continueButtonText}>Complete Profile</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Modal visible={showActionModal} transparent animationType="fade" onRequestClose={() => setShowActionModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActionModal(false)}>
                    <View style={styles.actionSheet}>
                        <TouchableOpacity style={styles.actionItem} onPress={handlePickPhoto}>
                            <Text style={styles.actionItemText}>Upload from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionItem} onPress={() => { setShowActionModal(false); setShowAvatarModal(true); }}>
                            <Text style={styles.actionItemText}>Choose Avatar</Text>
                        </TouchableOpacity>
                        {(profileImage || profileAvatarId) && (
                            <TouchableOpacity style={styles.actionItem} onPress={handleRemoveImage}>
                                <Text style={styles.actionItemDestructive}>Remove</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={showAvatarModal} transparent animationType="slide" onRequestClose={() => setShowAvatarModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.avatarSheet}>
                        <Text style={styles.avatarSheetTitle}>Choose Avatar</Text>
                        <View style={styles.avatarGrid}>
                            {AVATAR_OPTIONS.map((avatar) => (
                                <TouchableOpacity
                                    key={avatar.id}
                                    style={[
                                        styles.avatarOption,
                                        { backgroundColor: avatar.bgColor },
                                        profileAvatarId === avatar.id && styles.avatarOptionSelected,
                                    ]}
                                    onPress={() => handleSelectAvatar(avatar.id)}>
                                    <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.closeAvatarButton} onPress={() => setShowAvatarModal(false)}>
                            <Text style={styles.closeAvatarButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <CustomModal
                visible={errorModalVisible}
                title="Upload Error"
                message={errorMessage}
                icon="?"
                buttons={[{ text: 'OK', style: 'default' }]}
                onClose={() => setErrorModalVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    headerSpacer: {
        width: 48,
        height: 48,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 32,
        alignItems: 'center',
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    photoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    avatarPreview: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPreviewEmoji: {
        fontSize: 52,
    },
    uploadOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        fontSize: 40,
        opacity: 0.5,
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000000',
    },
    addPhotoIcon: {
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold',
    },
    photoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    photoSubtitle: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9E9E9E',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'transparent',
        marginBottom: 20,
    },
    inputFocused: {
        borderColor: '#00E5FF',
        backgroundColor: '#111111',
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    continueButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        width: '100%',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        padding: 16,
    },
    actionSheet: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        overflow: 'hidden',
    },
    actionItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    actionItemText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    actionItemDestructive: {
        color: '#FF5252',
        fontSize: 16,
    },
    avatarSheet: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
    },
    avatarSheetTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    avatarOption: {
        width: '22%',
        aspectRatio: 1,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarOptionSelected: {
        borderColor: '#FFFFFF',
    },
    avatarOptionEmoji: {
        fontSize: 26,
    },
    closeAvatarButton: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    closeAvatarButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});

export default ProfileSetupScreen;
