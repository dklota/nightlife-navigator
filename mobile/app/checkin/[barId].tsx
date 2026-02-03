import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { VIBE_EMOJIS, WAIT_TIME_OPTIONS } from '../../src/types';

// Mock bar data - will be fetched from Supabase
const MOCK_BAR = {
    id: '1',
    name: 'The Grad',
    address: '805 Russell Blvd, Davis, CA',
};

type Visibility = 'public' | 'friends' | 'private';

export default function CheckInScreen() {
    const { barId } = useLocalSearchParams<{ barId: string }>();

    const [selectedWaitTime, setSelectedWaitTime] = useState<number | null>(null);
    const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [visibility, setVisibility] = useState<Visibility>('friends');
    const [media, setMedia] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const newMedia = result.assets.map(asset => asset.uri);
            setMedia([...media, ...newMedia].slice(0, 4)); // Max 4 media items
        }
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your camera');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        });

        if (!result.canceled) {
            setMedia([...media, result.assets[0].uri].slice(0, 4));
        }
    };

    const handleSubmit = async () => {
        if (selectedWaitTime === null) {
            Alert.alert('Required', 'Please select a wait time');
            return;
        }
        if (!selectedVibe) {
            Alert.alert('Required', 'Please select a vibe');
            return;
        }

        setIsSubmitting(true);

        // TODO: Submit to Supabase
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);

        // Navigate to deals page after successful check-in
        router.replace(`/deals/${barId}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Check In</Text>
                    <Text style={styles.barName}>📍 {MOCK_BAR.name}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Step 1: Wait Time */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Text style={styles.stepNumber}>1.</Text> How long was the wait?
                    </Text>
                    <View style={styles.optionsGrid}>
                        {WAIT_TIME_OPTIONS.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionCard,
                                    selectedWaitTime === index && styles.optionCardSelected,
                                ]}
                                onPress={() => setSelectedWaitTime(index)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    selectedWaitTime === index && styles.optionTextSelected,
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Step 2: Vibe */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Text style={styles.stepNumber}>2.</Text> What's the vibe?
                    </Text>
                    <View style={styles.vibeGrid}>
                        {VIBE_EMOJIS.map((vibe) => (
                            <TouchableOpacity
                                key={vibe.emoji}
                                style={[
                                    styles.vibeCard,
                                    selectedVibe === vibe.emoji && styles.vibeCardSelected,
                                ]}
                                onPress={() => setSelectedVibe(vibe.emoji)}
                            >
                                <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
                                <Text style={[
                                    styles.vibeLabel,
                                    selectedVibe === vibe.emoji && styles.vibeLabelSelected,
                                ]}>
                                    {vibe.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Step 3: Comment (Optional) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Text style={styles.stepNumber}>3.</Text> Add a comment <Text style={styles.optional}>(optional)</Text>
                    </Text>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="What's happening?"
                        placeholderTextColor={Colors.text.muted}
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        maxLength={280}
                    />
                    <Text style={styles.charCount}>{comment.length}/280</Text>
                </View>

                {/* Media */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Add photos/videos <Text style={styles.optional}>(optional)</Text></Text>
                    <View style={styles.mediaButtons}>
                        <TouchableOpacity style={styles.mediaButton} onPress={handleTakePhoto}>
                            <Ionicons name="camera" size={24} color={Colors.primary[400]} />
                            <Text style={styles.mediaButtonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mediaButton} onPress={handlePickImage}>
                            <Ionicons name="images" size={24} color={Colors.primary[400]} />
                            <Text style={styles.mediaButtonText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    {media.length > 0 && (
                        <Text style={styles.mediaCount}>{media.length} item(s) selected</Text>
                    )}
                </View>

                {/* Visibility */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Who can see this?</Text>
                    <View style={styles.visibilityOptions}>
                        {(['public', 'friends', 'private'] as Visibility[]).map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.visibilityOption,
                                    visibility === option && styles.visibilityOptionSelected,
                                ]}
                                onPress={() => setVisibility(option)}
                            >
                                <Ionicons
                                    name={
                                        option === 'public' ? 'globe' :
                                            option === 'friends' ? 'people' : 'lock-closed'
                                    }
                                    size={20}
                                    color={visibility === option ? Colors.primary[400] : Colors.text.secondary}
                                />
                                <Text style={[
                                    styles.visibilityText,
                                    visibility === option && styles.visibilityTextSelected,
                                ]}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={Colors.text.primary} />
                    ) : (
                        <>
                            <Text style={styles.submitText}>Check In</Text>
                            <Ionicons name="checkmark-circle" size={22} color={Colors.text.primary} />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
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
        paddingTop: 60,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.dark[800],
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark[600],
    },
    backButton: {
        padding: Spacing.sm,
        marginRight: Spacing.sm,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    barName: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: Spacing.md,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    stepNumber: {
        color: Colors.primary[400],
    },
    optional: {
        color: Colors.text.muted,
        fontWeight: Typography.fontWeight.normal,
        fontSize: Typography.fontSize.sm,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    optionCard: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[900],
    },
    optionText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    optionTextSelected: {
        color: Colors.primary[400],
    },
    vibeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    vibeCard: {
        width: '23%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    vibeCardSelected: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[900],
    },
    vibeEmoji: {
        fontSize: 28,
        marginBottom: 4,
    },
    vibeLabel: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
    },
    vibeLabelSelected: {
        color: Colors.primary[400],
    },
    commentInput: {
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        fontSize: Typography.fontSize.base,
        color: Colors.text.primary,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        color: Colors.text.muted,
        fontSize: Typography.fontSize.xs,
        marginTop: Spacing.xs,
    },
    mediaButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    mediaButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.dark[700],
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.dark[600],
        borderStyle: 'dashed',
    },
    mediaButtonText: {
        color: Colors.primary[400],
        fontSize: Typography.fontSize.base,
    },
    mediaCount: {
        color: Colors.success,
        fontSize: Typography.fontSize.sm,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    visibilityOptions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    visibilityOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        backgroundColor: Colors.dark[700],
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    visibilityOptionSelected: {
        borderColor: Colors.primary[500],
    },
    visibilityText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
    visibilityTextSelected: {
        color: Colors.primary[400],
    },
    footer: {
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.dark[800],
        borderTopWidth: 1,
        borderTopColor: Colors.dark[600],
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.primary[500],
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
    },
});
