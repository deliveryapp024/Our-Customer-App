import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../../../components/ui/BackButton';

type Props = { navigation: NativeStackNavigationProp<any> };

const timeSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM'];
const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export const TableReservationScreen: React.FC<Props> = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState('Today');
    const [selectedTime, setSelectedTime] = useState('7:30 PM');
    const [selectedGuests, setSelectedGuests] = useState(2);

    const dates = ['Today', 'Tomorrow', 'Feb 6', 'Feb 7', 'Feb 8'];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Book a Table</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.restaurantCard}>
                    // Image from table_reservation_details design
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi22JSUpIZp9S12iuATknD-tmEEZIPnsutkYxZfCkG0JZX4i5eEtNl4VWpCaDEMS7BnPRGnodl8Wn2CXdqyNGps51vv9fyynNBwQ0nc8KlCDw4s2HpfMINwIh8YFr_isEiQdhewzgMR6GpeG3SF0ZEcdImW2aMPs4p2zsJkwM-UhNhY5UJlT-UzJ4X8nh946SR_nI4RUfaLRfGpH4zaPVgwJnelKNbLsVg1BH3CdW-ckWxOoPwgYbL70Uclx-Fr5Y3eBb-ErV5bFwQ' }} style={styles.restaurantImage} />
                    <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>The Gourmet Kitchen</Text>
                        <Text style={styles.restaurantMeta}>Continental, Italian  Camp Area</Text>
                        <View style={styles.ratingRow}><Text style={styles.ratingStar}></Text><Text style={styles.ratingText}>4.8 (2.4K reviews)</Text></View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {dates.map((date) => (
                            <TouchableOpacity key={date} style={[styles.dateChip, selectedDate === date && styles.dateChipSelected]} onPress={() => setSelectedDate(date)}>
                                <Text style={[styles.dateText, selectedDate === date && styles.dateTextSelected]}>{date}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Number of Guests</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {guestOptions.map((num) => (
                            <TouchableOpacity key={num} style={[styles.guestChip, selectedGuests === num && styles.guestChipSelected]} onPress={() => setSelectedGuests(num)}>
                                <Text style={[styles.guestText, selectedGuests === num && styles.guestTextSelected]}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Time Slots</Text>
                    <View style={styles.timeSlotsGrid}>
                        {timeSlots.map((time) => (
                            <TouchableOpacity key={time} style={[styles.timeSlot, selectedTime === time && styles.timeSlotSelected]} onPress={() => setSelectedTime(time)}>
                                <Text style={[styles.timeText, selectedTime === time && styles.timeTextSelected]}>{time}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Reservation Summary</Text>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}> Date</Text><Text style={styles.summaryValue}>{selectedDate}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}> Time</Text><Text style={styles.summaryValue}>{selectedTime}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}> Guests</Text><Text style={styles.summaryValue}>{selectedGuests} people</Text></View>
                </View>

                <TouchableOpacity style={styles.confirmButton}><Text style={styles.confirmButtonText}>CONFIRM RESERVATION</Text></TouchableOpacity>
                <Text style={styles.note}>Free cancellation up to 2 hours before</Text>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    placeholder: { width: 40 },
    restaurantCard: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, marginBottom: 24 },
    restaurantImage: { width: 80, height: 80, borderRadius: 12, marginRight: 16 },
    restaurantInfo: { flex: 1, justifyContent: 'center' },
    restaurantName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
    restaurantMeta: { fontSize: 14, color: '#9E9E9E', marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingStar: { fontSize: 14, color: '#FFB300', marginRight: 4 },
    ratingText: { fontSize: 14, color: '#9E9E9E' },
    section: { paddingHorizontal: 16, marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 12 },
    dateChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, backgroundColor: '#1A1A1A', marginRight: 8 },
    dateChipSelected: { backgroundColor: '#00C853' },
    dateText: { fontSize: 14, color: '#FFFFFF' },
    dateTextSelected: { fontWeight: '600' },
    guestChip: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    guestChipSelected: { backgroundColor: '#00C853' },
    guestText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    guestTextSelected: {},
    timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    timeSlot: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A' },
    timeSlotSelected: { backgroundColor: '#0A2A1A', borderColor: '#00C853' },
    timeText: { fontSize: 14, color: '#FFFFFF' },
    timeTextSelected: { color: '#00C853', fontWeight: '600' },
    summaryCard: { marginHorizontal: 16, padding: 20, backgroundColor: '#1A1A1A', borderRadius: 16, marginBottom: 16 },
    summaryTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { fontSize: 14, color: '#9E9E9E' },
    summaryValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    confirmButton: { marginHorizontal: 16, backgroundColor: '#00C853', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
    confirmButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
    note: { fontSize: 12, color: '#9E9E9E', textAlign: 'center', marginTop: 12 },
});

export default TableReservationScreen;
