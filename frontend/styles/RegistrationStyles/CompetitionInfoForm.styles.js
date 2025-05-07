import { StyleSheet } from 'react-native';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';

export default StyleSheet.create({
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.small,
  },
  // Nagłówek widoku (wyświetlany po zapisie)
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubLogo: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  clubLogoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: spacing.sm,
    color: colors.textSecondary,
    fontWeight: font.weights.bold,
  },
  locationDate: {
    justifyContent: 'center',
  },
  locationText: {
    fontSize: font.sizes.sm,
    color: colors.text,
  },
  dateText: {
    fontSize: font.sizes.xs,
    color: colors.textSecondary,
  },
  headerRight: {
    alignItems: 'center',
  },
  judgeAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  judgeAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.textSecondary,
    fontWeight: font.weights.bold,
    marginBottom: spacing.xs,
  },
  judgeName: {
    fontSize: font.sizes.sm,
    color: colors.text,
  },
  // Formularz edycji – etykiety oraz pola
  formContainer: {
    marginVertical: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    fontSize: font.sizes.base,
    color: colors.text,
  },
  buttonRow: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  // Avatar row – podczas edycji
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: spacing.lg,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    color: colors.textSecondary,
    fontWeight: font.weights.bold,
    fontSize: font.sizes.sm,
  },
  // Przycisk zmiany informacji – mniej widoczny
  editToggle: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    padding: spacing.xs,
  },
  editToggleText: {
    fontSize: font.sizes.xs,
    color: colors.textSecondary,
  },
  notif: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  notifSuccess: {
    backgroundColor: '#d4f8e8',
  },
  notifError: {
    backgroundColor: '#ffd6d6',
  },
  notifText: {
    color: colors.text,
    fontWeight: font.weights.medium,
    textAlign: 'center',
  },
  // Główna rządka opakowująca dwie nowe kolumny
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  // Kolumna lewa – przyklejona do lewej, szerokość 48%
  infoColLeft: {
    width: '25%',
    alignItems: 'center',
    
  },
  spacer: {
    width: '50%', // Spacja między kolumnami – możesz zwiększyć/zmniejszyć wg potrzeb
  },
  // Kolumna prawa – przyklejona do prawej, szerokość 48%
  infoColRight: {
    width: '25%',
    alignItems: 'center',
    
  },
  // Dotychczasowy styl dla pozostałych kolumn (np. avatar’y)
  infoCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  // Nowy styl dla pól wejściowych w nowej układance
  inputHalf: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 5,        // Zmniejszone z oryginalnych 10
    marginBottom: 8,
    backgroundColor: '#fff',
    // Możesz zmniejszyć fontSize – przykładowo na 80% oryginalnego
    fontSize: font.sizeNormal * 0.8,
    color: colors.text,
  },
  // Pozostałe style pozostają bez zmian
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center', // wyrównanie w pionie
    justifyContent: 'center',
    marginTop: 12,
  },
  fullInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    fontSize: font.sizes.lg,
    color: colors.text,
    marginBottom: spacing.md,
  },
    fullTable: {
    flex: 1,
    width: '100%',
    minWidth: '100%',
    alignSelf: 'stretch',
  },
  /* Style dla widoku zapisanego formularza */
  infoDisplay: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoSides: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  infoSideLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  infoSideRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: font.sizeNormal,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  infoText: {
    fontSize: font.sizeNormal,
    color: colors.text,
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: font.sizeNormal,
  },
  // Nowy styl dla większego avatara klubu
  clubAvatarBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  clubAvatarImg: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  // Styl nowego przycisku "Zapisz" – wzorowany na btnAdd z AthleteRegistrationForm
  btnAdd: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: spacing.xs,
  },
  btnText: {
    ...componentStyles.button.text,
    color: colors.textLight,
  },
  // Kontener przycisku, by umieścić go po prawej stronie
  saveButtonContainer: {
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  // Nowe style dla wyświetlenia avatara klubu w trybie "display"
  clubAvatarDisplay: {
    marginRight: spacing.sm,
    // Nie ustalamy sztywnych wymiarów – zamiast tego możemy np. ograniczyć maksymalną szerokość/ wysokość:
    maxWidth: 150,
    maxHeight: 150,
  },
  clubAvatarDisplayImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  // Dodaj poniższe style (np. pod blokiem clubAvatarBox):
  judgeAvatarBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  judgeAvatarImg: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});