import { StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';

export default StyleSheet.create({
  browserContainer: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface, // Added for background consistency
    borderRadius: borderRadius.lg, // Dodane zaokrąglenie krawędzi
    overflow: 'hidden', // Dodane, aby przyciąć zawartość do zaokrąglonych krawędzi
  },
  browserTitle: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
    color: colors.text, // Consistent with CWM componentTitle
    marginTop: spacing.lg, // Adjusted marginTop
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  selectionColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  selectionLabel: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent, // ZMIANA: Tło na pomarańczowe (accent)
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent, // ZMIANA: Ramka również pomarańczowa dla spójności
    ...shadows.xs,
  },
  selectButtonDisabled: {
    backgroundColor: colors.surfaceVariant, 
    borderColor: colors.borderLight,
    opacity: 0.7, // Dodatkowe przygaszenie dla nieaktywnego przycisku
  },
  selectIcon: {
    marginRight: spacing.sm,
    color: colors.textLight, // ZMIANA: Ikona na białą, aby kontrastowała z pomarańczowym tłem
  },
  selectButtonText: {
    flex: 1,
    fontSize: font.sizes.sm, // Rozmiar fontu jak w buttonach
    color: colors.textLight, // ZMIANA: Tekst na biały (textLight) dla kontrastu z pomarańczowym tłem
    fontWeight: font.weights.semibold, // ZMIANA: Pogrubienie jak w buttonach
  },
  selectButtonTextDisabled: {
    color: colors.textSecondary, // Tekst dla nieaktywnego przycisku pozostaje szary
  },
  athleteListContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: font.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptySubText: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  athleteListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card, // Consistent card background
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  athleteListItemHover: {
    ...shadows.medium,
    borderColor: colors.primary, // Example hover border
    borderWidth: 1,
  },
  athleteInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow text to take space
    marginRight: spacing.sm, // Space before right container
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary + '30', // Lighter primary
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.bold,
    color: colors.primary,
  },
  athleteTextDetails: {
    flex: 1, // Allow text to shrink/grow
  },
  athleteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  athleteName: {
    fontSize: font.sizes.md,
    fontWeight: font.weights.semibold,
    color: colors.text, // Main text color
    flexShrink: 1, // Allow name to shrink if too long
  },
  athleteDetailText: {
    fontSize: font.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  athleteRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // --- Styles for big approach badges ---
  bigApproachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md, // Space before action buttons
  },
  bigApproachBadge: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceVariant, // Neutral background
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm, // Adjusted padding
    paddingVertical: spacing.xs,  // Adjusted padding
    marginHorizontal: spacing.xxs,
    minWidth: 40, // Ensure some width
  },
  bigApproachBadgeLabel: {
    fontSize: font.sizes.xs,
    color: colors.textSecondary,
    fontWeight: font.weights.medium,
  },
  bigApproachBadgeText: {
    fontSize: font.sizes.sm,
    color: colors.primary, // Primary color for weight
    fontWeight: font.weights.bold,
  },
  // --- End of big approach badges ---
  athleteActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
    borderRadius: borderRadius.full,
  },
  actionButtonHover: {
    backgroundColor: colors.surfaceVariant, // Subtle hover for action buttons
  },
  editButton: {},
  deleteButton: {},

  // Modal Styles (consistent with CategoryWeightManager)
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 450,
    ...shadows.large,
    alignItems: 'center',
  },
  modalIconHeader: {
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
    color: colors.text, // Consistent modal title color
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalSubtitle: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  selectLabel: { // For labels inside modals
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start', // Align to left
  },
  selectItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%', // Ensure it takes full width in scrollview
  },
  selectItem: { // Style for category/weight pills in modal
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background, // Consistent with CWM
    transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.15s ease', // Zaktualizowano transition
  },
  selectItemHover: {
    borderColor: colors.primary, // ZMIANA: Ramka na niebieską
    backgroundColor: colors.primary, // ZMIANA: Tło na niebieskie
    transform: [{ scale: 1.05 }], // ZMIANA: Lekkie powiększenie
  },
  selectItemActive: { // Styl dla aktywnie wybranego elementu
    backgroundColor: colors.primary, // ZMIANA: Tło na niebieskie
    borderColor: colors.primary,   // ZMIANA: Ramka na niebieską
  },
  selectItemText: {
    color: colors.text, // Consistent with CWM
    fontSize: font.sizes.sm,
  },
  selectItemTextActive: { // Styl dla tekstu w aktywnie wybranym lub najechanym elemencie
    color: colors.textLight, // Biały tekst
    fontWeight: font.weights.medium,
  },
  errorText: { // For "Brak zdefiniowanych..."
    color: colors.error,
    fontSize: font.sizes.sm,
    textAlign: 'center',
    width: '100%',
    paddingVertical: spacing.sm,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    width: '100%',
  },
  modalBtnBase: { // Base for modal action buttons
    ...componentStyles.button.base,
    flex: 1,
    marginHorizontal: spacing.sm,
    maxWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: colors.textSecondary, // Consistent with CWM
  },
  modalCancelBtnText: {
    ...componentStyles.button.text,
    color: colors.textLight, // Text on dark button
  },
  modalDeleteBtn: {
    backgroundColor: colors.error, // Consistent with CWM
  },
  modalConfirmBtn: { // For "Zapisz" in edit modal
    backgroundColor: colors.accent, // Consistent with CWM
  },
  modalBtnText: { // For "Tak, usuń" and "Zapisz"
    ...componentStyles.button.text,
    color: colors.textLight,
  },
  modalBtnIcon: {
    marginRight: spacing.xs,
  },

  // Edit Modal Specifics
  modalInput: {
    ...componentStyles.input,
    width: '100%',
    marginBottom: spacing.md,
  },
  modalLabel: { // Labels for TextInput fields in Edit Modal
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  modalRadioContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  modalRadioBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  modalRadioBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  modalRadioText: {
    fontSize: font.sizes.sm,
    color: colors.text,
  },
  modalRadioTextActive: {
    color: colors.textLight,
    fontWeight: font.weights.medium,
  },

  // Notification Styles (assuming they are globally consistent)
  notification: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? spacing.lg : 80,
    left: spacing.md,
    right: spacing.md,
    ...componentStyles.notification.base,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    ...shadows.medium,
  },
  notificationSuccess: {
    ...componentStyles.notification.success,
  },
  notificationError: {
    ...componentStyles.notification.error,
  },
  notifIcon: {
    marginRight: spacing.sm,
  },
  notifText: {
    ...componentStyles.notification.text,
    flex: 1,
    textAlign: 'left',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  statusButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.surface,
  },
  statusButtonActivePass: {
    backgroundColor: colors.successMuted,
    borderColor: colors.success,
  },
  statusButtonActiveFail: {
    backgroundColor: colors.errorMuted,
    borderColor: colors.error,
  },
  statusButtonText: {
    fontSize: font.sizes.xs,
    fontWeight: font.weights.bold,
    color: colors.text,
  },
  statusButtonClear: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});