import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Platform, Image, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import useCompetitionStore from '../store/useCompetitionStore';
import { saveAppData } from '../utils/api'; // Załóżmy, że syncData tego używa
import { styles } from '../styles/CompetitionStyles/CompetitionScreen.styles';
import { colors, spacing } from '../theme/theme'; // Dodano spacing

import NavBar from '../components/navigation/NavBar';
import OptionSelector from '../components/competition/OptionSelector';
import AthleteList from '../components/competition/AthleteList';
import CurrentAthleteManager from '../components/competition/CurrentAthleteManager';
import TimerDisplay from '../components/competition/TimerDisplay';
import AttemptResultAnimation from '../components/competition/AttemptResultAnimation';
import Footer from '../components/competition/FooterComp'; // Upewnij się, że import jest poprawny

// Helper functions (zakładam, że są zdefiniowane gdzieś lub poniżej)
const getAthleteDeclaredWeightForRound = (athlete, round) => {
    if (!athlete) return 0;
    const weightStr = athlete[`podejscie${round}`];
    return parseFloat(String(weightStr).replace(',', '.')) || 0;
};

const hasAthleteCompletedAttemptInRound = (athlete, round) => {
    if (!athlete) return false;
    return !!athlete[`podejscie${round}Status`];
};

const hasAthleteCompletedAllAttempts = (athlete) => {
    if (!athlete) return false;
    return !!(athlete.podejscie1Status && athlete.podejscie2Status && athlete.podejscie3Status);
};

const MAX_TIMER_SECONDS = 60;

// --- NOWE STAŁE CZASOWE ---
const ANIMATION_DURATION = 2000; // Czas trwania animacji na ekranie widowni
const TEMP_RESULTS_DISPLAY_DURATION = 5000; // Czas wyświetlania tymczasowych wyników

