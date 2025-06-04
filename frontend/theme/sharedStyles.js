import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from './theme';

export const sharedHeaderStyles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + spacing.sm : spacing.md, // Bezpieczny obszar dla paska statusu
    paddingBottom: spacing.sm, // Odstęp pod NavBar
    // Upewnij się, że inne style tutaj nie psują wyglądu
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm, // Odstęp między górną częścią nagłówka a NavBar
  },
  headerBackground: {
    paddingTop: spacing.xl,
    ...shadows.medium,
    zIndex: 1, // Aby nagłówek był nad treścią wsuniętą pod niego
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    width: '100%',
    marginBottom: spacing.sm, // Zmniejszony margines, NavBar może dodać resztę lub mieć własny padding
  },
  headerSideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: Platform.OS === 'web' ? 120 : 100,
  },
  headerLeftAlign: {
    justifyContent: 'flex-start',
  },
  headerRightAlign: {
    justifyContent: 'flex-end',
  },
  headerClubLogo: { // Podstawowe style, wymiary będą dynamiczne
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  headerJudgeAvatar: { // Podstawowe style, wymiary będą dynamiczne
    marginLeft: spacing.xs,
    borderRadius: borderRadius.sm,
    resizeMode: 'cover',
  },
  headerAvatarPlaceholder: {
    width: Platform.OS === 'web' ? 50 : 40, // Rozmiar z CompetitionScreen
    height: Platform.OS === 'web' ? 50 : 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.textLight + '20',
    marginHorizontal: spacing.xs,
  },
  headerLocationDateContainer: { // Kontener dla miejsca i daty
    justifyContent: 'center',
    // Można dodać maxWidth jeśli tekst jest za długi
  },
  headerLocationText: {
    fontSize: font.sizes.lg,
    color: colors.textLight,
    fontWeight: font.weights.semibold,
    flexShrink: 1,
  },
  headerDateText: {
    fontSize: font.sizes.sm,
    color: colors.textLight + 'aa',
    fontWeight: font.weights.regular,
    flexShrink: 1,
  },
  headerLogoText: {
    fontSize: font.sizes['3xl'],
    fontWeight: font.weights.extrabold,
    color: colors.textMainTitle,
    textAlign: 'center',
    fontFamily: font.family,
    letterSpacing: 1,
    flex: 2, // Pozwala na rozciągnięcie, ale ograniczone przez sideContainers
    marginHorizontal: spacing.sm,
  },
  headerJudgeInfoContainer: { // Kontener dla imienia sędziego
    alignItems: 'flex-end',
    marginRight: spacing.sm, // Odstęp od avatara sędziego
    // Można dodać maxWidth jeśli tekst jest za długi
  },
  headerJudgeNameText: {
    fontSize: font.sizes.lg,
    color: colors.textLight,
    fontWeight: font.weights.semibold,
    textAlign: 'right',
    flexShrink: 1,
  },
});

export const sharedMainContentStyles = StyleSheet.create({
  mainContentContainer: { // Styl dla View, które "wsuwa się" pod nagłówek
    flex: 1,
    backgroundColor: colors.background, // Tło głównej treści
   // Wsunięcie pod nagłówek (np. -20 lub wartość z borderRadius)
    paddingHorizontal: '5%', // Spójny padding poziomy
    // paddingTop powinien kompensować marginTop i dodać pożądany odstęp od góry
    // RegistrationScreen używa paddingTop: spacing.xl.
    // CompetitionScreen używał paddingTop: spacing.xl + borderRadius.xl.
    // Użyjemy paddingTop: spacing.xl + borderRadius.xl dla spójności z efektem wsunięcia.
    paddingTop: spacing.xl + borderRadius.xl,
  },
});