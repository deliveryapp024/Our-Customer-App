import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const MOCK_PARTNER = {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    vehicle: 'Bike',
    vehicleNumber: 'DL 3S AB 1234',
};

export const LiveMapScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [eta, setEta] = useState(8);
    const currentStep = 2;

    useEffect(() => {
        const interval = setInterval(() => {
            if (eta > 1) setEta((prev) => prev - 1);
        }, 60000);
        return () => clearInterval(interval);
    }, [eta]);

    const trackingSteps = [
        { id: 1, title: 'Order Confirmed', time: '12:30 PM', completed: true },
        { id: 2, title: 'Preparing', time: '12:35 PM', completed: true },
        { id: 3, title: 'On the Way', time: '12:50 PM', completed: currentStep >= 3 },
        { id: 4, title: 'Delivered', time: '--:--', completed: false },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Live Tracking</Text>
                <TouchableOpacity style={styles.sosButton}>
                    <Text style={styles.sosText}>SOS</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                    <View style={[styles.marker, { top: 40, left: 60, backgroundColor: '#FF5722' }]}>
                        <Text>🍕</Text>
                    </View>
                    <View style={[styles.marker, { top: 100, left: 140, backgroundColor: '#00E5FF' }]}>
                        <Text>🛵</Text>
                    </View>
                    <View style={[styles.marker, { top: 160, right: 60, backgroundColor: '#00C853' }]}>
                        <Text>🏠</Text>
                    </View>
                </View>
                <View style={styles.etaOverlay}>
                    <Text style={styles.etaLabel}>Arriving in</Text>
                    <Text style={styles.etaTime}>{eta} mins</Text>
                </View>
            </View>

            <View style={styles.partnerCard}>
                <Image source={{ uri: MOCK_PARTNER.image }} style={styles.partnerImage} />
                <View style={styles.partnerDetails}>
                    <Text style={styles.partnerName}>{MOCK_PARTNER.name}</Text>
                    <Text style={styles.vehicleText}>★ {MOCK_PARTNER.rating} • {MOCK_PARTNER.vehicleNumber}</Text>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL(`tel:${MOCK_PARTNER.phone}`)}>
                    <Text>📞</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.timeline}>
                {trackingSteps.map((step, i) => (
                    <View key={step.id} style={styles.timelineItem}>
                        <View style={[styles.dot, step.completed && styles.dotCompleted]} />
                        {i < 3 && <View style={[styles.line, step.completed && styles.lineCompleted]} />}
                        <Text style={[styles.stepTitle, step.completed && styles.stepTitleCompleted]}>{step.title}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('OrderDetails')}>
                <Text style={styles.detailsText}>View Order Details →</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    backIcon: { color: '#FFF', fontSize: 24 },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    sosButton: { backgroundColor: '#FF5252', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    sosText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    mapContainer: { height: height * 0.35, marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
    mapPlaceholder: { flex: 1, backgroundColor: '#1A1A1A', position: 'relative' },
    marker: { position: 'absolute', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    etaOverlay: { position: 'absolute', top: 16, right: 16, backgroundColor: '#00E5FF', padding: 12, borderRadius: 12, alignItems: 'center' },
    etaLabel: { color: '#000', fontSize: 11 },
    etaTime: { color: '#000', fontSize: 18, fontWeight: '800' },
    partnerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', marginHorizontal: 16, padding: 16, borderRadius: 12, marginBottom: 16 },
    partnerImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    partnerDetails: { flex: 1 },
    partnerName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    vehicleText: { color: '#9E9E9E', fontSize: 13 },
    callButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00C853', alignItems: 'center', justifyContent: 'center' },
    timeline: { backgroundColor: '#1A1A1A', marginHorizontal: 16, padding: 16, borderRadius: 12, marginBottom: 16 },
    timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#333', marginRight: 12 },
    dotCompleted: { backgroundColor: '#00C853' },
    line: { position: 'absolute', left: 9, top: 20, width: 2, height: 20, backgroundColor: '#333' },
    lineCompleted: { backgroundColor: '#00C853' },
    stepTitle: { color: '#9E9E9E', fontSize: 14 },
    stepTitleCompleted: { color: '#FFF' },
    detailsButton: { backgroundColor: '#1A1A1A', marginHorizontal: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
    detailsText: { color: '#00E5FF', fontSize: 15, fontWeight: '600' },
});

export default LiveMapScreen;
