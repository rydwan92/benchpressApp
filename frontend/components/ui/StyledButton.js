import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, font, spacing, borderRadius, shadows } from '../../theme/theme';
import { createShadow } from '../../theme/common';

/**
 * Stylizowany przycisk do użytku w całej aplikacji
 */
const StyledButton = ({ 
  variant = 'primary', 
  style = {}, 
  textStyle = {}, 
  onPress, 
  children,
  ...otherProps 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'accent':
        return styles.buttonAccent;
      case 'danger':
        return styles.buttonDanger;
      default:
        return styles.buttonPrimary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getButtonStyle(), style]} 
      onPress={onPress}
      {...otherProps}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow(shadows.small),
  },
  buttonPrimary: {
    backgroundColor: colors.button.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.button.secondary,
  },
  buttonAccent: {
    backgroundColor: colors.button.accent,
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: colors.text.light,
    fontWeight: font.weights.medium,
    fontSize: font.sizes.sm,
  },
});

export default StyledButton;