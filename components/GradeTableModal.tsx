import React from 'react';
import { ClipboardList, X } from 'lucide-react';
import { GRADE_LEVELS } from '../utils/constants';

interface GradeTableModalProps {
  onClose: () => void;
}

const GradeTableModal: React.FC<GradeTableModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ClipboardList className="w-8 h-8" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Bảng quy đổi & Xếp loại</h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="p-5 text-left">Hạng</th>
                <th className="p-5">Thang 10</th>
                <th className="p-5">Thang 4</th>
                <th className="p-5 text-right">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {GRADE_LEVELS.map((g, idx) => {
                // Find next grade for range calculation
                const prevGrade = GRADE_LEVELS[idx - 1];
                let rangeText = '';
                if (g.label === 'A') rangeText = '8.5 - 10.0';
                else if (g.label === 'F') rangeText = '< 4.0';
                else {
                  // The upper bound is slightly less than the score of the grade above it
                  // Logic taken from code snippet
                  rangeText = `${g.score.toFixed(1)} - ${(prevGrade?.score ? prevGrade.score - 0.1 : 10.0).toFixed(1)}`;
                }

                return (
                  <tr key={g.label} className="hover:bg-slate-800/50 transition-colors">
                    <td className={`p-6 text-left font-black text-3xl ${g.color}`}>{g.label}</td>
                    <td className="p-6 font-bold text-white text-lg">{rangeText}</td>
                    <td className={`p-6 font-black text-2xl ${g.color}`}>{g.points.toFixed(1)}</td>
                    <td className="p-6 text-right font-black text-slate-400 uppercase tracking-widest text-xs">{g.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeTableModal;