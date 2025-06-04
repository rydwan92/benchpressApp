import React from 'react'; // Usunięto useMemo, ponieważ nie jest potrzebny do głównego przetwarzania danych tutaj
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

// Usunięto nieużywane propsy: processedAthletes, viewMode, selectedCategory, selectedWeight,
// ponieważ `data` powinno być już ostatecznymi danymi drużynowymi.
const TeamResultsTable = ({ data }) => {
  // Prop `data` to już `teamResultsData` z ResultsScreen,
  // przetworzone i posortowane. Nie ma potrzeby ponownego przetwarzania.

  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>Brak danych klubowych do wyświetlenia.</Text>;
  }

  const headers = ['#', 'Klub', 'Total IPF Pts', 'Zawodnicy (Top 3)'];

  return (
    <View style={styles.tableContainer}>
      <ScrollView horizontal bounces={false}>
        <View>
          {/* Header Row */}
          <View style={styles.headerRow}>
            {headers.map((header, index) => (
              <Text key={index} style={[styles.headerCell, styles[`col_${index + 1}`]]}>{header}</Text>
            ))}
          </View>
          {/* Data Rows */}
          <ScrollView style={styles.dataRowsScrollView} nestedScrollEnabled>
            {data.map((item, rowIndex) => ( // Iteruj bezpośrednio po prop `data`
              <View key={item.clubName} style={[styles.dataRow, rowIndex % 2 === 1 ? styles.dataRowOdd : {}]}>
                <Text style={[styles.dataCell, styles.col_1, styles.rankCell]}>{item.rank}</Text>
                <Text style={[styles.dataCell, styles.col_2]} numberOfLines={1}>{item.clubName}</Text>
                <Text style={[styles.dataCell, styles.col_3, styles.highlightCell]}>{item.totalIPFPoints?.toFixed(2)}</Text>
                <View style={[styles.dataCell, styles.col_4, styles.contributorsCell]}>
                  {/* Dodano sprawdzenie, czy item.contributingAthletes istnieje przed mapowaniem */}
                  {item.contributingAthletes && item.contributingAthletes.map((ath, athIndex) => (
                    <Text key={athIndex} style={styles.contributorText} numberOfLines={1}>
                      {ath.name} ({ath.ipfPoints?.toFixed(2)} pts)
                    </Text>
                  ))}
                  {(!item.contributingAthletes || item.contributingAthletes.length === 0) && <Text style={styles.contributorText}>-</Text>}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    maxHeight: Platform.OS === 'web' ? '70vh' : 600,
    alignSelf: 'center', 
    minWidth: 600, 
    maxWidth: '90%', 
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.accent, 
    paddingVertical: spacing.sm,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  headerCell: {
    color: colors.textLight,
    fontWeight: font.weights.bold,
    fontSize: font.sizes.sm,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  dataRowsScrollView: {},
  dataRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'flex-start', 
  },
  dataRowOdd: {
    backgroundColor: colors.background,
  },
  dataCell: {
    color: colors.text,
    fontSize: font.sizes.sm,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
    alignSelf: 'center', 
  },
  rankCell: {
    fontWeight: font.weights.bold,
  },
  highlightCell: {
    fontWeight: font.weights.bold,
    color: colors.accent,
  },
  contributorsCell: {
    textAlign: 'left',
    alignItems: 'flex-start', 
    alignSelf: 'flex-start', 
    paddingVertical: spacing.xs, 
  },
  contributorText: {
    fontSize: font.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  noDataText: {
    textAlign: 'center',
    padding: spacing.lg,
    fontSize: font.sizes.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  col_1: { width: 50 },
  col_2: { width: 200, textAlign: 'left' },
  col_3: { width: 120 },
  col_4: { width: 250, textAlign: 'left' }, 
});

export default TeamResultsTable;