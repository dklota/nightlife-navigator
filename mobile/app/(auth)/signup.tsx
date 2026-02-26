import React, { useState, useEffect, useRef } from 'react';
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
    Animated,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const signUp = useAuthStore((state) => state.signUp);

    // Same floating orb animations as login
    const orb1Y  = useRef(new Animated.Value(0)).current;
    const orb2Y  = useRef(new Animated.Value(0)).current;
    const orb3Y  = useRef(new Animated.Value(0)).current;
    const orb1Op = useRef(new Animated.Value(0.18)).current;
    const orb2Op = useRef(new Animated.Value(0.12)).current;
    const logoGlow = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const float = (val: Animated.Value, dist: number, duration: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(val, { toValue: -dist, duration, useNativeDriver: true }),
                    Animated.timing(val, { toValue:  dist, duration, useNativeDriver: true }),
                ])
            ).start();

        float(orb1Y, 22, 4200);
        float(orb2Y, 16, 5800);
        float(orb3Y, 28, 3600);

        Animated.loop(
            Animated.sequence([
                Animated.timing(orb1Op, { toValue: 0.28, duration: 3000, useNativeDriver: true }),
                Animated.timing(orb1Op, { toValue: 0.10, duration: 3000, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(orb2Op, { toValue: 0.20, duration: 4000, useNativeDriver: true }),
                Animated.timing(orb2Op, { toValue: 0.06, duration: 4000, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(logoGlow, { toValue: 1, duration: 2800, useNativeDriver: true }),
                Animated.timing(logoGlow, { toValue: 0, duration: 2800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const logoGlowOpacity = logoGlow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });
    const logoGlowScale   = logoGlow.interpolate({ inputRange: [0, 1], outputRange: [1,   1.15] });

    const handleSignup = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        const { error } = await signUp(email, password, fullName);
        setIsLoading(false);

        if (error) {
            Alert.alert('Signup Failed', error.message);
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0a000f', '#0d0118', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            {/* Floating orbs */}
            <Animated.View style={[styles.orb, styles.orb1, { opacity: orb1Op, transform: [{ translateY: orb1Y }] }]} />
            <Animated.View style={[styles.orb, styles.orb2, { opacity: orb2Op, transform: [{ translateY: orb2Y }] }]} />
            <Animated.View style={[styles.orb, styles.orb3, { opacity: 0.08,  transform: [{ translateY: orb3Y }] }]} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoWrap}>
                            <Animated.View
                                style={[
                                    styles.logoGlowRing,
                                    { opacity: logoGlowOpacity, transform: [{ scale: logoGlowScale }] },
                                ]}
                            />
                            <View style={styles.logoBox}>
                                <Text style={styles.logoText}>WTM</Text>
                            </View>
                        </View>
                        <Text style={styles.tagline}>join the move</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputWrap}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your name"
                                placeholderTextColor={Colors.text.muted}
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="words"
                                autoComplete="name"
                            />
                        </View>

                        <View style={styles.inputWrap}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="your@email.com"
                                placeholderTextColor={Colors.text.muted}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                        </View>

                        <View style={styles.inputWrap}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.text.muted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="off"
                                textContentType="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputWrap}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.text.muted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoComplete="off"
                                textContentType="none"
                                autoCorrect={false}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignup}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={[Colors.primary[500], Colors.primary[700]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={Colors.text.primary} />
                                ) : (
                                    <Text style={styles.buttonText}>Create Account</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.linkText}>Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing['2xl'],
    },

    // Orbs (identical to login)
    orb: {
        position: 'absolute',
        borderRadius: 9999,
    },
    orb1: {
        width: 340,
        height: 340,
        top: height * 0.05,
        left: -100,
        backgroundColor: Colors.primary[500],
    },
    orb2: {
        width: 280,
        height: 280,
        bottom: height * 0.1,
        right: -80,
        backgroundColor: Colors.neon.magenta,
    },
    orb3: {
        width: 200,
        height: 200,
        top: height * 0.4,
        right: width * 0.1,
        backgroundColor: Colors.neon.cyan,
    },

    // Logo
    logoSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    logoWrap: {
        width: 90,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    logoGlowRing: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 22,
        backgroundColor: Colors.primary[500],
    },
    logoBox: {
        width: 76,
        height: 76,
        borderRadius: 18,
        backgroundColor: Colors.dark[800],
        borderWidth: 1.5,
        borderColor: Colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        letterSpacing: 3,
    },
    tagline: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.muted,
        letterSpacing: 4,
        textTransform: 'lowercase',
    },

    // Form
    form: {
        gap: Spacing.md,
    },
    inputWrap: {
        gap: Spacing.xs,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.text.secondary,
        marginLeft: Spacing.xs,
    },
    input: {
        backgroundColor: 'rgba(40,40,40,0.9)',
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
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.md,
    },
    footerText: {
        color: Colors.text.secondary,
        fontSize: Typography.fontSize.base,
    },
    linkText: {
        color: Colors.primary[400],
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
    },
});
