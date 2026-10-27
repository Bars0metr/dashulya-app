import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { AuthScreen } from './components/AuthScreen';
import { BottomNav } from './components/BottomNav';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { Student, Lesson } from './types';
import { User, Plus, CheckCircle2, AlertTriangle } from '@phosphor-icons/react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('main');
  
  // Тестовые данные для демонстрации (далее можно подключить к Supabase tables)
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Алина Захарова', language: 'English', totalLessons: 10, completedLessons: 8, startDate: '2026-10-12', endDate: '2026-11-12', price: 15000, duration: 60, color: '#ec4899', notes: 'Подготовка к собеседованию' },
    { id: '2', name: 'Мухаммад Аль-Мансур', language: 'Arabic', totalLessons: 10, completedLessons: 5, startDate: '2026-10-01', endDate: '2026-11-01', price: 18000, duration: 90, color: '#38bdf8', notes: 'Диалект Египта' }
  ]);

  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 'l1', studentId: '1', date: '2026-10-28', time: '11:00', topic: 'Present Perfect', completed: false },
    { id: 'l2', studentId: '2', date: '2026-10-28', time: '14:00', topic: 'Алфавит', completed: false }
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <AuthScreen />;
  }

  const handleAddLesson = (newLesson: Lesson) => {
    setLessons((prev) => [...prev, { ...newLesson, id: Date.now().toString() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {activeTab === 'main' && (
          <div className="space-y-6 pb-24">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Дашуля Tutor</h1>
                <p className="text-xs text-slate-400">Управление учениками и абонементами</p>
              </div>
            </div>

            {/* Список учеников (главная) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((student) => (
                <div key={student.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: student.color }} />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm">{student.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">{student.language}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">
                    Проведено: {student.completedLessons} из {student.totalLessons}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarView students={students} lessons={lessons} onAddLesson={handleAddLesson} />
        )}

        {activeTab === 'settings' && <SettingsView />}

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
