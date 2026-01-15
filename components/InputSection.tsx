import React from 'react';
import { Hash, RefreshCcw, Target, MinusCircle, PlusCircle, Activity, Calculator } from 'lucide-react';
import { CalcMode, ScoreState } from '../types';
import { GRADE_LEVELS } from '../utils/constants';

interface InputSectionProps {
  calcMode: CalcMode;
  credits: number;
  customCredits: string;
  scores: ScoreState;
  targetLabel: string;
  hasCaiThien: boolean;
  onUpdateCredits: (val: string | number) => void;
  onQuickCredits: (num: number) => void;
  onCustomCreditsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onScoreChange: (field: keyof ScoreState, value: string, index?: number) => void;
  setTargetLabel: (val: string) => void;
  setHasCaiThien: (val: boolean) => void;
  onCalculate: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  calcMode,
  credits,
  customCredits,
  scores,
  targetLabel,
  hasCaiThien,
  onQuickCredits,
  onCustomCreditsChange,
  onReset,
  onScoreChange,
  setTargetLabel,
  setHasCaiThien,
  onCalculate
}) => {
  return (
    <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-10 animate-in slide-in-from-top-4 duration-500">
      {/* Top Bar: Credits & Target */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Hash className="w-5 h-5 text-indigo-500" />
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Số tín chỉ</span>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(num => (
              <button 
                key={num} 
                onClick={() => onQuickCredits(num)} 
                className={`w-11 h-11 rounded-xl font-black transition-all border-2 text-sm ${credits === num && !customCredits ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-800 border-transparent text-slate-500 hover:border-indigo-500'}`}
              >
                {num}
              </button>
            ))}
            <input 
              type="number" 
              inputMode="numeric"
              placeholder="Khác" 
              className={`w-16 h-11 rounded-xl border-2 px-2 font-black outline-none transition-all text-center text-sm ${customCredits ? 'border-indigo-600 bg-indigo-900/20 text-indigo-400' : 'border-slate-800 bg-transparent text-white focus:border-indigo-500'}`} 
              value={customCredits} 
              onChange={onCustomCreditsChange} 
            />
            <button 
              onClick={onReset} 
              className="ml-2 p-3 bg-slate-800 rounded-xl text-slate-500 hover:text-red-500 transition-all active:scale-90"
              title="Làm mới"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`flex items-center transition-opacity duration-300 ${calcMode === 'normal' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <div className="bg-slate-800 p-1.5 rounded-2xl flex items-center w-60 shadow-inner">
            <Target className="ml-3 w-4 h-4 text-indigo-400" />
            <select 
              className="w-full bg-transparent p-2 font-black text-indigo-400 outline-none text-[11px] text-center cursor-pointer appearance-none uppercase" 
              value={targetLabel} 
              onChange={e => setTargetLabel(e.target.value)}
            >
              <option value="all">TẤT CẢ MỤC TIÊU</option>
              {GRADE_LEVELS.map(g => <option key={g.label} value={g.label}>HẠNG {String(g.label)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="flex flex-wrap justify-center items-end gap-5 max-w-5xl mx-auto">
        <div className="w-[calc(50%-10px)] sm:w-28 space-y-2 group">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block opacity-60">Chuyên cần</label>
          <input 
            type="number" 
            step="0.1"
            inputMode="decimal"
            className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-xl text-center transition-all shadow-inner group-hover:border-slate-700 text-white" 
            placeholder="?" 
            value={scores.cc} 
            onChange={e => onScoreChange('cc', e.target.value)} 
          />
        </div>

        {scores.qt.map((q, i) => (
          <div key={i} className="w-[calc(50%-10px)] sm:w-28 space-y-2 group animate-in zoom-in-95" style={{ animationDelay: `${i * 30}ms` }}>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center block opacity-60">QT {i+1}</label>
            <input 
              type="number"
              step="0.1"
              inputMode="decimal" 
              className="w-full p-4 rounded-2xl bg-slate-800 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-xl text-center transition-all shadow-inner group-hover:border-slate-700 text-white" 
              placeholder="?" 
              value={q} 
              onChange={e => onScoreChange('qt', e.target.value, i)} 
            />
          </div>
        ))}

        <div className="w-full sm:w-36 space-y-2 pt-4 sm:pt-0 sm:ml-4 sm:pl-6 sm:border-l border-slate-800 group text-center flex flex-col items-center">
          <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-center block mb-2">Kết Thúc HP</label>
          <input 
            type="number" 
            step="0.1"
            inputMode="decimal"
            className="w-full p-4 rounded-2xl bg-emerald-900/10 border-2 border-emerald-900/30 focus:border-emerald-500 outline-none font-black text-xl text-center transition-all shadow-inner text-emerald-400 group-hover:border-emerald-800" 
            placeholder={calcMode === 'sim' ? "?" : "0.0"} 
            value={scores.thi} 
            onChange={e => onScoreChange('thi', e.target.value)} 
          />
        </div>

        {hasCaiThien ? (
          <div className="w-full sm:w-36 space-y-2 pt-4 sm:pt-0 group text-center animate-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-center gap-1 mb-2">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Cải thiện</label>
              <button onClick={() => setHasCaiThien(false)} className="text-slate-600 hover:text-red-500 transition-colors"><MinusCircle className="w-3.5 h-3.5" /></button>
            </div>
            <input 
              type="number" 
              step="0.1"
              inputMode="decimal"
              className="w-full p-4 rounded-2xl bg-amber-900/10 border-2 border-amber-900/30 focus:border-amber-500 outline-none font-black text-xl text-center transition-all shadow-inner text-amber-500 group-hover:border-amber-800" 
              placeholder="0.0" 
              value={scores.caiThien} 
              onChange={e => onScoreChange('caiThien', e.target.value)} 
            />
          </div>
        ) : (
          <button 
            onClick={() => setHasCaiThien(true)} 
            className="h-[60px] px-4 flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-amber-500 transition-all border-2 border-dashed border-slate-800 rounded-2xl hover:border-amber-500/50 group"
          >
            <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase">Điểm Cải thiện</span>
          </button>
        )}
      </div>

      {/* Calculate Button */}
      <div className="pt-4 max-w-4xl mx-auto w-full">
        <button 
          onClick={onCalculate} 
          className={`w-full py-8 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all hover:scale-[1.01] active:scale-95 uppercase tracking-[0.3em] flex items-center justify-center gap-4 ${calcMode === 'normal' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'}`}
        >
          {calcMode === 'normal' ? <Activity className="w-8 h-8" /> : <Calculator className="w-8 h-8" />}
          {calcMode === 'normal' ? 'Xác nhận tính điểm' : 'Bắt đầu dự báo'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;