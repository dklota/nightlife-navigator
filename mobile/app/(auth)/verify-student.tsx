import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

export default function VerifyStudentScreen() {
    const [studentEmail, setStudentEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { verifyStudentEmail, isStudentVerified } = useAuthStore();

    const handleVerify = async () => {
        if (!studentEmail) {
            Alert.alert('Error', 'Please enter your student email');
            return;
        }

        if (!studentEmail.endsWith('.edu')) {
            Alert.alert('Invalid Email', 'Please enter a valid .edu email address');
            return;
        }

        setIsLoading(true);
        const { error } = await verifyStudentEmail(studentEmail);
        setIsLoading(false);

        if (error) {
            Alert.alert('Verification Failed', error.message);
        } else {
            Alert.alert(
                'Verified! 🎉',
                'Your student status has been confirmed. Welcome to Nightlife Navigator!',
                [{ text: 'Let\'s Go!', onPress: () => router.replace('/(tabs)') }]
            );
        }
    };

    const handleSkip = () => {
        Alert.alert(
            'Skip Verification?',
            'Some features like exclusive deals will be locked without student verification. You can verify later in settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Skip for Now', onPress: () => router.replace('/(tabs)') },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.dark[900], Colors.dark[800]]}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>🎓</Text>
                        <Text style={styles.title}>Verify Student Status</Text>
                        <Text style={styles.subtitle}>
                            Unlock exclusive deals and features with your .edu email
                        </Text>
                    </View>

                    {/* Benefits */}
                    <View style={styles.benefits}>
                        <View style={styles.benefitItem}>
                            <Text style={styles.benefitIcon}>🎁</Text>
                            <View style={styles.benefitText}>
                                <Text style={styles.benefitTitle}>Exclusive Deals</Text>
                                <Text style={styles.benefitDesc}>Student-only discounts at bars</Text>
                            </View>
                        </View>
                        <View style={styles.benefitItem}>
                            <Text style={styles.benefitIcon}>👥</Text>
                            <View style={styles.benefitText}>
                                <Text style={styles.benefitTitle}>Find Classmates</Text>
                                <Text style={styles.benefitDesc}>Connect with students nearby</Text>
                            </View>
                        </View>
                        <View style={styles.benefitItem}>
                            <Text style={styles.benefitIcon}>⭐</Text>
                            <View style={styles.benefitText}>
                                <Text style={styles.benefitTitle}>Priority Access</Text>
                                <Text style={styles.benefitDesc}>Early access to new features</Text>
                            </View>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Student Email (.edu)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="yourname@university.edu"
                                placeholderTextColor={Colors.text.muted}
                                value={studentEmail}
                                onChangeText={setStudentEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleVerify}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={[Colors.secondary[500], Colors.secondary[600]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={Colors.text.primary} />
                                ) : (
                                    <Text style={styles.buttonText}>Verify Student Email</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                            <Text style={styles.skipText}>Skip for now</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    logo: {
        fontSize: 56,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.secondary,
        textAlign: 'center',
        paddingHorizontal: Spacing.lg,
    },
    benefits: {
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
        gap: Spacing.md,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    benefitIcon: {
        fontSize: 28,
    },
    benefitText: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
    },
    benefitDesc: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
    },
    form: {
        gap: Spacing.md,
    },
    inputContainer: {
        gap: Spacing.xs,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.text.secondary,
        marginLeft: Spacing.xs,
    },
    input: {
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        fontSize: Typography.fontSize.base,
        color: Colors.text.primary,
        borderWidth: 1,
        borderColor: Colors.dark[600],
    },
    button: {
        marginTop: Spacing.sm,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.semibold,
        color: Colors.text.primary,
    },
    skipButton: {
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    skipText: {
        color: Colors.text.muted,
        fontSize: Typography.fontSize.base,
    },
});
