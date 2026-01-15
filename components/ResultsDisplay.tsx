import React, { useState } from 'react';
import { Calculator, CheckCircle2, X, Eye, Target, Scale } from 'lucide-react';
import { CalculationResult, ResultItem } from '../types';
import { GRADE_LEVELS } from '../utils/constants';

interface ResultsDisplayProps {
  results: CalculationResult | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [selectedItem, setSelectedItem] = useState<ResultItem | null>(null);

  if (!results) {
    return (
      <div className="py-24 border-2 border-dashed rounded-[4rem] border-slate-800 flex flex-col items-center justify-center text-center opacity-20">
        <Calculator className="w-16 h-16 mb-6 text-slate-500" />
        <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-500 text-center">Sẵn sàng phân tích dữ liệu</p>
      </div>
    );
  }

  // --- LOGIC HIỂN THỊ CHO 1 MỤC TIÊU CỤ THỂ ---
  if (results.type === 'all_targets' && results.list && results.list.length === 1) {
    const item = results.list[0];
    const levelInfo = GRADE_LEVELS.find(g => g.label === item.level);
    if (!levelInfo) return null;

    const minC1 = item.data.list && item.data.list.length > 0 ? item.data.list[0].c1 : 'N/A';
    const minC2 = item.data.list && item.data.list.length > 0 ? item.data.list[item.data.list.length - 1].c2 : 'N/A';

    return (
      <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-8 pb-20">
        {/* Header Mục tiêu */}
        <div className={`text-center space-y-2 p-8 rounded-[3rem] border-2 ${levelInfo.border} ${levelInfo.lightBg}`}>
           <p className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">Mục tiêu cụ thể</p>
           <h2 className={`text-6xl font-black ${levelInfo.color} tracking-tighter`}>HẠNG {item.level}</h2>
           <p className="text-sm font-bold text-slate-400">Cần đạt GPA tối thiểu: {item.minScore}</p>
        </div>

        {!item.data.isPossible ? (
           <div className="py-16 bg-slate-900 rounded-[3rem] border border-slate-800 flex flex-col items-center justify-center text-center text-slate-500">
              <X className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl font-bold uppercase">Mục tiêu không khả thi</p>
              <p className="text-sm mt-2 max-w-md">Dù bạn đạt điểm tối đa ở các cột còn lại, GPA vẫn không thể chạm mốc này.</p>
           </div>
        ) : (
          <>
            {/* Trường hợp chỉ thiếu 1 cột */}
            {item.data.type === 'single' ? (
               <div className="bg-slate-900 rounded-[3rem] border border-slate-800 p-12 text-center shadow-2xl">
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">{item.data.field} CẦN ĐẠT</p>
                  <div className={`text-[8rem] leading-none font-black ${levelInfo.color}`}>{item.data.val}</div>
               </div>
            ) : (
               /* Trường hợp thiếu nhiều cột -> Hiển thị Min/Min, Uniform và Bảng */
               <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Target className="w-24 h-24" /></div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{item.data.labels?.[0]} tối thiểu</p>
                        <p className={`text-7xl font-black ${levelInfo.color}`}>{minC1}</p>
                        <p className="text-[10px] text-slate-500 mt-4 italic">*Khi {item.data.labels?.[1]} đạt tối đa</p>
                     </div>
                     <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Target className="w-24 h-24" /></div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{item.data.labels?.[1]} tối thiểu</p>
                        <p className={`text-7xl font-black ${levelInfo.color}`}>{minC2}</p>
                        <p className="text-[10px] text-slate-500 mt-4 italic">*Khi {item.data.labels?.[0]} đạt tối đa</p>
                     </div>
                     <div className="bg-indigo-900/10 p-8 rounded-[3rem] border border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/50 transition-all shadow-xl shadow-indigo-500/5">
                        <div className="absolute top-0 right-0 p-8 opacity-20"><Scale className="w-24 h-24 text-indigo-400" /></div>
                        <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-2">Đồng đều</p>
                        <p className={`text-7xl font-black ${levelInfo.color}`}>{item.data.uniformScore}</p>
                        <p className="text-[10px] text-indigo-300/60 mt-4 italic">*Nếu tất cả cột thiếu bằng nhau</p>
                     </div>
                  </div>

                  {/* Table Section */}
                  <div className="bg-slate-900 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
                     <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><Calculator className="w-5 h-5"/></div>
                           <h3 className="text-lg font-black uppercase tracking-wide text-white">Bảng các kịch bản khả thi</h3>
                        </div>
                        <span className="text-[10px] font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-400">{item.data.list?.length} trường hợp</span>
                     </div>
                     
                     <div className="overflow-x-auto">
                        <table className="w-full text-center">
                           <thead className="bg-slate-950/50 text-xs font-black uppercase text-slate-500">
                              <tr>
                                 <th className="py-6 px-4">{item.data.labels?.[0]}</th>
                                 <th className="py-6 px-4 border-l border-r border-slate-800">{item.data.labels?.[1]}</th>
                                 <th className="py-6 px-4">GPA Đạt Được</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-800 text-sm">
                              {item.data.list?.map((scenario, sIdx) => (
                                 <tr key={sIdx} className="hover:bg-indigo-900/10 transition-colors group">
                                    <td className="py-5 px-4 font-bold text-slate-300 group-hover:text-white transition-colors">{scenario.c1}</td>
                                    <td className={`py-5 px-4 font-black text-lg ${levelInfo.color} border-l border-r border-slate-800`}>{scenario.c2}</td>
                                    <td className="py-5 px-4 font-bold text-slate-500">{scenario.gpa}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}
          </>
        )}
      </div>
    );
  }

  // --- LOGIC HIỂN THỊ CHO NHIỀU MỤC TIÊU (GRID) ---
  return (
    <div className="animate-in zoom-in-95 duration-500 space-y-12 pb-20">
      {/* SECTION 1: KẾT QUẢ ĐIỂM THẬT (FINAL) */}
      {results.type === 'final' && results.grade && (
        <div className={`max-w-2xl mx-auto border-2 ${results.grade.border} ${results.grade.lightBg} p-12 rounded-[4rem] text-center shadow-2xl relative overflow-hidden`}>
          <div className={`absolute -top-10 -right-10 opacity-10 ${results.grade.color}`}><CheckCircle2 className="w-64 h-64" /></div>
          <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 text-center">Kết quả học phần thực tế</p>
          <h2 className={`text-[11rem] font-black ${results.grade.color} tracking-tighter leading-none mb-4 drop-shadow-2xl text-center`}>{String(results.val)}</h2>
          <div className="flex flex-col items-center gap-8 mt-10">
            <div className={`px-16 py-5 ${results.grade.bg} text-white rounded-[2.5rem] text-3xl font-black uppercase tracking-widest shadow-xl`}>HẠNG {String(results.grade.label)}</div>
            <div className="bg-slate-900/50 px-10 py-4 rounded-3xl border border-slate-800 flex items-center gap-6 shadow-inner">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">GPA Hệ 4.0:</span>
              <span className={`text-3xl font-black ${results.grade.color}`}>{String(results.points4)}</span>
            </div>
          </div>
          {results.isPartial && <p className="mt-8 text-[10px] font-bold text-amber-500 uppercase animate-pulse tracking-widest text-center">Lưu ý: Bạn đang xem điểm trung bình tạm tính</p>}
        </div>
      )}

      {/* SECTION 2: DANH SÁCH DỰ BÁO (ALL TARGETS - GRID VIEW) */}
      {results.type === 'all_targets' && results.list && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.list.map((item, idx) => {
            const levelInfo = GRADE_LEVELS.find(g => g.label === item.level);
            if (!levelInfo) return null;

            return (
              <div key={idx} className={`bg-slate-900 rounded-[3rem] border-2 transition-all duration-500 flex flex-col ${!item.data.isPossible ? 'border-slate-800 opacity-20 grayscale' : 'border-slate-800 hover:border-indigo-500 hover:-translate-y-1 shadow-xl shadow-indigo-500/10'}`}>
                {/* Header Card */}
                <div className={`p-6 ${!item.data.isPossible ? 'bg-slate-800/50' : 'bg-indigo-900/20'} border-b border-slate-800 flex justify-between items-center rounded-t-[3rem]`}>
                  <span className={`text-2xl font-black ${item.data.isPossible ? levelInfo.color : 'text-slate-500'} tracking-tighter`}>HẠNG {String(item.level)}</span>
                  <div className="text-right"><p className="text-[9px] font-black text-slate-500 uppercase">Hệ 4: {levelInfo.points.toFixed(1)}</p></div>
                </div>

                {/* Body Card */}
                <div className="p-6 flex-1 flex flex-col justify-start min-h-[220px]">
                  {/* SINGLE MISSING */}
                  {item.data?.type === 'single' ? (
                    <div className="text-center animate-in fade-in space-y-6 my-auto">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{String(item.data.field)} cần</p>
                        <div className={`text-8xl font-black ${levelInfo.color} tracking-tighter text-center`}>{String(item.data.val)}</div>
                      </div>
                      <div className="pt-4 border-t border-slate-800/50">
                        <p className="text-[9px] font-black text-slate-500 uppercase text-center mb-1 tracking-widest text-slate-500">Cận điểm đạt</p>
                        <p className={`text-2xl font-black text-center ${levelInfo.color}`}>{item.minScore.toFixed(2)}</p>
                      </div>
                    </div>
                  ) : (
                    /* MULTI MISSING */
                    <div className="space-y-4 h-full flex flex-col">
                      {item.data.isPossible && item.data?.list && item.data.list.length > 0 ? (
                        <>
                           <div className="flex-1 flex flex-col justify-center space-y-4 animate-in fade-in">
                              <div className="text-center space-y-3">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Các cột thiếu cần đạt</p>
                                <div className={`text-7xl font-black ${levelInfo.color} tracking-tighter`}>{item.data.uniformScore}</div>
                                <p className="text-[9px] text-slate-500 italic px-4 text-center">
                                  Điểm số này cần đạt ở <strong>tất cả</strong> các cột còn thiếu.
                                </p>
                              </div>
                           </div>
                           
                           <button 
                            onClick={() => setSelectedItem(item)}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-slate-700 hover:border-indigo-500/50"
                           >
                              <Eye className="w-4 h-4" /> Các kịch bản khác
                           </button>
                        </>
                      ) : (
                        <div className="text-center py-6 flex flex-col items-center justify-center opacity-40 h-full">
                          <X className="w-10 h-10 text-slate-600 mb-3" /><p className="text-[10px] font-black uppercase text-slate-600 text-center">Không khả thi</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CHI TIẾT (Cho Grid View) */}
      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

// Component con: Modal chi tiết (Dùng chung)
const DetailModal = ({ item, onClose }: { item: ResultItem; onClose: () => void }) => {
  const levelInfo = GRADE_LEVELS.find(g => g.label === item.level);
  if (!levelInfo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        
        {/* Header Modal */}
        <div className={`p-8 ${levelInfo.bg} flex justify-between items-center`}>
          <div>
            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Chi tiết kịch bản</p>
            <h3 className="text-3xl font-black text-white tracking-tighter">HẠNG {item.level}</h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-900 p-6">
          <div className="bg-slate-950/50 rounded-3xl border border-slate-800 overflow-hidden flex-1 flex flex-col">
            <div className="grid grid-cols-3 bg-slate-800 p-4 text-[10px] font-black uppercase text-slate-400 text-center border-b border-slate-700">
              <div>{item.data.labels?.[0]}</div>
              <div className="border-l border-r border-slate-600">{item.data.labels?.[1]}</div>
              <div>Kết quả GPA</div>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar p-2 flex-1">
              <table className="w-full text-center">
                <tbody className="divide-y divide-slate-800/50">
                  {item.data.list?.map((scenario, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-2 font-bold text-slate-400 group-hover:text-white transition-colors">{scenario.c1}</td>
                      <td className={`py-3 px-2 font-black text-lg ${levelInfo.color} border-l border-r border-slate-800/50`}>{scenario.c2}</td>
                      <td className="py-3 px-2 font-bold text-slate-500">{scenario.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-500 max-w-xs mx-auto italic">
              Bảng trên liệt kê tất cả các cặp điểm khả thi để đạt được GPA mục tiêu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
