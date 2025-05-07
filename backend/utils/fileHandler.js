import fs from 'fs';
import path from 'path';
// --- POCZĄTEK ZMIANY: Poprawne określenie ścieżki w ES Modules ---
import { fileURLToPath } from 'url';

// Zamiast __dirname, użyj import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ścieżka do pliku appData.json, zakładając, że fileHandler.js jest w backend/utils/
// __dirname będzie teraz wskazywać na c:\...\backend\utils
const dataPath = path.join(__dirname, '..', 'appData.json'); // Wyjście o jeden poziom wyżej do katalogu backend/
console.log(`[fileHandler] Using data path: ${dataPath}`); // Dodaj logowanie ścieżki
// --- KONIEC ZMIANY ---


// Odczyt danych z pliku JSON
export function readData() {
  try {
    // --- POCZĄTEK ZMIANY: Użyj poprawnej ścieżki i obsłuż brak pliku ---
    if (!fs.existsSync(dataPath)) {
      console.warn(`[fileHandler] Data file not found at ${dataPath}. Returning default structure.`);
      // Zwróć domyślną strukturę, jeśli plik nie istnieje, aby uniknąć błędu przy starcie
      return { zawody: {}, kategorie: [], zawodnicy: [] };
    }
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    // --- KONIEC ZMIANY ---
    return JSON.parse(jsonData);
  } catch (e) {
    console.error('[fileHandler] Error reading data file:', e);
    // W przypadku błędu odczytu (np. uszkodzony JSON), zwróć domyślną strukturę
    return { zawody: {}, kategorie: [], zawodnicy: [] };
  }
}

// Zapis danych do pliku JSON
export function writeData(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Formatowanie dla czytelności
    // --- POCZĄTEK ZMIANY: Użyj poprawnej ścieżki i dodaj logowanie sukcesu ---
    fs.writeFileSync(dataPath, jsonData, 'utf-8');
    console.log(`[fileHandler] Data successfully written to ${dataPath}`); // Dodaj logowanie sukcesu zapisu
    // --- KONIEC ZMIANY ---
  } catch (e) {
    console.error('[fileHandler] Error writing data file:', e);
    // Rzuć błąd dalej, aby został złapany w routerze
    throw e;
  }
}