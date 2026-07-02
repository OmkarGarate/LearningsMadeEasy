import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startRegistration, finishRegistration, startLogin, finishLogin, clearAuthError, selectAuthStatus } from '../store/slices/authSlice';
import { startRegistration as startRegBrowser, startAuthentication as startAuthBrowser } from '@simplewebauthn/browser';
import { Fingerprint, User, ArrowRight, AlertTriangle, Loader2, LogOut, ShieldCheck, Sparkles, Monitor, Smartphone, Trash2 } from 'lucide-react';

function detectDevice() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) return 'Android';
  if (/Mac OS/.test(ua)) return 'Mac';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Linux/.test(ua)) return 'Linux';
  return 'This device';
}

function deviceIcon(name) {
  if (/iPhone|iPad|Android/.test(name)) return <Smartphone size={14} />;
  return <Monitor size={14} />;
}

export default function EmailAuth({ children }) {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const error = useSelector(s => s.auth.error);
  const user = useSelector(s => s.auth.user);

  const [step, setStep] = useState('username'); // 'username' | 'register' | 'login'
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);

  if (authStatus === 'authenticated' && user) {
    return <>{children}</>;
  }

  const handleSignUp = async (e) => {
    e?.preventDefault();
    if (username.length < 3) return;
    setBusy(true);
    dispatch(clearAuthError());
    try {
      const { options, isNewUser } = await dispatch(startRegistration({
        username: username.toLowerCase(),
        displayName: username,
      })).unwrap();

      // Convert challenge from base64url to base64 for browser lib
      const browserOptions = {
        ...options,
        challenge: options.challenge, // already base64url, simplewebauthn handles it
      };

      // Browser creates the passkey
      const credential = await startRegBrowser({ optionsJSON: browserOptions });

      // Send to server to verify
      await dispatch(finishRegistration({
        username: username.toLowerCase(),
        displayName: username,
        credential,
        challenge: options.challenge,
      })).unwrap();

      // Success — user is set in Redux, component will re-render to show app
    } catch (err) {
      console.error('Sign up error:', err);
      if (err.name === 'NotAllowedError') {
        dispatch(clearAuthError());
        // user cancelled — silently go back
        setStep('username');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = async (e) => {
    e?.preventDefault();
    if (username.length < 3) return;
    setBusy(true);
    dispatch(clearAuthError());
    try {
      const { options } = await dispatch(startLogin({ username: username.toLowerCase() })).unwrap();

      const credential = await startAuthBrowser({ optionsJSON: options });

      await dispatch(finishLogin({
        credential,
        challenge: options.challenge,
      })).unwrap();
    } catch (err) {
      console.error('Sign in error:', err);
      if (err.name === 'NotAllowedError') {
        dispatch(clearAuthError());
        setStep('username');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900/50 via-slate-950 to-pink-900/30 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-500 to-pink-500 items-center justify-center text-3xl shadow-2xl shadow-ink-900/50 mb-4 animate-pop">
            ⚡
          </div>
          <h1 className="text-2xl font-extrabold text-white">Backend Mastery</h1>
          <p className="text-slate-400 text-sm mt-1">Your private learning dashboard</p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <div className="inline-flex w-12 h-12 rounded-full bg-gradient-to-br from-ink-500/20 to-pink-500/20 items-center justify-center mb-3">
              <Fingerprint size={24} className="text-ink-300" />
            </div>
            <h2 className="font-bold text-white text-lg">Sign in with a passkey</h2>
            <p className="text-sm text-slate-400 mt-1">
              Use {detectDevice()}'s built-in authentication — Face ID, fingerprint, or Windows Hello.
            </p>
          </div>

          <form onSubmit={step === 'login' ? handleSignIn : handleSignUp} className="space-y-3">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="username"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-ink-500/60 focus:ring-1 focus:ring-ink-500/30"
                autoFocus
                maxLength={30}
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm flex items-start gap-2">
                <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {step === 'username' && (
              <>
                <button
                  type="button"
                  onClick={(e) => { setStep('register'); handleSignUp(e); }}
                  disabled={username.length < 3 || busy}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {busy ? <><Loader2 className="animate-spin" size={16} /> Creating passkey…</> : <><Fingerprint size={16} /> Create passkey & sign in</>}
                </button>
                <button
                  type="button"
                  onClick={(e) => { setStep('login'); handleSignIn(e); }}
                  disabled={username.length < 3 || busy}
                  className="btn-ghost w-full disabled:opacity-50"
                >
                  {busy && step !== 'username' ? <><Loader2 className="animate-spin" size={16} /> Verifying…</> : <>I already have a passkey</>}
                </button>
              </>
            )}

            {step !== 'username' && busy && (
              <div className="text-center text-sm text-ink-300 py-2">
                <Loader2 className="inline animate-spin mr-1" size={14} />
                {step === 'login' ? 'Verifying your identity…' : 'Creating your passkey…'}
              </div>
            )}
          </form>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Your passkey is stored only on your devices</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={12} className="text-yellow-400" />
              <span>Sign in with Face ID, fingerprint, or Windows Hello</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          🔒 No password. No code. No email. Just you.
        </p>
      </div>
    </div>
  );
}
