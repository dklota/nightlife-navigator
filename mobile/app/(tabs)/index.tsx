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
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';

import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

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
    popularity: 75,
    waitTime: '15-30 min',
    vibe: 'Busy',
    emoji: '🍺',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Wiki Bar',
    latitude: 38.54380,
    longitude: -121.73980,
    popularity: 60,
    waitTime: '5-10 min',
    vibe: 'Moderate',
    emoji: '🍹',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Parkside Sports Bar & Grill',
    latitude: 38.54440,
    longitude: -121.74120,
    popularity: 45,
    waitTime: 'No wait',
    vibe: 'Chill',
    emoji: '🏈',
    image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=200&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'University of Beer',
    latitude: 38.54350,
    longitude: -121.73850,
    popularity: 85,
    waitTime: '20-30 min',
    vibe: 'Packed',
    emoji: '🍻',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&h=200&fit=crop',
  },
  {
    id: '7',
    name: "Sophia's Thai Bar & Kitchen",
    latitude: 38.54365,
    longitude: -121.73895,
    popularity: 40,
    waitTime: 'No wait',
    vibe: 'Chill',
    emoji: '🍜',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
  },
  {
    id: '8',
    name: "Woodstock's Pizza Davis",
    latitude: 38.54435,
    longitude: -121.74085,
    popularity: 70,
    waitTime: '10-15 min',
    vibe: 'Busy',
    emoji: '🍕',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
  },
];

// Get neon color based on popularity
const getNeonColor = (popularity: number) => {
  if (popularity >= 80) return Colors.traffic.veryHigh; // Neon pink
  if (popularity >= 60) return Colors.traffic.high;     // Neon magenta
  if (popularity >= 40) return Colors.traffic.medium;   // Neon cyan
  return Colors.traffic.low;                            // Neon green
};

// Get glow radius based on popularity
const getGlowRadius = (popularity: number) => {
  const baseRadius = 50;
  return baseRadius + (popularity * 0.6);
};

