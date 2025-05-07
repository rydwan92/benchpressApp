import express from 'express';
import { writeData } from '../utils/fileHandler.js';
import { getCurrentAppState, updateServerState } from '../stateManager.js';

const router = express.Router();

// Odczyt danych (GET) - Zwróć stan z pamięci serwera
router.get('/', (req, res) => {
    // --- START ZMIANY: Dodaj więcej logowania ---
    console.log('[GET /api/appData] Handler reached.');
    try {
        console.log('[GET /api/appData] Calling getCurrentAppState()...');
        const state = getCurrentAppState(); // Pobierz aktualny stan
        console.log(`[GET /api/appData] State received from getCurrentAppState(). Type: ${typeof state}, Keys: ${state ? Object.keys(state).join(', ') : 'N/A'}`);

        // Sprawdź, czy stan jest poprawny przed wysłaniem
        if (state === null || typeof state === 'undefined') {
             console.error('[GET /api/appData] CRITICAL: getCurrentAppState() returned null or undefined!');
             return res.status(500).json({ error: 'Internal Server Error: Application state is unavailable.' });
        }

        console.log('[GET /api/appData] Sending state as JSON response.');
        res.json(state);
        console.log('[GET /api/appData] JSON response sent.');
        // --- KONIEC ZMIANY ---
    } catch (e) {
        // --- START ZMIANY: Loguj błąd przed wysłaniem odpowiedzi ---
        console.error('[GET /api/appData] Error in GET handler:', e);
        // --- KONIEC ZMIANY ---
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
});

// Zapis danych (POST)
router.post('/', async (req, res) => {
    const newData = req.body;
    console.log('--- Received data on POST /api/appData ---');
    console.log(`Received data keys: ${Object.keys(newData).join(', ')}`);
    // Dodaj logowanie kluczowych elementów stanu UI
    console.log(`UI State Received: ActiveCat=${newData.activeCategory}, ActiveW=${newData.activeWeight}, ActiveIdx=${newData.activeAthleteOriginalIndex}, Timer=${newData.timerActive}`);
    console.log('--- End of received data ---');
    try {
        // --- START ZMIANY: Zachowaj istniejący stan timera, jeśli nie został przesłany ---
        const currentState = getCurrentAppState(); // Pobierz aktualny stan serwera PRZED zapisem
        const stateToSave = { ...newData }; // Skopiuj nowe dane, aby nie modyfikować req.body

        // Jeśli w newData brakuje informacji o timerze, użyj wartości z aktualnego stanu serwera
        if (newData.timerActive === undefined && currentState.timerActive !== undefined) {
            console.log(`[POST /api/appData] Preserving existing timerActive state: ${currentState.timerActive}`);
            stateToSave.timerActive = currentState.timerActive;
        }
        if (newData.timerTimeLeft === undefined && currentState.timerTimeLeft !== undefined) {
            console.log(`[POST /api/appData] Preserving existing timerTimeLeft state: ${currentState.timerTimeLeft}`);
            stateToSave.timerTimeLeft = currentState.timerTimeLeft;
        }
        // --- KONIEC ZMIANY ---

        console.time('writeDataDuration');
        // --- START ZMIANY: Zapisz stan z potencjalnie zachowanym timerem ---
        await writeData(stateToSave); // Zapisz stateToSave do pliku
        // --- KONIEC ZMIANY ---
        console.timeEnd('writeDataDuration');

        // --- START ZMIANY: Zaktualizuj stan serwera stanem z potencjalnie zachowanym timerem ---
        updateServerState(stateToSave); // Zaktualizuj stan w pamięci serwera
        // --- KONIEC ZMIANY ---

        // Emituj event 'dataUpdated'
        if (req.io) {
            console.log('Data saved. Emitting dataUpdated event via WebSocket.');
            // --- START ZMIANY: Wyślij stan z potencjalnie zachowanym timerem ---
            console.log(`Emitting UI State via dataUpdated: ActiveIdx=${stateToSave.activeAthleteOriginalIndex}, Timer=${stateToSave.timerActive}, TimeLeft=${stateToSave.timerTimeLeft}`);
            req.io.emit('dataUpdated', stateToSave); // Wyślij stateToSave
            // --- KONIEC ZMIANY ---
        } else {
            console.warn('Socket.IO instance (req.io) not found. Cannot emit update.');
        }

        res.json({ success: true });
    } catch (e) {
        console.timeEnd('writeDataDuration'); // Upewnij się, że jest też w catch
        console.error('Error handling POST /api/appData:', e);
        res.status(500).json({ success: false, error: e.message || 'Failed to save data' });
    }
});

export default router;