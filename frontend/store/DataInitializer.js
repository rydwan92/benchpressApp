import React, { useEffect, useRef } from 'react';
import { useCompetitionStore } from './useCompetitionStore'; // Importuj store
import { loadAppData } from '../utils/api';
import { io } from 'socket.io-client';
import { CONFIG } from '../config';

export default function DataInitializer({ children }) {
  const setInitialData = useCompetitionStore(state => state.setInitialData);
  // --- START ZMIANY: Pobierz akcję setSocket ---
  const setSocket = useCompetitionStore(state => state.setSocket);
  // --- KONIEC ZMIANY ---
  const initialized = useRef(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('DataInitializer: Fetching initial data...');
        const data = await loadAppData();
        console.log('DataInitializer: Initial data received, setting state.');
        setInitialData(data);
        initialized.current = true;
      } catch (error) {
        console.error('DataInitializer: Error fetching initial data:', error);
        // Opcjonalnie: ustaw domyślny stan lub pokaż błąd
      }
    };

    const connectWebSocket = () => {
      if (!socketRef.current) {
        console.log(`DataInitializer: Connecting WebSocket to ${CONFIG.BACKEND_ADDRESS}...`);
        socketRef.current = io(CONFIG.BACKEND_ADDRESS, {
          transports: ['polling', 'websocket'],
          reconnection: true,
          reconnectionAttempts: 20,
          reconnectionDelay: 2000,
        });

        socketRef.current.on('connect', () => {
          console.log('DataInitializer: WebSocket connected:', socketRef.current.id);
          // --- START ZMIANY: Zapisz instancję w store ---
          setSocket(socketRef.current);
          // --- KONIEC ZMIANY ---
        });

        socketRef.current.on('disconnect', (reason) => {
          console.log('DataInitializer: WebSocket disconnected:', reason);
          // --- START ZMIANY: Wyczyść instancję w store ---
          setSocket(null);
          // --- KONIEC ZMIANY ---
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('DataInitializer: WebSocket connection error:', error.message);
          // --- START ZMIANY: Wyczyść instancję w store przy błędzie ---
          setSocket(null);
          // --- KONIEC ZMIANY ---
        });

        // Nasłuchuj na aktualizacje danych
        socketRef.current.on('dataUpdated', (updatedData) => {
          console.time('handleDataUpdated'); // <<< START POMIARU obsługi
          console.log('DataInitializer: Received dataUpdated event via WebSocket...');
          // Logowanie payload (opcjonalne, jeśli dane są duże)
          // console.log('Payload:', updatedData);
          console.time('setInitialDataCall'); // <<< START POMIARU wywołania store
          setInitialData(updatedData);
          console.timeEnd('setInitialDataCall'); // <<< KONIEC POMIARU wywołania store
          console.timeEnd('handleDataUpdated'); // <<< KONIEC POMIARU obsługi
        });
      }
    };

    // Pobierz dane początkowe tylko raz
    if (!initialized.current) {
      initializeData().then(() => {
          // Połącz WebSocket dopiero po udanej inicjalizacji danych
          connectWebSocket();
      });
    } else {
        // Jeśli dane już zainicjalizowano (np. HMR), upewnij się, że WebSocket jest połączony
        connectWebSocket();
    }


    // --- POCZĄTEK ZMIANY: Cleanup - rozłącz WebSocket przy odmontowaniu ---
    return () => {
        if (socketRef.current) {
            console.log('DataInitializer: Disconnecting WebSocket.');
            socketRef.current.disconnect();
            socketRef.current = null;
            // --- START ZMIANY: Wyczyść instancję w store przy odmontowaniu ---
            setSocket(null);
            // --- KONIEC ZMIANY ---
        }
    };
    // --- KONIEC ZMIANY ---

  }, [setInitialData, setSocket]); // Dodaj setSocket do zależności

  return <>{children}</>;
}