import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Dimensions,
    ViewToken,
    FlatList,
    ListRenderItem,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREENS } from '../../../constants';

const { width, height } = Dimensions.get('window');

// Slide data with temporary placeholder images
const SLIDES = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        title: 'One app for food,\ngrocery & more',
        subtitle: 'Premium delivery at your doorstep with lightning speed and exclusive deals.',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        title: 'Fresh groceries\ndelivered daily',
        subtitle: 'From local farms to your kitchen - fresh vegetables, fruits & daily essentials.',
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        title: 'Lightning fast\ndelivery',
        subtitle: 'Get your orders delivered in 30 minutes or less. Hot & fresh, every time!',
    },
];

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const flatListRef = useRef<FlatList>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // Handle viewable items change
    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }, []);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex === SLIDES.length - 1 ? 0 : prevIndex + 1;
                    flatListRef.current?.scrollToIndex({
                        index: nextIndex,
                        animated: true,
                    });
                    return nextIndex;
                });
            }, 4000); // Change slide every 4 seconds
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlaying]);

    // Stop auto-play on user interaction
    const handleScrollBegin = () => {
        setIsAutoPlaying(false);
        // Resume auto-play after 8 seconds of inactivity
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        setTimeout(() => setIsAutoPlaying(true), 8000);
    };

    // Navigate to specific slide
    const goToSlide = (index: number) => {
        setIsAutoPlaying(false);
        flatListRef.current?.scrollToIndex({
            index,
            animated: true,
        });
        setTimeout(() => setIsAutoPlaying(true), 8000);
    };

    // Handle get started
    const handleGetStarted = () => {
        navigation.navigate(SCREENS.MOBILE_INPUT);
    };

    // Render slide item
    const renderItem: ListRenderItem<typeof SLIDES[0]> = useCallback(({ item }) => (
        <View style={styles.slide}>
            <Image
                source={{ uri: item.image }}
                style={styles.slideImage}
                resizeMode="cover"
            />
            {/* Gradient overlay for better text readability */}
            <View style={styles.gradientOverlay} />
        </View>
    ), []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Carousel */}
            <View style={styles.carouselContainer}>
                <FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    onScrollBeginDrag={handleScrollBegin}
                    bounces={false}
                    decelerationRate="fast"
                    snapToInterval={width}
                    snapToAlignment="start"
                />
            </View>

            {/* Content Overlay */}
            <View style={styles.contentOverlay}>
                {/* Text Content - Shows current slide's text */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {SLIDES[currentIndex].title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {SLIDES[currentIndex].subtitle}
                    </Text>
                </View>

                {/* Pagination dots */}
                <View style={styles.dotsContainer}>
                    {SLIDES.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => goToSlide(index)}
                            style={styles.dotButton}
                            activeOpacity={0.7}>
                            <View
                                style={[
                                    styles.dot,
                                    index === currentIndex && styles.dotActive,
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Get Started Button - Always visible, always works */}
                <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}>
                    <Text style={styles.getStartedButtonText}>Get Started</Text>
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
    carouselContainer: {
        height: height * 0.6,
    },
    slide: {
        width: width,
        height: height * 0.6,
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    contentOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 24,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 16,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    dotButton: {
        padding: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4A4A4A',
    },
    dotActive: {
        width: 24,
        backgroundColor: '#00E5FF',
    },
    getStartedButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
    },
    getStartedButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});

export default WelcomeScreen;
