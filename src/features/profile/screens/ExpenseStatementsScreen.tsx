import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type Props = { navigation: NativeStackNavigationProp<any> };

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const expenses = [
    { id: '1', month: 'February 2026', total: 245.50, orders: 12, avgOrder: 20.46 },
    { id: '2', month: 'January 2026', total: 312.00, orders: 15, avgOrder: 20.80 },
    { id: '3', month: 'December 2025', total: 198.75, orders: 9, avgOrder: 22.08 },
];
const categories = [
    { id: '1', name: 'Food Orders', amount: 180.50, percentage: 74, icon: '🍔' },
    { id: '2', name: 'Delivery Fees', amount: 35.00, percentage: 14, icon: '🚗' },
    { id: '3', name: 'Tips', amount: 20.00, percentage: 8, icon: '💵' },
    { id: '4', name: 'Taxes', amount: 10.00, percentage: 4, icon: '📋' },
];

export const ExpenseStatementsScreen: React.FC<Props> = ({ navigation }) => {
    const [selectedMonth, setSelectedMonth] = useState('February 2026');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>Spending</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>This Month</Text>
                    <Text style={styles.totalValue}>$245.50</Text>
                    <Text style={styles.totalMeta}>12 orders • Avg $20.46/order</Text>
                </View>

                <View style={styles.chartContainer}>
                    <View style={styles.chartBars}>
                        {[120, 180, 245, 150, 200, 245].map((value, index) => (
                            <View key={index} style={styles.barContainer}>
                                <View style={[styles.bar, { height: value * 0.4 }]} />
                                <Text style={styles.barLabel}>{months[index]}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Breakdown</Text>
                    {categories.map((cat) => (
                        <View key={cat.id} style={styles.categoryRow}>
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                            <Text style={styles.categoryName}>{cat.name}</Text>
                            <View style={styles.categoryProgress}><View style={[styles.progressFill, { width: `${cat.percentage}%` }]} /></View>
                            <Text style={styles.categoryAmount}>${cat.amount.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Past Months</Text>
                    {expenses.map((exp) => (
                        <TouchableOpacity key={exp.id} style={styles.monthCard}>
                            <Text style={styles.monthName}>{exp.month}</Text>
                            <View style={styles.monthMeta}><Text style={styles.monthOrders}>{exp.orders} orders</Text><Text style={styles.monthTotal}>${exp.total.toFixed(2)}</Text></View>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.downloadButton}><Text style={styles.downloadText}>📥 Download Statement</Text></TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2A2A2A', justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 20, color: '#FFFFFF' },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    placeholder: { width: 40 },
    totalCard: { marginHorizontal: 16, padding: 24, backgroundColor: '#0A2A2A', borderRadius: 20, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#00E5FF33' },
    totalLabel: { fontSize: 14, color: '#9E9E9E', marginBottom: 8 },
    totalValue: { fontSize: 40, fontWeight: 'bold', color: '#00E5FF', marginBottom: 8 },
    totalMeta: { fontSize: 14, color: '#9E9E9E' },
    chartContainer: { marginHorizontal: 16, backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 24 },
    chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
    barContainer: { alignItems: 'center' },
    bar: { width: 32, backgroundColor: '#00E5FF', borderRadius: 4 },
    barLabel: { fontSize: 12, color: '#9E9E9E', marginTop: 8 },
    section: { paddingHorizontal: 16, marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
    categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    categoryIcon: { fontSize: 20, marginRight: 12 },
    categoryName: { width: 100, fontSize: 14, color: '#FFFFFF' },
    categoryProgress: { flex: 1, height: 8, backgroundColor: '#2A2A2A', borderRadius: 4, marginRight: 12 },
    progressFill: { height: '100%', backgroundColor: '#00E5FF', borderRadius: 4 },
    categoryAmount: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', width: 60, textAlign: 'right' },
    monthCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 8 },
    monthName: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
    monthMeta: { alignItems: 'flex-end' },
    monthOrders: { fontSize: 12, color: '#9E9E9E' },
    monthTotal: { fontSize: 16, fontWeight: 'bold', color: '#00E5FF' },
    downloadButton: { marginHorizontal: 16, backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, alignItems: 'center' },
    downloadText: { fontSize: 14, color: '#00E5FF' },
});

export default ExpenseStatementsScreen;
