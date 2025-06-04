import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { initializeState, getCurrentAppState, updateServerState } from './stateManager.js';
import appDataRoutes from './routes/appData.js';

const app = express();
const httpServer = http.createServer(app);

// --- POCZĄTEK ZMIANY: Konfiguracja CORS dla Express i Socket.IO ---
const corsOptions = {
  origin: "*", // W środowisku produkcyjnym zawęź to do domeny frontendu, np. 'http://localhost:8081' lub adres IP frontendu
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"], // Dodaj nagłówki, jeśli są potrzebne
  credentials: true // Jeśli używasz ciasteczek lub nagłówków autoryzacji
};

app.use(cors(corsOptions)); // Zastosuj globalnie dla wszystkich tras HTTP

const io = new SocketIOServer(httpServer, {
  cors: corsOptions // Użyj tych samych opcji CORS dla Socket.IO
});
// --- KONIEC ZMIANY ---

// Middleware do udostępniania io w req (pozostaje bez zmian)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Standardowe middleware (pozostaje bez zmian)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes (pozostaje bez zmian)
app.use('/api/appData', appDataRoutes);
// ... inne trasy

// Logika Socket.IO (pozostaje bez zmian)
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.emit('connectionConfirmation', { socketId: socket.id, message: 'Successfully connected to server.' });
  socket.emit('dataUpdated', getCurrentAppState()); // Send current state on new connection

  socket.on('startTimer', (data) => {
    console.log(`[Socket.IO Event] Received startTimer from ${socket.id}. Data:`, data);
    let currentState = getCurrentAppState();
    const newTimeLeft = (data && typeof data.timeLeft === 'number') ? data.timeLeft : 60; // Default to 60 if not provided
    const newState = {
        ...currentState,
        timerActive: true,
        timerTimeLeft: newTimeLeft,
        activeAthleteOriginalIndex: data.athleteOriginalIndex !== undefined ? data.athleteOriginalIndex : currentState.activeAthleteOriginalIndex,
        activeAttemptNr: data.attemptNr !== undefined ? data.attemptNr : currentState.activeAttemptNr
    };
    updateServerState(newState); // Update the authoritative state
    
    // Emit specific event for clients that might want immediate, specialized feedback
    io.emit('timerStarted', { 
        timeLeft: newState.timerTimeLeft, 
        athleteOriginalIndex: newState.activeAthleteOriginalIndex 
    });
    // ALSO emit the general dataUpdated event with the full new state
    io.emit('dataUpdated', getCurrentAppState()); 
    console.log('[Socket.IO Event] Emitted dataUpdated after startTimer.');
  });

  socket.on('stopTimer', (data) => {
    console.log(`[Socket.IO Event] Received stopTimer from ${socket.id}. Data:`, data);
    let currentState = getCurrentAppState();
    const finalTime = (data && typeof data.finalTimeLeft === 'number') ? data.finalTimeLeft : currentState.timerTimeLeft;
    const newState = {
        ...currentState,
        timerActive: false,
        timerTimeLeft: finalTime,
        activeAthleteOriginalIndex: data.athleteOriginalIndex !== undefined ? data.athleteOriginalIndex : currentState.activeAthleteOriginalIndex
    };
    updateServerState(newState);

    io.emit('timerStopped', { 
        finalTimeLeft: newState.timerTimeLeft, 
        reason: data.reason, 
        athleteOriginalIndex: newState.activeAthleteOriginalIndex 
    });
    // ALSO emit the general dataUpdated event
    io.emit('dataUpdated', getCurrentAppState());
    console.log('[Socket.IO Event] Emitted dataUpdated after stopTimer.');
  });

  socket.on('timerTick', (data) => {
    // This is usually just relayed for real-time updates, state is managed by emitting client
    // However, if server needs to be authoritative on ticks, update state here too.
    // For now, just relaying.
    io.emit('timerTick', data); 
  });

  socket.on('timerReset', (data) => {
    console.log(`[Socket.IO Event] Received timerReset from ${socket.id}. Data:`, data);
    let currentState = getCurrentAppState();
    const resetTime = (data && typeof data.timeLeft === 'number') ? data.timeLeft : 60; // Default to 60
    const newState = {
        ...currentState,
        timerActive: false, // Typically reset also means timer is not active
        timerTimeLeft: resetTime,
        // activeAthleteOriginalIndex: data.athleteOriginalIndex !== undefined ? data.athleteOriginalIndex : currentState.activeAthleteOriginalIndex // Optional: reset for specific athlete
    };
    updateServerState(newState);

    io.emit('timerReset', { 
        timeLeft: newState.timerTimeLeft,
        // athleteOriginalIndex: newState.activeAthleteOriginalIndex 
    });
    // ALSO emit the general dataUpdated event
    io.emit('dataUpdated', getCurrentAppState());
    console.log('[Socket.IO Event] Emitted dataUpdated after timerReset.');
  });

  // ZMIANA TUTAJ: nasłuchuj na 'attemptAnimationTriggered'
  socket.on('attemptAnimationTriggered', (data) => {
    console.log(`[Socket.IO Event] Received attemptAnimationTriggered from ${socket.id}. Data:`, data);
    // Upewnij się, że 'data' zawiera 'athleteOriginalIndex'.
    io.emit('attemptAnimationTriggered', data); // Rozgłoś to samo zdarzenie
  });

  // NOWY HANDLER: Rozgłaszanie żądania wyświetlenia wyników kategorii
  socket.on('showCategoryResults', (data) => {
    console.log(`[Socket.IO Event] Received showCategoryResults from ${socket.id}. Data:`, data);
    // Rozgłoś do wszystkich klientów (w tym AthleteViewScreen)
    io.emit('displayCategoryResults', data);
  });
});

// Funkcja uruchamiająca serwer
async function startServer() {
  try {
    await initializeState();
    console.log('[Server] Application state initialized successfully.');

    const PORT = process.env.PORT || 5001; // Upewnij się, że port jest zgodny z frontendem
    httpServer.listen(PORT, () => {
      console.log(`[Server] HTTP Server running on port ${PORT}`);
      console.log(`[Server] Backend accessible at http://localhost:${PORT}`);
      console.log(`[Server] WebSocket server initialized.`);
    });
  } catch (error) {
    console.error('[Server] Failed to start server due to state initialization error:', error);
    process.exit(1);
  }
}

// Uruchom serwer
startServer();