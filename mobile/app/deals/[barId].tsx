import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Spacing, Typography, BorderRadius } from '../../src/constants/theme';

// Mock deals data for each bar
const BAR_DEALS: Record<string, { name: string; deals: Deal[] }> = {
    '1': {
        name: 'G St Wunderbar',
        deals: [
            { id: '1', title: '$3 Draft Beers', description: 'Any draft on tap', originalPrice: '$7', dealPrice: '$3', emoji: '🍺', expiresIn: '2 hours' },
            { id: '2', title: '2-for-1 Shots', description: 'Well liquor shots', originalPrice: '$8', dealPrice: '$4', emoji: '🥃', expiresIn: '3 hours' },
            { id: '3', title: 'Free Appetizer', description: 'With purchase of 2 drinks', originalPrice: '$12', dealPrice: 'FREE', emoji: '🍟', expiresIn: '1 hour' },
        ],
    },
    '2': {
        name: 'Wiki Bar',
        deals: [
            { id: '1', title: 'Wiki Wacky Woo Special', description: 'Signature cocktail', originalPrice: '$14', dealPrice: '$8', emoji: '🍹', expiresIn: '2 hours' },
            { id: '2', title: 'Half Off Wine', description: 'House red or white', originalPrice: '$10', dealPrice: '$5', emoji: '🍷', expiresIn: '4 hours' },
        ],
    },
    '3': {
        name: 'Parkside Sports Bar & Grill',
        deals: [
            { id: '1', title: '$2 Bud Lights', description: 'During any game', originalPrice: '$5', dealPrice: '$2', emoji: '🍺', expiresIn: '3 hours' },
            { id: '2', title: 'Pitcher Deal', description: 'Any domestic pitcher', originalPrice: '$18', dealPrice: '$10', emoji: '🍻', expiresIn: '2 hours' },
            { id: '3', title: 'Free Wings', description: 'With pitcher purchase', originalPrice: '$15', dealPrice: 'FREE', emoji: '🍗', expiresIn: '1 hour' },
        ],
    },
    '4': {
        name: 'Shipwrecked Tiki Bar',
        deals: [
            { id: '1', title: 'Tiki Tuesday Special', description: 'Mai Tai or Piña Colada', originalPrice: '$15', dealPrice: '$7', emoji: '🌴', expiresIn: '2 hours' },
            { id: '2', title: 'Rum Bucket', description: '5 rum shots in a bucket', originalPrice: '$25', dealPrice: '$15', emoji: '🪣', expiresIn: '3 hours' },
            { id: '3', title: 'Fire Dancer Shot', description: 'Signature flaming shot', originalPrice: '$12', dealPrice: '$6', emoji: '🔥', expiresIn: '4 hours' },
        ],
    },
    '5': {
        name: 'University of Beer',
        deals: [
            { id: '1', title: 'Beer Flight', description: '4 tasters of your choice', originalPrice: '$16', dealPrice: '$9', emoji: '🍺', expiresIn: '2 hours' },
            { id: '2', title: '$5 Craft Pints', description: 'Select local craft beers', originalPrice: '$9', dealPrice: '$5', emoji: '🍻', expiresIn: '3 hours' },
        ],
    },
    '6': {
        name: "Bull 'N Mouth",
        deals: [
            { id: '1', title: 'Whiskey Wednesday', description: 'Any bourbon or rye', originalPrice: '$10', dealPrice: '$5', emoji: '🥃', expiresIn: '4 hours' },
            { id: '2', title: 'Irish Car Bomb', description: 'Classic combo', originalPrice: '$12', dealPrice: '$7', emoji: '🍀', expiresIn: '2 hours' },
        ],
    },
    '7': {
        name: "Sophia's Thai Bar & Kitchen",
        deals: [
            { id: '1', title: 'Thai Iced Tea Cocktail', description: 'With your choice of spirit', originalPrice: '$13', dealPrice: '$8', emoji: '🧋', expiresIn: '3 hours' },
            { id: '2', title: 'Sake Bomb', description: 'Hot sake + Sapporo', originalPrice: '$10', dealPrice: '$5', emoji: '🍶', expiresIn: '2 hours' },
            { id: '3', title: 'Pad Thai + Beer', description: 'Combo special', originalPrice: '$22', dealPrice: '$14', emoji: '🍜', expiresIn: '4 hours' },
        ],
    },
    '8': {
        name: "Woodstock's Pizza Davis",
        deals: [
            { id: '1', title: '$3 Slices', description: 'Cheese or pepperoni', originalPrice: '$5', dealPrice: '$3', emoji: '🍕', expiresIn: '2 hours' },
            { id: '2', title: 'Pitcher + Large Pizza', description: 'Any beer pitcher', originalPrice: '$40', dealPrice: '$25', emoji: '🍻', expiresIn: '3 hours' },
        ],
    },
};

