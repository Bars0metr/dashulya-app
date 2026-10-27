import React from 'react';
import { House, CalendarBlank, GearSix } from '@phosphor-icons/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'main', label: 'Главная', icon: House },
    { id: 'calendar', label: 'Календарь', icon: CalendarBlank },
    { id: 'settings', label: 'Настройки', icon: GearSix },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-1.5">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 scale-105' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
