import React, { useState, useEffect, useRef } from 'react'; // Dodaj useRef
import { ScrollView, StyleSheet, Text, View, useWindowDimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CompetitionInfoForm from '../components/registration/CompetitionInfoForm';
import CategoryWeightManager from '../components/registration/CategoryWeightManager';
import AthleteRegistrationForm from '../components/registration/AthleteRegistrationForm';
import CategoryBrowser from '../components/registration/CategoryBrowser';
import CompetitionSummary from '../components/registration/CompetitionSummary';
import NavBar from '../components/navigation/NavBar';
import Footer from '../components/navigation/Footer'; // Upewnij się, że import jest
import { commonStyles } from '../theme/common';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../theme/theme';
import { useCompetitionStore } from '../store/useCompetitionStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const zawody = useCompetitionStore(state => state.zawody);
  const { width } = useWindowDimensions();

  // Zainicjalizuj domyślnie na true (formularz widoczny)
  const [isInfoFormVisible, setIsInfoFormVisible] = useState(true);
  const [headerKlubAvatarDimensions, setHeaderKlubAvatarDimensions] = useState(null);
  const [headerJudgeAvatarDimensions, setHeaderJudgeAvatarDimensions] = useState({ width: 32, height: 32 });
  // Ref do śledzenia, czy początkowe sprawdzenie widoczności zostało wykonane
  const initialVisibilityCheckDone = useRef(false);

  // useEffect do ustawienia początkowej widoczności formularza po załadowaniu danych
  useEffect(() => {
    // Sprawdź, czy obiekt 'zawody' istnieje, ma jakąś nazwę (sygnał załadowania danych)
    // i czy początkowe sprawdzenie nie zostało jeszcze wykonane.
    // Sprawdzamy `zawody.nazwa !== undefined`, aby upewnić się, że obiekt został załadowany
    // (domyślny stan może nie mieć klucza 'nazwa' lub mieć go jako pusty string).
    if (zawody && zawody.nazwa !== undefined && !initialVisibilityCheckDone.current) {
      const isDataComplete = !!(zawody.nazwa && zawody.miejsce && zawody.sedzia?.imie && zawody.sedzia?.nazwisko);

      // Jeśli dane są kompletne, ukryj formularz
      if (isDataComplete) {
        setIsInfoFormVisible(false);
      }
      // Oznacz, że początkowe sprawdzenie zostało wykonane, aby ten blok nie uruchomił się ponownie automatycznie
      initialVisibilityCheckDone.current = true;
    }
    // Ten efekt powinien reagować na zmiany w 'zawody', aby zadziałał po załadowaniu danych
  }, [zawody]);

  // Pozostałe useEffect dla wymiarów avatarów (bez zmian)
  useEffect(() => {
    if (zawody.klubAvatar) {
      Image.getSize(zawody.klubAvatar, (width, height) => {
        const aspectRatio = width / height;
        const maxWidth = 150;
        const maxHeight = 90;
        let displayWidth = width;
        let displayHeight = height;
        if (displayWidth > maxWidth) {
          displayWidth = maxWidth;
          displayHeight = displayWidth / aspectRatio;
        }
        if (displayHeight > maxHeight) {
          displayHeight = maxHeight;
          displayWidth = displayHeight * aspectRatio;
        }
        setHeaderKlubAvatarDimensions({ width: displayWidth, height: displayHeight });
      }, (error) => {
        console.error('Błąd pobierania rozmiaru obrazu dla nagłówka:', error);
        setHeaderKlubAvatarDimensions(null);
      });
    } else {
      setHeaderKlubAvatarDimensions(null);
    }
  }, [zawody.klubAvatar]);

  useEffect(() => {
    if (zawody.sedzia?.avatar) {
      Image.getSize(zawody.sedzia.avatar, (width, height) => {
        const aspectRatio = width / height;
        const maxWidth = 150;
        const maxHeight = 90;
        let displayWidth = width;
        let displayHeight = height;
        if (displayWidth > maxWidth) {
          displayWidth = maxWidth;
          displayHeight = displayWidth / aspectRatio;
        }
        if (displayHeight > maxHeight) {
          displayHeight = maxHeight;
          displayWidth = displayHeight * aspectRatio;
        }
        setHeaderJudgeAvatarDimensions({ width: displayWidth, height: displayHeight });
      }, (error) => {
        console.error('Błąd pobierania rozmiaru avatara sędziego:', error);
        setHeaderJudgeAvatarDimensions(null);
      });
    } else {
      setHeaderJudgeAvatarDimensions(null);
    }
  }, [zawody.sedzia?.avatar]);


  // Funkcje obsługi pozostają bez zmian
  const handleInfoSaveSuccess = () => {
    setIsInfoFormVisible(false);
    // Nie resetujemy tutaj initialVisibilityCheckDone.current, bo zapis oznacza, że dane są kompletne.
  };

  const handleEditInfoRequest = () => {
    setIsInfoFormVisible(true);
    // Ustawiamy flagę z powrotem na true, aby useEffect nie ukrył formularza od razu po zmianie 'zawody' (jeśli by zaszła)
    // Chociaż przy obecnej logice useEffect (sprawdza tylko raz), to nie jest ściśle konieczne, ale dla bezpieczeństwa:
    // initialVisibilityCheckDone.current = false; // Można rozważyć, ale może powodować problemy, jeśli dane się odświeżą w tle. Lepiej zostawić true.
  };

  // ... reszta komponentu (renderDynamicContent, return, style) bez zmian ...
  const renderDynamicContent = () => {
    return (
      <>
        {isInfoFormVisible && (
          <View style={styles.fullWidthBox}>
            <CompetitionInfoForm onSaveSuccess={handleInfoSaveSuccess} />
          </View>
        )}
        <View style={styles.mainRow}>
          <View style={styles.displayColumn}>
            <View style={commonStyles.card}>
              <CompetitionSummary
                onEditInfoRequest={handleEditInfoRequest}
                isInfoFormVisible={isInfoFormVisible}
              />
            </View>
            <View style={commonStyles.card}>
              <CategoryBrowser />
            </View>
          </View>
          <View style={styles.inputColumn}>
            <View style={commonStyles.card}>
              <CategoryWeightManager />
            </View>
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Zarejestruj zawodnika</Text>
              <AthleteRegistrationForm />
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.end]}
        style={styles.headerBackground}
      >
        <View style={styles.headerBar}>
          <View style={styles.headerSideContainer}>
            {zawody.klubAvatar && headerKlubAvatarDimensions ? (
              <Image
                source={{ uri: zawody.klubAvatar }}
                style={[styles.headerClubLogo, headerKlubAvatarDimensions]}
              />
            ) : null}
            <View style={styles.headerLocationDate}>
              <Text style={styles.headerLocationText}>{zawody.miejsce}</Text>
              <Text style={styles.headerDateText}>{zawody.data}</Text>
            </View>
          </View>
          <Text style={styles.headerLogo}>{zawody.nazwa || 'Benchpress Cup 2025'}</Text>
          <View style={[styles.headerSideContainer, styles.headerRightAlign]}>
            <View style={styles.headerJudgeInfo}>
              <Text style={styles.headerJudgeName}>{`${zawody.sedzia?.imie || ''} ${zawody.sedzia?.nazwisko || ''}`}</Text>
            </View>
            {zawody.sedzia?.avatar ? (
              <Image
                source={{ uri: zawody.sedzia.avatar }}
                style={[styles.headerJudgeAvatar, headerJudgeAvatarDimensions]}
              />
            ) : null}
          </View>
        </View>
        <NavBar navigation={navigation} />
      </LinearGradient>
      <View style={styles.mainContent}>
        <View style={styles.dynamicContainer}>
          {renderDynamicContent()}
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
}

