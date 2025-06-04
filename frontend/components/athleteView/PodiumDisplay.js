import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme'; // Added shadows
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PodiumPlace = ({ athlete, rank }) => {
  if (!athlete) return <View style={[styles.podiumStep, styles.emptyStep]} />;

  let rankText = `${rank}.`;
  let iconName = null;
  let iconColor = colors.textLight; 

  // Użycie kolorów medali z motywu
  const goldColor = colors.gold;
  const silverColor = colors.silver;
  const bronzeColor = colors.bronze;

  if (rank === 1) {
    iconName = 'medal'; 
    iconColor = goldColor;
  } else if (rank === 2) {
    iconName = 'medal';
    iconColor = silverColor;
  } else if (rank === 3) {
    iconName = 'medal';
    iconColor = bronzeColor;
  }

  const initials = `${athlete.imie?.[0] || ''}${athlete.nazwisko?.[0] || ''}`.toUpperCase();
  // ZMIANA: Kolor tekstu inicjałów dla 1. miejsca
  const avatarPlaceholderTextColor = rank === 1 ? colors.goldDark : colors.textLight;

  return (
    <View style={[styles.podiumStep, styles[`rank${rank}Step`], rank === 1 && styles.rank1StepHighlight]}>
      {iconName && <MaterialCommunityIcons name={iconName} size={32} color={iconColor} style={styles.medalIcon} />}
      <Text style={styles.rankText} numberOfLines={1}>{rankText}</Text>
      {athlete.avatar ? (
        <Image source={{ uri: athlete.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarPlaceholder, rank === 1 && {backgroundColor: goldColor + '33'}]}>
          {/* ZMIANA: Zastosowanie dynamicznego koloru tekstu inicjałów */}
          <Text style={[styles.avatarPlaceholderText, { color: avatarPlaceholderTextColor }]}>{initials || '?'}</Text>
        </View>
      )}
      <Text style={styles.nameText} numberOfLines={2}>{athlete.imie} {athlete.nazwisko}</Text>
      <Text style={styles.detailText} numberOfLines={1}>{athlete.klub || 'Brak klubu'}</Text>
      <Text style={styles.detailTextBold} numberOfLines={1}>Best: {athlete.bestLift ? `${athlete.bestLift.toFixed(2)} kg` : '-'}</Text>
      {/* ZMIANA: Kolor tekstu dla IPF GL points */}
      {athlete.ipfPoints && <Text style={[styles.detailTextSmall, {color: colors.accent}]} numberOfLines={1}>IPF GL: {athlete.ipfPoints.toFixed(2)}</Text>}
    </View>
  );
};

export default function PodiumDisplay({ athletes }) {
  if (!athletes || athletes.length === 0) {
    return null;
  }

  const first = athletes.find(a => a.rank === 1);
  const second = athletes.find(a => a.rank === 2);
  const third = athletes.find(a => a.rank === 3);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podium</Text>
      <View style={styles.podiumContainer}>
        <View style={styles.placeWrapper}>
          {second ? <PodiumPlace athlete={second} rank={2} /> : <View style={[styles.podiumStep, styles.emptyStep, styles.rank2Step]}><Text style={styles.emptyText}>2</Text></View>}
        </View>
        <View style={styles.placeWrapper}>
          {first ? <PodiumPlace athlete={first} rank={1} /> : <View style={[styles.podiumStep, styles.emptyStep, styles.rank1Step, styles.rank1StepHighlight]}><Text style={styles.emptyText}>1</Text></View>}
        </View>
        <View style={styles.placeWrapper}>
          {third ? <PodiumPlace athlete={third} rank={3} /> : <View style={[styles.podiumStep, styles.emptyStep, styles.rank3Step]}><Text style={styles.emptyText}>3</Text></View>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface + '0D',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginVertical: spacing.md,
    flex: 1, // Dodane, aby komponent mógł się rozciągać
    alignSelf: 'stretch', // Upewnij się, że rozciąga się w kontenerze nadrzędnym
    borderWidth: 1,
    borderColor: colors.primary + '33',
    ...shadows.medium,
    justifyContent: 'center', // Aby zawartość była wyśrodkowana
  },
  title: {
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
    color: colors.textLight,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    gap: spacing.sm,
  },
  placeWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  podiumStep: {
    backgroundColor: colors.surfaceDark2 || colors.surface + '2A',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    minHeight: 140,
    borderWidth: 1,
    borderColor: colors.primaryDarker || colors.primary + '50',
    ...shadows.small,
  },
  rank1Step: {
    minHeight: 200,
  },
  rank1StepHighlight: {
    backgroundColor: (colors.gold || '#FFD700') + '20',
    borderColor: colors.gold || '#FFD700',
  },
  rank2Step: {
    minHeight: 170,
    borderColor: (colors.silver || '#C0C0C0') + '99',
  },
  rank3Step: {
    minHeight: 140,
    borderColor: (colors.bronze || '#CD7F32') + '99',
  },
  emptyStep: {
    justifyContent: 'center',
    backgroundColor: colors.surfaceDark2 + '50',
    borderColor: colors.surfaceDark,
  },
  emptyText: {
    fontSize: font.sizes['4xl'],
    fontWeight: font.weights.bold,
    color: colors.textSecondaryLight + '80',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + 'AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryDarker,
  },
  avatarPlaceholderText: {
    // Usunięto color: colors.textLight stąd, będzie dynamicznie
    fontSize: font.sizes.xl,
    fontWeight: font.weights.bold,
  },
  rankText: {
    fontSize: font.sizes.lg,
    fontWeight: font.weights.bold,
    color: colors.textSecondaryLight, // Użycie nowego koloru z theme
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  medalIcon: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    opacity: 1,
  },
  nameText: {
    fontSize: font.sizes.lg,
    fontWeight: font.weights.bold,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: font.sizes.md,
    fontWeight: font.weights.bold,
    color: colors.textSecondaryLight, // Użycie nowego koloru z theme
    textAlign: 'center',
  },
  detailTextBold: {
    fontSize: font.sizes.md,
    color: colors.textLight,
    fontWeight: font.weights.bold,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
   detailTextSmall: {
    fontSize: font.sizes.sm,
    fontWeight: font.weights.bold,
    // color: colors.primary, // Usunięto, będzie dynamicznie lub z theme
    textAlign: 'center',
    marginTop: spacing.xxs, // Użycie nowego spacingu z theme
  },
});