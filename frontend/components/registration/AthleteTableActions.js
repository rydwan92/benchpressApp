import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { colors } from '../../theme/theme';

export default function AthleteTableActions() {
  return (
    <View style={styles.row}>
      <Button title="Eksportuj CSV" color={colors.primary} onPress={() => {}} />
      <Button title="Resetuj listę" color={colors.secondary} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 8,
  }
});