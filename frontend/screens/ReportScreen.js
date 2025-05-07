import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompetitionStore } from '../store/useCompetitionStore';
import NavBar from '../components/navigation/NavBar';
import Footer from '../components/navigation/Footer';
import { colors, font, spacing, borderRadius, shadows } from '../theme/theme';

export default function ReportScreen() {
  const navigation = useNavigation();
  const zawody = useCompetitionStore(state => state.zawody);
  // Stany i efekty dla avatarów (skopiuj z ResultsScreen, jeśli potrzebne w nagłówku)
  const [headerKlubAvatarDimensions, setHeaderKlubAvatarDimensions] = useState(null);
  const [headerJudgeAvatarDimensions, setHeaderJudgeAvatarDimensions] = useState({ width: 32, height: 32 });
  // useEffect(() => { ... logika dla klubAvatar ... }, [zawody.klubAvatar]);
  // useEffect(() => { { ... logika dla sedzia.avatar ... }, [zawody.sedzia?.avatar]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Nagłówek (skopiuj z ResultsScreen) */}
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.end]}
        style={styles.headerBackground}
      >
        {/* Skopiuj tutaj <View style={styles.headerBar}> ... </View> z ResultsScreen */}
        <NavBar navigation={navigation} />
      </LinearGradient>

      {/* Główna zawartość ekranu */}
      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>Pomoc pomost</Text>
        {/* Placeholder dla raportu */}
        <View style={styles.reportPlaceholder}>
          <Text style={styles.placeholderText}>Generowanie pomocy - wkrótce...</Text>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

// Style (skopiuj i dostosuj z ResultsScreen)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { flexGrow: 1 },
  headerBackground: { paddingTop: spacing.xl, ...shadows.medium },
  headerBar: { /* ... style nagłówka ... */ },
  // ... inne style nagłówka ...
  mainContent: { flex: 1, padding: spacing.lg },
  mainTitle: { fontSize: font.sizes['2xl'], fontWeight: font.weights.bold, color: colors.text, textAlign: 'center', marginBottom: spacing.lg },
  reportPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, backgroundColor: colors.surface },
  placeholderText: { fontSize: font.sizes.lg, color: colors.textSecondary },
  // ... skopiuj resztę potrzebnych stylów z ResultsScreen ...
});