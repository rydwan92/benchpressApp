import React from 'react';
import { View } from 'react-native';
import { colors } from '../../theme/theme';

export default function SectionDivider() {
  return (
    <View style={{
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
      borderRadius: 1,
      opacity: 0.5,
    }} />
  );
}