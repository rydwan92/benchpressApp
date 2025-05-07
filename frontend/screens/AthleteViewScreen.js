import React, { useEffect, useState, useRef, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCompetitionStore } from '../store/useCompetitionStore';
import NavBar from '../components/navigation/NavBar';
import Footer from '../components/navigation/Footer';
import { colors, font, spacing, borderRadius, shadows } from '../theme/theme';
import { AntDesign } from '@expo/vector-icons';

// --- START ZMIANY: Dodaj definicję hasAthleteCompleted ---
// Funkcja pomocnicza do sprawdzania ukończenia zawodnika
const hasAthleteCompleted = (athlete) => {
  // Sprawdza, czy wszystkie trzy statusy podejść są ustawione (nie są null)
  return !!(athlete.podejscie1Status && athlete.podejscie2Status && athlete.podejscie3Status);
};
// --- KONIEC ZMIANY ---

// --- Komponenty pomocnicze (AttemptDisplay, TimerDisplay, GroupAthleteList) ---
// Komponent pomocniczy do wyświetlania pojedynczego podejścia (bez zmian)
const AttemptDisplay = ({ number, weight, status, isActive }) => {
    const getStatusIcon = (status) => {
        if (status === 'passed') return <AntDesign name="checkcircle" size={32} color={colors.success} />;
        if (status === 'failed') return <AntDesign name="closecircle" size={32} color={colors.error} />;
        return <AntDesign name="clockcircleo" size={32} color={colors.textSecondary} />; // Oczekujące lub brak
    };

    return (
        <View style={[styles.attemptBox, isActive && styles.attemptBoxActive]}>
            <Text style={styles.attemptNumber}>Podejście {number}</Text>
            <Text style={styles.attemptWeight}>{weight ? `${weight} kg` : '-'}</Text>
            <View style={styles.attemptStatus}>
                {getStatusIcon(status)}
            </View>
        </View>
    );
};

// Komponent Timera - bez zmian w logice formatowania
const TimerDisplay = ({ isActive, timeLeft }) => {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.timerContainer}>
            <Text style={[
                styles.timerText,
                isActive && timeLeft <= 10 && timeLeft > 0 && styles.timerWarning, // Ostrzeżenie tylko gdy aktywny
                isActive && timeLeft === 0 && styles.timerFinished // Zakończony tylko gdy aktywny (choć stan active powinien być false)
            ]}>
                {isActive ? formatTime(timeLeft) : '--:--'} {/* Pokaż --:-- gdy nieaktywny */}
            </Text>
        </View>
    );
};

// --- POCZĄTEK ZMIANY: Komponent listy zawodników dla widoku grupy ---
const GroupAthleteList = ({ athletes, currentAthleteOriginalIndex }) => {
    if (!athletes || athletes.length === 0) {
        return <Text style={styles.placeholderText}>Brak zawodników w tej grupie.</Text>;
    }

    const getStatusIcon = (status) => {
        if (status === 'passed') return <AntDesign name="checkcircleo" size={16} color={colors.success} />;
        if (status === 'failed') return <AntDesign name="closecircleo" size={16} color={colors.error} />;
        return null; // Nie pokazuj ikony dla null/oczekujących w tym widoku
    };

    return (
        <ScrollView style={styles.groupListScroll}>
            {athletes.map((athlete, index) => (
                <View
                    key={athlete.originalIndex}
                    style={[
                        styles.groupListItem,
                        athlete.isCompleted && styles.groupListItemCompleted,
                        // Dodaj styl podświetlenia, jeśli indeks się zgadza
                        athlete.originalIndex === currentAthleteOriginalIndex && styles.groupListItemActive
                    ]}
                >
                    <View style={styles.groupListRank}>
                       <Text style={styles.groupListRankText}>{index + 1}.</Text>
                    </View>
                    <View style={styles.groupListInfo}>
                        <Text style={styles.groupListName}>{athlete.imie} {athlete.nazwisko}</Text>
                        <Text style={styles.groupListClub}>{athlete.klub || 'Brak klubu'}</Text>
                    </View>
                    <View style={styles.groupListAttempts}>
                        {[1, 2, 3].map(nr => (
                            <View key={nr} style={styles.groupListAttempt}>
                                <Text style={styles.groupListAttemptWeight}>{athlete[`podejscie${nr}`] || '-'}</Text>
                                {getStatusIcon(athlete[`podejscie${nr}Status`])}
                            </View>
                        ))}
                    </View>
                     {athlete.isCompleted && <AntDesign name="check" size={18} color={colors.success} style={styles.groupListCompletedIcon} />}
                </View>
            ))}
        </ScrollView>
    );
};
// --- KONIEC ZMIANY ---


