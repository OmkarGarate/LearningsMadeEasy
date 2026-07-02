import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, Bell, BarChart3, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/reminders', label: 'Reminders', icon: Bell },
  { to: '/badges', label: 'Badges', icon: Trophy },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
];

export default function Layout({ children }) {
  const { user, streak } = useSelector(s => ({ user: s.auth.user, streak: s.user.streak }));
  const reminders = useSelector(s => s.reminders.items);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const activeReminders = reminders.filter(r => !r.done).length;

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ink-500 to-pink-500 flex items-center justify-center text-lg shadow-lg shadow-ink-900/50 group-hover:scale-110 transition">
              ⚡
            </div>
            <div className="hidden sm:block">
              <div className="font-extrabold text-white text-lg leading-none">Backend Mastery</div>
              <div className="text-[10px] text-slate-400 leading-none mt-0.5">Interactive learning</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                    active ? 'bg-ink-500/20 text-ink-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {label === 'Reminders' && activeReminders > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {activeReminders}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
              <span className="text-base">🔥</span>
              <span className="font-bold text-white">{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <User size={12} />
              <span className="font-mono">{user?.username || ''}</span>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white" title="Sign out">
              <LogOut size={18} />
            </button>
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-slate-800/60" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-slate-800/80 px-4 py-2 space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active ? 'bg-ink-500/20 text-ink-300' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}>
                  <Icon size={18} /> {label}
                </Link>
              );
            })}
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full">
              <LogOut size={18} /> Sign out
            </button>
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">{children}</main>

      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Built for Omkar · Backend Mastery · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
