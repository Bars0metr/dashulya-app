import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { authSchema } from '../types';
import { Envelope, Lock, ShieldCheck, Sparkle } from '@phosphor-icons/react';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        alert('Регистрация успешна! Проверьте почту для подтверждения (если требуется) или войдите.');
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-slate-100">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Sparkle size={32} weight="duotone" />
          </div>
          <h1 className="text-2xl font-bold">Дашуля Tutor</h1>
          <p className="text-xs text-slate-400">Личный кабинет преподавателя</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300">Электронная почта</label>
            <div className="relative">
              <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tutor@example.com"
                className="w-full pl-10 pr-4 py-3 bg-black/30 rounded-xl border border-white/10 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-black/30 rounded-xl border border-white/10 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-600 hover:bg-pink-500 font-semibold text-white rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} />
            {loading ? 'Загрузка...' : isLogin ? 'Войти в систему' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="text-center text-xs">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-400 hover:underline"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