export default function AthleteViewScreen() {
    // Pobieranie stanu ze store'u
    const {
        zawody, zawodnicy, activeCategory, activeWeight,
        activeAthleteOriginalIndex, activeAttemptNr, timerActive, timerTimeLeft,
        // --- START ZMIANY: Pobierz socket i akcje timera ---
        socket, setTimerActive, setTimerTimeLeft
        // --- KONIEC ZMIANY ---
    } = useCompetitionStore(state => ({
        zawody: state.zawody,
        zawodnicy: state.zawodnicy,
        activeCategory: state.activeCategory,
        activeWeight: state.activeWeight,
        activeAthleteOriginalIndex: state.activeAthleteOriginalIndex,
        activeAttemptNr: state.activeAttemptNr,
        timerActive: state.timerActive,
        timerTimeLeft: state.timerTimeLeft,
        // --- START ZMIANY: Pobierz socket i akcje ---
        socket: state.socket,
        setTimerActive: state.setTimerActive,
        setTimerTimeLeft: state.setTimerTimeLeft,
        // --- KONIEC ZMIANY ---
    }));

    const renderStartTime = useRef(null); // Ref do przechowywania czasu startu renderowania

    // Zmierz czas od zmiany stanu do początku renderowania
    useLayoutEffect(() => {
        renderStartTime.current = performance.now();
        console.log('[AthleteViewScreen] Start Render');
    }); // Uruchamia się przed renderowaniem

    // Zmierz czas trwania renderowania
    useEffect(() => {
        if (renderStartTime.current) {
            const renderEndTime = performance.now();
            console.log(`[AthleteViewScreen] Render Duration: ${renderEndTime - renderStartTime.current} ms`);
            renderStartTime.current = null; // Zresetuj na następny render
        }
    }); // Uruchamia się po renderowaniu

    // Logowanie (bez zmian)
    useEffect(() => {
        console.log('[AthleteViewScreen] Store State Update:');
        console.log('  - activeCategory:', activeCategory);
        console.log('  - activeWeight:', activeWeight);
        console.log('  - activeAthleteOriginalIndex:', activeAthleteOriginalIndex);
        console.log('  - zawodnicy count:', zawodnicy?.length);
    }, [activeCategory, activeWeight, activeAthleteOriginalIndex, zawodnicy]);

    // Znajdź aktualnego zawodnika (bez zmian)
    const currentAthlete = useMemo(() => {
        if (activeAthleteOriginalIndex === null || !zawodnicy || zawodnicy.length === 0) {
            console.log('[AthleteViewScreen] Calculating currentAthlete: null (index or zawodnicy missing)');
            return null;
        }
        const athlete = zawodnicy[activeAthleteOriginalIndex];
        if (!athlete) {
             console.log(`[AthleteViewScreen] Calculating currentAthlete: null (athlete not found at index ${activeAthleteOriginalIndex})`);
        } else {
             console.log(`[AthleteViewScreen] Calculating currentAthlete: Found ${athlete.imie} ${athlete.nazwisko}`);
        }
        return athlete;
    }, [zawodnicy, activeAthleteOriginalIndex]);

    // --- POCZĄTEK ZMIANY: Filtruj zawodników dla widoku grupy ---
    const groupAthletes = useMemo(() => {
        if (!activeCategory || !activeWeight || !zawodnicy) return [];
        return zawodnicy
            .map((z, index) => ({
                ...z,
                originalIndex: index,
                isCompleted: hasAthleteCompleted(z)
            }))
            .filter(z => z.kategoria === activeCategory && z.waga === activeWeight)
            .sort((a, b) => {
                // Sortuj wg. ukończenia (nieukończeni pierwsi), potem wg. podejścia 1
                const weightA = Number(a.podejscie1) || 0;
                const weightB = Number(b.podejscie1) || 0;
                if (a.isCompleted !== b.isCompleted) {
                    return a.isCompleted ? 1 : -1;
                }
                return weightA - weightB; // Lub inne kryterium sortowania listy grupy
            });
    }, [zawodnicy, activeCategory, activeWeight]);
    // --- KONIEC ZMIANY ---


    // --- START ZMIANY: Logika lokalnego timera dla AthleteViewScreen ---
    const localTimerIntervalRef = useRef(null);
    const stableSetTimerTimeLeft = useCallback(setTimerTimeLeft, [setTimerTimeLeft]); // Stabilna referencja

    const stopLocalTimer = useCallback(() => {
        if (localTimerIntervalRef.current) {
            console.log('[AthleteViewScreen] Stopping local timer interval.');
            clearInterval(localTimerIntervalRef.current);
            localTimerIntervalRef.current = null;
        }
    }, []); // Pusta tablica zależności, bo używa tylko refa

    const startLocalTimer = useCallback(() => {
        stopLocalTimer(); // Zatrzymaj poprzedni interwał na wszelki wypadek
        console.log('[AthleteViewScreen] Starting local timer interval...');
        localTimerIntervalRef.current = setInterval(() => {
            stableSetTimerTimeLeft(prevTime => {
                // console.log(`[AthleteViewScreen Local Tick] prevTime: ${prevTime}`); // Opcjonalny log
                if (prevTime <= 1) {
                    stopLocalTimer(); // Zatrzymaj interwał
                    // Nie musimy tu ustawiać timerActive na false, bo zrobi to event 'timerStopped'
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }, [stopLocalTimer, stableSetTimerTimeLeft]); // Zależności

    // Efekt do nasłuchiwania na eventy WebSocket
    useEffect(() => {
        if (!socket) {
            console.log('[AthleteViewScreen] Socket not available for listening.');
            return; // Nie rób nic, jeśli socket nie jest połączony
        }
        console.log('[AthleteViewScreen] Setting up socket listeners...');

        const handleTimerStarted = (data) => {
            console.log('[AthleteViewScreen] Received timerStarted event', data);
            setTimerActive(true); // Ustaw stan aktywności
            setTimerTimeLeft(data.timeLeft || 60); // Ustaw czas początkowy
            startLocalTimer(); // Uruchom lokalne odliczanie
        };

        const handleTimerStopped = (data) => {
            console.log('[AthleteViewScreen] Received timerStopped event', data);
            setTimerActive(false); // Zatrzymaj timer w stanie
            stopLocalTimer(); // Zatrzymaj lokalne odliczanie
            // Opcjonalnie: Ustaw finalny czas, jeśli backend go wysyła
            // if (data && data.finalTimeLeft !== undefined) {
            //   setTimerTimeLeft(data.finalTimeLeft);
            // }
        };

        socket.on('timerStarted', handleTimerStarted);
        socket.on('timerStopped', handleTimerStopped);

        // Cleanup listeners on unmount or when socket changes
        return () => {
            console.log('[AthleteViewScreen] Cleaning up socket listeners.');
            socket.off('timerStarted', handleTimerStarted);
            socket.off('timerStopped', handleTimerStopped);
            stopLocalTimer(); // Zatrzymaj lokalny timer przy odmontowaniu
        };
    }, [socket, setTimerActive, setTimerTimeLeft, startLocalTimer, stopLocalTimer]); // Dodaj zależności
    // --- KONIEC ZMIANY: Logika lokalnego timera ---

    return (
        <View style={styles.container}>
            {/* Nagłówek (bez zmian) */}
            <LinearGradient colors={[colors.gradient.start, colors.gradient.end]} style={styles.header}>
                <Text style={styles.competitionTitle}>{zawody.nazwa || 'Zawody'}</Text>
                {/* --- POCZĄTEK ZMIANY: Dodaj info o grupie w nagłówku --- */}
                {activeCategory && activeWeight && (
                    <Text style={styles.groupInfoTitle}>
                        Grupa: {activeCategory} / {activeWeight} kg
                    </Text>
                )}
                {/* --- KONIEC ZMIANY --- */}
            </LinearGradient>

            {/* Główna zawartość */}
            <View style={styles.mainContent}>
                {/* --- POCZĄTEK ZMIANY: Logika wyboru widoku --- */}
                {activeAthleteOriginalIndex !== null && currentAthlete ? (
                    // Widok szczegółowy aktywnego zawodnika
                    <>
                        {/* Informacje o zawodniku */}
                        <View style={styles.athleteInfoCard}>
                            <Text style={styles.athleteName}>{currentAthlete.imie} {currentAthlete.nazwisko}</Text>
                            <Text style={styles.athleteClub}>{currentAthlete.klub || 'Brak klubu'}</Text>
                            <Text style={styles.athleteCategory}>
                                Kat: {currentAthlete.kategoria} / Waga: {currentAthlete.waga} kg
                            </Text>
                        </View>
                        {/* Wyświetlanie podejść */}
                        <View style={styles.attemptsContainer}>
                            <Text style={styles.sectionTitle}>Podejścia</Text>
                            {[1, 2, 3].map((nr) => (
                                <AttemptDisplay
                                    key={nr}
                                    number={nr}
                                    weight={currentAthlete[`podejscie${nr}`]}
                                    status={currentAthlete[`podejscie${nr}Status`]}
                                    isActive={activeAttemptNr === nr}
                                />
                            ))}
                        </View>
                        {/* Wyświetlanie Timera */}
                        <View style={styles.timerSection}>
                             <Text style={styles.sectionTitle}>Czas</Text>
                             <TimerDisplay isActive={timerActive} timeLeft={timerTimeLeft} />
                        </View>
                    </>
                ) : activeCategory && activeWeight ? (
                    // Widok listy zawodników w grupie
                    <View style={styles.groupViewContainer}>
                         <Text style={styles.sectionTitle}>Lista zawodników w grupie</Text>
                         {/* Przekaż activeAthleteOriginalIndex do podświetlenia */}
                         <GroupAthleteList
                            athletes={groupAthletes}
                            currentAthleteOriginalIndex={activeAthleteOriginalIndex}
                         />
                    </View>
                ) : (
                    // Placeholder, gdy nie wybrano grupy
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Wybierz grupę w panelu sędziego...</Text>
                    </View>
                )}
                {/* --- KONIEC ZMIANY --- */}
            </View>
        </View>
    );
}

// --- Style ---
const styles = StyleSheet.create({
    // ... (istniejące style container, header, competitionTitle) ...
    container: { flex: 1, backgroundColor: colors.backgroundDark },
    header: { paddingTop: spacing.xxl, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg, alignItems: 'center', ...shadows.medium },
    competitionTitle: { fontSize: font.sizes['4xl'], fontWeight: font.weights.bold, color: colors.textMainTitle, fontFamily: font.family, textAlign: 'center' },
    // --- POCZĄTEK ZMIANY: Styl dla info o grupie ---
    groupInfoTitle: {
        fontSize: font.sizes.md,
        color: colors.textLight + 'cc',
        marginTop: spacing.xs,
    },
    // --- KONIEC ZMIANY ---
    mainContent: { flex: 1, padding: spacing.xl, justifyContent: 'flex-start', alignItems: 'center' }, // Zmieniono justifyContent
    placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // Dodano flex: 1
    placeholderText: { fontSize: font.sizes['2xl'], color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center' }, // Dodano textAlign
    athleteInfoCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.xl, alignItems: 'center', width: '90%', ...shadows.medium },
    athleteName: { fontSize: font.sizes['3xl'], fontWeight: font.weights.bold, color: colors.primary, marginBottom: spacing.sm, textAlign: 'center' },
    athleteClub: { fontSize: font.sizes.lg, color: colors.textSecondary, marginBottom: spacing.xs, textAlign: 'center' },
    athleteCategory: { fontSize: font.sizes.md, color: colors.textSecondary, textAlign: 'center' },
    sectionTitle: { fontSize: font.sizes.xl, fontWeight: font.weights.semibold, color: colors.text, marginBottom: spacing.md, textAlign: 'center', width: '100%' },
    attemptsContainer: { width: '90%', marginBottom: spacing.xl, alignItems: 'center' },
    attemptBox: { backgroundColor: colors.surfaceVariant, borderRadius: borderRadius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, marginBottom: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderWidth: 2, borderColor: 'transparent' },
    attemptBoxActive: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
    attemptNumber: { fontSize: font.sizes.lg, color: colors.textSecondary, flex: 0.3 }, // Dostosuj flex
    attemptWeight: { fontSize: font.sizes['2xl'], fontWeight: font.weights.bold, color: colors.text, flex: 0.4, textAlign: 'center' }, // Dostosuj flex
    attemptStatus: { flex: 0.3, alignItems: 'flex-end' }, // Dostosuj flex
    timerSection: { width: '90%', alignItems: 'center' },
    timerContainer: {},
    timerText: { fontSize: font.sizes['6xl'], fontWeight: font.weights.bold, color: colors.text, fontFamily: font.familyMono },
    timerWarning: { color: colors.warning },
    timerFinished: { color: colors.error },

    // --- POCZĄTEK ZMIANY: Style dla widoku listy grupy ---
    groupViewContainer: {
        width: '95%', // Szerszy kontener dla listy
        flex: 1, // Aby zajął dostępną przestrzeń
    },
    groupListScroll: {
        flex: 1,
        width: '100%',
    },
    groupListItem: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.small,
    },
    groupListItemCompleted: {
         backgroundColor: colors.surfaceVariant + '99',
         opacity: 0.8,
    },
    groupListRank: {
        width: 30,
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    groupListRankText: {
        fontSize: font.sizes.sm,
        color: colors.textSecondary,
        fontWeight: font.weights.medium,
    },
    groupListInfo: {
        flex: 1, // Zajmuje większość miejsca
        marginRight: spacing.sm,
    },
    groupListName: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.semibold,
        color: colors.text,
    },
    groupListClub: {
        fontSize: font.sizes.xs,
        color: colors.textSecondary,
    },
    groupListAttempts: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        minWidth: 120, // Stała szerokość dla kolumny podejść
    },
    groupListAttempt: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: spacing.sm,
        minWidth: 35, // Minimalna szerokość dla pojedynczego podejścia
        justifyContent: 'flex-end',
    },
    groupListAttemptWeight: {
        fontSize: font.sizes.sm,
        color: colors.text,
        marginRight: spacing.xxs,
    },
     groupListCompletedIcon: {
        marginLeft: spacing.sm,
     },
    // Dodaj styl dla aktywnego elementu listy grupy
    groupListItemActive: {
        backgroundColor: colors.primary + '20', // Lekkie tło primary
        borderColor: colors.primary,
        borderWidth: 1,
    }
    // --- KONIEC ZMIANY ---
});