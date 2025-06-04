import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated, Platform, TextInput, TouchableWithoutFeedback } from 'react-native';
// Corrected/verified imports for theme and commonStyles
import { colors, font, spacing, borderRadius, shadows, componentStyles } from '../../theme/theme';
import { commonStyles } from '../../theme/common'; // Path should be correct
import  useCompetitionStore  from '../../store/useCompetitionStore';
import { AntDesign } from '@expo/vector-icons';
import { saveAppData } from '../../utils/api';
import styles from '../../styles/RegistrationStyles/CategoryBrowser.styles'; // Import local styles

export default function CategoryBrowser() {
  const kategorie = useCompetitionStore(state => state.kategorie);
  const zawodnicy = useCompetitionStore(state => state.zawodnicy);
  const removeZawodnik = useCompetitionStore(state => state.removeZawodnik);
  const updateZawodnik = useCompetitionStore(state => state.updateZawodnik);
  const zawody = useCompetitionStore(state => state.zawody); // Potrzebne do syncData

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [toDeleteIdx, setToDeleteIdx] = useState(null);
  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);
  const [editModal, setEditModal] = useState({ open: false, idx: null, data: {} });
  const [fadeAnims, setFadeAnims] = useState([]);
  const [hoverCardBtn, setHoverCardBtn] = useState(null);
  const [hoverSelectItem, setHoverSelectItem] = useState(null); // Stan dla hover na elementach wyboru (pigułkach)

  // --- POCZĄTEK ZMIANY: Usuń ref ---
  // const pressInsideEditModalCard = useRef(false); // <-- USUŃ TĘ LINIĘ
  // --- KONIEC ZMIANY ---

  React.useEffect(() => {
    if (kategorie.length === 0) return; // brak kategorii, nie działaj
    if (!selectedCategory) {
      setSelectedCategory(kategorie[0].nazwa);
      setSelectedWeight(kategorie[0].wagi[0] || '');
    } else {
      // Jeśli wybrana kategoria nie istnieje już w liście, ustaw domyślnie pierwszy element
      const exists = kategorie.some(k => k.nazwa === selectedCategory);
      if (!exists) {
        setSelectedCategory(kategorie[0].nazwa);
        setSelectedWeight(kategorie[0].wagi[0] || '');
      }
    }
  }, [kategorie]);

  React.useEffect(() => {
    const cat = kategorie.find(k => k.nazwa === selectedCategory);
    if (cat && !cat.wagi.includes(selectedWeight)) {
      setSelectedWeight(cat.wagi[0] || '');
    }
  }, [selectedCategory, kategorie]);

  // Funkcja synchronizująca – wysyła cały stan do backendu
  const syncData = async () => {
    try {
      const currentState = useCompetitionStore.getState();
      // Usuń socket i attemptResultForAnimation przed wysłaniem, jeśli istnieją
      const { socket, attemptResultForAnimation, ...dataToSend } = currentState;
      await saveAppData(dataToSend);
      // Nie pokazuj notyfikacji o synchronizacji tutaj, tylko po udanej akcji
    } catch (error) {
      console.error('Błąd synchronizacji:', error);
      showNotif('Błąd synchronizacji danych!', 'error');
    }
  };

  function showNotif(msg, type) {
    setNotif({ msg, type });
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setNotif(null), 3000);
  }

  const handleDelete = (idx) => {
    setToDeleteIdx(idx);
    setModalVisible(true); // Otwórz modal potwierdzenia
  };

  const confirmDelete = async () => { // Dodaj async
    try {
      removeZawodnik(toDeleteIdx);
      await syncData(); // Synchronizuj po usunięciu
      setModalVisible(false);
      setToDeleteIdx(null);
      showNotif('Zawodnik usunięty!', 'success');
    } catch (error) {
      console.error("Błąd podczas usuwania zawodnika:", error);
      showNotif('Wystąpił błąd podczas usuwania!', 'error');
      setModalVisible(false); // Zamknij modal nawet przy błędzie
      setToDeleteIdx(null);
    }
  };

  const handleSaveEdit = async () => {
     try {
        // Walidacja podstawowych pól
        if (!editModal.data.imie?.trim() || !editModal.data.nazwisko?.trim() || !editModal.data.wiek?.trim() || !editModal.data.plec) {
            showNotif('Uzupełnij wymagane pola (Imię, Nazwisko, Wiek, Płeć)!', 'error');
            return;
        }
        // Walidacja pól numerycznych (wiek i podejścia)
        const fieldsToCheck = {
            Wiek: editModal.data.wiek,
            'Podejście I': editModal.data.podejscie1,
            'Podejście II': editModal.data.podejscie2,
            'Podejście III': editModal.data.podejscie3,
        };

        for (const [fieldName, value] of Object.entries(fieldsToCheck)) {
            if (value && value.trim() !== '' && isNaN(Number(value.trim().replace(',', '.')))) {
                showNotif(`${fieldName} musi być liczbą!`, 'error');
                return;
            }
        }
        const parseWeight = (val) => val?.trim().replace(',', '.') || '';

        const dataToUpdate = {
            imie: editModal.data.imie.trim(),
            nazwisko: editModal.data.nazwisko.trim(),
            klub: editModal.data.klub?.trim() || '',
            plec: editModal.data.plec, // Płeć z modala
            kategoria: editModal.data.kategoria, // Kategoria i waga są zachowywane, nie edytowane w tym modalu
            waga: editModal.data.waga,
            wiek: editModal.data.wiek.trim(), // Wiek z modala
            podejscie1: parseWeight(editModal.data.podejscie1),
            podejscie2: parseWeight(editModal.data.podejscie2),
            podejscie3: parseWeight(editModal.data.podejscie3),
        };

        updateZawodnik(editModal.idx, dataToUpdate);
        await syncData();
        setEditModal({ open: false, idx: null, data: {} });
        showNotif('Dane zawodnika zaktualizowane!', 'success');
     } catch (error) {
        console.error("Błąd podczas edycji zawodnika:", error);
        showNotif('Wystąpił błąd podczas edycji!', 'error');
     }
  };

  // --- POCZĄTEK ZMIANY: Przywróć prostą funkcję zamykania ---
  const closeEditModal = () => {
    setEditModal({ open: false, idx: null, data: {} });
    // pressInsideEditModalCard.current = false; // <-- USUŃ TĘ LINIĘ
  };
  // --- KONIEC ZMIANY ---

  const weights = kategorie.find(k => k.nazwa === selectedCategory)?.wagi || [];
  const filteredZawodnicy = zawodnicy
    .filter(z =>
      z.kategoria === selectedCategory && z.waga === selectedWeight
    );

  React.useEffect(() => {
    // Dodaj animację dla nowych zawodników
    setFadeAnims(filteredZawodnicy.map(() => new Animated.Value(0)));
    filteredZawodnicy.forEach((_, i) => {
      Animated.timing(
        fadeAnims[i] || new Animated.Value(0), // Fallback if fadeAnims[i] is undefined
        { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' } 
      ).start();
    });
    // eslint-disable-next-line
  }, [filteredZawodnicy.length]);

  // Logowanie przed renderowaniem listy
  if (filteredZawodnicy.length > 0) {
    console.log(
      `[CategoryBrowser] Rendering list for category: "${selectedCategory}", weight: "${selectedWeight}"`
    );
    console.log(
      '[CategoryBrowser] Filtered Zawodnicy Original Indexes:',
      filteredZawodnicy.map(z => ({ originalIndex: z.originalIndex, imie: z.imie, nazwisko: z.nazwisko }))
    );
    // Sprawdzenie duplikatów
    const originalIndexes = filteredZawodnicy.map(z => z.originalIndex);
    const uniqueOriginalIndexes = new Set(originalIndexes);
    if (originalIndexes.length !== uniqueOriginalIndexes.size) {
      console.warn('[CategoryBrowser] DUPLICATE originalIndex values found in filteredZawodnicy!');
      const counts = {};
      originalIndexes.forEach(index => { counts[index] = (counts[index] || 0) + 1; });
      const duplicates = Object.entries(counts).filter(([key, value]) => value > 1);
      console.warn('[CategoryBrowser] Duplicate details:', duplicates);
    }
  }


  return (
    <View style={styles.browserContainer}>
      <Text style={styles.browserTitle}>Przeglądaj i edytuj zawodników</Text>

      {/* Wiersz wyboru kategorii i wagi */}
      <View style={styles.selectionRow}>
        {/* Kolumna dla wyboru kategorii */}
        <View style={styles.selectionColumn}>
          <Text style={styles.selectionLabel}>Kategoria:</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setCategoryModalVisible(true)}>
            {/* Ikona, Tekst przycisku, Ikona strzałki */}
            <AntDesign name="appstore-o" size={16} color={colors.textLight} style={styles.selectIcon} />
            <Text style={styles.selectButtonText} numberOfLines={1}>
              {selectedCategory || 'Wybierz'}
            </Text>
            <AntDesign name="down" size={12} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Kolumna dla wyboru wagi */}
        <View style={styles.selectionColumn}>
          <Text style={styles.selectionLabel}>Waga:</Text>
          <TouchableOpacity
            style={[styles.selectButton, !selectedCategory && styles.selectButtonDisabled]}
            onPress={() => selectedCategory && setWeightModalVisible(true)}
            disabled={!selectedCategory}
          >
            {/* Ikona, Tekst przycisku, Ikona strzałki */}
            <AntDesign name="tago" size={16} color={selectedCategory ? colors.textLight : colors.textSecondary} style={styles.selectIcon} />
            <Text style={[styles.selectButtonText, !selectedCategory && styles.selectButtonTextDisabled]} numberOfLines={1}>
              {selectedWeight || 'Wybierz'}
            </Text>
            <AntDesign name="down" size={12} color={selectedCategory ? colors.textLight : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista zawodników */}
      <ScrollView style={styles.athleteListContainer}>
        {filteredZawodnicy.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AntDesign name="team" size={48} color={colors.border} /> {/* Większa, bardziej stonowana ikona */}
            <Text style={styles.emptyText}>Brak zawodników w tej kategorii i wadze.</Text>
            <Text style={styles.emptySubText}>Dodaj zawodników w formularzu rejestracyjnym.</Text>
          </View>
        ) : (
          filteredZawodnicy.map((z, i) => (
            // Używamy TouchableOpacity dla lepszego feedbacku na web/mobile
            <TouchableOpacity
              key={z.originalIndex}
              style={[
                styles.athleteListItem,
                Platform.OS === 'web' && hoverCardBtn === `item-${z.originalIndex}` && styles.athleteListItemHover // Styl hover dla całego wiersza
              ]}
              activeOpacity={0.9} // Lekki efekt przyciśnięcia
              // Opcjonalnie: onPress={() => /* Można otworzyć szczegóły zawodnika */}
              {...(Platform.OS === 'web' && {
                onMouseEnter: () => setHoverCardBtn(`item-${z.originalIndex}`),
                onMouseLeave: () => setHoverCardBtn(null)
              })}
            >
              {/* Lewa strona: Awatar, Imię, Nazwisko, Podejście I */}
              <View style={styles.athleteInfoContainer}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {z.imie?.[0]?.toUpperCase() || '?'}
                    {z.nazwisko?.[0]?.toUpperCase() || ''}
                  </Text>
                </View>
                <View style={styles.athleteTextDetails}>
                  <View style={styles.athleteNameRow}>
                    <Text style={styles.athleteName} numberOfLines={1}>
                      {z.imie} {z.nazwisko}
                    </Text>
                  </View>
                  {/* Nowy kontener z badge'ami podejść */}
                  <Text style={styles.athleteDetailText} numberOfLines={1}>
                    {z.klub ? `${z.klub} • ` : ''}Wiek: {z.wiek} • {z.plec === 'K' ? 'K' : 'M'}
                  </Text>
                </View>
              </View>

              {/* Prawa strona: Pozostałe podejścia i Akcje */}
              <View style={styles.athleteRightContainer}>
                {/* Nowy kontener dla dużych pigułek z podejściami */}
                <View style={styles.bigApproachContainer}>
                  <View style={styles.bigApproachBadge}>
                    <Text style={styles.bigApproachBadgeLabel}>I</Text>
                    <Text style={styles.bigApproachBadgeText}>
                      {z.podejscie1 ? `${z.podejscie1}kg` : '-'}
                    </Text>
                  </View>
                  <View style={styles.bigApproachBadge}>
                    <Text style={styles.bigApproachBadgeLabel}>II</Text>
                    <Text style={styles.bigApproachBadgeText}>
                      {z.podejscie2 ? `${z.podejscie2}kg` : '-'}
                    </Text>
                  </View>
                  <View style={styles.bigApproachBadge}>
                    <Text style={styles.bigApproachBadgeLabel}>III</Text>
                    <Text style={styles.bigApproachBadgeText}>
                      {z.podejscie3 ? `${z.podejscie3}kg` : '-'}
                    </Text>
                  </View>
                </View>

                {/* Przyciski akcji (edycja, usuwanie) – pozostają bez zmian */}
                <View style={styles.athleteActionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton, styles.editButton,
                      Platform.OS === 'web' && hoverCardBtn === `edit-${z.originalIndex}` && styles.actionButtonHover
                    ]}
                    onPress={() => setEditModal({ open: true, idx: z.originalIndex, data: { ...z } })}
                    activeOpacity={0.7}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: () => setHoverCardBtn(`edit-${z.originalIndex}`),
                      onMouseLeave: () => setHoverCardBtn(null)
                    })}
                  >
                    <AntDesign name="edit" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton, styles.deleteButton,
                      Platform.OS === 'web' && hoverCardBtn === `delete-${z.originalIndex}` && styles.actionButtonHover
                    ]}
                    onPress={() => handleDelete(z.originalIndex)}
                    activeOpacity={0.7}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: () => setHoverCardBtn(`delete-${z.originalIndex}`),
                      onMouseLeave: () => setHoverCardBtn(null)
                    })}
                  >
                    <AntDesign name="delete" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* --- Modale Wyboru - ZAKTUALIZOWANE (Styl listy jak w CWM) --- */}

      {/* Modal wyboru kategorii */}
      <Modal visible={categoryModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setCategoryModalVisible(false)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalIconHeader}>
              <AntDesign name="appstore-o" size={28} color={colors.accent} />
            </View>
            <Text style={styles.modalTitle}>Wybierz kategorię</Text>
            <Text style={styles.selectLabel}>Dostępne kategorie:</Text>
            {/* ZMIANA: Struktura listy na wzór CWM */}
            <ScrollView style={{ maxHeight: 150, width: '100%' }}>
              <View style={styles.selectItemsContainer}>
                {kategorie.map((cat, index) => (
                  <TouchableOpacity
                    key={cat.nazwa || `kat-${index}`} // Użyj kat.nazwa lub unikalnego ID, jeśli dostępne, fallback na index
                    style={[
                      styles.selectItem, // Używamy stylu pigułki
                      Platform.OS === 'web' && hoverSelectItem === `kat-${cat.nazwa}` && styles.selectItemHover,
                    ]}
                    activeOpacity={0.8} // Efekt wciśnięcia
                    onPress={() => {
                      setSelectedCategory(cat.nazwa);
                      setCategoryModalVisible(false);
                    }}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: () => setHoverSelectItem(`kat-${cat.nazwa}`),
                      onMouseLeave: () => setHoverSelectItem(null)
                    })}
                  >
                    <Text style={[
                      styles.selectItemText,
                      Platform.OS === 'web' && hoverSelectItem === `kat-${cat.nazwa}` && styles.selectItemTextActive
                    ]}>{cat.nazwa}</Text>
                  </TouchableOpacity>
                ))}
                {kategorie.length === 0 && (
                    // Użyjemy errorText dla spójności z CWM, jeśli lista jest pusta
                    <Text style={styles.errorText}>Brak zdefiniowanych kategorii.</Text>
                )}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal wyboru wagi */}
      <Modal visible={weightModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setWeightModalVisible(false)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalIconHeader}>
              <AntDesign name="tago" size={28} color={colors.accent} />
            </View>
            <Text style={styles.modalTitle}>Wybierz wagę</Text>
            <Text style={styles.selectLabel}>Dostępne wagi dla "{selectedCategory}":</Text>
            {/* ZMIANA: Struktura listy na wzór CWM */}
            <ScrollView style={{ maxHeight: 150, width: '100%' }}>
              <View style={styles.selectItemsContainer}>
                {weights.map((w, wagaIndex) => (
                  <TouchableOpacity
                    key={`${selectedCategory}-waga-${wagaIndex}`} // Zbuduj bardziej unikalny klucz
                    style={[
                      styles.selectItem, // Używamy stylu pigułki
                      Platform.OS === 'web' && hoverSelectItem === `waga-${w}` && styles.selectItemHover,
                    ]}
                    activeOpacity={0.8} // Efekt wciśnięcia
                    onPress={() => {
                      setSelectedWeight(w);
                      setWeightModalVisible(false);
                    }}
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: () => setHoverSelectItem(`waga-${w}`),
                      onMouseLeave: () => setHoverSelectItem(null)
                    })}
                  >
                    <Text style={[
                      styles.selectItemText,
                      Platform.OS === 'web' && hoverSelectItem === `waga-${w}` && styles.selectItemTextActive
                    ]}>{w}</Text>
                  </TouchableOpacity>
                ))}
                {weights.length === 0 && (
                    // Użyjemy errorText dla spójności z CWM, jeśli lista jest pusta
                    <Text style={styles.errorText}>Brak zdefiniowanych wag dla tej kategorii.</Text>
                )}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- Pozostałe Modale (Potwierdzenia, Edycji) - bez zmian --- */}
      {/* Modal potwierdzenia usunięcia */}
      <Modal visible={modalVisible} transparent animationType="fade">
        {/* --- POCZĄTEK ZMIANY: Tło modala zamykające --- */}
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setModalVisible(false)}>
          {/* --- KONIEC ZMIANY --- */}
          {/* Karta modala */}
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
             <View style={styles.modalIconHeader}>
               <AntDesign name="warning" size={32} color={colors.warning} />
             </View>
            <Text style={styles.modalTitle}>Czy na pewno usunąć?</Text>
            {toDeleteIdx !== null && zawodnicy[toDeleteIdx] && (
                <Text style={styles.modalSubtitle}> {/* Dodano styl dla podtytułu */}
                    {zawodnicy[toDeleteIdx].imie} {zawodnicy[toDeleteIdx].nazwisko}
                </Text>
            )}
            <View style={styles.modalBtns}>
              {/* --- POCZĄTEK ZMIANY: Przycisk Anuluj --- */}
              <TouchableOpacity
                style={[styles.modalBtnBase, styles.modalCancelBtn]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7} // Dodano activeOpacity
              >
                <AntDesign name="close" size={16} color={colors.textSecondary} style={styles.modalBtnIcon} />
                <Text style={styles.modalCancelBtnText}>Anuluj</Text> {/* Zmieniono tekst i styl */}
              </TouchableOpacity>
              {/* --- KONIEC ZMIANY --- */}
              <TouchableOpacity style={[styles.modalBtnBase, styles.modalDeleteBtn]} onPress={confirmDelete}>
                 <AntDesign name="delete" size={16} color={colors.textLight} style={styles.modalBtnIcon} />
                <Text style={styles.modalBtnText}>Tak, usuń</Text>
              </TouchableOpacity>
            </View>
          </View>
        {/* --- POCZĄTEK ZMIANY: Zamknięcie TouchableOpacity tła --- */}
        </TouchableOpacity>
        {/* --- KONIEC ZMIANY --- */}
      </Modal>

      {/* --- POCZĄTEK ZMIANY: Modal Edycji z zatrzymaniem propagacji na karcie --- */}
      <Modal visible={editModal.open} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={closeEditModal}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.modalIconHeader}>
                <AntDesign name="edit" size={28} color={colors.accent} />
              </View>
              <Text style={styles.modalTitle}>Edytuj Zawodnika</Text>
              <ScrollView style={{ width: '100%', maxHeight: Platform.OS === 'web' ? '70vh' : 500 }} contentContainerStyle={{paddingBottom: 20}}>
                <Text style={styles.modalLabel}>Imię</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Podaj imię"
                  value={editModal.data.imie || ''}
                  onChangeText={val => setEditModal(m => ({ ...m, data: { ...m.data, imie: val } }))}
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.modalLabel}>Nazwisko</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Podaj nazwisko"
                  value={editModal.data.nazwisko || ''}
                  onChangeText={val => setEditModal(m => ({ ...m, data: { ...m.data, nazwisko: val } }))}
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.modalLabel}>Klub</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Podaj klub (opcjonalnie)"
                  value={editModal.data.klub || ''}
                  onChangeText={val => setEditModal(m => ({ ...m, data: { ...m.data, klub: val } }))}
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.modalLabel}>Wiek</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Podaj wiek"
                  value={editModal.data.wiek || ''}
                  onChangeText={val => setEditModal(m => ({ ...m, data: { ...m.data, wiek: val } }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.modalLabel}>Płeć</Text>
                <View style={styles.modalRadioContainer}>
                  <TouchableOpacity
                    style={[styles.modalRadioBtn, editModal.data.plec === 'K' && styles.modalRadioBtnActive]}
                    onPress={() => setEditModal(m => ({ ...m, data: { ...m.data, plec: 'K' } }))}
                  >
                    <Text style={[styles.modalRadioText, editModal.data.plec === 'K' && styles.modalRadioTextActive]}>Kobieta</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalRadioBtn, editModal.data.plec === 'M' && styles.modalRadioBtnActive]}
                    onPress={() => setEditModal(m => ({ ...m, data: { ...m.data, plec: 'M' } }))}
                  >
                    <Text style={[styles.modalRadioText, editModal.data.plec === 'M' && styles.modalRadioTextActive]}>Mężczyzna</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalLabel}>Podejście I (kg)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Wprowadź wagę (opcjonalnie)"
                  value={editModal.data.podejscie1 || ''}
                  onChangeText={val => setEditModal(m => ({ ...m, data: { ...m.data, podejscie1: val } }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.modalLabel}>Podejście II (kg)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Wprowadź wagę (opcjonalnie)"
                  value={editModal.data.podejscie2 || ''}
                  onChangeText={val => setEditModal(m => ({ ...m, data: { ...m.data, podejscie2: val } }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.modalLabel}>Podejście III (kg)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Wprowadź wagę (opcjonalnie)"
                  value={editModal.data.podejscie3 || ''}
                  onChangeText={val => setEditModal(m => ({ ...m, data: { ...m.data, podejscie3: val } }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </ScrollView>

              <View style={styles.modalBtns}>
                <TouchableOpacity style={[styles.modalBtnBase, styles.modalCancelBtn]} onPress={closeEditModal}>
                  <AntDesign name="close" size={16} color={colors.textLight} style={styles.modalBtnIcon} />
                  <Text style={styles.modalCancelBtnText}>Anuluj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtnBase, styles.modalConfirmBtn]} onPress={handleSaveEdit}>
                  <AntDesign name="save" size={16} color={colors.textLight} style={styles.modalBtnIcon} />
                  <Text style={styles.modalBtnText}>Zapisz</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      {/* --- KONIEC ZMIANY --- */}

      {/* Powiadomienie */}
      {notif && (
        <View style={[
            styles.notification, // Użyj nowego stylu powiadomienia
            notif.type === 'success' ? styles.notificationSuccess : styles.notificationError
        ]}>
          <AntDesign
            name={notif.type === 'success' ? "checkcircleo" : "exclamationcircleo"}
            size={18}
            color={notif.type === 'success' ? colors.success : colors.error}
            style={styles.notifIcon}
          />
          <Text style={styles.notifText}>{notif.msg}</Text>
        </View>
      )}
    </View>
  );
}