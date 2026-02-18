import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import { BackButton } from '../../../components/ui/BackButton';
import flashDealsApi, { FlashDealConfig } from '../../../api/flashDealsApi';

const { width } = Dimensions.get('window');

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface FlashDeal {
    id: string;
    restaurantName: string;
    image: string;
    originalPrice: number;
    dealPrice: number;
    discount: string;
    endsIn: number; // seconds
    claimed: number;
    total: number;
}

// Default fallback data (used when API fails or returns empty)
const defaultFlashDeals: FlashDeal[] = [
    {
        id: '1',
        restaurantName: 'The Gourmet Kitchen',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh2fIAp9oyd2iKcXdCrUMWQo-idGSY6th2lWcn9JIWULsmhc9WMTTqCmUdFV-PqxqxB9w5UEdfyYF0-jhhPpJz1GJhYuuyTp3snHteh1RUOXUvzOsfLXdiBsMXmrUHqwfmNDqOc6L2jBSJiNSrv844oTPWPbTQDs6snW2cs85oeWC0vTEegACwjG3td5PpsC8Pa07tJPbnHgLKopcnHh7Bcrrm4eLldCAfitrNBxdqO3xzNizP-0HxQEu4LbZBZprZfRFIO3blYvEi',
        originalPrice: 25.99,
        dealPrice: 12.99,
        discount: '50% OFF',
        endsIn: 3600,
        claimed: 45,
        total: 50,
    },
    {
        id: '2',
        restaurantName: 'Swift Burger Co.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC5vARZsW5066UvblgoPxPCIbg0144cPv7c9etHqj_c_Vz115R9N8sM0CSGW_UKDmzhMrFoLrOv2JfL9rjggmwLfchZ-N9TEI3RgkIMgsGY4js8ok-bPsERSAmc1VBC1ZV4gIywnz1L4TrVqXxcDwOKptJ_A5Qhg02W85oUNPn9-ywmRanfzc6Oj-fZVEgVf5LmEf9qzLHjLk-WmwIUvAZwmstPFUEhp-mhFclgyuwkAPsMARIe1l3cUvJn-_e7l5KXmlT13VPwwjG',
        originalPrice: 18.99,
        dealPrice: 9.99,
        discount: '47% OFF',
        endsIn: 1800,
        claimed: 28,
        total: 30,
    },
    {
        id: '3',
        restaurantName: 'Cyan Spice',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI-c8QszP_pPOf7jrVL7irkdep3O0vXq7fcjUszzjAPHTYBS9_kjmyeo1C8rklt2ijyKoSf8NjFzyODh_PkBjP-EIA4m-EKe2vKa-dD-AxDu9CvyT99y_8pbR_FWCKEeMhU6PHhXMx3E7O2vsHKBYN34Dxps657IB_gJptLzaHnSar11u5njYhUEfV0NPB07XzvYB_P0JCEer0iC38mDX-ilCaGtX6Hjtge7WeB39DbZ2wsUSETZKRYjGETA9eiaPUmRLEIrb4FBUW',
        originalPrice: 32.00,
        dealPrice: 19.99,
        discount: '38% OFF',
        endsIn: 7200,
        claimed: 12,
        total: 25,
    },
];

// Marquee Component
const MeasureElement = ({ onLayout, children }: { onLayout: (width: number) => void; children: React.ReactNode }) => (
  <Animated.ScrollView
    horizontal
    style={marqueeStyles.hidden}
    pointerEvents="box-none">
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>
      {children}
    </View>
  </Animated.ScrollView>
);

