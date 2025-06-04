import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing, borderRadius } from '../../theme/theme';
// import { styles } from '../../styles/AthleteViewStyles/AthleteViewScreen.styles'; // Not needed if styles are local
import useCompetitionStore from '../../store/useCompetitionStore';

const timerStyles = StyleSheet.create({
  timerContainer: {
    width: '90%',
    maxWidth: 400,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  timerActive: {
    backgroundColor: colors.accent, // CHANGED to accent color (orange)
    borderColor: colors.accentDark || colors.accent, // Darker accent or accent itself
  },
  timerInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  timerText: {
    fontFamily: font.familyMono || font.family,
    fontSize: 72,
    fontWeight: font.weights.bold,
    color: colors.text,
    lineHeight: 72 * 1.1,
  },
  timerLabel: {
    fontSize: font.sizes['xl'],
    fontWeight: font.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  timerActiveText: {
    color: colors.textLight, // Text on accent background should be light
  },
  timerActiveLabel: {
    color: colors.textLight + 'dd', // Label on accent background
  },
  timerTimeUp: {
    backgroundColor: colors.warning, // Yellow for time up
    borderColor: colors.warningDark || '#B28900',
  },
});

const FinalAthleteViewTimerDisplay = ({ isActive, timeLeft: initialTimeLeft }) => {
  const socket = useCompetitionStore(state => state.socket);
  const currentAthleteIdOnView = useCompetitionStore(state => state.activeAthleteOriginalIndex);
  
  const [displayTime, setDisplayTime] = useState(initialTimeLeft);

  useEffect(() => {
      setDisplayTime(initialTimeLeft);
  }, [initialTimeLeft, isActive]);

  useEffect(() => {
      if (socket) {
          const handleTimerTick = (data) => {
              if (data && typeof data.timeLeft === 'number') {
                  if (data.athleteOriginalIndex === currentAthleteIdOnView || !data.athleteOriginalIndex) {
                      setDisplayTime(data.timeLeft);
                  }
              }
          };
          socket.on('timerTick', handleTimerTick);
          return () => {
              socket.off('timerTick', handleTimerTick);
          };
      }
  }, [socket, currentAthleteIdOnView]);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  return (
    <View 
      style={[
        timerStyles.timerContainer, 
        isActive 
          ? timerStyles.timerActive 
          : (displayTime <= 0 && !isActive ? timerStyles.timerTimeUp : timerStyles.timerInactive)
      ]}
    >
      <Text 
        style={[
          timerStyles.timerText, 
          (isActive || (displayTime <= 0 && !isActive)) // Apply active text style if timer is active OR time is up
            ? timerStyles.timerActiveText 
            : { color: colors.primary } 
        ]}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      <Text 
        style={[
          timerStyles.timerLabel, 
          (isActive || (displayTime <= 0 && !isActive)) // Apply active label style if timer is active OR time is up
            ? timerStyles.timerActiveLabel
            : { color: colors.textSecondary }
        ]}
      >
        {isActive ? 'CZAS LECI' : (displayTime <= 0 && !isActive ? 'CZAS MINĄŁ' : 'GOTOWY?')}
      </Text>
    </View>
  );
};

export default FinalAthleteViewTimerDisplay;