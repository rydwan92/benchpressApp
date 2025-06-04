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
  inputWrapper: { // Nowy styl
    flexDirection: 'row',
    alignItems: 'center',
    // Ramka będzie na samym TextInput
  },
  input: {
    ...componentStyles.input,
    marginBottom: 0,
    flex: 1, // Aby input zajął dostępną przestrzeń obok ikony
  },
  inputValid: { // Nowy styl dla poprawnego inputu
    borderColor: colors.success || '#28a745', // Użyj koloru sukcesu z motywu lub domyślnego zielonego
    // Zakładamy, że componentStyles.input już ma borderWidth. Jeśli nie, dodaj:
    // borderWidth: 1,
  },
  validIcon: { // Nowy styl dla ikony "tick"
    marginLeft: spacing.sm,
  },
  inputDisabled: { // Nowy styl dla zablokowanego inputu
    backgroundColor: colors.surfaceVariant, // Lekko inne tło
    color: colors.textSecondary, // Ciemniejszy tekst, aby wskazać nieaktywność
  },
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
    transition: 'transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease', // Dodano transition
  },
  radioBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioBtnHover: { // Nowy styl dla hover
    transform: [{ scale: 1.05 }],
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
    // Styl dla kontenera ScrollView, jeśli potrzebny
    // Można dodać np. lekkie tło, aby odróżnić obszar przewijania
    // backgroundColor: colors.background,
    // borderRadius: borderRadius.sm,
  },
  selectList: {
    flexDirection: 'row', // Elementy w rzędzie
    flexWrap: 'wrap', // Zawijanie elementów <--- TO JEST KLUCZOWE DLA SPADANIA
    gap: spacing.sm, // Odstęp między elementami
    paddingVertical: spacing.xs, 
    justifyContent: 'center', // Wyśrodkowanie elementów w poziomie
  },
  selectItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full, 
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1, // Upewniamy się, że szerokość ramki jest zdefiniowana
    borderColor: colors.primary, // ZMIANA: Stałe niebieskie obramowanie
    transition: 'transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
    flexGrow: 0,      
    flexShrink: 1,    
    minWidth: 80,     // Minimalna szerokość pigułki
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: spacing.xs, // Odstęp dla zawiniętych pigułek
  },
  selectItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary, // Pozostaje niebieskie dla aktywnego
  },
  selectItemHover: { // Styl dla hover na web
    transform: [{ scale: 1.05 }],
    backgroundColor: colors.primary,
    borderColor: colors.primary, // Pozostaje niebieskie dla hover
  },
  selectItemText: {
    color: colors.text,
    fontWeight: font.weights.medium,
    fontSize: font.sizes.sm,
    textAlign: 'center', // Upewnij się, że tekst jest wyśrodkowany
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

  // Nowe style dla karty
  cardWrapper: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
    marginBottom: spacing.lg,
  },

  // Nowy styl dla tytułu formularza
  formTitle: {
    ...componentStyles.componentTitle,
    marginBottom: spacing.lg,
    textAlign: 'center',
    letterSpacing: 2,
  },
});