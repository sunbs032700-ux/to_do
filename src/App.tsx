import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, ListTodo, Calendar, Filter, AlertCircle } from 'lucide-react';
import { Todo, FilterType, CATEGORIES } from './types';
import TodoStats from './components/TodoStats';
import TodoItem from './components/TodoItem';

// Initial default items to provide a clean and delightful first-use experience
const INITIAL_TODOS: Todo[] = [
  {
    id: 'init-1',
    text: '완료 버튼을 누르면 이 할일처럼 줄이 가요!',
    completed: true,
    category: 'life',
    createdAt: Date.now() - 3600000 * 2,
    dueDate: '2026-07-10',
  },
  {
    id: 'init-2',
    text: '할일 관리 앱 구경하고 피드백 작성하기',
    completed: false,
    category: 'work',
    createdAt: Date.now() - 3600000,
    dueDate: '2026-07-11',
  },
  {
    id: 'init-3',
    text: '매일 아침 시원한 물 한 잔 마시기',
    completed: false,
    category: 'health',
    createdAt: Date.now(),
  }
];

export default function App() {
  // Load initial todos from localStorage or use defaults
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todo_list_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved todos', e);
      }
    }
    return INITIAL_TODOS;
  });

  // State for form inputs
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('life');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState(false);

  // Filter states
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Sync todos to local storage
  useEffect(() => {
    localStorage.setItem('todo_list_items', JSON.stringify(todos));
  }, [todos]);

  // Handle adding a new todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setFormError(true);
      // Clear error after 2.5 seconds
      setTimeout(() => setFormError(false), 2500);
      return;
    }

    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: inputText.trim(),
      completed: false,
      category,
      createdAt: Date.now(),
      dueDate: dueDate || undefined,
    };

    // Add new items to the top of the list
    setTodos((prev) => [newTodo, ...prev]);

    // Reset input fields
    setInputText('');
    setDueDate('');
    setFormError(false);
  };

  // Toggle todo completion
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Update a todo's text (and clear custom emoji so it auto-recalculates)
  const handleUpdateTodo = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText, emoji: undefined } : todo
      )
    );
  };

  // Filtered todos based on active filters and categories
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 1. Filter by completion state
      if (activeFilter === 'active' && todo.completed) return false;
      if (activeFilter === 'completed' && !todo.completed) return false;

      // 2. Filter by category
      if (selectedCatFilter !== 'all' && todo.category !== selectedCatFilter) return false;

      return true;
    });
  }, [todos, activeFilter, selectedCatFilter]);

  // Clean all completed todos
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] bg-[radial-gradient(circle_at_top_right,_#f3eee3,_#fafaf7_50%)] text-stone-800 antialiased py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between font-sans">
      <div className="max-w-xl w-full mx-auto flex-1">
        
        {/* App Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-none bg-white text-[#b59469] mb-4 border border-[#e5e1da] shadow-2xs">
            <ListTodo size={22} strokeWidth={1.8} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif italic text-stone-900 tracking-tight">Today's Intentions</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mt-2.5 font-bold">Pristine Task Orchestration</p>
        </header>

        {/* Dynamic Statistics Block */}
        <TodoStats todos={todos} />

        {/* Input Form Card */}
        <div id="todo-input-card" className="bg-white rounded-none p-6 border border-[#e5e1da] mb-8 shadow-xs">
          <form onSubmit={handleAddTodo} className="space-y-5">
            <div>
              <label htmlFor="todo-input" className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.25em] mb-2">
                새로운 할일 입력
              </label>
              <div className="relative">
                <input
                  id="todo-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (e.target.value.trim()) setFormError(false);
                  }}
                  placeholder="다음 집중할 작업은 무엇입니까?"
                  className={`w-full bg-transparent border-b py-3.5 pr-14 text-[15px] text-stone-800 placeholder-stone-300 transition-colors duration-200 outline-hidden ${
                    formError
                      ? 'border-rose-300 focus:border-rose-500'
                      : 'border-stone-200 focus:border-[#b59469]'
                  }`}
                />
                
                {/* Submit button with square custom theme inside input area */}
                <button
                  id="add-todo-btn"
                  type="submit"
                  aria-label="할일 추가"
                  className="absolute right-0 top-1.5 w-10 h-10 rounded-none bg-[#b59469] text-white flex items-center justify-center hover:bg-[#a08055] transition-colors duration-150 cursor-pointer"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Validation Warning Alert */}
              <AnimatePresence>
                {formError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-rose-500 font-semibold mt-2.5 flex items-center gap-1.5"
                  >
                    <AlertCircle size={12} />
                    내용을 입력해 주세요! 공백은 추가할 수 없습니다.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Additional Options (Category and Due Date) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-stone-100">
              {/* Category selector */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.25em] mb-2">
                  영역 분류
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.filter(cat => cat.id !== 'all').map((cat) => (
                    <button
                      id={`cat-select-${cat.id}`}
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-none text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                        category === cat.id
                          ? 'border-[#b59469] bg-[#faf6f0] text-[#b59469] font-bold'
                          : 'border-stone-200 text-stone-500 bg-transparent hover:border-stone-300 hover:text-stone-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date input */}
              <div>
                <label htmlFor="due-date-input" className="block text-[10px] font-bold text-stone-400 uppercase tracking-[0.25em] mb-2 flex items-center gap-1.5">
                  <Calendar size={11} />
                  수행 기한 (선택)
                </label>
                <input
                  id="due-date-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-none text-xs font-medium text-stone-600 focus:border-[#b59469] transition-colors duration-150 outline-hidden"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Interactive Filtering Options */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pt-1">
          {/* Status Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-none border border-stone-200/60 w-fit">
            <button
              id="filter-all-btn"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-stone-950 shadow-2xs border border-stone-200/40 font-extrabold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              전체
            </button>
            <button
              id="filter-active-btn"
              onClick={() => setActiveFilter('active')}
              className={`px-3.5 py-1.5 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                activeFilter === 'active'
                  ? 'bg-white text-stone-950 shadow-2xs border border-stone-200/40 font-extrabold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              수행 중
            </button>
            <button
              id="filter-completed-btn"
              onClick={() => setActiveFilter('completed')}
              className={`px-3.5 py-1.5 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all duration-150 cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-white text-stone-950 shadow-2xs border border-stone-200/40 font-extrabold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              완수됨
            </button>
          </div>

          {/* Quick Clear & Category Filtering */}
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            {/* Category selection filter dropdown */}
            <div className="relative flex items-center gap-1.5 bg-white border border-stone-200 rounded-none px-2.5 py-1.5 text-xs text-stone-600 shadow-2xs">
              <Filter size={11} className="text-stone-400" />
              <select
                id="category-filter-select"
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="bg-transparent font-medium pr-1 cursor-pointer outline-hidden border-none text-xs text-stone-600 focus:ring-0"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white text-stone-700">
                    {cat.id === 'all' ? '전체 영역 필터' : cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear completed button */}
            {todos.some((t) => t.completed) && (
              <button
                id="clear-completed-btn"
                onClick={handleClearCompleted}
                className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 rounded-none transition-all duration-150 cursor-pointer"
              >
                완수 비우기
              </button>
            )}
          </div>
        </div>

        {/* Todo List Area */}
        <div id="todo-items-list-container" className="min-h-[250px]">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={handleUpdateTodo}
                />
              ))
            ) : (
              // Empty list fallback state with clean layout
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-none border border-dashed border-[#e5e1da]"
              >
                <div className="w-11 h-11 rounded-none bg-stone-50 flex items-center justify-center mb-4 text-stone-300 border border-stone-200/60">
                  <ListTodo size={18} />
                </div>
                <h3 className="text-sm font-serif italic text-[#b59469]">작업이 비어 있습니다</h3>
                <p className="text-xs text-stone-400 mt-1.5 max-w-[240px] font-light leading-relaxed">
                  {activeFilter === 'completed'
                    ? '완수된 기록이 없습니다. 차분하게 과업을 완수해 보십시오.'
                    : activeFilter === 'active'
                    ? '오늘 예정된 과업을 모두 완료하셨습니다. 홀가분한 순간입니다.'
                    : '새로운 할일을 아래에 기입하여 오늘 하루의 의지를 기록해 보십시오.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Beautiful sophisticated footer */}
      <footer className="w-full text-center mt-16 py-6 border-t border-[#e5e1da]">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400">
          ⓒ 2026 Today's Intentions. Pristine task Orchestration.
        </p>
      </footer>
    </div>
  );
}