export default function CompetitionScreen() {
  const navigation = useNavigation();
  const {
    zawody, kategorie, zawodnicy,
    activeCategory, activeWeight, activeAthleteOriginalIndex, activeAttemptNr,
    currentRound, timerActive: storeTimerActive, timerTimeLeft: storeTimerTimeLeft,
    updatePodejscieStatus, updatePodejscieWaga,
    setActiveAthlete,
    setActiveGroup,
    setCurrentRound,
    setTimerActive: storeSetTimerActive,
    setTimerTimeLeft: storeSetTimerTimeLeft,
    socket,
    setAttemptResultForAnimation,
    // Dodaj clearAttemptResultForAnimation, jeśli będziemy go używać do czyszczenia po stronie sędziego
    // clearAttemptResultForAnimation 
  } = useCompetitionStore(state => ({
      zawody: state.zawody,
      kategorie: state.kategorie,
      zawodnicy: state.zawodnicy,
      activeCategory: state.activeCategory,
      activeWeight: state.activeWeight,
      activeAthleteOriginalIndex: state.activeAthleteOriginalIndex,
      activeAttemptNr: state.activeAttemptNr,
      currentRound: state.currentRound,
      timerActive: state.timerActive,
      timerTimeLeft: state.timerTimeLeft,
      updatePodejscieStatus: state.updatePodejscieStatus,
      updatePodejscieWaga: state.updatePodejscieWaga,
      setActiveAthlete: state.setActiveAthlete,
      setActiveGroup: state.setActiveGroup,
      setCurrentRound: state.setCurrentRound,
      setTimerActive: state.setTimerActive,
      setTimerTimeLeft: state.setTimerTimeLeft,
      socket: state.socket,
      setAttemptResultForAnimation: state.setAttemptResultForAnimation,
      // clearAttemptResultForAnimation: state.clearAttemptResultForAnimation,
  }));

  const timerActive = useCompetitionStore(state => state.timerActive);
  const timerTimeLeft = useCompetitionStore(state => state.timerTimeLeft);

  const [isSaving, setIsSaving] = useState(false);
  const [headerKlubAvatarDimensions, setHeaderKlubAvatarDimensions] = useState(null);
  const [headerJudgeAvatarDimensions, setHeaderJudgeAvatarDimensions] = useState(null);
  const timerIntervalRef = useRef(null);

  const [showAttemptAnimation, setShowAttemptAnimation] = useState(false); // Animacja na ekranie sędziego
  const [attemptAnimationSuccess, setAttemptAnimationSuccess] = useState(false);
  const animationTimeoutRef = useRef(null); // Timeout dla logiki po animacji na ekranie sędziego

  const [isResultsModalVisible, setIsResultsModalVisible] = useState(false);
  const [modalSelectedCategory, setModalSelectedCategory] = useState(null);
  const [modalSelectedWeight, setModalSelectedWeight] = useState(null);
  const ignoreNextAthleteSelectionRef = useRef(false);

  useEffect(() => {
    if (activeCategory) setModalSelectedCategory(activeCategory);
    else if (kategorie.length > 0) setModalSelectedCategory(kategorie[0].nazwa);
  }, [activeCategory, kategorie]);

  useEffect(() => {
    if (activeWeight) setModalSelectedWeight(activeWeight);
    else {
        const catObj = kategorie.find(k => k.nazwa === modalSelectedCategory);
        if (catObj && catObj.wagi && catObj.wagi.length > 0) {
            setModalSelectedWeight(catObj.wagi[0]);
        } else {
            setModalSelectedWeight(null);
        }
    }
  }, [activeWeight, modalSelectedCategory, kategorie]);


  const modalCategoryOptions = useMemo(() => kategorie.map(k => ({ label: k.nazwa, value: k.nazwa })), [kategorie]);
  
  const modalWeightOptions = useMemo(() => {
    if (!modalSelectedCategory) return [];
    const categoryObj = kategorie.find(k => k.nazwa === modalSelectedCategory);
    if (!categoryObj || !categoryObj.wagi) return [];
    return categoryObj.wagi.map(w => ({ label: String(w), value: w }));
  }, [kategorie, modalSelectedCategory]);

  const syncData = useCallback(async (dataToSync) => {
    if (isSaving && !dataToSync) return; // Prevent re-entry if already saving, unless specific data is passed
    setIsSaving(true);
    try {
      const currentState = useCompetitionStore.getState();
      let dataToSend = {
        zawody: currentState.zawody,
        kategorie: currentState.kategorie,
        zawodnicy: currentState.zawodnicy,
        activeCategory: currentState.activeCategory,
        activeWeight: currentState.activeWeight,
        activeAthleteOriginalIndex: currentState.activeAthleteOriginalIndex,
        activeAttemptNr: currentState.activeAttemptNr,
        currentRound: currentState.currentRound,
        // Timer state should ideally be managed by the server or only synced when explicitly changed by judge
        timerActive: currentState.timerActive,
        timerTimeLeft: currentState.timerTimeLeft,
      };
      if (dataToSync) {
        dataToSend = { ...dataToSend, ...dataToSync };
      }
      await saveAppData(dataToSend);
    } catch (error) {
      console.error('[CompetitionScreen] Błąd synchronizacji danych:', error);
      Alert.alert("Błąd", "Nie udało się zsynchronizować danych z serwerem.");
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, setIsSaving]); // Removed useCompetitionStore from dependencies as getState is used

  const handleShowResultsOnAthleteView = async () => {
    if (socket && socket.connected && modalSelectedCategory && modalSelectedWeight) {
      console.log(`[CompetitionScreen] Requesting to show results for ${modalSelectedCategory} - ${modalSelectedWeight}kg`);
      
      ignoreNextAthleteSelectionRef.current = true; 

      setActiveAthlete(null); // Clear active athlete on judge screen
      
      const currentGlobalRound = useCompetitionStore.getState().currentRound;
      const dataToSyncForResults = { 
        activeAthleteOriginalIndex: null, // No active athlete when showing full group results
        activeCategory: modalSelectedCategory,
        activeWeight: modalSelectedWeight,
        activeAttemptNr: currentGlobalRound // Keep current round context
      };
      
      await syncData(dataToSyncForResults); // Sync state for audience view context

      socket.emit('showCategoryResults', { // Event for AthleteViewScreen
        category: modalSelectedCategory,
        weightClass: modalSelectedWeight,
      });
      setIsResultsModalVisible(false);
    } else {
      Alert.alert("Błąd", "Nie można wysłać żądania. Sprawdź połączenie lub wybrane opcje.");
    }
  };
  
  const stableSetTimerTimeLeft = useCallback((value) => storeSetTimerTimeLeft(value), [storeSetTimerTimeLeft]);
  const stableSetTimerActive = useCallback((value) => storeSetTimerActive(value), [storeSetTimerActive]);

  const handleResetTimer = useCallback(async () => {
    if (isSaving || showAttemptAnimation) {
        Alert.alert("Uwaga", "Nie można zresetować timera podczas zapisu lub animacji.");
        return;
    }
    stableSetTimerActive(false);
    stableSetTimerTimeLeft(MAX_TIMER_SECONDS);
    if (socket && socket.connected) {
      // Pass athleteOriginalIndex for context on AthleteViewScreen
      socket.emit('timerReset', { 
          timeLeft: MAX_TIMER_SECONDS,
          athleteOriginalIndex: useCompetitionStore.getState().activeAthleteOriginalIndex 
      });
    }
    await syncData({ timerActive: false, timerTimeLeft: MAX_TIMER_SECONDS });
  }, [isSaving, showAttemptAnimation, stableSetTimerActive, stableSetTimerTimeLeft, socket, syncData]);

  const handleSelectAthlete = useCallback(async (selectedAthleteOriginalIndex) => {
    if (ignoreNextAthleteSelectionRef.current) {
      ignoreNextAthleteSelectionRef.current = false; 
      console.log('[CompetitionScreen] Ignoring first athlete selection after requesting results view.');
      return; 
    }
    ignoreNextAthleteSelectionRef.current = false;

    if (timerActive) {
      Alert.alert("Timer Aktywny", "Nie można zmienić zawodnika podczas aktywnego czasu.");
      return;
    }
    if (isSaving) return;
    
    setActiveAthlete(selectedAthleteOriginalIndex);
    // When selecting an athlete, set activeAttemptNr to currentRound
    // This ensures that if we navigate back/forth between athletes, the active attempt aligns with the round
    await syncData({ activeAthleteOriginalIndex: selectedAthleteOriginalIndex, activeAttemptNr: useCompetitionStore.getState().currentRound });
  }, [setActiveAthlete, syncData, timerActive, isSaving, currentRound]);

  const handleTimerFinish = useCallback(() => {
    stableSetTimerActive(false);
    stableSetTimerTimeLeft(0);
    if (socket && socket.connected) {
      socket.emit('stopTimer', { 
          finalTimeLeft: 0, 
          reason: 'timer_expired',
          athleteOriginalIndex: useCompetitionStore.getState().activeAthleteOriginalIndex 
      });
    }
    // Optionally sync this state
    // syncData({ timerActive: false, timerTimeLeft: 0 });
  }, [stableSetTimerActive, stableSetTimerTimeLeft, socket, syncData]);

  useEffect(() => {
    const currentActiveAthleteIndex = useCompetitionStore.getState().activeAthleteOriginalIndex;
    if (timerActive) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); // Clear existing before starting new
      timerIntervalRef.current = setInterval(() => {
        const newTime = useCompetitionStore.getState().timerTimeLeft - 1;
        stableSetTimerTimeLeft(newTime);
        if (socket && socket.connected) {
          socket.emit('timerTick', { 
            timeLeft: newTime, 
            athleteOriginalIndex: currentActiveAthleteIndex 
          });
        }
        if (newTime <= 0) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          handleTimerFinish();
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerActive, stableSetTimerTimeLeft, socket, handleTimerFinish]); // Removed stableSetTimerActive as it's not directly used in interval logic

  const athletesInCurrentGroup = useMemo(() => {
    if (!activeCategory || !activeWeight || !zawodnicy) return [];
    return zawodnicy
      .filter(z => z.kategoria === activeCategory && String(z.waga) === String(activeWeight));
  }, [zawodnicy, activeCategory, activeWeight]);

  const upcomingAthletesForCurrentRound = useMemo(() => {
    if (!activeCategory || !activeWeight || currentRound > 3) return [];
    return athletesInCurrentGroup
      .filter(athlete => !hasAthleteCompletedAttemptInRound(athlete, currentRound))
      .sort((a, b) => {
        const weightA = getAthleteDeclaredWeightForRound(a, currentRound);
        const weightB = getAthleteDeclaredWeightForRound(b, currentRound);
        if (weightA === weightB) {
            // Sort by originalIndex (lot number) if weights are equal
            const indexA = parseInt(String(a.nrStartowy || a.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
            const indexB = parseInt(String(b.nrStartowy || b.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
            return indexA - indexB;
        }
        return weightA - weightB;
      });
  }, [athletesInCurrentGroup, currentRound, activeCategory, activeWeight]);

  const currentAthlete = useMemo(() => {
    if (activeAthleteOriginalIndex === null || !zawodnicy || zawodnicy.length === 0) return null;
    return zawodnicy.find(z => z.originalIndex === activeAthleteOriginalIndex);
  }, [zawodnicy, activeAthleteOriginalIndex]);

  const handleNextCompetitor = useCallback(async () => {
    if (timerActive || isSaving || showAttemptAnimation) {
      // Alert.alert("Uwaga", "Nie można zmienić zawodnika podczas aktywnego timera, zapisu lub animacji.");
      console.warn("[CompetitionScreen] Next competitor blocked: timer/saving/animation active.");
      return;
    }
    if (!activeCategory || !activeWeight) {
      Alert.alert("Informacja", "Wybierz najpierw kategorię i wagę.");
      return;
    }
    const nextAthletesInCurrentList = upcomingAthletesForCurrentRound;
    if (nextAthletesInCurrentList.length > 0) {
      const nextAthleteToCall = nextAthletesInCurrentList[0];
      setActiveAthlete(nextAthleteToCall.originalIndex);
      // When moving to next competitor, activeAttemptNr should be the currentRound
      await syncData({ activeAthleteOriginalIndex: nextAthleteToCall.originalIndex, activeAttemptNr: currentRound });
      console.log(`[CompetitionScreen] Advanced to next competitor: ${nextAthleteToCall.imie}, Round: ${currentRound}`);
    } else {
      Alert.alert("Informacja", "Brak kolejnych zawodników w tej rundzie dla wybranej grupy.");
      // Optionally, clear active athlete if no one is next in this round
      // setActiveAthlete(null);
      // await syncData({ activeAthleteOriginalIndex: null });
    }
  }, [currentRound, timerActive, isSaving, showAttemptAnimation, upcomingAthletesForCurrentRound, setActiveAthlete, syncData, activeCategory, activeWeight]);

  const displayAthletesInGroup = useMemo(() => {
    if (!athletesInCurrentGroup) return [];
    return [...athletesInCurrentGroup].sort((a, b) => {
        const weightA = getAthleteDeclaredWeightForRound(a, currentRound);
        const weightB = getAthleteDeclaredWeightForRound(b, currentRound);
        if (weightA === weightB) {
            const indexA = parseInt(String(a.nrStartowy || a.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
            const indexB = parseInt(String(b.nrStartowy || b.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
            return indexA - indexB;
        }
        return weightA - weightB;
    });
  }, [athletesInCurrentGroup, currentRound]);

  const handlePreviousCompetitor = useCallback(async () => {
    if (timerActive || isSaving || showAttemptAnimation) {
        Alert.alert("Uwaga", "Nie można zmienić zawodnika podczas aktywnego timera, zapisu lub animacji.");
        return;
    }
    if (!activeCategory || !activeWeight || !currentAthlete) {
        Alert.alert("Informacja", "Brak aktywnego zawodnika lub grupy do nawigacji wstecz.");
        return;
    }

    const currentIndexInGroup = displayAthletesInGroup.findIndex(a => a.originalIndex === activeAthleteOriginalIndex);
    if (currentIndexInGroup > 0) {
        const previousAthlete = displayAthletesInGroup[currentIndexInGroup - 1];
        setActiveAthlete(previousAthlete.originalIndex);
        await syncData({ activeAthleteOriginalIndex: previousAthlete.originalIndex, activeAttemptNr: currentRound });
    } else {
        Alert.alert("Informacja", "To jest pierwszy zawodnik w tej grupie.");
    }
  }, [timerActive, isSaving, showAttemptAnimation, activeCategory, activeWeight, currentAthlete, displayAthletesInGroup, setActiveAthlete, syncData, currentRound, activeAthleteOriginalIndex]);


  const handlePreviousRound = useCallback(async () => {
    if (isSaving || timerActive || showAttemptAnimation) return;
    if (currentRound > 1) {
      const prevRound = currentRound - 1;
      setCurrentRound(prevRound);
      setActiveAthlete(null); // Clear active athlete when changing rounds
      await syncData({ currentRound: prevRound, activeAthleteOriginalIndex: null, activeAttemptNr: prevRound });
    } else {
      Alert.alert("Informacja", "Jesteś już na pierwszej rundzie.");
    }
  }, [currentRound, setCurrentRound, syncData, isSaving, timerActive, showAttemptAnimation, setActiveAthlete]);

  const handleNextRound = useCallback(async () => {
    if (isSaving || timerActive || showAttemptAnimation) return;
    if (currentRound < 3) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setActiveAthlete(null); // Clear active athlete when changing rounds
      await syncData({ currentRound: nextRound, activeAthleteOriginalIndex: null, activeAttemptNr: nextRound });
    } else {
      Alert.alert("Informacja", "Jesteś już na ostatniej, trzeciej rundzie.");
    }
  }, [currentRound, setCurrentRound, syncData, isSaving, timerActive, showAttemptAnimation, setActiveAthlete]);

  useEffect(() => {
    // Auto-select first competitor if none is active and there are upcoming athletes
    if (activeAthleteOriginalIndex === null && upcomingAthletesForCurrentRound.length > 0 && !timerActive && !showAttemptAnimation && activeCategory && activeWeight && !ignoreNextAthleteSelectionRef.current) {
      handleNextCompetitor();
    }
  }, [activeAthleteOriginalIndex, upcomingAthletesForCurrentRound, timerActive, showAttemptAnimation, activeCategory, activeWeight, handleNextCompetitor]);

  const handleAttemptStatusChange = useCallback(async (athleteOriginalIndex, attemptNo, status) => {
    if (isSaving) return;
    setIsSaving(true);
    setShowAttemptAnimation(true); // For judge's screen animation
    setAttemptAnimationSuccess(status === 'passed');

    updatePodejscieStatus(athleteOriginalIndex, attemptNo, status);
    // Sync data immediately after status update for responsiveness
    await syncData({ /* Consider what specific part of state needs sync here if not all */ });

    const athleteForAnimation = zawodnicy.find(z => z.originalIndex === athleteOriginalIndex);
    const animationData = {
        success: status === 'passed',
        athleteOriginalIndex: athleteOriginalIndex,
        attemptNo: attemptNo,
        category: athleteForAnimation?.kategoria || activeCategory, // Pass current category
        weightClass: athleteForAnimation?.waga || activeWeight    // Pass current weight class
    };

    if (socket && socket.connected) {
      socket.emit('attemptAnimationTriggered', animationData);
    }
    setAttemptResultForAnimation(animationData); // Set in global store for AthleteViewScreen

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Total delay before moving to next competitor: Audience Animation + Audience Results Display
    const totalDelayForNextCompetitor = ANIMATION_DURATION + TEMP_RESULTS_DISPLAY_DURATION;

    animationTimeoutRef.current = setTimeout(async () => {
      setShowAttemptAnimation(false); // Hide judge's screen animation

      const currentStoreState = useCompetitionStore.getState();
      const currentStoreActiveAthleteOriginalIndex = currentStoreState.activeAthleteOriginalIndex;
      const currentStoreActiveAttemptNr = currentStoreState.activeAttemptNr;

      // Automatyczne przejście do następnego tylko jeśli to było aktywne podejście
      if (status === 'passed' || status === 'failed') {
        if (athleteOriginalIndex === currentStoreActiveAthleteOriginalIndex && attemptNo === currentStoreActiveAttemptNr) {
            console.log(`[CompetitionScreen] Attempt processed. Advancing to next competitor after ${totalDelayForNextCompetitor}ms delay.`);
            await handleNextCompetitor();
        }
      }
      setIsSaving(false);
      // Optionally clear attemptResultForAnimation from store here if CompetitionScreen "owns" it
      // useCompetitionStore.getState().clearAttemptResultForAnimation();
    }, totalDelayForNextCompetitor);

    if (socket && socket.connected) {
      // This event is for general data sync, not animation trigger
      socket.emit('attemptUpdated', { athleteOriginalIndex, attemptNo, status });
    }
  }, [isSaving, zawodnicy, activeCategory, activeWeight, updatePodejscieStatus, syncData, socket, setAttemptResultForAnimation, handleNextCompetitor, setShowAttemptAnimation, setAttemptAnimationSuccess, animationTimeoutRef]);

  const handleWeightChange = useCallback(async (athleteOriginalIndex, attemptNo, weight) => {
    if (isSaving) return;
    // No setIsSaving(true) here, as it's a quick update, unless you want to show a loader
    updatePodejscieWaga(athleteOriginalIndex, attemptNo, weight);
    await syncData({ /* specific data if needed */ }); // Sync after weight change
    if (socket && socket.connected) {
      socket.emit('attemptWeightUpdated', { athleteOriginalIndex, attemptNo, weight });
    }
  }, [isSaving, updatePodejscieWaga, syncData, socket]);

  const handleStartOrRestartAttempt = useCallback(async () => {
    const currentStoreState = useCompetitionStore.getState();
    const currentStoreAthleteOriginalIndex = currentStoreState.activeAthleteOriginalIndex;
    const currentStoreActiveAttemptNr = currentStoreState.activeAttemptNr;
    const currentStoreCurrentRound = currentStoreState.currentRound;
    const currentStoreTimerTimeLeft = currentStoreState.timerTimeLeft;

    if (!currentStoreAthleteOriginalIndex) {
        Alert.alert("Błąd", "Nie wybrano aktywnego zawodnika.");
        return;
    }
    if (currentStoreActiveAttemptNr !== currentStoreCurrentRound) {
      Alert.alert("Uwaga", `Próbujesz uruchomić timer dla podejścia ${currentStoreActiveAttemptNr}, ale aktualna runda to ${currentStoreCurrentRound}. Zmień rundę lub zawodnika.`);
      return;
    }

    let timeToStartFrom = MAX_TIMER_SECONDS;
    let isResuming = false;

    if (currentStoreTimerTimeLeft > 0 && currentStoreTimerTimeLeft < MAX_TIMER_SECONDS) {
      timeToStartFrom = currentStoreTimerTimeLeft;
      isResuming = true;
    }

    stableSetTimerTimeLeft(timeToStartFrom);
    stableSetTimerActive(true);

    if (socket && socket.connected) {
      socket.emit('startTimer', {
        timeLeft: timeToStartFrom,
        athleteOriginalIndex: currentStoreAthleteOriginalIndex, // Zmieniono z athleteId
        attemptNr: currentStoreActiveAttemptNr,
        isResuming: isResuming
      });
    }
    await syncData({ timerActive: true, timerTimeLeft: timeToStartFrom }); // Sync timer state
  }, [stableSetTimerActive, stableSetTimerTimeLeft, socket, syncData]);

  const handleSelectCategory = useCallback(async (category) => {
    ignoreNextAthleteSelectionRef.current = false;
    setActiveGroup(category, null);
    await syncData({ activeCategory: category, activeWeight: null, activeAthleteOriginalIndex: null, currentRound: 1, activeAttemptNr: 1 });
  }, [setActiveGroup, syncData]);

  const handleSelectWeight = useCallback(async (weight) => {
    if (!activeCategory) {
      Alert.alert("Błąd", "Najpierw wybierz kategorię.");
      return;
    }
    ignoreNextAthleteSelectionRef.current = false;
    setActiveGroup(activeCategory, weight);
    await syncData({ activeWeight: weight, activeAthleteOriginalIndex: null, currentRound: 1, activeAttemptNr: 1 });
  }, [activeCategory, setActiveGroup, syncData]);

  const categoryOptions = useMemo(() => kategorie.map(k => ({ label: k.nazwa, value: k.nazwa })), [kategorie]);
  const activeCategoryObject = useMemo(() => kategorie.find(k => k.nazwa === activeCategory), [kategorie, activeCategory]);

  const completedWeights = useMemo(() => {
    const completed = new Set();
    if (!activeCategoryObject || !zawodnicy) return completed;
    activeCategoryObject.wagi.forEach(waga => {
        const athletesInGroup = zawodnicy.filter(z => z.kategoria === activeCategory && String(z.waga) === String(waga));
        if (athletesInGroup.length > 0 && athletesInGroup.every(hasAthleteCompletedAllAttempts)) completed.add(waga);
    });
    return completed;
  }, [activeCategoryObject, zawodnicy, activeCategory]);

  const weightOptions = useMemo(() => {
    if (!activeCategoryObject) return [];
    return [...activeCategoryObject.wagi].sort((a, b) => Number(a) - Number(b)).map(w => ({
        label: String(w), value: w, isCompleted: completedWeights.has(w)
    }));
  }, [activeCategoryObject, completedWeights]);

  const totalLiftedInCategory = useMemo(() => {
    if (!activeCategory || !activeWeight) return 0;
    return athletesInCurrentGroup.reduce((sum, athlete) => {
        let athleteSum = 0;
        for (let i = 1; i <= 3; i++) {
            if (athlete[`podejscie${i}Status`] === 'passed') {
                athleteSum += getAthleteDeclaredWeightForRound(athlete, i);
            }
        }
        return sum + athleteSum;
    }, 0);
  }, [athletesInCurrentGroup, activeCategory, activeWeight]);

  useEffect(() => {
    if (zawody.klubAvatar) {
      Image.getSize(zawody.klubAvatar, (width, height) => {
        const aspectRatio = width / height;
        const targetSize = Platform.OS === 'web' ? 50 : 40;
        setHeaderKlubAvatarDimensions({ width: targetSize, height: targetSize / aspectRatio });
      }, (error) => {
        console.error("Error getting klubAvatar size:", error);
        setHeaderKlubAvatarDimensions(null);
      });
    } else setHeaderKlubAvatarDimensions(null);
  }, [zawody.klubAvatar]);

  useEffect(() => {
    if (zawody.sedzia?.avatar) {
      Image.getSize(zawody.sedzia.avatar, (width, height) => {
        const aspectRatio = width / height;
        const targetSize = Platform.OS === 'web' ? 50 : 40;
        setHeaderJudgeAvatarDimensions({ width: targetSize, height: targetSize / aspectRatio });
      }, (error) => {
        console.error("Error getting judgeAvatar size:", error);
        setHeaderJudgeAvatarDimensions(null);
      });
    } else setHeaderJudgeAvatarDimensions(null);
  }, [zawody.sedzia?.avatar]);


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.end]}
        style={styles.headerBackground}
      >
        <View style={styles.headerBar}>
            <View style={[styles.headerSideContainer, styles.headerLeftAlign]}>
                {headerKlubAvatarDimensions && zawody.klubAvatar ? (
                    <Image source={{ uri: zawody.klubAvatar }} style={[styles.headerClubLogo, headerKlubAvatarDimensions]} resizeMode="contain" />
                ) : <View style={styles.headerAvatarPlaceholder} />}
                <View style={styles.headerLocationDate}>
                    <Text style={styles.headerLocationText} numberOfLines={1}>{zawody.miejsce || 'Lokalizacja'}</Text>
                    <Text style={styles.headerDateText}>{zawody.data || 'Data'}</Text>
                </View>
            </View>
            <Text style={styles.headerLogo}>{zawody.nazwa || 'Nazwa Zawodów'}</Text>
            <View style={[styles.headerSideContainer, styles.headerRightAlign]}>
                <View style={styles.headerJudgeInfo}>
                    <Text style={styles.headerJudgeName} numberOfLines={1}>{zawody.sedzia?.imie || 'Sędzia'} {zawody.sedzia?.nazwisko || ''}</Text>
                </View>
                {headerJudgeAvatarDimensions && zawody.sedzia?.avatar ? (
                    <Image source={{ uri: zawody.sedzia.avatar }} style={[styles.headerJudgeAvatar, headerJudgeAvatarDimensions]} resizeMode="contain" />
                ) : <View style={styles.headerAvatarPlaceholder} />}
            </View>
        </View>
        <NavBar navigation={navigation} />
      </LinearGradient>

      <ScrollView style={styles.contentContainerScrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainContent}>
          <View style={styles.columnsContainer}>
            <View style={styles.leftColumn}>
              {/* Karta Wybór grupy */}
              <View style={[styles.card, styles.groupSelectorCard]}>
                <Text style={styles.columnTitle}>Wybór grupy</Text>
                <View style={styles.optionSelectorContainerInColumn}>
                  <OptionSelector
                    label="Kategoria"
                    options={categoryOptions}
                    selectedValue={activeCategory}
                    onSelect={handleSelectCategory}
                    // placeholder="Wszystkie kategorie" // Placeholder usunięty z OptionSelector
                    loading={isSaving}
                    disabled={isSaving || timerActive || showAttemptAnimation}
                  />
                </View>
                <View style={styles.optionSelectorContainerInColumn}>
                  <OptionSelector
                    label="Waga"
                    options={weightOptions}
                    selectedValue={activeWeight}
                    onSelect={handleSelectWeight}
                    // placeholder="Wszystkie wagi" // Placeholder usunięty
                    loading={isSaving || !activeCategory}
                    disabled={!activeCategory || isSaving || timerActive || showAttemptAnimation}
                  />
                </View>
              </View>
              {/* Karta Lista Zawodników */}
              <View style={[styles.card, styles.athleteListCard]}>
                <Text style={styles.columnTitle}>Lista Zawodników</Text>
                {(isSaving && !showAttemptAnimation) && <ActivityIndicator size="small" color={colors.primary} style={{marginBottom: spacing.sm}} />}
                <View style={styles.athleteListContainerInColumn}>
                  <AthleteList
                      athletes={displayAthletesInGroup}
                      currentAthleteOriginalIndex={activeAthleteOriginalIndex}
                      currentRound={currentRound}
                      onSelectAthlete={handleSelectAthlete}
                      onAttemptStatusChange={handleAttemptStatusChange} // Przekazujemy do AthleteList
                      onWeightChange={handleWeightChange} // Przekazujemy do AthleteList
                      isSaving={isSaving || showAttemptAnimation} // Blokowanie edycji w AthleteList
                      athletesInGroupCount={athletesInCurrentGroup.length}
                      upcomingAthletesInRoundCount={upcomingAthletesForCurrentRound.length}
                  />
                </View>
              </View>
            </View>
            {/* Panel Sędziego */}
            <View style={styles.rightColumn}>
              <View style={styles.judgePanelCard}>
                <Text style={styles.judgePanelTitle}>Panel Sędziego</Text>
                <View style={styles.judgePanelContent}>
                    <View style={styles.currentAthleteManagerWrapper}>
                        <CurrentAthleteManager
                            athlete={currentAthlete}
                            athleteOriginalIndex={activeAthleteOriginalIndex}
                            currentAttemptNr={activeAttemptNr} // Przekazujemy aktualny numer podejścia ze store
                            onAttemptStatusChange={handleAttemptStatusChange}
                            onWeightChange={handleWeightChange}
                            isSaving={isSaving || showAttemptAnimation}
                            currentRoundForDisplay={currentRound} // Przekazujemy aktualną rundę do wyświetlenia
                        />
                    </View>
                    {currentAthlete && (
                        <View style={styles.timerSection}>
                            <TimerDisplay isActive={timerActive} timeLeft={timerTimeLeft} />
                        </View>
                    )}
                    <View style={styles.judgeButtonGroupsContainer}>
                        {/* Grupa przycisków Timera */}
                        <View style={styles.judgeButtonGroup}>
                            <Text style={styles.judgeSectionTitle}>Timer</Text>
                            <View style={styles.judgeButtonRow}>
                                {timerActive ? (
                                    <TouchableOpacity
                                        style={[styles.mainActionButton, styles.stopButton, (isSaving || showAttemptAnimation) && styles.actionButtonDisabled, {flex:1}]}
                                        onPress={() => {
                                            stableSetTimerActive(false);
                                            if (socket && socket.connected) {
                                                socket.emit('stopTimer', { 
                                                    finalTimeLeft: useCompetitionStore.getState().timerTimeLeft, 
                                                    reason: 'manual_stop',
                                                    athleteOriginalIndex: useCompetitionStore.getState().activeAthleteOriginalIndex
                                                });
                                            }
                                            syncData({timerActive: false});
                                        }}
                                        disabled={isSaving || showAttemptAnimation}
                                    >
                                        <AntDesign name="pausecircleo" size={20} color={colors.textLight} style={{marginRight: spacing.sm}}/>
                                        <Text style={styles.mainActionButtonText}>Stop</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.mainActionButton, styles.startButton, (!currentAthlete || isSaving || showAttemptAnimation) && styles.actionButtonDisabled, {flex:1}]}
                                        onPress={handleStartOrRestartAttempt}
                                        disabled={!currentAthlete || isSaving || showAttemptAnimation}
                                    >
                                        <AntDesign name="playcircleo" size={20} color={colors.textLight} style={{marginRight: spacing.sm}}/>
                                        <Text style={styles.mainActionButtonText}>Start</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[styles.secondaryActionButton, (isSaving || showAttemptAnimation) && styles.actionButtonDisabled]}
                                    onPress={handleResetTimer}
                                    disabled={isSaving || showAttemptAnimation}
                                >
                                    <MaterialCommunityIcons name="backup-restore" size={20} color={colors.textOnSecondary}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Grupa przycisków Nawigacji Zawodników */}
                        <View style={styles.judgeButtonGroup}>
                            <Text style={styles.judgeSectionTitle}>Nawigacja Zawodników</Text>
                            <View style={styles.judgeButtonRow}>
                                <TouchableOpacity
                                    style={[styles.secondaryActionButton, (!activeCategory || !activeWeight || !currentAthlete || displayAthletesInGroup.findIndex(a => a.originalIndex === activeAthleteOriginalIndex) === 0 || isSaving || timerActive || showAttemptAnimation) && styles.actionButtonDisabled, {flex:1}]}
                                    onPress={handlePreviousCompetitor}
                                    disabled={!activeCategory || !activeWeight || !currentAthlete || displayAthletesInGroup.findIndex(a => a.originalIndex === activeAthleteOriginalIndex) === 0 || isSaving || timerActive || showAttemptAnimation}
                                >
                                    <AntDesign name="left" size={16} color={colors.textOnSecondary} style={{marginRight: spacing.xs}}/>
                                    <Text style={styles.secondaryActionButtonText}>Poprzedni</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.secondaryActionButton, (!activeCategory || !activeWeight || upcomingAthletesForCurrentRound.length === 0 || isSaving || timerActive || showAttemptAnimation) && styles.actionButtonDisabled, {flex:1}]}
                                    onPress={handleNextCompetitor}
                                    disabled={!activeCategory || !activeWeight || upcomingAthletesForCurrentRound.length === 0 || isSaving || timerActive || showAttemptAnimation}
                                >
                                    <Text style={styles.secondaryActionButtonText}>Następny</Text>
                                    <AntDesign name="right" size={16} color={colors.textOnSecondary} style={{marginLeft: spacing.xs}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Grupa przycisków Nawigacji Rund */}
                        <View style={styles.judgeButtonGroup}>
                            <Text style={styles.judgeSectionTitle}>Nawigacja Rund</Text>
                            <View style={styles.judgeButtonRow}>
                                <TouchableOpacity
                                    style={[styles.secondaryActionButton, (currentRound === 1 || isSaving || timerActive || showAttemptAnimation) && styles.actionButtonDisabled, {flex:1}]}
                                    onPress={handlePreviousRound}
                                    disabled={currentRound === 1 || isSaving || timerActive || showAttemptAnimation}
                                >
                                    <AntDesign name="doubleleft" size={16} color={colors.textOnSecondary} style={{marginRight: spacing.xs}}/>
                                    <Text style={styles.secondaryActionButtonText}>Poprz. Runda</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.secondaryActionButton, (currentRound === 3 || isSaving || timerActive || showAttemptAnimation) && styles.actionButtonDisabled, {flex:1}]}
                                    onPress={handleNextRound}
                                    disabled={currentRound === 3 || isSaving || timerActive || showAttemptAnimation}
                                >
                                    <Text style={styles.secondaryActionButtonText}>Nast. Runda</Text>
                                    <AntDesign name="doubleright" size={16} color={colors.textOnSecondary} style={{marginLeft: spacing.xs}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* NOWA GRUPA: Sterowanie Widownią */}
                        <View style={styles.judgeButtonGroup}>
                            <Text style={styles.judgeSectionTitle}>Sterowanie Widownią</Text>
                            <TouchableOpacity
                                style={[styles.secondaryActionButton, {backgroundColor: colors.info, width: '100%'}]}
                                onPress={() => {
                                    setIsResultsModalVisible(true);
                                }}
                                disabled={isSaving || timerActive || showAttemptAnimation}
                            >
                                <MaterialCommunityIcons name="poll" size={18} color={colors.textLight} style={{marginRight: spacing.sm}}/>
                                <Text style={[styles.secondaryActionButtonText, {color: colors.textLight}]}>Pokaż Wyniki Końcowe</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer
        competitionLocation={zawody.miejsce}
        registeredAthletesCount={zawodnicy.length}
        totalWeightInCategory={totalLiftedInCategory}
      />

      {showAttemptAnimation && ( // Animacja na ekranie sędziego
        <View style={styles.animationOverlayContainer}>
            <AttemptResultAnimation success={attemptAnimationSuccess} />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isResultsModalVisible}
        onRequestClose={() => setIsResultsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pokaż Wyniki na Ekranie Widowni</Text>
            <OptionSelector
              label="Wybierz Kategorię"
              options={modalCategoryOptions}
              selectedValue={modalSelectedCategory}
              onSelect={(val) => {
                setModalSelectedCategory(val);
                const catObj = kategorie.find(k => k.nazwa === val);
                setModalSelectedWeight(catObj && catObj.wagi.length > 0 ? catObj.wagi[0] : null);
              }}
              disabled={isSaving}
            />
            {modalSelectedCategory && (
              <OptionSelector
                label="Wybierz Wagę"
                options={modalWeightOptions}
                selectedValue={modalSelectedWeight}
                onSelect={setModalSelectedWeight}
                disabled={!modalSelectedCategory || modalWeightOptions.length === 0 || isSaving}
              />
            )}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsResultsModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm, (!modalSelectedCategory || !modalSelectedWeight) && styles.actionButtonDisabled]}
                onPress={handleShowResultsOnAthleteView}
                disabled={!modalSelectedCategory || !modalSelectedWeight || isSaving}
              >
                <Text style={styles.modalButtonText}>Pokaż</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
