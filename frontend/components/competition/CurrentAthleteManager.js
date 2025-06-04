import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; // Dodaj MaterialIcons dla ołówka
import { styles } from '../../styles/CompetitionStyles/CurrentAthleteManager.styles'; // Upewnij się, że importujesz poprawne style
import { colors, spacing } from '../../theme/theme';

const CurrentAthleteManager = ({
    athlete,
    athleteOriginalIndex,
    currentAttemptNr,
    onAttemptStatusChange,
    onWeightChange,
    isSaving,
    currentRoundForDisplay
}) => {
    // Stan do śledzenia, które podejście jest edytowane (jeśli jest to historyczne podejście)
    // Format: { attemptNo: 1, originalStatus: 'passed', originalWeight: '100' } lub null
    const [editingHistoricalAttempt, setEditingHistoricalAttempt] = useState(null);

    useEffect(() => {
        // Resetuj tryb edycji historycznej, jeśli zmieni się zawodnik lub aktywne podejście
        setEditingHistoricalAttempt(null);
    }, [athleteOriginalIndex, currentAttemptNr]);


    if (!athlete) {
        // Użyj stylu noAthleteText z CurrentAthleteManager.styles.js
        return <Text style={styles.noAthleteText}>Wybierz zawodnika z listy.</Text>;
    }

    const getStatusIconDisplay = (status, size = 24) => {
        if (status === 'passed') return <AntDesign name="checkcircle" size={size} color={colors.success} style={styles.statusIcon} />;
        if (status === 'failed') return <AntDesign name="closecircle" size={size} color={colors.error} style={styles.statusIcon} />;
        return <AntDesign name="clockcircleo" size={size} color={colors.textSecondary} style={styles.statusIcon} />;
    };

    const handleWeightInputChange = (attemptNo, text) => {
        const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');
        onWeightChange(athleteOriginalIndex, attemptNo, numericValue);
    };

    const startEditHistorical = (attemptNo) => {
        setEditingHistoricalAttempt({
            attemptNo,
            originalStatus: athlete[`podejscie${attemptNo}Status`],
            originalWeight: athlete[`podejscie${attemptNo}`],
        });
    };

    const cancelEditHistorical = () => {
        if (editingHistoricalAttempt) {
            // Przywróć oryginalne wartości (opcjonalne, zależy od logiki zapisu)
            // onWeightChange(athleteOriginalIndex, editingHistoricalAttempt.attemptNo, editingHistoricalAttempt.originalWeight);
            // onAttemptStatusChange(athleteOriginalIndex, editingHistoricalAttempt.attemptNo, editingHistoricalAttempt.originalStatus);
        }
        setEditingHistoricalAttempt(null);
    };

    const renderAttemptRow = (attemptNo) => {
        const weight = athlete[`podejscie${attemptNo}`];
        const status = athlete[`podejscie${attemptNo}Status`];
        
        // Czy to podejście jest aktualnie aktywne (zgodnie z currentAttemptNr ze store) LUB czy jest to historyczne podejście w trybie edycji
        const isEffectivelyActiveForEditing = (editingHistoricalAttempt && editingHistoricalAttempt.attemptNo === attemptNo) || (!editingHistoricalAttempt && currentAttemptNr === attemptNo);
        
        // Czy można edytować ciężar: jeśli jest aktywne do edycji I nie ma jeszcze statusu LUB jest to historyczne podejście w trybie edycji
        const isWeightEditable = (isEffectivelyActiveForEditing && !status) || (editingHistoricalAttempt && editingHistoricalAttempt.attemptNo === attemptNo);

        // Czy pokazać przyciski Zalicz/Spal: jeśli jest aktywne do edycji I nie ma jeszcze statusu LUB jest to historyczne podejście w trybie edycji
        const showActionButtons = isEffectivelyActiveForEditing || (editingHistoricalAttempt && editingHistoricalAttempt.attemptNo === attemptNo);

        // Czy pokazać ikonę ołówka: jeśli podejście ma status I NIE jest aktualnie edytowane historycznie
        const showEditIcon = status && (!editingHistoricalAttempt || editingHistoricalAttempt.attemptNo !== attemptNo);


        return (
            <View key={attemptNo} style={[styles.attemptRow, isEffectivelyActiveForEditing && !status && styles.attemptRowActive]}>
                <Text style={styles.attemptNumber}>P. {attemptNo}</Text>
                <View style={styles.attemptWeightContainer}>
                    {isWeightEditable && !isSaving ? (
                        <TextInput
                            style={styles.attemptWeightInput}
                            value={String(weight || '')}
                            onChangeText={(text) => handleWeightInputChange(attemptNo, text)}
                            keyboardType="numeric"
                            placeholder="0"
                            editable={!isSaving}
                        />
                    ) : (
                        <Text style={styles.attemptWeightText}>{weight || '-'}</Text>
                    )}
                    <Text style={styles.attemptUnit}>kg</Text>
                </View>

                <View style={styles.attemptStatusActions}>
                    {status && !showActionButtons && getStatusIconDisplay(status)}
                    
                    {showActionButtons && !isSaving && (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.passButton, isSaving && styles.actionButtonDisabled]}
                                onPress={() => {
                                    onAttemptStatusChange(athleteOriginalIndex, attemptNo, 'passed');
                                    if (editingHistoricalAttempt) setEditingHistoricalAttempt(null);
                                }}
                                disabled={isSaving}
                            >
                                <AntDesign name="check" size={16} color={colors.textLight} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.failButton, isSaving && styles.actionButtonDisabled]}
                                onPress={() => {
                                    onAttemptStatusChange(athleteOriginalIndex, attemptNo, 'failed');
                                    if (editingHistoricalAttempt) setEditingHistoricalAttempt(null);
                                }}
                                disabled={isSaving}
                            >
                                <AntDesign name="close" size={16} color={colors.textLight} />
                            </TouchableOpacity>
                            {editingHistoricalAttempt && editingHistoricalAttempt.attemptNo === attemptNo && (
                                <TouchableOpacity onPress={cancelEditHistorical} style={styles.editIconTouchable}>
                                    <MaterialIcons name="cancel" size={22} color={colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {showEditIcon && !isSaving && ( // Punkt 8: Ikona edycji
                        <TouchableOpacity onPress={() => startEditHistorical(attemptNo)} style={styles.editIconTouchable} disabled={isSaving}>
                            <MaterialIcons name="edit" size={22} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.managerContainer}>
            {/* Zaktualizowana sekcja informacji o zawodniku */}
            <View style={styles.athleteInfoContainer}>
                <View style={styles.athleteInfoMain}>
                    <Text style={styles.athleteName} numberOfLines={1}>{athlete.imie} {athlete.nazwisko}</Text>
                    <Text style={styles.athleteClub} numberOfLines={1}>{athlete.klub || 'Brak klubu'}</Text>
                </View>
                <Text style={styles.currentRoundInfo}>Runda: {currentRoundForDisplay}</Text>
            </View>
            {/* Użyj styles.attemptsContainer zamiast styles.attemptsSection */}
            <View style={styles.attemptsContainer}>
                {renderAttemptRow(1)}
                {renderAttemptRow(2)}
                {renderAttemptRow(3)}
            </View>
        </View>
    );
};

export default CurrentAthleteManager;