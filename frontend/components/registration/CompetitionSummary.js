import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, StyleSheet } from 'react-native';
// Usunięto nieużywane importy FileSystem i Sharing
import  useCompetitionStore  from '../../store/useCompetitionStore';
import { loadAppData, saveAppData } from '../../utils/api';
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme'; // Importuj theme
import { AntDesign } from '@expo/vector-icons'; // Importuj ikony

// --- Komponent powiadomienia ---
function Notification({ message, type, onDismiss }) {
  /*...*/
}

// --- Główny komponent ---
export default function CompetitionSummary({ onEditInfoRequest, isInfoFormVisible }) {
  const zawodnicy = useCompetitionStore(state => state.zawodnicy);
  const setInitialData = useCompetitionStore(state => state.setInitialData);
  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);

  // --- POCZĄTEK ZMIANY: Stany dla hover ---
  const [isRefreshHovered, setIsRefreshHovered] = useState(false);
  const [isEditHovered, setIsEditHovered] = useState(false);
  // --- KONIEC ZMIANY ---

  function showNotif(msg, type) {
    /*...*/
  }

  const syncData = async () => {
    /*...*/
  };

  const allAttempts = [];
  zawodnicy.forEach(z => {
    [z.podejscie1, z.podejscie2, z.podejscie3].forEach(attempt => {
      const weight = Number(attempt);
      if (weight > 0) {
        allAttempts.push({
          imie: z.imie,
          nazwisko: z.nazwisko,
          klub: z.klub,
          weight,
        });
      }
    });
  });
  const totalWeight = allAttempts.reduce((sum, attempt) => sum + attempt.weight, 0);
  const sortedAttempts = allAttempts.sort((a, b) => b.weight - a.weight);
  const top10 = sortedAttempts.slice(0, 10);

  return (
    <View style={styles.summaryBox}>
      {/* --- POCZĄTEK ZMIANY: Zmiana treści i stylu tytułu --- */}
      <Text style={styles.headerText}>10 najlepszych wyników</Text>
      {/* --- KONIEC ZMIANY --- */}

      {/* --- POCZĄTEK ZMIANY: Kontener przycisków --- */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.refreshBtn, // Specyficzny styl dla szarego tła
            Platform.OS === 'web' && isRefreshHovered && styles.actionButtonHover // Styl hover
          ]}
          onPress={syncData}
          activeOpacity={0.8}
          // Obsługa hover dla web
          {...(Platform.OS === 'web' && {
            onMouseEnter: () => setIsRefreshHovered(true),
            onMouseLeave: () => setIsRefreshHovered(false)
          })}
        >
          <AntDesign name="sync" size={16} color={colors.textLight} style={styles.btnIcon} />
          <Text style={styles.actionButtonText}>Odśwież dane</Text>
        </TouchableOpacity>

        {!isInfoFormVisible && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.editInfoButton, // Specyficzny styl dla przycisku edycji (np. kolor akcentu)
              Platform.OS === 'web' && isEditHovered && styles.actionButtonHover // Styl hover
            ]}
            onPress={onEditInfoRequest}
            activeOpacity={0.8}
            // Obsługa hover dla web
            {...(Platform.OS === 'web' && {
              onMouseEnter: () => setIsEditHovered(true),
              onMouseLeave: () => setIsEditHovered(false)
            })}
          >
            <AntDesign name="edit" size={16} color={colors.textLight} style={styles.btnIcon} />
            <Text style={styles.actionButtonText}>Zmień informacje</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* --- KONIEC ZMIANY --- */}

      <Text style={styles.humorText}>
        Łącznie podniesiono {totalWeight} kg – wow, to ciężko!
      </Text>
      <ScrollView style={styles.attemptList}>
        {top10.length === 0 && <Text style={styles.noAttempts}>Brak podejść</Text>}
        {top10.map((at, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.rankCell}>{i + 1}.</Text>
            <Text style={styles.cell}>{at.imie} {at.nazwisko}</Text>
            <Text style={styles.cell}>{at.klub || '-'}</Text>
            <Text style={styles.weightCell}>{at.weight} kg</Text>
          </View>
        ))}
      </ScrollView>
      {notif && <Notification message={notif.message} type={notif.type} onDismiss={() => setNotif(null)} />}
    </View>
  );
}

// --- Style ---
const styles = StyleSheet.create({
  summaryBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
    marginBottom: spacing.lg,
  },
  // --- POCZĄTEK ZMIANY: Style przycisków ---
  buttonContainer: {
    flexDirection: 'row',
    // --- POCZĄTEK ZMIANY: Wyśrodkowanie przycisków ---
    justifyContent: 'center', // Wyśrodkuj przyciski
    // --- KONIEC ZMIANY ---
    gap: spacing.sm, // Odstęp między przyciskami
    marginBottom: spacing.lg, // Odstęp od reszty zawartości
  },
  actionButton: {
    ...componentStyles.button.base, // Użyj bazowych stylów przycisku
    flexDirection: 'row', // Ikona obok tekstu
    alignItems: 'center',
    paddingVertical: spacing.sm, // Dostosuj padding pionowy
    paddingHorizontal: spacing.md, // Dostosuj padding poziomy
    // Domyślne tło (może być nadpisane)
    backgroundColor: colors.primary,
    transform: [{ scale: 1 }], // Startowa skala dla animacji hover
    transition: 'transform 0.2s ease-in-out', // Płynne przejście dla web
  },
  actionButtonHover: { // Styl dla hover
    transform: [{ scale: 1.05 }], // Powiększenie
    ...shadows.medium, // Opcjonalny dodatkowy cień
  },
  actionButtonText: {
    ...componentStyles.button.text, // Użyj bazowych stylów tekstu przycisku
    // Domyślny kolor tekstu (może być nadpisany)
    color: colors.textLight,
  },
  btnIcon: {
    marginRight: spacing.xs,
  },
  refreshBtn: {
    // --- POCZĄTEK ZMIANY: Tło przycisku odświeżania ---
    backgroundColor: colors.surfaceVariant, // Jasnoszare tło
    // --- KONIEC ZMIANY ---
    borderWidth: 1,
    borderColor: colors.border,
  },
  editInfoButton: {
    backgroundColor: colors.accent, // Kolor akcentu dla przycisku edycji
  },
  // --- KONIEC ZMIANY ---
  headerText: {
    // --- POCZĄTEK ZMIANY: Użycie stylu componentTitle ---
    ...componentStyles.componentTitle, // Użyj stylu z theme
    // Usunięto fontSize, fontWeight, color, textAlign, marginBottom - są w componentTitle
    // --- KONIEC ZMIANY ---
  },
  humorText: {
    fontSize: font.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
    // --- POCZĄTEK ZMIANY: Wyśrodkowanie tekstu ---
    textAlign: 'center',
    // --- KONIEC ZMIANY ---
  },
  attemptList: {
    maxHeight: 200, // Ogranicz wysokość listy
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rankCell: {
    width: 30,
    color: colors.textSecondary,
    fontSize: font.sizes.sm,
    fontWeight: font.weights.medium,
  },
  cell: {
    flex: 1,
    color: colors.text,
    fontSize: font.sizes.sm,
  },
  weightCell: {
    width: 60,
    textAlign: 'right',
    color: colors.primary,
    fontWeight: font.weights.semibold,
    fontSize: font.sizes.sm,
  },
  noAttempts: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  // Style powiadomień bez zmian
  notification: {
    /*...*/
  },
  notifSuccess: {
    /*...*/
  },
  notifError: {
    /*...*/
  },
  notifText: {
    /*...*/
  },
});