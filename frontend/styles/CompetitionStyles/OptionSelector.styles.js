import { StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

export const styles = StyleSheet.create({
    selectorContainer: {
        marginBottom: spacing.lg, // Zwiększony margines dolny
    },
    selectorLabel: {
        fontSize: font.sizes.md, // Większa etykieta
        fontWeight: font.weights.semibold, // Pogrubiona
        color: colors.text, // Ciemniejszy kolor dla lepszego kontrastu
        marginBottom: spacing.md, // Większy odstęp od opcji
        textAlign: 'left', // Wyrównanie do lewej, jeśli tytuł karty jest wyśrodkowany
    },
    optionsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md, // Większy odstęp między opcjami
    },
    selectorOption: {
        paddingVertical: spacing.sm, // Większy padding pionowy
        paddingHorizontal: spacing.lg, // Większy padding poziomy
        backgroundColor: colors.surface, // Jaśniejsze tło dla nieaktywnych
        borderRadius: borderRadius.md, // Mniej zaokrąglone, bardziej "kafelkowe"
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.small, // Dodanie cienia
        transition: 'all 0.2s ease-in-out', // Płynniejsze przejścia
    },
    selectorOptionActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primaryDark || colors.primary, // Ciemniejsza ramka dla aktywnego
        transform: [{ scale: 1.05 }], // Lekkie powiększenie aktywnego
        ...shadows.medium, // Mocniejszy cień dla aktywnego
    },
    selectorOptionHover: { // Dla web
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20', // Lekkie tło przy hover
        transform: [{ scale: 1.03 }],
    },
    selectorOptionText: {
        color: colors.text,
        fontWeight: font.weights.medium,
        fontSize: font.sizes.sm,
    },
    selectorOptionTextActive: {
        color: colors.textLight,
        fontWeight: font.weights.bold, // Pogrubiony tekst dla aktywnego
    },
    selectorLoading: {
        alignSelf: 'flex-start',
        marginLeft: spacing.md, // Odstęp od etykiety
    },
    selectorEmpty: {
        color: colors.textSecondary,
        fontStyle: 'italic',
        fontSize: font.sizes.sm,
        paddingVertical: spacing.sm,
    },
    selectorOptionCompleted: { // Kiedy waga jest ukończona, ale nie wybrana
        backgroundColor: colors.surfaceVariant + '99',
        borderColor: colors.success + '80',
        opacity: 0.8, // Lekko przygaszone
    },
    selectorOptionTextCompleted: {
        color: colors.textSecondary,
        // fontStyle: 'italic', // Opcjonalnie
    },
    selectorCompletedIcon: {
        marginLeft: spacing.xs,
    },
});