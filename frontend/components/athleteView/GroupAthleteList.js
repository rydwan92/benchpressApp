import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

const GroupAthleteList = ({ athletes, currentAthleteOriginalIndex }) => {
    const getStatusIcon = (status, weight) => {
        const iconSize = 28; // Zwiększony rozmiar ikon
        const iconStyle = styles.attemptStatusIcon;

        if ((status === 'passed' || status === 'failed') && (!weight || weight === '-')) {
            return <View style={[styles.attemptStatusIconPlaceholder, { width: iconSize, height: iconSize }]} />;
        }

        if (status === 'passed') return <AntDesign name="checkcircle" size={iconSize} color={colors.white} style={iconStyle} />;
        if (status === 'failed') return <AntDesign name="closecircle" size={iconSize} color={colors.white} style={iconStyle} />;
        if (weight && weight !== '-') return <AntDesign name="clockcircleo" size={iconSize} color={colors.textSecondary} style={iconStyle} />;
        return <View style={[styles.attemptStatusIconPlaceholder, { width: iconSize, height: iconSize }]} />;
    };

    const getAttemptCellStyle = (status) => {
        if (status === 'passed') return styles.attemptCellPassed;
        if (status === 'failed') return styles.attemptCellFailed;
        return styles.attemptCellDeclared;
    };

    const getAttemptWeightStyle = (status) => {
        if (status === 'passed' || status === 'failed') return styles.attemptWeightResultText;
        return styles.attemptWeightDeclaredText;
    };


    return (
        <ScrollView 
            style={styles.groupListScroll} 
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
        >
            {athletes.length === 0 && (
                <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>Brak zawodników w tej grupie.</Text>
                </View>
            )}
            {athletes.map((athlete, idx) => (
                <View
                    key={athlete.originalIndex}
                    style={[
                        styles.groupListItem,
                        athlete.originalIndex === currentAthleteOriginalIndex && styles.groupListItemActive,
                    ]}
                >
                    <View style={styles.athleteRankContainer}>
                        <Text style={styles.athleteRank}>{idx + 1}</Text>
                    </View>

                    <View style={styles.athleteInfoContainer}>
                        <Text style={styles.athleteName} numberOfLines={1}>
                            {athlete.imie} {athlete.nazwisko}
                        </Text>
                        <Text style={styles.athleteClub} numberOfLines={1}>
                            {athlete.klub || 'Brak klubu'}
                        </Text>
                    </View>

                    <View style={styles.attemptsRow}>
                        {[1, 2, 3].map(nr => {
                            const weightValue = athlete[`podejscie${nr}`];
                            const statusValue = athlete[`podejscie${nr}Status`];
                            return (
                                <View key={nr} style={[styles.attemptCellBase, getAttemptCellStyle(statusValue)]}>
                                    <Text style={[styles.attemptWeightBase, getAttemptWeightStyle(statusValue)]}>
                                        {weightValue || '-'}
                                    </Text>
                                    {getStatusIcon(statusValue, weightValue)}
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.completedIndicator}>
                        {athlete.isCompleted && (
                            <AntDesign name="checksquare" size={28} color={colors.successStrong || colors.success} />
                        )}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    groupListScroll: {
        flex: 1,
        width: '100%',
    },
    scrollContentContainer: {
        paddingBottom: spacing.md, 
    },
    emptyListContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    emptyListText: {
        fontSize: font.sizes.xl,
        color: colors.textLight + 'aa', // Adjusted for dark background
        fontStyle: 'italic',
    },
    groupListItem: {
        backgroundColor: colors.surface + '1A', // More transparent for better blend with gradient
        borderRadius: borderRadius.lg, // Larger radius
        paddingVertical: spacing.md, // More padding
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md, // More margin
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.medium,
        borderLeftWidth: 8, // Thicker accent border
        borderLeftColor: colors.primary,
    },
    groupListItemActive: {
        backgroundColor: colors.primary + '30',
        borderLeftColor: colors.accent,
    },
    athleteRankContainer: {
        width: 50, // Slightly wider
        alignItems: 'center',
        marginRight: spacing.md, // More margin
    },
    athleteRank: {
        fontSize: font.sizes['2xl'], // Larger rank
        fontWeight: font.weights.bold,
        color: colors.textLight,
    },
    athleteInfoContainer: {
        flex: 1,
        marginRight: spacing.sm,
    },
    athleteName: {
        fontSize: font.sizes['2xl'], // Larger name
        fontWeight: font.weights.bold,
        color: colors.textLight,
        marginBottom: 2,
    },
    athleteClub: {
        fontSize: font.sizes.lg, // Larger club
        color: colors.textLight + 'aa',
    },
    attemptsRow: {
        flexDirection: 'row',
        alignItems: 'stretch', // Ensure cells have same height
    },
    attemptCellBase: {
        width: Platform.OS === 'web' ? 110 : 90, // Wider cells
        minHeight: 70, // Taller cells
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.xxs,
        marginHorizontal: spacing.xs,
        borderRadius: borderRadius.md, // Consistent radius
        borderWidth: 1, // Add subtle border to cells
        borderColor: colors.surface + '33',
    },
    attemptCellDeclared: {
        backgroundColor: colors.surface + '2A',
    },
    attemptCellPassed: {
        backgroundColor: colors.success,
        borderColor: colors.successDark || colors.success,
    },
    attemptCellFailed: {
        backgroundColor: colors.error,
        borderColor: colors.errorDark || colors.error,
    },
    attemptWeightBase: {
        fontSize: font.sizes['2xl'], // Larger weight
        fontWeight: font.weights.bold,
        marginBottom: spacing.xxs,
    },
    attemptWeightDeclaredText: {
        color: colors.textLight + 'dd',
    },
    attemptWeightResultText: {
        color: colors.white,
    },
    attemptStatusIcon: {
        // Icons are already sized at 28 in the component logic
    },
    completedIndicator: {
        marginLeft: spacing.md,
        padding: spacing.xs,
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
    }
});

export default GroupAthleteList;