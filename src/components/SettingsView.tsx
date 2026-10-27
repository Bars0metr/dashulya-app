import React from 'react';
import { supabase } from '../supabaseClient';
import { SignOut, Shield, Palette } from '@phosphor-icons/react';

export function SettingsView() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto pt-4">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-xs text-slate-400">Управление аккаунтом и приложением</p>
      </div>

      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Аккаунт владельца</h3>
            <p className="text-xs text-slate-400">Сессия защищена Supabase Auth</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <SignOut size={16} />
          Выйти из личного кабинета
        </button>
      </div>
    </div>
  );
}
