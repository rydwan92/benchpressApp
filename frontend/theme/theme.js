export const colors = {
  // Podstawowa paleta
  primary: '#2563EB',     // Niebieski
  secondary: '#1E40AF',   // Ciemniejszy niebieski
  accent: '#F59E0B',      // Pomarańczowy akcent
  
  // Tła i powierzchnie
  background: '#F3F4F6',  // Jasnoszary
  backgroundDark: '#1E293B', 
  surface: '#FFFFFF',     // Biała powierzchnia
  card: '#F9FAFB',        // Tło kart
  
  // Tekst
  text: '#1E293B',        // Główny kolor tekstu
  textSecondary: '#64748B', // Drugorzędny tekst
  textLight: '#FFFFFF',    // Jasny tekst
  textMainTitle: 'white',     // biały
  textComponentTitle: '#1E293B', 
  textSecondaryLight: '#FFFFFFaa', // DODANO: Półprzezroczysty biały

  // Stany
  success: '#10B981',     // Zielony
  error: '#EF4444',       // Czerwony
  warning: '#FBBF24',     // Żółty
  info: '#3B82F6',        // Niebieski informacyjny

  // Kolory medali
  gold: '#FFD700',        // DODANO: Złoty
  silver: '#C0C0C0',      // DODANO: Srebrny
  bronze: '#CD7F32',      // DODANO: Brązowy
  goldDark: '#B8860B',     // DODANO: Ciemniejszy złoty dla tekstu

  // Obramowania
  border: '#E5E7EB',
  
  // Przyciski
  button: {
    primary: '#2563EB',
    secondary: '#1E40AF',
    accent: '#F59E0B',
    disabled: '#94A3B8',
  },
  
  // Gradienty
  gradient: {
    start: '#2563EB',
    end: '#1E40AF',
  },

  // Dodatkowe kolory do categoryweightmanager
  white: '#FFFFFF',
  blueForCounter: '#007AFF', // Przykład niebieskiego
};

export const font = {
  family: 'Inter, system-ui, sans-serif',
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  xxs: 2, // DODANO
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Definiujemy bazowe style dla przycisków jako pierwsze
const buttonBaseStyle = {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderRadius: borderRadius.md,
  alignItems: 'center',
  justifyContent: 'center',
  ...shadows.small,
};

const buttonTextStyle = {
  color: colors.textLight,
  fontSize: font.sizes.base,
  fontWeight: font.weights.semibold,
};

// Komponenty stylistyczne wielokrotnego użytku
export const componentStyles = {
  // Kontenery
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
  },
  // Przyciski
  button: {
    base: buttonBaseStyle, // Użycie zdefiniowanej stałej
    primary: {
      backgroundColor: colors.button.primary,
    },
    secondary: {
      backgroundColor: colors.button.secondary,
    },
    accent: {
      backgroundColor: colors.button.accent,
    },
    disabled: {
      backgroundColor: colors.button.disabled,
    },
    text: buttonTextStyle, // Użycie zdefiniowanej stałej
  },
  
  // Formularze
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    fontSize: font.sizes.base,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  // Tekst
  title: { // Ogólny tytuł (np. ekranu)
    fontSize: font.sizes['2xl'],
    fontWeight: font.weights.bold,
    color: colors.text,
    fontFamily: font.family,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: font.sizes.lg,
    fontWeight: font.weights.semibold,
    color: colors.text,
    fontFamily: font.family,
    marginBottom: spacing.sm,
  },
  // Tytuł komponentu (np. w RegistrationScreen) - UJEDNOLICONY STYL
  componentTitle: {
    fontSize: font.sizes.xl, // Zwiększono rozmiar
    fontWeight: font.weights.bold, // Pogrubiono
    color: colors.textComponentTitle, // Użycie centralnej zmiennej koloru
    fontFamily: font.family,
    marginBottom: spacing.lg, // Zwiększono margines dolny
    textAlign: 'center',
  },
  // NOWY STYL DLA COMPETITION SCREEN
  competitionComponentTitle: { // Punkt 6
    fontSize: font.sizes.lg, // Nieco mniejszy niż główny componentTitle
    fontWeight: font.weights.bold,
    color: colors.text, // Standardowy kolor tekstu
    fontFamily: font.family,
    marginBottom: spacing.md,
    textAlign: 'center', // Punkt 1, 5
  },

  componentSubtitle: { // Pozostaje bez zmian
    fontSize: font.sizes.base,
    fontWeight: font.weights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  // Powiadomienia
  notification: {
    base: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginVertical: spacing.sm,
    },
    success: {
      backgroundColor: '#d4f8e8', // Jaśniejszy odcień koloru success
    },
    error: {
      backgroundColor: '#ffd6d6', // Jaśniejszy odcień koloru error
    },
    warning: {
      backgroundColor: '#fff3c4', // Jaśniejszy odcień koloru warning
    },
    info: {
      backgroundColor: '#e1edff', // Jaśniejszy odcień koloru info
    },
    text: {
      color: colors.text,
      fontWeight: font.weights.medium,
      textAlign: 'center',
    },
  },
  // Wspólne style dla przycisków w modalach
  modalButton: {
    base: {
      ...buttonBaseStyle, // Użycie zdefiniowanej stałej
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minWidth: 120,
      marginHorizontal: spacing.xs,
    },
    text: {
      ...buttonTextStyle, // Użycie zdefiniowanej stałej
      fontSize: font.sizes.sm,
      fontWeight: font.weights.medium,
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.textSecondary,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
  },
};