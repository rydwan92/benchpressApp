import axios from 'axios';
// --- POCZĄTEK ZMIANY: Poprawiony import dla nazwanego eksportu ---
// import CONFIG from '../config'; // Usuń lub zakomentuj ten błędny import
import { CONFIG } from '../config'; // Użyj nawiasów klamrowych {} dla nazwanego eksportu
// --- KONIEC ZMIANY ---

// Użyj zaimportowanego obiektu CONFIG
const API_URL = `${CONFIG.BACKEND_ADDRESS}/api/appData`;

// Funkcja do pobierania wszystkich danych aplikacji
export const loadAppData = async () => {
  try {
    console.log(`[API] Fetching data from ${API_URL}...`);
    const response = await axios.get(API_URL);
    console.log('[API] Data fetched successfully.');
    return response.data;
  } catch (error) {
    console.error('[API] Error loading app data:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Funkcja do zapisywania wszystkich danych aplikacji
export const saveAppData = async (data) => {
  try {
    console.log(`[API] Saving data to ${API_URL}...`);
    const response = await axios.post(API_URL, data);
    console.log('[API] Data saved successfully.');
    return response.data;
  } catch (error) {
    console.error('[API] Error saving app data:', error.response ? error.response.data : error.message);
    throw error;
  }
};