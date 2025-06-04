import { StyleSheet } from 'react-native'; // Dimensions removed from here
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../theme/theme';

// Dimensions should be used within components/functions, not at the top level for static style objects.

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    ...componentStyles.card,
    marginVertical: spacing.sm,
  },
  title: {
    ...componentStyles.title,
    fontSize: font.sizes['3xl'],
    textAlign: 'center',
    marginVertical: spacing.lg,
    color: colors.primary,
  },
  fullWidth: { // Simplified: components can use useWindowDimensions for specific maxWidth
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  btn: {
    ...componentStyles.button.base,
    ...componentStyles.button.primary,
  },
  btnText: {
    ...componentStyles.button.text,
  },
  input: {
    ...componentStyles.input,
  },
  notification: {
    ...componentStyles.notification.base,
  },
  notificationSuccess: {
    ...componentStyles.notification.success,
  },
  notificationError: {
    ...componentStyles.notification.error,
  },
  notificationText: {
    ...componentStyles.notification.text,
  },
  componentTitle: {
    ...componentStyles.componentTitle,
  },
  componentSubtitle: {
    ...componentStyles.componentSubtitle,
  },
  modalTitle: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: font.family,
    letterSpacing: 1,
  },
  modalText: {
    fontSize: font.sizes.base,
    color: colors.text,
    textAlign: 'center',
    fontFamily: font.family,
  },
  modalButtonText: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.textLight,
    fontFamily: font.family,
  },
};