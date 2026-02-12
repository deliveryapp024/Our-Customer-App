import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

const { width } = Dimensions.get('window');

export interface ModalButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface CustomModalProps {
    visible: boolean;
    title: string;
    message: string;
    buttons?: ModalButton[];
    onClose?: () => void;
    icon?: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    title,
    message,
    buttons = [{ text: 'OK', style: 'default' }],
    onClose,
    icon,
}) => {
    const handleButtonPress = (button: ModalButton) => {
        button.onPress?.();
        onClose?.();
    };

    const getButtonStyle = (style?: string) => {
        switch (style) {
            case 'destructive':
                return styles.destructiveButton;
            case 'cancel':
                return styles.cancelButton;
            default:
                return styles.defaultButton;
        }
    };

    const getButtonTextStyle = (style?: string) => {
        switch (style) {
            case 'destructive':
                return styles.destructiveButtonText;
            case 'cancel':
                return styles.cancelButtonText;
            default:
                return styles.defaultButtonText;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            {/* Icon */}
                            {icon && (
                                <View style={styles.iconContainer}>
                                    <Text style={styles.icon}>{icon}</Text>
                                </View>
                            )}

                            {/* Title */}
                            <Text style={styles.title}>{title}</Text>

                            {/* Message */}
                            <Text style={styles.message}>{message}</Text>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {buttons.map((button, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && <View style={styles.buttonDivider} />}
                                        <TouchableOpacity
                                            style={[styles.button, getButtonStyle(button.style)]}
                                            onPress={() => handleButtonPress(button)}
                                            activeOpacity={0.7}>
                                            <Text style={[styles.buttonText, getButtonTextStyle(button.style)]}>
                                                {button.text}
                                            </Text>
                                        </TouchableOpacity>
                                    </React.Fragment>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    container: {
        width: width - 48,
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        paddingTop: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        fontSize: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    message: {
        fontSize: 15,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A',
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDivider: {
        width: 1,
        backgroundColor: '#2A2A2A',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    defaultButton: {
        // Default styling
    },
    defaultButtonText: {
        color: '#00E5FF',
    },
    cancelButton: {
        // Cancel styling
    },
    cancelButtonText: {
        color: '#9E9E9E',
    },
    destructiveButton: {
        // Destructive styling
    },
    destructiveButtonText: {
        color: '#FF5252',
    },
});

// Hook for easy usage
export const useCustomModal = () => {
    const [modalState, setModalState] = React.useState<{
        visible: boolean;
        title: string;
        message: string;
        buttons?: ModalButton[];
        icon?: string;
    }>({
        visible: false,
        title: '',
        message: '',
    });

    const showModal = (params: Omit<typeof modalState, 'visible'>) => {
        setModalState({ ...params, visible: true });
    };

    const hideModal = () => {
        setModalState((prev) => ({ ...prev, visible: false }));
    };

    const ModalComponent = (
        <CustomModal
            visible={modalState.visible}
            title={modalState.title}
            message={modalState.message}
            buttons={modalState.buttons}
            icon={modalState.icon}
            onClose={hideModal}
        />
    );

    return { showModal, hideModal, ModalComponent };
};

export default CustomModal;
