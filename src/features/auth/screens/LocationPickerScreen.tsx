import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Alert,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, MapPressEvent, Region, MarkerDragStartEndEvent } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { SCREENS, STACKS } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants';
import { BackButton } from '../../../components/ui/BackButton';

const { width, height } = Dimensions.get('window');

// Default location: Belgaum
const DEFAULT_REGION: Region = {
    latitude: 15.8497,
    longitude: 74.4977,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

// Valid coordinate check
const isValidCoord = (lat: any, lng: any): boolean => {
    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );
};

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

interface SavedAddress {
    id: string;
    label: string;
    address: string;
    icon: string;
}

const savedAddresses: SavedAddress[] = [
    { id: '1', label: 'Home', address: 'Add your home address', icon: 'Home' },
    { id: '2', label: 'Work', address: 'Add your work address', icon: '' },
];

export const LocationPickerScreen: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
        address?: string;
    } | null>(null);
    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(true); // Start with true for auto-locate
    const [mapReady, setMapReady] = useState(false);
    const [addressText, setAddressText] = useState('');
    
    const mapRef = useRef<MapView>(null);
    const pendingLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
    
    const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete);

    // Request location permissions on Android
    const requestLocationPermission = useCallback(async (): Promise<boolean> => {
        if (Platform.OS !== 'android') {
            return true; // iOS permissions are handled differently
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'We need access to your location to show nearby restaurants and deliver food to your address.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('[LocationPicker] Location permission granted');
                return true;
            } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                console.log('[LocationPicker] Location permission denied');
                Alert.alert(
                    'Permission Required',
                    'Location permission is needed to find your current location. You can manually select a location on the map or grant permission in settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) },
                    ]
                );
                return false;
            } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                console.log('[LocationPicker] Location permission denied permanently');
                Alert.alert(
                    'Permission Required',
                    'Location permission was denied permanently. Please enable it in your device settings to use automatic location detection.',
                    [
                        { text: 'OK', style: 'cancel' },
                    ]
                );
                return false;
            }
            return false;
        } catch (err) {
            console.warn('[LocationPicker] Permission request error:', err);
            return false;
        }
    }, []);

    // Reverse geocode to get address (simplified - in production use proper geocoding API)
    const reverseGeocode = useCallback(async (latitude: number, longitude: number): Promise<string> => {
        // In production, call Google Geocoding API here
        // For now, return coordinate-based description
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }, []);

    // Apply location to map (handles map readiness)
    const applyLocationToMap = useCallback((latitude: number, longitude: number) => {
        if (!isValidCoord(latitude, longitude)) {
            console.log('[LocationPicker] Invalid coordinates, skipping');
            return;
        }

        const newRegion: Region = {
            latitude,
            longitude,
            latitudeDelta: 0.005, // Zoomed in closer
            longitudeDelta: 0.005,
        };

        if (mapReady && mapRef.current) {
            // Map is ready, animate immediately
            mapRef.current.animateToRegion(newRegion, 1000);
            setRegion(newRegion);
        } else {
            // Queue for when map is ready
            console.log('[LocationPicker] Map not ready, queuing location');
            pendingLocationRef.current = { latitude, longitude };
            setRegion(newRegion); // Still update state
        }
    }, [mapReady]);

    // Fast location strategy: cached first, then fresh GPS
    const getFastLocation = useCallback(async (): Promise<{ latitude: number; longitude: number; source: string } | null> => {
        console.log('[LocationPicker] Starting fast location...');
        
        // Try 1: Check for cached location in AsyncStorage
        try {
            const cachedLocation = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION_DATA);
            if (cachedLocation) {
                const parsed = JSON.parse(cachedLocation);
                if (isValidCoord(parsed.latitude, parsed.longitude)) {
                    console.log('[LocationPicker] Using cached location');
                    return { 
                        latitude: parsed.latitude, 
                        longitude: parsed.longitude, 
                        source: 'cache' 
                    };
                }
            }
        } catch (e) {
            console.log('[LocationPicker] Cache read failed');
        }

        // Try 2: Request permission and get current GPS position
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.log('[LocationPicker] Location permission not granted');
            return null;
        }

        return new Promise((resolve) => {
            console.log('[LocationPicker] Getting fresh GPS...');
            
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (isValidCoord(latitude, longitude)) {
                        console.log('[LocationPicker] Fresh GPS success');
                        resolve({ latitude, longitude, source: 'gps' });
                    } else {
                        console.log('[LocationPicker] GPS returned invalid coords');
                        resolve(null);
                    }
                },
                (error) => {
                    console.log('[LocationPicker] GPS error:', error.message);
                    resolve(null);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000, // Accept locations up to 1 minute old
                }
            );
        });
    }, [requestLocationPermission]);

    // Auto-locate on mount
    useEffect(() => {
        const autoLocate = async () => {
            setLocating(true);
            
            const location = await getFastLocation();
            
            if (location) {
                console.log(`[LocationPicker] Auto-located via ${location.source}`);
                
                // Apply to map
                applyLocationToMap(location.latitude, location.longitude);
                
                // Set selected location
                const address = await reverseGeocode(location.latitude, location.longitude);
                setSelectedLocation({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address,
                });
                setAddressText(address);
            } else {
                console.log('[LocationPicker] Auto-locate failed, using default');
                // Fallback to default region (Belgaum)
                applyLocationToMap(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude);
            }
            
            setLocating(false);
        };

        autoLocate();
    }, [getFastLocation, applyLocationToMap, reverseGeocode]);

    // Handle map ready
    const handleMapReady = useCallback(() => {
        console.log('[LocationPicker] Map ready');
        setMapReady(true);
        
        // Apply pending location if exists
        if (pendingLocationRef.current) {
            const { latitude, longitude } = pendingLocationRef.current;
            console.log('[LocationPicker] Applying pending location');
            
            const newRegion: Region = {
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            mapRef.current?.animateToRegion(newRegion, 1000);
            pendingLocationRef.current = null;
        }
    }, []);

    // Handle map press - drop pin
    const handleMapPress = useCallback(async (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log('[LocationPicker] Map pressed:', latitude, longitude);
        
        setSelectedLocation({ latitude, longitude });
        
        // Reverse geocode
        const address = await reverseGeocode(latitude, longitude);
        setAddressText(address);
    }, [reverseGeocode]);

    // Handle marker drag
    const handleMarkerDrag = useCallback(async (event: MarkerDragStartEndEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log('[LocationPicker] Marker dragged:', latitude, longitude);
        
        setSelectedLocation({ latitude, longitude });
        
        const address = await reverseGeocode(latitude, longitude);
        setAddressText(address);
    }, [reverseGeocode]);

    // Manual "Use current location" - uses same fast path
    const handleUseCurrentLocation = useCallback(async () => {
        setLoading(true);
        
        const location = await getFastLocation();
        
        if (location) {
            console.log(`[LocationPicker] Manual location via ${location.source}`);
            
            applyLocationToMap(location.latitude, location.longitude);
            
            const address = await reverseGeocode(location.latitude, location.longitude);
            setSelectedLocation({
                latitude: location.latitude,
                longitude: location.longitude,
                address,
            });
            setAddressText(address);
        } else {
            Alert.alert('Location Error', 'Unable to get your current location. Please check GPS permissions.');
        }
        
        setLoading(false);
    }, [getFastLocation, applyLocationToMap, reverseGeocode]);

    const handleContinue = async () => {
        try {
            if (selectedLocation) {
                await AsyncStorage.setItem(
                    STORAGE_KEYS.LOCATION_DATA,
                    JSON.stringify(selectedLocation)
                );
            }

            await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
            setOnboardingComplete(true);

            navigation.reset({
                index: 0,
                routes: [{ name: STACKS.MAIN }],
            });
        } catch (error) {
            console.error('Location picker error:', error);
            try {
                setOnboardingComplete(true);
                navigation.navigate(STACKS.MAIN);
            } catch (e) {
                console.error('Navigation failed:', e);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Set Delivery Location</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>Search</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for area, street name..."
                    placeholderTextColor="#6B6B6B"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Map with Drop Pin */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={region}
                    onRegionChangeComplete={setRegion}
                    onPress={handleMapPress}
                    onMapReady={handleMapReady}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsCompass={true}
                    rotateEnabled={true}
                    pitchEnabled={false}
                >
                    {selectedLocation && (
                        <Marker
                            coordinate={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude,
                            }}
                            draggable
                            onDragEnd={handleMarkerDrag}
                            pinColor="#00E5FF"
                            title="Selected Location"
                            description={addressText || 'Tap and hold to move'}
                        />
                    )}
                </MapView>

                {/* Locating overlay */}
                {locating && (
                    <View style={styles.locatingOverlay}>
                        <ActivityIndicator color="#00E5FF" size="large" />
                        <Text style={styles.locatingText}>Locating you...</Text>
                    </View>
                )}

                {/* Map Overlay Instructions */}
                <View style={styles.mapOverlay} pointerEvents="none">
                    <Text style={styles.mapInstructions}>
                        {selectedLocation 
                            ? 'Drag pin to adjust' 
                            : 'Tap anywhere or wait for GPS'}
                    </Text>
                </View>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Selected Location Info */}
                    {selectedLocation && (
                        <View style={styles.selectedLocationCard}>
                            <Text style={styles.locationLabel}> Selected Location</Text>
                            <Text style={styles.locationAddress} numberOfLines={2}>
                                {addressText || `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`}
                            </Text>
                        </View>
                    )}

                    {/* Use Current Location */}
                    <TouchableOpacity
                        style={styles.currentLocationButton}
                        onPress={handleUseCurrentLocation}
                        activeOpacity={0.7}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#00E5FF" />
                        ) : (
                            <>
                                <View style={styles.locationIconContainer}>
                                    <Text style={styles.locationIcon}></Text>
                                </View>
                                <View style={styles.locationTextContainer}>
                                    <Text style={styles.currentLocationText}>Use current location</Text>
                                    <Text style={styles.currentLocationSubtext}>
                                        Fast GPS (cached + fresh)
                                    </Text>
                                </View>
                                <Text style={styles.arrowIcon}></Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Saved Addresses */}
                    <Text style={styles.sectionTitle}>Saved Addresses</Text>
                    {savedAddresses.map((addr) => (
                        <TouchableOpacity
                            key={addr.id}
                            style={styles.addressCard}
                            activeOpacity={0.7}>
                            <Text style={styles.addressIcon}>{addr.icon}</Text>
                            <View style={styles.addressTextContainer}>
                                <Text style={styles.addressLabel}>{addr.label}</Text>
                                <Text style={styles.addressText}>{addr.address}</Text>
                            </View>
                            <Text style={styles.addIcon}>+</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Continue Button */}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !selectedLocation && styles.continueButtonDisabled,
                    ]}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                    disabled={!selectedLocation}>
                    <Text style={styles.continueButtonText}>
                        {selectedLocation ? 'Confirm Location' : 'Select a Location'}
                    </Text>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
        color: '#6B6B6B',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 12,
    },
    mapContainer: {
        height: height * 0.4,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    locatingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locatingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#00E5FF',
        fontWeight: '600',
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        alignItems: 'center',
    },
    mapInstructions: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: 'hidden',
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: '#000000',
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 16,
    },
    selectedLocationCard: {
        backgroundColor: '#0A2A2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00E5FF',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A2A2A',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#00E5FF',
        marginBottom: 16,
    },
    locationIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#00E5FF20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    locationIcon: {
        fontSize: 20,
    },
    locationTextContainer: {
        flex: 1,
    },
    currentLocationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00E5FF',
        marginBottom: 2,
    },
    currentLocationSubtext: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#00E5FF',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2A2A2A',
    },
    dividerText: {
        fontSize: 12,
        color: '#6B6B6B',
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    addressIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    addressTextContainer: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    addressText: {
        fontSize: 14,
        color: '#6B6B6B',
    },
    addIcon: {
        fontSize: 24,
        color: '#00E5FF',
    },
    continueButton: {
        backgroundColor: '#00E5FF',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    continueButtonDisabled: {
        backgroundColor: '#2A2A2A',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});

export default LocationPickerScreen;
