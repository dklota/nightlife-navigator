import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';
import { VIBE_EMOJIS, WAIT_TIME_OPTIONS } from '../../src/types';

const { width } = Dimensions.get('window');

// Mock bar data - will be fetched from Supabase
const MOCK_BARS = [
    {
        id: '1',
        name: 'G St Wunderbar',
        address: '228 G St, Davis, CA',
    },
    {
        id: '2',
        name: 'Wiki Bar',
        address: '215 G St, Davis, CA',
    },
    {
        id: '3',
        name: 'Parkside Sports Bar & Grill',
        address: '330 G St, Davis, CA',
    },
    {
        id: '4',
        name: 'Shipwrecked Tiki Bar',
        address: '228 G St, Davis, CA',
    },
    {
        id: '5',
        name: 'University of Beer',
        address: '615 3rd St, Davis, CA',
    },
    {
        id: '6',
        name: "Bull 'N Mouth",
        address: '117 E St, Davis, CA',
    },
    {
        id: '7',
        name: "Sophia's Thai Bar & Kitchen",
        address: '129 E St, Davis, CA',
    },
    {
        id: '8',
        name: "Woodstock's Pizza Davis",
        address: '219 G St, Davis, CA',
    },
];

type Visibility = 'public' | 'friends' | 'private';

