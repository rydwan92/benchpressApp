// components/AthleteCard.js
import React from 'react';
import { Card, Text, Button } from 'react-native-paper';

export default function AthleteCard({ athlete, onZalicz, onSpal }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title title={`${athlete.firstName} ${athlete.lastName}`} subtitle={athlete.club} />
      <Card.Content>
        {athlete.attempts.map((a) => (
          <Text key={a.number}>
            Podejście {a.number}: {a.weight}kg – {
              a.passed === true ? '✅' : a.passed === false ? '❌' : '⏳'
            }
          </Text>
        ))}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => onZalicz(athlete.id, athlete.attempts.length)}>ZALICZ</Button>
        <Button onPress={() => onSpal(athlete.id, athlete.attempts.length)}>SPAL</Button>
      </Card.Actions>
    </Card>
  );
}
