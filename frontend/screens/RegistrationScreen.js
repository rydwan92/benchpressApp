import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CompetitionInfoForm from '../components/registration/CompetitionInfoForm';
import AthleteRegistrationForm from '../components/registration/AthleteRegistrationForm';
import CategoryWeightManager from '../components/registration/CategoryWeightManager';
import CategoryBrowser from '../components/registration/CategoryBrowser';
import CompetitionSummary from '../components/registration/CompetitionSummary';
import NavBar from '../components/navigation/NavBar';
import Footer from '../components/navigation/Footer';
// Corrected/verified imports for theme and commonStyles
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../theme/theme';
import { commonStyles } from '../theme/common'; // Ensure this path is correct relative to RegistrationScreen.js
import  useCompetitionStore  from '../store/useCompetitionStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const zawody = useCompetitionStore(state => state.zawody);
  const { width } = useWindowDimensions();

  const [isInfoFormVisible, setIsInfoFormVisible] = useState(true);
  const [headerKlubAvatarDimensions, setHeaderKlubAvatarDimensions] = useState(null);
  const [headerJudgeAvatarDimensions, setHeaderJudgeAvatarDimensions] = useState({ width: 32, height: 32 });
  const initialVisibilityCheckDone = useRef(false);

  useEffect(() => {
    if (zawody && zawody.nazwa !== undefined && !initialVisibilityCheckDone.current) {
      const isDataComplete = !!(zawody.nazwa && zawody.miejsce && zawody.sedzia?.imie && zawody.sedzia?.nazwisko);
      if (isDataComplete) {
        setIsInfoFormVisible(false);
      }
      initialVisibilityCheckDone.current = true;
    }
  }, [zawody]);

  // Funkcja do przełączania widoczności formularza informacji o zawodach
  const handleToggleInfoForm = () => {
    setIsInfoFormVisible(prev => !prev);
  };

  const handleSaveInfoSuccess = () => {
    setIsInfoFormVisible(false); // Ukryj formularz po pomyślnym zapisie
  };

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
      }, () => setHeaderKlubAvatarDimensions(null));
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
      }, () => setHeaderJudgeAvatarDimensions(null));
    } else {
      setHeaderJudgeAvatarDimensions(null);
    }
  }, [zawody.sedzia?.avatar]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.end]}
        style={styles.headerBackground}
      >
        <View style={styles.headerBar}>
          {/* Lewa strona nagłówka (logo klubu, miejsce, data) */}
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
          {/* Środek nagłówka */}
          <Text style={styles.headerLogo}>{zawody.nazwa || 'Benchpress Cup 2025'}</Text>
          {/* Prawa strona nagłówka (sędzia, avatar sędziego) */}
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
        {isInfoFormVisible && (
          <View style={styles.card}>
            <CompetitionInfoForm onSaveSuccess={handleSaveInfoSuccess} />
          </View>
        )}
        <View style={styles.topRow}>
          <View style={styles.topRowCol}>
            <View style={styles.card}>
              <AthleteRegistrationForm />
            </View>
          </View>
          <View style={styles.topRowCol}>
            <View style={styles.card}>
              <CategoryWeightManager />
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <CategoryBrowser />
        </View>
        <View style={styles.summaryFullWidth}>
          <CompetitionSummary 
            onEditInfoRequest={handleToggleInfoForm} 
            isInfoFormVisible={isInfoFormVisible} 
          />
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerBackground: {
    paddingTop: spacing.xl, // Use theme variable
    paddingBottom: spacing.md, // Use theme variable
    ...shadows.medium, // Use theme variable
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%', // Consider using spacing.lg or xl if '5%' is inconsistent
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
    borderRadius: borderRadius.sm, // Use theme variable
  },
  headerLocationDate: {},
  headerLocationText: {
    fontSize: font.sizes.lg, // Use theme variable
    color: colors.textLight, // Use theme variable
    fontWeight: font.weights.semibold, // Use theme variable
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
    fontFamily: font.family, // Use theme variable
    letterSpacing: 1,
    textAlign: 'center',
    flex: 2,
    marginHorizontal: spacing.sm,
    alignItems: 'center',
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
    borderRadius: borderRadius.sm,
    resizeMode: 'cover',
  },
  mainContent: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius['2xl'], // Use theme variable
    borderTopRightRadius: borderRadius['2xl'], // Use theme variable
    marginTop: -borderRadius.xl, // Use theme variable
    paddingHorizontal: '5%', // Consider spacing.lg or xl
    paddingTop: spacing.xl,
  },
  dynamicContainer: { // This style was in a previous version, ensure it's used if needed
    width: '100%',
    marginBottom: spacing.xl,
  },
  fullWidthBox: { // This style was in a previous version, ensure it's used if needed
    width: '100%',
    marginBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.xl,
    width: '100%',
  },
  topRowCol: {
    flex: 1,
    minWidth: 0,
  },
  card: { // This should be visually consistent with componentStyles.card
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.small,
    marginBottom: spacing.lg,
  },
  sectionTitle: { // Ensure this uses componentStyles.componentTitle or a similar shared style
    ...componentStyles.componentTitle, // Example of using shared style
    marginBottom: spacing.md,
  },
  summaryFullWidth: {
    width: '100%',
    marginTop: spacing.xl,
    marginBottom: 0,
    alignSelf: 'stretch',
  },
});