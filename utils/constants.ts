import { GradeLevel } from '../types';

export const GRADE_LEVELS: GradeLevel[] = [
  { label: 'A', score: 8.5, points: 4.0, description: 'Xuất sắc', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-500/30', lightBg: 'bg-emerald-900/10' },
  { label: 'B+', score: 7.8, points: 3.5, description: 'Giỏi', color: 'text-indigo-400', bg: 'bg-indigo-500', border: 'border-indigo-500/30', lightBg: 'bg-indigo-900/10' },
  { label: 'B', score: 7.0, points: 3.0, description: 'Khá', color: 'text-indigo-500', bg: 'bg-indigo-600', border: 'border-indigo-600/30', lightBg: 'bg-indigo-900/10' },
  { label: 'C+', score: 6.3, points: 2.5, description: 'Trung bình khá', color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/30', lightBg: 'bg-amber-900/10' },
  { label: 'C', score: 5.5, points: 2.0, description: 'Trung bình', color: 'text-amber-500', bg: 'bg-amber-600', border: 'border-amber-600/30', lightBg: 'bg-amber-900/10' },
  { label: 'D+', score: 4.8, points: 1.5, description: 'Trung bình yếu', color: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500/30', lightBg: 'bg-orange-900/10' },
  { label: 'D', score: 4.0, points: 1.0, description: 'Yếu', color: 'text-orange-500', bg: 'bg-orange-600', border: 'border-orange-600/30', lightBg: 'bg-orange-900/10' },
  { label: 'F', score: 0.0, points: 0.0, description: 'Không đạt', color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/30', lightBg: 'bg-red-900/20' },
];