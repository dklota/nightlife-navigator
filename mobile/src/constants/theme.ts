// App theme colors and styling constants
export const Colors = {
    // Primary brand colors - Simplistic Purple
    primary: {
        50: '#f4eafa',
        100: '#e6d1f4',
        200: '#cd9eee',
        300: '#b46be8',
        400: '#9d42e2',
        500: '#8027BA', // Main primary - Requested Purple
        600: '#6d219e',
        700: '#5a1b82',
        800: '#471566',
        900: '#340f4b',
    },

    // Secondary accent colors - Monochromatic/Silver for simplistic feel
    secondary: {
        50: '#fcfcfc',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#52525b',
        700: '#404040',
        800: '#262626',
        900: '#171717',
    },

    // Dark theme backgrounds - Deep Black & Spotify Grey Surfaces
    dark: {
        900: '#000000', // Pure Black (Main Background)
        800: '#121212', // Spotify "Surface" (Cards, Headers)
        700: '#282828', // Lighter Surface (Elevated)
        600: '#1c1c1c',
        500: '#262626',
    },

    // Light theme backgrounds
    light: {
        50: '#ffffff',
        100: '#fafafa',
        200: '#f5f5f5',
        300: '#e5e5e5',
        400: '#d4d4d4',
    },

    // Semantic colors
    success: '#1ed760', // Spotify Green-ish for success
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#8027BA',

    // Traffic/Heatmap colors - Simplified Neon
    traffic: {
        low: '#282828',       // Dark grey - empty
        medium: '#4c1d6e',    // Deep purple - quiet
        high: '#8027BA',      // Main Purple - busy
        veryHigh: '#d946ef',  // Hot pink - packed (accent)
    },

    // Neon glow colors for effects
    neon: {
        green: '#1ed760',
        cyan: '#00d4ff',
        magenta: '#d946ef',
        pink: '#ff0080',
        purple: '#8027BA',
        blue: '#3b82f6',
    },

    // Text colors
    text: {
        primary: '#FFFFFF',   // Pure White
        secondary: '#B3B3B3', // Spotify Grey
        muted: '#A7A7A7',     // Slightly darker grey
        inverse: '#000000',
    },
};

// Light theme overrides
export const LightColors = {
    ...Colors,
    text: {
        primary: '#18181b',
        secondary: '#52525b',
        muted: '#71717a',
        inverse: '#ffffff',
    },
};

// Spacing scale
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
};

// Border radius
export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
};

// Typography
export const Typography = {
    fontFamily: {
        sans: 'Inter_400Regular',
        sansMedium: 'Inter_500Medium',
        sansSemibold: 'Inter_600SemiBold',
        sansBold: 'Inter_700Bold',
        mono: 'SpaceMono',
    },
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};
