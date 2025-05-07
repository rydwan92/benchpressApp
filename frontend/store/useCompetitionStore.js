import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Helper do głębokiego porównywania, aby unikać niepotrzebnych re-renderów przy persist
const deepCompare = (objA, objB) => JSON.stringify(objA) === JSON.stringify(objB);

export const useCompetitionStore = create(devtools(persist((set, get) => ({
  // --- Stan Aplikacji ---
  zawody: {
    nazwa: 'Benchpress Cup 2025',
    miejsce: '',
    data: new Date().toISOString().slice(0, 10),
    sedzia: {
      imie: '',
      nazwisko: '',
      avatar: null,
    },
    klubAvatar: null,
  },
  kategorie: [],
  zawodnicy: [],

  // --- Stan Interfejsu Użytkownika (UI State) ---
  activeCategory: null,
  activeWeight: null,
  activeAthleteOriginalIndex: null, // Indeks w oryginalnej tablicy 'zawodnicy'
  activeAttemptNr: 1,
  timerActive: false,
  timerTimeLeft: 60, // Domyślny czas na podejście
  // --- START ZMIANY: Dodaj pole na instancję socketu ---
  socket: null, // Przechowa instancję socket.io
  // --- KONIEC ZMIANY ---

  // --- Akcje ---

  // Ustawienia ogólne zawodów
  setZawody: (zawody) => set(state => ({ zawody: { ...state.zawody, ...zawody } }), false, 'setZawody'),
  setSedzia: (sedzia) => set(state => ({ zawody: { ...state.zawody, sedzia: { ...state.zawody.sedzia, ...sedzia } } }), false, 'setSedzia'),
  setKlubAvatar: (avatar) => set(state => ({ zawody: { ...state.zawody, klubAvatar: avatar } }), false, 'setKlubAvatar'),

  // Zarządzanie kategoriami i wagami
  addKategoria: (nazwa) => set(state => ({
    kategorie: [...state.kategorie, { nazwa, wagi: [] }]
  }), false, 'addKategoria'),
  addWaga: (kategoriaNazwa, waga) => set(state => ({
    kategorie: state.kategorie.map(k =>
      k.nazwa === kategoriaNazwa ? { ...k, wagi: [...k.wagi, waga].sort((a, b) => Number(a) - Number(b)) } : k
    )
  }), false, 'addWaga'),
  removeKategoria: (nazwa) => set(state => ({
    kategorie: state.kategorie.filter(k => k.nazwa !== nazwa)
  }), false, 'removeKategoria'),
  removeWaga: (kategoriaNazwa, waga) => set(state => ({
    kategorie: state.kategorie.map(k =>
      k.nazwa === kategoriaNazwa
        ? { ...k, wagi: k.wagi.filter(w => w !== waga) }
        : k
    )
  }), false, 'removeWaga'),

  // Zarządzanie zawodnikami
  addZawodnik: (zawodnik) => set(state => ({
    zawodnicy: [
      ...state.zawodnicy,
      {
        ...zawodnik,
        podejscie1: zawodnik.podejscie1 || '',
        podejscie2: zawodnik.podejscie2 || '',
        podejscie3: zawodnik.podejscie3 || '',
        podejscie1Status: null,
        podejscie2Status: null,
        podejscie3Status: null,
      }
    ]
  }), false, 'addZawodnik'),
  removeZawodnik: (index) => set(state => ({
    zawodnicy: state.zawodnicy.filter((_, i) => i !== index)
  }), false, 'removeZawodnik'),
  updateZawodnik: (index, updatedData) => set(state => ({
    zawodnicy: state.zawodnicy.map((zawodnik, i) =>
      i === index ? { ...zawodnik, ...updatedData } : zawodnik
    )
  }), false, 'updateZawodnik'),

  // Zarządzanie podejściami
  updatePodejscieWaga: (zawodnikIndex, nrPodejscia, waga) => set(state => ({
    zawodnicy: state.zawodnicy.map((z, i) =>
      i === zawodnikIndex ? { ...z, [`podejscie${nrPodejscia}`]: waga } : z
    )
  }), false, 'updatePodejscieWaga'),
  updatePodejscieStatus: (zawodnikIndex, nrPodejscia, status) => set(state => ({
    zawodnicy: state.zawodnicy.map((z, i) =>
      i === zawodnikIndex ? { ...z, [`podejscie${nrPodejscia}Status`]: status } : z
    )
  }), false, 'updatePodejscieStatus'),

  // --- Inicjalizacja i Synchronizacja Danych ---
  setInitialData: (data) => {
    console.time('setInitialDataAction'); // <<< START POMIARU akcji
    console.log('[Store] setInitialData received:', data ? `Zawody: ${data.zawody?.nazwa}, Kat: ${data.kategorie?.length}, Zaw: ${data.zawodnicy?.length}, ActiveCat: ${data.activeCategory}, ActiveW: ${data.activeWeight}, ActiveIdx: ${data.activeAthleteOriginalIndex}, AttemptNr: ${data.activeAttemptNr}, Timer: ${data.timerActive}, TimeLeft: ${data.timerTimeLeft}` : 'null data');

    if (!data) {
        console.warn('[Store] setInitialData received null or undefined data. Skipping update.');
        console.timeEnd('setInitialDataAction'); // <<< KONIEC POMIARU (w razie błędu/braku danych)
        return;
    }

    // Logowanie wartości, które zostaną zastosowane
    console.log('[Store] Applying state:', {
        zawody: data.zawody !== undefined,
        kategorie: data.kategorie !== undefined,
        zawodnicy: data.zawodnicy !== undefined,
        activeCategory: data.activeCategory,
        activeWeight: data.activeWeight,
        activeAthleteOriginalIndex: data.activeAthleteOriginalIndex,
        activeAttemptNr: data.activeAttemptNr,
        timerActive: data.timerActive,
        timerTimeLeft: data.timerTimeLeft
    });

    // Użyj `set` do aktualizacji stanu.
    set({
      zawody: data.zawody !== undefined ? data.zawody : get().zawody,
      kategorie: data.kategorie !== undefined ? data.kategorie : get().kategorie,
      zawodnicy: data.zawodnicy !== undefined ? data.zawodnicy : get().zawodnicy,
      // Stan UI - zawsze bierz z przychodzących danych `data`, jeśli istnieją
      activeCategory: data.activeCategory !== undefined ? data.activeCategory : null,
      activeWeight: data.activeWeight !== undefined ? data.activeWeight : null,
      activeAthleteOriginalIndex: data.activeAthleteOriginalIndex !== undefined ? data.activeAthleteOriginalIndex : null,
      activeAttemptNr: data.activeAttemptNr !== undefined ? data.activeAttemptNr : 1,
      timerActive: data.timerActive !== undefined ? data.timerActive : false,
      timerTimeLeft: data.timerTimeLeft !== undefined ? data.timerTimeLeft : 60,
    }, false, 'setInitialData');

    // Logowanie stanu PO aktualizacji (opcjonalne)
    setTimeout(() => {
        const newState = get();
        console.log('[Store] State AFTER setInitialData:', `ActiveCat: ${newState.activeCategory}, ActiveW: ${newState.activeWeight}, ActiveIdx: ${newState.activeAthleteOriginalIndex}, AttemptNr: ${newState.activeAttemptNr}, Timer: ${newState.timerActive}, TimeLeft: ${newState.timerTimeLeft}`);
    }, 0);

    console.timeEnd('setInitialDataAction'); // <<< KONIEC POMIARU akcji
  },

  // --- Akcje dla Aktywnego Kontekstu Zawodów ---
  setActiveGroup: (category, weight) => set({
    activeCategory: category,
    activeWeight: weight,
    activeAthleteOriginalIndex: null, // Resetuj zawodnika przy zmianie grupy
    activeAttemptNr: 1,
    timerActive: false,
    timerTimeLeft: 60,
  }, false, 'setActiveGroup'),

  setActiveAthlete: (originalIndex) => {
    console.log(`[Store] setActiveAthlete called with originalIndex: ${originalIndex}`);
    set((state) => {
      const athlete = originalIndex !== null && state.zawodnicy ? state.zawodnicy[originalIndex] : null;
      let attemptNr = 1;
      if (athlete) {
        // Znajdź pierwsze nieocenione podejście
        if (athlete.podejscie1Status !== null) attemptNr = 2;
        if (athlete.podejscie2Status !== null) attemptNr = 3;
        // Jeśli wszystkie ocenione, można wrócić do 1 lub ustawić specjalny status
        if (athlete.podejscie3Status !== null) attemptNr = 1; // Lub np. 4, jeśli chcesz oznaczyć koniec
      }
      console.log(`[Store] Setting activeAthleteOriginalIndex: ${originalIndex}, activeAttemptNr: ${attemptNr}`);
      return {
        activeAthleteOriginalIndex: originalIndex,
        activeAttemptNr: attemptNr,
        timerActive: false, // Zawsze resetuj timer przy zmianie zawodnika
        timerTimeLeft: 60,
      };
    }, false, 'setActiveAthlete');
  },

  setActiveAttemptNr: (nr) => set({
    activeAttemptNr: nr,
    timerActive: false, // Resetuj timer przy ręcznej zmianie podejścia
    timerTimeLeft: 60,
  }, false, 'setActiveAttemptNr'),

  // Zarządzanie Timerem
  setTimerActive: (isActive) => {
    // --- DODAJ LOG PRZED ODCZYTEM ---
    console.log('[Store] setTimerActive - Reading state. Current timerTimeLeft type:', typeof get().timerTimeLeft, 'Value:', get().timerTimeLeft);
    // --- KONIEC LOGU ---
    const currentTime = get().timerTimeLeft;
    console.log(`[Store] setTimerActive called with isActive: ${isActive}, currentTime: ${currentTime}`);
    const isValidTime = typeof currentTime === 'number' && !isNaN(currentTime);
    let nextTimeLeft = currentTime;
    if (!isValidTime) {
        console.warn(`[Store] setTimerActive: currentTime (${currentTime}) is invalid. Resetting to 60.`);
        nextTimeLeft = 60;
    } else if (isActive && currentTime <= 0) {
        nextTimeLeft = 60;
    }
    set({
        timerActive: isActive,
        timerTimeLeft: nextTimeLeft
    }, false, 'setTimerActive');
  },

  setTimerTimeLeft: (timeOrFn) => {
    // --- START ZMIANY: Logowanie i Zabezpieczenie ---
    let finalTime;
    if (typeof timeOrFn === 'function') {
        const prevState = get().timerTimeLeft;
        // Upewnij się, że prevState jest liczbą przed wywołaniem funkcji
        const validPrevState = typeof prevState === 'number' && !isNaN(prevState) ? prevState : 60;
        console.log(`[Store] setTimerTimeLeft called with FUNCTION. Applying to prev state: ${validPrevState}`);
        try {
            finalTime = timeOrFn(validPrevState); // Wykonaj funkcję
            console.log(`[Store] setTimerTimeLeft - Function result: ${finalTime}`);
        } catch (e) {
            console.error("[Store] setTimerTimeLeft - Error executing time function:", e);
            finalTime = validPrevState; // W razie błędu, zachowaj poprzedni stan
        }
    } else {
        finalTime = timeOrFn; // Użyj wartości bezpośrednio
        console.log(`[Store] setTimerTimeLeft called with VALUE: ${finalTime}`);
    }

    // Dodatkowe sprawdzenie, czy wynik jest liczbą
    if (typeof finalTime !== 'number' || isNaN(finalTime)) {
        console.error(`[Store] setTimerTimeLeft - finalTime is NOT a valid number: ${finalTime}. Resetting to 60.`);
        finalTime = 60; // Resetuj do wartości domyślnej w razie problemu
    }

    set({ timerTimeLeft: finalTime }, false, 'setTimerTimeLeft');
    // --- KONIEC ZMIANY ---
  },

  // --- START ZMIANY: Dodaj akcję do ustawiania socketu ---
  setSocket: (socketInstance) => set({ socket: socketInstance }, false, 'setSocket'),
  // --- KONIEC ZMIANY ---

}), // Koniec definicji store'u: (set, get) => ({...})
{ // Początek obiektu opcji dla `persist`
  name: 'competition-storage', // Nazwa klucza w localStorage/AsyncStorage
  // Opcjonalnie: Określ, które części stanu mają być utrwalane
  // partialize: (state) => ({ zawody: state.zawody, kategorie: state.kategorie, zawodnicy: state.zawodnicy }),
  // Opcjonalnie: Użyj głębokiego porównania, aby unikać zapisu, jeśli obiekty się nie zmieniły
  // equality: deepCompare,
  // --- START ZMIANY: Wyklucz socket z persystencji ---
  partialize: (state) => {
    const { socket, ...rest } = state; // Wyklucz socket
    return rest; // Utrwalaj resztę stanu
  },
  // --- KONIEC ZMIANY ---
})));