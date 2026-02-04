import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

type Props = {
    onClearSearch?: () => void;
    suggestions?: string[];
};

const defaultSuggestions = ['Sushi', 'Organic Burgers', 'Vegan Pizza', 'Tacos', 'Smoothies'];

export const NoResultsScreen: React.FC<Props> = ({ onClearSearch, suggestions = defaultSuggestions }) => {
    return (
        <View style={styles.container}>
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.iconCircle}>
                    <Text style={styles.forkKnife}>🍴</Text>
                    <View style={styles.searchBadge}>
                        <Text style={styles.searchIcon}>🔍</Text>
                    </View>
                </View>
            </View>

            {/* Message */}
            <Text style={styles.title}>No results found</Text>
            <Text style={styles.subtitle}>
                We couldn't find any restaurants for this search. Try searching for something else.
            </Text>

            {/* Clear Search Button */}
            <TouchableOpacity style={styles.clearButton} onPress={onClearSearch}>
                <Text style={styles.clearButtonText}>CLEAR SEARCH</Text>
            </TouchableOpacity>

            {/* Suggestions */}
            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Suggested for you</Text>
                <View style={styles.tagsContainer}>
                    {suggestions.map((item) => (
                        <TouchableOpacity key={item} style={styles.suggestionTag}>
                            <Text style={styles.suggestionText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    illustrationContainer: {
        marginBottom: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#2A2A2A',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    forkKnife: {
        fontSize: 48,
        opacity: 0.5,
    },
    searchBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00E5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcon: {
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    clearButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginBottom: 40,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    suggestionsContainer: {
        width: '100%',
    },
    suggestionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    suggestionTag: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#00E5FF33',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    suggestionText: {
        fontSize: 14,
        color: '#00E5FF',
    },
});

export default NoResultsScreen;
