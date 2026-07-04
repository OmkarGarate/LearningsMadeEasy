import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CURRICULUM, DAILY_CHALLENGES, BADGES } from '../data/curriculum';
import ProgressBar from '../components/ProgressBar';
import { fireToast } from '../App';
import { Flame, Zap, Trophy, ArrowRight, Target, BookOpen, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function todayIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = (new Date() - start) + ((start.getTimezoneOffset() - new Date().getTimezoneOffset()) * 60 * 1000);
  return Math.floor(diff / 86400000);
}

export default function DashboardPage() {
  const completed = useSelector(s => s.progress.completed);
  const xp = useSelector(s => s.user.xp);
  const streak = useSelector(s => s.user.streak);
  const earnedBadges = useSelector(s => s.user.earnedBadges);
  const user = useSelector(s => s.auth.user);

  const dailyChallenge = DAILY_CHALLENGES[todayIndex() % DAILY_CHALLENGES.length];
  const totalCount = CURRICULUM.reduce((s, p) => s + p.concepts.length, 0);
  const completedCount = Object.keys(completed).length;
  const allConcepts = CURRICULUM.flatMap(p => p.concepts.map(c => ({ ...c, phaseId: p.id, phaseTitle: p.title })));
  const nextConcept = allConcepts.find(c => !completed[c.id]);
  const level = Math.floor(xp / 50) + 1;
  const xpInLevel = xp % 50;
  const badgeCount = earnedBadges.length;

  // Calculate completed phases for the "phase badges" showcase
  const phaseStatuses = CURRICULUM.map(phase => ({
    ...phase,
    done: phase.concepts.filter(c => completed[c.id]).length,
    isComplete: phase.concepts.every(c => completed[c.id]),
  }));

  const handleShare = () => {
    const url = window.location.origin;
    const text = `🚀 Learning Backend Engineering on Backend Mastery! ${completedCount}/${totalCount} concepts complete, level ${level}, ${streak}-day streak. Join me!`;
    if (navigator.share) {
      navigator.share({ title: 'Backend Mastery', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      fireToast({ type: 'success', message: 'Share link copied!' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl glass p-6 sm:p-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-ink-600/20 via-transparent to-pink-500/15 pointer-events-none" />
        <div className="relative">
          <p className="text-ink-300 text-sm font-semibold tracking-wider uppercase mb-2">Welcome back{user?.username ? `, ${user.username}` : ''} 👋</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            Master <span className="gradient-text">Backend Engineering</span>
          </h1>
          <p className="mt-3 text-slate-300 max-w-2xl">
            {completedCount} of {totalCount} concepts complete · Level {level} · {streak} day streak
          </p>
          <div className="mt-6 max-w-md">
            <ProgressBar value={completedCount} max={totalCount} size="lg" showLabel={false} />
            <p className="text-xs text-slate-400 mt-2">
              {Math.round((completedCount / totalCount) * 100)}% of the journey done
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {nextConcept ? (
              <Link to={`/learn/${nextConcept.phaseId}#${nextConcept.id}`} className="btn-primary">
                Continue learning <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/badges" className="btn-primary">
                You've completed everything! <Trophy size={16} />
              </Link>
            )}
            <Link to="/learn" className="btn-ghost">Browse all phases</Link>
            <button onClick={handleShare} className="btn-ghost">
              <Share2 size={16} /> Share progress
            </button>
          </div>
        </div>
      </motion.section>

      {/* Stats grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Flame}  label="Streak"    value={streak}                 suffix="days" color="from-orange-500 to-red-500" />
        <StatCard icon={Zap}    label="Total XP"  value={xp}                     suffix="pts"  color="from-yellow-500 to-amber-500" />
        <StatCard icon={Trophy} label="Badges"    value={badgeCount}             suffix={`/ ${BADGES.length}`} color="from-purple-500 to-pink-500" />
        <StatCard icon={Target} label="Concepts"  value={`${completedCount}/${totalCount}`}            color="from-emerald-500 to-teal-500" />
      </section>

      {/* Phase badges showcase */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-400" /> Phase Progress
          </h2>
          <span className="text-xs text-slate-500">{phaseStatuses.filter(p => p.isComplete).length} / {phaseStatuses.length} complete</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 sm:gap-3">
          {phaseStatuses.map(phase => (
            <Link
              key={phase.id}
              to={`/learn/${phase.id}`}
              className={`card glass-hover text-center p-3 relative overflow-hidden ${
                phase.isComplete ? 'ring-2 ring-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-teal-500/10' : ''
              }`}
            >
              {phase.isComplete && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                </div>
              )}
              <div className="text-2xl mb-1">{phase.icon}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Phase {phase.num}</div>
              <div className="text-xs font-bold text-white leading-tight">{phase.title.split(' ').slice(0, 2).join(' ')}</div>
              <div className="mt-2">
                <ProgressBar value={phase.done} max={phase.concepts.length} color={phase.color} showLabel={false} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* XP progress */}
      <section className="card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Level Progress</div>
            <div className="text-2xl font-extrabold text-white">Level {level} <span className="text-slate-500">→</span> {level + 1}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">XP</div>
            <div className="text-lg font-bold text-ink-300">{xpInLevel} / 50</div>
          </div>
        </div>
        <ProgressBar value={xpInLevel} max={50} color="from-yellow-500 to-orange-500" showLabel={false} />
      </section>

      {/* Daily challenge */}
      <section className="card bg-gradient-to-br from-ink-500/10 to-pink-500/10 border-ink-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ink-500 to-pink-500 flex items-center justify-center text-2xl shrink-0">🎯</div>
          <div>
            <div className="text-xs text-ink-300 uppercase tracking-wider font-semibold">Today's Challenge</div>
            <h3 className="text-lg font-bold text-white mt-1">{dailyChallenge}</h3>
            <p className="text-sm text-slate-300 mt-1">Small consistent steps beat occasional sprints. Show up today.</p>
          </div>
        </div>
      </section>

      {/* Phases detail */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen size={20} /> All Phases
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM.map(phase => {
            const done = phase.concepts.filter(c => completed[c.id]).length;
            return (
              <Link key={phase.id} to={`/learn/${phase.id}`} className="card glass-hover group relative">
                {phase.isComplete && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      <CheckCircle2 size={10} /> DONE
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{phase.icon}</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${phase.color} text-white`}>
                    {done}/{phase.concepts.length}
                  </div>
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Phase {phase.num} · {phase.weeks}</div>
                <h3 className="font-bold text-white group-hover:text-ink-300 transition">{phase.title}</h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{phase.description}</p>
                <div className="mt-3">
                  <ProgressBar value={done} max={phase.concepts.length} showLabel={false} color={phase.color} size="sm" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, suffix, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="card">
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-extrabold text-white mt-1">
        {value}
        {suffix && <span className="text-sm text-slate-400 font-medium ml-1">{suffix}</span>}
      </div>
    </motion.div>
  );
}
