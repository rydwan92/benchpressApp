import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions, Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import  useCompetitionStore from '../../store/useCompetitionStore';
import { saveAppData } from '../../utils/api';
import { colors, spacing } from '../../theme/theme'; // Dodano import spacing
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure FontAwesome is imported if used for wagiCounterIcon
import styles from '../../styles/RegistrationStyles/CategoryWeightManager.styles';
import { commonStyles } from '../../theme/common.js'; // Poprawny import wspólnych stylów

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

  const [modalKategoria, setModalKategoria] = useState(false);
  const [nowaKategoria, setNowaKategoria] = useState('');
  const [modalWaga, setModalWaga] = useState(false);
  const [wybranaKategoria, setWybranaKategoria] = useState('');
  const [nowaWaga, setNowaWaga] = useState('');
  const [hoverKategoria, setHoverKategoria] = useState(null);
  const [hoverDeleteBtn, setHoverDeleteBtn] = useState(null);
  const [hoverActionBtn, setHoverActionBtn] = useState(null);
  const [notif, setNotif] = useState(null);
  const notifTimeout = useRef(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, kategoria: null, waga: null });
  const [deletingKategoria, setDeletingKategoria] = useState(null);

  function showNotif(msg, type) {
    setNotif({ msg, type });
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setNotif(null), 3000);
  }

  const syncData = async () => {
    try {
      const currentState = useCompetitionStore.getState();
      // Usuń socket i attemptResultForAnimation przed wysłaniem, jeśli istnieją
      const { socket, attemptResultForAnimation, ...dataToSend } = currentState;
      await saveAppData(dataToSend);
      // showNotif('Dane zaktualizowane!', 'success'); // Możesz przenieść notyfikację do funkcji wywołującej syncData
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addKategoria(nowaKategoria.trim());
    setNowaKategoria('');
    setModalKategoria(false);
    await syncData();
    showNotif('Dodano kategorię!', 'success'); // Przeniesiona notyfikacja
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addWaga(wybranaKategoria, nowaWaga.trim());
    setNowaWaga('');
    setWybranaKategoria('');
    setModalWaga(false);
    await syncData();
    showNotif('Dodano wagę!', 'success'); // Przeniesiona notyfikacja
  };

  const handleDeleteConfirm = async () => {
    try {
      const { type, kategoria, waga } = confirmModal;

      if (type === 'kategoria') {
        const zawodnicyWKategorii = zawodnicy.filter(z => z.kategoria === kategoria);
        if (zawodnicyWKategorii.length > 0) {
          showNotif(`Nie można usunąć - w kategorii "${kategoria}" są zawodnicy!`, 'error');
          setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
          return;
        }

        setDeletingKategoria(kategoria);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setTimeout(() => {
          removeKategoria(kategoria); 
          setDeletingKategoria(null);
          showNotif(`Usunięto kategorię "${kategoria}" i wszystkie jej wagi!`, 'success');
          setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
          syncData(); 
        }, 300); 
      } else if (type === 'waga') {
        const zawodnicyWWadze = zawodnicy.filter(z => z.kategoria === kategoria && z.waga === waga);
        if (zawodnicyWWadze.length > 0) {
          showNotif(`Nie można usunąć - w wadze "${waga}" są zawodnicy!`, 'error');
          setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
          return;
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        removeWaga(kategoria, waga); 
        showNotif(`Usunięto wagę "${waga}" z kategorii "${kategoria}"!`, 'success');
        setConfirmModal({ open: false, type: null, kategoria: null, waga: null });
        syncData(); 
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
      ZARZĄDZAJ
      </Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            Platform.OS === 'web' && hoverActionBtn === 'kategoria' && styles.actionBtnHover
          ]}
          onPress={() => setModalKategoria(true)}
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
            Platform.OS === 'web' && hoverActionBtn === 'waga' && styles.actionBtnHover
          ]}
          onPress={() => setModalWaga(true)}
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
        <View
          style={styles.kategorieBox}
          // REMOVE onLayout={handleKategorieBoxLayout}
        >
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
                  // REMOVE getTileStyle(),
                  deletingKategoria === k.nazwa && styles.deletingKategoria,
                  Platform.OS === 'web' && hoverKategoria === k.nazwa && styles.kategoriaTileHover
                ]}
                {...(Platform.OS === 'web' && {
                  onMouseEnter: () => setHoverKategoria(k.nazwa),
                  onMouseLeave: () => setHoverKategoria(null)
                })}
              >
                <View style={styles.kategoriaHeader}>
                  <View style={styles.kategoriaTitleContainer}>
                    <Text style={styles.kategoriaTitle} numberOfLines={2} ellipsizeMode="tail">{k.nazwa}</Text>
                    {(() => {
                      const athletesInCategory = zawodnicy.filter(z => z.kategoria === k.nazwa).length;
                      if (athletesInCategory > 0) {
                        return (
                          <View style={styles.wagiCounter}>
                            <FontAwesome name="users" size={styles.wagiCounterIcon.fontSize} color={styles.wagiCounterIcon.color} style={styles.wagiCounterIcon} />
                            <Text style={styles.wagiCounterText}>{athletesInCategory}</Text>
                          </View>
                        );
                      }
                      return null; 
                    })()}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.wagaDeleteBtn,
                      Platform.OS === 'web' && hoverDeleteBtn === `kat-${k.nazwa}` && styles.deleteBtnHover
                    ]}
                    onPress={() => setConfirmModal({ open: true, type: 'kategoria', kategoria: k.nazwa })}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
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
                              Platform.OS === 'web' && hoverDeleteBtn === `waga-${k.nazwa}-${w}` && styles.deleteBtnHover
                            ]}
                            onPress={() => setConfirmModal({ 
                              open: true, 
                              type: 'waga', 
                              kategoria: k.nazwa, 
                              waga: w 
                            })}
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
      
      <Modal visible={modalKategoria} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconHeader}>
              <MaterialCommunityIcons name="plus-box-outline" size={32} color={colors.accent} />
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
      
      <Modal visible={modalWaga} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
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
      
      <Modal visible={confirmModal.open} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, styles.confirmModalCard]}>
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
