import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, useWindowDimensions, ActivityIndicator, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// --- START ZMIANY: Importuj store ---
import { useCompetitionStore } from '../store/useCompetitionStore';
// --- KONIEC ZMIANY ---
import { saveAppData } from '../utils/api';
import NavBar from '../components/navigation/NavBar';
import Footer from '../components/navigation/Footer';
import { colors, font, spacing, borderRadius, shadows } from '../theme/theme';
import { AntDesign } from '@expo/vector-icons'; // Upewnij się, że jest importowane

// --- Funkcja pomocnicza do sprawdzania ukończenia zawodnika ---
const hasAthleteCompleted = (athlete) => {
  // Sprawdza, czy wszystkie trzy statusy podejść są ustawione (nie są null)
  return !!(athlete.podejscie1Status && athlete.podejscie2Status && athlete.podejscie3Status);
};
// --- KONIEC ZMIANY ---

// --- Komponenty pomocnicze (OptionSelector, AthleteList, CurrentAthleteManager, Timer) ---
// Komponent do wyboru opcji (Kategoria, Waga)
const OptionSelector = ({ label, options, selectedValue, onSelect, placeholder = "Wybierz...", loading = false }) => (
    <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>{label}:</Text>
        {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={styles.selectorLoading} />
        ) : options.length === 0 ? (
            <Text style={styles.selectorEmpty}>Brak opcji</Text>
        ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
                {/* Placeholder */}
                <TouchableOpacity
                    key="placeholder"
                    style={[styles.selectorOption, !selectedValue && styles.selectorOptionActive]}
                    onPress={() => onSelect(null)}
                    disabled={loading} // Wyłącz placeholder podczas ładowania
                >
                    <Text style={[styles.selectorOptionText, !selectedValue && styles.selectorOptionTextActive]}>
                        {placeholder}
                    </Text>
                </TouchableOpacity>
                {/* Mapowanie opcji */}
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.selectorOption,
                            selectedValue === option.value && styles.selectorOptionActive,
                            option.isCompleted && styles.selectorOptionCompleted // Styl dla ukończonej
                        ]}
                        onPress={() => !option.isCompleted && onSelect(option.value)} // Wywołaj onSelect tylko jeśli nieukończone
                        disabled={option.isCompleted || loading} // Zablokuj ukończone lub podczas ładowania
                    >
                        <Text style={[
                            styles.selectorOptionText,
                            selectedValue === option.value && styles.selectorOptionTextActive,
                            option.isCompleted && styles.selectorOptionTextCompleted // Styl tekstu ukończonej
                        ]}>
                            {option.label}
                        </Text>
                        {/* Ikona dla ukończonych */}
                        {option.isCompleted && (
                             <AntDesign name="check" size={12} color={colors.success} style={styles.selectorCompletedIcon} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )}
    </View>
);

