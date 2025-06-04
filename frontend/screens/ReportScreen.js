import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import useCompetitionStore  from '../store/useCompetitionStore';
import NavBar from '../components/navigation/NavBar';
import Footer from '../components/navigation/Footer';
import { colors, font, spacing, borderRadius, shadows } from '../theme/theme';

const BARBELL_WEIGHT = 20;
const COLLAR_WEIGHT_EACH = 2.5;
const COLLAR_WEIGHT_TOTAL = COLLAR_WEIGHT_EACH * 2;

// POWIĘKSZONE DEFINICJE KRĄŻKÓW
const PLATE_DEFINITIONS = [
    { weight: 25, color: colors.error, textColor: colors.white, label: '25', height: 200, width: 40 },
    { weight: 20, color: colors.info, textColor: colors.white, label: '20', height: 180, width: 36 },
    { weight: 15, color: colors.warning, textColor: colors.black, label: '15', height: 160, width: 32 },
    { weight: 10, color: '#34A853', textColor: colors.white, label: '10', height: 140, width: 28 },
    { weight: 5,  color: colors.white, textColor: colors.black, label: '5', height: 120, width: 24, borderColor: colors.border },
    { weight: 2.5,color: colors.text, textColor: colors.white, label: '2.5', height: 100, width: 20 },
    // DODANO KRĄŻEK 1.25 KG - etykieta '1.25kg' zostanie użyta
    { weight: 1.25, color: colors.border, textColor: colors.black, label: '1.25', height: 90, width: 18, borderColor: colors.text + '80' },
];

function calculatePlatesForSide(weightForSide) {
    const platesOnSideResult = [];
    let remainingWeight = parseFloat(weightForSide.toFixed(2));

    for (const plateDef of PLATE_DEFINITIONS) {
        if (remainingWeight < plateDef.weight - 0.001) {
            continue;
        }
        const count = Math.floor(remainingWeight / plateDef.weight);
        if (count > 0) {
            platesOnSideResult.push({ ...plateDef, count });
            remainingWeight -= count * plateDef.weight;
            remainingWeight = parseFloat(remainingWeight.toFixed(2));
        }
        if (remainingWeight < 0.01) break;
    }

    if (remainingWeight > 0.01) {
        console.warn(`[Ekran Pomostu] Nie można dokładnie dobrać krążków dla strony. Pozostało: ${remainingWeight}kg`);
    }
    return platesOnSideResult;
}


