import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import useCompetitionStore from '../store/useCompetitionStore.js';
import AttemptDisplay from '../components/athleteView/AttemptDisplay';
import FinalAthleteViewTimerDisplay from '../components/athleteView/AthleteViewTimerDisplay';
import NextAthleteUp from '../components/athleteView/NextAthleteUp';
import PodiumDisplay from '../components/athleteView/PodiumDisplay';
import GroupAthleteList from '../components/athleteView/GroupAthleteList';
import AttemptResultAnimation from '../components/competition/AttemptResultAnimation.js';
import TemporaryResultsViewer from '../components/athleteView/TemporaryResultsViewer';
import IndividualResultsTable from '../components/results/IndividualResultsTable';
import { processAthletesForResults, sortIndividualResults } from '../components/results/resultsHelper';
import { colors, font, spacing, borderRadius, shadows } from '../theme/theme.js';

// DODANE: Importuj nowe logotypy
import startStrzegomLogo from '../assets/images/logo_start_resized.png';
import relaxKamiennaGoraLogo from '../assets/images/logo_kamienna_resized.png';

// Helper functions (ensure they are defined or imported)
const getAthleteDeclaredWeightForRound = (athlete, round) => {
    if (!athlete) return 0;
    const weightStr = athlete[`podejscie${round}`];
    return parseFloat(String(weightStr).replace(',', '.')) || 0;
};
const hasAthleteCompletedAll = (athlete) => {
  if (!athlete) return false;
  return !!(athlete.podejscie1Status && athlete.podejscie2Status && athlete.podejscie3Status);
};

const ANIMATION_DURATION = 2000;
const TEMP_RESULTS_DISPLAY_DURATION = 5000;


