import { StyleSheet, Platform, Dimensions } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDark,
        padding: Platform.OS === 'web' ? spacing.xl : spacing.md, // Increased padding for web
    },
    mainContent: {
        flex: 1,
    },
    athleteDetailContainer: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    athleteInfoRow: {
        flexDirection: 'row',
        alignItems: 'stretch', // Aby kolumny miały równą wysokość
        marginBottom: spacing.lg,
        minHeight: 200, // Zwiększamy minHeight, bo będzie więcej treści
        gap: spacing.md, // Odstęp między kolumnami
    },
    // NOWA KOLUMNA LEWA (dla informacji o rundzie i podium)
    leftColumnInInfoRow: {
        flex: 0.3,        
        backgroundColor: colors.backgroundDark,        
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        justifyContent: 'space-around',        
        alignItems: 'center',
        ...shadows.small,
    },
    currentRoundInfo: {
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    currentRoundLabel: {
        fontSize: font.sizes.md,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: spacing.xs,
    },
    currentRoundNumber: {
        fontSize: font.sizes['4xl'], // Duża czcionka
        fontWeight: font.weights.bold,
        color: colors.accent, // Wyróżniający kolor
    },
    podiumContainer: {
        // alignItems: 'center', // USUWAMY - to powodowało centrowanie
        alignItems: 'flex-start', // ZMIANA: Wyrównaj elementy do lewej
        width: '100%',
    },
    podiumTitle: {
        fontSize: font.sizes.sm,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
        alignSelf: 'center', // Tytuł "Top 3" nadal może być wyśrodkowany
    },
    podiumAthlete: {
        flexDirection: 'row',
        alignItems: 'center', 
        // justifyContent: 'center', // USUWAMY - jeśli używamy struktury z podiumRankAndTrophyContainer
        marginBottom: spacing.xs,
        width: '100%', // Pozwól wierszowi zająć całą szerokość
        // paddingHorizontal: spacing.xs, // Można usunąć lub zmniejszyć, jeśli chcemy pełne wyrównanie do lewej
    },
    podiumRankAndTrophyContainer: { 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', 
        minWidth: 60, 
        // backgroundColor: 'red', 
    },
    podiumRank: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.bold,
        color: colors.accent, 
        width: 25, 
        textAlign: 'right', 
    },
    podiumAthleteInfoContainer: { 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        // backgroundColor: 'blue', 
        marginLeft: spacing.sm, // ZMIANA: Zwiększenie odstępu do spacing.sm
    },
    podiumAthleteName: { // Upewnienie się, że styl jest poprawny
        fontSize: font.sizes.sm,
        color: colors.white, // Kolor biały
        fontWeight: font.weights.bold, // Pogrubienie
        flexShrink: 1, 
        marginLeft: spacing.xs, 
    },
    podiumAthleteLift: {
        fontSize: font.sizes.sm,
        color: colors.accent, 
        fontWeight: font.weights.bold,
    },
    trophyIconSmall: { 
        marginRight: spacing.sm, // ZMIANA: Zwiększenie odstępu do spacing.sm dla spójności
    },
    // ŚRODKOWA KOLUMNA (dla athleteInfoCard)
    centerColumnInInfoRow: {
        flex: 0.4, // np. 40% szerokości
        justifyContent: 'center', // Wyśrodkowanie athleteInfoCard w pionie
    },
    athleteInfoCard: { // Style dla tego bloku pozostają podobne, ale bez marginesów auto
        backgroundColor: colors.backgroundDark,
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
       // ...shadows.large,
        alignItems: 'center',
        width: '100%', // Zajmuje całą szerokość kolumny środkowej
    },
    athleteName: {
        fontSize: font.sizes['4xl'], // Larger name
        fontWeight: font.weights.bold,
        color: colors.text,
        marginBottom: spacing.sm, // Increased margin
        textAlign: 'center',
    },
    athleteNameHighlight: {
        color: colors.primary,
    },
    athleteClub: {
        fontSize: font.sizes.xl, // Utrzymujemy lub lekko zwiększamy
        color: colors.white, // ZMIANA: na główny kolor tekstu dla lepszego kontrastu
        // fontStyle: 'italic', // USUNIĘCIE kursywy, jeśli przeszkadza w czytelności
        fontWeight: font.weights.medium, // ZMIANA: lekkie pogrubienie
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    athleteCategory: { // General style for category/weight/bodyweight lines
        fontSize: font.sizes.lg, // Larger text
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    categoryValueHighlight: { // For category name
        fontWeight: font.weights.semibold,
        color: colors.white, // Use accent color
    },
    weightValueHighlight: { // For weight category value
        fontWeight: font.weights.semibold,
        color: colors.accent,
    },
    bodyWeightValueHighlight: { // For actual body weight value
        fontWeight: font.weights.semibold,
        color: colors.info, // Different color for distinction
    },
    // PRAWA KOLUMNA (dla nextUpContainer)
    rightColumnInInfoRow: {
        flex: 0.3,        
        justifyContent: 'center', 
        // alignItems: 'stretch', // Można dodać, jeśli nextUpContainer ma mieć flex:1
    },
    nextUpContainer: {        
        padding: spacing.md,
        backgroundColor: colors.backgroundDark,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        // minHeight: 150, // Możemy usunąć lub dostosować, jeśli height: '100%' działa
        width: '100%',    
        height: '100%', // ZMIANA: Aby wypełnić całą wysokość rightColumnInInfoRow
    },
    nextUpTitle: {
        fontSize: font.sizes.sm, // Można zmniejszyć, jeśli brakuje miejsca
        fontWeight: font.weights.bold,
        color: colors.primary,
        textTransform: 'uppercase',
        marginBottom: spacing.xs, // Zmniejszono margines
    },
    nextUpAthleteName: {
        fontSize: font.sizes.lg, // Można zmniejszyć
        fontWeight: font.weights.bold,
        color: colors.white,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    nextUpAthleteInfo: {
        fontSize: font.sizes.sm, // Można zmniejszyć
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: font.sizes.sm * 1.3,
        marginTop: spacing.xs,
    },
    attemptsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        marginBottom: spacing.xl,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        gap: spacing['2xl'], // ZMIANA: Zwiększony odstęp (np. z lg na xl)
        width: '100%',
    },
    timerSection: {
        alignItems: 'center',
        backgroundColor: colors.backgroundDark, // ZMIANA: Ciemne tło
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        ...shadows.medium,    
    },
    animationOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Darker overlay
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    groupViewContainer: {
        flex: 1,
        width: '100%',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface + '50', // Semi-transparent surface
    },
    placeholderText: {
        fontSize: font.sizes.xl,        color: colors.textLight,
        textAlign: 'center',
        lineHeight: font.sizes.xl * 1.5,
        paddingHorizontal: spacing.lg,
    },
    closeResultsButton: {
        position: 'absolute',
        bottom: Platform.OS === 'web' ? spacing.xl : spacing.lg,
        right: Platform.OS === 'web' ? spacing.xl : spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.pill,
        ...shadows.medium,
        zIndex: 10,
    },
    closeResultsButtonText: {
        color: colors.textLight,
        fontWeight: font.weights.semibold,
        marginLeft: spacing.sm,
        fontSize: font.sizes.md,
    },
    organizersContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'web' ? spacing.lg : spacing.md,
        right: Platform.OS === 'web' ? spacing.lg : spacing.md,
        alignItems: 'flex-start', // ZMIANA: Wyrównaj do lewej wewnątrz kontenera dla lepszego układu tytułu
        paddingVertical: spacing.sm,      // ZMIANA: Dostosowanie paddingu
        paddingHorizontal: spacing.md,    // ZMIANA: Dostosowanie paddingu
        backgroundColor: colors.surface + 'E6', // ZMIANA: Bardziej kryjące, jaśniejsze tło (90% opacity)
        borderRadius: borderRadius.lg,      // ZMIANA: Większe zaokrąglenie
        ...shadows.medium,                  // ZMIANA: Wyraźniejszy cień
        zIndex: 5,
        minWidth: 150, // Minimalna szerokość, aby tytuł i loga miały miejsce
    },
    organizersTitle: {
        fontSize: font.sizes.sm,        // ZMIANA: Nieco większa czcionka
        color: colors.text,             // ZMIANA: Ciemniejszy tekst dla lepszego kontrastu na jasnym tle
        fontWeight: font.weights.semibold, // ZMIANA: Pogrubienie
        marginBottom: spacing.sm,       // ZMIANA: Większy margines
        alignSelf: 'center', // Wyśrodkowanie tytułu, jeśli kontener jest szerszy
    },
    organizersLogos: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // ZMIANA: Wyśrodkowanie logotypów, jeśli jest miejsce
        width: '100%', // Aby justifyContent działało
        gap: spacing.md,          // ZMIANA: Większy odstęp między logami
    },
    organizerLogo: {
        width: 80,                // ZMIANA: Większy rozmiar logo
        height: 80,               // ZMIANA: Większy rozmiar logo
        borderRadius: 20,         // ZMIANA: Idealnie okrągłe (połowa width/height)
        backgroundColor: colors.backgroundDark, // Tło na wypadek problemów z ładowaniem obrazka
        borderWidth: 1,           // ZMIANA: Dodanie subtelnej ramki
        borderColor: colors.primary + 'AA', // ZMIANA: Ramka w kolorze primary z przezroczystością
        overflow: 'hidden', // Aby obrazek nie wychodził poza zaokrąglone rogi
    },
    resultsViewContainer: {
        flex: 1,
        padding: spacing.md,
        alignItems: 'center', 
        backgroundColor: colors.background, 
    },
    resultsTitle: {
        fontSize: font.sizes['4xl'], 
        fontWeight: font.weights.bold,
        color: colors.primary, 
        textAlign: 'center',
        marginBottom: spacing.lg, 
        marginTop: spacing.md, 
        paddingHorizontal: spacing.md, 
        fontFamily: font.familyTitle || font.family, 
    },
});