// Komponent listy zawodników
// --- POCZĄTEK ZMIANY: Modyfikacja AthleteList ---
const AthleteList = ({ athletes, currentAthleteFilteredIndex, onSelectAthlete }) => (
    <View style={styles.athleteListContainer}>
        <Text style={styles.subHeader}>Zawodnicy w tej grupie:</Text>
        {athletes.length === 0 ? (
            <Text style={styles.emptyText}>Brak zawodników w tej kategorii/wadze.</Text>
        ) : (
            <ScrollView style={styles.athleteScroll}>
                {athletes.map((athlete, index) => (
                    <TouchableOpacity
                        key={athlete.originalIndex}
                        style={[
                            styles.athleteListItem,
                            index === currentAthleteFilteredIndex && styles.athleteListItemActive,
                            athlete.isCompleted && styles.athleteListItemCompleted, // Styl dla ukończonego
                        ]}
                        onPress={() => onSelectAthlete(athlete.originalIndex)}
                        // Opcjonalnie: Zablokuj wybór ukończonych
                        // disabled={athlete.isCompleted}
                    >
                        {/* Dodatkowy View dla flexbox (tekst + ikona) */}
                        <View style={styles.athleteListItemContent}>
                            <Text style={[
                                styles.athleteListText,
                                athlete.isCompleted && styles.athleteListTextCompleted // Opcjonalny styl tekstu
                            ]}>
                                {index + 1}. {athlete.imie} {athlete.nazwisko} ({athlete.klub || 'brak klubu'})
                                <Text style={styles.athleteListAttempt1}> [{athlete.podejscie1 || 'N/A'} kg]</Text>
                            </Text>
                            {/* Ikona галочки dla ukończonych */}
                            {athlete.isCompleted && (
                                <AntDesign name="checkcircle" size={18} color={colors.success} style={styles.completedIcon} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        )}
    </View>
);
// --- KONIEC ZMIANY ---

// Komponent zarządzania aktualnym zawodnikiem
const CurrentAthleteManager = ({ athlete, athleteOriginalIndex, currentAttemptNr, onAttemptStatusChange, onWeightChange, isSaving }) => {
    // console.log(`[CurrentAthleteManager] Rendering with currentAttemptNr: ${currentAttemptNr}`); // LOG 4 - Można odkomentować w razie potrzeby
    if (!athlete) {
        return <Text style={styles.emptyText}>Wybierz zawodnika z listy.</Text>;
    }

    const getStatusIcon = (status) => {
        if (status === 'passed') return <AntDesign name="checkcircle" size={24} color={colors.success} />;
        if (status === 'failed') return <AntDesign name="closecircle" size={24} color={colors.error} />;
        return <AntDesign name="clockcircleo" size={24} color={colors.textSecondary} />;
    };

    const handleWeightInput = (nr, text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        onWeightChange(athleteOriginalIndex, nr, numericValue);
    };

    return (
        <View style={styles.currentAthleteContainer}>
            <Text style={styles.currentAthleteName}>{athlete.imie} {athlete.nazwisko}</Text>
            <Text style={styles.currentAthleteClub}>{athlete.klub || 'brak klubu'}</Text>
            <View style={styles.attemptsContainer}>
                {[1, 2, 3].map((nr) => {
                    const weight = athlete[`podejscie${nr}`];
                    const status = athlete[`podejscie${nr}Status`];
                    const isCurrent = currentAttemptNr === nr;
                    const isEditable = !status && nr >= currentAttemptNr;

                    return (
                        <View key={nr} style={[styles.attemptBox, isCurrent && styles.attemptBoxActive]}>
                            <Text style={styles.attemptLabel}>Podejście {nr}</Text>
                            {isEditable ? (
                                <TextInput
                                    style={styles.attemptWeightInput}
                                    value={String(weight || '')} // Upewnij się, że value jest stringiem
                                    onChangeText={(text) => handleWeightInput(nr, text)}
                                    keyboardType="numeric"
                                    placeholder="kg"
                                    editable={!isSaving}
                                />
                            ) : (
                                <Text style={styles.attemptWeight}>{weight ? `${weight} kg` : '-'}</Text>
                            )}
                            <View style={styles.attemptStatusIcon}>{getStatusIcon(status)}</View>
                            {isCurrent && !status && (
                                <View style={styles.attemptActions}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.passButton, isSaving && styles.actionButtonDisabled]}
                                        onPress={() => !isSaving && onAttemptStatusChange(athleteOriginalIndex, nr, 'passed')}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <ActivityIndicator size="small" color={colors.textLight} /> : <Text style={styles.actionButtonText}>Zalicz</Text>}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.failButton, isSaving && styles.actionButtonDisabled]}
                                        onPress={() => !isSaving && onAttemptStatusChange(athleteOriginalIndex, nr, 'failed')}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <ActivityIndicator size="small" color={colors.textLight} /> : <Text style={styles.actionButtonText}>Spal</Text>}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

// Komponent Timera - teraz pobiera czas i stan ze store'u
const Timer = ({ isActive, timeLeft }) => {
    const formatTime = (seconds) => {
        // --- START CHANGE: Handle invalid input ---
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
            console.warn(`[Timer formatTime] Invalid seconds value: ${seconds}. Returning '00:00'.`);
            return '00:00'; // Zwróć domyślną wartość zamiast NaN:NaN
        }
        // --- END CHANGE ---
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.timerContainer}>
            <Text style={[
                styles.timerText,
                // Stosuj style ostrzeżenia/zakończenia tylko dla poprawnych wartości czasu
                isActive && typeof timeLeft === 'number' && !isNaN(timeLeft) && timeLeft <= 10 && timeLeft > 0 && styles.timerWarning,
                isActive && typeof timeLeft === 'number' && !isNaN(timeLeft) && timeLeft === 0 && styles.timerFinished
            ]}>
                {/* Pokaż sformatowany czas tylko jeśli timer jest aktywny i czas jest poprawny */}
                {isActive && typeof timeLeft === 'number' && !isNaN(timeLeft) ? formatTime(timeLeft) : '--:--'}
            </Text>
        </View>
    );
};


// --- Główny komponent ekranu ---

export default function CompetitionScreen() {
  const navigation = useNavigation();
  // Pobieranie stanu i akcji ze store'u
  const {
    zawody, kategorie, zawodnicy,
    activeCategory, activeWeight, activeAthleteOriginalIndex, activeAttemptNr, timerActive, timerTimeLeft,
    updatePodejscieStatus, updatePodejscieWaga, setInitialData,
    setActiveGroup, setActiveAthlete, setActiveAttemptNr, setTimerActive, setTimerTimeLeft,
    // --- START ZMIANY: Pobierz socket ze store ---
    socket
    // --- KONIEC ZMIANY ---
  } = useCompetitionStore(state => ({
      zawody: state.zawody,
      kategorie: state.kategorie,
      zawodnicy: state.zawodnicy,
      activeCategory: state.activeCategory,
      activeWeight: state.activeWeight,
      activeAthleteOriginalIndex: state.activeAthleteOriginalIndex,
      activeAttemptNr: state.activeAttemptNr,
      timerActive: state.timerActive,
      timerTimeLeft: state.timerTimeLeft,
      updatePodejscieStatus: state.updatePodejscieStatus,
      updatePodejscieWaga: state.updatePodejscieWaga,
      setInitialData: state.setInitialData,
      setActiveGroup: state.setActiveGroup,
      setActiveAthlete: state.setActiveAthlete,
      setActiveAttemptNr: state.setActiveAttemptNr,
      setTimerActive: state.setTimerActive,
      setTimerTimeLeft: state.setTimerTimeLeft,
      // --- START ZMIANY: Pobierz socket ---
      socket: state.socket,
      // --- KONIEC ZMIANY ---
  }));

  const { width } = useWindowDimensions();
  const [isSaving, setIsSaving] = useState(false);
  const [headerKlubAvatarDimensions, setHeaderKlubAvatarDimensions] = useState(null);
  const [headerJudgeAvatarDimensions, setHeaderJudgeAvatarDimensions] = useState({ width: 32, height: 32 });

  // Efekty ładowania avatarów (bez zmian)
  useEffect(() => {
    if (zawody.klubAvatar) {
      Image.getSize(zawody.klubAvatar, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight; const maxWidth = 60; const maxHeight = 40;
        let displayWidth = imgWidth; let displayHeight = imgHeight;
        if (displayWidth > maxWidth) { displayWidth = maxWidth; displayHeight = displayWidth / aspectRatio; }
        if (displayHeight > maxHeight) { displayHeight = maxHeight; displayWidth = displayHeight * aspectRatio; }
        setHeaderKlubAvatarDimensions({ width: displayWidth, height: displayHeight });
      }, (error) => { console.error('Błąd rozmiaru logo klubu:', error); setHeaderKlubAvatarDimensions(null); });
    } else { setHeaderKlubAvatarDimensions(null); }
  }, [zawody.klubAvatar]);

  useEffect(() => {
    if (zawody.sedzia?.avatar) {
      Image.getSize(zawody.sedzia.avatar, (imgWidth, imgHeight) => {
        const size = Math.min(imgWidth, imgHeight); const maxSize = 32;
        const displaySize = Math.min(size, maxSize);
        setHeaderJudgeAvatarDimensions({ width: displaySize, height: displaySize });
      }, (error) => { console.error('Błąd rozmiaru avatara sędziego:', error); setHeaderJudgeAvatarDimensions({ width: 32, height: 32 }); });
    } else { setHeaderJudgeAvatarDimensions({ width: 32, height: 32 }); }
  }, [zawody.sedzia?.avatar]);

  // --- Logika timera ---
  const timerIntervalRef = useRef(null);
  const stableSetTimerTimeLeft = useCallback(setTimerTimeLeft, [setTimerTimeLeft]);
  const stableSetTimerActive = useCallback(setTimerActive, [setTimerActive]);

  // Definicja handleTimerFinish w zasięgu komponentu
  // --- START ZMIANY: Przekaż handleAttemptStatusChange jako argument ---
  const handleTimerFinish = useCallback((attemptStatusChangeFn) => {
    console.log("[CompetitionScreen] Czas minął!");
    const state = useCompetitionStore.getState();
    if (state.activeAthleteOriginalIndex !== null && state.activeAttemptNr) {
        const athlete = state.zawodnicy[state.activeAthleteOriginalIndex];
        if (athlete && !athlete[`podejscie${state.activeAttemptNr}Status`]) {
            // Wywołaj przekazaną funkcję
            attemptStatusChangeFn(state.activeAthleteOriginalIndex, state.activeAttemptNr, 'failed');
        }
    }
  }, []); // Usuń handleAttemptStatusChange z zależności, bo jest przekazywane
  // --- KONIEC ZMIANY ---

  // --- START ZMIANY: Zaktualizuj stableHandleTimerFinish ---
  // Przekaż handleAttemptStatusChange do stableHandleTimerFinish
  const stableHandleTimerFinish = useCallback(() => handleTimerFinish(handleAttemptStatusChange), [handleTimerFinish, handleAttemptStatusChange]);
  // --- KONIEC ZMIANY ---

  // Efekt dla timera - USUŃ syncData z interwału
  useEffect(() => {
    console.log(`[Timer useEffect] Running. timerActive: ${timerActive}`);
    if (timerActive) {
      console.log(`[Timer useEffect] Starting interval...`);
      timerIntervalRef.current = setInterval(() => {
        stableSetTimerTimeLeft(prevTime => {
          console.log(`[Timer Interval Tick] prevTime: ${prevTime}`);
          if (prevTime <= 1) {
            console.log(`[Timer Interval Tick] Time <= 1, clearing interval and stopping timer.`);
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
            stableSetTimerActive(false); // Ustaw lokalnie
            stableHandleTimerFinish(); // Wywołaj funkcję kończącą
            // --- START ZMIANY: Wyślij event stopTimer zamiast syncData ---
            if (socket) {
              console.log('[Timer Interval Tick] Emitting stopTimer event.');
              socket.emit('stopTimer');
            }
            // --- KONIEC ZMIANY ---
            return 0;
          }
          // UWAGA: Nie wysyłamy już nic co sekundę!
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        console.log(`[Timer useEffect] Clearing interval because timerActive is false.`);
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        console.log(`[Timer useEffect Cleanup] Clearing interval.`);
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null; // Dodaj czyszczenie refa w cleanupie
      }
    };
    // --- START ZMIANY: Usuń syncData z zależności, dodaj socket ---
  }, [timerActive, stableSetTimerTimeLeft, stableSetTimerActive, stableHandleTimerFinish, socket]); // Dodaj socket do zależności
  // --- KONIEC ZMIANY ---


  // --- Logika pomocnicza (categoryOptions, weightOptions, filteredAthletes, etc.) ---
  const categoryOptions = useMemo(() => kategorie.map(k => ({ label: k.nazwa, value: k.nazwa })), [kategorie]);

  const activeCategoryObject = useMemo(() => {
      return kategorie.find(k => k.nazwa === activeCategory);
  }, [kategorie, activeCategory]);

  const completedWeights = useMemo(() => {
      const completed = new Set();
      if (!activeCategoryObject || !zawodnicy) {
          return completed;
      }
      activeCategoryObject.wagi.forEach(waga => {
          const athletesInGroup = zawodnicy.filter(z => z.kategoria === activeCategory && z.waga === waga);
          if (athletesInGroup.length > 0 && athletesInGroup.every(hasAthleteCompleted)) {
              completed.add(waga);
          }
      });
      return completed;
  }, [activeCategoryObject, zawodnicy, activeCategory]);

  const weightOptions = useMemo(() => {
    if (!activeCategoryObject) return [];
    const sortedWagi = [...activeCategoryObject.wagi].sort((a, b) => Number(a) - Number(b));
    return sortedWagi.map(w => ({
        label: String(w),
        value: w,
        isCompleted: completedWeights.has(w)
    }));
  }, [activeCategoryObject, completedWeights]);

  const filteredAthletes = useMemo(() => {
      if (!activeCategory || !activeWeight) return [];
      return zawodnicy
        .map((z, index) => ({
          ...z,
          originalIndex: index,
          isCompleted: hasAthleteCompleted(z)
        }))
        .filter(z => z.kategoria === activeCategory && z.waga === activeWeight)
        .sort((a, b) => {
            const weightA = Number(a.podejscie1) || 0;
            const weightB = Number(b.podejscie1) || 0;
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1;
            }
            return weightA - weightB;
        });
  }, [zawodnicy, activeCategory, activeWeight]);

  const currentAthleteFilteredIndex = useMemo(() => {
      if (activeAthleteOriginalIndex === null) return null;
      return filteredAthletes.findIndex(z => z.originalIndex === activeAthleteOriginalIndex);
  }, [filteredAthletes, activeAthleteOriginalIndex]);

  const currentAthlete = currentAthleteFilteredIndex !== null && currentAthleteFilteredIndex !== -1
    ? filteredAthletes[currentAthleteFilteredIndex]
    : null;

  // Funkcja synchronizująca dane z backendem (pozostaje do innych akcji)
  const syncData = useCallback(async (partialData = null) => {
    if (isSaving) {
        console.warn('[syncData] Save already in progress. Skipping.');
        return;
    }
    setIsSaving(true);
    console.time('syncDataDuration');
    try {
      const currentState = useCompetitionStore.getState();

      // --- START ZMIANY: Wyklucz 'socket' ze stanu przed wysłaniem ---
      const { socket, ...stateToSend } = currentState; // Destrukturyzacja, aby oddzielić socket
      // --- KONIEC ZMIANY ---

      // Użyj partialData jeśli przekazano, inaczej oczyszczonego stanu
      const dataToSend = partialData
        ? { ...stateToSend, ...partialData } // Połącz oczyszczony stan z partialData
        : stateToSend; // Wyślij oczyszczony stan

      // Loguj tylko kluczowe części
      console.log(`[syncData] Sending update. Timer: ${dataToSend.timerActive}, TimeLeft: ${dataToSend.timerTimeLeft}, ActiveIdx: ${dataToSend.activeAthleteOriginalIndex}`);
      console.time('saveAppDataApiCall');
      await saveAppData(dataToSend); // Wyślij dataToSend (już bez obiektu socket)
      console.timeEnd('saveAppDataApiCall');
    } catch (error) {
      // --- START ZMIANY: Loguj konkretny błąd cykliczny ---
      if (error instanceof TypeError && error.message.includes('cyclic object value')) {
          console.error('[CompetitionScreen] Błąd synchronizacji danych: Wykryto cykliczny obiekt! Upewnij się, że `socket` jest poprawnie usuwany ze stanu przed wysłaniem.', error);
      } else {
          console.error('[CompetitionScreen] Błąd synchronizacji danych:', error);
      }
      // --- KONIEC ZMIANY ---
    } finally {
      setIsSaving(false);
      console.timeEnd('syncDataDuration');
    }
  }, [isSaving]);

  // --- Obsługa Akcji ---

  const handleSelectCategory = (category) => {
    console.log(`[CompetitionScreen] handleSelectCategory: ${category}`);
    setActiveGroup(category, null);
    syncData(); // Synchronizuj po zmianie grupy
  };

  const handleSelectWeight = (weight) => {
    console.log(`[CompetitionScreen] handleSelectWeight: ${weight}`);
    setActiveGroup(activeCategory, weight);
    syncData(); // Synchronizuj po zmianie grupy
  };

  const handleSelectAthlete = (originalIndex) => {
    console.log(`[CompetitionScreen] handleSelectAthlete: index=${originalIndex}`);
    setActiveAthlete(originalIndex);
    syncData(); // Synchronizuj po zmianie zawodnika
  };

  // Obsługa zmiany statusu podejścia
  const handleAttemptStatusChange = useCallback(async (athleteOriginalIndex, attemptNr, status) => {
    if (isSaving) return;
    console.log(`[CompetitionScreen] handleAttemptStatusChange: index=${athleteOriginalIndex}, attempt=${attemptNr}, status=${status}`);
    stableSetTimerActive(false); // Zatrzymaj timer natychmiast (lokalnie)
    updatePodejscieStatus(athleteOriginalIndex, attemptNr, status);

    let nextAttemptNr = attemptNr;
    if (attemptNr < 3) {
        nextAttemptNr = attemptNr + 1;
        console.log(`[CompetitionScreen] Setting next attempt number locally to: ${nextAttemptNr}`);
        setActiveAttemptNr(nextAttemptNr);
    } else {
        console.log(`[CompetitionScreen] Athlete ${athleteOriginalIndex} finished attempts.`);
    }

    // --- START ZMIANY: Wyślij stopTimer jeśli timer był aktywny ---
    // Sprawdź stan timera PRZED wywołaniem stableSetTimerActive
    const wasTimerActive = useCompetitionStore.getState().timerActive;
    if (wasTimerActive && socket) {
        console.log('[handleAttemptStatusChange] Emitting stopTimer event.');
        socket.emit('stopTimer');
    }
    // --- KONIEC ZMIANY ---

    await syncData(); // Synchronizuj stan PO aktualizacji statusu i numeru podejścia

    console.log(`[CompetitionScreen] handleAttemptStatusChange finished for attempt ${attemptNr}`);

  }, [isSaving, stableSetTimerActive, updatePodejscieStatus, setActiveAttemptNr, syncData, socket]); // Dodaj socket do zależności

  // Obsługa zmiany wagi w inpucie
  const handleWeightChange = (athleteOriginalIndex, attemptNr, weight) => {
    console.log(`[CompetitionScreen] handleWeightChange: index=${athleteOriginalIndex}, attempt=${attemptNr}, weight=${weight}`);
    updatePodejscieWaga(athleteOriginalIndex, attemptNr, weight);
    // syncData(); // Odkomentuj, jeśli zmiana wagi ma być natychmiast widoczna i synchronizowana
  };

  const handleStartAttempt = () => {
    console.log(`[CompetitionScreen] handleStartAttempt`);
    if (currentAthlete && !timerActive && socket) { // Sprawdź czy socket istnieje
      stableSetTimerActive(true); // Ustaw stan lokalnie
      // --- START ZMIANY: Wyślij event startTimer zamiast syncData ---
      console.log('[CompetitionScreen] Emitting startTimer event.');
      socket.emit('startTimer', { initialTime: 60 }); // Wyślij event startu
      // syncData(); // <--- USUNIĘTE
      // --- KONIEC ZMIANY ---
    } else if (!socket) {
        console.warn('[CompetitionScreen] Cannot start timer, socket is not connected.');
    }
  };

  const handleStopAttempt = () => {
    console.log(`[CompetitionScreen] handleStopAttempt`);
    if (timerActive && socket) { // Sprawdź czy socket istnieje
      stableSetTimerActive(false); // Ustaw stan lokalnie
      // --- START ZMIANY: Wyślij event stopTimer zamiast syncData ---
      console.log('[CompetitionScreen] Emitting stopTimer event.');
      socket.emit('stopTimer'); // Wyślij event stopu
      // syncData(); // <--- USUNIĘTE
      // --- KONIEC ZMIANY ---
    } else if (!socket) {
        console.warn('[CompetitionScreen] Cannot stop timer, socket is not connected.');
    }
  };

  // --- Renderowanie ---

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Nagłówek */}
      <LinearGradient colors={[colors.gradient.start, colors.gradient.end]} style={styles.headerBackground}>
          <View style={styles.headerBar}>
              <View style={styles.headerSideContainer}>
                  {zawody.klubAvatar && headerKlubAvatarDimensions ? <Image source={{ uri: zawody.klubAvatar }} style={[styles.headerClubLogo, headerKlubAvatarDimensions]} /> : null}
                  <View style={styles.headerLocationDate}>
                      <Text style={styles.headerLocationText}>{zawody.miejsce}</Text>
                      <Text style={styles.headerDateText}>{zawody.data}</Text>
                  </View>
              </View>
              <Text style={styles.headerLogo}>{zawody.nazwa || 'Benchpress Cup'}</Text>
              <View style={[styles.headerSideContainer, styles.headerRightAlign]}>
                  <View style={styles.headerJudgeInfo}><Text style={styles.headerJudgeName}>{`${zawody.sedzia?.imie || ''} ${zawody.sedzia?.nazwisko || ''}`}</Text></View>
                  {zawody.sedzia?.avatar ? <Image source={{ uri: zawody.sedzia.avatar }} style={[styles.headerJudgeAvatar, headerJudgeAvatarDimensions]} /> : null}
              </View>
          </View>
        <NavBar navigation={navigation} />
      </LinearGradient>

      {/* Główna zawartość */}
      <View style={styles.mainContent}>
        <Text style={styles.mainTitle}>Zarządzaj przebiegiem zawodów</Text>
        <View style={styles.columnsContainer}>

          {/* Lewa Kolumna: Wybór i Podejścia */}
          <View style={styles.leftColumn}>
            {/* Karta Wyboru */}
            <View style={styles.card}>
              <Text style={styles.columnTitle}>Wybór grupy</Text>
              <OptionSelector
                label="Kategoria"
                options={categoryOptions}
                selectedValue={activeCategory}
                onSelect={handleSelectCategory}
                placeholder="Wybierz kategorię"
              />
              <OptionSelector
                label="Waga"
                options={weightOptions}
                selectedValue={activeWeight}
                onSelect={handleSelectWeight}
                placeholder="Wybierz wagę"
              />
              {activeCategory && activeWeight && (
                <AthleteList
                  athletes={filteredAthletes}
                  currentAthleteFilteredIndex={currentAthleteFilteredIndex}
                  onSelectAthlete={handleSelectAthlete}
                />
              )}
            </View>

            {/* Karta Podejść */}
            <View style={styles.card}>
              <Text style={styles.columnTitle}>Podejścia zawodnika</Text>
              <CurrentAthleteManager
                athlete={currentAthlete}
                athleteOriginalIndex={activeAthleteOriginalIndex}
                currentAttemptNr={activeAttemptNr}
                onAttemptStatusChange={handleAttemptStatusChange}
                onWeightChange={handleWeightChange}
                isSaving={isSaving}
              />
            </View>
          </View>

          {/* Prawa Kolumna: Zarządzanie */}
          <View style={styles.rightColumn}>
            <View style={styles.card}>
              <Text style={styles.columnTitle}>Zarządzanie</Text>

              {/* Timer */}
              <Timer
                isActive={timerActive}
                timeLeft={timerTimeLeft}
              />

              {/* Info o aktualnym zawodniku i podejściu */}
              <View style={styles.currentStatusInfo}>
                <Text style={styles.currentStatusLabel}>Aktualnie:</Text>
                {currentAthlete ? (
                  <>
                    <Text style={styles.currentStatusText}>
                      {currentAthlete.imie} {currentAthlete.nazwisko} ({currentAthlete.klub || 'brak klubu'})
                    </Text>
                    <Text style={styles.currentStatusText}>
                      Podejście: {activeAttemptNr} / Ciężar: {currentAthlete[`podejscie${activeAttemptNr}`] || '-'} kg
                    </Text>
                  </>
                ) : (
                  <Text style={styles.currentStatusText}>Wybierz zawodnika</Text>
                )}
              </View>

              {/* Przyciski Akcji */}
              <View style={styles.mainActionButtons}>
                <TouchableOpacity
                  style={[
                    styles.mainActionButton, styles.startButton,
                    (!currentAthlete || timerActive || isSaving) && styles.actionButtonDisabled
                  ]}
                  onPress={handleStartAttempt}
                  disabled={!currentAthlete || timerActive || isSaving}
                >
                  {isSaving ? <ActivityIndicator size="small" color={colors.textLight} /> : <Text style={styles.mainActionButtonText}>Rozpocznij podejście</Text>}
                </TouchableOpacity>
                 <TouchableOpacity
                  style={[
                    styles.mainActionButton, styles.stopButton,
                    (!timerActive || isSaving) && styles.actionButtonDisabled
                  ]}
                  onPress={handleStopAttempt}
                  disabled={!timerActive || isSaving}
                >
                  {isSaving ? <ActivityIndicator size="small" color={colors.textLight} /> : <Text style={styles.mainActionButtonText}>Zatrzymaj czas</Text>}
                </TouchableOpacity>
              </View>
            </View>
            {/* Możesz tu dodać inne karty zarządzania, np. szybkie przejście do następnego zawodnika */}
          </View>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
}

// --- Style ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    contentContainer: { flexGrow: 1 },
    headerBackground: { paddingTop: spacing.xl, ...shadows.medium },
    headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', width: '100%', marginBottom: spacing.lg },
    headerSideContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 100 },
    headerRightAlign: { justifyContent: 'flex-end' },
    headerClubLogo: { marginRight: spacing.sm, borderRadius: borderRadius.sm },
    headerLocationDate: {},
    headerLocationText: { fontSize: font.sizes.xs, color: colors.textLight, fontWeight: font.weights.medium },
    headerDateText: { fontSize: font.sizes.xs, color: colors.textLight + 'aa' },
    headerLogo: { fontSize: font.sizes['3xl'], fontWeight: font.weights.bold, color: colors.textMainTitle, fontFamily: font.family, letterSpacing: 1, textAlign: 'center', marginHorizontal: spacing.md },
    headerJudgeInfo: { alignItems: 'flex-end', marginRight: spacing.sm },
    headerJudgeName: { fontSize: font.sizes.xs, color: colors.textLight, fontWeight: font.weights.medium },
    headerJudgeAvatar: { width: 32, height: 32, borderRadius: borderRadius.full, resizeMode: 'cover' },
    mainContent: { flex: 1, padding: spacing.lg },
    mainTitle: { fontSize: font.sizes['2xl'], fontWeight: font.weights.bold, color: colors.text, textAlign: 'center', marginBottom: spacing.lg },
    columnsContainer: { flexDirection: 'row', gap: spacing.lg },
    leftColumn: { flex: 1, gap: spacing.lg },
    rightColumn: { flex: 1, gap: spacing.lg },
    card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, ...shadows.small },
    columnTitle: { fontSize: font.sizes.xl, fontWeight: font.weights.semibold, color: colors.primary, marginBottom: spacing.md, textAlign: 'center' },

    // Style dla OptionSelector
    selectorContainer: { marginBottom: spacing.md },
    selectorLabel: { fontSize: font.sizes.sm, fontWeight: font.weights.medium, color: colors.textSecondary, marginBottom: spacing.xs },
    selectorScroll: { flexDirection: 'row' },
    selectorOption: {
        paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
        backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.full,
        marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border,
        flexDirection: 'row', alignItems: 'center',
    },
    selectorOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    selectorOptionText: { color: colors.text, fontWeight: font.weights.medium, fontSize: font.sizes.sm },
    selectorOptionTextActive: { color: colors.textLight },
    selectorLoading: { alignSelf: 'flex-start', marginLeft: spacing.md },
    selectorEmpty: { color: colors.textSecondary, fontStyle: 'italic', marginLeft: spacing.md },
    selectorOptionCompleted: {
        backgroundColor: colors.surfaceVariant + '99', opacity: 0.7, borderColor: colors.success + '80',
    },
    selectorOptionTextCompleted: {
        // color: colors.textSecondary,
    },
    selectorCompletedIcon: {
        marginLeft: spacing.xs,
    },

    // Style dla AthleteList
    athleteListContainer: { marginTop: spacing.md },
    subHeader: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.textSecondary, marginBottom: spacing.sm },
    emptyText: { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.md },
    athleteScroll: { maxHeight: 200, borderWidth: 1, borderColor: colors.borderLight, borderRadius: borderRadius.md },
    athleteListItem: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight, backgroundColor: colors.surface },
    athleteListItemActive: { backgroundColor: colors.primary + '20', borderLeftWidth: 4, borderLeftColor: colors.primary, paddingLeft: spacing.md - 4 },
    athleteListText: { fontSize: font.sizes.sm, color: colors.text, flex: 1, marginRight: spacing.sm },
    athleteListAttempt1: { fontSize: font.sizes.xs, color: colors.textSecondary },
    athleteListItemCompleted: { backgroundColor: colors.surfaceVariant + '99', opacity: 0.7 },
    athleteListItemContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 },
    athleteListTextCompleted: { /* Opcjonalne style */ },
    completedIcon: { marginLeft: spacing.sm }, // Dodano margines dla ikony ukończenia w liście

    // Style dla CurrentAthleteManager
    currentAthleteContainer: { alignItems: 'center' },
    currentAthleteName: { fontSize: font.sizes.lg, fontWeight: font.weights.bold, color: colors.primary, marginBottom: spacing.xs },
    currentAthleteClub: { fontSize: font.sizes.sm, color: colors.textSecondary, marginBottom: spacing.md },
    attemptsContainer: { width: '100%', gap: spacing.sm },
    attemptBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, padding: spacing.sm, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border },
    attemptBoxActive: { borderColor: colors.primary, borderWidth: 2 },
    attemptLabel: { fontSize: font.sizes.sm, color: colors.textSecondary, width: '25%' },
    attemptWeight: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.text, width: '20%', textAlign: 'center' },
    attemptWeightInput: { fontSize: font.sizes.md, fontWeight: font.weights.semibold, color: colors.text, width: '20%', textAlign: 'center', borderBottomWidth: 1, borderColor: colors.primary, paddingVertical: Platform.OS === 'ios' ? spacing.xs : 0 },
    attemptStatusIcon: { width: '15%', alignItems: 'center' },
    attemptActions: { flexDirection: 'row', gap: spacing.xs, width: '40%', justifyContent: 'flex-end' },
    actionButton: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center', minWidth: 60 },
    actionButtonDisabled: { backgroundColor: colors.border, opacity: 0.7 },
    passButton: { backgroundColor: colors.success },
    failButton: { backgroundColor: colors.error },
    actionButtonText: { color: colors.textLight, fontSize: font.sizes.xs, fontWeight: font.weights.medium },

    // Style dla Timera i Zarządzania
    timerContainer: { alignItems: 'center', marginBottom: spacing.lg },
    timerText: { fontSize: font.sizes['5xl'], fontWeight: font.weights.bold, color: colors.primary },
    timerWarning: { color: colors.warning },
    timerFinished: { color: colors.error },
    currentStatusInfo: { alignItems: 'center', marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md },
    currentStatusLabel: { fontSize: font.sizes.sm, color: colors.textSecondary, marginBottom: spacing.xs },
    currentStatusText: { fontSize: font.sizes.md, color: colors.text, textAlign: 'center' },
    mainActionButtons: { gap: spacing.md, alignItems: 'stretch' },
    mainActionButton: { paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    startButton: { backgroundColor: colors.primary },
    stopButton: { backgroundColor: colors.warning },
    mainActionButtonText: { color: colors.textLight, fontSize: font.sizes.md, fontWeight: font.weights.semibold },
});