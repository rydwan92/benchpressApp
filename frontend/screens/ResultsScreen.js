import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompetitionStore } from '../store/useCompetitionStore';
import NavBar from '../components/navigation/NavBar';
import Footer from '../components/navigation/Footer';
import { colors, font, spacing, borderRadius, shadows } from '../theme/theme';
// import styles from '../styles/ResultsScreen.styles'; // Można przenieść style do osobnego pliku

// --- Główny komponent ekranu ---

export default function ResultsScreen() {
  const navigation = useNavigation();
  const zawody = useCompetitionStore(state => state.zawody);
  const zawodnicy = useCompetitionStore(state => state.zawodnicy);
  const kategorie = useCompetitionStore(state => state.kategorie);

  const { width } = useWindowDimensions();

  // Stany dla wymiarów avatarów z nagłówka (skopiowane z RegistrationScreen/CompetitionScreen)
  const [headerKlubAvatarDimensions, setHeaderKlubAvatarDimensions] = useState(null);
  const [headerJudgeAvatarDimensions, setHeaderJudgeAvatarDimensions] = useState({ width: 32, height: 32 });

  // Efekty do ładowania wymiarów avatarów (skopiowane z RegistrationScreen/CompetitionScreen)
  useEffect(() => {
    if (zawody.klubAvatar) {
      Image.getSize(zawody.klubAvatar, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        const maxWidth = 60;
        const maxHeight = 40;
        let displayWidth = imgWidth;
        let displayHeight = imgHeight;
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
      Image.getSize(zawody.sedzia.avatar, (imgWidth, imgHeight) => {
        const size = Math.min(imgWidth, imgHeight);
        const maxSize = 32;
        const displaySize = Math.min(size, maxSize);
        setHeaderJudgeAvatarDimensions({ width: displaySize, height: displaySize });
      }, (error) => {
        console.error('Błąd pobierania rozmiaru avatara sędziego:', error);
        setHeaderJudgeAvatarDimensions({ width: 32, height: 32 });
      });
    } else {
      setHeaderJudgeAvatarDimensions({ width: 32, height: 32 });
    }
  }, [zawody.sedzia?.avatar]);

  // Tutaj w przyszłości będzie logika obliczania wyników i sortowania

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Nagłówek skopiowany z innych ekranów */}
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
          <Text style={styles.headerLogo}>{zawody.nazwa || 'Benchpress Cup'}</Text>
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

      {/* Główna zawartość ekranu */}
      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>Wyniki zawodów</Text>

        {/* Placeholder dla tabeli/listy wyników */}
        <View style={styles.resultsPlaceholder}>
          <Text style={styles.placeholderText}>Tutaj pojawi się tabela wyników...</Text>
          {/* Można dodać bardziej szczegółowy placeholder, np. nagłówki tabeli */}
          <View style={styles.tableHeaderPlaceholder}>
            <Text style={styles.tableHeaderText}>Miejsce</Text>
            <Text style={styles.tableHeaderText}>Zawodnik</Text>
            <Text style={styles.tableHeaderText}>Klub</Text>
            <Text style={styles.tableHeaderText}>Kat.</Text>
            <Text style={styles.tableHeaderText}>Waga</Text>
            <Text style={styles.tableHeaderText}>Wynik</Text>
            <Text style={styles.tableHeaderText}>Pkt.</Text>
          </View>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

// --- Style ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  // Style nagłówka (takie same jak w CompetitionScreen)
  headerBackground: {
    paddingTop: spacing.xl,
    ...shadows.medium,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Dodano dla pewności
    paddingHorizontal: '5%',
    width: '100%',
    marginBottom: spacing.lg, // Zmieniono na lg dla spójności
  },
  headerSideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 100, // Dodano dla spójności
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
    fontSize: font.sizes.xs,
    color: colors.textLight,
    fontWeight: font.weights.medium,
  },
  headerDateText: {
    fontSize: font.sizes.xs,
    color: colors.textLight + 'aa',
  },
  headerLogo: {
    fontSize: font.sizes['3xl'],
    fontWeight: font.weights.bold, // Upewniono się, że jest bold
    color: colors.textMainTitle, // Zmieniono na textMainTitle dla spójności
    fontFamily: font.family,
    letterSpacing: 1,
    textAlign: 'center',
    // Usunięto flex: 2
    marginHorizontal: spacing.md, // Zmieniono na md dla spójności
  },
  headerJudgeInfo: {
    alignItems: 'flex-end',
    marginRight: spacing.sm,
  },
  headerJudgeName: {
    fontSize: font.sizes.xs,
    color: colors.textLight,
    fontWeight: font.weights.medium,
  },
  headerJudgeAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    resizeMode: 'cover',
  },
  // Główna zawartość
  mainContent: {
    flex: 1,
    padding: spacing.lg,
  },
  mainTitle: {
    fontSize: font.sizes['2xl'],
    fontWeight: font.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  // Placeholder dla wyników
  resultsPlaceholder: {
    flex: 1, // Aby zajął dostępną przestrzeń
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    alignItems: 'center', // Wyśrodkowanie tekstu placeholdera
    justifyContent: 'flex-start', // Placeholder na górze
  },
  placeholderText: {
    fontSize: font.sizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  tableHeaderPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderText: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    fontWeight: font.weights.medium,
    flex: 1, // Rozciągnij kolumny równomiernie (do dostosowania)
    textAlign: 'center',
  }
});