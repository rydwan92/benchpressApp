/**
 * Styles for AthleteRegistrationForm Component
 */

import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, font, shadows, borderRadius, componentStyles } from '../../theme/theme'; // Importuj componentStyles

export default StyleSheet.create({
  // Grupy Input
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    ...componentStyles.input, // Użyj stylu bazowego
    marginBottom: 0, // Usuń domyślny margines dolny z componentStyles.input
  },

  // Radio buttons (Płeć)
  radioRow: {
    marginBottom: spacing.md,
  },
  radioContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  radioBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  radioBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioText: {
    color: colors.text,
    fontWeight: font.weights.medium,
  },
  radioTextActive: {
    color: colors.textLight,
  },

  // SelectBox (Kategoria, Waga)
  selectBox: {
    marginBottom: spacing.md,
  },
  selectLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  selectScroll: {
    // Można dodać np. lekkie tło, aby odróżnić obszar przewijania
    // backgroundColor: colors.background,
    // borderRadius: borderRadius.sm,
  },
  selectList: {
    flexDirection: 'row', // Elementy w rzędzie
    gap: spacing.sm, // Odstęp między elementami
    paddingVertical: spacing.xs, // Dodaj trochę pionowego paddingu dla estetyki
  },
  selectItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    // Usunięto transition - nie jest standardem w React Native
    // transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
  },
  selectItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectItemHover: { // Styl hover dla web
    borderColor: colors.primary,
  },
  selectItemText: {
    color: colors.text,
    fontWeight: font.weights.medium,
    fontSize: font.sizes.sm,
  },
  selectItemTextActive: {
    color: colors.textLight,
  },
  selectEmpty: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontSize: font.sizes.sm,
    marginTop: spacing.xs,
  },

  // Przyciski Akcji
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  btnAdd: {
    ...componentStyles.button.base,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ scale: 1 }],
  },
  btnAddPressed: {
      transform: [{ scale: 1.05 }], // Lub inna skala dla wciśnięcia
      backgroundColor: colors.accentDark,
  },
  btnAddHover: { // <-- Styl dla hover
      transform: [{ scale: 1.05 }], // Powiększenie po najechaniu
      ...shadows.small, // Opcjonalny dodatkowy efekt
  },
  btnClear: {
    ...componentStyles.button.base,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ scale: 1 }],
  },
  btnClearPressed: {
      transform: [{ scale: 1.05 }], // Lub inna skala dla wciśnięcia
      backgroundColor: colors.surfaceHover,
  },
  btnClearHover: { // <-- Styl dla hover
      transform: [{ scale: 1.05 }], // Powiększenie po najechaniu
      ...shadows.small, // Opcjonalny dodatkowy efekt
  },
  btnText: {
    ...componentStyles.button.text,
  },
  btnClearText: {
    ...componentStyles.button.text,
    color: colors.textSecondary,
  },
  btnIcon: {
    marginRight: spacing.xs,
  },

  // Powiadomienia
  notification: {
    ...componentStyles.notification.base, // Użyj stylu bazowego
    flexDirection: 'row', // Ikona obok tekstu
    alignItems: 'center', // Wyrównanie w pionie
    marginTop: spacing.md, // Odstęp od przycisków
  },
  notificationSuccess: {
    ...componentStyles.notification.success, // Użyj stylu bazowego
  },
  notificationError: {
    ...componentStyles.notification.error, // Użyj stylu bazowego
  },
  notifIcon: { // Styl dla ikony w powiadomieniu
      marginRight: spacing.sm,
  },
  notificationText: {
    ...componentStyles.notification.text, // Użyj stylu bazowego
    flex: 1, // Aby tekst zajął resztę miejsca
    textAlign: 'left', // Wyrównaj do lewej
  },
});