export default function PlatformHelpScreen() {
  const navigation = useNavigation();
  const {
    zawody,
    zawodnicy,
    activeAthleteOriginalIndex,
    activeAttemptNr,
  } = useCompetitionStore(state => ({
    zawody: state.zawody,
    zawodnicy: state.zawodnicy,
    activeAthleteOriginalIndex: state.activeAthleteOriginalIndex,
    activeAttemptNr: state.activeAttemptNr,
  }));

  const [plateDistribution, setPlateDistribution] = useState({ sideA: [], sideB: [], message: "Wybierz zawodnika i podejście.", error: null, weightPerSide: "0" });
  const [currentTargetWeight, setCurrentTargetWeight] = useState(null);
  const [currentAthleteName, setCurrentAthleteName] = useState("");

  const currentAthlete = useMemo(() => {
    if (activeAthleteOriginalIndex === null || !zawodnicy || zawodnicy.length === 0) return null;
    return zawodnicy.find(z => z.originalIndex === activeAthleteOriginalIndex); // POPRAWKA: Wyszukaj po string ID
  }, [zawodnicy, activeAthleteOriginalIndex]);

  useEffect(() => {
    if (currentAthlete && activeAttemptNr) {
      setCurrentAthleteName(`${currentAthlete.imie} ${currentAthlete.nazwisko}`);
      const attemptWeightString = currentAthlete[`podejscie${activeAttemptNr}`];
      const attemptWeight = parseFloat(attemptWeightString);

      if (!isNaN(attemptWeight) && attemptWeight > 0) {
        setCurrentTargetWeight(attemptWeight);
        const totalWeightOnBar = attemptWeight;
        const weightOfBarAndCollars = BARBELL_WEIGHT + COLLAR_WEIGHT_TOTAL;

        if (totalWeightOnBar < weightOfBarAndCollars) {
          setPlateDistribution({ sideA: [], sideB: [], error: `Docelowy ciężar (${totalWeightOnBar}kg) jest mniejszy niż sztanga z zaciskami (${weightOfBarAndCollars}kg).`, message: null, weightPerSide: "0" });
          return;
        }

        const totalWeightForPlates = parseFloat((totalWeightOnBar - weightOfBarAndCollars).toFixed(2));

        if (Math.abs(totalWeightForPlates) < 0.01) {
          setPlateDistribution({ sideA: [], sideB: [], message: `Tylko sztanga (${BARBELL_WEIGHT}kg) i zaciski (${COLLAR_WEIGHT_TOTAL}kg). Razem: ${weightOfBarAndCollars}kg.`, error: null, weightPerSide: "0" });
          return;
        }
        
        const smallestPlateUnit = PLATE_DEFINITIONS[PLATE_DEFINITIONS.length - 1].weight;
        if (parseFloat((totalWeightForPlates % (2 * smallestPlateUnit)).toFixed(2)) !== 0) {
            setPlateDistribution({
                sideA: [], sideB: [],
                error: `Nie można symetrycznie załadować. Całkowity ciężar talerzy (${totalWeightForPlates.toFixed(1)}kg) musi być wielokrotnością ${2 * smallestPlateUnit}kg.`,
                message: null, weightPerSide: "0"
            });
            return;
        }

        const weightPerSide = parseFloat((totalWeightForPlates / 2).toFixed(2));
        
        const platesForSideA = calculatePlatesForSide(weightPerSide);
        const platesForSideB = calculatePlatesForSide(weightPerSide);

        let calculationError = null;
        let tempRemainingA = weightPerSide;
        platesForSideA.forEach(p => tempRemainingA -= p.weight * p.count);
        if (Math.abs(tempRemainingA) > 0.01) {
            calculationError = `Nie można dokładnie dobrać krążków dla strony A. Pozostało: ${tempRemainingA.toFixed(2)}kg`;
        }

        if (calculationError) {
             setPlateDistribution({ sideA: [], sideB: [], error: calculationError, message: null, weightPerSide: weightPerSide.toFixed(1) });
        } else {
            setPlateDistribution({ sideA: platesForSideA, sideB: platesForSideB, message: null, error: null, weightPerSide: weightPerSide.toFixed(1) });
        }

      } else {
        setCurrentTargetWeight(null);
        setPlateDistribution({ sideA: [], sideB: [], message: "Brak zadeklarowanego ciężaru dla tego podejścia lub ciężar jest nieprawidłowy.", error: null, weightPerSide: "0" });
      }
    } else {
      setCurrentTargetWeight(null);
      setCurrentAthleteName("");
      setPlateDistribution({ sideA: [], sideB: [], message: "Wybierz zawodnika i aktywne podejście w panelu zawodów.", error: null, weightPerSide: "0" });
    }
  }, [currentAthlete, activeAttemptNr]);


  const renderPlates = (sidePlates) => {
    if (!sidePlates || sidePlates.length === 0) {
      return <View style={styles.noPlatesPlaceholder}><Text style={styles.noPlatesText}>Brak krążków</Text></View>;
    }
    return sidePlates.map((plateGroup, index) => (
      <View key={`side-${index}-${plateGroup.weight}`} style={styles.plateStack}>
        {Array.from({ length: plateGroup.count }).map((_, i) => (
          <View
            key={`${plateGroup.weight}-${i}`}
            style={[
              styles.plateVisual,
              { 
                backgroundColor: plateGroup.color, 
                height: plateGroup.height, 
                width: plateGroup.width,
                borderColor: plateGroup.borderColor || plateGroup.color,
              }
            ]}
          >
            <Text style={[
              styles.plateLabel, // Podstawowy styl (fontWeight, domyślny fontSize, textAlign)
              { color: plateGroup.textColor }, // Kolor tekstu z definicji krążka
              // Warunkowe style tylko dla krążka 1.25kg
              plateGroup.weight === 1.25 && {
                transform: [{ rotate: '90deg' }],
                fontSize: font.sizes.sm, // Mniejsza czcionka dla obróconego tekstu
              }
            ]}>
              {/* Używamy właściwości 'label', jeśli jest, inaczej 'weight' */}
              {plateGroup.label || plateGroup.weight}
            </Text>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.screenContentContainer}>
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.end]}
        style={styles.headerBackground}
      >
        <View style={styles.headerBar}>
            <View style={styles.headerSideContainer}>
                {zawody?.klubAvatar ? (
                    <Image source={{ uri: zawody.klubAvatar }} style={styles.headerClubLogo} resizeMode="contain" />
                ) : <View style={styles.headerClubLogoPlaceholder} />}
            </View>
            <View style={styles.headerCenterContainer}>
                <Text style={styles.headerTitle}>{zawody?.nazwa || 'Ekran Pomostu'}</Text>
                <Text style={styles.headerSubtitle}>
                  {zawody?.data && zawody?.miejsce ? `${zawody.data} - ${zawody.miejsce}` : (zawody?.data || zawody?.miejsce || '')}
                </Text>
            </View>
            <View style={styles.headerSideContainer}>
                {zawody?.sedzia?.avatar ? (
                    <Image source={{ uri: zawody.sedzia.avatar }} style={styles.headerJudgeAvatar} resizeMode="contain" />
                ) : <View style={styles.headerAvatarPlaceholder} />}
            </View>
        </View>
        <NavBar navigation={navigation} />
      </LinearGradient>

      <View style={styles.mainContent}>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Zawodnik: <Text style={styles.infoValue}>{currentAthleteName || '----'}</Text></Text>
          <Text style={styles.infoText}>Podejście: <Text style={styles.infoValue}>{activeAttemptNr || '-'}</Text></Text>
          <Text style={styles.infoText}>Docelowy ciężar: <Text style={styles.infoValue}>{currentTargetWeight !== null ? `${currentTargetWeight} kg` : '----'}</Text></Text>
        </View>

        {plateDistribution.error && (
          <Text style={styles.errorText}>{plateDistribution.error}</Text>
        )}
        {plateDistribution.message && !plateDistribution.error && (
          <Text style={styles.messageText}>{plateDistribution.message}</Text>
        )}

        {!plateDistribution.error && currentTargetWeight !== null && (
          <View style={styles.barbellDisplayArea}>
            <View style={styles.barbellLabelsRow}>
                <Text style={[styles.sideLabel, styles.sideLabelFlex]}>Strona A ({plateDistribution.weightPerSide || 0} kg)</Text>
                <Text style={[styles.sideLabel, styles.sideLabelFlex, styles.textAlignRight]}>Strona B ({plateDistribution.weightPerSide || 0} kg)</Text>
            </View>

            <View style={styles.barbellVisualRow}>
                <View style={[styles.platesVisualContainer, styles.platesVisualContainerLeft]}>
                    {/* Odwracamy kopię tablicy dla lewej strony, aby najcięższy był najbliżej środka */}
                    {renderPlates([...plateDistribution.sideA].reverse())}
                </View>

                <View style={styles.barbellGraphic}>
                    <View style={styles.collarGraphic}><Text style={styles.collarText}>2.5</Text></View>
                    <View style={styles.barMiddleGraphic}><Text style={styles.barText}>Sztanga 20kg</Text></View>
                    <View style={styles.collarGraphic}><Text style={styles.collarText}>2.5</Text></View>
                </View>

                <View style={[styles.platesVisualContainer, styles.platesVisualContainerRight]}>
                    {/* Prawa strona bez odwracania */}
                    {renderPlates(plateDistribution.sideB)}
                </View>
            </View>
          </View>
        )}
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors.background },
  screenContentContainer: { flexGrow: 1 },
  headerBackground: { paddingTop: Platform.OS === 'web' ? spacing.sm : spacing.xl, ...shadows.medium },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerSideContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerCenterContainer: {
    flex: 3,
    alignItems: 'center',
  },
  headerClubLogo: { width: Platform.OS === 'web' ? 60 : 50, height: Platform.OS === 'web' ? 60 : 50 },
  headerClubLogoPlaceholder: { width: Platform.OS === 'web' ? 60 : 50, height: Platform.OS === 'web' ? 60 : 50, backgroundColor: colors.surfaceVariant + '80', borderRadius: borderRadius.sm },
  headerJudgeAvatar: { width: Platform.OS === 'web' ? 50 : 40, height: Platform.OS === 'web' ? 50 : 40, borderRadius: Platform.OS === 'web' ? 25 : 20 },
  headerAvatarPlaceholder: { width: Platform.OS === 'web' ? 50 : 40, height: Platform.OS === 'web' ? 50 : 40, backgroundColor: colors.surfaceVariant + '80', borderRadius: Platform.OS === 'web' ? 25 : 20 },
  headerTitle: { fontSize: font.sizes.xl, fontWeight: font.weights.bold, color: colors.textLight, textAlign: 'center' },
  headerSubtitle: { fontSize: font.sizes.sm, color: colors.textLight + 'cc', textAlign: 'center' },
  mainContent: { flex: 1, padding: spacing.lg, alignItems: 'center' },
  mainTitle: { fontSize: font.sizes['3xl'], fontWeight: font.weights.bold, color: colors.text, textAlign: 'center', marginBottom: spacing.xl },
  infoSection: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    width: '100%',
    maxWidth: 600,
    ...shadows.small,
  },
  infoText: {
    fontSize: font.sizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  infoValue: {
    fontWeight: font.weights.bold,
    color: colors.text,
  },
  errorText: {
    fontSize: font.sizes.md,
    color: colors.error,
    textAlign: 'center',
    marginVertical: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.error + '20',
    borderRadius: borderRadius.md,
    width: '100%',
    maxWidth: 600,
  },
  messageText: {
    fontSize: font.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    width: '100%',
    maxWidth: 600,
  },

  barbellDisplayArea: { 
    alignItems: 'center',
    marginTop: spacing.lg,
    width: '100%',
    maxWidth: 900, 
    alignSelf: 'center',
  },
  barbellLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.sm, 
    marginBottom: spacing.sm,
  },
  sideLabel: { 
    fontSize: font.sizes.lg, 
    fontWeight: font.weights.semibold,
    color: colors.textSecondary,
  },
  sideLabelFlex: { 
    flex: 1, 
  },
  textAlignRight: {
    textAlign: 'right',
  },
  barbellVisualRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%',
    minHeight: PLATE_DEFINITIONS[0].height + spacing.lg, 
  },
  platesVisualContainer: { 
    flex: 1, 
    flexDirection: 'row', // Ważne: kierunek dla ułożenia stosów krążków
    alignItems: 'center',
    minHeight: PLATE_DEFINITIONS[0].height + spacing.md, 
    paddingVertical: spacing.sm,
  },
  platesVisualContainerLeft: {
    justifyContent: 'flex-end', // Stosy krążków dosunięte do prawego brzegu (do środka sztangi)
    paddingRight: spacing.sm, 
  },
  platesVisualContainerRight: {
    justifyContent: 'flex-start', // Stosy krążków dosunięte do lewego brzegu (do środka sztangi)
    paddingLeft: spacing.sm, 
  },
  barbellGraphic: { 
    flexDirection: 'row',
    alignItems: 'center',
    height: 80, 
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md, 
    marginHorizontal: spacing.md, 
  },
  barMiddleGraphic: { 
    flex: 1, 
    minWidth: 200, 
    height: '50%',
    backgroundColor: colors.textSecondary,
    marginHorizontal: 8, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm, 
  },
  barText: {
    color: colors.white,
    fontSize: font.sizes.base, 
    fontWeight: font.weights.bold,
  },
  collarGraphic: { 
    width: 60, 
    height: '100%',
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md, 
  },
  collarText: {
    color: colors.white,
    fontSize: font.sizes.sm, 
    fontWeight: font.weights.bold,
    transform: [{ rotate: '90deg' }],
  },
  plateStack: { // Kontener na grupę krążków tego samego typu
    flexDirection: 'row', // Poszczególne krążki w stosie obok siebie
    alignItems: 'center',
    marginHorizontal: 3, 
  },
  plateVisual: { // Pojedynczy krążek
    borderRadius: borderRadius.sm, 
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3, // Odstęp między poszczególnymi krążkami w stosie
    borderWidth: 1,
    overflow: 'hidden', // Dodane, aby upewnić się, że obrócony tekst nie wychodzi poza krążek 
  },
  plateLabel: {
    fontWeight: font.weights.bold,
    fontSize: font.sizes.base, // Domyślny rozmiar dla poziomych etykiet
    textAlign: 'center', // Wyśrodkowanie tekstu
  },
  noPlatesText: {
    fontSize: font.sizes.md, 
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noPlatesPlaceholder: { 
    minHeight: PLATE_DEFINITIONS[0].height, 
    justifyContent: 'center',
    alignItems: 'center',
    flex:1, 
  }
});