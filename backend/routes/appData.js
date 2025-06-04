import express from 'express';
// import { writeData } from '../utils/fileHandler.js'; // REMOVE THIS LINE
import { writeAppDataToFile } from '../controllers/appDataController.js'; // UPDATED IMPORT (adjust path if necessary)
import { getCurrentAppState, updateServerState } from '../stateManager.js';

const router = express.Router();

// GET handler remains the same, serving from stateManager's in-memory state
router.get('/', (req, res) => {
    console.log('[GET /api/appData] Handler reached.');
    try {
        console.log('[GET /api/appData] Calling getCurrentAppState()...');
        const state = getCurrentAppState();
        console.log(`[GET /api/appData] State received. Type: ${typeof state}, Keys: ${state ? Object.keys(state).join(', ') : 'N/A'}`);

        if (state === null || typeof state === 'undefined' || Object.keys(state).length === 0) { // More robust check
             console.error('[GET /api/appData] CRITICAL: getCurrentAppState() returned invalid state!');
             return res.status(500).json({ error: 'Internal Server Error: Application state is unavailable or invalid.' });
        }

        console.log('[GET /api/appData] Sending state as JSON response.');
        res.json(state);
        console.log('[GET /api/appData] JSON response sent.');
    } catch (e) {
        console.error('[GET /api/appData] Error in GET handler:', e);
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
});

// POST handler updated to use writeAppDataToFile
router.post('/', async (req, res) => {
    const newData = req.body;
    console.log('--- Received data on POST /api/appData ---');
    console.log(`Received data keys: ${Object.keys(newData).join(', ')}`);
    console.log(`UI State Received: ActiveCat=${newData.activeCategory}, ActiveW=${newData.activeWeight}, ActiveIdx=${newData.activeAthleteOriginalIndex}, Timer=${newData.timerActive}, TimeLeft=${newData.timerTimeLeft}`);
    console.log('--- End of received data ---');
    
    let writeTimeMeasurement;

    try {
        const currentState = getCurrentAppState();
        const stateToSave = { ...newData };

        // Preserve timer state if not explicitly provided in newData
        if (newData.timerActive === undefined && currentState.timerActive !== undefined) {
            console.log(`[POST /api/appData] Preserving existing timerActive state: ${currentState.timerActive}`);
            stateToSave.timerActive = currentState.timerActive;
        }
        if (newData.timerTimeLeft === undefined && currentState.timerTimeLeft !== undefined) {
            console.log(`[POST /api/appData] Preserving existing timerTimeLeft state: ${currentState.timerTimeLeft}`);
            stateToSave.timerTimeLeft = currentState.timerTimeLeft;
        }

        writeTimeMeasurement = 'writeAppDataToFileDuration';
        console.time(writeTimeMeasurement);
        await writeAppDataToFile(stateToSave); // Use the new async file writing function
        console.timeEnd(writeTimeMeasurement);

        updateServerState(stateToSave); // Update in-memory state

        if (req.io) {
            console.log('[POST /api/appData] Data saved. Emitting dataUpdated event via WebSocket.');
            console.log(`Emitting UI State via dataUpdated: ActiveIdx=${stateToSave.activeAthleteOriginalIndex}, Timer=${stateToSave.timerActive}, TimeLeft=${stateToSave.timerTimeLeft}`);
            req.io.emit('dataUpdated', stateToSave);
        } else {
            console.warn('[POST /api/appData] Socket.IO instance (req.io) not found. Cannot emit update.');
        }

        res.json({ success: true, data: stateToSave }); // Send back the saved state
    } catch (e) {
        if (writeTimeMeasurement) {
            console.timeEnd(writeTimeMeasurement); // Ensure timer ends on error
        }
        console.error('[POST /api/appData] Error handling POST request:', e);
        res.status(500).json({ success: false, error: e.message || 'Failed to save data' });
    }
});

export default router;