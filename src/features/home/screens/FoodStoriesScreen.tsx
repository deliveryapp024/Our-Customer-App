import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type Props = { navigation: NativeStackNavigationProp<any> };

const stories = [
    { id: '1', restaurant: 'The Gourmet Kitchen', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', caption: 'Our new Truffle Burger is here! 🍔', likes: 234, isNew: true },
    { id: '2', restaurant: 'Urban Bites', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400', caption: 'Crispy wings made with love ❤️', likes: 156, isNew: true },
    { id: '3', restaurant: 'Spice Garden', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', caption: 'Authentic flavors from India 🇮🇳', likes: 189, isNew: false },
    { id: '4', restaurant: 'Sushi Master', image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400', caption: 'Fresh catch of the day 🐟', likes: 312, isNew: false },
];

export const FoodStoriesScreen: React.FC<Props> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState<{ [key: string]: boolean }>({});

    const toggleLike = (id: string) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>Food Stories</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}>
                {stories.map((story) => (
                    <View key={story.id} style={styles.storyCard}>
                        <Image source={{ uri: story.image }} style={styles.storyImage} resizeMode="cover" />
                        <View style={styles.storyOverlay}>
                            <View style={styles.storyHeader}>
                                <View style={styles.restaurantInfo}>
                                    <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{story.restaurant.charAt(0)}</Text></View>
                                    <View><Text style={styles.restaurantName}>{story.restaurant}</Text>{story.isNew && <Text style={styles.newBadge}>NEW</Text>}</View>
                                </View>
                            </View>
                            <View style={styles.storyFooter}>
                                <Text style={styles.storyCaption}>{story.caption}</Text>
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(story.id)}>
                                        <Text style={styles.actionIcon}>{liked[story.id] ? '❤️' : '🤍'}</Text>
                                        <Text style={styles.actionText}>{story.likes + (liked[story.id] ? 1 : 0)}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}><Text style={styles.actionIcon}>💬</Text><Text style={styles.actionText}>Comment</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}><Text style={styles.actionIcon}>📤</Text><Text style={styles.actionText}>Share</Text></TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.orderButton}><Text style={styles.orderButtonText}>ORDER NOW</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pagination}>
                {stories.map((_, index) => (<View key={index} style={[styles.dot, index === currentIndex && styles.dotActive]} />))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    backIcon: { fontSize: 20, color: '#FFFFFF' },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    placeholder: { width: 40 },
    storyCard: { width, height: '100%' },
    storyImage: { width: '100%', height: '100%' },
    storyOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' },
    storyHeader: { paddingTop: 100, paddingHorizontal: 16 },
    restaurantInfo: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00E5FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { fontSize: 18, fontWeight: 'bold', color: '#000000' },
    restaurantName: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    newBadge: { fontSize: 10, color: '#00E5FF', fontWeight: 'bold' },
    storyFooter: { padding: 16, paddingBottom: 80, backgroundColor: 'rgba(0,0,0,0.7)' },
    storyCaption: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
    actionsRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
    actionButton: { flexDirection: 'row', alignItems: 'center' },
    actionIcon: { fontSize: 20, marginRight: 6 },
    actionText: { fontSize: 14, color: '#FFFFFF' },
    orderButton: { backgroundColor: '#00E5FF', paddingVertical: 14, borderRadius: 25, alignItems: 'center' },
    orderButtonText: { fontSize: 14, fontWeight: 'bold', color: '#000000' },
    pagination: { position: 'absolute', bottom: 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6B6B6B' },
    dotActive: { backgroundColor: '#00E5FF', width: 24 },
});

export default FoodStoriesScreen;
