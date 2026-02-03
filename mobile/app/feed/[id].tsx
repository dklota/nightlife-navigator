import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

// Reuse mock data (in a real app, this would be a shared state/fetch)
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
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&fit=crop',
            'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&fit=crop'
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
            'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&fit=crop'
        ],
    },
];

const MOCK_COMMENTS = [
    { id: 'c1', user: 'Jamie Vough', text: 'On my way now! Save me a spot 🍻', timestamp: '5 min ago', avatar: 'https://i.pravatar.cc/150?u=jamie' },
    { id: 'c2', user: 'Sam Wilson', text: 'Is it already packed?', timestamp: '2 min ago', avatar: 'https://i.pravatar.cc/150?u=sam' },
];

export default function FeedDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const item = MOCK_ACTIVITY.find(a => a.id === id) || MOCK_ACTIVITY[0];

    const [replies, setReplies] = useState(MOCK_COMMENTS);
    const [inputText, setInputText] = useState('');

    const sendReply = () => {
        if (inputText.trim() === '') return;
        const newReply = {
            id: Date.now().toString(),
            user: 'Me',
            text: inputText,
            timestamp: 'Just now',
            avatar: 'https://i.pravatar.cc/150?u=me'
        };
        setReplies([...replies, newReply]);
        setInputText('');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Main Post */}
                <View style={styles.mainPost}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                        <View style={styles.userMeta}>
                            <Text style={styles.userName}>{item.user.name}</Text>
                            <Text style={styles.statusText}>checked in at <Text style={styles.barName}>{item.bar}</Text></Text>
                        </View>
                        <Text style={styles.timeAgo}>{item.createdAt}</Text>
                    </View>

                    <Text style={styles.commentText}>"{item.comment}"</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.vibeBadge}>
                            <Text style={styles.vibeText}>{item.vibe} {item.waitTime}</Text>
                        </View>
                    </View>
                </View>

                {/* Full View Photos */}
                {item.media && item.media.length > 0 && (
                    <View style={styles.photoSection}>
                        <FlatList
                            data={item.media}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(img, idx) => idx.toString()}
                            renderItem={({ item: img }) => (
                                <View style={styles.photoCard}>
                                    <Image source={{ uri: img }} style={styles.fullImage} resizeMode="cover" />
                                </View>
                            )}
                        />
                        {item.media.length > 1 && (
                            <View style={styles.paginationDots}>
                                {item.media.map((_, i) => (
                                    <View key={i} style={[styles.dot, i === 0 && styles.activeDot]} />
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Responses Section */}
                <View style={styles.responsesContainer}>
                    <Text style={styles.sectionTitle}>Replies</Text>
                    {replies.map((reply) => (
                        <View key={reply.id} style={styles.replyCard}>
                            <Image source={{ uri: reply.avatar }} style={styles.smallAvatar} />
                            <View style={styles.replyContent}>
                                <View style={styles.replyHeader}>
                                    <Text style={styles.replyUser}>{reply.user}</Text>
                                    <Text style={styles.replyTime}>{reply.timestamp}</Text>
                                </View>
                                <Text style={styles.replyText}>{reply.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Reply Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Write a reply..."
                        placeholderTextColor={Colors.text.muted}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity onPress={sendReply} disabled={!inputText.trim()} style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark[900],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark[700],
        backgroundColor: Colors.dark[800],
    },
    backButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    mainPost: {
        padding: Spacing.md,
        backgroundColor: Colors.dark[800],
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.dark[600],
    },
    userMeta: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    userName: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.bold,
    },
    statusText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
    barName: {
        color: Colors.primary[400],
        fontWeight: Typography.fontWeight.semibold,
    },
    timeAgo: {
        color: Colors.text.muted,
        fontSize: Typography.fontSize.xs,
    },
    commentText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.lg,
        marginTop: Spacing.md,
        fontStyle: 'italic',
        lineHeight: 24,
    },
    statsRow: {
        marginTop: Spacing.md,
    },
    vibeBadge: {
        backgroundColor: Colors.dark[700],
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    vibeText: {
        color: Colors.primary[400],
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    photoSection: {
        marginVertical: Spacing.md,
    },
    photoCard: {
        width: width,
        height: 350,
    },
    fullImage: {
        width: '100%',
        height: '100%',
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.sm,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.dark[600],
    },
    activeDot: {
        backgroundColor: Colors.primary[400],
        width: 12,
    },
    responsesContainer: {
        padding: Spacing.md,
    },
    sectionTitle: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.md,
    },
    replyCard: {
        flexDirection: 'row',
        marginBottom: Spacing.lg,
    },
    smallAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.dark[700],
    },
    replyContent: {
        flex: 1,
        marginLeft: Spacing.md,
        backgroundColor: Colors.dark[700],
        padding: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    replyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    replyUser: {
        color: Colors.text.primary,
        fontWeight: Typography.fontWeight.bold,
        fontSize: Typography.fontSize.sm,
    },
    replyTime: {
        color: Colors.text.muted,
        fontSize: 10,
    },
    replyText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.sm,
        lineHeight: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.dark[800],
        borderTopWidth: 1,
        borderTopColor: Colors.dark[700],
        paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.md,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.dark[900],
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: '#fff',
        fontSize: Typography.fontSize.base,
        borderWidth: 1,
        borderColor: Colors.dark[600],
    },
    sendButton: {
        marginLeft: Spacing.sm,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
    },
});
