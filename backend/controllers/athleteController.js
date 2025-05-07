// controllers/athleteController.js
// Kontroler do operacji na zawodnikach – tworzenie, pobieranie, edycja itp.

import Athlete from '../models/Athlete.js';


/**
 * GET /api/athletes
 * Zwraca wszystkich zawodników z bazy danych
 */
export const getAllAthletes = async (req, res) => {
    try {
      const athletes = await Athlete.find().sort({ lastName: 1 }); // sortowanie alfabetyczne
      res.status(200).json(athletes);
    } catch (error) {
      console.error('Błąd pobierania zawodników:', error);
      res.status(500).json({ message: 'Błąd serwera przy pobieraniu zawodników' });
    }
  };


/**
 * POST /api/athletes
 * Tworzy nowego zawodnika wraz z pierwszym podejściem
 */
export const createAthlete = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      club,
      gender,
      weight,
      category,
      avatarUrl,
      firstAttemptWeight
    } = req.body;

    // Tworzenie obiektu zawodnika z podejściem nr 1
    const newAthlete = new Athlete({
      firstName,
      lastName,
      club,
      gender,
      weight,
      category,
      avatarUrl,
      attempts: [
        {
          number: 1,
          weight: firstAttemptWeight,
          passed: null
        }
      ]
    });

    await newAthlete.save();
    res.status(201).json(newAthlete);
  } catch (error) {
    console.error('Błąd tworzenia zawodnika:', error);
    res.status(500).json({ message: 'Błąd serwera przy tworzeniu zawodnika' });
  }
};
