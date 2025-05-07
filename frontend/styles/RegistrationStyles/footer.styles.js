import { StyleSheet } from 'react-native';
import { colors, spacing, font, shadows, borderRadius } from '../../theme/theme';
import { createShadow } from '../../theme/common';

export default StyleSheet.create({
  footerContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingVertical: spacing.sm,
    width: '100%',
  },
  footerContainerDesktop: {
    paddingVertical: spacing.md,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    marginHorizontal: 'auto',
    paddingHorizontal: spacing.sm,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm, // Zmniejszamy padding dla lepszego dopasowania na małych ekranach
    paddingVertical: spacing.xs,
  },
  footerText: {
    fontSize: font.sizes.sm,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  footerCopyright: {
    marginTop: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: font.sizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Style dla modalu
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 400,
    ...createShadow(shadows.large),
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...createShadow(shadows.small),
  },
  modalTitle: {
    fontSize: font.sizes.lg,
    fontWeight: font.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalContent: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  modalText: {
    fontSize: font.sizes.base,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: font.sizes.sm,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: font.sizes.base * 1.5,
  },
  modalDeveloper: {
    fontSize: font.sizes.xs,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  modalButton: {
    width: '100%',
    marginTop: spacing.md,
  },
});