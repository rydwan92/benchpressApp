import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useCompetitionStore } from '../../store/useCompetitionStore';
import { colors, font } from '../../theme/theme';

export default function AthleteTable() {
  const zawodnicy = useCompetitionStore((state) => state.zawodnicy);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Lista zawodników</Text>
      <ScrollView style={styles.scrollArea}>
        {zawodnicy.length === 0 && (
          <Text style={styles.empty}>Brak zawodników</Text>
        )}
        {zawodnicy.map((z, idx) => (
          <View style={styles.card} key={idx}>
            <View style={styles.row}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {z.imie?.[0]?.toUpperCase() || '?'}
                  {z.nazwisko?.[0]?.toUpperCase() || ''}
                </Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.name}>{z.imie} {z.nazwisko}</Text>
                <Text style={styles.club}>{z.klub}</Text>
                <Text style={styles.category}>{z.kategoria}</Text>
              </View>
              <View style={styles.attemptCol}>
                <Text style={styles.attemptLabel}>P1</Text>
                <Text style={styles.attemptValue}>
                  {z.podejscie1 ? `${z.podejscie1} kg` : <Text style={styles.attemptEmpty}>–</Text>}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    fontSize: font.sizeHeader + 2,
    fontWeight: font.weightBold,
    marginBottom: 18,
    fontFamily: font.family,
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  scrollArea: {
    maxHeight: 340,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: font.family,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: font.sizeNormal + 2,
    fontWeight: font.weightBold,
    color: colors.text,
    fontFamily: font.family,
    marginBottom: 2,
  },
  club: {
    fontSize: font.sizeNormal - 1,
    color: colors.textSecondary,
    fontFamily: font.family,
    marginBottom: 2,
  },
  category: {
    fontSize: font.sizeNormal - 2,
    color: colors.primary,
    fontFamily: font.family,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  attemptCol: {
    alignItems: 'center',
    minWidth: 60,
    marginLeft: 12,
  },
  attemptLabel: {
    fontSize: font.sizeNormal - 2,
    color: colors.textSecondary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  attemptValue: {
    fontSize: font.sizeNormal + 2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  attemptEmpty: {
    color: colors.border,
    fontWeight: 'normal',
  },
  empty: {
    margin: 24,
    color: colors.textSecondary,
    fontFamily: font.family,
    textAlign: 'center',
    fontSize: font.sizeNormal,
  },
});