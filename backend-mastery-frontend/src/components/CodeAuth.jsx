import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyRound, ArrowRight, Loader2, ShieldCheck, LogOut } from 'lucide-react';
import { loginWithCode, logout, clearAuthError } from '../store/slices/authSlice';

export default function CodeAuth({ children }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(s => s.auth);
  const [code, setCode] = useState('');

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!code.trim()) return;
    dispatch(clearAuthError());
    await dispatch(loginWithCode(code.trim()));
  };

  if (user) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-500 to-pink-500 mb-4 shadow-lg shadow-ink-900/50">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Backend Mastery</h1>
          <p className="text-slate-400 text-sm">Enter your access code to continue</p>
        </div>

        <form onSubmit={submit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
              Access code
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter code"
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-ink-500/60"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in as Omkar
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Default code is set as <code className="text-slate-400">LOGIN_CODE</code>
        </p>
      </div>
    </div>
  );
}

export { logout };
