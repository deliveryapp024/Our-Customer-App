import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../../../components/ui/BackButton';

const { width } = Dimensions.get('window');

type Props = { navigation: NativeStackNavigationProp<any> };

// Images from restaurant_food_stories_feed design
const stories = [
    { id: '1', restaurant: 'The Gourmet Kitchen', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACu_J4GhIjX3_oAJPvo_JFzUK9TaH4LCWX4lCd8vJDcVUUVUt778h7mymnHrp8qHhnQhi5nLAahFID6OcV00XqdifqpBeRfrF9npJAdCtYOeznXlurP8-USxfFDSq--snEPiEHfL9CTgPOGxfaAL6G76mh3nzIzeGcuwQMSrss7HNRbvR8co-IyMmsDd8i_Oq-4IY8bCf0JTg2Pyk2Yox1YFAxaViahrZP5gTvOaInEVZcEqo2mYkKOmlLtsEpRrSNvBxk_cIElEvP', caption: 'Our new Truffle Burger is here! Food', likes: 234, isNew: true },
    { id: '2', restaurant: 'Urban Bites', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDjrzy8lgyhNSW4I7xcLoInXGKEEuYCtuFJVguCjhe4YZ1eLLeRf2K1ADODPhlS_sF9ckBpDio09aNzJC24v5QdEhHEK7GcT0tHOofEQpDLp8NoD87n9bTR4oWb3TauJwvISXeu4y0ED8crxvBLw40zFccLl883nIWxZvs32G8jalWbE6KucADlPeMAzFrhwDK1Ka0vdm27mssjTJwjnHiK7B0jDaOAVASBP-YIm6OdhS_fwwoA_Q059baD3dI_WYk7HrHo72iYrOM', caption: 'Crispy wings made with love ', likes: 156, isNew: true },
    { id: '3', restaurant: 'Spice Garden', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4DUFZkfL_GvK1a5bsb87pJR5AhI1e1Uu_Y8xllkAKSAhX0yesOMYZAY_PPji3Ro1-nw6t3iemZon61CG-TGWC_onjsudf9H6jvDbRUP--Ztx5qqvPDKSEVPTIQsnkIOhM293zwi2WV6rEXeO82oxqWTk1SXucNlcUCio4nhgqgpxmErECjUt2hYnGBDcYRvnGM6vkN7lmTbH_fiT76NKMKsohXviixfulE6I6YGLHPMwwn6lV2J57SSIcI_5QgSBqfW-aeuPNAUDR', caption: 'Authentic flavors from India ', likes: 189, isNew: false },
    { id: '4', restaurant: 'Sushi Master', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAofeOc-q88BTDJXsetru-T9CK9FOFB0h3wYuECuGgiWnlwtDFJ4wDLiSus3QMLAnBuppVzJWzl_3kheMETXw72FkTzeiFkix7ToNE9n89FvqUR0dcOY5b2jD26V4k-X-xPR5WsvIjloK5bNrVN-KzEKRqrG1z8gUI5YtuhQJqA5S_FSQcD5l5R-5COhFDvfT9yjBFvTT8QFqgkEnRhGYHvR6DaUjFz-uRv9uVB_-4UO65sO1MD-wUxQ3hT4avmj5ArKcvqXQef6v_4', caption: 'Fresh catch of the day ', likes: 312, isNew: false },
];

export const FoodStoriesScreen: React.FC<Props> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState<{ [key: string]: boolean }>({});

    const toggleLike = (id: string) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
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
                                        <Text style={styles.actionIcon}>{liked[story.id] ? '' : ''}</Text>
                                        <Text style={styles.actionText}>{story.likes + (liked[story.id] ? 1 : 0)}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}><Text style={styles.actionIcon}></Text><Text style={styles.actionText}>Comment</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}><Text style={styles.actionIcon}></Text><Text style={styles.actionText}>Share</Text></TouchableOpacity>
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
