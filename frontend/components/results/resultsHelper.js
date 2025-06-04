// IPF GL Points Coefficients (Classic Raw - 2023 Formula)
const IPF_GL_COEFFICIENTS = {
  M: { // Men
    A: 310.67000,
    B: 216.04750,
    C: 0.0073862,
  },
  K: { // Women
    A: 196.76500,
    B: 137.09750,
    C: 0.0093070,
  },
};

export const parseNumeric = (value) => { // ADDED export
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export const getBestLift = (athlete) => {
  let bestLift = 0;
  for (let i = 1; i <= 3; i++) {
    if (athlete[`podejscie${i}Status`] === 'passed') {
      const weight = parseNumeric(athlete[`podejscie${i}`]);
      if (weight > bestLift) {
        bestLift = weight;
      }
    }
  }
  return bestLift;
};

export const calculateIPFPoints = (totalLift, bodyWeight, gender) => {
  if (!totalLift || totalLift <= 0 || !bodyWeight || bodyWeight <= 0) {
    return 0;
  }

  // Map common gender strings to 'M' or 'K'
  const genderUpper = String(gender).toUpperCase();
  let genderKey = null;
  if (genderUpper.startsWith('M') || genderUpper === 'MALE') {
    genderKey = 'M';
  } else if (genderUpper.startsWith('K') || genderUpper === 'KOBIETA' || genderUpper === 'FEMALE') {
    genderKey = 'K';
  }

  if (!genderKey) return 0;

  const coeffs = IPF_GL_COEFFICIENTS[genderKey];
  if (!coeffs) return 0;

  const denominator = coeffs.A - coeffs.B * Math.exp(-coeffs.C * bodyWeight);
  if (denominator <= 0) return 0;

  const points = 100 * (totalLift / denominator);
  return parseFloat(points.toFixed(2));
};

export const processAthletesForResults = (zawodnicy) => {
  if (!zawodnicy || !Array.isArray(zawodnicy)) return [];
  return zawodnicy.map((athlete, originalIndex) => {
    const bestLift = getBestLift(athlete);
    const bodyWeight = parseNumeric(athlete.wagaCiala);
    const genderForIPF = athlete.plec; // Assuming 'Mężczyzna', 'Kobieta'
    const ipfPoints = calculateIPFPoints(bestLift, bodyWeight, genderForIPF);

    return {
      ...athlete,
      originalIndex: athlete.originalIndex !== undefined ? athlete.originalIndex : originalIndex, // Ensure originalIndex
      bestLift,
      bodyWeightParsed: bodyWeight,
      ipfPoints,
    };
  });
};

export const sortIndividualResults = (results) => {
  return [...results].sort((a, b) => {
    // Primary sort: IPF GL Points (higher is better)
    // Athletes with 0 or null IPF points go to the bottom.
    if ((b.ipfPoints || 0) !== (a.ipfPoints || 0)) {
      return (b.ipfPoints || 0) - (a.ipfPoints || 0);
    }

    // Tie-breaker 1: Best Lift (higher is better)
    // Athletes with 0 or null best lift go lower.
    if ((b.bestLift || 0) !== (a.bestLift || 0)) {
      return (b.bestLift || 0) - (a.bestLift || 0);
    }

    // Tie-breaker 2: Body Weight (lower is better, missing/zero BW is worst)
    const bwA = (a.bodyWeightParsed && a.bodyWeightParsed > 0) ? a.bodyWeightParsed : Infinity;
    const bwB = (b.bodyWeightParsed && b.bodyWeightParsed > 0) ? b.bodyWeightParsed : Infinity;
    if (bwA !== bwB) {
      return bwA - bwB;
    }

    // Tie-breaker 3: Original Index (for stability, lower index first)
    return (a.originalIndex || 0) - (b.originalIndex || 0);
  });
};

export const calculateTeamResults = (processedAthletes, topN = 3) => {
  if (!processedAthletes || processedAthletes.length === 0) return [];
  const clubData = {};

  processedAthletes.forEach(athlete => {
    if (!athlete.klub || athlete.ipfPoints <= 0) return;
    if (!clubData[athlete.klub]) {
      clubData[athlete.klub] = {
        clubName: athlete.klub,
        athletes: [],
      };
    }
    clubData[athlete.klub].athletes.push(athlete);
  });

  const teams = Object.values(clubData).map(team => {
    const sortedAthletes = sortIndividualResults(team.athletes); // Sort all athletes in club
    const contributingAthletes = sortedAthletes.slice(0, topN);
    const totalIPFPoints = contributingAthletes.reduce((sum, ath) => sum + ath.ipfPoints, 0);
    return {
      clubName: team.clubName,
      totalIPFPoints: parseFloat(totalIPFPoints.toFixed(2)),
      contributingAthletes: contributingAthletes.map(ath => ({
        name: `${ath.imie} ${ath.nazwisko}`,
        ipfPoints: ath.ipfPoints,
        bestLift: ath.bestLift,
        bodyWeight: ath.bodyWeightParsed,
      })),
      allAthletesInClubCount: team.athletes.length,
    };
  });

  teams.sort((a, b) => {
    if (b.totalIPFPoints !== a.totalIPFPoints) return b.totalIPFPoints - a.totalIPFPoints;
    // Add more tie-breakers if needed (e.g., sum of best lifts of contributors)
    return 0;
  });

  return teams.map((team, index) => ({ ...team, rank: index + 1 }));
};

export const generateCSV = (data, columns) => {
  const header = columns.map(c => c.label).join(',') + '\n';
  const rows = data.map(row =>
    columns.map(col => {
      let value = col.accessor(row); // Use accessor function
      if (value === null || value === undefined) value = '';
      if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
      return value;
    }).join(',')
  ).join('\n');
  return header + rows;
};