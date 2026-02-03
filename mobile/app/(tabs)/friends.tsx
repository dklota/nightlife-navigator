import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

// Mock data - replace with Supabase
const MOCK_FRIENDS = [
    { id: '1', name: 'Alex Johnson', avatar: null, location: 'The Grad', checkedInAt: '10 min ago' },
    { id: '2', name: 'Sam Wilson', avatar: null, location: null, lastSeen: '2 hours ago' },
    { id: '3', name: 'Jordan Lee', avatar: null, location: 'Woodstocks Pizza', checkedInAt: '25 min ago' },
];

const FRIEND_REQUESTS = [
    { id: '4', name: 'Taylor Smith', avatar: null, mutualFriends: 3 },
];

export default function FriendsScreen() {
    const renderFriend = ({ item }: { item: typeof MOCK_FRIENDS[0] }) => (
        <TouchableOpacity style={styles.friendCard}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name}</Text>
                {item.location ? (
                    <View style={styles.locationRow}>
                        <View style={styles.liveBadge}>
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                        <Text style={styles.locationText}>📍 {item.location}</Text>
                        <Text style={styles.timeText}>{item.checkedInAt}</Text>
                    </View>
                ) : (
                    <Text style={styles.offlineText}>Last seen {item.lastSeen}</Text>
                )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
        </TouchableOpacity>
    );

    const renderRequest = ({ item }: { item: typeof FRIEND_REQUESTS[0] }) => (
        <View style={styles.requestCard}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.mutualText}>{item.mutualFriends} mutual friends</Text>
            </View>
            <View style={styles.requestActions}>
                <TouchableOpacity style={styles.acceptBtn}>
                    <Ionicons name="checkmark" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn}>
                    <Ionicons name="close" size={20} color={Colors.text.secondary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Add Friend Button */}
            <TouchableOpacity style={styles.addButton}>
                <Ionicons name="person-add" size={20} color={Colors.primary[400]} />
                <Text style={styles.addButtonText}>Add Friends</Text>
            </TouchableOpacity>

            {/* Friend Requests */}
            {FRIEND_REQUESTS.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Friend Requests</Text>
                    <FlatList
                        data={FRIEND_REQUESTS}
                        renderItem={renderRequest}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                </View>
            )}

            {/* Friends List */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Friends ({MOCK_FRIENDS.length})</Text>
                <FlatList
                    data={MOCK_FRIENDS}
                    renderItem={renderFriend}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark[900],
        padding: Spacing.md,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.dark[700],
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.primary[500],
        borderStyle: 'dashed',
    },
    addButtonText: {
        color: Colors.primary[400],
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    friendCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark[800],
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark[700],
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary[600],
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
    },
    friendInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    friendName: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: 2,
    },
    liveBadge: {
        backgroundColor: Colors.success,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: BorderRadius.sm,
    },
    liveText: {
        color: 'white',
        fontSize: 10,
        fontWeight: Typography.fontWeight.bold,
    },
    locationText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
    timeText: {
        color: Colors.text.muted,
        fontSize: Typography.fontSize.xs,
    },
    offlineText: {
        color: Colors.text.muted,
        fontSize: Typography.fontSize.sm,
    },
    mutualText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
    requestActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    acceptBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.dark[600],
        alignItems: 'center',
        justifyContent: 'center',
    },
});
