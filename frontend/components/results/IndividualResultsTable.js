import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';
import { parseNumeric } from './resultsHelper'; // IMPORTED
import { MaterialCommunityIcons } from '@expo/vector-icons'; // IMPORTUJ IKONY

const getStatusChar = (status) => {
    if (status === 'passed') return '✔️';
    if (status === 'failed') return '❌';
    return '-';
};

// Funkcja pomocnicza do pobierania ikony pucharu i koloru
const getTrophyIcon = (rank) => {
    switch (rank) {
        case 1:
            return { name: 'trophy-award', color: '#FFD700' }; // Złoty
        case 2:
            return { name: 'trophy-award', color: '#C0C0C0' }; // Srebrny
        case 3:
            return { name: 'trophy-award', color: '#CD7F32' }; // Brązowy
        default:
            return null; // Brak ikony dla pozostałych miejsc
    }
};

const IndividualResultsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>Brak danych do wyświetlenia dla wybranych filtrów.</Text>;
  }

  const headers = ['#', 'Zawodnik', 'Klub', 'Kat.', 'Waga', 'Weight', 'P1', 'P2', 'P3', 'Best', 'IPF Pts'];

  return (
    <View style={styles.tableContainer}>
      <View>
        <View style={styles.headerRow}>
          {headers.map((header, index) => (
            <Text key={index} style={[styles.headerCell, styles[`col_${index + 1}`]]}>{header}</Text>
          ))}
        </View>
        <ScrollView style={styles.dataRowsScrollView} nestedScrollEnabled>
          {data.map((item, rowIndex) => {
            const trophy = getTrophyIcon(item.rank); // Pobierz ikonę dla rankingu
            return (
              <View key={item.originalIndex || rowIndex} style={[styles.dataRow, rowIndex % 2 === 1 ? styles.dataRowOdd : {}]}>
                <View style={[styles.dataCell, styles.col_1, styles.rankCellContainer]}> {/* Zmieniono na View dla elastyczności */}
                  {trophy && (
                    <MaterialCommunityIcons name={trophy.name} size={font.sizes.lg} color={trophy.color} style={styles.trophyIcon} />
                  )}
                  <Text style={styles.rankText}>{item.rank}</Text>
                </View>
                <Text style={[styles.dataCell, styles.col_2]} numberOfLines={1}>{item.imie} {item.nazwisko}</Text>
                <Text style={[styles.dataCell, styles.col_3]} numberOfLines={1}>{item.klub || '-'}</Text>
                <Text style={[styles.dataCell, styles.col_4]} numberOfLines={1}>{item.kategoria}</Text>
                <Text style={[styles.dataCell, styles.col_5]}>{item.waga}</Text>
                <Text style={[styles.dataCell, styles.col_6]}>{item.bodyWeightParsed > 0 ? item.bodyWeightParsed?.toFixed(2) : '-'}</Text>
                <Text style={[styles.dataCell, styles.col_7]}>{parseNumeric(item.podejscie1) > 0 ? parseNumeric(item.podejscie1) : '-'} {getStatusChar(item.podejscie1Status)}</Text>
                <Text style={[styles.dataCell, styles.col_8]}>{parseNumeric(item.podejscie2) > 0 ? parseNumeric(item.podejscie2) : '-'} {getStatusChar(item.podejscie2Status)}</Text>
                <Text style={[styles.dataCell, styles.col_9]}>{parseNumeric(item.podejscie3) > 0 ? parseNumeric(item.podejscie3) : '-'} {getStatusChar(item.podejscie3Status)}</Text>
                <Text style={[styles.dataCell, styles.col_10, styles.highlightCell]}>{item.bestLift > 0 ? item.bestLift?.toFixed(1) : '-'}</Text>
                <Text style={[styles.dataCell, styles.col_11, styles.highlightCell]}>{item.ipfPoints > 0 ? item.ipfPoints?.toFixed(2) : '-'}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
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
    minWidth: 1160, // Zwiększona minimalna szerokość tabeli
    maxWidth: '95%',
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
    alignItems: 'center', 
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
  rankCellContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: spacing.xs, 
  },
  rankText: { 
    fontWeight: font.weights.bold,
    fontSize: font.sizes.sm, 
    color: colors.text, 
  },
  trophyIcon: {
    marginRight: spacing.xs, 
  },
  highlightCell: {
    fontWeight: font.weights.bold,
    color: colors.accent,
  },
  noDataText: {
    textAlign: 'center',
    padding: spacing.lg,
    fontSize: font.sizes.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  // Szerokości kolumn (dostosuj według potrzeb)
  col_1: { width: 70 }, 
  col_2: { width: 200, textAlign: 'left' }, // Zawodnik - zwiększono
  col_3: { width: 170, textAlign: 'left' }, // Klub - zwiększono
  col_4: { width: 130, textAlign: 'left' }, // Kategoria - zwiększono
  col_5: { width: 80 },  // Waga Klasy
  col_6: { width: 80 },  // Weight (BW)
  col_7: { width: 85 },  // P1 - zwiększono
  col_8: { width: 85 },  // P2 - zwiększono
  col_9: { width: 85 },  // P3 - zwiększono
  col_10: { width: 85 }, // Best - zwiększono
  col_11: { width: 90 }, // IPF Pts
});

export default IndividualResultsTable;