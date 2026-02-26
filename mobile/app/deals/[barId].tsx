import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

const { width, height } = Dimensions.get('window');

const MOCK_BAR_NAMES: Record<string, string> = {
    '1': 'G St Wunderbar',
    '2': 'Wiki Bar',
    '3': 'Parkside Sports Bar & Grill',
    '4': 'Shipwrecked Tiki Bar',
    '5': 'University of Beer',
    '6': "Bull 'N Mouth",
    '7': "Sophia's Thai Bar & Kitchen",
    '8': "Woodstock's Pizza Davis",
};

const POINTS_PER_CHECKIN = 10;
const MOCK_PREVIOUS_POINTS = 50; // replaced with real user data later

const CONFETTI_COLORS = [
    Colors.primary[400],
    Colors.neon.magenta,
    Colors.neon.green,
    Colors.neon.cyan,
    Colors.warning,
    Colors.neon.pink,
];

function ConfettiParticle({
    color,
    delay,
    startX,
    size,
    driftX,
    duration,
    isRect,
}: {
    color: string;
    delay: number;
    startX: number;
    size: number;
    driftX: number;
    duration: number;
    isRect: boolean;
}) {
    const translateY = useRef(new Animated.Value(-20)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height * 0.75,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: driftX,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(duration * 0.7),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: duration * 0.3,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ]).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', driftX > 0 ? '540deg' : '-540deg'],
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: startX,
                top: 0,
                width: size,
                height: isRect ? size * 2 : size,
                backgroundColor: color,
                borderRadius: isRect ? 2 : size / 2,
                transform: [{ translateY }, { translateX }, { rotate: spin }],
                opacity,
            }}
        />
    );
}

// Pre-generate stable confetti data so it doesn't re-randomize on render
const CONFETTI_PARTICLES = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i / 50) * 700,
    startX: (i / 50) * width + (i % 7) * 5,
    size: 6 + (i % 5),
    driftX: ((i % 2 === 0 ? 1 : -1) * (20 + (i % 60))),
    duration: 1800 + (i % 10) * 150,
    isRect: i % 3 === 0,
}));

export default function CheckInSuccessScreen() {
    const { barId } = useLocalSearchParams<{ barId: string }>();
    const barName = MOCK_BAR_NAMES[barId || '1'] || 'This Bar';

    const totalPoints = MOCK_PREVIOUS_POINTS + POINTS_PER_CHECKIN;
    const pointsToNextLevel = 100;
    const pointsInLevel = totalPoints % pointsToNextLevel;
    const level = Math.floor(totalPoints / pointsToNextLevel) + 1;
    const progressPercent = (pointsInLevel / pointsToNextLevel) * 100;

    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const pointsAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(pointsAnim, {
                toValue: 1,
                duration: 600,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.dark[800], Colors.dark[900]]}
                style={styles.gradient}
            >
                {/* Confetti layer */}
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    {CONFETTI_PARTICLES.map(p => (
                        <ConfettiParticle
                            key={p.id}
                            color={p.color}
                            delay={p.delay}
                            startX={p.startX}
                            size={p.size}
                            driftX={p.driftX}
                            duration={p.duration}
                            isRect={p.isRect}
                        />
                    ))}
                </View>

                {/* Main content */}
                <Animated.View
                    style={[
                        styles.content,
                        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    {/* Check icon */}
                    <View style={styles.iconRing}>
                        <Ionicons name="checkmark-circle" size={88} color={Colors.neon.green} />
                    </View>

                    <Text style={styles.title}>You're Checked In!</Text>
                    <Text style={styles.barName}>{barName}</Text>

                    {/* Points card */}
                    <Animated.View
                        style={[styles.pointsCard, { opacity: pointsAnim }]}
                    >
                        <Text style={styles.pointsBadge}>+{POINTS_PER_CHECKIN} pts</Text>
                        <Text style={styles.pointsSubLabel}>earned for this check-in</Text>

                        <View style={styles.divider} />

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{totalPoints}</Text>
                                <Text style={styles.statLabel}>Total Points</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>Lv. {level}</Text>
                                <Text style={styles.statLabel}>Level</Text>
                            </View>
                        </View>

                        {/* Progress to next level */}
                        <View style={styles.progressSection}>
                            <View style={styles.progressLabels}>
                                <Text style={styles.progressText}>
                                    {pointsInLevel}/{pointsToNextLevel} to Level {level + 1}
                                </Text>
                            </View>
                            <View style={styles.progressTrack}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progressPercent}%` },
                                    ]}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </Animated.View>

                {/* Action buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.stayButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="location-outline" size={20} color={Colors.text.primary} />
                        <Text style={styles.stayButtonText}>Stay Here</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Ionicons name="map-outline" size={20} color={Colors.primary[400]} />
                        <Text style={styles.mapButtonText}>Back to Map</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: 80,
    },
    iconRing: {
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    barName: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
    },
    pointsCard: {
        width: '100%',
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.dark[600],
        alignItems: 'center',
    },
    pointsBadge: {
        fontSize: 48,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neon.green,
        letterSpacing: -1,
    },
    pointsSubLabel: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.muted,
        marginTop: 2,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.dark[600],
        marginVertical: Spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginBottom: Spacing.lg,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    statLabel: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: Colors.dark[600],
    },
    progressSection: {
        width: '100%',
        gap: Spacing.sm,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    progressText: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
    },
    progressTrack: {
        width: '100%',
        height: 6,
        backgroundColor: Colors.dark[600],
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary[500],
        borderRadius: BorderRadius.full,
    },
    footer: {
        flexDirection: 'row',
        gap: Spacing.md,
        padding: Spacing.xl,
        paddingBottom: Spacing.xl + 16,
    },
    stayButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.primary[500],
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
    },
    stayButtonText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
    },
    mapButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.dark[700],
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.primary[500],
    },
    mapButtonText: {
        color: Colors.primary[400],
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
    },
});
