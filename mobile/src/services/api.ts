import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Use the production URL if set, otherwise derive from Expo's Metro bundler host.
function getBaseUrl(): string {
    const prodUrl = process.env.EXPO_PUBLIC_API_URL;
    if (prodUrl) return prodUrl;

    if (Platform.OS === 'android') return 'http://10.0.2.2:8000';

    // Expo Go exposes the Metro host — reuse it for the backend port
    const metroHost =
        Constants.expoConfig?.hostUri ??
        (Constants as any).manifest?.debuggerHost;

    if (metroHost) {
        const host = metroHost.split(':')[0]; // strip Metro's port
        return `http://${host}:8000`;
    }

    return 'http://localhost:8000'; // fallback for simulators
}

const BASE_URL = getBaseUrl();

// Emoji + image overrides for known bars (display only — coordinates come from API)
const BAR_DISPLAY: Record<string, { emoji: string; image: string; coverFee?: string; studentDiscount?: string }> = {
    'G St Wunderbar':              { emoji: '🍺', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop', coverFee: '$5', studentDiscount: 'Free cover with .edu' },
    'Wiki Bar':                    { emoji: '🍹', image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=400&fit=crop' },
    'Parkside Sports Bar & Grill': { emoji: '🏈', image: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=400&h=400&fit=crop' },
    'Shipwrecked Tiki Bar':        { emoji: '🌴', image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=400&h=400&fit=crop', coverFee: '$10', studentDiscount: '$2 off drinks' },
    'University of Beer':          { emoji: '🍻', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop' },
    "Bull 'N Mouth":               { emoji: '🎸', image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&h=400&fit=crop' },
    "Sophia's Thai Bar & Kitchen": { emoji: '🍜', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop' },
    "Woodstock's Pizza Davis":     { emoji: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' },
};

const DEFAULT_DISPLAY = {
    emoji: '🍸',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop',
};

// City map regions for the explore screen
export const CITY_REGIONS: Record<string, { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }> = {
    'Davis, CA':    { latitude: 38.5440, longitude: -121.7400, latitudeDelta: 0.015, longitudeDelta: 0.015 },
    'San Jose, CA': { latitude: 37.3382, longitude: -121.8863, latitudeDelta: 0.06,  longitudeDelta: 0.06  },
};

export const CITIES = ['Davis, CA', 'San Jose, CA'] as const;
export type CityKey = typeof CITIES[number];

// Derive a 0-100 popularity score from wait time (minutes)
function waitToPopularity(mins: number): number {
    if (mins <= 0)  return 30;
    if (mins <= 10) return 50;
    if (mins <= 20) return 65;
    if (mins <= 30) return 75;
    if (mins <= 45) return 85;
    return 95;
}

// Derive a lit score from wait time
function waitToLitScore(mins: number): number {
    if (mins <= 0)  return 30;
    if (mins <= 10) return 48;
    if (mins <= 20) return 62;
    if (mins <= 30) return 75;
    if (mins <= 45) return 88;
    return 96;
}

// Derive energy label from wait time
function waitToEnergy(mins: number): 'chill' | 'active' | 'high' | 'insane' {
    if (mins <= 5)  return 'chill';
    if (mins <= 20) return 'active';
    if (mins <= 40) return 'high';
    return 'insane';
}

// Convert numeric wait minutes to display string
function waitToString(mins: number): string {
    if (mins <= 0)  return 'No wait';
    if (mins <= 10) return 'Under 10 min';
    if (mins <= 20) return '10-20 min';
    if (mins <= 30) return '20-30 min';
    if (mins <= 45) return '30-45 min';
    if (mins <= 60) return '45-60 min';
    return '60+ min';
}

export type DisplayBar = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    emoji: string;
    image: string;
    waitTime: string;
    vibe: string;
    popularity: number;
    litScore: number;
    energy: 'chill' | 'active' | 'high' | 'insane';
    friendsHere: number;
    friendAvatars: string[];
    friendNames: string[];
    projectedPeak: string;
    projectedWait: string;
    projectedCrowd: number;
    coverFee?: string;
    studentDiscount?: string;
    communityPhotos?: string[];
};

function transformBar(apiBar: any): DisplayBar {
    const display = BAR_DISPLAY[apiBar.name] ?? DEFAULT_DISPLAY;
    const waitMins: number = apiBar.current_wait_time ?? 0;

    return {
        id: apiBar.id,
        name: apiBar.name,
        address: apiBar.address,
        // Coordinates come from the API (populated by seed script)
        latitude: apiBar.latitude ?? CITY_REGIONS['Davis, CA'].latitude,
        longitude: apiBar.longitude ?? CITY_REGIONS['Davis, CA'].longitude,
        emoji: display.emoji,
        image: display.image,
        waitTime: waitToString(waitMins),
        vibe: apiBar.current_vibe ?? 'Chill',
        popularity: waitToPopularity(waitMins),
        litScore: waitToLitScore(waitMins),
        energy: waitToEnergy(waitMins),
        friendsHere: 0,
        friendAvatars: [],
        friendNames: [],
        projectedPeak: '--',
        projectedWait: '--',
        projectedCrowd: 0,
        coverFee: display.coverFee,
        studentDiscount: display.studentDiscount,
    };
}

export async function fetchBars(city?: string): Promise<DisplayBar[]> {
    const params = city ? `?city=${encodeURIComponent(city)}` : '';
    const response = await fetch(`${BASE_URL}/api/bars${params}`);
    if (!response.ok) throw new Error(`Failed to fetch bars: ${response.status}`);
    const data: any[] = await response.json();
    // Only show bars that have coordinates
    return data.filter(b => b.latitude && b.longitude).map(transformBar);
}

export type CheckInPayload = {
    bar_id: string;
    wait_time_min: number;
    wait_time_max: number;
    energy_level: number;
    vibe_emoji?: string;
    comment?: string;
    visibility?: 'public' | 'friends' | 'private';
};

export async function submitCheckin(payload: CheckInPayload): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed to submit check-in: ${response.status}`);
}
