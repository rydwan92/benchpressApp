import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing, shadows } from '../../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Dla ikon

// Propsy dla stopki w CompetitionScreen
export default function Footer({ competitionLocation, registeredAthletesCount, totalWeightInCategory }) {
  const year = new Date().getFullYear();

  return (
    <View style={styles.footerContainer}>
      {competitionLocation !== undefined && registeredAthletesCount !== undefined && totalWeightInCategory !== undefined ? (
        // Widok dla CompetitionScreen
        <View style={styles.competitionFooterContent}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.textLight + 'aa'} />
            <Text style={styles.infoTextValue} numberOfLines={1}>{competitionLocation || 'Brak danych'}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group-outline" size={18} color={colors.textLight + 'aa'} />
            <Text style={styles.infoTextValue}>{registeredAthletesCount} zaw.</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="weight-kilogram" size={18} color={colors.textLight + 'aa'} />
            <Text style={styles.infoTextValue}>{totalWeightInCategory} kg</Text>
            <Text style={styles.infoTextLabel}>(w grupie)</Text>
          </View>
        </View>
      ) : (
        // Domyślny widok stopki
        <Text style={styles.defaultFooterText}>© {year} Benchpress Competition App by Michał R.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: colors.gradient.end, 
    paddingVertical: spacing.sm, // Zmniejszony padding dla CompetitionScreen
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight || colors.border, // Jaśniejsza krawędź
  },
  defaultFooterText: {
    color: colors.textLight + 'aa', 
    fontSize: font.sizes.xs, // Mniejszy tekst dla domyślnej stopki
    fontFamily: font.family,
  },
  // Style dla CompetitionScreen Footer
  competitionFooterContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    flex: 1, // Aby elementy równo się rozłożyły
  },
  infoTextValue: {
    color: colors.textLight,
    fontSize: font.sizes.sm,
    fontWeight: font.weights.semibold,
    marginTop: spacing.xs / 2,
    textAlign: 'center',
  },
  infoTextLabel: {
    color: colors.textLight + '99',
    fontSize: font.sizes.xs - 1, // Bardzo mała etykieta
    textAlign: 'center',
  }
});