import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator, TouchableOpacity, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import useCompetitionStore from '../store/useCompetitionStore';
import { styles } from '../styles/ResultsStyles/ResultsScreen.styles';
import { colors, spacing } from '../theme/theme';
import NavBar from '../components/navigation/NavBar';
import FooterComp from '../components/navigation/Footer';
import OptionSelector from '../components/competition/OptionSelector';
import IndividualResultsTable from '../components/results/IndividualResultsTable';
import TeamResultsTable from '../components/results/TeamResultsTable';
import { processAthletesForResults, sortIndividualResults, calculateTeamResults, generateCSV } from '../components/results/resultsHelper';

// --- POCZĄTEK ZMIANY: Definicja stałych dla "Wszystkich" opcji ---
const ALL_CATEGORIES_VALUE = "__ALL_CATEGORIES__";
const ALL_WEIGHTS_VALUE = "__ALL_WEIGHTS__";
// --- KONIEC ZMIANY ---

export default function ResultsScreen() {
  const navigation = useNavigation();
  const zawody = useCompetitionStore(state => state.zawody);
  const kategorieStore = useCompetitionStore(state => state.kategorie);
  const zawodnicyStore = useCompetitionStore(state => state.zawodnicy);

  const [headerKlubAvatarDimensions, setHeaderKlubAvatarDimensions] = useState(null);
  const [headerJudgeAvatarDimensions, setHeaderJudgeAvatarDimensions] = useState(null);

  const [viewMode, setViewMode] = useState('individual'); // 'individual', 'team'
  // --- POCZĄTEK ZMIANY: Inicjalizacja stanu nowymi stałymi ---
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_VALUE);
  const [selectedWeight, setSelectedWeight] = useState(ALL_WEIGHTS_VALUE);
  // --- KONIEC ZMIANY ---
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (zawody.klubAvatar) {
      Image.getSize(zawody.klubAvatar, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        const displayHeight = Platform.OS === 'web' ? 50 : 40;
        setHeaderKlubAvatarDimensions({ width: displayHeight * aspectRatio, height: displayHeight });
      }, () => setHeaderKlubAvatarDimensions(null));
    } else setHeaderKlubAvatarDimensions(null);
  }, [zawody.klubAvatar]);

  useEffect(() => {
    if (zawody.sedzia?.avatar) {
      Image.getSize(zawody.sedzia.avatar, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        const displayHeight = Platform.OS === 'web' ? 40 : 32;
        setHeaderJudgeAvatarDimensions({ width: displayHeight * aspectRatio, height: displayHeight });
      }, () => setHeaderJudgeAvatarDimensions(null));
    } else setHeaderJudgeAvatarDimensions(null);
  }, [zawody.sedzia?.avatar]);

  // --- POCZĄTEK ZMIANY: Reset selectedWeight gdy selectedCategory się zmienia ---
  useEffect(() => {
    setSelectedWeight(ALL_WEIGHTS_VALUE);
  }, [selectedCategory]);
  // --- KONIEC ZMIANY ---

  const processedAthletes = useMemo(() => {
    if (typeof processAthletesForResults !== 'function') {
      console.error('processAthletesForResults is NOT a function!');
      return [];
    }
    setIsLoading(true);
    const result = processAthletesForResults(zawodnicyStore);
    setIsLoading(false);
    return result;
  }, [zawodnicyStore]);

  const kategorieOptions = useMemo(() => [
    // --- POCZĄTEK ZMIANY: Użycie stałej dla "Wszystkich Kategorii" ---
    { label: 'Wszystkie Kategorie', value: ALL_CATEGORIES_VALUE },
    // --- KONIEC ZMIANY ---
    ...kategorieStore.map(k => ({ label: k.nazwa, value: k.nazwa }))
  ], [kategorieStore]);

  const weightOptions = useMemo(() => {
    // --- POCZĄTEK ZMIANY: Użycie stałej i dostosowanie logiki ---
    const baseOptions = [{ label: 'Wszystkie Wagi', value: ALL_WEIGHTS_VALUE }];
    if (selectedCategory === ALL_CATEGORIES_VALUE) {
      return baseOptions;
    }
    // --- KONIEC ZMIANY ---
    const categoryObj = kategorieStore.find(k => k.nazwa === selectedCategory);
    if (!categoryObj || !categoryObj.wagi || categoryObj.wagi.length === 0) return baseOptions;
    return [
      ...baseOptions,
      ...categoryObj.wagi.map(w => ({ label: String(w), value: String(w) }))
    ];
  }, [kategorieStore, selectedCategory]);

  const individualResultsData = useMemo(() => {
    if (viewMode !== 'individual') return [];
    if (typeof sortIndividualResults !== 'function') {
        console.error('sortIndividualResults is NOT a function!');
        return [];
    }
    setIsLoading(true);
    let filtered = processedAthletes;
    // --- POCZĄTEK ZMIANY: Dostosowanie logiki filtrowania ---
    if (selectedCategory && selectedCategory !== ALL_CATEGORIES_VALUE) {
      filtered = filtered.filter(a => a.kategoria === selectedCategory);
    }
    if (selectedWeight && selectedWeight !== ALL_WEIGHTS_VALUE) {
      filtered = filtered.filter(a => String(a.waga) === String(selectedWeight));
    }
    // --- KONIEC ZMIANY ---
    const sorted = sortIndividualResults(filtered).map((a, index) => ({ ...a, rank: index + 1 }));
    setIsLoading(false);
    return sorted;
  }, [processedAthletes, viewMode, selectedCategory, selectedWeight]);

  const teamResultsData = useMemo(() => {
    if (viewMode !== 'team') return [];
    if (typeof calculateTeamResults !== 'function') {
        console.error('calculateTeamResults is NOT a function!');
        return [];
    }
    setIsLoading(true);
    const teams = calculateTeamResults(processedAthletes);
    setIsLoading(false);
    return teams;
  }, [processedAthletes, viewMode]);

  const viewModeOptions = [
    { label: 'Indywidualnie', value: 'individual' },
    { label: 'Klubowe', value: 'team' },
  ];

  const handleExport = async () => {
    let dataToExport;
    let columns;
    let fileName = `wyniki_${zawody.nazwa?.replace(/\s+/g, '_') || 'zawodow'}`;

    if (viewMode === 'individual') {
      dataToExport = individualResultsData;
      fileName += `_indywidualne`;
      if (selectedCategory && selectedCategory !== ALL_CATEGORIES_VALUE) fileName += `_${selectedCategory.replace(/\s+/g, '_')}`;
      if (selectedWeight && selectedWeight !== ALL_WEIGHTS_VALUE) fileName += `_waga_${selectedWeight}`;
      columns = [
        { label: 'Rank', accessor: row => row.rank },
        { label: 'Imię', accessor: row => row.imie },
        { label: 'Nazwisko', accessor: row => row.nazwisko },
        { label: 'Klub', accessor: row => row.klub },
        { label: 'Płeć', accessor: row => row.plec },
        { label: 'Kat.', accessor: row => row.kategoria },
        { label: 'Waga', accessor: row => row.waga },
        { label: 'Waga Ciała', accessor: row => row.bodyWeightParsed?.toFixed(2) },
        { label: 'P1', accessor: row => `${row.podejscie1 || '-'} (${row.podejscie1Status || 'N'})` },
        { label: 'P2', accessor: row => `${row.podejscie2 || '-'} (${row.podejscie2Status || 'N'})` },
        { label: 'P3', accessor: row => `${row.podejscie3 || '-'} (${row.podejscie3Status || 'N'})` },
        { label: 'Best Lift', accessor: row => row.bestLift?.toFixed(2) },
        { label: 'IPF GL Pts', accessor: row => row.ipfPoints?.toFixed(2) },
      ];
    } else { // team
      dataToExport = teamResultsData;
      fileName += `_klubowe`;
      columns = [
        { label: 'Rank', accessor: row => row.rank },
        { label: 'Klub', accessor: row => row.clubName },
        { label: 'Total IPF GL Pts', accessor: row => row.totalIPFPoints?.toFixed(2) },
        { label: 'Liczba Zaw. w Klubie', accessor: row => row.allAthletesInClubCount },
      ];
    }
    fileName += '.csv';

    if (dataToExport.length === 0) {
      Alert.alert("Eksport", "Brak danych do wyeksportowania dla wybranych filtrów.");
      return;
    }

    if (typeof generateCSV !== 'function') {
        console.error('generateCSV is NOT a function!');
        Alert.alert("Błąd", "Funkcja eksportu jest niedostępna.");
        return;
    }
    const csvString = generateCSV(dataToExport, columns);

    if (Platform.OS === 'web') {
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else { // Mobile
      try {
        const path = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(path, csvString, { encoding: FileSystem.EncodingType.UTF8 });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Udostępnij wyniki CSV' });
        } else {
          Alert.alert("Błąd", "Udostępnianie nie jest dostępne na tym urządzeniu.");
        }
      } catch (error) {
        console.error("Błąd eksportu CSV na mobile:", error);
        Alert.alert("Błąd Eksportu", "Nie udało się zapisać lub udostępnić pliku CSV.");
      }
    }
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.end]}
        style={styles.headerBackground}
      >
        <View style={styles.headerBar}>
          <View style={[styles.headerSideContainer, styles.headerLeftAlign]}>
            {headerKlubAvatarDimensions && zawody.klubAvatar ? (
              <Image source={{ uri: zawody.klubAvatar }} style={[styles.headerClubLogo, headerKlubAvatarDimensions]} resizeMode="contain" />
            ) : <View style={styles.headerAvatarPlaceholder} />}
            <View style={styles.headerLocationDate}>
              <Text style={styles.headerLocationText} numberOfLines={1}>{zawody.miejsce || 'Lokalizacja'}</Text>
              <Text style={styles.headerDateText}>{zawody.data || 'Data'}</Text>
            </View>
          </View>
          <Text style={styles.headerLogo} numberOfLines={1}>{zawody.nazwa || 'Nazwa Zawodów'}</Text>
          <View style={[styles.headerSideContainer, styles.headerRightAlign]}>
            <View style={styles.headerJudgeInfo}>
              <Text style={styles.headerJudgeName} numberOfLines={1}>{`${zawody.sedzia?.imie || ''} ${zawody.sedzia?.nazwisko || 'Sędzia'}`.trim()}</Text>
            </View>
            {headerJudgeAvatarDimensions && zawody.sedzia?.avatar ? (
              <Image source={{ uri: zawody.sedzia.avatar }} style={[styles.headerJudgeAvatar, headerJudgeAvatarDimensions]} resizeMode="contain" />
            ) : <View style={styles.headerAvatarPlaceholder} />}
          </View>
        </View>
        <NavBar navigation={navigation} />
      </LinearGradient>

      <View style={styles.mainContent}>
        <Text style={styles.screenTitle}>Wyniki Końcowe</Text>

        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <OptionSelector
              label="Tryb Widoku"
              options={viewModeOptions}
              selectedValue={viewMode}
              onSelect={setViewMode}
            />
          </View>
          {viewMode === 'individual' && (
            <>
              <View style={styles.filterGroup}>
                <OptionSelector
                  label="Kategoria"
                  options={kategorieOptions}
                  selectedValue={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </View>
              <View style={styles.filterGroup}>
                <OptionSelector
                  label="Klasa Wagowa"
                  options={weightOptions}
                  selectedValue={selectedWeight}
                  onSelect={setSelectedWeight}
                  // --- POCZĄTEK ZMIANY: Uproszczenie logiki disabled ---
                  // Jeśli wybrano "Wszystkie Kategorie", selektor wagi jest nieaktywny (bo i tak będzie "Wszystkie Wagi")
                  // lub jeśli nie ma kategorii w ogóle.
                  disabled={selectedCategory === ALL_CATEGORIES_VALUE || kategorieStore.length === 0}
                  // --- KONIEC ZMIANY ---
                />
              </View>
            </>
          )}
        </View>

        {isLoading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: spacing.xl }} />}

        {!isLoading && viewMode === 'individual' && (
          <IndividualResultsTable data={individualResultsData} />
        )}
        {!isLoading && viewMode === 'team' && (
          <TeamResultsTable data={teamResultsData} />
        )}

        {!isLoading && (individualResultsData.length > 0 || teamResultsData.length > 0) && (
            <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
                <MaterialCommunityIcons name="table-arrow-right" size={20} color={colors.textLight} style={{ marginRight: spacing.sm }} />
                <Text style={styles.exportButtonText}>Eksportuj do CSV</Text>
            </TouchableOpacity>
        )}

      </View>
      <FooterComp
        competitionLocation={zawody.miejsce}
        registeredAthletesCount={zawodnicyStore.length}
      />
    </ScrollView>
  );
}