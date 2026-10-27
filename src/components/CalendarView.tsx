import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CaretLeft, CaretRight, Plus } from '@phosphor-icons/react';
import { Lesson, Student } from '../types';

interface CalendarViewProps {
  students: Student[];
  lessons: Lesson[];
  onAddLesson: (lesson: Lesson) => void;
}

export function CalendarView({ students, lessons, onAddLesson }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Форма добавления урока в модалке
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [time, setTime] = useState('12:00');
  const [topic, setTopic] = useState('');

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    onAddLesson({
      studentId,
      date: format(selectedDay, 'yyyy-MM-dd'),
      time,
      topic,
      completed: false,
    });
    setIsModalOpen(false);
    setTopic('');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Шапка календаря */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <h2 className="text-lg font-bold capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
            <CaretLeft size={18} />
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
            <CaretRight size={18} />
          </button>
        </div>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Сетка месяца */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayLessons = lessons.filter((l) => l.date === dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => {
                setSelectedDay(day);
                setIsModalOpen(true);
              }}
              className="min-h-[85px] p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <span className="text-xs font-medium text-slate-300">{format(day, 'd')}</span>
              
              {/* Прямоугольники занятий с автоматическим уменьшением */}
              <div className="space-y-1 overflow-y-auto max-h-[55px] no-scrollbar">
                {dayLessons.map((lesson) => {
                  const student = students.find((s) => s.id === lesson.studentId);
                  const color = student?.color || '#ec4899';

                  return (
                    <div
                      key={lesson.id || Math.random()}
                      style={{ backgroundColor: color }}
                      className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white truncate shadow-sm"
                      title={`${lesson.time} - ${student?.name}`}
                    >
                      {lesson.time} {student?.name || 'Ученик'}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно добавления урока */}
      {isModalOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-white/20 p-6 rounded-3xl space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-bold">
              Урок на {format(selectedDay, 'dd MMMM yyyy', { locale: ru })}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400">Ученик</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-2.5 bg-black/40 rounded-xl border border-white/10 text-slate-100"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.language})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">Время</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 bg-black/40 rounded-xl border border-white/10 text-slate-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-400">Тема урока</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Например: Present Simple"
                  className="w-full p-2.5 bg-black/40 rounded-xl border border-white/10 text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-white/10 rounded-xl font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: students.find(s => s.id === studentId)?.color || '#ec4899' }}
                  className="flex-1 py-2 text-white rounded-xl font-semibold shadow-md"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
