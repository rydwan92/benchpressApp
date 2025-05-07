import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions, Platform,
  LayoutAnimation, // Dodaj import
  UIManager // Dodaj import
} from 'react-native';
import { useCompetitionStore } from '../../store/useCompetitionStore';
import { saveAppData } from '../../utils/api';
import { colors } from '../../theme/theme';
import { AntDesign } from '@expo/vector-icons'; // Upewnij się, że jest importowane
import styles from '../../styles/RegistrationStyles/CategoryWeightManager.styles';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 600;

// Włącz LayoutAnimation dla Androida
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function CategoryWeightManager() {
  const kategorie = useCompetitionStore(state => state.kategorie);
  const addKategoria = useCompetitionStore(state => state.addKategoria);
  const addWaga = useCompetitionStore(state => state.addWaga);
  const removeKategoria = useCompetitionStore(state => state.removeKategoria);
  const removeWaga = useCompetitionStore(state => state.removeWaga);
  const zawodnicy = useCompetitionStore(state => state.zawodnicy);
  
  

  // Modal i formularz stanów
  const [modalKategoria, setModalKategoria] = useState(false);
  const [nowaKategoria, setNowaKategoria] = useState('');
  const [modalWaga, setModalWaga] = useState(false);
  const [wybranaKategoria, setWybranaKategoria] = useState('');
  const [nowaWaga, setNowaWaga] = useState('');
  const [hoverKategoria, setHoverKategoria] = useState(null);
  const [hoverDeleteBtn, setHoverDeleteBtn] = useState(null);
  const [hoverActionBtn, setHoverActionBtn] = useState(null); // Nowy stan dla przycisków akcji ('kategoria' lub 'waga')

  // Powiadomienia
  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, kategoria: null, waga: null });

  function showNotif(msg, type) {
    setNotif({ msg, type });
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setNotif(null), 3000);
  }

  // Funkcja synchronizująca – wysyła cały stan do backendu
  const syncData = async () => {
    try {
      const state = useCompetitionStore.getState();
      await saveAppData({
        zawody: state.zawody,
        kategorie: state.kategorie,
        zawodnicy: state.zawodnicy,
      });
      showNotif('Dane zaktualizowane!', 'success');
    } catch (error) {
      console.error('Błąd synchronizacji:', error);
      showNotif('Błąd synchronizacji!', 'error');
    }
  };

  const handleAddKategoria = async () => {
    if (!nowaKategoria.trim()) {
      showNotif('Podaj nazwę kategorii!', 'error');
      return;
    }
    if (kategorie.some(k => k.nazwa.toLowerCase() === nowaKategoria.trim().toLowerCase())) {
      showNotif('Taka kategoria już istnieje!', 'error');
      return;
    }
    // Wywołaj animację PRZED zmianą stanu
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addKategoria(nowaKategoria.trim());
    setNowaKategoria('');
    setModalKategoria(false);
    showNotif('Dodano kategorię!', 'success');
    await syncData();
  };

  const handleAddWaga = async () => {
    if (!wybranaKategoria || !nowaWaga.trim()) {
      showNotif('Wybierz kategorię i podaj wagę!', 'error');
      return;
    }
    const kat = kategorie.find(k => k.nazwa === wybranaKategoria);
    if (kat && kat.wagi.some(w => w.toLowerCase() === nowaWaga.trim().toLowerCase())) {
      showNotif('Taka waga już istnieje w tej kategorii!', 'error');
      return;
    }
    // Wywołaj animację PRZED zmianą stanu
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addWaga(wybranaKategoria, nowaWaga.trim());
    setNowaWaga('');
    setWybranaKategoria('');
    setModalWaga(false);
    showNotif('Dodano wagę!', 'success');
    await syncData();
  };

  // Dodaj nowy stan:
  const [deletingKategoria, setDeletingKategoria] = useState(null);

  // Zmodyfikuj funkcję handleDeleteConfirm:
  const handleDeleteConfirm = async () => {
    try {
      const { type, kategoria, waga } = confirmModal;

      if (type === 'kategoria') {
        // Sprawdź czy są zawodnicy w tej kategorii
        const zawodnicyWKategorii = zawodnicy.filter(z => z.kategoria === kategoria);
        if (zawodnicyWKategorii.length > 0) {
          showNotif(`Nie można usunąć - w kategorii "${kategoria}" są zawodnicy!`, 'error');
          setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
          return;
        }

        // Dodajemy wizualny feedback przed usunięciem
        setDeletingKategoria(kategoria);
        // Wywołaj animację PRZED zmianą stanu (wewnątrz setTimeout)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // Krótka pauza dla efektu wizualnego
        setTimeout(() => {
          removeKategoria(kategoria); // Zmiana stanu
          setDeletingKategoria(null);
          showNotif(`Usunięto kategorię "${kategoria}" i wszystkie jej wagi!`, 'success');
          setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
          syncData(); // Synchronizacja z serwerem
        }, 300); // Opóźnienie dla efektu wizualnego opacity
      } else if (type === 'waga') {
        // Istniejący kod dla wagi...
        const zawodnicyWWadze = zawodnicy.filter(z => z.kategoria === kategoria && z.waga === waga);
        if (zawodnicyWWadze.length > 0) {
          showNotif(`Nie można usunąć - w wadze "${waga}" są zawodnicy!`, 'error');
          setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
          return;
        }
        // Wywołaj animację PRZED zmianą stanu
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        removeWaga(kategoria, waga); // Zmiana stanu
        showNotif(`Usunięto wagę "${waga}" z kategorii "${kategoria}"!`, 'success');
        setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
        syncData(); // Synchronizacja z serwerem
      }
    } catch (error) {
      console.error('Błąd podczas usuwania:', error);
      showNotif('Wystąpił błąd podczas usuwania!', 'error');
      setDeletingKategoria(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.componentTitle}>
      Wprowadź kategorie oraz wagi w turnieju
      </Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            // Styl hover dla web
            Platform.OS === 'web' && hoverActionBtn === 'kategoria' && styles.actionBtnHover
          ]}
          onPress={() => setModalKategoria(true)}
          // Dodajemy obsługę hover dla web
          {...(Platform.OS === 'web' && {
            onMouseEnter: () => setHoverActionBtn('kategoria'),
            onMouseLeave: () => setHoverActionBtn(null)
          })}
        >
          <AntDesign name="plus" size={16} color={colors.textLight} style={styles.btnIcon} />
          <Text style={styles.actionBtnText}>Dodaj kategorię</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            // Styl hover dla web
            Platform.OS === 'web' && hoverActionBtn === 'waga' && styles.actionBtnHover
          ]}
          onPress={() => setModalWaga(true)}
          // Dodajemy obsługę hover dla web
          {...(Platform.OS === 'web' && {
            onMouseEnter: () => setHoverActionBtn('waga'),
            onMouseLeave: () => setHoverActionBtn(null)
          })}
        >
          <AntDesign name="plus" size={16} color={colors.textLight} style={styles.btnIcon} />
          <Text style={styles.actionBtnText}>Dodaj wagę</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.kategorieBox}>
          {kategorie.length === 0 ? (
            <View style={styles.emptyState}>
              <AntDesign name="folderopen" size={32} color={colors.textSecondary} />
              <Text style={styles.emptyText}>Brak kategorii - dodaj pierwszą kategorię</Text>
            </View>
          ) : (
            kategorie.map(k => (
              <View
                key={k.nazwa}
                style={[
                  styles.kategoriaTile,
                  deletingKategoria === k.nazwa && styles.deletingKategoria,
                  isSmallDevice && { width: '100%', flexBasis: 'auto' },
                  // Styl hover dla web
                  Platform.OS === 'web' && hoverKategoria === k.nazwa && styles.kategoriaTileHover
                ]}
                // Dodajemy obsługę hover dla web
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setHoverKategoria(k.nazwa),
                  onMouseLeave: () => setHoverKategoria(null)
                })}
              >
                <View style={styles.kategoriaHeader}>
                  {/* Kontener na tytuł i licznik */}
                  <View style={styles.kategoriaTitleContainer}>
                    <Text style={styles.kategoriaTitle}>{k.nazwa}</Text>
                    {k.wagi?.length > 0 && (
                      <View style={styles.wagiCounter}>
                        <Text style={styles.wagiCounterText}>{k.wagi.length}</Text>
                      </View>
                    )}
                  </View>

                  {/* Przycisk usuwania kategorii */}
                  <TouchableOpacity
                    style={[
                      styles.wagaDeleteBtn,
                      // Styl hover dla web
                      Platform.OS === 'web' && hoverDeleteBtn === `kat-${k.nazwa}` && styles.deleteBtnHover
                    ]}
                    onPress={() => setConfirmModal({ open: true, type: 'kategoria', kategoria: k.nazwa })}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Dobra praktyka dla małych przycisków
                    // Dodajemy obsługę hover dla web
                    {...(Platform.OS === 'web' && {
                      onMouseEnter: () => setHoverDeleteBtn(`kat-${k.nazwa}`),
                      onMouseLeave: () => setHoverDeleteBtn(null)
                    })}
                  >
                    <AntDesign name="close" size={14} color={colors.error} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.wagiContainer}>
                  {k.wagi.length > 0 ? (
                    <View style={styles.wagiRow}>
                      {k.wagi.map(w => (
                        <View key={w} style={styles.wagaTile}>
                          <Text style={styles.wagaText}>{w}</Text>
                          <TouchableOpacity 
                            style={[
                              styles.wagaDeleteBtn,
                              // Styl hover dla web
                              Platform.OS === 'web' && hoverDeleteBtn === `waga-${k.nazwa}-${w}` && styles.deleteBtnHover
                            ]}
                            onPress={() => setConfirmModal({ 
                              open: true, 
                              type: 'waga', 
                              kategoria: k.nazwa, 
                              waga: w 
                            })}
                            // Dodajemy obsługę hover dla web
                            {...(Platform.OS === 'web' && {
                              onMouseEnter: () => setHoverDeleteBtn(`waga-${k.nazwa}-${w}`),
                              onMouseLeave: () => setHoverDeleteBtn(null)
                            })}
                          >
                            <AntDesign name="close" size={14} color={colors.error} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.wagiEmpty}>Brak wag - dodaj pierwszą wagę</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Modal dodawania kategorii */}
      <Modal visible={modalKategoria} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            {/* Dodajemy ikonę obok tytułu */}
            <View style={styles.modalIconHeader}>
              <AntDesign name="appstore-add" size={28} color={colors.accent} /> {/* Zmieniona ikona */}
            </View>
            <Text style={styles.modalTitle}>Nowa kategoria</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nazwa kategorii"
              value={nowaKategoria}
              onChangeText={setNowaKategoria}
              autoFocus
              placeholderTextColor={colors.textSecondary}
            />
            
            <View style={styles.modalBtns}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setModalKategoria(false)}
              >
                <Text style={styles.btnText}>Anuluj</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.confirmBtn]} 
                onPress={handleAddKategoria}
              >
                <AntDesign name="check" size={16} color={colors.textLight} style={styles.btnIcon} />
                <Text style={styles.btnText}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal dodawania wagi */}
      <Modal visible={modalWaga} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            {/* Dodajemy ikonę obok tytułu */}
            <View style={styles.modalIconHeader}>
              <AntDesign name="tagso" size={28} color={colors.accent} /> {/* Zmieniona ikona */}
            </View>
            
            <Text style={styles.modalTitle}>Nowa waga</Text>
            
            <View style={styles.selectBox}>
              {kategorie.length === 0 ? (
                <Text style={styles.errorText}>Najpierw dodaj kategorię!</Text>
              ) : (
                <>
                  <Text style={styles.selectLabel}>Wybierz kategorię:</Text>
                  {/* Zmieniamy ScrollView na View i stosujemy nowy styl */}
                  <ScrollView style={{ maxHeight: 150 }}> {/* Dodajemy ScrollView wokół View, jeśli chcemy przewijać nadmiar */}
                    <View style={styles.selectItemsContainer}>
                      {kategorie.map(k => (
                        <TouchableOpacity
                          key={k.nazwa}
                          style={[
                            styles.selectItem,
                            wybranaKategoria === k.nazwa && styles.selectItemActive
                          ]}
                          onPress={() => setWybranaKategoria(k.nazwa)}
                        >
                          <Text
                            style={[
                              styles.selectItemText,
                              wybranaKategoria === k.nazwa && styles.selectItemTextActive
                            ]}
                          >
                            {k.nazwa}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </>
              )}
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Nowa waga (np. 70kg)"
              value={nowaWaga}
              onChangeText={setNowaWaga}
              placeholderTextColor={colors.textSecondary}
            />
            
            <View style={styles.modalBtns}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setModalWaga(false)}
              >
                <Text style={styles.btnText}>Anuluj</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.confirmBtn]} 
                onPress={handleAddWaga}
              >
                <AntDesign name="check" size={16} color={colors.textLight} style={styles.btnIcon} />
                <Text style={styles.btnText}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal potwierdzenia usunięcia */}
      <Modal visible={confirmModal.open} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, styles.confirmModalCard]}>
            {/* Ikona ostrzeżenia już jest, upewnijmy się, że jest poprawna */}
            <View style={styles.modalIconHeader}>
              <AntDesign name="warning" size={32} color={colors.warning} />
            </View>
            
            <Text style={[styles.modalTitle, styles.confirmTitle]}>
              {confirmModal.type === 'kategoria' ? (
                <>
                  Usunąć kategorię "{confirmModal.kategoria}"?
                  {confirmModal.kategoria && (
                    <Text style={styles.confirmSubtitle}>
                      {"\n"}Zostaną usunięte również wszystkie wagi ({
                        kategorie.find(k => k.nazwa === confirmModal.kategoria)?.wagi?.length || 0
                      })
                    </Text>
                  )}
                </>
              ) : (
                `Usunąć wagę "${confirmModal.waga}"\nz kategorii "${confirmModal.kategoria}"?`
              )}
            </Text>
            
            <View style={styles.modalBtns}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setConfirmModal({ open: false, type: null, kategoria: null, waga: null })}
              >
                <Text style={styles.btnText}>Anuluj</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.deleteBtn]} 
                onPress={handleDeleteConfirm}
              >
                <AntDesign name="delete" size={16} color={colors.textLight} style={styles.btnIcon} />
                <Text style={styles.btnText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Powiadomienie */}
      {notif && (
        <View style={[

          styles.notification, 
          notif.type === 'success' ? styles.notifSuccess : styles.notifError
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