interface Deal {
    id: string;
    title: string;
    description: string;
    originalPrice: string;
    dealPrice: string;
    emoji: string;
    expiresIn: string;
}

export default function DealsScreen() {
    const { barId } = useLocalSearchParams<{ barId: string }>();
    const barData = BAR_DEALS[barId || '1'] || BAR_DEALS['1'];

    const handleRedeemDeal = (deal: Deal) => {
        // In production, this would save the redemption to Supabase
        alert(`Deal redeemed!\n\nShow this screen to your bartender:\n"${deal.title}"\n\n${deal.dealPrice} (was ${deal.originalPrice})`);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.dark[800], Colors.dark[900]]}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Ionicons name="close" size={28} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <View style={styles.successBadge}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.neon.green} />
                            <Text style={styles.successText}>Checked In!</Text>
                        </View>
                        <Text style={styles.barName}>{barData.name}</Text>
                        <Text style={styles.subtitle}>🎉 Your exclusive deals are unlocked!</Text>
                    </View>
                </View>

                {/* Deals List */}
                <ScrollView
                    style={styles.dealsContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.dealsContent}
                >
                    <Text style={styles.sectionTitle}>Available Deals</Text>

                    {barData.deals.map((deal) => (
                        <View key={deal.id} style={styles.dealCard}>
                            <View style={styles.dealHeader}>
                                <Text style={styles.dealEmoji}>{deal.emoji}</Text>
                                <View style={styles.dealInfo}>
                                    <Text style={styles.dealTitle}>{deal.title}</Text>
                                    <Text style={styles.dealDescription}>{deal.description}</Text>
                                </View>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
                                    <Text style={styles.dealPrice}>{deal.dealPrice}</Text>
                                </View>
                            </View>

                            <View style={styles.dealFooter}>
                                <View style={styles.expiresContainer}>
                                    <Ionicons name="time-outline" size={14} color={Colors.text.muted} />
                                    <Text style={styles.expiresText}>Expires in {deal.expiresIn}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.redeemButton}
                                    onPress={() => handleRedeemDeal(deal)}
                                >
                                    <Text style={styles.redeemText}>Redeem</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={24} color={Colors.neon.cyan} />
                        <Text style={styles.infoText}>
                            Show the redeemed deal screen to your server or bartender.
                            Deals are valid only during your visit.
                        </Text>
                    </View>
                </ScrollView>

                {/* Back to Map Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Ionicons name="map" size={20} color={Colors.text.primary} />
                        <Text style={styles.mapButtonText}>Back to Map</Text>
                    </TouchableOpacity>
                </View>
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
    header: {
        paddingTop: 60,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark[600],
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: Spacing.md,
        zIndex: 10,
        padding: Spacing.xs,
    },
    headerContent: {
        alignItems: 'center',
    },
    successBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${Colors.neon.green}20`,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
        marginBottom: Spacing.sm,
    },
    successText: {
        color: Colors.neon.green,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
    },
    barName: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: Typography.fontSize.base,
        color: Colors.text.secondary,
    },
    dealsContainer: {
        flex: 1,
    },
    dealsContent: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    dealCard: {
        backgroundColor: Colors.dark[700],
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.dark[600],
    },
    dealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    dealEmoji: {
        fontSize: 36,
    },
    dealInfo: {
        flex: 1,
    },
    dealTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.text.primary,
        marginBottom: 2,
    },
    dealDescription: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    originalPrice: {
        fontSize: Typography.fontSize.sm,
        color: Colors.text.muted,
        textDecorationLine: 'line-through',
    },
    dealPrice: {
        fontSize: Typography.fontSize.xl,
        fontWeight: Typography.fontWeight.bold,
        color: Colors.neon.green,
    },
    dealFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Spacing.md,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.dark[600],
    },
    expiresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    expiresText: {
        fontSize: Typography.fontSize.xs,
        color: Colors.text.muted,
    },
    redeemButton: {
        backgroundColor: Colors.primary[500],
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    redeemText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.bold,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: `${Colors.neon.cyan}10`,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.md,
    },
    infoText: {
        flex: 1,
        fontSize: Typography.fontSize.sm,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        backgroundColor: Colors.dark[900],
        borderTopWidth: 1,
        borderTopColor: Colors.dark[600],
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.dark[700],
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    mapButtonText: {
        color: Colors.text.primary,
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.semibold,
    },
});
