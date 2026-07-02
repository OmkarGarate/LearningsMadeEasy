import { useSelector } from 'react-redux';
import { BADGES, CURRICULUM } from '../data/curriculum';
import { Lock, Sparkles } from 'lucide-react';

export default function BadgesPage() {
  const earnedBadges = useSelector(s => s.user.earnedBadges);
  const completed = useSelector(s => s.progress.completed);
  const streak = useSelector(s => s.user.streak);
  const notes = useSelector(s => s.progress.notes);

  // Re-evaluate which badges are earned (server is source of truth, but show optimistic)
  const totalCount = CURRICULUM.reduce((s, p) => s + p.concepts.length, 0);
  const completedCount = Object.keys(completed).length;
  const phaseComplete = {};
  CURRICULUM.forEach(p => {
    phaseComplete[p.id] = p.concepts.every(c => completed[c.id]);
  });
  const stats = { completedCount, totalCount, phaseComplete, streak, notes };
  const allEarned = BADGES.filter(b => b.check(stats)).map(b => b.id);
  const finalEarned = Array.from(new Set([...earnedBadges, ...allEarned]));

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3"><Sparkles className="text-yellow-400" /> Badges</h1>
        <p className="text-slate-400 mt-1">{finalEarned.length} of {BADGES.length} unlocked. Keep going!</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {BADGES.map(badge => {
          const earned = finalEarned.includes(badge.id);
          return (
            <div key={badge.id} className={`card text-center transition-all ${
              earned ? 'bg-gradient-to-br from-yellow-500/15 to-orange-500/10 border-yellow-500/30 ring-1 ring-yellow-500/20' : 'opacity-50 grayscale'
            }`}>
              <div className={`text-5xl sm:text-6xl mb-2 ${earned ? 'animate-pop' : 'blur-[2px]'}`}>
                {earned ? badge.icon : <Lock className="inline text-slate-600" size={48} />}
              </div>
              <h3 className={`font-bold ${earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h3>
              <p className={`text-xs mt-1 ${earned ? 'text-slate-300' : 'text-slate-600'}`}>{badge.desc}</p>
              {earned && <div className="mt-2 text-[10px] uppercase tracking-wider text-yellow-400 font-bold">Unlocked</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
