import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

// Mock data - replace with Supabase
const MOCK_ACTIVITY = [
    {
        id: '1',
        user: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=alex' },
        bar: 'G St Wunderbar',
        vibe: '🔥',
        waitTime: '15-30 min',
        comment: 'DJ is going crazy tonight!',
        visibility: 'public',
        createdAt: '10 min ago',
        media: [
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&fit=crop',
            'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&fit=crop'
        ],
    },
    {
        id: '2',
        user: { name: 'Jordan Lee', avatar: 'https://i.pravatar.cc/150?u=jordan' },
        bar: "Woodstock's Pizza",
        vibe: '🎉',
        waitTime: 'No wait',
        comment: 'Best pizza in Davis 🍕',
        visibility: 'friends',
        createdAt: '25 min ago',
        media: [],
    },
    {
        id: '3',
        user: { name: 'Taylor Smith', avatar: 'https://i.pravatar.cc/150?u=taylor' },
        bar: 'Shipwrecked Tiki Bar',
        vibe: '🍹',
        waitTime: '30-45 min',
        comment: 'Tiki drinks are 10/10!',
        visibility: 'public',
        createdAt: '1 hour ago',
        media: [
            'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=500&fit=crop'
        ],
    },
    {
        id: '4',
        user: { name: 'Jamie Vough', avatar: 'https://i.pravatar.cc/150?u=jamie' },
        bar: 'University of Beer',
        vibe: '🍻',
        waitTime: '5-10 min',
        comment: 'Huge tap list tonight.',
        visibility: 'public',
        createdAt: '2 hours ago',
        media: [],
    },
];

export default function ActivityScreen() {
    const router = useRouter();

    const renderActivity = ({ item }: { item: typeof MOCK_ACTIVITY[0] }) => (
        <TouchableOpacity
            style={styles.activityCard}
            onPress={() => router.push(`/feed/${item.id}`)}
        >
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    {item.user.avatar ? (
                        <Image source={{ uri: item.user.avatar }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
                    )}
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

            {/* Photos */}
            {item.media && item.media.length > 0 && (
                <View style={styles.mediaContainer}>
                    <FlatList
                        data={item.media}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(img, idx) => idx.toString()}
                        renderItem={({ item: img }) => (
                            <Image source={{ uri: img }} style={styles.feedImage} />
                        )}
                        style={styles.mediaList}
                    />
                </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="heart-outline" size={20} color={Colors.text.secondary} />
                    <Text style={styles.actionText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push(`/feed/${item.id}`)}
                >
                    <Ionicons name="chatbubble-outline" size={20} color={Colors.text.secondary} />
                    <Text style={styles.actionText}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="share-outline" size={20} color={Colors.text.secondary} />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary[600],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.lg,
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
    mediaContainer: {
        marginTop: Spacing.md,
    },
    mediaList: {
        borderRadius: BorderRadius.lg,
    },
    feedImage: {
        width: 200,
        height: 150,
        borderRadius: BorderRadius.lg,
        marginRight: Spacing.sm,
        backgroundColor: Colors.dark[700],
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
