import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useCompetitionStore from '../../store/useCompetitionStore';
import IndividualResultsTable from '../results/IndividualResultsTable';
import { processAthletesForResults, sortIndividualResults } from '../results/resultsHelper';
import { colors, font, spacing } from '../../theme/theme';

const TEMP_RESULTS_DISPLAY_DURATION = 5000; // Można też importować, jeśli jest globalna

export default function TemporaryResultsViewer({ category, weightClass, onDismiss }) {
  const zawodnicy = useCompetitionStore(state => state.zawodnicy);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, TEMP_RESULTS_DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const resultsData = useMemo(() => {
    if (!category || !weightClass || !zawodnicy) return [];
    const athletesForResults = zawodnicy.filter(
      z => z.kategoria === category && String(z.waga) === String(weightClass)
    );
    if (athletesForResults.length === 0) return [];

    const processedData = processAthletesForResults(athletesForResults);
    return sortIndividualResults(processedData).map((item, index) => ({ ...item, rank: index + 1 }));
  }, [category, weightClass, zawodnicy]);

  if (resultsData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Aktualne Wyniki: {category} - {weightClass} kg
        </Text>
        <Text style={styles.noDataText}>Brak danych do wyświetlenia dla tej grupy.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Aktualne Wyniki: {category} - {weightClass} kg
      </Text>
      <IndividualResultsTable data={resultsData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
  },
  title: {
    fontSize: font.sizes['2xl'],
    fontWeight: font.weights.bold,
    color: colors.textLight,
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: font.sizes.lg,
    color: colors.textLight + 'aa',
    textAlign: 'center',
    marginTop: spacing.xl,
  }
});