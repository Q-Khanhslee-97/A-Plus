import { GRADE_LEVELS } from './constants';
import { ScoreState, CalculationResult, TargetCalculation, Scenario } from '../types';

export const parseSmartScore = (val: string | number | null | undefined): number | null => {
  if (val === '' || val === null || val === undefined) return null;
  let s = String(val).trim().replace(',', '.');
  let n = parseFloat(s);
  if (isNaN(n)) return null;
  if (n > 10) n = n / 10;
  return Math.min(10, Math.max(0, n));
};

export const getGradeInfo = (score: number) => {
  return GRADE_LEVELS.find(g => score >= g.score) || GRADE_LEVELS[GRADE_LEVELS.length - 1];
};

const getCalculationForTarget = (
  targetScore: number,
  upperBoundScore: number, // Điểm cận trên của hạng này (để giới hạn range)
  totalCoeff: number,
  isCCMissing: boolean,
  ccVal: number | null,
  qtVals: (number | null)[],
  missingQTIndices: number[],
  isThiMissing: boolean,
  thiVal: number | null
): TargetCalculation => {
  const sumKnown = (isCCMissing ? 0 : (ccVal || 0) * 1) +
    qtVals.reduce((acc: number, v: number | null) => acc + ((v !== null ? v : 0) * 2), 0) +
    (isThiMissing ? 0 : (thiVal || 0) * 3);

  const sumNeeded = targetScore * totalCoeff - sumKnown;
  const missingNames: string[] = [];
  
  if (isCCMissing) missingNames.push("C.Cần");
  missingQTIndices.forEach(idx => missingNames.push(`QT ${idx + 1}`));
  if (isThiMissing) missingNames.push("Thi");

  const totalMissing = missingNames.length;
  // Maximum possible points from missing fields
  const maxMissingSum = (isCCMissing ? 10 : 0) + (missingQTIndices.length * 20) + (isThiMissing ? 30 : 0);
  const maxPossibleGPA = (sumKnown + maxMissingSum) / totalCoeff;
  const isPossible = maxPossibleGPA >= targetScore;

  // Calculate Uniform Score (if all missing fields are equal)
  const sumMissingCoeffs = (isCCMissing ? 1 : 0) + (missingQTIndices.length * 2) + (isThiMissing ? 3 : 0);
  let uniformScore: string | undefined;
  if (sumMissingCoeffs > 0) {
     const val = sumNeeded / sumMissingCoeffs;
     uniformScore = Math.max(0, Math.min(10, val)).toFixed(2);
  }

  if (totalMissing === 1) {
    let divisor = 2; // Default fallback
    if (isCCMissing) divisor = 1;
    else if (isThiMissing) divisor = 3;
    
    const needed = sumNeeded / divisor;
    return {
      type: 'single',
      val: Math.max(0, Math.min(10, needed)).toFixed(1),
      field: missingNames[0],
      maxPossibleGPA: maxPossibleGPA.toFixed(2),
      isPossible,
      uniformScore
    };
  } else {
    const scenarios: Scenario[] = [];
    const lastMissingName = missingNames[missingNames.length - 1];
    const otherMissingNames = missingNames.slice(0, -1);

    let otherCoeff = 0;
    if (isCCMissing && otherMissingNames.includes("C.Cần")) otherCoeff += 1;
    missingQTIndices.forEach(idx => { if (otherMissingNames.includes(`QT ${idx + 1}`)) otherCoeff += 2; });

    const lastCoeff = isThiMissing && lastMissingName === "Thi" ? 3 : (isCCMissing && lastMissingName === "C.Cần" ? 1 : 2);
    const label1 = otherMissingNames.length > 1 ? `TB (${otherMissingNames.join(', ')})` : otherMissingNames[0];
    const label2 = lastMissingName;

    // Generate Scenarios Range
    // Loop variable 1 (c1) from 0 to 10 with step 0.5
    for (let c1 = 0; c1 <= 10; c1 += 0.5) {
      // Calculate minimum required c2 to hit the targetScore
      // Formula: (sumKnown + c1*otherCoeff + c2*lastCoeff) / totalCoeff >= targetScore
      // => c2 >= (targetScore * totalCoeff - sumKnown - c1*otherCoeff) / lastCoeff
      
      let minC2 = (targetScore * totalCoeff - sumKnown - (c1 * otherCoeff)) / lastCoeff;
      
      // Round up to nearest 0.5 to ensure we are >= target
      // Example: need 4.1 -> ceil(8.2)/2 = 4.5
      let startC2 = Math.ceil(minC2 * 2) / 2;
      startC2 = Math.max(0, startC2); // Clamp lower bound to 0

      // If startC2 > 10, this c1 is impossible to reach target
      if (startC2 > 10) continue;

      // Loop variable 2 (c2) from startC2 to 10 with step 0.5
      for (let c2 = startC2; c2 <= 10; c2 += 0.5) {
        const totalPoints = sumKnown + (c1 * otherCoeff) + (c2 * lastCoeff);
        const currentGPA = totalPoints / totalCoeff;

        // Important: Stop if we exceed the grade range (enter the next higher grade)
        // Using a small epsilon for float comparison safety or just simple comparison
        if (currentGPA >= upperBoundScore) {
          break; // Higher c2 will only increase GPA further
        }

        scenarios.push({
          c1: c1.toFixed(1),
          c2: c2.toFixed(1),
          gpa: currentGPA.toFixed(2)
        });
      }
    }

    return { 
      type: 'multi', 
      list: scenarios, 
      labels: [label1, label2], 
      maxPossibleGPA: maxPossibleGPA.toFixed(2), 
      isPossible: scenarios.length > 0,
      uniformScore
    };
  }
};

