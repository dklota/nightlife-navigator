// User types
export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    student_verified: boolean;
    student_email?: string;
    verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface UserProfile extends User {
    bio?: string;
    university?: string;
    graduation_year?: number;
}

// Bar types
export interface Bar {
    id: string;
    name: string;
    description?: string;
    address: string;
    latitude: number;
    longitude: number;
    vibe: string;
    waitTime: string;
    emoji: string;
    photos: string[];
    rating: number;
    price_level: 1 | 2 | 3 | 4; // $ to $$$$
    hours: BarHours;
    phone?: string;
    website?: string;
    created_at: string;
    litScore?: number; // 0-100
    energy?: 'chill' | 'active' | 'high' | 'insane';
    coverFee?: string;
    studentDiscount?: string;
    communityPhotos?: string[];
}

export interface BarHours {
    monday?: DayHours;
    tuesday?: DayHours;
    wednesday?: DayHours;
    thursday?: DayHours;
    friday?: DayHours;
    saturday?: DayHours;
    sunday?: DayHours;
}

export interface DayHours {
    open: string;  // e.g., "18:00"
    close: string; // e.g., "02:00"
}

// Check-in types
export interface CheckIn {
    id: string;
    user_id: string;
    bar_id: string;
    wait_time_min: number;  // e.g., 0
    wait_time_max: number;  // e.g., 15
    vibe_emoji: string;     // e.g., "🔥"
    comment?: string;
    visibility: 'public' | 'friends' | 'private';
    created_at: string;
    bar?: Bar;
    user?: User;
    media?: CheckInMedia[];
}

export interface CheckInMedia {
    id: string;
    checkin_id: string;
    media_url: string;
    media_type: 'photo' | 'video';
    created_at: string;
}

// Deal types
export interface Deal {
    id: string;
    bar_id: string;
    title: string;
    description: string;
    discount_type: 'percentage' | 'fixed' | 'bogo' | 'other';
    discount_value?: number;
    valid_from: string;
    valid_until: string;
    terms?: string;
    requires_checkin: boolean;
    created_at: string;
    bar?: Bar;
}

// Friendship types
export interface Friendship {
    id: string;
    user_id: string;
    friend_id: string;
    status: 'pending' | 'accepted' | 'declined';
    created_at: string;
    friend?: User;
}

// Location types
export interface Location {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
}

export interface FriendLocation {
    user_id: string;
    user: User;
    bar_id?: string;
    bar?: Bar;
    checked_in_at?: string;
    location_sharing: boolean;
}

// Traffic/Heatmap types
export interface BarTraffic {
    bar_id: string;
    hour: number;  // 0-23
    day_of_week: number; // 0-6 (Sunday-Saturday)
    avg_checkins: number;
    popularity_score: number; // 0-100
}

export interface LiveTraffic {
    bar_id: string;
    current_checkins: number;
    trend: 'rising' | 'stable' | 'declining';
    updated_at: string;
}

// Lit Meter types
export interface LitMetrics {
    crowd_density: number; // 0-100
    energy_level: number; // 0-100
    dancing_activity: number; // 0-100
    noise_level: number; // 0-100
}

// Auth types
export interface AuthState {
    user: User | null;
    session: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isStudentVerified: boolean;
}

// Vibe emoji options
export const VIBE_EMOJIS = [
    { emoji: '🔥', label: 'Lit' },
    { emoji: '🎉', label: 'Party' },
    { emoji: '😎', label: 'Chill' },
    { emoji: '💃', label: 'Dancing' },
    { emoji: '🍺', label: 'Drinking' },
    { emoji: '👥', label: 'Crowded' },
    { emoji: '🎵', label: 'Live Music' },
    { emoji: '💀', label: 'Dead' },
] as const;

// Wait time options (in minutes)
export const WAIT_TIME_OPTIONS = [
    { min: 0, max: 5, label: 'No wait' },
    { min: 5, max: 15, label: '5-15 min' },
    { min: 15, max: 30, label: '15-30 min' },
    { min: 30, max: 45, label: '30-45 min' },
    { min: 45, max: 60, label: '45-60 min' },
    { min: 60, max: 999, label: '60+ min' },
] as const;
