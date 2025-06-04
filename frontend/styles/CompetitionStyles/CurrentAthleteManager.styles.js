import { StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

export const styles = StyleSheet.create({
    managerContainer: {
        alignItems: 'stretch',
        gap: spacing.md, // Zmniejszony odstęp, jeśli informacje są teraz bardziej zwarte
    },
    athleteInfoContainer: {
        flexDirection: 'row', // Kluczowa zmiana: układ poziomy
        justifyContent: 'space-between', // Rozłożenie elementów
        alignItems: 'center', // Wyrównanie w pionie
        paddingVertical: spacing.sm, // Mniejszy padding pionowy
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface, // Spójne tło
        borderRadius: borderRadius.md,
        // Usunięto backgroundColor: colors.surfaceVariant + '99' dla czystszego wyglądu
        // Usunięto gap: spacing.xs - odstępy zarządzane przez justifyContent i marginesy
    },
    athleteInfoMain: { // Nowy kontener dla Imienia i Klubu
        flex: 2.5, // Zajmuje więcej miejsca
        marginRight: spacing.sm, // Odstęp od informacji o rundzie
    },
    athleteName: {
        fontSize: font.sizes.lg,
        fontWeight: font.weights.bold,
        color: colors.primary,
        textAlign: 'left', // Wyrównanie do lewej w układzie poziomym
    },
    athleteClub: {
        fontSize: font.sizes.sm,
        fontWeight: font.weights.medium,
        color: colors.textSecondary,
        textAlign: 'left', // Wyrównanie do lewej
        // Usunięto marginBottom: spacing.sm
    },
    currentRoundInfo: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.semibold,
        color: colors.accent,
        textAlign: 'right', // Wyrównanie do prawej
        flex: 1, // Zajmuje pozostałe miejsce
    },
    attemptsContainer: {
        gap: spacing.sm, // Odstęp między wierszami podejść
    },
    attemptRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md, // Ujednolicenie borderRadius
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: spacing.xs, // Mały odstęp między wierszami podejść
    },
    attemptRowActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '1A',
        ...shadows.small,
    },
    attemptNumber: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.bold,
        color: colors.textSecondary,
        minWidth: 40,
    },
    attemptWeightContainer: { // Upewnij się, że te style są obecne
        flexDirection: 'row',
        alignItems: 'baseline', // Wyrównanie do linii bazowej tekstu
        justifyContent: 'center',
        flex: 1, // Aby zajęło dostępną przestrzeń
        // gap: spacing.xs, // Można usunąć, jeśli jednostka ma być blisko
    },
    attemptWeightInput: {
        fontSize: font.sizes.xl,
        fontWeight: font.weights.bold,
        color: colors.primary,
        borderBottomWidth: 0,
        paddingVertical: Platform.OS === 'ios' ? spacing.xxs : spacing.xxs,
        textAlign: 'right', // Wyrównanie tekstu w inpucie do prawej
        minWidth: 60, // Zmniejszona minimalna szerokość, aby zrobić miejsce na "kg"
        maxWidth: 80,
        // marginRight: spacing.xxs, // Mały margines przed "kg"
    },
    attemptWeightText: {
        fontSize: font.sizes.xl,
        fontWeight: font.weights.bold,
        color: colors.text,
        textAlign: 'right', // Wyrównanie tekstu do prawej
        minWidth: 60, // Zmniejszona minimalna szerokość
        maxWidth: 80,
        // marginRight: spacing.xxs, // Mały margines przed "kg"
    },
    attemptUnit: {
        fontSize: font.sizes.sm, // Można dostosować rozmiar jednostki
        color: colors.textSecondary,
        fontWeight: font.weights.medium,
        marginLeft: spacing.xxs, // Mały margines po liczbie
    },
    attemptStatusActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // Przyciski po prawej
        gap: spacing.sm,
        minWidth: 80, // Zapewnienie miejsca na przyciski lub ikonę statusu
    },
    statusIcon: {
        // Styl dla ikon statusu (check/close) - rozmiar i kolor są ustawiane w komponencie
    },
    actionButton: {
        padding: spacing.xs, // Mniejszy padding dla przycisków akcji
        borderRadius: borderRadius.sm,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    passButton: {
        backgroundColor: colors.success,
    },
    failButton: {
        backgroundColor: colors.error,
    },
    editIconTouchable: {
        padding: spacing.xs,
    },
    // Dodatkowe style dla lepszego wyglądu
    noAthleteText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: font.sizes.md,
        paddingVertical: spacing.lg,
        fontStyle: 'italic',
        backgroundColor: colors.surface, // Dodanie tła dla spójności
        borderRadius: borderRadius.md,
        padding: spacing.md,
    }
});