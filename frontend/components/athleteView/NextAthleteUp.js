import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';

export default function NextAthleteUp({ athlete }) {
  if (!athlete) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Następny Zawodnik</Text>
      <Text style={styles.name}>{athlete.imie} {athlete.nazwisko}</Text>
      {athlete.klub && <Text style={styles.club}>{athlete.klub}</Text>}
      <Text style={styles.attemptInfo}>{athlete.attemptInfo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface + '2A', // Semi-transparent
    padding: spacing.lg, // More padding
    borderRadius: borderRadius.lg, // Larger radius
    ...shadows.medium, // Slightly more shadow
    alignItems: 'center',
    marginVertical: spacing.sm, // Vertical margin if stacked
    flex: 1, // Allow flex grow
    justifyContent: 'center', // Center content vertically
  },
  title: {
    fontSize: font.sizes.lg, // Larger title
    fontWeight: font.weights.bold,
    color: colors.textLight + 'dd',
    marginBottom: spacing.md, // More margin
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: font.sizes['2xl'], // Larger name
    fontWeight: font.weights.bold,
    color: colors.textLight, // Use accent color for name
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  club: {
    fontSize: font.sizes.md, // Larger club
    color: colors.textLight + 'aa',
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  attemptInfo: {
    fontSize: font.sizes.lg, // Larger attempt info
    color: colors.textLight,
    textAlign: 'center',
    backgroundColor: colors.primary + '33',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
});