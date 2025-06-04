import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme'; // Upewnij się, że importujesz theme

export default function NavBar({ navigation }) {
  const routes = useNavigationState(state => state.routes);
  const currentRoute = routes[useNavigationState(state => state.index)].name;
  const [hoverButton, setHoverButton] = useState(null);

  // Lista przycisków nawigacyjnych z poprawnymi nazwami tras
  const navButtons = [
    { title: 'Panel zarządzania', route: 'Registration' },
    { title: 'Panel sterowania ekranem', route: 'Competition' },
    { title: 'Ekran widownia', route: 'AthleteView' },
    { title: 'Ekran pomost', route: 'Report' },
    { title: 'Wyniki', route: 'Results' },
 // POPRAWIONA NAZWA TRASY
  ];

  return (
    <View style={styles.nav}>
      {navButtons.map(btn => (
        <TouchableOpacity
          key={btn.route}
          style={[
            styles.button, // Użyj przywróconych stylów
            currentRoute === btn.route && styles.activeButton, // Użyj przywróconych stylów
            Platform.OS === 'web' && hoverButton === btn.route && styles.buttonHover // Użyj przywróconych stylów
          ]}
          onPress={() => navigation.navigate(btn.route)}
          {...(Platform.OS === 'web' && {
            onMouseEnter: () => setHoverButton(btn.route),
            onMouseLeave: () => setHoverButton(null)
          })}
        >
          <Text style={[
            styles.buttonText, // Użyj przywróconych stylów
            currentRoute === btn.route && styles.activeButtonText // Użyj przywróconych stylów
          ]}>
            {btn.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// --- Przywrócone Oryginalne Style ---
const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: '5%', // Dopasuj do paddingu headerBar
    width: '100%',
    backgroundColor: 'transparent', // Tło z gradientu nadrzędnego
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg, // Oryginalny padding poziomy
    marginHorizontal: spacing.sm, // Oryginalny margines poziomy
    borderRadius: borderRadius.md, // Oryginalny border radius
    backgroundColor: colors.surface + '30', // Lekko przezroczyste tło dla nieaktywnych
    borderWidth: 1,
    borderColor: 'transparent', // Brak widocznej ramki dla nieaktywnych
    transition: 'background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease', // Płynne przejścia dla web
    transform: [{ scale: 1 }], // Startowa skala dla animacji hover
  },
  buttonHover: { // Styl dla hover na web
    backgroundColor: colors.surface + '50', // Lekko ciemniejsze tło na hover
    borderColor: colors.accent + '50', // Lekka ramka w kolorze akcentu
    transform: [{ scale: 1.03 }], // Lekkie powiększenie
  },
  activeButton: {
    backgroundColor: colors.accent, // Pomarańczowy kolor akcentu dla aktywnego przycisku
    borderColor: colors.accent, // Ramka w kolorze akcentu
    ...shadows.small, // Cień dla aktywnego przycisku
    transform: [{ scale: 1 }], // Reset skali dla aktywnego
  },
  buttonText: {
    color: colors.textLight, // Jasny tekst na przezroczystym/pomarańczowym tle
    fontSize: font.sizes.sm, // Oryginalny rozmiar fontu
    fontWeight: font.weights.medium, // Oryginalna grubość
    textAlign: 'center',
  },
  activeButtonText: {
    color: colors.textLight, // Tekst pozostaje jasny
    fontWeight: font.weights.bold, // Pogrubiony tekst dla aktywnego
  },
});