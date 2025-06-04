import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { Platform, Text } from 'react-native';

// Importuj swoje ekrany
import RegistrationScreen from './screens/RegistrationScreen';
import CompetitionScreen from './screens/CompetitionScreen';
import AthleteViewScreen from './screens/AthleteViewScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReportScreen from './screens/ReportScreen'; // Upewnij się, że plik istnieje
import DataInitializer from './store/DataInitializer';

const Stack = createNativeStackNavigator();

// Konfiguracja linkowania dla web
const linking = {
  prefixes: [],
  config: {
    screens: {
      Registration: 'registration',
      Competition: 'competition',
      AthleteView: 'athlete-view',
      Results: 'results',
      Report: 'report',
    },
  },
};

if (typeof document !== 'undefined') {
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto'; // Scrollowanie strony
}

export default function App() {
  return (
    <PaperProvider>
      <DataInitializer>
        <NavigationContainer
          linking={linking}
          fallback={<Text>Ładowanie...</Text>}
        >
          <Stack.Navigator
            initialRouteName="Registration"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="Competition" component={CompetitionScreen} />
            <Stack.Screen
              name="AthleteView"
              component={AthleteViewScreen}
              options={{ title: 'Widok Zawodnika' }}
            />
            <Stack.Screen
              name="Results" // Nazwa używana w NavBar i linkowaniu
              component={ResultsScreen}
              options={{ title: 'Wyniki' }}
            />
            <Stack.Screen
              name="Report" // Nazwa używana w NavBar i linkowaniu
              component={ReportScreen}
              options={{ title: 'Ekran pomost' }} // ZMIENIONY TYTUŁ (OPCJONALNIE)
            />
          </Stack.Navigator>
        </NavigationContainer>
      </DataInitializer>
    </PaperProvider>
  );
}