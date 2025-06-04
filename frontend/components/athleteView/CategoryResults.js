import { Animated, View, Text, StyleSheet, ScrollView } from 'react-native'; // Dodano View, Text, StyleSheet, ScrollView
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme'; // Upewnij się, że theme jest zaimportowany
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Dla ikon trofeów
import React, { useMemo, useEffect, useState } from 'react'; // Dodano React, useMemo, useEffect, useState

// IPF GL Points Coefficients
const IPF_COEFFICIENTS = {
    M: { a: 0.00023249, b: -0.0243693, c: 0.821122 }, // Men
    K: { a: 0.0000751124, b: -0.0133246, c: 0.718766 }, // Women
};

// Calculate IPF GL Points
const calculateIPFPoints = (liftedWeight, bodyWeight, gender) => {
    if (!liftedWeight || !bodyWeight || !gender || !(gender.toUpperCase() in IPF_COEFFICIENTS)) {
        return 0;
    }
    const genderKey = gender.toUpperCase();
    const { a, b, c } = IPF_COEFFICIENTS[genderKey];
    const denominator = (a * bodyWeight * bodyWeight) + (b * bodyWeight) + c;
    
    if (denominator <= 0) {
        return 0;
    }
    return (liftedWeight / denominator) * 100;
};

// Get best successful lift
const getBestLiftedWeight = (athlete) => {
    const attempts = [
        { weight: parseFloat(String(athlete.podejscie1).replace(',', '.')) || 0, status: athlete.podejscie1Status },
        { weight: parseFloat(String(athlete.podejscie2).replace(',', '.')) || 0, status: athlete.podejscie2Status },
        { weight: parseFloat(String(athlete.podejscie3).replace(',', '.')) || 0, status: athlete.podejscie3Status }
    ];
    
    const passedWeights = attempts
        .filter(attempt => attempt.status === 'passed' && attempt.weight > 0)
        .map(attempt => attempt.weight);
    
    return passedWeights.length > 0 ? Math.max(...passedWeights) : 0;
};

