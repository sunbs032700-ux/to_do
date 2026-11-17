import React from 'react';
import { Todo } from '../types';

interface TodoStatsProps {
  todos: Todo[];
}

export default function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  // Motivational message based on progress
  let encouragement = '오늘 하루도 차근차근 시작해봐요. ☕';
  if (total > 0) {
    if (percentage === 100) {
      encouragement = '모든 할일을 완료했습니다. 완벽한 하루네요. ✨';
    } else if (percentage >= 70) {
      encouragement = '거의 다 왔습니다. 조금만 더 힘을 내세요. 🔥';
    } else if (percentage >= 30) {
      encouragement = '잘하고 있습니다. 계속 정진해 보십시오. 🧭';
    } else {
      encouragement = '하나씩 천천히 완료해나가 봅시다. 📖';
    }
  }

  return (
    <div id="todo-stats-card" className="bg-white rounded-none p-6 border border-[#e5e1da] mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">오늘의 도달도</h2>
          <p className="text-xs text-stone-600 mt-1 font-light">{encouragement}</p>
        </div>
        <div className="flex items-baseline gap-1 self-start sm:self-center">
          <span className="text-3xl font-serif italic text-[#b59469] tracking-tight">{completedCount}</span>
          <span className="text-stone-300 text-sm">/</span>
          <span className="text-stone-500 text-sm font-medium">{total} 개 완수</span>
        </div>
      </div>

      <div className="relative w-full h-1.5 bg-stone-100 rounded-none overflow-hidden">
        <div
          id="todo-progress-bar"
          className="absolute left-0 top-0 h-full bg-[#b59469] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono tracking-widest text-stone-400">
        <span>0%</span>
        <span className="font-bold text-[#b59469]">{percentage}% 완료됨</span>
        <span>100%</span>
      </div>
    </div>
  );
}