export default function AthleteViewScreen() {
    const {
        zawodnicy,
        activeCategory,
        activeWeight,
        socket,
        activeAthleteOriginalIndex,
        activeAttemptNr,
        timerActive,
        timerTimeLeft,
        zawody,
        attemptResultForAnimation,
        setAttemptResultForAnimation,
        clearAttemptResultForAnimation,
    } = useCompetitionStore(state => ({
        zawodnicy: state.zawodnicy,
        activeCategory: state.activeCategory,
        activeWeight: state.activeWeight,
        socket: state.socket,
        activeAthleteOriginalIndex: state.activeAthleteOriginalIndex,
        activeAttemptNr: state.activeAttemptNr,
        timerActive: state.timerActive,
        timerTimeLeft: state.timerTimeLeft,
        zawody: state.zawody,
        attemptResultForAnimation: state.attemptResultForAnimation,
        setAttemptResultForAnimation: state.setAttemptResultForAnimation,
        clearAttemptResultForAnimation: state.clearAttemptResultForAnimation,
    }));

    const [showManuallyRequestedResultsForGroup, setShowManuallyRequestedResultsForGroup] = useState(null);
    const [showAnimation, setShowAnimation] = useState(false);
    const [animationSuccess, setAnimationSuccess] = useState(false);
    const animationTimeoutRef = useRef(null);
    const [temporaryResultsInfo, setTemporaryResultsInfo] = useState(null);
    const tempResultsTimeoutRef = useRef(null);

    useEffect(() => {
        if (socket) {
            const handleAttemptAnimationEvent = (data) => {
                if (data && data.athleteOriginalIndex) {
                    setAttemptResultForAnimation(data);
                }
            };
            const handleDisplayCategoryResults = (data) => {
                if (data && data.category && data.weightClass) {
                    setShowManuallyRequestedResultsForGroup({ category: data.category, weight: data.weightClass });
                    setTemporaryResultsInfo(null); 
                    setShowAnimation(false); 
                    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
                    if (tempResultsTimeoutRef.current) clearTimeout(tempResultsTimeoutRef.current);
                }
            };

            socket.on('attemptAnimationTriggered', handleAttemptAnimationEvent);
            socket.on('displayCategoryResults', handleDisplayCategoryResults);
            return () => {
                socket.off('attemptAnimationTriggered', handleAttemptAnimationEvent);
                socket.off('displayCategoryResults', handleDisplayCategoryResults);
            };
        }
    }, [socket, setAttemptResultForAnimation]);

    useEffect(() => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        const animationIsForCurrentContext = attemptResultForAnimation &&
            (attemptResultForAnimation.athleteOriginalIndex === activeAthleteOriginalIndex || activeAthleteOriginalIndex === null);

        if (animationIsForCurrentContext) {
            setAnimationSuccess(attemptResultForAnimation.success);
            setShowAnimation(true);
            setTemporaryResultsInfo(null);
            setShowManuallyRequestedResultsForGroup(null); // Ukryj wyniki manualne, jeśli animacja jest dla aktywnego zawodnika
            const { category, weightClass } = attemptResultForAnimation;
            animationTimeoutRef.current = setTimeout(() => {
                setShowAnimation(false);
                clearAttemptResultForAnimation();
                if (category && weightClass) {
                    setTemporaryResultsInfo({ category, weightClass });
                }
            }, ANIMATION_DURATION);
        } else if (!attemptResultForAnimation && showAnimation) {
            setShowAnimation(false);
        }
        return () => {
            if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        };
    }, [attemptResultForAnimation, clearAttemptResultForAnimation, activeAthleteOriginalIndex]);

    // ZMODYFIKOWANY useEffect do obsługi przełączania widoku
    useEffect(() => {
        // Jeśli wyniki manualne są aktualnie wyświetlane,
        // a sędzia wybrał aktywnego zawodnika (activeAthleteOriginalIndex nie jest null),
        // ukryj wyniki manualne, aby pokazać widok aktywnego zawodnika.
        if (showManuallyRequestedResultsForGroup && activeAthleteOriginalIndex !== null) {
            setShowManuallyRequestedResultsForGroup(null);
        }
    }, [activeAthleteOriginalIndex, showManuallyRequestedResultsForGroup]);

    const currentAthlete = useMemo(() => {
        if (activeAthleteOriginalIndex === null || !zawodnicy || zawodnicy.length === 0) return null;
        return zawodnicy.find(z => z.originalIndex === activeAthleteOriginalIndex);
    }, [zawodnicy, activeAthleteOriginalIndex]);

    const groupAthletes = useMemo(() => {
        if (!activeCategory || !activeWeight || !zawodnicy) return [];
        return zawodnicy
            .filter(z => z.kategoria === activeCategory && String(z.waga) === String(activeWeight))
            .map(z => ({...z, isCompleted: hasAthleteCompletedAll(z) }))
            .sort((a, b) => {
                // Sort by completion status first (not completed first)
                if (a.isCompleted !== b.isCompleted) {
                    return a.isCompleted ? 1 : -1;
                }
                // Then by declared weight for the current round (lower first)
                const weightA = parseFloat(String(a.podejscie1).replace(',', '.')) || Infinity; // Assuming round 1 for general sorting, adjust if needed
                const weightB = parseFloat(String(b.podejscie1).replace(',', '.')) || Infinity;
                if (weightA !== weightB) {
                    return weightA - weightB;
                }
                // Finally by starting number (lower first)
                const indexA = parseInt(String(a.nrStartowy || a.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
                const indexB = parseInt(String(b.nrStartowy || b.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
                return indexA - indexB;
            });
    }, [zawodnicy, activeCategory, activeWeight]);

    const nextAthleteData = useMemo(() => {
        if (!currentAthlete || !activeCategory || !activeWeight || !zawodnicy || zawodnicy.length === 0) return null;

        const currentGlobalRound = activeAttemptNr; // Use activeAttemptNr as the current round context
        const athletesInCurrentGroup = zawodnicy.filter(z => z.kategoria === activeCategory && String(z.waga) === String(activeWeight));

        if (athletesInCurrentGroup.length === 0) return null;

        // Filter for athletes who are:
        // 1. Not the current athlete
        // 2. Have NOT completed their attempt in the current round
        const upcomingAthletesForRound = athletesInCurrentGroup
            .filter(athlete => {
                const isNotCurrent = athlete.originalIndex !== currentAthlete.originalIndex;
                const attemptStatus = athlete[`podejscie${currentGlobalRound}Status`];
                const hasNotCompletedAttempt = attemptStatus === null || attemptStatus === undefined;
                return isNotCurrent && hasNotCompletedAttempt;
            })
            .sort((a, b) => { // Sort by declared weight for the current round, then by starting number
                const weightA = getAthleteDeclaredWeightForRound(a, currentGlobalRound);
                const weightB = getAthleteDeclaredWeightForRound(b, currentGlobalRound);
                if (weightA === weightB) {
                    const indexA = parseInt(String(a.nrStartowy || a.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
                    const indexB = parseInt(String(b.nrStartowy || b.originalIndex).replace(/[^0-9]/g, ''), 10) || Infinity;
                    return indexA - indexB;
                }
                return weightA - weightB;
            });

        if (upcomingAthletesForRound.length > 0) {
            const foundNextAthlete = upcomingAthletesForRound[0];
            const declaredWeight = getAthleteDeclaredWeightForRound(foundNextAthlete, currentGlobalRound);
            return {
                imie: foundNextAthlete.imie,
                nazwisko: foundNextAthlete.nazwisko,
                klub: foundNextAthlete.klub || 'Brak klubu',
                attemptInfo: `Runda ${currentGlobalRound} (${declaredWeight ? String(declaredWeight).replace(',', '.') + 'kg' : 'Brak deklaracji'})`,
            };
        }
        return null;
    }, [currentAthlete, zawodnicy, activeCategory, activeWeight, activeAttemptNr]);


    const podiumAthletes = useMemo(() => {
        if (!activeCategory || !activeWeight || !zawodnicy || zawodnicy.length === 0) return [];
        const athletesInCatWeight = zawodnicy.filter(z => z.kategoria === activeCategory && String(z.waga) === String(activeWeight));
        if (athletesInCatWeight.length === 0) return [];

        const processed = processAthletesForResults(athletesInCatWeight);
        const sorted = sortIndividualResults(processed);
        return sorted.slice(0, 3).map((athlete, index) => ({ ...athlete, rank: index + 1 }));
    }, [zawodnicy, activeCategory, activeWeight]);


    const shouldShowNextUp = currentAthlete && nextAthleteData && !showManuallyRequestedResultsForGroup && !temporaryResultsInfo && !showAnimation;
    const shouldShowPodium = podiumAthletes.length > 0 && !showManuallyRequestedResultsForGroup && !temporaryResultsInfo && !showAnimation && currentAthlete;


    // --- Render Logic ---
    if (showAnimation) {
        return (
            <View style={styles.animationOverlay}>
                <AttemptResultAnimation success={animationSuccess} />
            </View>
        );
    }

    if (temporaryResultsInfo) {
        return (
            <TemporaryResultsViewer
                category={temporaryResultsInfo.category}
                weightClass={temporaryResultsInfo.weightClass}
                onDismiss={() => setTemporaryResultsInfo(null)}
            />
        );
    }

    if (showManuallyRequestedResultsForGroup) {
        const athletesForTable = zawodnicy.filter(
            z => z.kategoria === showManuallyRequestedResultsForGroup.category && String(z.waga) === String(showManuallyRequestedResultsForGroup.weight)
        );
        const processedData = processAthletesForResults(athletesForTable);
        const sortedData = sortIndividualResults(processedData).map((item, index) => ({ ...item, rank: index + 1 }));
        return (
            <View style={[styles.container, styles.resultsViewContainer]}>
                <Text style={styles.resultsTitle}>
                    Wyniki Grupy: {showManuallyRequestedResultsForGroup.category} - {showManuallyRequestedResultsForGroup.weight} kg
                </Text>
                {sortedData.length > 0 ? (
                    <ScrollView contentContainerStyle={{paddingBottom: 60, width: '100%'}}>
                        <IndividualResultsTable data={sortedData} />
                    </ScrollView>
                ) : (
                    <Text style={styles.placeholderText}>Brak danych do wyświetlenia dla tej grupy.</Text>
                )}
                {/* USUNIĘTY PRZYCISK "Zamknij Wyniki" STĄD */}
            </View>
        );
    }

    return (
        <LinearGradient colors={[colors.backgroundDark, colors.primaryDarker || '#101d5a']} style={styles.container}>
            <View style={styles.header}>
                {/* ZMIENIONE: Użycie statycznych logotypów */}
                <Image source={startStrzegomLogo} style={styles.logoLeft} resizeMode="contain" />
                <Text style={styles.competitionName} numberOfLines={2}>{zawody?.nazwa || 'Zawody Wyciskania Sztangi Leżąc'}</Text>
                <Image source={relaxKamiennaGoraLogo} style={styles.logoRight} resizeMode="contain" />
            </View>

            <View style={styles.mainContent}>
                {currentAthlete ? (
                    <ScrollView contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.athleteDetailContainer}>
                            {/* New container for AthleteInfoCard and Timer */}
                            <View style={styles.athleteInfoTimerRow}>
                                <View style={styles.athleteInfoCardWrapper}>
                                    <View style={styles.athleteInfoCard}>
                                        <Text style={styles.athleteName}>
                                            {currentAthlete.imie} {currentAthlete.nazwisko}
                                        </Text>
                                        <Text style={styles.athleteClub}>
                                            {currentAthlete.klub || 'Brak klubu'}
                                        </Text>
                                        <View style={styles.athleteMetaRow}>
                                            <Text style={styles.athleteCategory}>
                                                {currentAthlete.kategoria} / {currentAthlete.waga}kg
                                            </Text>
                                            <Text style={styles.athleteRoundInfo}>
                                                # Runda: {activeAttemptNr || '-'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {timerActive && activeAthleteOriginalIndex === currentAthlete.originalIndex && (
                                    <View style={styles.timerWrapper}>
                                        <FinalAthleteViewTimerDisplay isActive={timerActive} timeLeft={timerTimeLeft} />
                                    </View>
                                )}
                            </View>

                            <View style={styles.attemptsRowContainer}>
                                {[1,2,3].map(num => (
                                    <AttemptDisplay
                                        key={num}
                                        number={num}
                                        weight={currentAthlete[`podejscie${num}`]}
                                        status={currentAthlete[`podejscie${num}Status`]}
                                        isActive={num === activeAttemptNr && activeAthleteOriginalIndex === currentAthlete.originalIndex}
                                    />
                                ))}
                            </View>

                            <View style={styles.bottomInfoContainer}>
                                {shouldShowNextUp && <NextAthleteUp athlete={nextAthleteData} />}
                                {shouldShowPodium && <PodiumDisplay athletes={podiumAthletes} />}
                            </View>
                        </View>
                    </ScrollView>
                ) : activeCategory && activeWeight ? (
                     <View style={styles.groupViewContainer}>
                         <Text style={styles.groupHeader}>Grupa: {activeCategory} - {activeWeight}kg</Text>
                         <GroupAthleteList
                            athletes={groupAthletes}
                            currentAthleteOriginalIndex={null}
                         />
                    </View>
                ) : (
                    // ... (istniejący placeholder)
                    <View style={styles.placeholderContainer}>
                        <MaterialCommunityIcons name="trophy-variant-outline" size={80} color={colors.textLight + '55'} />
                        <Text style={styles.placeholderText}>Wybierz kategorię i wagę w panelu sędziego, aby zobaczyć listę zawodników lub aktywnego zawodnika.</Text>
                        <Text style={styles.placeholderSubText}>Ekran widowni jest gotowy!</Text>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg, // Ten padding już zapewnia odstęp, ale możemy dodać marginesy do samych logo
        paddingTop: Platform.OS === 'web' ? spacing.md : spacing.xl + spacing.sm,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary + '50',
    },
    logoLeft: { 
        width: (Platform.OS === 'web' ? 120 : 100) * 2.5, 
        height: (Platform.OS === 'web' ? 60 : 50) * 2.5,  
        alignSelf: 'center',
        marginLeft: spacing.lg, // DODANO: Odstęp od lewej krawędzi
    },
    logoRight: { 
        width: (Platform.OS === 'web' ? 80 : 70) * 2, 
        height: (Platform.OS === 'web' ? 80 : 70) * 2,
        borderRadius: (Platform.OS === 'web' ? 40 : 35) * 2, 
        alignSelf: 'center',
        backgroundColor: colors.surface + '22', 
        marginRight: spacing.lg, // DODANO: Odstęp od prawej krawędzi
    },
    competitionName: {
        fontSize: Platform.OS === 'web' ? font.sizes['3xl'] : font.sizes['2xl'],
        fontWeight: font.weights.bold,
        color: colors.textLight,
        textAlign: 'center',
        flex: 1, 
        marginHorizontal: spacing.sm,
    },
    mainContent: {
        flex: 1,
        padding: spacing.md,
    },
    scrollContentContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: spacing.xl,
    },
    athleteDetailContainer: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        maxWidth: 1200,
        paddingHorizontal: Platform.OS === 'web' ? spacing.xl : spacing.sm,
    },
    athleteInfoTimerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: spacing.lg,
        gap: spacing.lg,
    },
    athleteInfoCardWrapper: {
        flex: 1,
        maxWidth: 700,
    },
    athleteInfoCard: {
        backgroundColor: colors.surface + '1A',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        width: '100%',
        ...shadows.medium,
    },
    athleteName: {
        fontSize: font.sizes['4xl'],
        fontWeight: font.weights.bold,
        color: colors.textLight,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    athleteClub: {
        fontSize: font.sizes.xl,
        color: colors.textLight + 'cc',
        fontStyle: 'italic',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    athleteMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginTop: spacing.sm,
    },
    athleteCategory: {
        fontSize: font.sizes.lg,
        color: colors.textLight + 'aa',
    },
    athleteRoundInfo: {
        fontSize: font.sizes.lg,
        color: colors.accent,
        fontWeight: font.weights.semibold,
    },
    timerWrapper: {
        alignItems: 'center',
    },
    attemptsRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'center', 
        marginVertical: spacing.lg,
        gap: spacing.lg, 
        width: '100%',
        paddingHorizontal: spacing.sm, 
    },
    bottomInfoContainer: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: '100%',
        marginTop: spacing.lg,
        gap: spacing.lg,
    },
    groupViewContainer: {
        flex: 1,
        alignItems: 'center',
    },
    groupHeader: {
        fontSize: font.sizes['2xl'],
        fontWeight: font.weights.bold,
        color: colors.textLight,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    placeholderText: {
        fontSize: font.sizes.xl,
        color: colors.textLight + 'cc',
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.md,
        lineHeight: font.sizes.xl * 1.4,
    },
    placeholderSubText: {
        fontSize: font.sizes.lg,
        color: colors.textLight + '88',
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    animationOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    resultsViewContainer: { // Styl dla kontenera wyników manualnych
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl, // Dodajemy padding na dole, jeśli przycisk jest usunięty
        backgroundColor: colors.backgroundDark, // Upewnij się, że tło jest spójne
        alignItems: 'center',
    },
    resultsTitle: {
        fontSize: font.sizes['2xl'],
        fontWeight: font.weights.bold,
        color: colors.textLight,
        marginVertical: spacing.lg,
        textAlign: 'center',
    },
    // Styl closeResultsButton i closeResultsButtonText można usunąć, jeśli przycisk jest całkowicie usuwany
    // Jeśli jednak chcesz go zachować gdzieś indziej, pozostaw style.
    // Na potrzeby tego zadania, zakładam, że przycisk jest usuwany całkowicie z tego widoku.
});