import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import appDataRoutes from './routes/appData.js';
// --- START ZMIANY: Importuj tylko getCurrentAppState ---
import { getCurrentAppState } from './stateManager.js';
// --- KONIEC ZMIANY ---
// Usuń import readData, writeData - nie są już tu potrzebne
// import { readData, writeData } from './utils/fileHandler.js';

const PORT = process.env.PORT || 5001;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Dostosuj w produkcji
        methods: ["GET", "POST"]
    }
});

// --- START ZMIANY: Usuń całą logikę inicjalizacji stanu ---
// let currentAppState = null;
// try { ... } catch { ... }
// --- KONIEC ZMIANY ---

// Konfiguracja middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middleware do przekazywania io i stanu
app.use((req, res, next) => {
  console.log('[Middleware] Przetwarzanie żądania...'); // Dodaj log
  req.io = io;
  try {
    // --- START POPRAWKI: Użyj getCurrentAppState() i lokalnej zmiennej 'state' ---
    const state = getCurrentAppState(); // Pobierz stan za pomocą funkcji
    console.log(`[Middleware] Stan pobrany z getCurrentAppState(). Timer active: ${state?.timerActive}`); // Loguj pobrany stan

    if (state === null || typeof state === 'undefined') { // Bardziej rygorystyczne sprawdzenie
        console.error('[Middleware] KRYTYCZNY: getCurrentAppState() zwróciło null lub undefined!');
        // Zwróć błąd, ale nie rzucaj wyjątku, który mógłby przerwać serwer
        return res.status(500).send('Błąd wewnętrzny serwera: Stan aplikacji niezainicjalizowany.');
    }

    // Przypisz pobrany stan (z lokalnej zmiennej 'state') do req.currentAppState
    req.currentAppState = state; // To jest linia ~41 - upewnij się, że używa 'state'
    console.log('[Middleware] req.currentAppState przypisany.');
    // --- KONIEC POPRAWKI ---
    next(); // Przejdź do następnego middleware/routera
  } catch (error) {
      console.error('[Middleware] Nieoczekiwany błąd w middleware stanu:', error);
      // Zwróć błąd w razie nieoczekiwanego wyjątku
      return res.status(500).send('Błąd wewnętrzny serwera podczas przetwarzania stanu.');
  }
});

// Routing
app.use('/api/appData', appDataRoutes);

// Nasłuchiwanie na połączenia Socket.IO
io.on('connection', (socket) => {
  console.log('[Socket.IO] Klient połączony:', socket.id);

  socket.on('disconnect', () => {
    console.log('[Socket.IO] Klient rozłączony:', socket.id);
  });

  // Obsługa eventów timera
  socket.on('startTimer', (data) => {
    console.log(`[Socket.IO Event] Otrzymano startTimer od ${socket.id}`, data);
    // --- START ZMIANY: Pobierz aktualny stan i zaktualizuj go ---
    // UWAGA: Bezpośrednia modyfikacja stanu pobranego przez getCurrentAppState()
    // zadziała, ponieważ obiekty w JS są przekazywane przez referencję.
    // Dla większej czystości można by dodać dedykowaną funkcję w stateManager,
    // np. setTimerState(isActive, timeLeft), ale na razie to wystarczy.
    let state = getCurrentAppState();
    if (state) {
        state.timerActive = true;
        state.timerTimeLeft = data.initialTime || 60;
        console.log(`[Server State Update via Socket] Timer ustawiony na aktywny, timeLeft: ${state.timerTimeLeft}`);
        io.emit('timerStarted', { timeLeft: state.timerTimeLeft });
        console.log('[Socket.IO Emit] Wysłano timerStarted do wszystkich klientów.');
    } else {
        console.error('[Socket.IO Event startTimer] getCurrentAppState() zwróciło null!');
    }
    // --- KONIEC ZMIANY ---
  });

  socket.on('stopTimer', () => {
    console.log(`[Socket.IO Event] Otrzymano stopTimer od ${socket.id}`);
    // --- START ZMIANY: Pobierz aktualny stan i zaktualizuj go ---
    let state = getCurrentAppState();
    if (state) {
        state.timerActive = false;
        console.log('[Server State Update via Socket] Timer ustawiony na nieaktywny.');
        io.emit('timerStopped', {});
        console.log('[Socket.IO Emit] Wysłano timerStopped do wszystkich klientów.');
    } else {
        console.error('[Socket.IO Event stopTimer] getCurrentAppState() zwróciło null!');
    }
    // --- KONIEC ZMIANY ---
  });
});

// Uruchom httpServer
httpServer.listen(PORT, () => {
  console.log(`Serwer działa z Socket.IO na porcie ${PORT}`);
});

// --- START ZMIANY: Usuń funkcję updateServerState ---
// export function updateServerState(newState) { ... }
// --- KONIEC ZMIANY ---