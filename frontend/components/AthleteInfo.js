import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AthleteInfo({ athlete }) {
  if (!athlete) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{athlete.firstName} {athlete.lastName}</Text>
      <Text style={styles.club}>{athlete.club}</Text>
      <View style={styles.attempts}>
        {athlete.attempts?.map((a, idx) => (
          <View key={idx} style={styles.attempt}>
            <Text>Podejście {a.number}: {a.weight ?? '-'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#f3f6fa', borderRadius: 12, padding: 16, marginBottom: 16 },
  name: { fontSize: 18, fontWeight: 'bold' },
  club: { fontSize: 16, color: '#555', marginBottom: 8 },
  attempts: { flexDirection: 'row', gap: 12 },
  attempt: { marginRight: 12 }
});