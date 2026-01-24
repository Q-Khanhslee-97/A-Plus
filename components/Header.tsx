import React from 'react';
import { Calculator, ClipboardList, Download } from 'lucide-react';

interface HeaderProps {
  onShowGradeTable: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowGradeTable }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg">
          <Calculator className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">VLUTE Calc </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">QĐ 100/QĐ-ĐHSPKTVL-ĐT</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onShowGradeTable} 
          className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-2xl border border-slate-700 shadow-md transition-all group"
        >
          <ClipboardList className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Tra cứu điểm</span>
        </button>
        {/* Cập nhật href để khớp với base path /A-Plus/ và thư mục public */}
        <a 
          href="/A-Plus/100-QD-QUY-DINH-DAO-TAO-DAI-HOC.pdf" 
          download="100-QD-QUY-DINH-DAO-TAO-DAI-HOC.pdf"
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all group"
        >
          <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest text-center">Tải QĐ 100</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
