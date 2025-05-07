import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';

const { width } = Dimensions.get('window');
const containerPadding = spacing.md; // Główny padding kontenera
const boxPadding = spacing.sm; // Padding wewnątrz kategorieBox
const gapSize = spacing.md; // Odstęp między kafelkami

// Obliczanie szerokości dla kafelków (przykład dla 2 kolumn na większych ekranach)
// Szerokość ekranu - padding kontenera * 2 - padding boxa * 2 - gap między kolumnami
const availableWidth = width - containerPadding * 2 - boxPadding * 2 - gapSize;
const tileWidthLarge = availableWidth / 2; // Szerokość dla 2 kolumn

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: containerPadding,
  },
  scrollContainer: {
    flex: 1,
  },
  componentTitle: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
    color: colors.text,
    // Zwiększamy marginesy pionowe
    marginTop: spacing.lg, // Dodaj margines górny (np. sm)
    marginBottom: spacing.lg, // Zwiększ margines dolny (np. do lg)
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  actionBtn: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.sm,
    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out', // Dodajemy płynne przejście dla web
    ...shadows.small, // Dodajmy lekki cień
  },
  actionBtnHover: { // Styl dla hover na przyciskach akcji (web)
    transform: [{ scale: 1.05 }], // Lekkie powiększenie
    // Można też lekko zmienić tło, np. rozjaśnić
    // backgroundColor: lighten(colors.accent, 0.1), // Wymagałoby funkcji lighten
    // Lub przyciemnić
    // backgroundColor: darken(colors.accent, 0.1), // Wymagałoby funkcji darken
    // Lub po prostu zwiększyć cień
    ...shadows.medium,
  },
  actionBtnText: {
    // Użyj dziedziczenia
    ...componentStyles.button.text,
    color: colors.textLight,
    // Dostosuj rozmiar, jeśli przycisk ma być mniejszy
    // fontSize: font.sizes.sm, // Jeśli celowo ma być mniejszy niż base
  },
  btnIcon: {
    marginRight: spacing.xs,
  },
  
  // Stan pustego komponentu
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    opacity: 0.7,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Kafelki kategorii
  kategorieBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // paddingHorizontal: boxPadding, // Dodajemy padding wewnątrz boxa
    // paddingVertical: boxPadding,   // Dodajemy padding wewnątrz boxa
    gap: gapSize, // Dodaje odstęp między kafelkami (zarówno w poziomie jak i pionie)
    // Usuń justifyContent jeśli było, gap lepiej zarządza przestrzenią
  },

  kategoriaTile: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
    // Ustaw domyślną szerokość - np. dla układu kolumnowego na większych ekranach
    // Użyjemy calc() dla web, ale to może nie działać w RN.
    // Bezpieczniejsza opcja to użycie flex lub minWidth.
    // Spróbujmy z flexGrow i minWidth jako bazą:
    minWidth: 200, // Minimalna szerokość, aby uniknąć zbyt wąskich kafelków
    flexGrow: 1,   // Pozwala kafelkom rosnąć i wypełniać przestrzeń
    flexBasis: `calc(50% - ${gapSize / 2}px)`, // Sugerowana baza dla 2 kolumn (działa głównie web)
    // Alternatywnie, jeśli calc nie działa:
    // flexBasis: tileWidthLarge, // Użyj obliczonej wartości, jeśli jest dostępna i poprawna dla RN
    // Lub po prostu usuń width/flexBasis i polegaj na flexGrow/minWidth
  },
  kategoriaTileHover: { // Styl dla hover na kafelku (web)
    ...shadows.medium, // Można też lekko zwiększyć cień
  },

  // Upewnij się, że styl dla małych urządzeń istnieje i działa jak oczekiwano
  // kategoriaColumnMobile: {
  //   width: '100%', // Na małych ekranach kafelek zajmuje całą szerokość
  //   flexBasis: 'auto', // Resetuj flexBasis jeśli go używasz wyżej
  // },

  kategoriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  kategoriaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: spacing.sm,
  },

  kategoriaTitle: {
    fontSize: font.sizes.lg,
    fontWeight: font.weights.semibold,
    color: colors.primary,
    marginRight: spacing.md, // Zwiększono odstęp z sm na md
    flexShrink: 1,
  },

  wagiCounter: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    minWidth: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wagiCounterText: {
    color: colors.textLight,
    fontSize: font.sizes.xs,
    fontWeight: font.weights.medium,
  },

  wagaDeleteBtn: {
    padding: spacing.xs,
    transition: 'transform 0.1s ease-in-out', // Dodajemy płynne przejście dla web
  },
  deleteBtnHover: { // Styl dla hover na przycisku usuwania (web)
    transform: [{ scale: 1.2 }], // Lekkie powiększenie
  },

  wagiContainer: {
    // Styl dla kontenera z listą wag
    // Możesz dodać paddingTop jeśli chcesz większy odstęp od headera
    // paddingTop: spacing.sm,
  },

  wagiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Pozwala kafelkom wag przechodzić do nowej linii
    gap: spacing.sm, // Odstęp między kafelkami wag
  },

  wagaTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    // Usunięto marginBottom, bo gap w wagiRow załatwia odstępy
  },

  wagaText: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginRight: spacing.xs, // Odstęp od przycisku usuwania wagi
  },

  wagiEmpty: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  deletingKategoria: { // Styl dla wizualnego feedbacku podczas usuwania
    opacity: 0.5,
    // Możesz dodać np. zmianę tła
    // backgroundColor: colors.error + '33', // Lekko czerwone tło
  },

  // Style dla modali
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
    maxWidth: 450, // Maksymalna szerokość modala
    ...shadows.large,
    alignItems: 'center', // Wyśrodkowanie zawartości modala
  },
  confirmModalCard: {
    // Dodatkowe style dla modala potwierdzenia, jeśli potrzebne
  },
  modalIconHeader: {
    marginBottom: spacing.md,
    // Możesz dodać tło dla ikony
    // backgroundColor: colors.accent + '20',
    // padding: spacing.sm,
    // borderRadius: borderRadius.full,
  },
  modalTitle: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  confirmTitle: {
    marginBottom: spacing.lg, // Większy odstęp w modalu potwierdzenia
  },
  confirmSubtitle: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.normal,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Lub 'flex-end'
    marginTop: spacing.lg,
    width: '100%', // Aby przyciski zajęły dostępną szerokość
  },
  modalBtn: {
    ...componentStyles.button.base, // Użyj bazowych stylów z theme
    flex: 1, // Aby przyciski równo się rozłożyły (jeśli chcesz)
    marginHorizontal: spacing.sm, // Odstęp między przyciskami
    maxWidth: 180, // Ogranicz maksymalną szerokość przycisku
  },
  btnText: { // Styl dla przycisków w modalach - już dziedziczy
     ...componentStyles.button.text,
  },
  btnIcon: { // Upewnij się, że ten styl istnieje i jest poprawny
     marginRight: spacing.xs,
  },
  cancelBtn: {
    backgroundColor: colors.textSecondary, // Szary dla anulowania
  },
  confirmBtn: {
    // backgroundColor: colors.primary, // Zmieniamy z primary
    backgroundColor: colors.accent, // Używamy koloru akcentu
  },
  deleteBtn: {
    backgroundColor: colors.error, // Czerwony dla usuwania (pozostaje bez zmian)
  },
  input: { // Upewnij się, że ten styl istnieje i jest poprawny
     ...componentStyles.input,
     width: '100%', // Input na całą szerokość modala
  },
  // Style dla selectBox w modalu dodawania wagi
  selectBox: {
    width: '100%',
    marginBottom: spacing.md,
    // Usunięto borderWidth, borderColor, borderRadius, padding - przeniesione do selectItemsContainer
  },
  selectLabel: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    // Można dodać fontWeight: font.weights.medium
  },
  // Zmieniamy selectScroll na selectItemsContainer
  selectItemsContainer: { // Nowy styl dla kontenera przycisków kategorii
    flexDirection: 'row',   // Układ w rzędzie
    flexWrap: 'wrap',       // Zawijanie elementów
    gap: spacing.sm,        // Odstęp między przyciskami (poziomy i pionowy)
    // Można dodać lekkie tło lub ramkę, jeśli chcesz wizualnie oddzielić ten obszar
    // backgroundColor: colors.background,
    // padding: spacing.sm,
    // borderRadius: borderRadius.md,
    // borderWidth: 1,
    // borderColor: colors.border,
    maxHeight: 150, // Ogranicz maksymalną wysokość, aby dodać przewijanie w razie potrzeby
    overflow: 'hidden', // Ukryj nadmiarowe elementy, jeśli maxHeight jest ustawione
  },
  selectItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full, // Zaokrąglone rogi dla "pigułek"
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectItemActive: {
    // backgroundColor: colors.primary, // Zmieniamy z primary
    // borderColor: colors.primary,   // Zmieniamy z primary
    backgroundColor: colors.accent, // Używamy koloru akcentu
    borderColor: colors.accent,   // Używamy koloru akcentu
  },
  selectItemText: {
    color: colors.text,
    fontSize: font.sizes.sm,
  },
  selectItemTextActive: {
    color: colors.textLight, // Tekst pozostaje jasny na tle akcentu
    fontWeight: font.weights.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: font.sizes.sm,
    textAlign: 'center',
  },
  // Style powiadomień
  notification: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? spacing.lg : 80, // Wyżej na mobilnych (np. przez pasek nawigacji)
    left: spacing.md,
    right: spacing.md,
    ...componentStyles.notification.base,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    ...shadows.medium,
  },
  notifSuccess: {
    ...componentStyles.notification.success,
  },
  notifError: {
    ...componentStyles.notification.error,
  },
  notifIcon: {
    marginRight: spacing.sm,
  },
  notifText: {
    ...componentStyles.notification.text,
    flex: 1, // Aby tekst zajął resztę miejsca
    textAlign: 'left', // Wyrównaj do lewej obok ikony
  },
});