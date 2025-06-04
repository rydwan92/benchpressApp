import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Platform, Pressable } from 'react-native';
import  useCompetitionStore  from '../../store/useCompetitionStore';
import { colors, font, spacing, borderRadius, componentStyles } from '../../theme/theme';
import { saveAppData } from '../../utils/api';
import styles from '../../styles/RegistrationStyles/AthleteRegistrationForm.styles';
import { AntDesign } from '@expo/vector-icons';

export default function AthleteRegistrationForm() {
  const kategorie = useCompetitionStore(state => state.kategorie);
  const addZawodnik = useCompetitionStore(state => state.addZawodnik);
  // const zawody = useCompetitionStore(state => state.zawody); // Uncomment if used
  // const zawodnicy = useCompetitionStore(state => state.zawodnicy); // Uncomment if used

  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [klub, setKlub] = useState('');
  const [plec, setPlec] = useState(''); // 'K' lub 'M'
  const [kategoria, setKategoria] = useState(''); // Nazwa wybranej kategorii
  const [waga, setWaga] = useState(''); // Wybrana waga (kategorii wagowej)
  const [wiek, setWiek] = useState('');
  const [rocznik, setRocznik] = useState('');
  const [wagaCiala, setWagaCiala] = useState(''); // ADDED: Body Weight
  const [podejscie1, setPodejscie1] = useState('');
  const [podejscie2, setPodejscie2] = useState('');
  const [podejscie3, setPodejscie3] = useState('');
  const [hoverSelectItem, setHoverSelectItem] = useState(null);
  const [isAddHovered, setIsAddHovered] = useState(false);
  const [isClearHovered, setIsClearHovered] = useState(false);
  const [hoveredGender, setHoveredGender] = useState(null);

  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);

  // Validation states
  const [isImieValidState, setIsImieValidState] = useState(true);
  const [isNazwiskoValidState, setIsNazwiskoValidState] = useState(true);
  const [isKlubFilledState, setIsKlubFilledState] = useState(true); // Optional, so true by default
  const [isCurrentRocznikValidState, setIsCurrentRocznikValidState] = useState(true);
  const [isWiekValidAndFilledState, setIsWiekValidAndFilledState] = useState(true);
  const [isWagaCialaValidState, setIsWagaCialaValidState] = useState(true); // ADDED
  const [isPodejscie1ValidState, setIsPodejscie1ValidState] = useState(true);
  const [isPodejscie2ValidState, setIsPodejscie2ValidState] = useState(true);
  const [isPodejscie3ValidState, setIsPodejscie3ValidState] = useState(true);


  // Reset formularza
  const resetForm = () => {
    setImie('');
    setNazwisko('');
    setKlub('');
    setPlec('');
    setKategoria('');
    setWaga('');
    setWiek('');
    setRocznik('');
    setWagaCiala(''); // ADDED
    setPodejscie1('');
    setPodejscie2('');
    setPodejscie3('');
    // Reset validation states
    setIsImieValidState(true);
    setIsNazwiskoValidState(true);
    setIsKlubFilledState(true);
    setIsCurrentRocznikValidState(true);
    setIsWiekValidAndFilledState(true);
    setIsWagaCialaValidState(true);
    setIsPodejscie1ValidState(true);
    setIsPodejscie2ValidState(true);
    setIsPodejscie3ValidState(true);
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
      const currentState = useCompetitionStore.getState();
      const { socket, attemptResultForAnimation, ...dataToSend } = currentState;
      await saveAppData(dataToSend);
    } catch (error) {
      console.error('Błąd synchronizacji:', error);
      showNotif('Błąd synchronizacji danych!', 'error');
    }
  };

  const isRocznikValidFn = (val) => {
    const year = parseInt(val, 10);
    const currentYear = new Date().getFullYear();
    return val.trim().length === 4 && !isNaN(year) && year > 1900 && year <= currentYear;
  };

  const isWagaCialaValidFn = (val) => { // ADDED
    if (val.trim() === '') return true; // Optional for now
    const num = parseFloat(String(val).replace(',', '.'));
    return !isNaN(num) && num > 20 && num < 300;
  };

  const isValidNumericApproach = (val) => {
    if (val.trim() === '') return true;
    const num = parseFloat(val.replace(',', '.'));
    return !isNaN(num) && num >= 0;
  };

  // Update validation states on input change
  useEffect(() => { setIsImieValidState(imie.trim().length > 0); }, [imie]);
  useEffect(() => { setIsNazwiskoValidState(nazwisko.trim().length > 0); }, [nazwisko]);
  useEffect(() => { setIsKlubFilledState(klub.trim().length > 0); }, [klub]);
  useEffect(() => {
    const isValid = isRocznikValidFn(rocznik);
    setIsCurrentRocznikValidState(isValid);
    if (isValid) {
      const year = parseInt(rocznik, 10);
      const currentYear = new Date().getFullYear();
      const calculatedWiek = String(currentYear - year);
      setWiek(calculatedWiek);
      setIsWiekValidAndFilledState(calculatedWiek.trim().length > 0 && !isNaN(Number(calculatedWiek)));
    } else {
      setWiek('');
      setIsWiekValidAndFilledState(false);
    }
  }, [rocznik]);
  useEffect(() => { setIsWagaCialaValidState(isWagaCialaValidFn(wagaCiala)); }, [wagaCiala]); // ADDED
  useEffect(() => { setIsPodejscie1ValidState(isValidNumericApproach(podejscie1) && podejscie1.trim() !== ''); }, [podejscie1]);
  useEffect(() => { setIsPodejscie2ValidState(isValidNumericApproach(podejscie2)); }, [podejscie2]);
  useEffect(() => { setIsPodejscie3ValidState(isValidNumericApproach(podejscie3)); }, [podejscie3]);


  // Dodawanie zawodnika
  const handleAdd = async () => {
    const isImieCurrentlyValid = imie.trim().length > 0;
    const isNazwiskoCurrentlyValid = nazwisko.trim().length > 0;
    const isRocznikCurrentlyValid = isRocznikValidFn(rocznik);
    const isWiekCurrentlyValid = isRocznikCurrentlyValid && wiek.trim().length > 0 && !isNaN(Number(wiek));
    const isWagaCialaCurrentlyValid = isWagaCialaValidFn(wagaCiala);
    const isP1CurrentlyValid = isValidNumericApproach(podejscie1) && podejscie1.trim() !== '';
    const isP2CurrentlyValid = isValidNumericApproach(podejscie2);
    const isP3CurrentlyValid = isValidNumericApproach(podejscie3);

    // Update states to show errors if any
    setIsImieValidState(isImieCurrentlyValid);
    setIsNazwiskoValidState(isNazwiskoCurrentlyValid);
    setIsCurrentRocznikValidState(isRocznikCurrentlyValid);
    setIsWiekValidAndFilledState(isWiekCurrentlyValid);
    setIsWagaCialaValidState(isWagaCialaCurrentlyValid);
    setIsPodejscie1ValidState(isP1CurrentlyValid);
    setIsPodejscie2ValidState(isP2CurrentlyValid);
    setIsPodejscie3ValidState(isP3CurrentlyValid);


    if (!isImieCurrentlyValid || !isNazwiskoCurrentlyValid || !plec || !kategoria || !waga || !isWiekCurrentlyValid || !isWagaCialaCurrentlyValid) {
      showNotif('Uzupełnij wszystkie wymagane pola poprawnie!', 'error');
      return;
    }
    if (podejscie1.trim() && !isP1CurrentlyValid) {
        showNotif('Podejście I jest niepoprawne!', 'error');
        return;
    }
    if (podejscie2.trim() && !isP2CurrentlyValid) {
        showNotif('Podejście II jest niepoprawne!', 'error');
        return;
    }
    if (podejscie3.trim() && !isP3CurrentlyValid) {
        showNotif('Podejście III jest niepoprawne!', 'error');
        return;
    }

    try {
        addZawodnik({
            imie: imie.trim(),
            nazwisko: nazwisko.trim(),
            klub: klub.trim(),
            plec,
            kategoria,
            waga, // This is weight category
            wiek: wiek.trim(),
            rocznik: rocznik.trim(),
            wagaCiala: wagaCiala.trim().replace(',', '.'), // Pass body weight
            podejscie1: podejscie1.trim().replace(',', '.'),
            podejscie2: podejscie2.trim().replace(',', '.'),
            podejscie3: podejscie3.trim().replace(',', '.'),
        });
        await syncData();
        showNotif(`Dodano zawodnika: ${imie.trim()} ${nazwisko.trim()}!`, 'success');
        resetForm();
    } catch (error) {
        console.error("Błąd podczas dodawania zawodnika:", error);
        showNotif('Wystąpił błąd podczas dodawania zawodnika!', 'error');
    }
  };

  const wagiDlaKategorii = kategorie.find(k => k.nazwa === kategoria)?.wagi || [];

  const handleKategoriaChange = (nowaKategoria) => {
    setKategoria(nowaKategoria);
    setWaga(''); // Reset wagi przy zmianie kategorii
  };

  return (
    <View style={styles.cardWrapper}>
      <Text style={styles.formTitle}>REJESTRUJ ZAWODNIKA</Text>
      {/* Imię */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Imię</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isImieValidState && imie.trim() !== '' && styles.inputValid, !isImieValidState && styles.inputInvalid]}
            placeholder="Podaj imię"
            value={imie}
            onChangeText={setImie}
            placeholderTextColor={colors.textSecondary}
          />
          {isImieValidState && imie.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>

      {/* Nazwisko */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nazwisko</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isNazwiskoValidState && nazwisko.trim() !== '' && styles.inputValid, !isNazwiskoValidState && styles.inputInvalid]}
            placeholder="Podaj nazwisko"
            value={nazwisko}
            onChangeText={setNazwisko}
            placeholderTextColor={colors.textSecondary}
          />
          {isNazwiskoValidState && nazwisko.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>

      {/* Klub */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Klub</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isKlubFilledState && klub.trim() !== '' && styles.inputValid]}
            placeholder="Nazwa klubu (opcjonalnie)"
            value={klub}
            onChangeText={setKlub}
            placeholderTextColor={colors.textSecondary}
          />
          {isKlubFilledState && klub.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>
      
      {/* Rocznik */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Rocznik</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isCurrentRocznikValidState && rocznik.trim() !== '' && styles.inputValid, !isCurrentRocznikValidState && rocznik.trim() !== '' && styles.inputInvalid]}
            placeholder="RRRR"
            value={rocznik}
            onChangeText={setRocznik}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor={colors.textSecondary}
          />
          {isCurrentRocznikValidState && rocznik.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>

      {/* Wiek (obliczany) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Wiek</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.inputDisabled, isWiekValidAndFilledState && styles.inputValid]}
            placeholder="Obliczony automatycznie"
            value={wiek}
            editable={false}
            placeholderTextColor={colors.textSecondary}
          />
          {isWiekValidAndFilledState && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>

      {/* Waga Ciała */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Waga Ciała (kg)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isWagaCialaValidState && wagaCiala.trim() !== '' && styles.inputValid, !isWagaCialaValidState && wagaCiala.trim() !== '' && styles.inputInvalid]}
            placeholder="np. 73.5 (rzeczywista)"
            value={wagaCiala}
            onChangeText={setWagaCiala}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
          {isWagaCialaValidState && wagaCiala.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>

      {/* Wybór Płci */}
      <View style={styles.radioRow}>
        <Text style={styles.label}>Płeć</Text>
        <View style={styles.radioContainer}>
          {['K', 'M'].map(gender => (
            <Pressable
              key={gender}
              style={[
                styles.radioBtn,
                plec === gender && styles.radioBtnActive,
                Platform.OS === 'web' && hoveredGender === gender && styles.radioBtnHover,
              ]}
              onPress={() => setPlec(gender)}
              {...(Platform.OS === 'web' && {
                onHoverIn: () => setHoveredGender(gender),
                onHoverOut: () => setHoveredGender(null),
              })}
            >
              <Text style={[
                styles.radioText,
                (plec === gender || (Platform.OS === 'web' && hoveredGender === gender)) && styles.radioTextActive,
              ]}>{gender === 'K' ? 'Kobieta' : 'Mężczyzna'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Wybór Kategorii */}
      <View style={styles.selectBox}>
        <Text style={styles.selectLabel}>Kategoria Wiekowa</Text>
        {kategorie.length === 0 ? (
          <Text style={styles.selectEmpty}>Najpierw dodaj kategorie.</Text>
        ) : (
          <ScrollView showsHorizontalScrollIndicator={false} style={styles.selectScroll}>
            <View style={styles.selectList}>
              {kategorie.map(k => (
                <Pressable
                  key={k.nazwa}
                  style={[
                    styles.selectItem,
                    kategoria === k.nazwa && styles.selectItemActive,
                    Platform.OS === 'web' && hoverSelectItem === `kat-${k.nazwa}` && styles.selectItemHover,
                  ]}
                  onPress={() => handleKategoriaChange(k.nazwa)}
                  {...(Platform.OS === 'web' && {
                    onMouseEnter: () => setHoverSelectItem(`kat-${k.nazwa}`),
                    onMouseLeave: () => setHoverSelectItem(null)
                  })}
                >
                  <Text style={[
                    styles.selectItemText,
                    (kategoria === k.nazwa || (Platform.OS === 'web' && hoverSelectItem === `kat-${k.nazwa}`)) && styles.selectItemTextActive,
                  ]}>
                    {k.nazwa}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Wybór Wagi (kategorii wagowej) */}
      <View style={styles.selectBox}>
        <Text style={styles.selectLabel}>Kategoria Wagowa</Text>
        {!kategoria ? (
          <Text style={styles.selectEmpty}>Najpierw wybierz kategorię wiekową.</Text>
        ) : wagiDlaKategorii.length === 0 ? (
          <Text style={styles.selectEmpty}>Brak wag dla tej kategorii.</Text>
        ) : (
          <ScrollView showsHorizontalScrollIndicator={false} style={styles.selectScroll}>
            <View style={styles.selectList}>
              {wagiDlaKategorii.map(w => (
                <Pressable
                  key={w}
                  style={[
                    styles.selectItem,
                    waga === w && styles.selectItemActive,
                    Platform.OS === 'web' && hoverSelectItem === `waga-${w}` && styles.selectItemHover,
                  ]}
                  onPress={() => setWaga(w)}
                  {...(Platform.OS === 'web' && {
                    onMouseEnter: () => setHoverSelectItem(`waga-${w}`),
                    onMouseLeave: () => setHoverSelectItem(null)
                  })}
                >
                  <Text style={[
                    styles.selectItemText,
                    (waga === w || (Platform.OS === 'web' && hoverSelectItem === `waga-${w}`)) && styles.selectItemTextActive,
                  ]}>
                    {w} kg
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Podejście I */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Podejście I (kg)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isPodejscie1ValidState && podejscie1.trim() !== '' && styles.inputValid, !isPodejscie1ValidState && podejscie1.trim() !== '' && styles.inputInvalid]}
            placeholder="Deklaracja I"
            value={podejscie1}
            onChangeText={setPodejscie1}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
          {isPodejscie1ValidState && podejscie1.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>
      
      {/* Podejście II */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Podejście II (kg)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isPodejscie2ValidState && podejscie2.trim() !== '' && styles.inputValid, !isPodejscie2ValidState && podejscie2.trim() !== '' && styles.inputInvalid]}
            placeholder="Deklaracja II (opcjonalnie)"
            value={podejscie2}
            onChangeText={setPodejscie2}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
          {isPodejscie2ValidState && podejscie2.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>

      {/* Podejście III */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Podejście III (kg)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, isPodejscie3ValidState && podejscie3.trim() !== '' && styles.inputValid, !isPodejscie3ValidState && podejscie3.trim() !== '' && styles.inputInvalid]}
            placeholder="Deklaracja III (opcjonalnie)"
            value={podejscie3}
            onChangeText={setPodejscie3}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
          {isPodejscie3ValidState && podejscie3.trim() !== '' && <AntDesign name="checkcircle" size={20} color={colors.success} style={styles.validIcon} />}
        </View>
      </View>

      {/* Przyciski Akcji */}
      <View style={styles.btnRow}>
         <Pressable
            style={({ pressed }) => [
                styles.btnClear,
                Platform.OS === 'web' && isClearHovered && !pressed && styles.btnClearHover,
                pressed && styles.btnClearPressed
            ]}
            onPress={resetForm}
            onHoverIn={() => setIsClearHovered(true)}
            onHoverOut={() => setIsClearHovered(false)}
          >
            <AntDesign name="closecircleo" size={16} color={colors.textSecondary} style={styles.btnIcon} />
            <Text style={styles.btnClearText}>Wyczyść</Text>
          </Pressable>
         <Pressable
            style={({ pressed }) => [
                styles.btnAdd,
                Platform.OS === 'web' && isAddHovered && !pressed && styles.btnAddHover,
                pressed && styles.btnAddPressed
            ]}
            onPress={handleAdd}
            onHoverIn={() => setIsAddHovered(true)}
            onHoverOut={() => setIsAddHovered(false)}
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
            style={styles.notifIcon}
          />
          <Text style={styles.notificationText}>{notif.msg}</Text>
        </View>
      )}
    </View>
  );
}