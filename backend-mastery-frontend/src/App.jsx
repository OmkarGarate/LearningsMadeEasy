import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { store } from './store';
import { fetchMe, selectAuthStatus } from './store/slices/authSlice';
import { setProgress } from './store/slices/progressSlice';
import { setReminders } from './store/slices/remindersSlice';
import { setUserData } from './store/slices/userSlice';
import Layout from './components/Layout';
import PhoneAuth from './components/EmailAuth';
import Toast from './components/Toast';
import Confetti from './components/Confetti';
import DashboardPage from './pages/DashboardPage';
import { LearnIndexPage, PhasePage } from './pages/LearnPage';
import RemindersPage from './pages/RemindersPage';
import BadgesPage from './pages/BadgesPage';
import StatsPage from './pages/StatsPage';

// Global toast + confetti (simple pub/sub)
let toastSetter = null;
let confettiSetter = null;
export const fireToast = (t) => toastSetter?.(t);
export const fireConfetti = () => confettiSetter?.((c) => c + 1);

function GlobalUI() {
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(0);
  const ref = useRef({ setToast, setConfetti });
  ref.current = { setToast, setConfetti };

  useEffect(() => {
    toastSetter = setToast;
    confettiSetter = setConfetti;
    return () => { toastSetter = null; confettiSetter = null; };
  }, []);

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Confetti trigger={confetti} />
    </>
  );
}

function AppShell() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/learn" element={<LearnIndexPage />} />
        <Route path="/learn/:phaseId" element={<PhasePage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    if (localStorage.getItem('bm:access')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(setProgress({ completed: user.progress, notes: user.notes }));
      dispatch(setReminders(user.reminders || []));
      dispatch(setUserData({
        streak: user.streak,
        xp: user.xp,
        earnedBadges: user.earnedBadges,
        preferences: user.preferences,
      }));
    }
  }, [user, dispatch]);

  if (authStatus === 'authenticated' && !user) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading your data…</div>;
  }

  return (
    <PhoneAuth>
      <AppShell />
    </PhoneAuth>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <AppContent />
        <GlobalUI />
      </HashRouter>
    </Provider>
  );
}
