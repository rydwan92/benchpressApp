import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing } from '../../theme/theme';

const TimerDisplay = ({ isActive, timeLeft }) => {
    const formatTime = (seconds) => {
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
            // console.warn(`[TimerDisplay formatTime] Invalid seconds value: ${seconds}. Returning '00:00'.`);
            return '00:00';
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.timerContainer}>
            <Text style={[
                styles.timerText,
                isActive && typeof timeLeft === 'number' && !isNaN(timeLeft) && timeLeft <= 10 && timeLeft > 0 && styles.timerWarning,
                typeof timeLeft === 'number' && !isNaN(timeLeft) && timeLeft === 0 && styles.timerFinished
            ]}>
                {formatTime(timeLeft)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    timerContainer: {
        alignItems: 'center', // Centruje tekst w poziomie
        justifyContent: 'center', // Centruje tekst w pionie, jeśli kontener ma wysokość
        // Usunięto marginBottom: spacing.lg - odstępy powinny być zarządzane przez timerSection
        // Można dodać flex: 1, jeśli timerContainer ma wypełnić przestrzeń w timerSection
        // i chcemy idealnego centrowania w obu osiach w tej przestrzeni.
        // flex: 1, 
        width: '100%', // Aby kontener zajął pełną szerokość timerSection
    },
    timerText: {
        fontSize: font.sizes['5xl'] || 64, // Użyj wartości z theme lub fallback
        fontWeight: font.weights.bold,
        color: colors.primary,
        textAlign: 'center', // Dodatkowe wyśrodkowanie tekstu, jeśli sam Text jest szerszy niż jego zawartość
    },
    timerWarning: {
        color: colors.warning,
    },
    timerFinished: {
        color: colors.error,
    },
});

export default TimerDisplay;