import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Calendar, Tag, Edit3, X, Save } from 'lucide-react';
import { Todo, CATEGORIES, getAutoEmoji } from '../types';

interface TodoItemProps {
  key?: string;
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find category option for display color
  const catOption = CATEGORIES.find((cat) => cat.id === todo.category);
  const badgeColor = catOption ? catOption.color : 'bg-stone-100 text-stone-600 border-stone-200';

  // Get matching emoji dynamically
  const emoji = todo.emoji || getAutoEmoji(todo.text, todo.category);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onUpdate(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      id={`todo-item-${todo.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 mb-3 transition-all duration-200 border-l-2 ${
        todo.completed
          ? 'bg-[#fafafa]/80 border-[#b59469] shadow-none'
          : 'bg-white border-transparent border-b border-[#e5e1da]/70 hover:bg-[#fafbf9] hover:border-l-[#b59469]/50'
      }`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Toggle Checkbox Button - Sophisticated Square Theme */}
        <button
          id={`toggle-btn-${todo.id}`}
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? '할일 완료 취소' : '할일 완료 표시'}
          className={`flex items-center justify-center w-5.5 h-5.5 rounded-none border transition-all duration-200 shrink-0 cursor-pointer ${
            todo.completed
              ? 'bg-[#b59469] border-[#b59469] text-white'
              : 'border-[#dcd9d2] hover:border-[#b59469] bg-white'
          }`}
        >
          {todo.completed && <Check size={11} strokeWidth={3} />}
        </button>

        {/* Dynamic Emoji Circle Icon */}
        <div 
          className={`flex items-center justify-center w-8.5 h-8.5 rounded-full shrink-0 border text-base select-none transition-all duration-200 ${
            todo.completed 
              ? 'bg-stone-50 border-stone-200/50 grayscale opacity-60' 
              : 'bg-[#faf9f6] border-[#e5e1da]/60 shadow-2xs'
          }`}
        >
          {emoji}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#fdfdfc] border border-[#b59469] px-2.5 py-1 text-[15px] font-light text-stone-800 outline-hidden focus:ring-1 focus:ring-[#b59469]/20"
            />
          ) : (
            <span
              onClick={() => onToggle(todo.id)}
              className={`text-[15px] leading-relaxed cursor-pointer truncate transition-all duration-200 select-none ${
                todo.completed
                  ? 'text-stone-400 line-through font-light'
                  : 'text-stone-800 font-light hover:text-[#b59469]'
              }`}
            >
              {todo.text}
            </span>
          )}

          {/* Badges container */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {catOption && catOption.id !== 'all' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-bold border tracking-wider uppercase ${badgeColor}`}>
                <Tag size={9} />
                {catOption.label.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim()}
              </span>
            )}

            {todo.dueDate && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-stone-400 tracking-wider">
                <Calendar size={10} />
                {todo.dueDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Button controls (Edit and Delete) */}
      <div className="flex items-center justify-end gap-3 mt-3 sm:mt-0 pl-9 sm:pl-0 shrink-0">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-[#b59469] hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Save size={10} />
            저장
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            aria-label="할일 수정"
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-[#b59469] transition-all duration-150 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            수정
          </button>
        )}

        <button
          id={`delete-btn-${todo.id}`}
          onClick={() => onDelete(todo.id)}
          aria-label="할일 삭제"
          className="flex items-center justify-center px-2.5 py-1 rounded-none text-[10px] uppercase tracking-widest text-stone-400 hover:text-rose-600 transition-all duration-150 sm:opacity-0 group-hover:opacity-100 shrink-0 font-bold cursor-pointer"
        >
          삭제
        </button>
      </div>
    </motion.div>
  );
}

