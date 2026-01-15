import React from 'react';
import { User, Mail, ShieldAlert } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="space-y-10 pt-20 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-500">
            <User className="w-5 h-5" />
            <h4 className="text-sm font-black uppercase tracking-widest">Thông tin nhà phát triển</h4>
          </div>
          <p className="text-xl font-black text-white">Lê Quốc Khánh</p>
          <div className="flex items-center gap-3 text-slate-500 hover:text-indigo-400 transition-colors">
            <Mail className="w-4 h-4" />
            <a href="mailto:khanhquocle297@gmail.com" className="text-sm font-bold border-b border-transparent hover:border-indigo-400">khanhquocle297@gmail.com</a>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md italic">
            Sản phẩm được xây dựng từ tâm huyết cá nhân nhằm hỗ trợ các bạn sinh viên VLUTE (Khóa 50) có cái nhìn trực quan hơn về kết quả học tập của mình.
          </p>
        </div>
        
        <div className="space-y-4 border-l border-slate-800 pl-0 md:pl-8">
          <div className="flex items-center gap-3 text-amber-500">
            <ShieldAlert className="w-5 h-5" />
            <h4 className="text-sm font-black uppercase tracking-widest">Lưu ý quan trọng</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Đây là <strong className="text-amber-500">dự án cá nhân</strong>, không phải là công cụ chính thức từ Trường Đại học Sư phạm Kỹ thuật Vĩnh Long (VLUTE).
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hệ thống dựa trên các tham số của Quyết định 100/QĐ-ĐHSPKTVL-ĐT nhưng có thể xuất hiện sai số trong một vài tình huống. Kết quả chỉ mang tính chất <strong className="text-indigo-400">tham khảo</strong>.
          </p>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-4">
            VLUTE GRADE Master • VERSION 1.0 • 2026
          </p>
        </div>
      </div>
      <div className="text-center opacity-30 select-none">
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-500">BUILD WITH PASSION BY QUOC KHANH LE • K50</p>
      </div>
    </footer>
  );
};

export default Footer;