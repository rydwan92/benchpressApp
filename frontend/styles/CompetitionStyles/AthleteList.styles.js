import { StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

export const styles = StyleSheet.create({
    athleteListContainer: { marginTop: spacing.sm, flex: 1 },
    // Punkt 2: Style dla przeniesionego infoText
    groupInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surfaceVariant + '80', // Lekkie tło
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    groupInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    groupInfoIcon: {
        marginRight: spacing.xs,
    },
    groupInfoText: {
        fontSize: font.sizes.sm,
        fontWeight: font.weights.medium,
        color: colors.text,
    },
    groupInfoHighlight: {
        fontWeight: font.weights.bold,
        color: colors.primary,
    },
    roundInfoText: {
        fontSize: font.sizes.md, // Większy tekst dla rundy
        fontWeight: font.weights.bold,
        color: colors.accent, // Kolor akcentu
    },
    // Koniec Punkt 2
    emptyText: { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.md },
    athleteScroll: {
        flex: 1,
        borderWidth: 1, borderColor: colors.borderLight, borderRadius: borderRadius.md,
        padding: spacing.xs,
    },
    athleteListItem: {
        padding: spacing.sm,
        marginBottom: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.small,
        transition: 'transform 0.1s ease-in-out, border-color 0.1s ease-in-out', // Dla web
    },
    athleteListItemActive: { 
        borderColor: colors.accent, 
        backgroundColor: colors.accent + '1A',
        ...shadows.medium,
        shadowColor: colors.accent,
        transform: [{ scale: 1.02 }], // Lekkie powiększenie dla aktywnego
    },
    athleteListItemHover: { 
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
        transform: [{ scale: 1.01 }],
    },
    athleteInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    athleteListText: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.semibold,
        color: colors.text,
        flex: 1,
    },
    athleteClubText: {
        fontSize: font.sizes.sm,
        fontWeight: font.weights.normal,
        color: colors.textSecondary,
    },
    attemptsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Rozłożenie prób
    },
    attemptCell: {
        flex: 1, // Każda komórka zajmuje równą część
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.xxs, // Bardzo mały padding poziomy
        borderRightWidth: 1,
        borderRightColor: colors.borderLight,
        // minWidth: 80, // Minimalna szerokość dla czytelności
    },
    attemptCellLast: { // Usunięcie prawej krawędzi dla ostatniej komórki
        borderRightWidth: 0,
    },
    attemptCellLabel: {
        fontSize: font.sizes.xs,
        color: colors.textSecondary,
        marginBottom: spacing.xxs,
        fontWeight: font.weights.medium,
    },
    attemptWeightInput: {
        fontSize: font.sizes.sm,
        fontWeight: font.weights.semibold,
        color: colors.text,
        borderBottomWidth: 1,
        borderColor: colors.primary,
        paddingVertical: Platform.OS === 'ios' ? spacing.xxs : 0,
        textAlign: 'center',
        minWidth: 40, // Zapewnia miejsce na 2-3 cyfry
        maxWidth: 50,
        marginBottom: spacing.xxs,
    },
    attemptWeightText: {
        fontSize: font.sizes.sm,
        fontWeight: font.weights.semibold,
        color: colors.text,
        textAlign: 'center',
        minWidth: 40,
        maxWidth: 50,
        marginBottom: spacing.xxs,
    },
    attemptStatusIconContainer: {
        height: 20, // Stała wysokość dla wyrównania
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xxs,
    },
    attemptActionButtons: {
        flexDirection: 'row',
        gap: spacing.xs,
        marginTop: spacing.xxs, // Mały odstęp od ikony statusu/ciężaru
    },
    actionButtonSmall: {
        padding: spacing.xs,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        // minWidth: 28, // Dla małych ikon
    },
    actionButtonDisabledSmall: {
        backgroundColor: colors.border,
        opacity: 0.7,
    },
    passButtonSmall: { backgroundColor: colors.success },
    failButtonSmall: { backgroundColor: colors.error },
});