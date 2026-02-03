import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Image,
    SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

// Mock data for messages
const INITIAL_MESSAGES = [
    { id: '1', text: "Hey! What's the scene at G St right now?", sender: 'friend', timestamp: '10:05 PM' },
    { id: '2', text: "It's starting to pick up! Line is about 15 mins.", sender: 'me', timestamp: '10:06 PM' },
    { id: '3', text: "Sweet, might head over soon. Jordan is there too?", sender: 'friend', timestamp: '10:07 PM' },
];

// We would normally fetch friend details by ID
const getFriendById = (id: string) => {
    const friends = [
        { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=alex', location: 'G St Wunderbar' },
        { id: '2', name: 'Sam Wilson', avatar: 'https://i.pravatar.cc/150?u=sam', location: null },
        { id: '3', name: 'Jordan Lee', avatar: 'https://i.pravatar.cc/150?u=jordan', location: "Woodstock's Pizza" },
        { id: '5', name: 'Taylor Smith', avatar: 'https://i.pravatar.cc/150?u=taylor', location: 'Shipwrecked Tiki Bar' },
        { id: '6', name: 'Morgan Chen', avatar: 'https://i.pravatar.cc/150?u=morgan', location: 'Shipwrecked Tiki Bar' },
        { id: '7', name: 'Jamie Vough', avatar: 'https://i.pravatar.cc/150?u=jamie', location: 'University of Beer' },
    ];
    return friends.find(f => f.id === id) || friends[0];
};

export default function ChatScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const friend = getFriendById(id as string);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMessage]);
        setInputText('');

        // Auto-reply mock
        setTimeout(() => {
            const reply = {
                id: (Date.now() + 1).toString(),
                text: "Bet! See ya there 🍻",
                sender: 'friend',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    const renderMessage = ({ item }: { item: typeof INITIAL_MESSAGES[0] }) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[
                styles.messageBubble,
                isMe ? styles.myBubble : styles.friendBubble
            ]}>
                {!isMe && (
                    <Image source={{ uri: friend.avatar }} style={styles.miniAvatar} />
                )}
                <View style={[
                    styles.bubbleContent,
                    isMe ? styles.myBubbleContent : styles.friendBubbleContent
                ]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Chat Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Image source={{ uri: friend.avatar }} style={styles.headerAvatar} />
                    <View>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        {friend.location && (
                            <Text style={styles.friendStatus}>📍 At {friend.location}</Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.headerAction}>
                    <Ionicons name="videocam" size={22} color={Colors.primary[400]} />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachmentButton}>
                        <Ionicons name="add" size={24} color={Colors.text.muted} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Text about the scene..."
                        placeholderTextColor={Colors.text.muted}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />

                    {inputText.length > 0 ? (
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.cameraButton}>
                            <Ionicons name="camera" size={24} color={Colors.text.muted} />
                        </TouchableOpacity>
                    )}
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
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark[700],
        backgroundColor: Colors.dark[800],
    },
    backButton: {
        padding: Spacing.xs,
        marginRight: Spacing.xs,
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.dark[600],
    },
    friendName: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
    },
    friendStatus: {
        fontSize: 10,
        color: Colors.primary[400],
        fontWeight: Typography.fontWeight.medium,
    },
    headerAction: {
        padding: Spacing.xs,
    },
    messageList: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    messageBubble: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        maxWidth: '80%',
    },
    myBubble: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    friendBubble: {
        alignSelf: 'flex-start',
    },
    miniAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
        alignSelf: 'flex-end',
    },
    bubbleContent: {
        padding: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    myBubbleContent: {
        backgroundColor: Colors.primary[600],
        borderBottomRightRadius: 4,
    },
    friendBubbleContent: {
        backgroundColor: Colors.dark[700],
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: '#fff',
        fontSize: Typography.fontSize.base,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.dark[800],
        borderTopWidth: 1,
        borderTopColor: Colors.dark[700],
        paddingBottom: Platform.OS === 'ios' ? 20 : Spacing.sm,
    },
    attachmentButton: {
        padding: Spacing.xs,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.dark[900],
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        color: '#fff',
        marginHorizontal: Spacing.xs,
        fontSize: Typography.fontSize.base,
        borderWidth: 1,
        borderColor: Colors.dark[600],
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraButton: {
        padding: Spacing.xs,
    }
});
