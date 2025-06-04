import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

const AttemptDisplay = ({ number, weight, status, isActive }) => {
    let statusHeaderText = `PODEJŚCIE ${number}`;
    let headerTextStyle = null;
    let showStatusIcon = true;

    const iconSize = isActive ? 28 : 24;

    if (status === 'passed') {
        statusHeaderText = "ZALICZONE";
        headerTextStyle = styles.headerTextPassed;
        showStatusIcon = false;
    } else if (status === 'failed') {
        statusHeaderText = "SPALONE";
        headerTextStyle = styles.headerTextFailed;
        showStatusIcon = false;
    }

    const getStatusIconElement = () => {
        if (!showStatusIcon) return null;
        if (!weight && !status) return null;

        switch (status) {
            case 'pending':
                return <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={iconSize} color={isActive ? colors.textLight : colors.textSecondary} />; // textLight for accent bg
            default:
                if (weight) {
                    return <MaterialCommunityIcons name="progress-clock" size={iconSize} color={isActive ? colors.textLight : colors.info} />; // textLight for accent bg
                }
                return null;
        }
    };

    const containerStyles = [
        styles.attemptBoxBase,
        isActive && styles.attemptBoxActive,
        !isActive && styles.attemptBoxInactive,
        status === 'passed' && styles.attemptBoxPassed,
        status === 'failed' && styles.attemptBoxFailed,
    ];

    const currentHeaderTextStyles = [
        styles.headerTextBase,
        isActive ? styles.headerTextActive : styles.headerTextInactive,
        headerTextStyle,
    ];

    const currentWeightTextStyles = [
        styles.weightTextBase,
        isActive ? styles.weightTextActive : styles.weightTextInactive,
    ];

    if (status === 'passed' || status === 'failed') {
        currentWeightTextStyles.push(styles.weightTextResult);
        currentWeightTextStyles.push({ color: colors.textLight });
    }


    return (
        <View style={containerStyles}>
            <View style={styles.textContainer}>
                <Text style={currentHeaderTextStyles} numberOfLines={1}>{statusHeaderText}</Text>
                <Text style={currentWeightTextStyles} numberOfLines={1}>{weight ? `${String(weight).replace(',', '.')} kg` : '-'}</Text>
            </View>
            {showStatusIcon && (
                <View style={styles.iconContainer}>
                    {getStatusIconElement()}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    attemptBoxBase: {
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '0%',
        borderWidth: 2,
        ...shadows.subtle,
        backgroundColor: colors.surface + '2A',
        borderColor: colors.border + '80',
        minHeight: 120,
        position: 'relative',
        overflow: 'hidden',
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    iconContainer: {
        position: 'absolute',
        right: spacing.sm,
        top: spacing.sm,
    },
    attemptBoxInactive: {
        backgroundColor: colors.surface + '1A',
        borderColor: colors.border + '60',
        opacity: 0.8,
    },
    attemptBoxActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accentDark || colors.accent,
        ...shadows.large,
        transform: [{ scale: 1.20 }],
        zIndex: 10,
        paddingVertical: spacing.lg,
        minHeight: 150,
        marginHorizontal: spacing.md, // ZMIENIONO: z spacing.sm na spacing.md
    },
    attemptBoxPassed: {
        backgroundColor: colors.success,
        borderColor: colors.successDark || '#388E3C',
        ...shadows.none,
    },
    attemptBoxFailed: {
        backgroundColor: colors.error,
        borderColor: colors.errorDark || '#D32F2F',
        ...shadows.none,
    },
    headerTextBase: {
        fontWeight: font.weights.semibold,
        textAlign: 'center',
    },
    weightTextBase: {
        fontWeight: font.weights.bold,
        textAlign: 'center',
    },
    headerTextInactive: {
        fontSize: font.sizes.md,
        color: colors.textLight + 'aa',
    },
    weightTextInactive: {
        fontSize: font.sizes['2xl'],
        color: colors.textLight + 'dd',
        lineHeight: font.sizes['2xl'] * 1.2, // DODANO: Zwiększona wysokość linii
    },
    headerTextActive: {
        fontSize: font.sizes.xl,
        color: colors.textLight, // CHANGED for accent background
        fontWeight: font.weights.bold, // Make it bolder on accent
    },
    weightTextActive: {
        fontSize: 52,
        color: colors.textLight,
        lineHeight: 52 * 1.4, // ZMIENIONO: Mnożnik z 1.1 na 1.2 dla większego marginesu
    },
    headerTextPassed: {
        fontSize: font.sizes.xl,
        color: colors.textLight,
        fontWeight: font.weights.bold,
    },
    headerTextFailed: {
        fontSize: font.sizes.xl,
        color: colors.textLight,
        fontWeight: font.weights.bold,
    },
    weightTextResult: { // Styl dla ciężaru w kafelkach 'passed' i 'failed'
        fontSize: font.sizes['3xl'],
        color: colors.textLight,
        lineHeight: font.sizes['3xl'] * 1.2, // DODANO: Zwiększona wysokość linii
    },
});

export default AttemptDisplay;