const TranslatedElement = ({ index, children, offset, childrenWidth }: { 
  index: number; 
  children: React.ReactNode; 
  offset: any; 
  childrenWidth: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: (index - 1) * childrenWidth,
      transform: [
        {
          translateX: -offset.value,
        },
      ],
    };
  });
  return (
    <Animated.View style={[marqueeStyles.animatedStyle, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const getIndicesArray = (length: number) => Array.from({ length }, (_, i) => i);

const Cloner = ({ count, renderChild }: { count: number; renderChild: (index: number) => React.ReactNode }) => (
  <>{getIndicesArray(count).map(renderChild)}</>
);

const ChildrenScroller = ({
  duration,
  childrenWidth,
  parentWidth,
  reverse,
  children,
}: {
  duration: number;
  childrenWidth: number;
  parentWidth: number;
  reverse: boolean;
  children: React.ReactNode;
}) => {
  const offset = useSharedValue(0);
  const coeff = useSharedValue(reverse ? 1 : -1);

  React.useEffect(() => {
    coeff.value = reverse ? 1 : -1;
  }, [reverse]);

  useFrameCallback((i) => {
    offset.value += (coeff.value * ((i.timeSincePreviousFrame ?? 1) * childrenWidth)) / duration;
    offset.value = offset.value % childrenWidth;
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;
  const renderChild = (index: number) => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      childrenWidth={childrenWidth}>
      {children}
    </TranslatedElement>
  );

  return <Cloner count={count} renderChild={renderChild} />;
};

const Marquee = ({ duration = 8000, reverse = false, children, style }: { 
  duration?: number; 
  reverse?: boolean; 
  children: React.ReactNode; 
  style?: any;
}) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [childrenWidth, setChildrenWidth] = React.useState(0);

  return (
    <View
      style={style}
      onLayout={(ev) => {
        setParentWidth(ev.nativeEvent.layout.width);
      }}
      pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller
            duration={duration}
            parentWidth={parentWidth}
            childrenWidth={childrenWidth}
            reverse={reverse}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};

const marqueeStyles = StyleSheet.create({
  hidden: { opacity: 0, zIndex: -1 },
  row: { flexDirection: 'row', overflow: 'hidden' },
  animatedStyle: {
    position: 'absolute',
  },
});

// Live Banner Content Component
const LiveBannerContent = () => (
  <View style={styles.liveBannerContent}>
    <View style={styles.liveIndicator}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>LIVE</Text>
    </View>
    <Text style={styles.liveBannerText}>
      Limited time deals  Grab before they're gone!
    </Text>
  </View>
);

export const FlashDealsScreen: React.FC<Props> = ({ navigation }) => {
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: number }>({});
    const [config, setConfig] = useState<FlashDealConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [bannerText, setBannerText] = useState("Limited time deals  Grab before they're gone!");
    const [marqueeSpeed, setMarqueeSpeed] = useState(8000);
    const [marqueeReverse, setMarqueeReverse] = useState(true);

    // Fetch flash deals from API
    useEffect(() => {
        const fetchFlashDeals = async () => {
            const result = await flashDealsApi.getActiveFlashDeal();
            if (result.success && result.data) {
                setConfig(result.data);
                setBannerText(result.data.bannerText);
                setMarqueeSpeed(result.data.marqueeSpeed);
                setMarqueeReverse(result.data.marqueeReverse);
            }
            setLoading(false);
        };
        fetchFlashDeals();
    }, []);

    useEffect(() => {
        const deals = config?.deals || defaultFlashDeals;
        const initial: { [key: string]: number } = {};
        deals.forEach((deal) => {
            initial[deal.id] = deal.endsIn;
        });
        setTimeLeft(initial);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((key) => {
                    if (updated[key] > 0) updated[key]--;
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <View style={styles.headerCenter}>
                    <Text style={styles.flashIcon}></Text>
                    <Text style={styles.headerTitle}>Flash Deals</Text>
                </View>
                <View style={styles.placeholder} />
            </View>

            {/* Live Banner with Marquee */}
            <View style={styles.liveBanner}>
                <Marquee duration={marqueeSpeed} reverse={marqueeReverse} style={styles.marqueeContainer}>
                    <LiveBannerContent />
                </Marquee>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {(config?.deals || defaultFlashDeals).map((deal) => (
                    <View key={deal.id} style={styles.dealCard}>
                        <Image
                            source={{ uri: deal.image }}
                            style={styles.dealImage}
                            resizeMode="cover"
                        />
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{deal.discount}</Text>
                        </View>
                        <View style={styles.dealInfo}>
                            <Text style={styles.restaurantName}>{deal.restaurantName}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.dealPrice}>{deal.dealPrice.toFixed(2)}</Text>
                                <Text style={styles.originalPrice}>{deal.originalPrice.toFixed(2)}</Text>
                            </View>

                            {/* Timer */}
                            <View style={styles.timerRow}>
                                <Text style={styles.timerLabel}>Ends in:</Text>
                                <View style={styles.timerBox}>
                                    <Text style={styles.timerText}>
                                        {formatTime(timeLeft[deal.id] || 0)}
                                    </Text>
                                </View>
                            </View>

                            {/* Progress Bar */}
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${(deal.claimed / deal.total) * 100}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.claimedText}>
                                    {deal.claimed}/{deal.total} claimed
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.grabButton}>
                                <Text style={styles.grabButtonText}>GRAB DEAL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={styles.bottomSpacing} />
            </ScrollView>
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
        paddingTop: 12,
        paddingBottom: 8,
        minHeight: 56,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flashIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 32,
    },
    liveBanner: {
        backgroundColor: '#FF5252',
        marginBottom: 12,
        height: 32,
    },
    marqueeContainer: {
        flex: 1,
    },
    liveBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 32,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        marginRight: 6,
    },
    liveText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    liveBannerText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    dealCard: {
        marginHorizontal: 12,
        marginBottom: 12,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        overflow: 'hidden',
    },
    dealImage: {
        width: '100%',
        height: 140,
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FF5252',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    discountText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    dealInfo: {
        padding: 12,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dealPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00E5FF',
        marginRight: 12,
    },
    originalPrice: {
        fontSize: 16,
        color: '#6B6B6B',
        textDecorationLine: 'line-through',
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    timerLabel: {
        fontSize: 14,
        color: '#9E9E9E',
        marginRight: 8,
    },
    timerBox: {
        backgroundColor: '#FF5252',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontVariant: ['tabular-nums'],
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#2A2A2A',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FF5252',
        borderRadius: 4,
    },
    claimedText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    grabButton: {
        backgroundColor: '#00E5FF',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    grabButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    bottomSpacing: {
        height: 40,
    },
});

export default FlashDealsScreen;