export const performCalculation = (
  mode: 'sim' | 'normal',
  credits: number,
  scores: ScoreState,
  hasCaiThien: boolean,
  targetLabel: string
): CalculationResult | null => {
  // Logic: 1 CC (coeff 1), N QT (coeff 2 each), 1 Thi (coeff 3)
  const totalCoeff = 1 + (2 * credits) + 3;
  const ccVal = parseSmartScore(scores.cc);
  const qtVals = scores.qt.map(q => parseSmartScore(q));
  let thiVal = parseSmartScore(scores.thi);
  const ctVal = parseSmartScore(scores.caiThien);

  if (hasCaiThien && ctVal !== null) {
    if (thiVal === null || ctVal > thiVal) thiVal = ctVal;
  }

  const isCCMissing = ccVal === null;
  const missingQTIndices = qtVals.map((v, i) => v === null ? i : null).filter(i => i !== null) as number[];
  const isThiMissing = thiVal === null;
  const totalMissing = (isCCMissing ? 1 : 0) + missingQTIndices.length + (isThiMissing ? 1 : 0);

  // LOGIC CHANGE: Check for 'normal' mode OR ('sim' mode with full inputs)
  if (mode === 'normal' || (mode === 'sim' && totalMissing === 0)) {
    const finalScore = ((ccVal || 0) * 1 + qtVals.reduce((a: number, b: number | null) => a + ((b !== null ? b : 0) * 2), 0) + (thiVal || 0) * 3) / totalCoeff;
    const grade = getGradeInfo(finalScore);
    return { 
      type: 'final', 
      val: finalScore.toFixed(2), 
      points4: grade.points.toFixed(1), 
      grade, 
      // Only mark as partial if we are in normal mode AND have missing fields.
      // If we are in sim mode and hit this block, it means totalMissing is 0, so it's not partial.
      isPartial: mode === 'normal' && totalMissing > 0 
    };
  } else {
    // Sim Mode with missing fields
    if (targetLabel === 'all') {
      const allResults = GRADE_LEVELS.map((level, idx) => {
        // Find upper bound (score of the next higher grade)
        // GRADE_LEVELS is ordered descending (A, B+, B...)
        const prevLevel = GRADE_LEVELS[idx - 1];
        const upperBound = prevLevel ? prevLevel.score : 10.1; // 10.1 allows GPA 10.0 to be included

        return {
          level: level.label,
          minScore: level.score,
          data: getCalculationForTarget(level.score, upperBound, totalCoeff, isCCMissing, ccVal, qtVals, missingQTIndices, isThiMissing, thiVal)
        };
      });
      return { type: 'all_targets', list: allResults, isThiMissing };
    } else {
       // Single Target
      const target = GRADE_LEVELS.find(g => g.label === targetLabel);
      if (!target) return null;
      
      const idx = GRADE_LEVELS.indexOf(target);
      const prevLevel = GRADE_LEVELS[idx - 1];
      const upperBound = prevLevel ? prevLevel.score : 10.1;

      const data = getCalculationForTarget(target.score, upperBound, totalCoeff, isCCMissing, ccVal, qtVals, missingQTIndices, isThiMissing, thiVal);
      return { 
          type: 'all_targets', 
          list: [{ level: target.label, minScore: target.score, data }],
          isThiMissing 
      };
    }
  }
};