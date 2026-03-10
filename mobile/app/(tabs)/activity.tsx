import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/services/supabase';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

type ActivityItem = {
    id: string;
    vibe_emoji: string | null;
    wait_time_min: number;
    wait_time_max: number;
    comment: string | null;
    photo_url: string | null;
    created_at: string;
    user_id: string | null;
    visibility: string;
    userName: string;
    barName: string;
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function formatWait(min: number, max: number): string {
    if (max <= 5)   return 'No wait';
    if (max >= 90)  return '60+ min';
    return `${min}–${max} min`;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Deterministic avatar color from name
const AVATAR_COLORS = [
    Colors.primary[600],
    '#1a6b3c',
    '#b45309',
    '#1d4ed8',
    '#7c3aed',
    '#be185d',
];
function avatarColor(name: string): string {
    const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
}

async function fetchActivity(currentUserId?: string): Promise<ActivityItem[]> {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const select = 'id, vibe_emoji, wait_time_min, wait_time_max, comment, created_at, user_id, visibility, bars(name), checkin_media(media_url)';

    // Always fetch public posts
    const { data: publicPosts } = await supabase
        .from('checkins')
        .select(select)
        .eq('visibility', 'public')
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false })
        .limit(50);

    let friendsPosts: any[] = [];

    // Fetch friends-only posts if logged in
    if (currentUserId) {
        const { data: friendships } = await supabase
            .from('friendships')
            .select('friend_id')
            .eq('user_id', currentUserId)
            .eq('status', 'accepted');

        const friendIds = (friendships ?? []).map((f: any) => f.friend_id);

        if (friendIds.length) {
            const { data: fp } = await supabase
                .from('checkins')
                .select(select)
                .eq('visibility', 'friends')
                .in('user_id', friendIds)
                .gte('created_at', cutoff)
                .order('created_at', { ascending: false })
                .limit(50);
            friendsPosts = fp ?? [];
        }
    }

    const checkins = [...(publicPosts ?? []), ...friendsPosts]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 50);

    if (!checkins.length) return [];

    // Batch-fetch user names
    const userIds = [...new Set(checkins.map((c: any) => c.user_id).filter(Boolean))] as string[];
    let userMap: Record<string, string> = {};
    if (userIds.length) {
        const { data: users } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', userIds);
        userMap = Object.fromEntries((users ?? []).map((u: any) => [u.id, u.full_name]));
    }

    return checkins.map((c: any) => ({
        id: c.id,
        vibe_emoji: c.vibe_emoji,
        wait_time_min: c.wait_time_min,
        wait_time_max: c.wait_time_max,
        comment: c.comment,
        photo_url: c.checkin_media?.[0]?.media_url ?? null,
        created_at: c.created_at,
        user_id: c.user_id,
        visibility: c.visibility,
        userName: c.user_id ? (userMap[c.user_id] ?? 'Someone') : 'Someone',
        barName: c.bars?.name ?? 'a bar',
    }));
}

function ActivityCard({ item }: { item: ActivityItem }) {
    const initials = getInitials(item.userName);
    const bgColor  = avatarColor(item.userName);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: bgColor }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.checkedInText} numberOfLines={1}>
                        checked in at{' '}
                        <Text style={styles.barName}>{item.barName}</Text>
                    </Text>
                </View>
                <Text style={styles.timeAgo}>{timeAgo(item.created_at)}</Text>
            </View>

            <View style={styles.metaRow}>
                {item.vibe_emoji ? (
                    <View style={styles.vibeBadge}>
                        <Text style={styles.vibeEmoji}>{item.vibe_emoji}</Text>
                    </View>
                ) : null}
                <View style={styles.waitBadge}>
                    <Ionicons name="time-outline" size={13} color={Colors.text.muted} />
                    <Text style={styles.waitText}>
                        {formatWait(item.wait_time_min, item.wait_time_max)}
                    </Text>
                </View>
            </View>

            {item.comment ? (
                <Text style={styles.comment}>"{item.comment}"</Text>
            ) : null}

            {item.photo_url ? (
                <Image source={{ uri: item.photo_url }} style={styles.photo} resizeMode="cover" />
            ) : null}
        </View>
    );
}

function EmptyState() {
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎤</Text>
            <Text style={styles.emptyTitle}>Be the first to show the move!</Text>
            <Text style={styles.emptyDesc}>
                Check in at a bar and your crew will see it here in real time.
            </Text>
        </View>
    );
}

export default function ActivityScreen() {
    const [feed, setFeed]           = useState<ActivityItem[]>([]);
    const [loading, setLoading]     = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuthStore();

    const load = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        const data = await fetchActivity(user?.id);
        setFeed(data);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        load();

        // Live updates — re-fetch when a new check-in is inserted
        const channel = supabase
            .channel('activity-feed')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'checkins' },
                () => load()
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [load]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color={Colors.primary[400]} size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={feed}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ActivityCard item={item} />}
                contentContainerStyle={[styles.list, feed.length === 0 && styles.listEmpty]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyState />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => load(true)}
                        tintColor={Colors.primary[400]}
                    />
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
    centered: {
        flex: 1,
        backgroundColor: Colors.dark[900],
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        padding: Spacing.md,
        paddingTop: Spacing.lg,
    },
    listEmpty: {
        flex: 1,
        justifyContent: 'center',
    },

    // Card
    card: {
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.bold,
    },
    headerInfo: {
        flex: 1,
        marginLeft: Spacing.sm,
        marginRight: Spacing.sm,
    },
    userName: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
    },
    checkedInText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    barName: {
        color: Colors.primary[400],
        fontWeight: Typography.fontWeight.medium,
    },
    timeAgo: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
        alignSelf: 'flex-start',
    },

    // Meta row
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.dark[700],
    },
    vibeBadge: {
        backgroundColor: Colors.dark[700],
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    vibeEmoji: {
        fontSize: 18,
    },
    waitBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.dark[700],
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.md,
    },
    waitText: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
    },
    comment: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
        fontStyle: 'italic',
        marginTop: Spacing.sm,
        lineHeight: 20,
    },
    photo: {
        width: '100%',
        height: 200,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.sm,
    },

    // Empty state
    empty: {
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    emptyIcon: {
        fontSize: 52,
        marginBottom: Spacing.lg,
    },
    emptyTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    emptyDesc: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