export default function ExploreScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedBar, setSelectedBar] = useState<typeof MOCK_BARS[0] | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const mapRef = useRef<MapView>(null);

  const listHeight = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

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

  // Sort bars by popularity (most popular first)
  const sortedBars = [...MOCK_BARS].sort((a, b) => b.popularity - a.popularity);

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
        {/* Heatmap glow circles */}
        {MOCK_BARS.map((bar) => (
          <React.Fragment key={`heatmap-${bar.id}`}>
            {/* Outer glow */}
            <Circle
              center={{ latitude: bar.latitude, longitude: bar.longitude }}
              radius={getGlowRadius(bar.popularity)}
              fillColor={`${getNeonColor(bar.popularity)}15`}
              strokeColor="transparent"
            />
            {/* Middle glow */}
            <Circle
              center={{ latitude: bar.latitude, longitude: bar.longitude }}
              radius={getGlowRadius(bar.popularity) * 0.6}
              fillColor={`${getNeonColor(bar.popularity)}25`}
              strokeColor="transparent"
            />
            {/* Inner glow */}
            <Circle
              center={{ latitude: bar.latitude, longitude: bar.longitude }}
              radius={getGlowRadius(bar.popularity) * 0.3}
              fillColor={`${getNeonColor(bar.popularity)}40`}
              strokeColor="transparent"
            />
          </React.Fragment>
        ))}

        {/* Bar markers - Simple colored dots */}
        {MOCK_BARS.map((bar) => (
          <Marker
            key={bar.id}
            coordinate={{ latitude: bar.latitude, longitude: bar.longitude }}
            onPress={() => setSelectedBar(bar)}
          >
            <View style={styles.markerContainer}>
              <View
                style={[
                  styles.markerDot,
                  {
                    backgroundColor: getNeonColor(bar.popularity),
                    shadowColor: getNeonColor(bar.popularity),
                  }
                ]}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.traffic.low }]} />
          <Text style={styles.legendText}>Chill</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.traffic.medium }]} />
          <Text style={styles.legendText}>Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.traffic.high }]} />
          <Text style={styles.legendText}>Busy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.traffic.veryHigh }]} />
          <Text style={styles.legendText}>Packed</Text>
        </View>
      </View>

      {/* My Location Button */}
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
            {isListExpanded ? 'Nearby Bars' : `${MOCK_BARS.length} bars nearby`}
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
                <Text style={styles.barListName}>{bar.name}</Text>
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

      {/* Selected Bar Card (appears when tapping marker) */}
      {selectedBar && !isListExpanded && (
        <View style={styles.barCard}>
          <View style={styles.barCardHeader}>
            <View style={styles.barInfo}>
              <View style={styles.barTitleRow}>
                <View
                  style={[
                    styles.barCardDot,
                    { backgroundColor: getNeonColor(selectedBar.popularity) }
                  ]}
                />
                <Text style={styles.barName}>{selectedBar.name}</Text>
              </View>
              <View style={styles.barMeta}>
                <Text style={[styles.vibeText, { color: getNeonColor(selectedBar.popularity) }]}>
                  {selectedBar.vibe}
                </Text>
                <Text style={styles.waitText}>• {selectedBar.waitTime}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedBar(null)}
            >
              <Ionicons name="close" size={22} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Skip the Line - Only for packed bars */}
          {selectedBar.popularity >= 80 && (
            <TouchableOpacity
              style={styles.skipLineCard}
              onPress={() => {
                alert('Skip the Line Purchased!\n\nShow this confirmation to the door staff.\n\nValid for tonight only at ' + selectedBar.name);
              }}
            >
              <View style={styles.skipLineLeft}>
                <View style={styles.skipLineBadge}>
                  <Ionicons name="flash" size={16} color="#000" />
                </View>
                <View>
                  <Text style={styles.skipLineTitle}>Skip the Line</Text>
                  <Text style={styles.skipLineSubtitle}>Only 3 spots left tonight!</Text>
                </View>
              </View>
              <View style={styles.skipLineRight}>
                <Text style={styles.skipLinePrice}>$10</Text>
                <Text style={styles.skipLinePer}>/night</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.barActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="navigate" size={18} color={Colors.neon.cyan} />
              <Text style={[styles.actionText, { color: Colors.neon.cyan }]}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.checkInButton, { backgroundColor: getNeonColor(selectedBar.popularity) }]}
              onPress={() => router.push(`/checkin/${selectedBar.id}`)}
            >
              <Text style={styles.checkInText}>Check In</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  legend: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.md,
    backgroundColor: `${Colors.dark[800]}ee`,
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark[600],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginVertical: 2,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.xs,
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
    backgroundColor: Colors.dark[800],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.dark[600],
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  dragIndicator: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: Colors.dark[500],
    borderRadius: 2,
  },
  listTitle: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
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
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark[600],
    gap: Spacing.sm,
  },
  barListItemSelected: {
    backgroundColor: `${Colors.dark[700]}80`,
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  barListDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  barListInfo: {
    flex: 1,
  },
  barListImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark[600],
  },
  barListName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  barListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  barListEmoji: {
    fontSize: 16,
  },
  barListVibeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  barListVibe: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  barListWait: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  miniCheckIn: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  miniCheckInText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: '#fff',
  },
  // Selected Bar Card
  barCard: {
    position: 'absolute',
    bottom: 200,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: `${Colors.dark[800]}f5`,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark[600],
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
    marginBottom: 4,
  },
  barCardDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  barName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  barMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginLeft: 22,
  },
  vibeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  waitText: {
    color: Colors.text.muted,
    fontSize: Typography.fontSize.sm,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  barActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark[600],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  checkInText: {
    color: '#fff',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  // Skip the Line styles
  skipLineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${Colors.neon.green}15`,
    borderWidth: 1,
    borderColor: Colors.neon.green,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginTop: Spacing.md,
  },
  skipLineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  skipLineBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neon.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLineTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neon.green,
  },
  skipLineSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
  skipLineRight: {
    alignItems: 'flex-end',
  },
  skipLinePrice: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neon.green,
  },
  skipLinePer: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.muted,
  },
});
