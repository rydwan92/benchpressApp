import { StyleSheet, Dimensions } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../theme/theme';

// Pobieramy szerokość ekranu przy użyciu API Dimensions
const { width } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({
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
  fullWidth: {
    width: '100%',
    maxWidth: width - spacing.md * 2,
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
});