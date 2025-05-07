import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, font } from '../../theme/theme';

const StyledText = ({ 
  children, 
  style, 
  variant = 'body', 
  color = 'primary',
  weight = 'normal',
  align = 'left',
  ...restProps 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'subtitle':
        return styles.subtitle;
      case 'caption':
        return styles.caption;
      case 'body':
      default:
        return styles.body;
    }
  };

  const getColorStyle = () => {
    switch (color) {
      case 'secondary':
        return styles.textSecondary;
      case 'light':
        return styles.textLight;
      case 'error':
        return styles.textError;
      case 'success':
        return styles.textSuccess;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const getWeightStyle = () => {
    switch (weight) {
      case 'light':
        return styles.weightLight;
      case 'medium':
        return styles.weightMedium;
      case 'semibold':
        return styles.weightSemibold;
      case 'bold':
        return styles.weightBold;
      case 'normal':
      default:
        return styles.weightNormal;
    }
  };

  const getAlignStyle = () => {
    switch (align) {
      case 'center':
        return styles.alignCenter;
      case 'right':
        return styles.alignRight;
      case 'left':
      default:
        return styles.alignLeft;
    }
  };

  return (
    <Text 
      style={[
        styles.text, 
        getVariantStyle(), 
        getColorStyle(),
        getWeightStyle(),
        getAlignStyle(),
        style
      ]} 
      {...restProps}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {},
  h1: {
    fontSize: font.sizes['3xl'],
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: font.sizes['2xl'],
  },
  h3: {
    fontSize: font.sizes.xl,
  },
  subtitle: {
    fontSize: font.sizes.lg,
  },
  body: {
    fontSize: font.sizes.base,
  },
  caption: {
    fontSize: font.sizes.sm,
  },
  textPrimary: {
    color: colors.text.primary,
  },
  textSecondary: {
    color: colors.text.secondary,
  },
  textLight: {
    color: colors.text.light,
  },
  textError: {
    color: colors.error,
  },
  textSuccess: {
    color: colors.success,
  },
  weightLight: {
    fontWeight: font.weights.light,
  },
  weightNormal: {
    fontWeight: font.weights.normal,
  },
  weightMedium: {
    fontWeight: font.weights.medium,
  },
  weightSemibold: {
    fontWeight: font.weights.semibold,
  },
  weightBold: {
    fontWeight: font.weights.bold,
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
});

export default StyledText;