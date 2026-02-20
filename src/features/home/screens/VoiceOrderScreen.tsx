import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Microphone, PaperPlaneTilt, Waveform } from 'phosphor-react-native';
import { BackButton } from '../../../components/ui/BackButton';
import { voiceApi } from '../../../api';
import { useCartStore } from '../../../store/cartStore';
import { SCREENS } from '../../../constants';
import { trackClientError, trackClientEvent } from '../../../utils/telemetry';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const VoiceOrderScreen: React.FC<Props> = ({ navigation }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [resultText, setResultText] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewItems, setPreviewItems] = useState<any[]>([]);
    const [intentMeta, setIntentMeta] = useState<any>(null);
    const [confirmedAdd, setConfirmedAdd] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const toggleListening = () => {
        // Foundation only: UI toggle for mic state. Native STT integration can be added in next sprint.
        setIsListening((prev) => !prev);
    };

    const submitIntent = async () => {
        const phrase = transcript.trim();
        if (!phrase) return;
        setLoading(true);
        setResultText('');
        setConfirmedAdd(false);
        try {
            const res = await voiceApi.parseVoiceOrderIntent({
                transcript: phrase,
                locale: 'en-IN',
            });
            if (!res.success) {
                setResultText(res.error || 'Voice ordering backend is not available yet.');
                return;
            }
            const payload = res.data;
            setIntentMeta(payload);
            trackClientEvent('voice_intent_parsed', {
                intent: payload.intent,
                confidence: payload.confidence,
                needsClarification: payload.needsClarification,
                provider: payload.activeProvider,
            });

            if (payload.needsClarification) {
                setResultText('Please answer the clarifying questions below before confirming.');
            }

            const preview = await voiceApi.previewVoiceOrderIntent({
                intent: payload.intent,
                entities: payload.entities || {},
            });
            if (!preview.success) {
                setResultText(preview.error || 'Could not map items to menu.');
                return;
            }

            const foundCount = (preview.data?.items || []).filter((it) => it.found).length;
            setPreviewItems(preview.data?.items || []);
            setResultText(`Intent: ${payload.intent}\n${payload.message || ''}\nMatched items: ${foundCount}`);
        } catch (error) {
            trackClientError('voice_intent_error', {
                message: error instanceof Error ? error.message : 'Unknown voice error',
            });
            setResultText('Could not process this request right now.');
        } finally {
            setLoading(false);
        }
    };

    const addPreviewToCart = async () => {
        if (!previewItems.length) {
            Alert.alert('No Items', 'No mapped items are available to add.');
            return;
        }
        if (!confirmedAdd) {
            Alert.alert('Confirm First', 'Please confirm the preview before adding items to cart.');
            return;
        }

        const confirm = await voiceApi.confirmVoiceOrderIntent({ previewItems });
        if (!confirm.success) {
            Alert.alert('Error', confirm.error || 'Unable to confirm this voice order.');
            return;
        }

        const draft = confirm.data?.cartDraft || [];
        const firstBranchId = draft.find((d) => d.branchId)?.branchId;
        if (!firstBranchId) {
            Alert.alert('Not Ready', 'Could not resolve a branch for these items.');
            return;
        }

        for (const line of draft) {
            if (!line.branchId || line.branchId !== firstBranchId) continue;
            addItem(firstBranchId, 'Voice Order', {
                id: line.productId,
                name: line.name,
                description: '',
                price: line.unitPrice,
                image: line.image || '',
                category: 'Voice',
                isVeg: true,
                isBestseller: false,
                isAvailable: true,
            });
            for (let i = 1; i < Math.max(1, line.quantity); i += 1) {
                addItem(firstBranchId, 'Voice Order', {
                    id: line.productId,
                    name: line.name,
                    description: '',
                    price: line.unitPrice,
                    image: line.image || '',
                    category: 'Voice',
                    isVeg: true,
                    isBestseller: false,
                    isAvailable: true,
                });
            }
        }

        Alert.alert('Added to Cart', 'Voice-selected items were added to cart.');
        trackClientEvent('voice_intent_confirmed_to_cart', {
            itemCount: draft.length,
            branchId: firstBranchId,
        });
        navigation.navigate(SCREENS.CHECKOUT, { branchId: firstBranchId });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Voice Order (Beta)</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <Waveform size={28} color="#00E5FF" weight="bold" />
                    <Text style={styles.heroTitle}>Talk to order faster</Text>
                    <Text style={styles.heroSub}>
                        Example: "Order 1 butter chicken and 2 naan from the nearest branch."
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.micBtn, isListening && styles.micBtnActive]}
                    onPress={toggleListening}>
                    <Microphone size={24} color={isListening ? '#000000' : '#00E5FF'} weight="fill" />
                    <Text style={[styles.micTxt, isListening && styles.micTxtActive]}>
                        {isListening ? 'Listening...' : 'Tap Mic'}
                    </Text>
                </TouchableOpacity>

                <TextInput
                    value={transcript}
                    onChangeText={setTranscript}
                    placeholder="Or type what you want to order..."
                    placeholderTextColor="#6B6B6B"
                    style={styles.input}
                    multiline
                />

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.submitBtn}
                    disabled={loading}
                    onPress={submitIntent}>
                    {loading ? <ActivityIndicator color="#000000" /> : <PaperPlaneTilt size={18} color="#000000" weight="fill" />}
                    <Text style={styles.submitTxt}>Process Voice Intent</Text>
                </TouchableOpacity>

                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>Result</Text>
                    <Text style={styles.resultBody}>{resultText || 'No request sent yet.'}</Text>
                </View>

                {intentMeta && (
                    <View style={styles.intentMetaCard}>
                        <Text style={styles.intentMetaTitle}>Intent Confidence</Text>
                        <Text style={styles.intentMetaValue}>
                            {Math.round(Number(intentMeta?.confidence || 0) * 100)}% ({intentMeta?.intent || 'unknown'})
                        </Text>
                        {Array.isArray(intentMeta?.clarificationQuestions) && intentMeta.clarificationQuestions.length > 0 && (
                            <View style={styles.questionList}>
                                {intentMeta.clarificationQuestions.map((q: string, idx: number) => (
                                    <Text key={`${q}_${idx}`} style={styles.questionText}>- {q}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {previewItems.length > 0 && (
                    <View style={styles.previewListCard}>
                        <Text style={styles.resultTitle}>Preview</Text>
                        {previewItems.map((item, idx) => (
                            <View key={`${item?.requestedName || idx}_${idx}`} style={styles.previewRow}>
                                <Text style={styles.previewTitle}>
                                    {item?.requestedName || 'Requested item'} - {item?.found ? 'Matched' : 'Not found'}
                                </Text>
                                {!!item?.explanation && <Text style={styles.previewSub}>{item.explanation}</Text>}
                                {item?.matchScore !== undefined && (
                                    <Text style={styles.previewSub}>Match score: {Math.round(Number(item.matchScore) * 100)}%</Text>
                                )}
                            </View>
                        ))}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={[styles.confirmButton, confirmedAdd && styles.confirmButtonActive]}
                            onPress={() => setConfirmedAdd((v) => !v)}>
                            <Text style={[styles.confirmButtonText, confirmedAdd && styles.confirmButtonTextActive]}>
                                {confirmedAdd ? 'Confirmed' : 'Tap to confirm preview'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {previewItems.length > 0 && (
                    <TouchableOpacity activeOpacity={0.85} style={styles.submitBtn} onPress={addPreviewToCart}>
                        <Text style={styles.submitTxt}>Add Matched Items To Cart</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    headerTitle: { flex: 1, textAlign: 'center', color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    headerSpacer: { width: 48, height: 48 },
    content: { padding: 16, gap: 14, paddingBottom: 30 },
    heroCard: {
        backgroundColor: '#111111',
        borderColor: '#00E5FF33',
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        gap: 8,
    },
    heroTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    heroSub: { color: '#9E9E9E', fontSize: 13, lineHeight: 18 },
    micBtn: {
        height: 52,
        borderRadius: 26,
        borderColor: '#00E5FF',
        borderWidth: 1,
        backgroundColor: '#001318',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    micBtnActive: { backgroundColor: '#00E5FF' },
    micTxt: { color: '#00E5FF', fontWeight: '700' },
    micTxtActive: { color: '#000000' },
    input: {
        minHeight: 100,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 10,
        textAlignVertical: 'top',
    },
    submitBtn: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#00E5FF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    submitTxt: { color: '#000000', fontSize: 14, fontWeight: '700' },
    resultCard: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
        padding: 12,
        minHeight: 100,
    },
    resultTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 6 },
    resultBody: { color: '#BFBFBF', fontSize: 13, lineHeight: 18 },
    intentMetaCard: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
        padding: 12,
        gap: 6,
    },
    intentMetaTitle: { color: '#9E9E9E', fontSize: 12, fontWeight: '700' },
    intentMetaValue: { color: '#00E5FF', fontSize: 15, fontWeight: '800' },
    questionList: { gap: 4, marginTop: 4 },
    questionText: { color: '#FFFFFF', fontSize: 12 },
    previewListCard: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        backgroundColor: '#111111',
        padding: 12,
        gap: 8,
    },
    previewRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#1F1F1F',
        paddingBottom: 8,
    },
    previewTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
    previewSub: { color: '#9E9E9E', fontSize: 12, marginTop: 2 },
    confirmButton: {
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00E5FF',
        backgroundColor: '#001318',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonActive: {
        backgroundColor: '#00E5FF',
    },
    confirmButtonText: { color: '#00E5FF', fontSize: 13, fontWeight: '700' },
    confirmButtonTextActive: { color: '#000000' },
});
