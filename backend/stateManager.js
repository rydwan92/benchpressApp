// filepath: c:\benchpress-competition-app\backend\stateManager.js
import { readAppDataFromFile } from './controllers/appDataController.js';

let currentAppState = null;

// Export initializeState to be called and awaited from server.js
export const initializeState = async () => {
    try {
        console.log('[StateManager] Initializing state from file...');
        currentAppState = await readAppDataFromFile();

        // Ensure essential properties exist, even if readAppDataFromFile returns a minimal default on error
        if (!currentAppState) {
             console.error('[StateManager] CRITICAL: readAppDataFromFile returned null/undefined. This should not happen. Initializing emergency default.');
             currentAppState = { // Emergency default
                zawody: { nazwa: 'Emergency Default', miejsce: '', data: new Date().toISOString().slice(0,10), sedzia: { imie: '', nazwisko: '', avatar: null }, klubAvatar: null },
                kategorie: [], zawodnicy: [], activeCategory: null, activeWeight: null,
                activeAthleteOriginalIndex: null, activeAttemptNr: 1, currentRound: 1, timerActive: false, timerTimeLeft: 60,
             };
        }
        // Ensure all expected top-level UI state keys are present if not loaded
        const defaultUIState = {
            activeCategory: null, activeWeight: null,
            activeAthleteOriginalIndex: null, activeAttemptNr: 1, currentRound: 1,
            timerActive: false, timerTimeLeft: 60
        };
        for (const key in defaultUIState) {
            if (currentAppState[key] === undefined) {
                currentAppState[key] = defaultUIState[key];
            }
        }


        console.log('[StateManager] Initial state loaded/initialized successfully.');
    } catch (error) {
        console.error('[StateManager] CRITICAL ERROR during initial state read from file:', error);
        console.warn('[StateManager] Initializing with fallback default structure due to error.');
        currentAppState = {
            zawody: { nazwa: 'Fallback Competition', miejsce: '', data: new Date().toISOString().slice(0,10), sedzia: { imie: '', nazwisko: '', avatar: null }, klubAvatar: null },
            kategorie: [], zawodnicy: [], activeCategory: null, activeWeight: null,
            activeAthleteOriginalIndex: null, activeAttemptNr: 1, currentRound: 1, timerActive: false, timerTimeLeft: 60,
        };
    }
};

export const getCurrentAppState = () => {
    if (currentAppState === null) {
         console.error('[StateManager] CRITICAL: Attempted to get state before initialization was complete!');
         // Return a copy of a minimal default structure to avoid null pointers
         return {
            zawody: { nazwa: 'Uninitialized State', miejsce: '', data: new Date().toISOString().slice(0,10), sedzia: { imie: '', nazwisko: '', avatar: null }, klubAvatar: null },
            kategorie: [], zawodnicy: [], activeCategory: null, activeWeight: null,
            activeAthleteOriginalIndex: null, activeAttemptNr: 1, currentRound: 1, timerActive: false, timerTimeLeft: 60,
        };
    }
    // Zwróć głęboką kopię stanu, aby uniknąć modyfikacji przez referencję
    return JSON.parse(JSON.stringify(currentAppState));
};

export const updateServerState = (newState) => {
    console.log('[StateManager] Updating server state.');
    if (typeof newState !== 'object' || newState === null) {
        console.error('[StateManager] Received invalid newState:', newState);
        return;
    }
    // Zamiast bezpośredniego przypisania, można rozważyć głębokie scalenie,
    // ale jeśli newState jest kompletnym stanem, bezpośrednie przypisanie jest OK.
    // Upewnij się, że newState jest kompletnym i poprawnym obiektem stanu.
    currentAppState = JSON.parse(JSON.stringify(newState)); // Zapisz kopię, aby uniknąć problemów z referencjami
    console.log(`[StateManager] State updated. Timer active: ${currentAppState.timerActive}, TimeLeft: ${currentAppState.timerTimeLeft}`);
};

// DO NOT call initializeState() here anymore. It will be called from server.js
// initializeState(); // REMOVE OR COMMENT OUT THIS LINE