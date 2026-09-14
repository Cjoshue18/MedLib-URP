import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Eye, EyeOff, RefreshCw, XCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !password.trim()) {
      setLoginError('Por favor ingrese su usuario y contraseña institucional.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await authService.login({ username: username.trim(), password: password.trim() });
      setPassword('');
      onLoginSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Credenciales inválidas.';
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-[#008744]/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 rounded-full bg-[#00572B]/20 blur-3xl pointer-events-none"></div>

      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a la Biblioteca Virtual</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Acceso Seguro ALFIN URP</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border-2 border-slate-900 shadow-urp-brutal overflow-hidden">
          <div className="bg-gradient-to-r from-[#00572B] via-[#008744] to-[#00A859] p-6 text-white text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black font-display tracking-tight uppercase">
              Gestión Bibliotecaria FAMURP
            </h1>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Facultad de Medicina Humana &bull; Universidad Ricardo Palma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="admin-username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Usuario Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  name="username"
                  autoComplete="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. admin_famurp"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 text-slate-900 text-sm font-medium outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#008744] focus:ring-2 focus:ring-[#008744]/20 text-slate-900 text-sm font-medium outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl font-display font-bold text-sm text-white bg-[#008744] hover:bg-[#00572B] active:translate-y-0.5 border-2 border-slate-900 shadow-urp-brutal-green transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ingresar al Panel de Gestión</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="relative z-10 text-center text-xs text-slate-500 max-w-5xl mx-auto w-full">
        Facultad de Medicina Humana &bull; Biblioteca Especializada URP &bull; Sistema de Gestión v1.0
      </footer>
    </div>
  );
};
