import { useSelector } from 'react-redux';
import { CURRICULUM } from '../data/curriculum';
import ProgressBar from '../components/ProgressBar';
import { useRef } from 'react';
import { Activity, Calendar, Zap } from 'lucide-react';

export default function StatsPage() {
  const completed = useSelector(s => s.progress.completed);
  const xp = useSelector(s => s.user.xp);
  const streak = useSelector(s => s.user.streak);
  const user = useSelector(s => s.auth.user);

  const totalCount = CURRICULUM.reduce((s, p) => s + p.concepts.length, 0);
  const completedCount = Object.keys(completed).length;
  const level = Math.floor(xp / 50) + 1;
  const xpInLevel = xp % 50;

  // 30-day activity
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    const activity = Object.values(completed).filter(ts => new Date(ts).toISOString().slice(0, 10) === key).length;
    return { date: key, activity, label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) };
  });
  const maxActivity = Math.max(1, ...days.map(d => d.activity));

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3"><Activity className="text-emerald-400" /> Your Stats</h1>
        <p className="text-slate-400 mt-1">Synced to your account. Access from any device.</p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="card text-center">
          <Zap className="mx-auto text-yellow-400 mb-2" size={28} />
          <div className="text-3xl font-extrabold text-white">{xp}</div>
          <div className="text-xs text-slate-400 mt-1">Total XP</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-white">L{level}</div>
          <div className="text-xs text-slate-400 mt-1">Current level</div>
          <div className="text-xs text-slate-500 mt-1">{xpInLevel} / 50 XP to L{level + 1}</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-white">{streak}</div>
          <div className="text-xs text-slate-400 mt-1">Day streak</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-white">{Math.round((completedCount / totalCount) * 100)}%</div>
          <div className="text-xs text-slate-400 mt-1">Overall progress</div>
          <div className="text-xs text-slate-500 mt-1">{completedCount} / {totalCount} concepts</div>
        </div>
      </section>

      <section className="card">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Calendar size={18} /> Last 30 days</h3>
        <div className="flex items-end gap-1 h-32">
          {days.map((d, i) => {
            const intensity = d.activity / maxActivity;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full h-full flex items-end">
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${Math.max(4, intensity * 100)}%`,
                      background: d.activity > 0 ? `rgba(109, 40, 217, ${0.3 + intensity * 0.7})` : 'rgba(51, 65, 85, 0.5)',
                    }}
                  />
                  {d.activity > 0 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                      {d.activity} concept{d.activity === 1 ? '' : 's'}
                    </div>
                  )}
                </div>
                {i % 5 === 0 && <div className="text-[9px] text-slate-500">{d.label}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h3 className="font-bold text-white mb-3">By phase</h3>
        <div className="space-y-3">
          {CURRICULUM.map(phase => {
            const done = phase.concepts.filter(c => completed[c.id]).length;
            return (
              <div key={phase.id} className="flex items-center gap-3">
                <div className="text-2xl shrink-0">{phase.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-200 truncate">{phase.title}</span>
                    <span className="text-slate-400 ml-2 shrink-0">{done}/{phase.concepts.length}</span>
                  </div>
                  <ProgressBar value={done} max={phase.concepts.length} color={phase.color} showLabel={false} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {user && (
        <section className="card">
          <h3 className="font-bold text-white mb-2">Account</h3>
          <p className="text-sm text-slate-400">Signed in as <span className="text-white font-mono">{user.username}</span></p>
          <p className="text-xs text-slate-500 mt-1">Last login {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'today'}</p>
          {user.credentials?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-2">Signed-in devices:</p>
              <div className="space-y-1">
                {user.credentials.map(c => (
                  <div key={c.id} className="text-xs text-slate-300 flex items-center gap-2">
                    <span>📱</span> {c.deviceName}
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">added {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
