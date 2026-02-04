import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    onApplyFilters?: (filters: any) => void;
};

interface FilterOption {
    id: string;
    label: string;
    isSelected: boolean;
}

const sortOptions: FilterOption[] = [
    { id: '1', label: 'Relevance', isSelected: true },
    { id: '2', label: 'Delivery Time', isSelected: false },
    { id: '3', label: 'Rating', isSelected: false },
    { id: '4', label: 'Cost: Low to High', isSelected: false },
    { id: '5', label: 'Cost: High to Low', isSelected: false },
];

const cuisines: FilterOption[] = [
    { id: '1', label: 'North Indian', isSelected: false },
    { id: '2', label: 'South Indian', isSelected: true },
    { id: '3', label: 'Chinese', isSelected: false },
    { id: '4', label: 'Italian', isSelected: true },
    { id: '5', label: 'Mexican', isSelected: false },
    { id: '6', label: 'Thai', isSelected: false },
    { id: '7', label: 'Japanese', isSelected: false },
    { id: '8', label: 'Continental', isSelected: false },
];

const ratings = ['4.5+', '4.0+', '3.5+', '3.0+'];

export const SmartFiltersScreen: React.FC<Props> = ({ navigation, onApplyFilters }) => {
    const [selectedSort, setSelectedSort] = useState('1');
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['2', '4']);
    const [selectedRating, setSelectedRating] = useState('4.0+');
    const [isVegOnly, setIsVegOnly] = useState(false);
    const [isFreeDelivery, setIsFreeDelivery] = useState(false);
    const [maxDeliveryTime, setMaxDeliveryTime] = useState(30);

    const toggleCuisine = (id: string) => {
        setSelectedCuisines((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
        );
    };

    const handleApply = () => {
        onApplyFilters?.({
            sort: selectedSort,
            cuisines: selectedCuisines,
            rating: selectedRating,
            vegOnly: isVegOnly,
            freeDelivery: isFreeDelivery,
            maxDeliveryTime,
        });
        navigation.goBack();
    };

    const handleClear = () => {
        setSelectedSort('1');
        setSelectedCuisines([]);
        setSelectedRating('');
        setIsVegOnly(false);
        setIsFreeDelivery(false);
        setMaxDeliveryTime(60);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Filters</Text>
                <TouchableOpacity onPress={handleClear}>
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Sort By */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sort By</Text>
                    <View style={styles.optionsRow}>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.optionChip,
                                    selectedSort === option.id && styles.optionChipSelected,
                                ]}
                                onPress={() => setSelectedSort(option.id)}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedSort === option.id && styles.optionTextSelected,
                                    ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Quick Filters */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Filters</Text>
                    <View style={styles.switchRow}>
                        <View style={styles.switchInfo}>
                            <Text style={styles.switchLabel}>🥬 Pure Veg</Text>
                            <Text style={styles.switchDescription}>Show only vegetarian</Text>
                        </View>
                        <Switch
                            value={isVegOnly}
                            onValueChange={setIsVegOnly}
                            trackColor={{ false: '#2A2A2A', true: '#00E5FF66' }}
                            thumbColor={isVegOnly ? '#00E5FF' : '#6B6B6B'}
                        />
                    </View>
                    <View style={styles.switchRow}>
                        <View style={styles.switchInfo}>
                            <Text style={styles.switchLabel}>🚚 Free Delivery</Text>
                            <Text style={styles.switchDescription}>No delivery charges</Text>
                        </View>
                        <Switch
                            value={isFreeDelivery}
                            onValueChange={setIsFreeDelivery}
                            trackColor={{ false: '#2A2A2A', true: '#00E5FF66' }}
                            thumbColor={isFreeDelivery ? '#00E5FF' : '#6B6B6B'}
                        />
                    </View>
                </View>

                {/* Delivery Time */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Max Delivery Time</Text>
                    <View style={styles.timeOptions}>
                        {[15, 30, 45, 60].map((time) => (
                            <TouchableOpacity
                                key={time}
                                style={[
                                    styles.timeChip,
                                    maxDeliveryTime === time && styles.timeChipSelected,
                                ]}
                                onPress={() => setMaxDeliveryTime(time)}>
                                <Text
                                    style={[
                                        styles.timeText,
                                        maxDeliveryTime === time && styles.timeTextSelected,
                                    ]}>
                                    {time} min
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Rating */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rating</Text>
                    <View style={styles.optionsRow}>
                        {ratings.map((rating) => (
                            <TouchableOpacity
                                key={rating}
                                style={[
                                    styles.ratingChip,
                                    selectedRating === rating && styles.ratingChipSelected,
                                ]}
                                onPress={() => setSelectedRating(rating)}>
                                <Text style={styles.starIcon}>★</Text>
                                <Text
                                    style={[
                                        styles.ratingText,
                                        selectedRating === rating && styles.ratingTextSelected,
                                    ]}>
                                    {rating}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Cuisines */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuisines</Text>
                    <View style={styles.cuisinesGrid}>
                        {cuisines.map((cuisine) => (
                            <TouchableOpacity
                                key={cuisine.id}
                                style={[
                                    styles.cuisineChip,
                                    selectedCuisines.includes(cuisine.id) && styles.cuisineChipSelected,
                                ]}
                                onPress={() => toggleCuisine(cuisine.id)}>
                                <Text
                                    style={[
                                        styles.cuisineText,
                                        selectedCuisines.includes(cuisine.id) && styles.cuisineTextSelected,
                                    ]}>
                                    {cuisine.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>APPLY FILTERS</Text>
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
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2A2A2A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    clearText: {
        fontSize: 14,
        color: '#FF5252',
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    optionChipSelected: {
        backgroundColor: '#00E5FF',
        borderColor: '#00E5FF',
    },
    optionText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    optionTextSelected: {
        color: '#000000',
        fontWeight: '600',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    switchInfo: {
        flex: 1,
    },
    switchLabel: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    switchDescription: {
        fontSize: 12,
        color: '#6B6B6B',
    },
    timeOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    timeChip: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    timeChipSelected: {
        backgroundColor: '#00E5FF',
        borderColor: '#00E5FF',
    },
    timeText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    timeTextSelected: {
        color: '#000000',
        fontWeight: '600',
    },
    ratingChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    ratingChipSelected: {
        backgroundColor: '#00C853',
        borderColor: '#00C853',
    },
    starIcon: {
        fontSize: 14,
        color: '#FFB300',
        marginRight: 4,
    },
    ratingText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    ratingTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    cuisinesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cuisineChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cuisineChipSelected: {
        backgroundColor: '#0A2A2A',
        borderColor: '#00E5FF',
    },
    cuisineText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    cuisineTextSelected: {
        color: '#00E5FF',
    },
    bottomSpacing: {
        height: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 30,
        backgroundColor: '#1A1A1A',
    },
    applyButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
});

export default SmartFiltersScreen;
