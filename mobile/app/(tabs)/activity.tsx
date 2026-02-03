import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

// Mock data - replace with Supabase
const MOCK_ACTIVITY = [
    {
        id: '1',
        user: { name: 'Alex Johnson', avatar: null },
        bar: 'The Grad',
        vibe: '🔥',
        waitTime: '15-30 min',
        comment: 'DJ is going crazy tonight!',
        visibility: 'public',
        createdAt: '10 min ago',
        mediaCount: 2,
    },
    {
        id: '2',
        user: { name: 'Jordan Lee', avatar: null },
        bar: 'Woodstocks Pizza',
        vibe: '🎉',
        waitTime: 'No wait',
        comment: null,
        visibility: 'friends',
        createdAt: '25 min ago',
        mediaCount: 0,
    },
    {
        id: '3',
        user: { name: 'Sam Wilson', avatar: null },
        bar: 'Davis Beer Shoppe',
        vibe: '😎',
        waitTime: '5-15 min',
        comment: 'Great craft beer selection',
        visibility: 'public',
        createdAt: '1 hour ago',
        mediaCount: 1,
    },
];

export default function ActivityScreen() {
    const renderActivity = ({ item }: { item: typeof MOCK_ACTIVITY[0] }) => (
        <View style={styles.activityCard}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.userName}>{item.user.name}</Text>
                    <Text style={styles.checkedInText}>
                        checked in at <Text style={styles.barName}>{item.bar}</Text>
                    </Text>
                </View>
                <Text style={styles.timeAgo}>{item.createdAt}</Text>
            </View>

            {/* Vibe & Wait */}
            <View style={styles.vibeRow}>
                <View style={styles.vibeBadge}>
                    <Text style={styles.vibeEmoji}>{item.vibe}</Text>
                </View>
                <Text style={styles.waitTime}>⏱️ {item.waitTime}</Text>
                {item.visibility === 'friends' && (
                    <View style={styles.friendsOnlyBadge}>
                        <Ionicons name="people" size={12} color={Colors.text.secondary} />
                        <Text style={styles.friendsOnlyText}>Friends only</Text>
                    </View>
                )}
            </View>

            {/* Comment */}
            {item.comment && (
                <Text style={styles.comment}>"{item.comment}"</Text>
            )}

            {/* Media indicator */}
            {item.mediaCount > 0 && (
                <View style={styles.mediaRow}>
                    <Ionicons name="images" size={16} color={Colors.text.muted} />
                    <Text style={styles.mediaText}>{item.mediaCount} photo{item.mediaCount > 1 ? 's' : ''}</Text>
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="heart-outline" size={22} color={Colors.text.secondary} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={22} color={Colors.text.secondary} />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="navigate-outline" size={22} color={Colors.text.secondary} />
                    <Text style={styles.actionText}>Go</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={MOCK_ACTIVITY}
                renderItem={renderActivity}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No recent activity</Text>
                        <Text style={styles.emptySubtext}>Check-ins from your friends will appear here</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark[900],
    },
    list: {
        padding: Spacing.md,
    },
    activityCard: {
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary[600],
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.bold,
    },
    headerInfo: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
    userName: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
    },
    checkedInText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
    },
    barName: {
        color: Colors.primary[400],
        fontWeight: Typography.fontWeight.medium,
    },
    timeAgo: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
    },
    vibeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.md,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.dark[600],
    },
    vibeBadge: {
        backgroundColor: Colors.dark[600],
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.md,
    },
    vibeEmoji: {
        fontSize: 20,
    },
    waitTime: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
    friendsOnlyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 'auto',
        backgroundColor: Colors.dark[600],
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    friendsOnlyText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.xs,
    },
    comment: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.primary,
        fontStyle: 'italic',
        marginTop: Spacing.sm,
    },
    mediaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: Spacing.sm,
    },
    mediaText: {
        color: Colors.text.muted,
        fontSize: Typography.fontSize.sm,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Spacing.md,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.dark[600],
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    actionText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
    empty: {
        alignItems: 'center',
        paddingVertical: Spacing['2xl'],
    },
    emptyText: {
        fontSize: Typography.fontSize.lg,
        color: Colors.text.secondary,
        marginBottom: Spacing.xs,
    },
    emptySubtext: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.muted,
    },
});
