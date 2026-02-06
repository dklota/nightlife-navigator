import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';

import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { LitMeter } from '../../components/LitMeter';
import { BarDetails } from '../../components/BarDetails';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 220;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.65;

// Davis bars with approximate coordinates
const MOCK_BARS = [
  {
    id: '1',
    name: 'G St Wunderbar',
    latitude: 38.54423,
    longitude: -121.74072,
    popularity: 85,
    waitTime: '30-45 min',
    vibe: 'Packed',
    emoji: '🍺',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop',
    friendsHere: 2,
    friendAvatars: [
      'https://i.pravatar.cc/150?u=alex',
      'https://i.pravatar.cc/150?u=sam'
    ],
    friendNames: ['Alex', 'Sam'],
    projectedPeak: '11:30 PM',
    projectedWait: '45-60 min',
    projectedCrowd: 92,
    litScore: 95,
    energy: 'insane',
    coverFee: '$5',
    studentDiscount: 'Free cover with .edu',
    communityPhotos: [
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=600&fit=crop'
    ],
  },
  {
    id: '2',
    name: 'Wiki Bar',
    latitude: 38.54380,
    longitude: -121.73980,
    popularity: 50,
    waitTime: '5-10 min',
    vibe: 'Moderate',
    emoji: '🍹',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=400&fit=crop',
    friendsHere: 0,
    friendAvatars: [],
    friendNames: [],
    projectedPeak: '10:30 PM',
    projectedWait: '10-15 min',
    projectedCrowd: 68,
  },
  {
    id: '3',
    name: 'Parkside Sports Bar & Grill',
    latitude: 38.54440,
    longitude: -121.74120,
    popularity: 70,
    waitTime: '15-20 min',
    vibe: 'Busy',
    emoji: '🏈',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&h=400&fit=crop',
    friendsHere: 1,
    friendAvatars: ['https://i.pravatar.cc/150?u=jordan'],
    friendNames: ['Jordan'],
    projectedPeak: '11:00 PM',
    projectedWait: '20-30 min',
    projectedCrowd: 75,
  },
  {
    id: '4',
    name: 'Shipwrecked Tiki Bar',
    latitude: 38.54410,
    longitude: -121.74055,
    popularity: 90,
    waitTime: '30-45 min',
    vibe: 'Packed',
    emoji: '🌴',
    image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=400&h=400&fit=crop',
    friendsHere: 5,
    friendAvatars: [
      'https://i.pravatar.cc/150?u=taylor',
      'https://i.pravatar.cc/150?u=morgan',
      'https://i.pravatar.cc/150?u=casey',
      'https://i.pravatar.cc/150?u=riley',
      'https://i.pravatar.cc/150?u=skylar'
    ],
    friendNames: ['Taylor', 'Morgan', 'Casey', 'Riley', 'Skylar'],
    projectedPeak: '11:30 PM',
    projectedWait: '45-60 min',
    projectedCrowd: 95,
    litScore: 98,
    energy: 'insane',
    coverFee: '$10',
    studentDiscount: '$2 off drinks',
    communityPhotos: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&h=600&fit=crop'
    ],
  },
  {
    id: '5',
    name: 'University of Beer',
    latitude: 38.54350,
    longitude: -121.73850,
    popularity: 50,
    waitTime: '5-10 min',
    vibe: 'Moderate',
    emoji: '🍻',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop',
    friendsHere: 3,
    friendAvatars: [
      'https://i.pravatar.cc/150?u=jamie',
      'https://i.pravatar.cc/150?u=quinn',
      'https://i.pravatar.cc/150?u=charlie'
    ],
    friendNames: ['Jamie', 'Quinn', 'Charlie'],
    projectedPeak: '11:00 PM',
    projectedWait: '15-25 min',
    projectedCrowd: 65,
  },
  {
    id: '6',
    name: "Bull 'N Mouth",
    latitude: 38.54395,
    longitude: -121.73920,
    popularity: 55,
    waitTime: '5 min',
    vibe: 'Moderate',
    emoji: '🎸',
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=400&fit=crop',
    friendsHere: 0,
    friendAvatars: [],
    friendNames: [],
    projectedPeak: '10:00 PM',
    projectedWait: '5-10 min',
    projectedCrowd: 62,
  },
  {
    id: '7',
    name: "Sophia's Thai Bar & Kitchen",
    latitude: 38.54365,
    longitude: -121.73895,
    popularity: 30,
    waitTime: 'No wait',
    vibe: 'Chill',
    emoji: '🍜',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    friendsHere: 0,
    friendAvatars: [],
    friendNames: [],
    projectedPeak: '8:30 PM',
    projectedWait: 'No wait',
    projectedCrowd: 45,
  },
  {
    id: '8',
    name: "Woodstock's Pizza Davis",
    latitude: 38.54435,
    longitude: -121.74085,
    popularity: 75,
    waitTime: '10-15 min',
    vibe: 'Busy',
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    friendsHere: 1,
    friendAvatars: ['https://i.pravatar.cc/150?u=avery'],
    friendNames: ['Avery'],
    projectedPeak: '11:00 PM',
    projectedWait: '20-25 min',
    projectedCrowd: 80,
    litScore: 78,
    energy: 'active',
  },
];

