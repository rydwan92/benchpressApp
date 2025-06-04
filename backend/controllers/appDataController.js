import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'appData.json');
console.log(`[FileSystemUtils] Using data path for appData.json: ${DATA_FILE}`);

// Zmieniona nazwa i sygnatura, aby pasowała do użycia w stateManager.js
export const readAppDataFromFile = async () => { // Nie przyjmuje req, res
  try {
    const content = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(content); // Zwraca dane, nie wysyła odpowiedzi HTTP
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`[FileSystemUtils] appData.json not found at ${DATA_FILE}. Returning a default structure.`);
      return { // Zwraca domyślną strukturę
        zawody: {
          nazwa: 'Benchpress Cup Initial',
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
        timerActive: false, // Te pola są bardziej stanem UI, ale mogą być w pliku
        timerTimeLeft: 60,
        // socket i attemptResultForAnimation nie powinny być w pliku appData.json
      };
    }
    console.error('[FileSystemUtils] Error reading appData.json:', err);
    throw err; // Rzuca błąd dalej, aby stateManager mógł go obsłużyć
  }
};

// Zmieniona nazwa i sygnatura, aby pasowała do użycia w routes/appData.js
export const writeAppDataToFile = async (data) => { // Przyjmuje dane do zapisu, nie req, res
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[FileSystemUtils] Data successfully written to ${DATA_FILE}`);
    // Nie wysyła odpowiedzi HTTP, to zadanie trasy
  } catch (error) {
    console.error('[FileSystemUtils] Error writing appData.json:', error);
    throw error; // Rzuca błąd dalej, aby trasa mogła go obsłużyć
  }
};

// Jeśli nadal potrzebujesz oryginalnych funkcji getAppData i saveAppData jako handlerów tras,
// możesz je zachować lub zmodyfikować trasy, aby bezpośrednio używały powyższych funkcji.
// Poniżej przykład, jak mogłyby wyglądać, jeśli trasy nadal ich oczekują:

export const getAppData = async (req, res) => {
  try {
    const data = await readAppDataFromFile(); // Użyj nowej funkcji wewnętrznej
    res.json(data);
  } catch (error) {
    // readAppDataFromFile już loguje błąd, więc tutaj możemy tylko wysłać odpowiedź
    res.status(500).json({ message: 'Error reading application data' });
  }
};

export const saveAppData = async (req, res) => {
  try {
    const dataToSave = req.body;
    await writeAppDataToFile(dataToSave); // Użyj nowej funkcji wewnętrznej
    // Logika emisji Socket.IO powinna być w trasie, nie tutaj
    res.json({ success: true, data: dataToSave });
  } catch (error) {
    // writeAppDataToFile już loguje błąd
    res.status(500).json({ message: 'Error saving application data' });
  }
};