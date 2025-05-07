import React, { useState, useRef } from 'react';
// Upewnij się, że importujesz Pressable
import { View, Text, TextInput, ScrollView, Platform, Pressable } from 'react-native';
import { useCompetitionStore } from '../../store/useCompetitionStore';
import { colors, font, spacing, borderRadius, componentStyles } from '../../theme/theme';
import { saveAppData } from '../../utils/api';
import styles from '../../styles/RegistrationStyles/AthleteRegistrationForm.styles'; // Importuj dedykowane style
import { AntDesign } from '@expo/vector-icons'; // Importuj ikony

export default function AthleteRegistrationForm() {
  const kategorie = useCompetitionStore(state => state.kategorie);
  const addZawodnik = useCompetitionStore(state => state.addZawodnik);
  // Pobierz cały stan zawodów, aby przekazać go do syncData
  const zawody = useCompetitionStore(state => state.zawody);
  const zawodnicy = useCompetitionStore(state => state.zawodnicy);


  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [klub, setKlub] = useState('');
  const [plec, setPlec] = useState(''); // 'K' lub 'M'
  const [kategoria, setKategoria] = useState(''); // Nazwa wybranej kategorii
  const [waga, setWaga] = useState(''); // Wybrana waga
  const [wiek, setWiek] = useState('');
  const [podejscie1, setPodejscie1] = useState(''); // <-- DODAJ TEN STAN
  const [hoverSelectItem, setHoverSelectItem] = useState(null); // Stan dla hover na elementach wyboru
  const [isAddHovered, setIsAddHovered] = useState(false); // Stan dla hover Dodaj
  const [isClearHovered, setIsClearHovered] = useState(false); // Stan dla hover Wyczyść

  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);

  // Reset formularza
  const resetForm = () => {
    setImie('');
    setNazwisko('');
    setKlub('');
    setPlec('');
    setKategoria(''); // Resetuj kategorię
    setWaga('');     // Resetuj wagę
    setWiek('');
    setPodejscie1(''); // <-- DODAJ RESETOWANIE
  };

  // Powiadomienia
  function showNotif(msg, type) {
    setNotif({ msg, type });
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setNotif(null), 3000);
  }

  // Funkcja synchronizująca – wysyła cały stan do backendu
  const syncData = async () => {
    try {
      // Pobierz aktualny stan bezpośrednio przed zapisem
      const currentState = useCompetitionStore.getState();
      await saveAppData({
        zawody: currentState.zawody,
        kategorie: currentState.kategorie,
        zawodnicy: currentState.zawodnicy,
      });
      // Nie pokazuj notyfikacji o synchronizacji tutaj, tylko po udanym dodaniu
    } catch (error) {
      console.error('Błąd synchronizacji:', error);
      showNotif('Błąd synchronizacji danych!', 'error'); // Pokaż błąd synchronizacji
    }
  };

  // Dodawanie zawodnika
  const handleAdd = async () => {
    // Walidacja
    if (!imie.trim() || !nazwisko.trim() || !plec || !kategoria || !waga || !wiek.trim()) {
      showNotif('Uzupełnij wszystkie wymagane pola!', 'error');
      return;
    }
    // Sprawdzenie czy wiek jest liczbą
    if (isNaN(Number(wiek))) {
        showNotif('Wiek musi być liczbą!', 'error');
        return;
    }

    try {
        addZawodnik({
            imie: imie.trim(),
            nazwisko: nazwisko.trim(),
            klub: klub.trim(),
            plec,
            kategoria,
            waga,
            wiek: wiek.trim(),
            podejscie1: podejscie1.trim(), // <-- DODAJ PRZEKAZANIE WARTOŚCI
            // Domyślne puste podejścia dla 2 i 3 pozostają
            podejscie2: '',
            podejscie3: '',
        });
        await syncData(); // Synchronizuj po dodaniu zawodnika
        showNotif(`Dodano zawodnika: ${imie.trim()} ${nazwisko.trim()}!`, 'success');
        resetForm();
    } catch (error) {
        console.error("Błąd podczas dodawania zawodnika:", error);
        showNotif('Wystąpił błąd podczas dodawania zawodnika!', 'error');
    }
  };

  // Filtrowanie wag dla wybranej kategorii
  const wagiDlaKategorii = kategorie.find(k => k.nazwa === kategoria)?.wagi || [];

  // Resetowanie wagi przy zmianie kategorii
  const handleKategoriaChange = (nowaKategoria) => {
    setKategoria(nowaKategoria);
    setWaga(''); // Resetuj wagę, gdy kategoria się zmienia
  };

  return (
    <View>
      {/* Pola Imię, Nazwisko, Klub, Wiek */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Imię</Text>
        <TextInput
          style={styles.input}
          placeholder="Podaj imię zawodnika"
          value={imie}
          onChangeText={setImie}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nazwisko</Text>
        <TextInput
          style={styles.input}
          placeholder="Podaj nazwisko zawodnika"
          value={nazwisko}
          onChangeText={setNazwisko}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Klub</Text>
        <TextInput
          style={styles.input}
          placeholder="Podaj nazwę klubu (opcjonalnie)"
          value={klub}
          onChangeText={setKlub}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Wiek</Text>
        <TextInput
          style={styles.input}
          placeholder="Podaj wiek zawodnika"
          value={wiek}
          onChangeText={setWiek}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* --- POCZĄTEK ZMIANY --- */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Podejście I</Text>
        <TextInput
          style={styles.input}
          placeholder="Zdeklaruj podejście I (kg)"
          value={podejscie1}
          onChangeText={setPodejscie1}
          keyboardType="numeric" // Ustawiamy klawiaturę numeryczną
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      {/* --- KONIEC ZMIANY --- */}

      {/* Wybór Płci */}
      <View style={styles.radioRow}>
        <Text style={styles.label}>Płeć</Text>
        <View style={styles.radioContainer}>
          <Pressable
            style={[styles.radioBtn, plec === 'K' && styles.radioBtnActive]}
            onPress={() => setPlec('K')}
          >
            <Text style={[styles.radioText, plec === 'K' && styles.radioTextActive]}>Kobieta</Text>
          </Pressable>
          <Pressable
            style={[styles.radioBtn, plec === 'M' && styles.radioBtnActive]}
            onPress={() => setPlec('M')}
          >
            <Text style={[styles.radioText, plec === 'M' && styles.radioTextActive]}>Mężczyzna</Text>
          </Pressable>
        </View>
      </View>

      {/* Wybór Kategorii */}
      <View style={styles.selectBox}>
        <Text style={styles.selectLabel}>Kategoria</Text>
        {kategorie.length === 0 ? (
          <Text style={styles.selectEmpty}>Najpierw dodaj kategorie w panelu powyżej.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectScroll}>
            <View style={styles.selectList}>
              {kategorie.map(k => (
                <Pressable
                  key={k.nazwa}
                  style={[
                    styles.selectItem,
                    kategoria === k.nazwa && styles.selectItemActive,
                    // Styl hover dla web
                    Platform.OS === 'web' && hoverSelectItem === `kat-${k.nazwa}` && styles.selectItemHover
                  ]}
                  onPress={() => handleKategoriaChange(k.nazwa)}
                  // Obsługa hover dla web
                  {...(Platform.OS === 'web' && {
                    onMouseEnter: () => setHoverSelectItem(`kat-${k.nazwa}`),
                    onMouseLeave: () => setHoverSelectItem(null)
                  })}
                >
                  <Text style={[
                    styles.selectItemText,
                    kategoria === k.nazwa && styles.selectItemTextActive,
                    hoverSelectItem === k.nazwa && { textDecorationLine: 'underline' } // Przykład zmiany stylu na hover
                  ]}>
                    {k.nazwa}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Wybór Wagi (dynamiczny) */}
      <View style={styles.selectBox}>
        <Text style={styles.selectLabel}>Waga</Text>
        {!kategoria ? (
          <Text style={styles.selectEmpty}>Najpierw wybierz kategorię.</Text>
        ) : wagiDlaKategorii.length === 0 ? (
          <Text style={styles.selectEmpty}>Brak zdefiniowanych wag dla tej kategorii.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectScroll}>
            <View style={styles.selectList}>
              {wagiDlaKategorii.map(w => (
                <Pressable
                  key={w}
                  style={[
                    styles.selectItem,
                    waga === w && styles.selectItemActive,
                    // Styl hover dla web
                    Platform.OS === 'web' && hoverSelectItem === `waga-${w}` && styles.selectItemHover
                  ]}
                  onPress={() => setWaga(w)}
                  // Obsługa hover dla web
                  {...(Platform.OS === 'web' && {
                    onMouseEnter: () => setHoverSelectItem(`waga-${w}`),
                    onMouseLeave: () => setHoverSelectItem(null)
                  })}
                >
                  <Text style={[
                    styles.selectItemText,
                    waga === w && styles.selectItemTextActive
                  ]}>
                    {w}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Przyciski Akcji */}
      <View style={styles.btnRow}>
         <Pressable // Użyj Pressable
            style={({ pressed }) => [
                styles.btnClear,
                // Aplikuj styl hover tylko na web i gdy nie jest wciśnięty
                Platform.OS === 'web' && isClearHovered && !pressed && styles.btnClearHover,
                pressed && styles.btnClearPressed // Styl dla wciśnięcia (może być inny niż hover)
            ]}
            onPress={resetForm}
            onHoverIn={() => setIsClearHovered(true)} // Ustawia stan hover na true
            onHoverOut={() => setIsClearHovered(false)} // Ustawia stan hover na false
          >
            <AntDesign name="closecircleo" size={16} color={colors.textSecondary} style={styles.btnIcon} />
            <Text style={styles.btnClearText}>Wyczyść</Text>
          </Pressable>
         <Pressable // Użyj Pressable
            style={({ pressed }) => [
                styles.btnAdd,
                // Aplikuj styl hover tylko na web i gdy nie jest wciśnięty
                Platform.OS === 'web' && isAddHovered && !pressed && styles.btnAddHover,
                pressed && styles.btnAddPressed // Styl dla wciśnięcia (może być inny niż hover)
            ]}
            onPress={handleAdd}
            onHoverIn={() => setIsAddHovered(true)} // Ustawia stan hover na true
            onHoverOut={() => setIsAddHovered(false)} // Ustawia stan hover na false
          >
            <AntDesign name="pluscircleo" size={16} color={colors.textLight} style={styles.btnIcon} />
            <Text style={styles.btnText}>Dodaj zawodnika</Text>
          </Pressable>
      </View>

      {/* Powiadomienie */}
      {notif && (
        <View style={[
            styles.notification,
            notif.type === 'success' ? styles.notificationSuccess : styles.notificationError
        ]}>
          <AntDesign
            name={notif.type === 'success' ? "checkcircleo" : "exclamationcircleo"}
            size={18}
            color={notif.type === 'success' ? colors.success : colors.error}
            style={styles.notifIcon} // Dodaj styl dla ikony powiadomienia
          />
          <Text style={styles.notificationText}>{notif.msg}</Text>
        </View>
      )}
    </View>
  );
}