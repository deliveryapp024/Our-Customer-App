import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackButton } from '../../../components/ui/BackButton';
import { reviewsApi, BranchReview } from '../../../api';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    route: RouteProp<any>;
};

type ReviewRow = BranchReview;

export const BranchReviewsScreen: React.FC<Props> = ({ navigation, route }) => {
    const branchId = String(route.params?.branchId || '');
    const branchName = String(route.params?.branchName || 'Reviews');

    const [items, setItems] = useState<ReviewRow[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMore = async (mode: 'initial' | 'more' | 'refresh') => {
        if (!branchId) return;
        if (loading) return;
        if (mode !== 'refresh' && !hasMore) return;

        setLoading(true);
        setError(null);
        try {
            const res = await reviewsApi.listBranchReviews(branchId, 20, mode === 'more' ? cursor || undefined : undefined);
            if (!res.success) {
                setError(res.error || 'Failed to load reviews');
                return;
            }

            const next = res.data?.nextCursor ?? null;
            const nextItems = Array.isArray(res.data?.items) ? res.data.items : [];

            if (mode === 'more') {
                setItems((prev) => prev.concat(nextItems));
            } else {
                setItems(nextItems);
            }

            setCursor(next);
            setHasMore(!!next);
            setInitialLoaded(true);
        } finally {
            setLoading(false);
        }
    };

    // Kick initial fetch (simple and predictable; avoids hook complexity in this repo's lint baseline).
    useMemo(() => {
        if (!initialLoaded && branchId) {
            // Fire and forget; component state updates handle UI.
            loadMore('initial');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branchId, initialLoaded]);

    const renderItem = ({ item }: { item: ReviewRow }) => {
        return (
            <View style={styles.card}>
                <View style={styles.topRow}>
                    <Text style={styles.name} numberOfLines={1}>{item.customer?.name || 'Customer'}</Text>
                    <View style={styles.ratingPill}>
                        <Text style={styles.ratingText}>{Number(item.rating).toFixed(1)} ★</Text>
                    </View>
                </View>

                {!!item.comment && (
                    <Text style={styles.comment} numberOfLines={4}>{item.comment}</Text>
                )}

                {Array.isArray(item.images) && item.images.length > 0 && (
                    <View style={styles.imagesRow}>
                        {item.images.slice(0, 4).map((u, idx) => (
                            <Image key={`${item._id}_img_${idx}`} source={{ uri: u }} style={styles.thumb} />
                        ))}
                    </View>
                )}

                {item.isVerifiedPurchase && (
                    <Text style={styles.verified}>Verified order</Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.title} numberOfLines={1}>{branchName}</Text>
                <View style={styles.headerRight} />
            </View>

            {!initialLoaded && loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#00E5FF" />
                    <Text style={styles.muted}>Loading reviews...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.muted}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => loadMore('refresh')} activeOpacity={0.85}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(r) => String(r._id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    onEndReached={() => loadMore('more')}
                    onEndReachedThreshold={0.6}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.muted}>No reviews yet.</Text>
                        </View>
                    }
                    ListFooterComponent={
                        loading ? (
                            <View style={styles.footer}>
                                <ActivityIndicator color="#00E5FF" />
                                <Text style={styles.muted}>Loading more...</Text>
                            </View>
                        ) : null
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    title: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
    headerRight: { width: 48 },
    listContent: { padding: 16, paddingBottom: 28, gap: 12 },
    card: {
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: '#00E5FF22',
    },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    name: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', flex: 1, marginRight: 10 },
    ratingPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: '#00C853' },
    ratingText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
    comment: { color: '#CFCFCF', fontSize: 12, lineHeight: 16 },
    imagesRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    thumb: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#1A1A1A' },
    verified: { marginTop: 10, color: '#00E5FF', fontSize: 11, fontWeight: '700' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, gap: 10 },
    muted: { color: '#9E9E9E', fontSize: 12 },
    retryBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#00E5FF',
    },
    retryText: { color: '#000000', fontWeight: '800', fontSize: 12 },
    footer: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
});

