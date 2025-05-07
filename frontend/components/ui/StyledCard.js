import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';
import { createShadow } from '../../theme/common';

const StyledCard = ({ 
  children, 
  style, 
  elevation = 'small',
  padding = 'medium',
  ...restProps 
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return styles.paddingNone;
      case 'small':
        return styles.paddingSmall;
      case 'large':
        return styles.paddingLarge;
      case 'medium':
      default:
        return styles.paddingMedium;
    }
  };

  const getElevation = () => {
    switch (elevation) {
      case 'none':
        return styles.elevationNone;
      case 'medium':
        return styles.elevationMedium;
      case 'large':
        return styles.elevationLarge;
      case 'small':
      default:
        return styles.elevationSmall;
    }
  };

  return (
    <View style={[styles.card, getPadding(), getElevation(), style]} {...restProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: spacing.sm,
  },
  paddingMedium: {
    padding: spacing.lg,
  },
  paddingLarge: {
    padding: spacing.xl,
  },
  elevationNone: {
    ...createShadow(shadows.none),
  },
  elevationSmall: {
    ...createShadow(shadows.small),
  },
  elevationMedium: {
    ...createShadow(shadows.medium),
  },
  elevationLarge: {
    ...createShadow(shadows.large),
  },
});

export default StyledCard;