const MOCK_FRIENDS_LOCATIONS = [
  { id: 'f1', name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex', latitude: 38.54450, longitude: -121.74020, status: 'At G St' },
  { id: 'f2', name: 'Sam', avatar: 'https://i.pravatar.cc/150?u=sam', latitude: 38.54410, longitude: -121.73950, status: 'Heading out' },
  { id: 'f3', name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=jordan', latitude: 38.54320, longitude: -121.74150, status: 'Walking to Parkside' },
  { id: 'f4', name: 'Taylor', avatar: 'https://i.pravatar.cc/150?u=taylor', latitude: 38.54380, longitude: -121.73750, status: 'At UOB' },
  { id: 'f5', name: 'Morgan', avatar: 'https://i.pravatar.cc/150?u=morgan', latitude: 38.54500, longitude: -121.73900, status: 'Getting food' },
];

// Get opacity multiplier based on popularity (higher = more opaque)
const getHeatmapIntensity = (popularity: number) => {
  // Scale from 0.3 to 1.0 based on popularity
  return 0.3 + (popularity / 100) * 0.7;
};

// Keep color function for UI elements (bar cards, markers, etc.)
const getNeonColor = (popularity: number) => {
  if (popularity >= 80) return Colors.traffic.veryHigh;
  if (popularity >= 60) return Colors.traffic.high;
  if (popularity >= 40) return Colors.traffic.medium;
  return Colors.traffic.low;
};

// Get glow radius based on popularity - bigger for packed bars
const getGlowRadius = (popularity: number) => {
  const baseRadius = 25;
  return baseRadius + (popularity * 0.8);
};

// Overlapping Avatar Stack component for social indicators
const AvatarStack = ({ avatars, count, size = 18 }: { avatars: string[], count: number, size?: number }) => {
  if (count === 0) return null;
  const displayAvatars = (avatars || []).slice(0, 3);
  const remainingCount = count - displayAvatars.length;

  return (
    <View style={styles.avatarStack}>
      {displayAvatars.map((avatar, index) => (
        <Image
          key={index}
          source={{ uri: avatar }}
          style={[
            styles.stackAvatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              zIndex: 5 - index,
              marginLeft: index === 0 ? 0 : -(size * 0.4)
            }
          ]}
        />
      ))}
      {remainingCount > 0 && (
        <View style={[
          styles.remainingBadge,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            zIndex: 1,
            marginLeft: -(size * 0.4)
          }
        ]}>
          <Text style={styles.remainingText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

// Filter options
const FILTERS = [
  { id: 'trending', label: '🔥 Trending', icon: 'flame-outline' },
  { id: 'lit', label: '✨ Lit Meter', icon: 'flash' },
  { id: 'noWait', label: '⚡ No Wait', icon: 'flash-outline' },
  { id: 'openNow', label: '🟢 Open Now', icon: 'time-outline' },
  { id: 'deals', label: '🎁 Deals', icon: 'gift-outline' },
  { id: 'liveMusic', label: '🎸 Live Music', icon: 'musical-notes-outline' },
];

export default function ExploreScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedBar, setSelectedBar] = useState<typeof MOCK_BARS[0] | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'bars' | 'friends'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const mapRef = useRef<MapView>(null);

  const listHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const initialRegion = {
    latitude: 38.54400,
    longitude: -121.74000,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };

  // Dark map style
  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#0f0f1a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f1a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#555' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#252542' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#252542' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a15' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  ];

  const toggleList = () => {
    const toValue = isListExpanded ? COLLAPSED_HEIGHT : EXPANDED_HEIGHT;
    Animated.spring(listHeight, {
      toValue,
      useNativeDriver: false,
      tension: 50,
      friction: 10,
    }).start();
    setIsListExpanded(!isListExpanded);
  };

  const selectBarFromList = (bar: typeof MOCK_BARS[0]) => {
    setSelectedBar(bar);
    // Collapse list and animate to bar location
    Animated.spring(listHeight, {
      toValue: COLLAPSED_HEIGHT,
      useNativeDriver: false,
    }).start();
    setIsListExpanded(false);

    mapRef.current?.animateToRegion({
      latitude: bar.latitude,
      longitude: bar.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    }, 500);
  };

  // Filter and sort bars
  const filteredBars = React.useMemo(() => {
    return MOCK_BARS.filter(bar => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = bar.name.toLowerCase().includes(searchLower) ||
        bar.vibe.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Category filters (AND logic)
      if (activeFilters.includes('trending') && bar.popularity < 70) return false;
      if (activeFilters.includes('lit') && (bar.litScore || 0) < 80) return false;
      if (activeFilters.includes('noWait') && bar.waitTime !== 'No wait') return false;
      if (activeFilters.includes('liveMusic') && !['🎸', '🎵'].includes(bar.emoji)) return false;

      // View mode filters
      if (viewMode === 'friends' && bar.friendsHere === 0) return false;
      // In 'bars' or 'all' mode, we show everything that matches other filters

      return true;
    });
  }, [searchQuery, activeFilters, viewMode]);
  const sortedBars = [...filteredBars].sort((a, b) => b.popularity - a.popularity);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={darkMapStyle}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {/* Heatmap/Crowd Glow circles */}
        {(viewMode === 'all' || viewMode === 'bars') && filteredBars.map((bar) => {
          const color = getNeonColor(bar.popularity);
          return (
            <React.Fragment key={`glow-group-${bar.id}`}>
              <Circle
                center={{ latitude: bar.latitude, longitude: bar.longitude }}
                radius={getGlowRadius(bar.popularity)}
                fillColor={`${color}15`}
                strokeColor="transparent"
              />
              <Circle
                center={{ latitude: bar.latitude, longitude: bar.longitude }}
                radius={getGlowRadius(bar.popularity) * 0.4}
                fillColor={`${color}25`}
                strokeColor="transparent"
              />
            </React.Fragment>
          );
        })}

        {/* Bar markers - Color indicates crowd level */}
        {(viewMode === 'all' || viewMode === 'bars') && filteredBars.map((bar) => (
          <Marker
            key={`marker-${bar.id}`}
            coordinate={{ latitude: bar.latitude, longitude: bar.longitude }}
            onPress={() => setSelectedBar(bar)}
          >
            <View style={styles.markerContainer}>
              <View
                style={[
                  styles.markerDot,
                  {
                    backgroundColor: getNeonColor(bar.popularity),
                  }
                ]}
              />
            </View>
          </Marker>
        ))}

        {/* Individual Friend markers */}
        {(viewMode === 'all' || viewMode === 'friends') && MOCK_FRIENDS_LOCATIONS.map((friend) => (
          <Marker
            key={friend.id}
            coordinate={{ latitude: friend.latitude, longitude: friend.longitude }}
            title={friend.name}
            description={friend.status}
          >
            <View style={styles.friendMarkerContainer}>
              <Image source={{ uri: friend.avatar }} style={styles.friendMarkerAvatar} />
              <View style={styles.friendMarkerStatus}>
                <Text style={styles.friendMarkerText}>{friend.name}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* View Mode Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[styles.viewToggleButton, viewMode === 'all' && styles.viewToggleButtonActive]}
          onPress={() => {
            setViewMode('all');
            setSearchQuery('');
            setActiveFilters([]);
          }}
        >
          <Text style={[styles.viewToggleText, viewMode === 'all' && styles.viewToggleTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewToggleButton, viewMode === 'bars' && styles.viewToggleButtonActive]}
          onPress={() => {
            setViewMode('bars');
            setSearchQuery('');
            setActiveFilters([]);
          }}
        >
          <Text style={[styles.viewToggleText, viewMode === 'bars' && styles.viewToggleTextActive]}>Bars</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewToggleButton, viewMode === 'friends' && styles.viewToggleButtonActive]}
          onPress={() => {
            setViewMode('friends');
            setSearchQuery('');
            setActiveFilters([]);
          }}
        >
          <Text style={[styles.viewToggleText, viewMode === 'friends' && styles.viewToggleTextActive]}>Friends</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.text.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search bars, vibes..."
          placeholderTextColor={Colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilters.includes(filter.id) && styles.filterChipActive
            ]}
            onPress={() => toggleFilter(filter.id)}
          >
            <Text style={[
              styles.filterChipText,
              activeFilters.includes(filter.id) && styles.filterChipTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* View Mode Toggle */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => {
          if (location) {
            mapRef.current?.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }, 500);
          }
        }}
      >
        <Ionicons name="locate" size={22} color={Colors.neon.cyan} />
      </TouchableOpacity>

      {/* Draggable Bar List (Google Maps style) */}
      <Animated.View style={[styles.listContainer, { height: listHeight }]}>
        {/* Drag Handle */}
        <TouchableOpacity style={styles.dragHandle} onPress={toggleList}>
          <View style={styles.dragIndicator} />
          <Text style={styles.listTitle}>
            {isListExpanded ? 'Nearby Bars' : `${filteredBars.length} bars nearby`}
          </Text>
          <Ionicons
            name={isListExpanded ? 'chevron-down' : 'chevron-up'}
            size={20}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>

        {/* Bar List */}
        <ScrollView
          style={styles.barList}
          showsVerticalScrollIndicator={false}
        >
          {sortedBars.map((bar) => (
            <TouchableOpacity
              key={bar.id}
              style={[
                styles.barListItem,
                selectedBar?.id === bar.id && styles.barListItemSelected
              ]}
              onPress={() => selectBarFromList(bar)}
            >
              <Image
                source={{ uri: bar.image }}
                style={styles.barListImage}
              />
              <View style={styles.barListInfo}>
                <View style={styles.barListHeader}>
                  <Text style={styles.barListName} numberOfLines={1}>{bar.name}</Text>
                  {bar.friendsHere > 0 && (
                    <View style={styles.barListSocial}>
                      <AvatarStack avatars={bar.friendAvatars} count={bar.friendsHere} size={22} />
                    </View>
                  )}
                </View>
                <View style={styles.barListMeta}>
                  <Text style={styles.barListEmoji}>{bar.emoji}</Text>
                  <View
                    style={[
                      styles.barListVibeTag,
                      { backgroundColor: `${getNeonColor(bar.popularity)}20`, borderColor: getNeonColor(bar.popularity) }
                    ]}
                  >
                    <Text style={[styles.barListVibe, { color: getNeonColor(bar.popularity) }]}>
                      {bar.vibe}
                    </Text>
                  </View>
                  <Text style={styles.barListWait}>{bar.waitTime}</Text>
                </View>
                {bar.litScore !== undefined && (
                  <LitMeter score={bar.litScore} size="sm" label="Lit" />
                )}
                {/* Projection info */}
                <View style={styles.projectionRow}>
                  <Text style={styles.projectionLabel}>📈 Peak: {bar.projectedPeak}</Text>
                  <Text style={styles.projectionLabel}>⏱️ Est: {bar.projectedWait}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.miniCheckIn}
                onPress={() => router.push(`/checkin/${bar.id}`)}
              >
                <Text style={styles.miniCheckInText}>Check In</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Enhanced Bar Details View */}
      <BarDetails
        bar={selectedBar}
        isVisible={!!selectedBar}
        onClose={() => setSelectedBar(null)}
      />

      {/* Selected Bar Card (HIDDEN - Replaced by BarDetails) */}
      {/* {selectedBar && !isListExpanded && ( ... )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark[900],
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerFriendStack: {
    position: 'absolute',
    top: -12,
    right: -15,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  remainingBadge: {
    backgroundColor: Colors.dark[700],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  remainingText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: Typography.fontFamily.sansBold,
  },
  searchContainer: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark[800],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    paddingVertical: Spacing.sm,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  viewToggleContainer: {
    position: 'absolute',
    top: Spacing.xl + 60,
    left: Spacing.md,
    backgroundColor: Colors.dark[800],
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.dark[600],
    zIndex: 10,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  viewToggleText: {
    color: Colors.text.muted,
    fontSize: 12,
    fontWeight: Typography.fontWeight.semibold,
  },
  viewToggleTextActive: {
    color: '#fff',
  },
  friendMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendMarkerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary[400],
    backgroundColor: Colors.dark[700],
  },
  friendMarkerStatus: {
    backgroundColor: 'rgba(15, 15, 26, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  friendMarkerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  filterContainer: {
    position: 'absolute',
    top: Spacing.xl + 105,
    left: 0,
    right: 0,
    maxHeight: 44,
  },
  filterContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    backgroundColor: Colors.dark[800],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.dark[600],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  filterChipActive: {
    backgroundColor: Colors.traffic.veryHigh,
    borderColor: Colors.traffic.veryHigh,
  },
  filterChipText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.sansMedium,
  },
  filterChipTextActive: {
    color: Colors.text.primary,
  },
  locationButton: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.dark[800]}ee`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark[600],
  },
  // Draggable List Styles
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.dark[900], // Match main background for seamless look
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.dark[700],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  dragHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, // More breathing room
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  dragIndicator: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: Colors.dark[600],
    borderRadius: 2,
  },
  listTitle: {
    flex: 1,
    fontSize: Typography.fontSize.lg, // Larger title
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginLeft: Spacing.xs,
    marginTop: Spacing.xs,
  },
  barList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  barListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md, // Increased padding
    marginBottom: Spacing.sm, // Spacing between items
    borderRadius: BorderRadius.xl, // Rounded corners for hover effect
    // Removed borderBottomWidth to use whitespace instead
    gap: Spacing.md,
  },
  barListItemSelected: {
    backgroundColor: Colors.dark[800], // Subtle highlight
    paddingHorizontal: Spacing.md,
    marginHorizontal: -Spacing.md,
  },
  barListDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  barListInfo: {
    flex: 1,
  },
  barListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, // More space
    gap: Spacing.sm,
  },
  barListSocial: {
    flexShrink: 0,
  },
  friendsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.primary[500]}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  friendsIndicatorText: {
    color: Colors.primary[400],
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  projectionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 6,
  },
  projectionLabel: {
    color: Colors.text.muted,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  barListImage: {
    width: 64, // Larger images
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.dark[600],
  },
  barListName: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  barListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  barListEmoji: {
    fontSize: 16,
  },
  barListVibeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  barListVibe: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold, // Bolder vibe text
  },
  barListWait: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary, // Slightly lighter than muted
    fontWeight: Typography.fontWeight.medium,
  },
  miniCheckIn: {
    backgroundColor: `${Colors.primary[500]}15`, // Subtle button
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: `${Colors.primary[500]}50`,
  },
  miniCheckInText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary[400],
  },
  // Selected Bar Card
  barCard: {
    position: 'absolute',
    bottom: 240, // Moved up slightly
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.dark[800],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg, // More padding
    borderWidth: 1,
    borderColor: Colors.dark[700],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  barCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  barInfo: {
    flex: 1,
  },
  barTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  barCardDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  barName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  barMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: 0, // Reset indentation
    marginTop: 4,
  },
  vibeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  waitText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
  closeButton: {
    padding: Spacing.xs,
    backgroundColor: Colors.dark[700],
    borderRadius: BorderRadius.full,
  },
  barActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark[700], // Subtle separator
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.xs,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  checkInText: {
    color: '#fff',
    fontSize: Typography.fontSize.sm,
  },
});
