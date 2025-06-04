import { StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';
import { sharedHeaderStyles, sharedMainContentStyles } from '../../theme/sharedStyles'; // Using shared styles

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark, // Darker background for the whole screen
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xl, // Ensure footer doesn't overlap content
  },
  // Header styles from sharedHeaderStyles
  headerBackground: {
    ...sharedHeaderStyles.headerGradient, // Use shared gradient style
    paddingBottom: 0, // NavBar will have its own padding
  },
  headerBar: {
    ...sharedHeaderStyles.headerContent, // Use shared content style
  },
  headerSideContainer: {
    ...sharedHeaderStyles.headerSideContainer,
  },
  headerLeftAlign: {
    ...sharedHeaderStyles.headerLeftAlign,
  },
  headerRightAlign: {
    ...sharedHeaderStyles.headerRightAlign,
  },
  headerClubLogo: {
    ...sharedHeaderStyles.headerClubLogo,
  },
  headerAvatarPlaceholder: {
    ...sharedHeaderStyles.headerAvatarPlaceholder,
    backgroundColor: colors.surface + '30', // Lighter placeholder on dark gradient
  },
  headerLocationDate: {
    ...sharedHeaderStyles.headerLocationDateContainer,
  },
  headerLocationText: {
    ...sharedHeaderStyles.headerLocationText,
  },
  headerDateText: {
    ...sharedHeaderStyles.headerDateText,
  },
  headerLogo: {
    ...sharedHeaderStyles.headerLogoText,
  },
  headerJudgeInfo: {
    ...sharedHeaderStyles.headerJudgeInfoContainer,
  },
  headerJudgeName: {
    ...sharedHeaderStyles.headerJudgeNameText,
  },
  headerJudgeAvatar: {
    ...sharedHeaderStyles.headerJudgeAvatar,
  },
  // Main content styles
  mainContent: {
    ...sharedMainContentStyles.mainContentContainer,
    backgroundColor: colors.background, // Lighter background for content area
    // Adjust paddingTop to correctly offset the negative marginTop from sharedMainContentStyles
    // and provide the desired internal padding.
    paddingTop: spacing.xl + borderRadius.xl, // Use shared calculation or a specific larger value
    paddingHorizontal: Platform.OS === 'web' ? '10%' : spacing.md, // Wider padding on web
  },
  screenTitle: {
    ...componentStyles.title,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.md, // DODANY GÓRNY MARGINES
  },
  filtersContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.small,
    gap: spacing.md,
  },
  filterGroup: {
    // If OptionSelector needs a wrapper for styling or layout
  },
  exportButton: {
    ...componentStyles.button.base,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    alignSelf: 'center', // Center the button
    minWidth: 200,
  },
  exportButtonText: {
    ...componentStyles.button.text,
    color: colors.textLight,
    fontSize: font.sizes.md,
  },
  // Placeholder styles (can be removed if tables always show something or have their own)
  resultsPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    minHeight: 200,
  },
  placeholderText: {
    fontSize: font.sizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});