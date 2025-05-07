import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// --- POCZĄTEK ZMIANY: Importuj więcej stylów z theme ---
import { colors, font, spacing, shadows } from '../../theme/theme';
// --- KONIEC ZMIANY ---

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2025 Created by Michał R.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    // --- POCZĄTEK ZMIANY: Aktualizacja stylów footera ---
    backgroundColor: colors.gradient.end, // Użyj koloru końca gradientu z nagłówka
    paddingVertical: spacing.md, // Zwiększ padding pionowy
    paddingHorizontal: spacing.lg, // Dodaj padding poziomy
    // Usunięto width: '100%' - View domyślnie zajmuje całą szerokość
    alignItems: 'center', // Wyśrodkuj tekst
    borderTopWidth: 1, // Dodaj górną krawędź
    borderTopColor: colors.border, // Użyj koloru krawędzi z motywu
    // Można dodać cień, jeśli chcesz (opcjonalnie)
    // ...shadows.medium,
    // --- KONIEC ZMIANY ---
  },
  footerText: {
    // --- POCZĄTEK ZMIANY: Aktualizacja stylu tekstu ---
    color: colors.textLight + 'aa', // Jaśniejszy, lekko przezroczysty tekst
    fontSize: font.sizes.sm, // Zmniejsz rozmiar fontu
    fontFamily: font.family,
    // --- KONIEC ZMIANY ---
  },
});