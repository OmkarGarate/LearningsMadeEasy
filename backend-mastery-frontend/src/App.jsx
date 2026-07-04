import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { store } from './store';
import { fetchMe, selectAuthStatus } from './store/slices/authSlice';
import { setProgress } from './store/slices/progressSlice';
import { setUserData } from './store/slices/userSlice';
import Layout from './components/Layout';
import CodeAuth from './components/CodeAuth';
import Toast from './components/Toast';
import Confetti from './components/Confetti';
import DashboardPage from './pages/DashboardPage';
import { LearnIndexPage, PhasePage } from './pages/LearnPage';
import BadgesPage from './pages/BadgesPage';
import StatsPage from './pages/StatsPage';
import SearchPage from './pages/SearchPage';

// Global toast + confetti
let toastSetter = null;
let confettiSetter = null;
export const fireToast = (t) => toastSetter?.(t);
export const fireConfetti = () => confettiSetter?.((c) => c + 1);

function GlobalUI() {
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(0);
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
        <Route path="/search" element={<SearchPage />} />
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
      dispatch(setProgress({
        completed: user.progress,
        notes: user.notes,
        mcqAnswers: user.mcqAnswers,
        solvedProblems: user.solvedProblems,
      }));
      dispatch(setUserData({
        streak: user.streak,
        xp: user.xp,
        earnedBadges: user.earnedBadges,
        preferences: user.preferences,
        chatMessages: user.chatMessages,
      }));
    }
  }, [user, dispatch]);

  if (authStatus === 'authenticated' && !user) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>;
  }

  return (
    <CodeAuth>
      <AppShell />
    </CodeAuth>
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
