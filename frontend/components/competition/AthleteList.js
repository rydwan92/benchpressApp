import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // Dodaj MaterialCommunityIcons
import { styles } from '../../styles/CompetitionStyles/AthleteList.styles.js'; // Importuj nowe style
import { colors, spacing } from '../../theme/theme'; // Importuj theme dla kolorów itp.

const AthleteList = ({
    athletes,
    currentAthleteOriginalIndex,
    currentRound,
    onSelectAthlete,
    onAttemptStatusChange,
    onWeightChange,
    isSaving,
    // Punkt 2: Dodatkowe propsy dla informacji o grupie
    athletesInGroupCount,
    upcomingAthletesInRoundCount
}) => {
    const [hoveredAthlete, setHoveredAthlete] = useState(null);
    const [editingWeight, setEditingWeight] = useState({}); // { [`${athleteIdx}-${attemptNo}`]: true }

    const getStatusIcon = (status, weight) => {
        const iconSize = 18;
        if (status === 'passed') return <AntDesign name="checkcircle" size={iconSize} color={colors.success} />;
        if (status === 'failed') return <AntDesign name="closecircle" size={iconSize} color={colors.error} />;
        if (weight && String(weight).trim() !== '' && String(weight).trim() !== '0') return <AntDesign name="clockcircleo" size={iconSize} color={colors.textSecondary} />;
        return <View style={{width: iconSize, height: iconSize}} />; // Placeholder
    };

    const handleWeightInputFocus = (athleteOriginalIndex, attemptNo) => {
        setEditingWeight({ [`${athleteOriginalIndex}-${attemptNo}`]: true });
    };

    const handleWeightInputBlur = (athleteOriginalIndex, attemptNo) => {
        setEditingWeight(prev => ({ ...prev, [`${athleteOriginalIndex}-${attemptNo}`]: false }));
    };

    const handleWeightInputChange = (athleteOriginalIndex, attemptNo, text) => {
        const numericValue = text.replace(/[^0-9.,]/g, '').replace(',', '.'); // Akceptuj przecinek, zamień na kropkę
        if (onWeightChange) {
            onWeightChange(athleteOriginalIndex, attemptNo, numericValue);
        }
    };

    return (
        <View style={styles.athleteListContainer}>
            {/* Punkt 2: Wyświetlanie informacji o grupie */}
            <View style={styles.groupInfoContainer}>
                <View style={styles.groupInfoItem}>
                    <MaterialCommunityIcons name="account-group-outline" size={20} color={colors.text} style={styles.groupInfoIcon} />
                    <Text style={styles.groupInfoText}>
                        W grupie: <Text style={styles.groupInfoHighlight}>{athletesInGroupCount}</Text>
                    </Text>
                </View>
                <Text style={styles.roundInfoText}>
                    Runda: {currentRound}
                </Text>
            </View>

            {athletes.length === 0 ? (
                <Text style={styles.emptyText}>Brak zawodników w tej kategorii/wadze.</Text>
            ) : (
                <ScrollView style={styles.athleteScroll}>
                    {athletes.map((athlete) => {
                        const isCurrentlySelectedAthlete = athlete.originalIndex === currentAthleteOriginalIndex;
                        const isHovered = Platform.OS === 'web' && hoveredAthlete === athlete.originalIndex;

                        return (
                            <TouchableOpacity
                                key={athlete.originalIndex}
                                style={[
                                    styles.athleteListItem,
                                    isCurrentlySelectedAthlete && styles.athleteListItemActive,
                                    isHovered && styles.athleteListItemHover,
                                ]}
                                onPress={() => onSelectAthlete(athlete.originalIndex)}
                                disabled={isSaving}
                                activeOpacity={0.7}
                                {...(Platform.OS === 'web' && {
                                    onMouseEnter: () => setHoveredAthlete(athlete.originalIndex),
                                    onMouseLeave: () => setHoveredAthlete(null),
                                })}
                            >
                                <View style={styles.athleteInfoRow}>
                                    <Text style={styles.athleteListText} numberOfLines={1}>
                                        {athlete.imie} {athlete.nazwisko}
                                    </Text>
                                    <Text style={styles.athleteClubText} numberOfLines={1}>
                                        {athlete.klub || 'Brak klubu'}
                                    </Text>
                                </View>
                                <View style={styles.attemptsGrid}>
                                    {[1, 2, 3].map((nr) => {
                                        const weight = athlete[`podejscie${nr}`];
                                        const status = athlete[`podejscie${nr}Status`];
                                        const isAttemptEditable = !status && nr >= currentRound && !isSaving; // Można edytować tylko przyszłe lub bieżące nieocenione podejścia
                                        const isWeightEditing = editingWeight[`${athlete.originalIndex}-${nr}`];

                                        return (
                                            <View key={nr} style={[styles.attemptCell, nr === 3 && styles.attemptCellLast]}>
                                                <Text style={styles.attemptCellLabel}>P. {nr}</Text>
                                                {isAttemptEditable || isWeightEditing ? (
                                                    <TextInput
                                                        style={styles.attemptWeightInput}
                                                        value={String(weight || '')}
                                                        onChangeText={(text) => handleWeightInputChange(athlete.originalIndex, nr, text)}
                                                        keyboardType="numeric"
                                                        placeholder="0"
                                                        editable={!isSaving}
                                                        onFocus={() => handleWeightInputFocus(athlete.originalIndex, nr)}
                                                        onBlur={() => handleWeightInputBlur(athlete.originalIndex, nr)}
                                                    />
                                                ) : (
                                                    <Text style={styles.attemptWeightText}>{weight || '-'}</Text>
                                                )}
                                                <View style={styles.attemptStatusIconContainer}>
                                                    {getStatusIcon(status, weight)}
                                                </View>
                                                {!status && nr === currentRound && !isSaving && ( // Pokaż przyciski tylko dla bieżącej rundy i nieocenionego podejścia
                                                    <View style={styles.attemptActionButtons}>
                                                        <TouchableOpacity
                                                            style={[styles.actionButtonSmall, styles.passButtonSmall, isSaving && styles.actionButtonDisabledSmall]}
                                                            onPress={() => onAttemptStatusChange(athlete.originalIndex, nr, 'passed')}
                                                            disabled={isSaving}
                                                        >
                                                            <AntDesign name="check" size={14} color={colors.textLight} />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={[styles.actionButtonSmall, styles.failButtonSmall, isSaving && styles.actionButtonDisabledSmall]}
                                                            onPress={() => onAttemptStatusChange(athlete.originalIndex, nr, 'failed')}
                                                            disabled={isSaving}
                                                        >
                                                            <AntDesign name="close" size={14} color={colors.textLight} />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
};

export default AthleteList;