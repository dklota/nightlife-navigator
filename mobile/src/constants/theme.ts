// App theme colors and styling constants
export const Colors = {
    // Primary brand colors
    primary: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1', // Main primary
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
    },

    // Secondary accent colors
    secondary: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef', // Main secondary
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
    },

    // Dark theme backgrounds
    dark: {
        900: '#0f0f1a',
        800: '#1a1a2e',
        700: '#252542',
        600: '#2f2f4a',
        500: '#3d3d5c',
    },

    // Light theme backgrounds
    light: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
    },

    // Semantic colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Traffic/Heatmap colors - Neon Nights palette (electric blue to hot pink)
    traffic: {
        low: '#22d3ee',       // Cyan - chill
        medium: '#00d4ff',    // Electric blue - warming up
        high: '#8b5cf6',      // Purple - busy
        veryHigh: '#ff0080',  // Hot pink - packed
    },

    // Neon glow colors for effects
    neon: {
        green: '#00ff88',
        cyan: '#00d4ff',
        magenta: '#ff00ff',
        pink: '#ff0055',
        purple: '#8b5cf6',
        blue: '#3b82f6',
    },

    // Text colors
    text: {
        primary: '#ffffff',
        secondary: '#a1a1aa',
        muted: '#71717a',
        inverse: '#18181b',
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
        sans: 'Outfit_400Regular',
        sansMedium: 'Outfit_500Medium',
        sansSemibold: 'Outfit_600SemiBold',
        sansBold: 'Outfit_700Bold',
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