// Style bez zmian
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerBackground: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    ...shadows.medium,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: spacing.sm,
    width: '100%',
  },
  headerSideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingBottom: spacing.xl,
  },
  headerRightAlign: {
    justifyContent: 'flex-end',
  },
  headerClubLogo: {
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  headerLocationDate: {},
  headerLocationText: {
    fontSize: font.sizes.lg,
    color: colors.textLight,
    fontWeight: font.weights.semibold,
    
  },
  headerDateText: {
    fontSize: font.sizes.lg,
    color: colors.textLight,
    fontWeight: font.weights.semibold,
  },
  headerLogo: {
    fontSize: font.sizes['3xl'],
    fontWeight: font.weights.extrabold,
    color: colors.textMainTitle,
    fontFamily: font.family,
    letterSpacing: 1,
    textAlign: 'center',
    flex: 2,
    marginHorizontal: spacing.sm,
    alligntItems: 'center',
    justifyContent: 'center',
  },
  headerJudgeInfo: {
    alignItems: 'flex-end',
    marginRight: spacing.sm,
  },
  headerJudgeName: {
    fontSize: font.sizes.lg,
    color: colors.textLight,
    fontWeight: font.weights.semibold,
  },
  headerJudgeAvatar: {
    borderRadius: borderRadius.full,
    resizeMode: 'cover',
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    marginTop: -borderRadius.xl,
    paddingHorizontal: '5%',
    paddingTop: spacing.xl,
  },
  dynamicContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  fullWidthBox: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: spacing.xl,
  },
  displayColumn: {
    flex: 1,
    gap: spacing.lg,
  },
  inputColumn: {
    flex: 1,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
  },
  sectionTitle: {
    ...componentStyles.componentTitle,
  },
});