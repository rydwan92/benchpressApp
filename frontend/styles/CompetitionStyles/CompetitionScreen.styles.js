import { StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';
import { sharedHeaderStyles, sharedMainContentStyles } from '../../theme/sharedStyles';

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    contentContainerScrollView: {
        flex: 1,
    },
    contentContainer: { 
        flexGrow: 1,
        paddingBottom: spacing.xl, 
    },
    headerBackground: { ...sharedHeaderStyles.headerBackground },
    headerBar: { ...sharedHeaderStyles.headerBar },
    headerSideContainer: { ...sharedHeaderStyles.headerSideContainer },
    headerLeftAlign: { ...sharedHeaderStyles.headerLeftAlign },
    headerRightAlign: { ...sharedHeaderStyles.headerRightAlign },
    headerClubLogo: { ...sharedHeaderStyles.headerClubLogo },
    headerAvatarPlaceholder: { ...sharedHeaderStyles.headerAvatarPlaceholder },
    headerLocationDate: { ...sharedHeaderStyles.headerLocationDateContainer },
    headerLocationText: { ...sharedHeaderStyles.headerLocationText },
    headerDateText: { ...sharedHeaderStyles.headerDateText },
    headerLogo: { ...sharedHeaderStyles.headerLogoText },
    headerJudgeInfo: { ...sharedHeaderStyles.headerJudgeInfoContainer },
    headerJudgeName: { ...sharedHeaderStyles.headerJudgeNameText },
    headerJudgeAvatar: { ...sharedHeaderStyles.headerJudgeAvatar },
    
    mainContent: {
        ...sharedMainContentStyles.mainContentContainer,
        borderTopLeftRadius: borderRadius['2xl'],
        borderTopRightRadius: borderRadius['2xl'],
    },

    columnsContainer: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column', 
        gap: Platform.OS === 'web' ? spacing.xl : spacing.lg, 
    },
    leftColumn: {
        flex: Platform.OS === 'web' ? 1 : undefined, 
        gap: spacing.lg, 
    },
    rightColumn: { // Kontener dla Panelu Sędziego
        flex: Platform.OS === 'web' ? 1 : undefined, 
        gap: spacing.lg, 
    },
    card: { // Ogólny styl karty, używany np. dla Wyboru Grupy i Listy Zawodników
        ...componentStyles.card, 
        // Usunięto redundantne borderRadius: borderRadius.lg, ponieważ jest w componentStyles.card
        // Usunięto redundantne padding: spacing.lg, ponieważ jest w componentStyles.card
    },
    judgePanelCard: { // Specjalna karta dla całego Panelu Sędziego
        ...componentStyles.card,
        // Usunięto redundantne padding: spacing.lg, ponieważ jest w componentStyles.card
        flex: 1, // Aby panel wypełnił dostępną wysokość w kolumnie
        gap: spacing.lg, // Odstęp między tytułem panelu a jego zawartością
        borderWidth: 0, // Jawne usunięcie obramowania dla tego kontenera
    },
    columnTitle: { // Używane dla "Wybór grupy", "Lista Zawodników"
        ...componentStyles.competitionComponentTitle,
    },
    judgePanelTitle: { // Tytuł "Panel Sędziego"
        ...componentStyles.competitionComponentTitle,
        marginBottom: spacing.md, 
    },
    judgePanelContent: { 
        flex: 1,
        gap: spacing.lg, 
    },
    // Dodajemy styl dla kontenera CurrentAthleteManager w Panelu Sędziego
    currentAthleteManagerWrapper: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        ...shadows.xs,
    },
    timerSection: { 
        backgroundColor: colors.background, 
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl, 
        borderRadius: borderRadius.xl, 
        borderWidth: 2, 
        borderColor: colors.primary, 
        ...shadows.medium, 
        alignItems: 'center', // Centruje TimerDisplay w poziomie, jeśli jest węższy niż kontener
        justifyContent: 'center', // Dodane, aby centrować TimerDisplay w pionie, jeśli kontener ma stałą wysokość lub flex
        gap: spacing.md,
        // Możesz dodać minHeight, jeśli chcesz, aby sekcja timera miała określoną minimalną wysokość
        // minHeight: 100, 
    },
    judgeButtonGroupsContainer: {
        gap: spacing.lg,
    },
    judgeButtonGroup: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        ...shadows.xs,
    },
    judgeSectionTitle: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.semibold,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    judgeButtonRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainActionButton: { 
        ...componentStyles.button.base,
        flexDirection: 'row', 
        justifyContent: 'center', 
        paddingVertical: spacing.md, 
    },
    startButton: {
        backgroundColor: colors.primary,
    },
    stopButton: {
        backgroundColor: colors.warning, // Użyj warning dla stop, error może być zbyt agresywny
    },
    mainActionButtonText: {
        ...componentStyles.button.text,
        fontSize: font.sizes.md, 
    },
    actionButtonDisabled: { 
        backgroundColor: colors.button.disabled,
        opacity: 0.7,
    },
    secondaryActionButton: {
        ...componentStyles.button.base,
        backgroundColor: colors.secondary, 
        paddingVertical: spacing.sm, 
        justifyContent: 'center', 
    },
    secondaryActionButtonText: {
        ...componentStyles.button.text, 
        fontSize: font.sizes.sm, 
        color: colors.textLight, // Upewnij się, że textOnSecondary jest zdefiniowany lub użyj textLight
    },
    animationOverlayContainer: { 
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, 
    },
    groupSelectorCard: { 
        // Można dodać specyficzne style, jeśli karta wyboru grupy ma się różnić
    },
    optionSelectorContainerInColumn: { 
        // Usunięto marginBottom, OptionSelector sam zarządza swoim marginesem
    },
    athleteListCard: { 
        flex: Platform.OS === 'web' ? 1 : 0, 
        minHeight: 300, 
    },
    athleteListContainerInColumn: { 
        flex: Platform.OS === 'web' ? 1 : undefined,
        // minHeight: 300, // Można usunąć lub dostosować, jeśli AthleteList ma własne zarządzanie wysokością
    },
    // Style dla Modala
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        backgroundColor: colors.surface,
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        width: Platform.OS === 'web' ? '50%' : '90%',
        maxWidth: 500,
        ...shadows.large,
        gap: spacing.lg,
    },
    modalTitle: {
        fontSize: font.sizes.xl,
        fontWeight: font.weights.bold,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.lg,
    },
    modalButton: {
        ...componentStyles.button.base, // Użyj bazowych stylów
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        flex: 1,
        marginHorizontal: spacing.xs,
    },
    modalButtonConfirm: {
        backgroundColor: colors.primary,
    },
    modalButtonCancel: {
        backgroundColor: colors.surfaceVariant,
    },
    modalButtonText: {
        ...componentStyles.button.text,
    },
    modalButtonTextCancel: {
        color: colors.text, // Ciemniejszy tekst dla przycisku anuluj
    },
});