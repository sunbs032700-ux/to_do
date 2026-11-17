export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  createdAt: number;
  dueDate?: string;
  emoji?: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface CategoryOption {
  id: string;
  label: string;
  color: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: '전체', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  { id: 'work', label: '업무 💼', color: 'bg-amber-50/70 text-amber-800 border-amber-200/50' },
  { id: 'study', label: '학습 📖', color: 'bg-teal-50/70 text-teal-800 border-teal-200/50' },
  { id: 'life', label: '일상 🏠', color: 'bg-rose-50/70 text-rose-800 border-rose-200/50' },
  { id: 'health', label: '건강 🏃', color: 'bg-emerald-50/70 text-emerald-800 border-emerald-200/50' },
];

export function getAutoEmoji(text: string, category: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('공부') || lowerText.includes('학습') || lowerText.includes('공책') || lowerText.includes('시험') || lowerText.includes('독서') || lowerText.includes('책') || lowerText.includes('공부')) return '📖';
  if (lowerText.includes('업무') || lowerText.includes('일') || lowerText.includes('회사') || lowerText.includes('회의') || lowerText.includes('미팅') || lowerText.includes('프로젝트') || lowerText.includes('개발') || lowerText.includes('코딩')) return '💼';
  if (lowerText.includes('물') || lowerText.includes('커피') || lowerText.includes('차') || lowerText.includes('음료') || lowerText.includes('드링크')) return '☕';
  if (lowerText.includes('운동') || lowerText.includes('헬스') || lowerText.includes('달리기') || lowerText.includes('런닝') || lowerText.includes('요가') || lowerText.includes('산책') || lowerText.includes('조깅')) return '🏃';
  if (lowerText.includes('청소') || lowerText.includes('빨래') || lowerText.includes('집') || lowerText.includes('가정') || lowerText.includes('정리') || lowerText.includes('마트') || lowerText.includes('장보기') || lowerText.includes('쇼핑')) return '🏠';
  if (lowerText.includes('약') || lowerText.includes('영양제') || lowerText.includes('비타민') || lowerText.includes('유산균') || lowerText.includes('병원')) return '💊';
  if (lowerText.includes('약속') || lowerText.includes('친구') || lowerText.includes('데이트') || lowerText.includes('가족') || lowerText.includes('식사') || lowerText.includes('외식')) return '✨';
  if (lowerText.includes('영화') || lowerText.includes('넷플') || lowerText.includes('유튜브') || lowerText.includes('음악') || lowerText.includes('비디오') || lowerText.includes('드라마')) return '🎬';
  if (lowerText.includes('잠') || lowerText.includes('취침') || lowerText.includes('수면') || lowerText.includes('휴식')) return '🛌';
  if (lowerText.includes('생일') || lowerText.includes('기념일') || lowerText.includes('선물') || lowerText.includes('파티')) return '🎉';
  if (lowerText.includes('돈') || lowerText.includes('은행') || lowerText.includes('계좌') || lowerText.includes('이체') || lowerText.includes('납부') || lowerText.includes('카드')) return '💳';
  if (lowerText.includes('메모') || lowerText.includes('기록') || lowerText.includes('일기') || lowerText.includes('작성')) return '📝';

  // Default by category
  switch (category) {
    case 'work': return '💼';
    case 'study': return '📖';
    case 'life': return '🏠';
    case 'health': return '🏃';
    default: return '✏️';
  }
}
