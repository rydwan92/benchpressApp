// routes/athletes.js
// Trasy REST API dla zawodników

import express from 'express';
import { createAthlete, getAllAthletes } from '../controllers/athleteController.js';

const router = router.get('/', getAllAthletes);

// POST /api/athletes – dodanie nowego zawodnika z podejściem nr 1
router.post('/', createAthlete);

export default router;