export default function CheckInScreen() {
    const { barId } = useLocalSearchParams<{ barId: string }>();
    const bar = MOCK_BARS.find(b => b.id === barId) || MOCK_BARS[0];

    // State
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedWaitTime, setSelectedWaitTime] = useState<number | null>(null);
    const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
    const [energyLevel, setEnergyLevel] = useState<number>(50); // 0-100
    const [comment, setComment] = useState('');
    const [visibility, setVisibility] = useState<Visibility>('friends');
    const [media, setMedia] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { title: 'Wait Time', description: 'How long was the wait?' },
        { title: 'Vibe', description: "What's the vibe?" },
        { title: 'Energy', description: "How lit is it?" },
        { title: 'Media', description: 'Add photos/videos' },
        { title: 'Details', description: 'Add a comment' },
    ];

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

    const handleNext = () => {
        if (currentStep === 0 && selectedWaitTime === null) {
            Alert.alert('Required', 'Please select a wait time');
            return;
        }
        if (currentStep === 1 && !selectedVibe) {
            Alert.alert('Required', 'Please select a vibe');
            return;
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // TODO: Submit to Supabase
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        router.replace(`/deals/${barId}`);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View style={styles.stepContainer}>
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
                );
            case 1:
                return (
                    <View style={styles.stepContainer}>
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
                );
            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <View style={styles.energySliderContainer}>
                            <Text style={[styles.energyValue, { color: energyLevel >= 80 ? Colors.traffic.veryHigh : Colors.primary[400] }]}>
                                {energyLevel >= 80 ? '🔥 INSANE' : energyLevel >= 50 ? '⚡ HIGH' : '😎 CHILL'}
                            </Text>
                            <View style={styles.energyOptions}>
                                {[20, 50, 80, 100].map((level) => (
                                    <TouchableOpacity
                                        key={level}
                                        style={[
                                            styles.energyCard,
                                            energyLevel === level && styles.energyCardSelected,
                                        ]}
                                        onPress={() => setEnergyLevel(level)}
                                    >
                                        <Text style={[
                                            styles.energyLabel,
                                            energyLevel === level && styles.energyLabelSelected,
                                        ]}>
                                            {level === 20 ? 'Chill' : level === 50 ? 'Active' : level === 80 ? 'High' : 'Insane'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.energySubtext}>
                                Reporting high energy updates the Lit Meter for everyone!
                            </Text>
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.optionalText}>(optional)</Text>
                        <View style={styles.mediaButtons}>
                            <TouchableOpacity style={styles.mediaButton} onPress={handleTakePhoto}>
                                <Ionicons name="camera" size={32} color={Colors.primary[400]} />
                                <Text style={styles.mediaButtonText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.mediaButton} onPress={handlePickImage}>
                                <Ionicons name="images" size={32} color={Colors.primary[400]} />
                                <Text style={styles.mediaButtonText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                        {media.length > 0 && (
                            <View style={styles.mediaPreviewContainer}>
                                <Text style={styles.mediaCount}>{media.length} item(s) selected</Text>
                            </View>
                        )}
                    </View>
                );
            case 4:
                return (
                    <View style={styles.stepContainer}>
                        <Text style={styles.optionalText}>(optional)</Text>
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

                        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Who can see this?</Text>
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
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name={currentStep > 0 ? "arrow-back" : "close"} size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Check In</Text>
                    <Text style={styles.barName}>📍 {bar.name}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                {steps.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressDot,
                            index === currentStep && styles.progressDotActive,
                            index < currentStep && styles.progressDotCompleted,
                        ]}
                    />
                ))}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.stepTitle}>{steps[currentStep].description}</Text>
                {renderStepContent()}
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.nextButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleNext}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={Colors.text.primary} />
                    ) : (
                        <Text style={styles.nextButtonText}>
                            {currentStep === steps.length - 1 ? 'Check In' : 'Next'}
                        </Text>
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
        backgroundColor: Colors.dark[900], // Seamless header
    },
    backButton: {
        padding: Spacing.sm,
        width: 40,
    },
    headerInfo: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
    },
    barName: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    progressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingBottom: Spacing.xl,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.dark[700],
    },
    progressDotActive: {
        backgroundColor: Colors.primary[500],
        width: 24, // Elongated active dot
    },
    progressDotCompleted: {
        backgroundColor: Colors.primary[800],
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    stepTitle: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    stepContainer: {
        flex: 1,
    },
    optionalText: {
        color: Colors.text.muted,
        textAlign: 'center',
        marginTop: -Spacing.lg,
        marginBottom: Spacing.xl,
    },
    // Option Cards (Wait Time)
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        justifyContent: 'center',
    },
    optionCard: {
        width: '48%',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        backgroundColor: Colors.dark[700],
        borderColor: Colors.primary[500],
    },
    optionText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },
    optionTextSelected: {
        color: Colors.text.primary,
        fontWeight: Typography.fontWeight.bold,
    },
    // Vibe Cards
    vibeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        justifyContent: 'center',
    },
    vibeCard: {
        width: '30%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    vibeCardSelected: {
        backgroundColor: Colors.dark[700],
        borderColor: Colors.primary[500],
    },
    vibeEmoji: {
        fontSize: 32,
        marginBottom: Spacing.xs,
    },
    vibeLabel: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
    },
    vibeLabelSelected: {
        color: Colors.primary[400],
    },
    // Media
    mediaButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
    mediaButton: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.xl,
        gap: Spacing.sm,
    },
    mediaButtonText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.sm,
    },
    mediaPreviewContainer: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    mediaCount: {
        color: Colors.success,
        fontSize: Typography.fontSize.sm,
    },
    // Comments & Visibility
    commentInput: {
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        fontSize: Typography.fontSize.base,
        color: Colors.text.primary,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        color: Colors.text.muted,
        fontSize: Typography.fontSize.xs,
        marginTop: Spacing.xs,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.primary,
        fontWeight: Typography.fontWeight.medium,
        marginBottom: Spacing.md,
    },
    visibilityOptions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    visibilityOption: {
        flex: 1,
        padding: Spacing.md,
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    visibilityOptionSelected: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.dark[700],
    },
    visibilityText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.xs,
    },
    visibilityTextSelected: {
        color: Colors.primary[400],
    },
    // Footer
    footer: {
        padding: Spacing.xl,
        paddingBottom: Spacing.xl + 20,
    },
    nextButton: {
        backgroundColor: Colors.primary[500], // Purple
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full, // Pill shape
        alignItems: 'center',
    },
    nextButtonText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    // Energy Styles
    energySliderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xl,
    },
    energyValue: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: Typography.fontWeight.bold,
        letterSpacing: 1,
    },
    energyOptions: {
        width: '100%',
        gap: Spacing.md,
    },
    energyCard: {
        paddingVertical: Spacing.lg,
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    energyCardSelected: {
        backgroundColor: Colors.dark[700],
        borderColor: Colors.primary[500],
    },
    energyLabel: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },
    energyLabelSelected: {
        color: Colors.text.primary,
        fontWeight: Typography.fontWeight.bold,
    },
    energySubtext: {
        color: Colors.text.muted,
        fontSize: Typography.fontSize.xs,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },
});
