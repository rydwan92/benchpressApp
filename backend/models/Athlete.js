// models/Athlete.js
// Model Athlete zawiera dane zawodnika oraz tablicę podejść (attempts)
// Podejścia są zagnieżdżonymi dokumentami typu AttemptSchema

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/* 
  AttemptSchema – opisuje pojedyncze podejście zawodnika:
  - number: numer podejścia (1, 2, 3)
  - weight: zadeklarowany ciężar
  - passed: wynik podejścia (true – zaliczone, false – spalone)
  - createdAt: znacznik czasu podejścia
  - judgeNote: opcjonalna uwaga od sędziego
*/
const AttemptSchema = new Schema({
  number: { type: Number, required: true },
  weight: { type: Number, required: true },
  passed: { type: Boolean, default: null }, // null = jeszcze nie ocenione
  createdAt: { type: Date, default: Date.now },
  judgeNote: { type: String }
});

/*
  AthleteSchema – dane zawodnika:
  - imię, nazwisko, klub, płeć, waga
  - kategoria (np. Junior 74kg)
  - isDisqualified – oznaczenie dyskwalifikacji
  - avatarUrl – ścieżka do zdjęcia / logo klubu (lokalny upload)
  - attempts – tablica podejść
*/
const AthleteSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  club: { type: String, required: true },
  gender: { type: String, enum: ['M', 'K', 'Inne'], required: true },
  weight: { type: Number, required: true },
  category: { type: String, required: true },
  isDisqualified: { type: Boolean, default: false },
  avatarUrl: { type: String }, // np. "/uploads/herkules.png"
  attempts: [AttemptSchema]
}, { timestamps: true });

export default model('Athlete', AthleteSchema);
