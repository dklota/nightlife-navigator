import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

export default function FriendsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.iconWrap}>
                    <Ionicons name="people" size={40} color={Colors.primary[400]} />
                </View>
                <Text style={styles.title}>Friends</Text>
                <Text style={styles.subtitle}>coming soon</Text>
                <Text style={styles.desc}>
                    See where your crew is tonight, share your move, and find friends at the same spot.
                </Text>
                <View style={styles.featureList}>
                    {[
                        { icon: 'location', text: 'See friends live on the map' },
                        { icon: 'notifications', text: 'Get notified when friends check in' },
                        { icon: 'chatbubble', text: 'Plan the night together' },
                    ].map((f, i) => (
                        <View key={i} style={styles.featureRow}>
                            <Ionicons name={f.icon as any} size={16} color={Colors.primary[500]} />
                            <Text style={styles.featureText}>{f.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark[900],
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    card: {
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark[700],
    },
    iconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(128,39,186,0.15)',
        borderWidth: 1,
        borderColor: Colors.primary[700],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: Typography.fontSize.sm,
        color: Colors.primary[400],
        letterSpacing: 3,
        textTransform: 'lowercase',
        marginBottom: Spacing.lg,
    },
    desc: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.xl,
    },
    featureList: {
        width: '100%',
        gap: Spacing.md,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.dark[700],
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    featureText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
});
