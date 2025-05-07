import { StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';

export default StyleSheet.create({
  browserContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.md,
    ...shadows.medium,
  },
  browserTitle: {
    ...componentStyles.componentTitle,
  },

  selectionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  selectionColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  selectionLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    transition: 'border-color 0.2s ease-in-out',
  },
  selectButtonHover: {
    borderColor: colors.primary,
  },
  selectButtonDisabled: {
    backgroundColor: colors.disabledBackground,
    borderColor: colors.disabledBorder,
  },
  selectIcon: {
    marginRight: spacing.sm,
  },
  selectButtonText: {
    flex: 1,
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.text,
    textAlign: 'left',
  },
  selectButtonTextDisabled: {
    color: colors.textSecondary,
  },

  // --- Style Listy Zawodników ---
  athleteListContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  athleteListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
    transition: 'background-color 0.15s ease-in-out',
  },
  athleteListItemHover: {
    backgroundColor: colors.background,
  },
  athleteInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.textLight,
    fontWeight: font.weights.bold,
    fontSize: font.sizes.md,
  },
  athleteTextDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  athleteNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs / 2,
  },
  athleteName: {
    fontSize: font.sizes.md,
    fontWeight: font.weights.semibold,
    color: colors.text,
    marginRight: spacing.sm,
    flexShrink: 1,
  },
  athleteDetailText: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
  },
  athleteRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  athleteApproachesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: spacing.md,
    minWidth: 60,
  },
  approachText: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.textSecondary,
    marginHorizontal: spacing.xs / 2,
  },
  approachSeparator: {
    fontSize: font.sizes.sm,
    color: colors.border,
    marginHorizontal: spacing.xs / 2,
  },
  approachPlaceholder: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    minWidth: 60,
    textAlign: 'right',
  },
  athleteActionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  actionButtonHover: {
    backgroundColor: colors.background,
    transform: [{ scale: 1.1 }],
  },
  editButton: {},
  deleteButton: {},

  // --- Style Pustego Stanu ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 200,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontSize: font.sizes.md,
    fontWeight: font.weights.medium,
  },
  emptySubText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: font.sizes.sm,
  },

  // --- Style Modali (Ujednolicone) ---
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
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: font.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
    width: '100%',
  },
  selectLabel: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  selectItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
  selectItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out, transform 0.1s ease',
  },
  selectItemHover: {
    borderColor: colors.accent,
  },
  selectItemActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  selectItemText: {
    color: colors.text,
    fontSize: font.sizes.sm,
  },
  selectItemTextActive: {
    color: colors.textLight,
    fontWeight: font.weights.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: font.sizes.sm,
    textAlign: 'center',
    width: '100%',
    paddingVertical: spacing.md,
  },

  modalInput: {
    ...componentStyles.input,
    width: '100%',
    marginBottom: spacing.md,
  },
  modalRadioContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  modalRadioBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  },
  modalRadioBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalRadioText: {
    color: colors.text,
    fontWeight: font.weights.medium,
  },
  modalRadioTextActive: {
    color: colors.textLight,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
    width: '100%',
    gap: spacing.sm,
  },
  modalBtnBase: {
    ...componentStyles.button.base,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    minWidth: 100,
    justifyContent: 'center',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
  },
  modalConfirmBtn: {
    backgroundColor: colors.primary,
  },
  modalDeleteBtn: {
    backgroundColor: colors.error,
  },
  modalCancelBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  modalBtnText: {
    ...componentStyles.button.text,
    color: colors.textLight,
  },
  modalCancelBtnText: {
    ...componentStyles.button.text,
    color: colors.textSecondary,
  },
  modalBtnIcon: {
    marginRight: spacing.sm,
  },

  // --- Style Powiadomień (Ujednolicone) ---
  notification: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
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

  // --- Nowe style dla dużych pigułek z podejściami (używane zamiast starych) ---
  bigApproachContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bigApproachBadge: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '30',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  bigApproachBadgeLabel: {
    fontSize: font.sizes.md,
    fontWeight: font.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs / 2,
  },
  bigApproachBadgeText: {
    fontSize: font.sizes.lg,
    fontWeight: font.weights.bold,
    color: colors.primary,
  },
});