const CategoryResults = ({ athletes, category, weightClass }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    const resultsData = useMemo(() => {
        if (!athletes) return [];
        return athletes
            .map(athlete => {
                const bestLift = getBestLiftedWeight(athlete);
                const bodyWeight = parseFloat(String(athlete.wagaCiala).replace(',', '.')) || 0;
                const gender = athlete.plec && athlete.plec.length > 0 ? athlete.plec[0].toUpperCase() : 'M'; // Domyślnie M, jeśli brak
                const ipfPoints = calculateIPFPoints(bestLift, bodyWeight, gender);

                return {
                    ...athlete,
                    id: athlete.id || athlete.originalIndex, // Użyj id lub originalIndex jako klucz
                    bestLift,
                    bodyWeight,
                    ipfPoints,
                    attempt1: { weight: parseFloat(String(athlete.podejscie1).replace(',', '.')) || null, status: athlete.podejscie1Status },
                    attempt2: { weight: parseFloat(String(athlete.podejscie2).replace(',', '.')) || null, status: athlete.podejscie2Status },
                    attempt3: { weight: parseFloat(String(athlete.podejscie3).replace(',', '.')) || null, status: athlete.podejscie3Status },
                };
            })
            .sort((a, b) => b.ipfPoints - a.ipfPoints || b.bestLift - a.bestLift); // Sortuj po IPF, potem po najlepszym podniesieniu
    }, [athletes]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const renderTrophyIcon = (position) => {
        const iconSize = 20;
        // Użyj 'trophy-award' jako ogólnej ikony i zastosuj odpowiedni kolor
        if (position === 0) return <MaterialCommunityIcons name="trophy-award" size={iconSize} color="#FFD700" style={styles.trophyIcon} />;
        if (position === 1) return <MaterialCommunityIcons name="trophy-award" size={iconSize} color="#C0C0C0" style={styles.trophyIcon} />;
        if (position === 2) return <MaterialCommunityIcons name="trophy-award" size={iconSize} color="#CD7F32" style={styles.trophyIcon} />;
        return <View style={styles.rankPlaceholder} />; // Placeholder dla wyrównania
    };
    
    if (resultsData.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Brak danych do wyświetlenia wyników.</Text>
                <Text style={styles.emptySubText}>Upewnij się, że zawodnicy w tej kategorii zakończyli swoje podejścia.</Text>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.headerContainer}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.weightTitle}>{weightClass} KG</Text>
                <Text style={styles.resultsTitle}>Oficjalne Wyniki Końcowe</Text>
            </View>
            <View style={styles.tableHeader}>
                <Text style={[styles.headerText, styles.rankHeader]}>Msc.</Text>
                <Text style={[styles.headerText, styles.nameHeader]}>Zawodnik</Text>
                <Text style={[styles.headerText, styles.statsHeader]}>Wynik</Text>
                <Text style={[styles.headerText, styles.attemptsHeader]}>Podejścia [kg]</Text>
                <Text style={[styles.headerText, styles.pointsHeader]}>IPF GL</Text>
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {resultsData.map((item, index) => (
                    <View key={item.id} style={[styles.resultRow, index < 3 && styles.topThreeRow, index % 2 !== 0 && index >=3 && styles.alternateRow]}>
                        <View style={styles.rankContainer}>
                            <Text style={[styles.rankText, index < 3 && styles.topThreeText]}>{index + 1}</Text>
                            {renderTrophyIcon(index)}
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={[styles.nameText, index < 3 && styles.topThreeText]} numberOfLines={1}>{item.imie} {item.nazwisko}</Text>
                            <Text style={styles.clubText} numberOfLines={1}>{item.klub || 'Brak klubu'}</Text>
                        </View>
                        <View style={styles.statsContainer}>
                             <Text style={[styles.statText, index < 3 && styles.topThreeText]}>{item.bestLift} kg</Text>
                             <Text style={styles.bodyWeightText}>({item.bodyWeight > 0 ? item.bodyWeight.toFixed(1) : '-'} kg)</Text>
                        </View>
                        <View style={styles.attemptsColumn}>
                            {[item.attempt1, item.attempt2, item.attempt3].map((attempt, attemptIdx) => (
                                <View 
                                    key={attemptIdx} 
                                    style={[
                                        styles.attemptBox,
                                        attempt?.status === 'passed' && styles.attemptPassed,
                                        attempt?.status === 'failed' && styles.attemptFailed,
                                        !attempt?.status && attempt?.weight && styles.attemptDeclared,
                                        !attempt?.weight && styles.attemptEmpty,
                                    ]}
                                >
                                    <Text style={[
                                        styles.attemptText,
                                        (attempt?.status === 'passed' || attempt?.status === 'failed') && styles.attemptResultText,
                                        !attempt?.weight && styles.attemptTextEmpty,
                                    ]}>
                                        {attempt?.weight !== null ? String(attempt.weight) : '-'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.pointsContainer}>
                            <Text style={[styles.pointsValue, index < 3 && styles.topThreePoints]}>{item.ipfPoints.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface, 
        borderRadius: borderRadius.xl,
        ...shadows.large, 
        overflow: 'hidden',
        width: '100%',
        maxWidth: 900, 
        alignSelf: 'center',
        marginVertical: spacing.lg, 
    },
    headerContainer: {
        backgroundColor: colors.primary, 
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: colors.secondary, 
    },
    categoryTitle: {
        fontSize: font.sizes.xl,
        fontWeight: font.weights.semibold,
        color: colors.textLight,
        opacity: 0.9,
    },
    weightTitle: {
        fontSize: font.sizes['3xl'],
        fontWeight: font.weights.bold,
        color: colors.textLight,
        marginVertical: spacing.xs,
    },
    resultsTitle: {
        fontSize: font.sizes.lg,
        fontWeight: font.weights.medium,
        color: colors.textLight + 'cc', 
        letterSpacing: 0.5,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surfaceVariant, 
    },
    headerText: {
        fontSize: font.sizes.sm,
        fontWeight: font.weights.bold,
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    rankHeader: { width: 60, textAlign: 'center' }, // Zmniejszono
    nameHeader: { flex: 2.5 }, // Zmniejszono
    statsHeader: { flex: 1.5, textAlign: 'center' }, // Zmniejszono
    attemptsHeader: { flex: 2.5, textAlign: 'center' }, // Nowa kolumna
    pointsHeader: { flex: 1.5, textAlign: 'right' },
    listContent: {
        paddingBottom: spacing.lg,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    topThreeRow: {
        backgroundColor: colors.primary + '15', 
    },
    alternateRow: {
        backgroundColor: colors.background + '50', 
    },
    rankContainer: {
        width: 60, // Zmniejszono
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: font.sizes.lg,
        fontWeight: font.weights.bold,
        color: colors.text,
    },
    trophyIcon: {
        marginLeft: spacing.xs,
    },
    rankPlaceholder: {
        width: 20, // Dostosowano do iconSize
        height: 20,
        marginLeft: spacing.xs,
    },
    nameContainer: {
        flex: 2.5, // Zmniejszono
        paddingRight: spacing.sm,
    },
    nameText: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.semibold,
        color: colors.text,
    },
    clubText: {
        fontSize: font.sizes.sm,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    statsContainer: {
        flex: 1.5, // Zmniejszono
        alignItems: 'center',
        paddingHorizontal: spacing.xs,
    },
    statText: {
        fontSize: font.sizes.md,
        fontWeight: font.weights.medium,
        color: colors.text,
    },
    bodyWeightText: {
        fontSize: font.sizes.xs,
        color: colors.textSecondary,
    },
    // Style dla kolumny z podejściami
    attemptsColumn: {
        flex: 2.5, // Nowa kolumna
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: spacing.xs,
    },
    attemptBox: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.sm,
        minWidth: 36, // Minimalna szerokość dla czytelności
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
        borderWidth: 1,
        height: 30, // Stała wysokość dla wyrównania
    },
    attemptText: {
        fontSize: font.sizes.sm, // Zmniejszono dla zwięzłości
        fontWeight: font.weights.medium,
        color: colors.text,
    },
    attemptPassed: {
        backgroundColor: colors.success,
        borderColor: colors.successDark || colors.success,
    },
    attemptFailed: {
        backgroundColor: colors.error,
        borderColor: colors.errorDark || colors.error,
    },
    attemptDeclared: {
        backgroundColor: colors.surfaceVariant + 'A0', // Półprzezroczyste tło dla zadeklarowanych
        borderColor: colors.border,
    },
    attemptEmpty: { // Kiedy nie ma podejścia (ani wagi, ani statusu)
        backgroundColor: colors.background + '70',
        borderColor: colors.borderLight,
    },
    attemptResultText: {
        color: colors.textLight, // Biały tekst na kolorowym tle (passed/failed)
        fontWeight: font.weights.bold,
    },
    attemptTextEmpty: {
        color: colors.textSecondary,
    },
    pointsContainer: {
        flex: 1.5,
        alignItems: 'flex-end',
    },
    pointsValue: {
        fontSize: font.sizes.lg,
        fontWeight: font.weights.bold,
        color: colors.primary,
    },
    topThreeText: { 
        fontWeight: font.weights.bold,
    },
    topThreePoints: { 
        color: colors.accent, 
        fontSize: font.sizes.xl,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        margin: spacing.lg,
    },
    emptyText: {
        fontSize: font.sizes.lg,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    emptySubText: {
        fontSize: font.sizes.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: font.sizes.sm * 1.5,
    }
});

export default CategoryResults;