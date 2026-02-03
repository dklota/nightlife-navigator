import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

export default function ProfileScreen() {
    const { user, isStudentVerified, signOut } = useAuthStore();

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: signOut },
            ]
        );
    };

    const menuItems = [
        { icon: 'stats-chart', label: 'My Stats', onPress: () => { } },
        { icon: 'bookmark', label: 'Saved Bars', onPress: () => { } },
        { icon: 'gift', label: 'My Deals', onPress: () => { } },
        { icon: 'settings', label: 'Settings', onPress: () => { } },
        { icon: 'help-circle', label: 'Help & Support', onPress: () => { } },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.full_name?.charAt(0) || 'U'}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.full_name || 'User'}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                {isStudentVerified ? (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                        <Text style={styles.verifiedText}>Student Verified</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.verifyButton}
                        onPress={() => router.push('/(auth)/verify-student')}
                    >
                        <Text style={styles.verifyButtonText}>Verify Student Status</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Stats */}
            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Check-ins</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>Friends</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Deals Used</Text>
                </View>
            </View>

            {/* Menu */}
            <View style={styles.menu}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <Ionicons name={item.icon as any} size={22} color={Colors.text.secondary} />
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sign Out */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={22} color={Colors.error} />
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            {/* App Version */}
            <Text style={styles.version}> WTM v1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark[900],
    },
    header: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary[600],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    avatarText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
    },
    name: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    email: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.secondary,
        marginTop: Spacing.xs,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        backgroundColor: Colors.dark[700],
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginTop: Spacing.md,
    },
    verifiedText: {
        color: Colors.success,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    verifyButton: {
        backgroundColor: Colors.secondary[600],
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginTop: Spacing.md,
    },
    verifyButtonText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.dark[800],
        marginHorizontal: Spacing.md,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    statLabel: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
        marginTop: Spacing.xs,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.dark[600],
    },
    menu: {
        marginTop: Spacing.lg,
        marginHorizontal: Spacing.md,
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark[600],
    },
    menuLabel: {
        flex: 1,
        marginLeft: Spacing.md,
        fontSize: Typography.fontSize.base,
        color: Colors.text.primary,
    },
    signOutButton: {
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
        fontSize: Typography.fontSize.sm,
        marginTop: Spacing.xl,
        marginBottom: Spacing['2xl'],
    },
});
