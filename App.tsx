import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModeSwitcher from './components/ModeSwitcher';
import InputSection from './components/InputSection';
import ResultsDisplay from './components/ResultsDisplay';
import GradeTableModal from './components/GradeTableModal';
import Footer from './components/Footer';
import { CalcMode, CalculationResult, ScoreState } from './types';
import { performCalculation } from './utils/calculator';

export default function App() {
  // --- STATE ---
  const [calcMode, setCalcMode] = useState<CalcMode>('sim'); 
  const [credits, setCredits] = useState<number>(3);
  const [customCredits, setCustomCredits] = useState<string>('');
  const [scores, setScores] = useState<ScoreState>({ cc: '', qt: ['', '', ''], thi: '', caiThien: '' });
  const [targetLabel, setTargetLabel] = useState<string>('all'); 
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [showGradeTable, setShowGradeTable] = useState<boolean>(false);
  const [hasCaiThien, setHasCaiThien] = useState<boolean>(false);

  // --- FORCE DARK MODE ---
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // --- HANDLERS ---
  const updateCredits = (val: string | number) => {
    const num = Math.max(1, Math.min(20, typeof val === 'string' ? parseInt(val) || 1 : val));
    setCredits(num);
    setScores(prev => ({
      ...prev,
      qt: Array(num).fill('').map((_, i) => prev.qt[i] || '')
    }));
    setResults(null);
  };

  const handleQuickCredits = (num: number) => {
    setCustomCredits('');
    updateCredits(num);
  };

  const handleCustomCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomCredits(val);
    if (val && parseInt(val) > 0) updateCredits(val);
  };

  const handleScoreChange = (field: keyof ScoreState, value: string, index?: number) => {
    if (field === 'qt' && typeof index === 'number') {
      const newQt = [...scores.qt];
      newQt[index] = value;
      setScores({ ...scores, qt: newQt });
    } else {
      setScores({ ...scores, [field]: value });
    }
  };

  const resetForm = () => {
    setScores({ cc: '', qt: Array(credits).fill(''), thi: '', caiThien: '' });
    setResults(null);
    setHasCaiThien(false);
  };

  const handleCalculate = () => {
    const result = performCalculation(calcMode, credits, scores, hasCaiThien, targetLabel);
    setResults(result);
  };

  const handleModeChange = (mode: CalcMode) => {
    setCalcMode(mode);
    setResults(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 p-4 md:p-8 selection:bg-indigo-500 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Header onShowGradeTable={() => setShowGradeTable(true)} />

        <ModeSwitcher mode={calcMode} setMode={handleModeChange} />

        <InputSection 
          calcMode={calcMode}
          credits={credits}
          customCredits={customCredits}
          scores={scores}
          targetLabel={targetLabel}
          hasCaiThien={hasCaiThien}
          onUpdateCredits={updateCredits}
          onQuickCredits={handleQuickCredits}
          onCustomCreditsChange={handleCustomCreditsChange}
          onReset={resetForm}
          onScoreChange={handleScoreChange}
          setTargetLabel={setTargetLabel}
          setHasCaiThien={setHasCaiThien}
          onCalculate={handleCalculate}
        />

        <ResultsDisplay results={results} />

        <Footer />
      </div>

      {showGradeTable && (
        <GradeTableModal onClose={() => setShowGradeTable(false)} />
      )}
    </div>
  );
}