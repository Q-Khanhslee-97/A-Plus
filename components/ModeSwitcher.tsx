import React from 'react';
import { Activity, Zap } from 'lucide-react';
import { CalcMode } from '../types';

interface ModeSwitcherProps {
  mode: CalcMode;
  setMode: (mode: CalcMode) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, setMode }) => {
  return (
    <div className="flex justify-center animate-in fade-in duration-700">
      <div className="bg-slate-900 p-1.5 rounded-[2rem] border border-slate-800 flex gap-2 w-full max-w-lg shadow-2xl relative">
        <div 
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[1.5rem] transition-all duration-500 shadow-lg ${mode === 'sim' ? 'translate-x-full bg-indigo-600' : 'translate-x-0 bg-emerald-600'}`} 
        />
        <button 
          onClick={() => setMode('normal')} 
          className="flex-1 py-4 px-6 rounded-2xl z-10 flex items-center justify-center gap-3 transition-colors text-slate-500 font-bold hover:text-slate-300 active:text-white uppercase text-xs tracking-widest"
        >
          <Activity className="w-5 h-5" /> Tính điểm thật
        </button>
        <button 
          onClick={() => setMode('sim')} 
          className="flex-1 py-4 px-6 rounded-2xl z-10 flex items-center justify-center gap-3 transition-colors text-slate-500 font-bold hover:text-slate-300 active:text-white uppercase text-xs tracking-widest"
        >
          <Zap className="w-5 h-5" /> Dự báo kịch bản
        </button>
      </div>
    </div>
  );
};

export default ModeSwitcher;