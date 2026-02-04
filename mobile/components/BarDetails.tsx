import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../src/constants/theme';
import { LitMeter } from './LitMeter';
import { Bar } from '../src/types';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BarDetailsProps {
    bar: Bar | any; // Using any for mock flexibility
    isVisible: boolean;
    onClose: () => void;
}

export const BarDetails: React.FC<BarDetailsProps> = ({ bar, isVisible, onClose }) => {
    if (!bar) return null;

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="chevron-down" size={30} color={Colors.text.primary} />
                        </TouchableOpacity>
                        <View style={styles.headerTitles}>
                            <Text style={styles.barName}>{bar.name}</Text>
                            <Text style={styles.barAddress}>📍 {bar.address || 'Davis, CA'}</Text>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Main Stats Card */}
                        <View style={styles.statsCard}>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Wait Time</Text>
                                    <Text style={styles.statValue}>{bar.waitTime || 'No info'}</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Status</Text>
                                    <Text style={[styles.statValue, { color: Colors.traffic.veryHigh }]}>
                                        {bar.vibe || 'Active'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.litMeterContainer}>
                                <LitMeter score={bar.litScore || 50} label="Liveness Meter" />
                            </View>
                        </View>

                        {/* Quick Info Grid */}
                        <View style={styles.infoGrid}>
                            <View style={styles.infoBox}>
                                <Ionicons name="card" size={24} color={Colors.neon.magenta} />
                                <Text style={styles.infoLabel}>Cover Fee</Text>
                                <Text style={styles.infoValue}>{bar.coverFee || 'None'}</Text>
                            </View>
                            <View style={styles.infoBox}>
                                <Ionicons name="school" size={24} color={Colors.neon.cyan} />
                                <Text style={styles.infoLabel}>Student Deal</Text>
                                <Text style={styles.infoValue}>{bar.studentDiscount || '10% Off'}</Text>
                            </View>
                        </View>

                        {/* Community Photos */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Live Photos</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
                                {(bar.communityPhotos || [bar.image]).map((photo: string, index: number) => (
                                    <Image key={index} source={{ uri: photo }} style={styles.sectionPhoto} />
                                ))}
                                {bar.photos?.map((photo: string, index: number) => (
                                    <Image key={`p-${index}`} source={{ uri: photo }} style={styles.sectionPhoto} />
                                ))}
                            </ScrollView>
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.primaryButton, { backgroundColor: Colors.primary[500] }]}
                                onPress={() => {
                                    onClose();
                                    router.push(`/checkin/${bar.id}`);
                                }}
                            >
                                <Text style={styles.buttonText}>Check In Now</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryButton}>
                                <Ionicons name="navigate" size={20} color={Colors.neon.cyan} />
                                <Text style={[styles.buttonText, { color: Colors.neon.cyan }]}>Get Directions</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: SCREEN_HEIGHT * 0.85,
        backgroundColor: Colors.dark[900],
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.dark[700],
    },
    header: {
        padding: Spacing.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark[700],
    },
    closeButton: {
        marginBottom: Spacing.sm,
    },
    headerTitles: {
        alignItems: 'center',
    },
    barName: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    barAddress: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
        marginTop: 4,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    statsCard: {
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark[600],
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.lg,
    },
    statItem: {
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.dark[600],
    },
    statLabel: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
        marginBottom: 4,
    },
    statValue: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    litMeterContainer: {
        marginTop: Spacing.sm,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    infoBox: {
        flex: 1,
        backgroundColor: Colors.dark[800],
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.dark[700],
    },
    infoLabel: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
    },
    infoValue: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    photoList: {
        marginHorizontal: -Spacing.lg,
        paddingHorizontal: Spacing.lg,
    },
    sectionPhoto: {
        width: 150,
        height: 200,
        borderRadius: BorderRadius.lg,
        marginRight: Spacing.md,
        backgroundColor: Colors.dark[600],
    },
    actionsContainer: {
        gap: Spacing.md,
    },
    primaryButton: {
        height: 56,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    secondaryButton: {
        height: 56,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.neon.cyan,
        flexDirection: 'row',
        gap: 8,
    },
    buttonText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
    },
});
