// AttemptResultAnimation.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
  sequence, // Do sekwencji animacji
  delay,    // Do opóźnienia
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AttemptResultAnimation = ({ success }) => {
  const scale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = 0; // Reset na początku
    textOpacity.value = 0;
    textTranslateY.value = 20;
    opacity.value = 0;

    // Animacja skali ikony z lekkim odbiciem
    scale.value = withSpring(1, {
      damping: 10,       // Zmniejsz damping dla większego "bounce"
      stiffness: 100,
      mass: 0.5,         // Lżejsza masa dla szybszej reakcji
    });

    // Animacja tekstu pojawiającego się z opóźnieniem
    textOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
    textTranslateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });

    opacity.value = withTiming(1, { duration: 500 });
  }, [success]); // Uruchom ponownie animację, jeśli zmieni się 'success' (na wszelki wypadek)

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0, 0.5, 1], [0, 0.7, 1], Extrapolate.CLAMP), // Płynne pojawianie się ikony
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle, success ? styles.successBg : styles.failBg]}>
        <Icon
          name={success ? 'check-bold' : 'close-thick'}
          size={80}
          color="#fff"
        />
      </Animated.View>
      <Animated.View style={[textAnimatedStyle, animatedStyle]}>
        <Text style={[styles.text, success ? styles.successText : styles.failText]}>
          {success ? 'ZALICZONE!' : 'SPALONE!'}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.1)', // Lekkie tło dla całego overlay, jeśli chcesz
    // flex: 1, // Jeśli ma zajmować cały ekran wewnątrz overlay
  },
  iconContainer: {
    borderRadius: 100, // Bardziej okrągłe
    width: 150,        // Większa ikona
    height: 150,       // Większa ikona
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Odstęp od tekstu
    shadowColor: "#000", // Dodajmy cień
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  successBg: { // Zmieniono nazwy stylów tła dla jasności
    backgroundColor: '#4CAF50', // Zielony
  },
  failBg: { // Zmieniono nazwy stylów tła dla jasności
    backgroundColor: '#F44336', // Czerwony
  },
  text: {
    fontSize: 38, // Większy tekst
    fontWeight: 'bold',
    textTransform: 'uppercase', // Wielkie litery dla większego efektu
    letterSpacing: 1,
  },
  successText: {
    color: '#388E3C', // Ciemniejszy zielony dla lepszego kontrastu
  },
  failText: {
    color: '#D32F2F', // Ciemniejszy czerwony
  },
});

export default AttemptResultAnimation;
