import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { supabase } from '../../src/services/supabase';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

const LEVELS = [
    { level: 1, title: 'Night Owl',     emoji: '🦉', max: 5  },
    { level: 2, title: 'Bar Hopper',    emoji: '🍺', max: 15 },
    { level: 3, title: 'Scene Kid',     emoji: '🎭', max: 30 },
    { level: 4, title: 'Nightcrawler',  emoji: '🕺', max: 60 },
    { level: 5, title: 'Legend',        emoji: '👑', max: Infinity },
];

function getLevelInfo(checkins: number) {
    for (let i = 0; i < LEVELS.length; i++) {
        if (checkins < LEVELS[i].max) {
            const prev = LEVELS[i - 1]?.max ?? 0;
            return {
                ...LEVELS[i],
                current: checkins - prev,
                needed: LEVELS[i].max === Infinity ? 1 : LEVELS[i].max - prev,
                progress: LEVELS[i].max === Infinity ? 1 : (checkins - prev) / (LEVELS[i].max - prev),
            };
        }
    }
    return { ...LEVELS[4], current: 1, needed: 1, progress: 1 };
}

export default function ProfileScreen() {
    const { user, signOut } = useAuthStore();
    const [checkinCount, setCheckinCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('checkins')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .then(({ count }) => {
                    setCheckinCount(count ?? 0);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 2400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 2400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const levelInfo = getLevelInfo(checkinCount);
    const points = checkinCount * 10;

    const initials = user?.full_name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'U';

    const glowOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.65] });
    const glowScale  = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1,    1.12] });

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]);
    };

    const menuItems = [
        { icon: 'time-outline',     label: 'Check-in History', onPress: () => {} },
        { icon: 'bookmark-outline', label: 'Saved Bars',       onPress: () => {} },
        { icon: 'people-outline',   label: 'Friends',          onPress: () => router.push('/(tabs)/friends') },
        { icon: 'settings-outline', label: 'Settings',         onPress: () => {} },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* ── Hero Header ─────────────────────────────────────── */}
            <LinearGradient
                colors={['#2d0a4e', '#1a0430', '#000000']}
                locations={[0, 0.5, 1]}
                style={styles.hero}
            >
                {/* Ambient orb behind avatar */}
                <Animated.View
                    style={[
                        styles.ambientOrb,
                        { opacity: glowOpacity, transform: [{ scale: glowScale }] },
                    ]}
                />

                {/* Avatar */}
                <View style={styles.avatarWrap}>
                    <Animated.View
                        style={[
                            styles.avatarRing,
                            { opacity: glowOpacity, transform: [{ scale: glowScale }] },
                        ]}
                    />
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                </View>

                <Text style={styles.name}>{user?.full_name ?? 'User'}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                {/* Level badge */}
                <View style={styles.levelBadge}>
                    <Text style={styles.levelEmoji}>{levelInfo.emoji}</Text>
                    <Text style={styles.levelText}>Lvl {levelInfo.level} · {levelInfo.title}</Text>
                </View>

                {/* XP bar */}
                <View style={styles.xpWrap}>
                    <View style={styles.xpTrack}>
                        <LinearGradient
                            colors={[Colors.primary[400], Colors.neon.magenta]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                                styles.xpFill,
                                { width: `${Math.round(levelInfo.progress * 100)}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.xpLabel}>
                        {levelInfo.current} / {levelInfo.needed === Infinity ? '∞' : levelInfo.needed} check-ins to next level
                    </Text>
                </View>
            </LinearGradient>

            {/* ── Stats ───────────────────────────────────────────── */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{loading ? '—' : checkinCount}</Text>
                    <Text style={styles.statLabel}>Check-ins</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{loading ? '—' : points}</Text>
                    <Text style={styles.statLabel}>Points</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: Colors.primary[400] }]}>
                        {levelInfo.level}
                    </Text>
                    <Text style={styles.statLabel}>Level</Text>
                </View>
            </View>

            {/* ── Menu ────────────────────────────────────────────── */}
            <View style={styles.menu}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.menuItem,
                            index === menuItems.length - 1 && { borderBottomWidth: 0 },
                        ]}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuIconWrap}>
                            <Ionicons name={item.icon as any} size={20} color={Colors.primary[400]} />
                        </View>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={18} color={Colors.text.muted} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* ── Sign Out ────────────────────────────────────────── */}
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
                <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>WTM v0.1</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark[900],
    },

    // Hero
    hero: {
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: Spacing['2xl'],
        paddingHorizontal: Spacing.lg,
        overflow: 'hidden',
    },
    ambientOrb: {
        position: 'absolute',
        top: 10,
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: Colors.primary[600],
    },

    // Avatar
    avatarWrap: {
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    avatarRing: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: Colors.primary[500],
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.dark[800],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primary[400],
    },
    avatarText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
    },

    // Name / level
    name: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        textAlign: 'center',
    },
    email: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.muted,
        marginTop: 4,
        marginBottom: Spacing.md,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        backgroundColor: 'rgba(128,39,186,0.25)',
        borderWidth: 1,
        borderColor: Colors.primary[700],
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
        marginBottom: Spacing.lg,
    },
    levelEmoji: { fontSize: 16 },
    levelText: {
        color: Colors.primary[300],
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
    },

    // XP bar
    xpWrap: { width: '100%', gap: 6 },
    xpTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.dark[700],
        overflow: 'hidden',
    },
    xpFill: {
        height: '100%',
        borderRadius: 3,
    },
    xpLabel: {
        color: Colors.text.muted,
        fontSize: Typography.fontSize.xs,
        textAlign: 'center',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.dark[800],
        marginHorizontal: Spacing.md,
        marginTop: Spacing.lg,
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    statLabel: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.secondary,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.dark[600],
        marginVertical: 4,
    },

    // Menu
    menu: {
        marginHorizontal: Spacing.md,
        marginTop: Spacing.lg,
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark[700],
    },
    menuIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(128,39,186,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    menuLabel: {
        flex: 1,
        fontSize: Typography.fontSize.base,
        color: Colors.text.primary,
    },

    // Sign out
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        marginHorizontal: Spacing.md,
        padding: Spacing.md,
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.xl,
    },
    signOutText: {
        color: Colors.error,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },

    version: {
        textAlign: 'center',
        color: Colors.text.muted,
        fontSize: Typography.fontSize.xs,
        marginVertical: Spacing['2xl'],
    },
});
