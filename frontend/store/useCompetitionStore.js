import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

let storageMechanism;

if (Platform.OS === 'web') {
  storageMechanism = {
    getItem: async (name) => localStorage.getItem(name),
    setItem: async (name, value) => localStorage.setItem(name, value),
    removeItem: async (name) => localStorage.removeItem(name),
  };
} else {
  storageMechanism = AsyncStorage;
}

// A simple deep equality check using JSON.stringify.
// Note: This has limitations (e.g., order of keys in objects, undefined values, functions).
// For more robust deep equality, consider a library like lodash.isEqual.
const simpleDeepEqual = (obj1, obj2) => {
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2;
  }
  // Fallback for complex objects or when order might matter and for a quick check.
  // Be cautious with this method for complex scenarios.
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch (e) {
    return false; // If stringify fails (e.g. circular structures, though not expected here)
  }
};

const useCompetitionStore = create(
  persist(
    (set, get) => ({
      zawody: {
        nazwa: 'Ławka Cup',
        miejsce: '',
        data: new Date().toISOString().slice(0, 10),
        sedzia: { imie: '', nazwisko: '', avatar: null },
        klubAvatar: null,
      },
      kategorie: [],
      zawodnicy: [],
      activeCategory: null,
      activeWeight: null,
      activeAthleteOriginalIndex: null,
      activeAttemptNr: 1,
      currentRound: 1,
      timerActive: false,
      timerTimeLeft: 60,
      socket: null,
      attemptResultForAnimation: null,

      setInitialData: (data) => {
        console.log('[Store] setInitialData triggered. Context:', Platform.OS, 'Incoming data keys:', Object.keys(data).join(', '));
        // Logowanie specyficznych pól, które są problematyczne
        console.log('[Store] Incoming data for animation/timer:', JSON.stringify({
          timerActive: data.timerActive,
          timerTimeLeft: data.timerTimeLeft,
          attemptResultForAnimation: data.attemptResultForAnimation,
          activeAthleteOriginalIndex: data.activeAthleteOriginalIndex
        }, null, 2));

        const currentState = get();
        console.log('[Store] Current state BEFORE update for animation/timer:', JSON.stringify({
          timerActive: currentState.timerActive,
          timerTimeLeft: currentState.timerTimeLeft,
          attemptResultForAnimation: currentState.attemptResultForAnimation,
          activeAthleteOriginalIndex: currentState.activeAthleteOriginalIndex
        }, null, 2));

        const updates = {};
        let changed = false;

        const addUpdate = (key, newValue, oldValue, isDeep = false) => {
          const comparisonFn = isDeep ? simpleDeepEqual : (a, b) => a === b;
          
          if (data.hasOwnProperty(key)) {
            if (!comparisonFn(oldValue, newValue)) {
              updates[key] = newValue;
              changed = true;
              console.log(`[Store] CHANGE DETECTED for key: "${key}". Old:`, JSON.stringify(oldValue), "New:", JSON.stringify(newValue));
            } else {
              if (['timerActive', 'timerTimeLeft', 'attemptResultForAnimation', 'activeAthleteOriginalIndex'].includes(key)) {
                console.log(`[Store] NO CHANGE by comparison for key: "${key}". Old:`, JSON.stringify(oldValue), "New:", JSON.stringify(newValue), "Equals:", comparisonFn(oldValue, newValue));
              }
            }
          }
        };

        // Core competition data
        addUpdate('zawody', data.zawody, currentState.zawody, true);
        addUpdate('kategorie', data.kategorie, currentState.kategorie, true);
        addUpdate('zawodnicy', data.zawodnicy, currentState.zawodnicy, true);
        
        // Active state
        addUpdate('activeCategory', data.activeCategory, currentState.activeCategory);
        addUpdate('activeWeight', data.activeWeight, currentState.activeWeight);
        addUpdate('activeAthleteOriginalIndex', data.activeAthleteOriginalIndex, currentState.activeAthleteOriginalIndex);
        addUpdate('activeAttemptNr', data.activeAttemptNr, currentState.activeAttemptNr);
        addUpdate('currentRound', data.currentRound, currentState.currentRound);
        
        // Timer state - CRITICAL for audience screen
        addUpdate('timerActive', data.timerActive, currentState.timerActive);
        addUpdate('timerTimeLeft', data.timerTimeLeft, currentState.timerTimeLeft);
        // Animation state - CRITICAL for audience screen
        addUpdate('attemptResultForAnimation', data.attemptResultForAnimation, currentState.attemptResultForAnimation, true);

        if (changed) {
          console.log('[Store] Applying changes. Keys being updated:', Object.keys(updates).join(', '));
          console.log('[Store] Full updates object:', JSON.stringify(updates, null, 2));
          set(state => ({ ...state, ...updates }), false, 'setInitialDataSelective');
        } else {
          console.log('[Store] No actual changes detected by comparison overall. Skipping update.');
        }
      },
      
      setSocket: (socketInstance) => set({ socket: socketInstance }, false, 'setSocket'),
      
      setZawody: (updatedZawodyData) => {
        set(state => ({
          zawody: { ...state.zawody, ...updatedZawodyData }
        }), false, 'setZawody');
      },

      addZawodnik: (nowyZawodnik) => {
        set(state => {
          const newAthleteData = {
            ...nowyZawodnik,
            originalIndex: uuidv4(),
            podejscie1: nowyZawodnik.podejscie1 || '',
            podejscie2: nowyZawodnik.podejscie2 || '',
            podejscie3: nowyZawodnik.podejscie3 || '',
            podejscie1Status: null,
            podejscie2Status: null,
            podejscie3Status: null,
            kategoria: nowyZawodnik.kategoria || state.activeCategory || '',
            waga: nowyZawodnik.waga || state.activeWeight || '',
          };
          return { zawodnicy: [...state.zawodnicy, newAthleteData] };
        }, false, 'addZawodnik');
      },
      updateZawodnik: (athleteUniqueId, updatedData) => {
        set(state => ({
          zawodnicy: state.zawodnicy.map(zawodnik =>
            zawodnik.originalIndex === athleteUniqueId
              ? { ...zawodnik, ...updatedData }
              : zawodnik
          )
        }), false, 'updateZawodnik');
      },
      removeZawodnik: (athleteUniqueIdToRemove) => {
        set(state => {
          const newZawodnicy = state.zawodnicy.filter(
            zawodnik => zawodnik.originalIndex !== athleteUniqueIdToRemove
          );
          let newActiveAthleteOriginalIndex = state.activeAthleteOriginalIndex;
          if (state.activeAthleteOriginalIndex === athleteUniqueIdToRemove) {
            newActiveAthleteOriginalIndex = null;
          }
          return {
            zawodnicy: newZawodnicy,
            activeAthleteOriginalIndex: newActiveAthleteOriginalIndex
          };
        }, false, 'removeZawodnik');
      },
      addKategoria: (nazwaKategorii) => {
        set(state => {
          if (state.kategorie.find(k => k.nazwa === nazwaKategorii)) {
            return state;
          }
          return {
            kategorie: [...state.kategorie, { nazwa: nazwaKategorii, wagi: [] }]
          };
        }, false, 'addKategoria');
      },
      removeKategoria: (nazwaKategorii) => {
        set(state => ({
          kategorie: state.kategorie.filter(k => k.nazwa !== nazwaKategorii),
          zawodnicy: state.zawodnicy.filter(z => z.kategoria !== nazwaKategorii),
          activeCategory: state.activeCategory === nazwaKategorii ? null : state.activeCategory,
          activeWeight: state.activeCategory === nazwaKategorii ? null : state.activeWeight,
        }), false, 'removeKategoria');
      },
      addWaga: (nazwaKategorii, waga) => {
        set(state => {
          const newKategorie = state.kategorie.map(k => {
            if (k.nazwa === nazwaKategorii) {
              if (k.wagi.includes(waga)) return k; 
              return { ...k, wagi: [...k.wagi, waga].sort((a, b) => parseFloat(a) - parseFloat(b)) };
            }
            return k;
          });
          return { kategorie: newKategorie };
        }, false, 'addWaga');
      },
      removeWaga: (nazwaKategorii, waga) => {
        set(state => {
          const newKategorie = state.kategorie.map(k => {
            if (k.nazwa === nazwaKategorii) {
              return { ...k, wagi: k.wagi.filter(w => w !== waga) };
            }
            return k;
          });
          return {
            kategorie: newKategorie,
            zawodnicy: state.zawodnicy.filter(z => !(z.kategoria === nazwaKategorii && z.waga === waga)),
            activeWeight: (state.activeCategory === nazwaKategorii && state.activeWeight === waga) ? null : state.activeWeight,
          };
        }, false, 'removeWaga');
      },
      updatePodejscieWaga: (athleteUniqueId, attemptNo, weight) => {
        set(state => ({
          zawodnicy: state.zawodnicy.map(zawodnik =>
            zawodnik.originalIndex === athleteUniqueId
              ? { ...zawodnik, [`podejscie${attemptNo}`]: weight }
              : zawodnik
          )
        }), false, 'updatePodejscieWaga');
      },
      updatePodejscieStatus: (athleteUniqueId, attemptNo, status) => {
        set(state => ({
          zawodnicy: state.zawodnicy.map(z =>
            z.originalIndex === athleteUniqueId
              ? { ...z, [`podejscie${attemptNo}Status`]: status }
              : z
          )
        }), false, 'updatePodejscieStatus');
      },
      setActiveGroup: (category, weight) => {
        console.log(`[Store] setActiveGroup: Category=${category}, Weight=${weight}`);
        set({
          activeCategory: category,
          activeWeight: weight,
          activeAthleteOriginalIndex: null,
          currentRound: 1, 
          activeAttemptNr: 1,
        }, false, 'setActiveGroup');
      },
      setActiveAthlete: (athleteOriginalIndex) => {
        console.log(`[Store] setActiveAthlete: ID=${athleteOriginalIndex}`);
        set(state => ({
          activeAthleteOriginalIndex: athleteOriginalIndex,
          activeAttemptNr: state.currentRound, 
        }), false, 'setActiveAthlete');
      },
      setCurrentRound: (round) => {
        console.log(`[Store] setCurrentRound: Round=${round}`);
        set({
          currentRound: round,
          activeAthleteOriginalIndex: null,
          activeAttemptNr: round,
        }, false, 'setCurrentRound');
      },
      setTimerActive: (isActive) => set({ timerActive: isActive }, false, 'setTimerActive'),
      setTimerTimeLeft: (timeLeft) => set({ timerTimeLeft: timeLeft }, false, 'setTimerTimeLeft'),
      
      setAttemptResultForAnimation: (result) => {
        console.log('[Store] setAttemptResultForAnimation called with:', result);
        set({ attemptResultForAnimation: result }, false, 'setAttemptResultForAnimation');
      },
      clearAttemptResultForAnimation: () => {
        console.log('[Store] clearAttemptResultForAnimation called.');
        set({ attemptResultForAnimation: null }, false, 'clearAttemptResultForAnimation');
      },
    }),
    {
      name: 'competition-storage',
      storage: createJSONStorage(() => storageMechanism),
      partialize: (state) => {
        const { socket, attemptResultForAnimation, ...rest } = state; // Do not persist socket
        // Also, do not persist attemptResultForAnimation as it's transient
        return rest;
      },
    }
  )
);

export default useCompetitionStore;