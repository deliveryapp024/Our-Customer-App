import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../../../components/ui/BackButton';

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const TrainDeliveryScreen: React.FC<Props> = ({ navigation }) => {
    const [pnr, setPnr] = useState('');
    const [trainInfo, setTrainInfo] = useState<any>(null);

    const handleSearch = () => {
        setTrainInfo({
            trainNumber: '12345',
            trainName: 'Rajdhani Express',
            station: 'New Delhi (NDLS)',
            arrivalTime: '14:30',
            coach: 'B2',
            seat: '45',
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Food on Train</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <Text style={styles.heroEmoji}></Text>
                    <Text style={styles.heroTitle}>Order Food to Your Seat</Text>
                    <Text style={styles.heroSubtitle}>Enter your PNR to get food delivered on your train</Text>
                </View>

                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Enter PNR Number</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.pnrInput}
                            placeholder="10 digit PNR"
                            placeholderTextColor="#6B6B6B"
                            value={pnr}
                            onChangeText={setPnr}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Text style={styles.searchText}>FIND</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {trainInfo && (
                    <View style={styles.trainCard}>
                        <View style={styles.trainHeader}>
                            <Text style={styles.trainNumber}>{trainInfo.trainNumber}</Text>
                            <Text style={styles.trainName}>{trainInfo.trainName}</Text>
                        </View>
                        <View style={styles.trainDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailIcon}></Text>
                                <Text style={styles.detailLabel}>Next Station</Text>
                                <Text style={styles.detailValue}>{trainInfo.station}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailIcon}></Text>
                                <Text style={styles.detailLabel}>Arrival</Text>
                                <Text style={styles.detailValue}>{trainInfo.arrivalTime}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailIcon}></Text>
                                <Text style={styles.detailLabel}>Seat</Text>
                                <Text style={styles.detailValue}>{trainInfo.coach}-{trainInfo.seat}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.orderButton}>
                            <Text style={styles.orderButtonText}>VIEW RESTAURANTS</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>How it works</Text>
                    <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>Enter your PNR number</Text></View>
                    <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepText}>Select from nearby restaurants</Text></View>
                    <View style={styles.step}><Text style={styles.stepNumber}>3</Text><Text style={styles.stepText}>Food delivered to your seat!</Text></View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    placeholder: { width: 40 },
    heroCard: { marginHorizontal: 16, padding: 32, backgroundColor: '#1A1A1A', borderRadius: 24, alignItems: 'center', marginBottom: 24 },
    heroEmoji: { fontSize: 56, marginBottom: 16 },
    heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
    heroSubtitle: { fontSize: 14, color: '#9E9E9E', textAlign: 'center' },
    inputSection: { paddingHorizontal: 16, marginBottom: 24 },
    inputLabel: { fontSize: 14, color: '#FFFFFF', marginBottom: 12 },
    inputRow: { flexDirection: 'row', gap: 12 },
    pnrInput: { flex: 1, backgroundColor: '#1A1A1A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: '#FFFFFF', letterSpacing: 2 },
    searchButton: { backgroundColor: '#00E5FF', paddingHorizontal: 24, borderRadius: 12, justifyContent: 'center' },
    searchText: { fontSize: 14, fontWeight: 'bold', color: '#000000' },
    trainCard: { marginHorizontal: 16, backgroundColor: '#0A2A2A', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#00E5FF33' },
    trainHeader: { marginBottom: 16 },
    trainNumber: { fontSize: 12, color: '#00E5FF', marginBottom: 4 },
    trainName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    trainDetails: { marginBottom: 16 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    detailIcon: { fontSize: 16, marginRight: 12 },
    detailLabel: { flex: 1, fontSize: 14, color: '#9E9E9E' },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    orderButton: { backgroundColor: '#00E5FF', paddingVertical: 14, borderRadius: 25, alignItems: 'center' },
    orderButtonText: { fontSize: 14, fontWeight: 'bold', color: '#000000' },
    infoSection: { paddingHorizontal: 16, marginBottom: 40 },
    infoTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
    step: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#00E5FF', justifyContent: 'center', alignItems: 'center', textAlign: 'center', lineHeight: 28, fontSize: 14, fontWeight: 'bold', color: '#000000', marginRight: 12 },
    stepText: { fontSize: 14, color: '#9E9E9E' },
});

export default TrainDeliveryScreen;
