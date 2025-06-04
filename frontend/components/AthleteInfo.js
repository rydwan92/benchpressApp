import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AthleteInfoCard = ({ athlete }) => {
  if (!athlete) {
    return (
        <View style={styles.card}>
            <Text style={styles.name}>Brak aktywnego zawodnika</Text>
        </View>
    );
  }

  const categoryDisplay = athlete.kategoria || 'Brak kategorii';
  const weightDisplay = athlete.waga ? `${athlete.waga} kg` : 'Brak wagi';
  const startNumberDisplay = athlete.nrStartowy || '-';

  return (
    <View style={styles.card}>
      {/* Athlete Avatar (Optional, if available and desired here) */}
      {/* {athlete.avatar ? (
        <Image source={{ uri: athlete.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <MaterialCommunityIcons name="account" size={40} color={colors.textLight + '88'} />
        </View>
      )} */}
      <Text style={styles.name} numberOfLines={2}>{athlete.imie} {athlete.nazwisko}</Text>
      <Text style={styles.club} numberOfLines={1}>{athlete.klub || 'Brak klubu'}</Text>
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
            <MaterialCommunityIcons name="tag-outline" size={18} color={colors.textLight + 'aa'} style={styles.icon}/>
            <Text style={styles.detailText}>{categoryDisplay} / {weightDisplay}</Text>
        </View>
        <View style={styles.detailItem}>
            <MaterialCommunityIcons name="pound" size={18} color={colors.textLight + 'aa'} style={styles.icon}/>
            <Text style={styles.detailText}>Nr: {startNumberDisplay}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface + '1A', // Semi-transparent card on dark background
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600, // Max width for the card
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  // avatar: {
  //   width: 80,
  //   height: 80,
  //   borderRadius: 40,
  //   marginBottom: spacing.md,
  //   borderWidth: 2,
  //   borderColor: colors.primary,
  // },
  // avatarPlaceholder: {
  //   width: 80,
  //   height: 80,
  //   borderRadius: 40,
  //   backgroundColor: colors.surface + '33',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: spacing.md,
  // },
  name: {
    fontSize: font.sizes['3xl'], // Larger name
    fontWeight: font.weights.bold,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  club: {
    fontSize: font.sizes.xl, // Larger club
    color: colors.textLight + 'cc', // Lighter secondary text
    textAlign: 'center',
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface + '22',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  icon: {
    marginRight: spacing.xs,
  },
  detailText: {
    fontSize: font.sizes.lg, // Larger detail text
    color: colors.textLight + 'dd',
  },
});

export default AthleteInfoCard;