// filepath: c:\Users\Michał\Desktop\benchpress-competition-app\backend\stateManager.js
import { readData, writeData } from './utils/fileHandler.js';

let currentAppState = null;

const initializeState = () => {
    try {
        currentAppState = readData();
        if (!currentAppState) {
            console.warn('[StateManager] readData() returned empty state. Initializing with default structure.');
            currentAppState = {
                zawody: { nazwa: '', miejsce: '', data: '', sedzia: { imie: '', nazwisko: '', avatar: null }, klubAvatar: null },
                kategorie: [], zawodnicy: [], activeCategory: null, activeWeight: null,
                activeAthleteOriginalIndex: null, activeAttemptNr: 1, timerActive: false, timerTimeLeft: 60,
            };
            // Opcjonalnie: Zapisz domyślny stan
            // writeData(currentAppState);
        }
        console.log('[StateManager] Initial state loaded/initialized successfully.');
    } catch (error) {
        console.error('[StateManager] CRITICAL ERROR during initial state read:', error);
        console.warn('[StateManager] Initializing with default structure due to error.');
        currentAppState = {
            zawody: { nazwa: '', miejsce: '', data: '', sedzia: { imie: '', nazwisko: '', avatar: null }, klubAvatar: null },
            kategorie: [], zawodnicy: [], activeCategory: null, activeWeight: null,
            activeAthleteOriginalIndex: null, activeAttemptNr: 1, timerActive: false, timerTimeLeft: 60,
        };
    }
};

// Wywołaj inicjalizację od razu przy ładowaniu modułu
initializeState();

export const getCurrentAppState = () => {
    if (currentAppState === null) {
         console.error('[StateManager] CRITICAL: Attempted to get state before initialization!');
         // Zwróć kopię struktury domyślnej, aby uniknąć null pointerów w dalszej części kodu
         return {
            zawody: { nazwa: '', miejsce: '', data: '', sedzia: { imie: '', nazwisko: '', avatar: null }, klubAvatar: null },
            kategorie: [], zawodnicy: [], activeCategory: null, activeWeight: null,
            activeAthleteOriginalIndex: null, activeAttemptNr: 1, timerActive: false, timerTimeLeft: 60,
        };
    }
    return currentAppState;
};

export const updateServerState = (newState) => {
    console.log('[StateManager] Updating server state.');
    if (typeof newState !== 'object' || newState === null) {
        console.error('[StateManager] Received invalid newState:', newState);
        return;
    }
    currentAppState = newState;
    console.log(`[StateManager] State updated. Timer active: ${currentAppState.timerActive}`);
};