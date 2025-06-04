import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';

const containerPadding = spacing.md;
const gapSize = spacing.md;

// Usunięto obliczenia szerokości kafelka oparte na screenWidth

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: containerPadding,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  componentTitle: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
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
    transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
    ...shadows.small,
  },
  actionBtnHover: {
    transform: [{ scale: 1.05 }],
    ...shadows.medium,
  },
  actionBtnText: {
    ...componentStyles.button.text,
    color: colors.textLight,
  },
  btnIcon: {
    marginRight: spacing.xs,
  },
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
  kategorieBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapSize,
    justifyContent: 'flex-start', // Or 'center' if you prefer items centered in the last row
    width: '100%',
  },
  kategoriaTile: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
    marginBottom: spacing.md, // For vertical spacing between rows

    // --- Responsive properties ---
    flexGrow: 1, // Allow tiles to grow to fill space in a row
    flexShrink: 1, // Allow tiles to shrink if needed, but minWidth will protect content
    flexBasis: '45%', // Suggests about 2 columns (e.g., 45% + 45% + gap fits)
    // On wider screens, if minWidth allows, more could fit if basis was smaller e.g. '30%'
    minWidth: 180,   // Minimum width for a tile to ensure content is readable
    // Adjust this value based on your content and design preference
  },
  kategoriaTileHover: {
    ...shadows.medium,
  },
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
    fontWeight: font.weights.bold,
    color: colors.primary,
    marginRight: spacing.xs,
    flexShrink: 1,
  },
  wagiCounter: {
    backgroundColor: colors.primary, // ZMIANA: Tło na primary (niebieski)
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 36,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary, // ZMIANA: Ramka również na primary
    marginLeft: spacing.xs,
  },
  wagiCounterIcon: {
    marginRight: spacing.xs,
    fontSize: font.sizes.sm,
    color: colors.textLight,
  },
  wagiCounterText: {
    color: colors.textLight,
    fontSize: font.sizes.sm,
    fontWeight: font.weights.bold,
  },
  wagaDeleteBtn: {
    padding: spacing.xs,
    transition: 'transform 0.1s ease-in-out',
  },
  deleteBtnHover: {
    transform: [{ scale: 1.2 }],
  },
  wagiContainer: {
  },
  wagiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // This already makes weight tiles responsive
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  wagaTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    ...shadows.xs,
    borderWidth: 1,
    borderColor: colors.border,
    // Weight tiles will size based on content and wrap. Add minWidth if needed.
  },
  wagaText: {
    fontSize: font.sizes.sm,
    color: colors.info,
    marginRight: spacing.xs,
    fontWeight: font.weights.bold,
  },
  wagiEmpty: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  deletingKategoria: {
    opacity: 0.5,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)', // Subtelnie ciemniejsze tło dla lepszego kontrastu
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl, // Bardziej zaokrąglone rogi dla nowoczesnego wyglądu
    padding: spacing.xl, // Zwiększony padding dla większej ilości "oddechu"
    width: '100%',
    maxWidth: 480, // Nieco szerszy modal, jeśli potrzeba
    ...shadows.large,
    alignItems: 'center',
    borderWidth: Platform.OS === 'web' ? 1 : 0, // Subtelna ramka na webie
    borderColor: Platform.OS === 'web' ? colors.border : 'transparent', // Kolor ramki
  },
  confirmModalCard: {
    // Można dodać specyficzne style dla modala potwierdzenia, jeśli potrzebne
  },
  modalIconHeader: {
    marginBottom: spacing.lg, // Większy odstęp pod ikoną
    // Można dodać tło dla ikony, jeśli pasuje do designu:
    // backgroundColor: colors.primary + '20', // Lekkie tło w kolorze primary
    // padding: spacing.sm,
    // borderRadius: borderRadius.full,
  },
  modalTitle: {
    fontSize: font.sizes.xl, // Rozmiar pozostaje, ale można zwiększyć do xxl
    fontWeight: font.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl, // Zwiększony odstęp pod tytułem
    lineHeight: font.sizes.xl * 1.3, // Lepsza czytelność dla wieloliniowych tytułów
  },
  confirmTitle: {
    marginBottom: spacing.lg,
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
    justifyContent: 'space-evenly', // Lepsze rozłożenie przycisków
    marginTop: spacing.xl, // Większy odstęp nad przyciskami
    width: '100%',
  },
  modalBtn: {
    ...componentStyles.button.base,
    flex: 1,
    marginHorizontal: spacing.sm,
    maxWidth: 180, // Maksymalna szerokość przycisku
    paddingVertical: spacing.md, // Większy padding dla przycisków
  },
  cancelBtn: {
    backgroundColor: colors.textSecondary,
  },
  confirmBtn: {
    backgroundColor: colors.accent,
  },
  deleteBtn: {
    backgroundColor: colors.error,
  },
  input: {
     ...componentStyles.input,
     width: '100%',
     fontSize: font.sizes.md, // Nieco większa czcionka w polach input
     paddingVertical: spacing.md, // Większy padding w inputach
     marginBottom: spacing.lg, // Większy odstęp pod inputem
  },
  selectBox: {
    width: '100%',
    marginBottom: spacing.lg, // Zwiększony odstęp pod selectBox
  },
  selectLabel: {
    fontSize: font.sizes.md, // Nieco większa czcionka dla etykiety
    color: colors.textSecondary, // Kolor pozostaje, ale można zmienić na colors.text
    fontWeight: font.weights.medium, // Lekkie pogrubienie dla lepszej czytelności
    marginBottom: spacing.md, // Większy odstęp pod etykietą
    textAlign: 'left', // Wyrównanie do lewej dla standardowego wyglądu etykiet
    width: '100%', // Aby textAlign działało poprawnie
  },
  selectItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md, // Zwiększony odstęp między pigułkami
    // maxHeight: 150, // Usunięte, ScrollView w komponencie kontroluje wysokość
    // overflow: 'hidden', // Usunięte
  },
  selectItem: {
    paddingVertical: spacing.sm, // Większy padding dla pigułek
    paddingHorizontal: spacing.lg, // Znacznie większy padding poziomy dla lepszego wyglądu
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    transition: 'transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
  },
  selectItemActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    transform: [{ scale: 1.05 }], // Lekkie powiększenie dla aktywnej pigułki
  },
  selectItemText: {
    color: colors.text,
    fontSize: font.sizes.sm, // Rozmiar może pozostać, lub lekko zwięksony do md
    fontWeight: font.weights.medium, // Pogrubienie dla lepszej czytelności
  },
  selectItemTextActive: {
    color: colors.textLight,
    fontWeight: font.weights.bold, // Mocniejsze pogrubienie dla aktywnego tekstu
  },
  errorText: {
    color: colors.error,
    fontSize: font.sizes.sm,
    textAlign: 'center',
  },
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
    flex: 1,
    textAlign: 'left',
  },
  btnText: { // Ten styl jest używany przez modalBtn
    ...componentStyles.button.text,
    color: colors.textLight, // Domyślny kolor tekstu na przyciskach
    fontWeight: font.weights.semibold, // Pogrubienie tekstu na przyciskach
    fontSize: font.sizes.md, // Nieco większa czcionka na przyciskach
  },
});