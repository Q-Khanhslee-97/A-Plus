export interface GradeLevel {
  label: string;
  score: number;
  points: number;
  description: string;
  color: string;
  bg: string;
  border: string;
  lightBg: string;
}

export type CalcMode = 'sim' | 'normal';

export interface ScoreState {
  cc: string;
  qt: string[];
  thi: string;
  caiThien: string;
}

export interface Scenario {
  c1: string; // First variable needed (e.g., Average QT)
  c2: string; // Second variable needed (e.g., Exam Score)
  gpa: string; // Resulting GPA
}

export interface TargetCalculation {
  type: 'single' | 'multi';
  val?: string; // For single value needed
  field?: string; // Name of field missing
  list?: Scenario[]; // For multiple scenarios
  labels?: string[]; // Labels for columns in multi scenarios
  maxPossibleGPA: string;
  isPossible: boolean;
  target?: GradeLevel; // Added for reference
  uniformScore?: string; // Score needed if all missing fields have the same value
}

export interface ResultItem {
  level: string;
  minScore: number;
  data: TargetCalculation;
}

export interface CalculationResult {
  type: 'final' | 'all_targets';
  // For 'final'
  val?: string;
  points4?: string;
  grade?: GradeLevel;
  isPartial?: boolean;
  // For 'all_targets'
  list?: ResultItem[];
  isThiMissing?: boolean;
}