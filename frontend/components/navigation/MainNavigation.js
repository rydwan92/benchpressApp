import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../../screens/RegistrationScreen';
import CompetitionScreen from '../../screens/CompetitionScreen';
import ResultsScreen from '../../screens/ResultsScreen'; // <-- Dodaj import
// import kolejne ekrany...

// Usuń lub zakomentuj Placeholder, jeśli nie jest już potrzebny
// import { View, Text } from 'react-native';
// const Placeholder = ({ name }) => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Placeholder dla: {name}</Text>
//   </View>
// );

const Stack = createStackNavigator();

export default function MainNavigation() {
    return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Rejestracja" component={RegistrationScreen} />
            <Stack.Screen name="Zawody" component={CompetitionScreen} />
            <Stack.Screen name="Widok Zawodów" component={AthleteViewScreen} />
            {/* Zmień komponent dla trasy "Wyniki" */}
            <Stack.Screen name="Wyniki" component={ResultsScreen} />
            {/* Pozostaw Placeholdery lub zastąp je właściwymi ekranami */}
            <Stack.Screen name="Pomoc pomost" component={() => <Placeholder name="Help" />} />
          </Stack.Navigator>
        </NavigationContainer>
      );
}

// Dodaj definicję Placeholder, jeśli została usunięta, a jest nadal potrzebna dla Raport/Instrukcja
import { View, Text } from 'react-native';
import AthleteViewScreen from '../../screens/AthleteViewScreen';
const Placeholder = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Placeholder dla: {name}</Text>
  </View>
);

// Przykład przycisku nawigacji do ekranu pomostowego
<Button
  title="Ekran pomost"
  onPress={() => navigation.navigate('PlatformScreen')} // <--- POPRAWIONA NAZWA EKRANU
/>