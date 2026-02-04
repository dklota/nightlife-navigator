import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface LitMeterProps {
    score: number; // 0-100
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const LitMeter: React.FC<LitMeterProps> = ({ score, label = 'Lit Level', size = 'md' }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: score / 100,
            duration: 1500,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: false,
        }).start();

        if (score >= 80) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseValue, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseValue, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [score]);

    const getStatusColor = () => {
        if (score >= 80) return Colors.traffic.veryHigh; // Hot pink
        if (score >= 50) return Colors.traffic.high; // Purple
        return Colors.traffic.medium; // Blue
    };

    const color = getStatusColor();
    const barWidth = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const isSmall = size === 'sm';
    const isLarge = size === 'lg';

    return (
        <View style={[styles.container, isSmall && styles.containerSmall]}>
            <View style={styles.header}>
                <View style={styles.labelRow}>
                    <Text style={[styles.label, isSmall && styles.labelSmall]}>{label}</Text>
                    {score >= 80 && (
                        <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
                            <Ionicons name="flame" size={isSmall ? 12 : 16} color={color} />
                        </Animated.View>
                    )}
                </View>
                <Text style={[styles.scoreText, { color }, isSmall && styles.scoreTextSmall]}>
                    {score}%
                </Text>
            </View>
            <View style={[styles.meterTrack, isSmall && styles.meterTrackSmall]}>
                <Animated.View
                    style={[
                        styles.meterFill,
                        { width: barWidth, backgroundColor: color },
                        score >= 80 && styles.glow,
                        { shadowColor: color },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: Spacing.xs,
    },
    containerSmall: {
        marginVertical: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    label: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.secondary,
        fontWeight: Typography.fontWeight.medium,
    },
    labelSmall: {
        fontSize: 10,
    },
    scoreText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.bold,
    },
    scoreTextSmall: {
        fontSize: 10,
    },
    meterTrack: {
        height: 6,
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    meterTrackSmall: {
        height: 4,
    },
    meterFill: {
        height: '100%',
        borderRadius: BorderRadius.full,
    },
    glow: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },
});
