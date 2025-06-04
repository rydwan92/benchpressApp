import React, { useState, useRef, useEffect } from 'react';
import {
  View, TextInput, Button, Text, TouchableOpacity, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import useCompetitionStore  from '../../store/useCompetitionStore';
import { colors } from '../../theme/theme';
import styles from '../../styles/RegistrationStyles/CompetitionInfoForm.styles';
import { saveAppData } from '../../utils/api';

export default function CompetitionInfoForm({ onSaveSuccess }) {
  const zawody = useCompetitionStore(state => state.zawody);
  // --- POCZĄTEK ZMIANY: Pobierz cały stan, nie tylko settery ---
  // const setZawody = useCompetitionStore(state => state.setZawody); // Już niepotrzebne bezpośrednio w handleSave
  // const setSedzia = useCompetitionStore(state => state.setSedzia); // Już niepotrzebne bezpośrednio w handleSave
  // const setKlubAvatar = useCompetitionStore(state => state.setKlubAvatar); // Już niepotrzebne bezpośrednio w handleSave
  // --- KONIEC ZMIANY ---

  const [nazwa, setNazwa] = useState(zawody.nazwa || 'Benchpress Cup 2025');
  const [miejsce, setMiejsce] = useState(zawody.miejsce || '');
  const [data, setData] = useState(zawody.data || new Date().toISOString().slice(0, 10));
  const [sedzia, setSedziaLocal] = useState({
    imie: zawody.sedzia?.imie || '',
    nazwisko: zawody.sedzia?.nazwisko || '',
    avatar: zawody.sedzia?.avatar || null,
  });
  const [klubAvatar, setKlubAvatarLocal] = useState(zawody.klubAvatar || null);
  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);

  const handlePickAvatar = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      const base64 = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : null;
      if (type === 'klub') {
        setKlubAvatarLocal(base64);
      } else {
        setSedziaLocal(s => ({ ...s, avatar: base64 }));
      }
    }
  };

  const showNotif = (msg, type) => {
    setNotif({ msg, type });
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setNotif(null), 3000);
  };

  const handleSave = async () => {
    if (!nazwa.trim() || !miejsce.trim() || !sedzia.imie.trim() || !sedzia.nazwisko.trim()) {
      showNotif('Uzupełnij dane!', 'error');
      return;
    }

    // --- POCZĄTEK ZMIANY: Pobierz aktualny stan i przygotuj kompletne dane ---
    // Zamiast używać setterów, pobierz cały aktualny stan store'u
    const currentState = useCompetitionStore.getState();

    // Stwórz obiekt zawodów z danych formularza
    const updatedZawody = {
        nazwa: nazwa.trim(),
        miejsce: miejsce.trim(),
        data: data, // Zakładamy, że data jest poprawna
        klubAvatar: klubAvatar, // Użyj stanu lokalnego avatara klubu
        sedzia: {
            imie: sedzia.imie.trim(),
            nazwisko: sedzia.nazwisko.trim(),
            avatar: sedzia.avatar // Użyj stanu lokalnego avatara sędziego
        }
    };

    // Przygotuj kompletny obiekt danych do wysłania
    const dataToSend = {
        zawody: updatedZawody,
        kategorie: currentState.kategorie, // Dołącz aktualne kategorie ze store'u
        zawodnicy: currentState.zawodnicy  // Dołącz aktualnych zawodników ze store'u
    };
    // --- KONIEC ZMIANY ---

    try {
      // --- POCZĄTEK ZMIANY: Wyślij kompletne dane ---
      console.log('--- Sending data from CompetitionInfoForm ---');
      console.log(JSON.stringify(dataToSend, null, 2));
      console.log('--- End of sending data ---');
      await saveAppData(dataToSend); // Wyślij dataToSend zamiast tylko części stanu
      // --- KONIEC ZMIANY ---

      // --- POCZĄTEK ZMIANY: Zaktualizuj stan store'u po udanym zapisie ---
      // Możemy teraz zaktualizować tylko część 'zawody' w store,
      // ponieważ kategorie i zawodnicy już tam są.
      // Użyj akcji setZawody, jeśli ją masz, lub set bezpośrednio.
      useCompetitionStore.setState({ zawody: updatedZawody });
      // --- KONIEC ZMIANY ---

      showNotif('Zapisano!', 'success');
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Błąd zapisu danych:', error);
      showNotif('Błąd zapisu danych!', 'error');
    }
  };

  return (
    <View style={styles.infoCard}>
      <View style={styles.infoRow}>
        <View style={styles.infoColLeft}>
          <TouchableOpacity style={styles.clubAvatarBox} onPress={() => handlePickAvatar('klub')}>
            {klubAvatar ? (
              <Image source={{ uri: klubAvatar }} style={styles.clubAvatarImg} />
            ) : (
              <Text style={styles.avatarPlaceholder}>Klub</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.spacer} />
        <View style={styles.infoColRight}>
          <TouchableOpacity style={styles.judgeAvatarBox} onPress={() => handlePickAvatar('sedzia')}>
            {sedzia.avatar ? (
              <Image source={{ uri: sedzia.avatar }} style={styles.judgeAvatarImg} />
            ) : (
              <Text style={styles.avatarPlaceholder}>Sędzia</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoColLeft}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Miejscowość</Text>
            <TextInput
              style={styles.input}
              placeholder="Podaj miejscowość"
              value={miejsce}
              onChangeText={setMiejsce}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Podaj datę"
              value={data}
              onChangeText={setData}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        <View style={styles.spacer} />
        <View style={styles.infoColRight}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Imię sędziego</Text>
            <TextInput
              style={styles.input}
              placeholder="Podaj imię sędziego"
              value={sedzia.imie}
              onChangeText={v => setSedziaLocal(s => ({ ...s, imie: v }))}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nazwisko sędziego</Text>
            <TextInput
              style={styles.input}
              placeholder="Podaj nazwisko sędziego"
              value={sedzia.nazwisko}
              onChangeText={v => setSedziaLocal(s => ({ ...s, nazwisko: v }))}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nazwa zawodów</Text>
        <TextInput
          style={styles.fullInput}
          placeholder="Podaj nazwę zawodów"
          value={nazwa}
          onChangeText={setNazwa}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.btnAdd} onPress={handleSave}>
          <Feather name="save" size={18} color={colors.textLight} style={styles.btnIcon} />
          <Text style={styles.btnText}>Zapisz</Text>
        </TouchableOpacity>
      </View>
      {notif && (
        <View style={[styles.notif, notif.type === 'success' ? styles.notifSuccess : styles.notifError]}>
          <Text style={styles.notifText}>{notif.msg}</Text>
        </View>
      )}
    </View>
  );
}