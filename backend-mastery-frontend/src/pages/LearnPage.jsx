import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleConcept } from '../store/slices/progressSlice';
import { fireToast, fireConfetti } from '../App';
import { CURRICULUM, BADGES } from '../data/curriculum';
import { PHASE_RESOURCES, CONCEPT_TECHS, TECH_LOGOS } from '../data/techLogos';
import ProgressBar from '../components/ProgressBar';
import { DIAGRAMS } from '../components/Diagrams';
import {
  Check, Circle, ArrowLeft, Lightbulb, Target, Brain, CheckCircle2, XCircle,
  Code2, GitCompare, Sparkles, Globe, Share2, ExternalLink, ChevronLeft, ChevronRight, RotateCcw
} from 'lucide-react';

export function LearnIndexPage() {
  const completed = useSelector(s => s.progress.completed);
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold text-white">All Phases</h1>
        <p className="text-slate-400 mt-1">Pick a phase. Each concept has theory, examples, 3 MCQs, problems, and AI tutor.</p>
      </div>
      {CURRICULUM.map(phase => {
        const done = phase.concepts.filter(c => completed[c.id]).length;
        return (
          <Link key={phase.id} to={`/learn/${phase.id}`} className="block card glass-hover relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${phase.color}`} />
            <div className="flex flex-wrap items-start justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{phase.icon}</div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Phase {phase.num} · {phase.weeks}</div>
                  <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{phase.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-white">{done}<span className="text-slate-500 text-base">/{phase.concepts.length}</span></div>
                <div className="text-xs text-slate-500">concepts</div>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar value={done} max={phase.concepts.length} color={phase.color} showLabel={false} size="sm" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function PhasePage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const completed = useSelector(s => s.progress.completed);
  const phase = CURRICULUM.find(p => p.id === phaseId);
  const resources = PHASE_RESOURCES[phaseId];

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [location.hash]);

  if (!phase) {
    return <div className="text-center py-20"><p className="text-slate-400">Phase not found.</p><Link to="/learn" className="btn-ghost mt-4 inline-flex">Back to phases</Link></div>;
  }

  const done = phase.concepts.filter(c => completed[c.id]).length;
  const allDone = done === phase.concepts.length;

  const handleShare = () => {
    const url = window.location.href;
    const text = `I'm learning ${phase.title} on Backend Mastery! ${done}/${phase.concepts.length} complete.`;
    if (navigator.share) {
      navigator.share({ title: phase.title, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      fireToast({ type: 'success', message: 'Link copied!' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate('/learn')} className="btn-ghost text-sm"><ArrowLeft size={16} /> All phases</button>
      <header className={`rounded-3xl p-6 sm:p-8 glass relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${phase.color}`} />
        <div className="absolute -right-10 -top-10 text-9xl opacity-10 select-none">{phase.icon}</div>
        <div className="relative">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Phase {phase.num} · {phase.weeks}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 flex items-center gap-3 flex-wrap">
            {phase.title}
            {allDone && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold"
              >
                <Sparkles size={12} /> Phase Complete
              </motion.span>
            )}
          </h1>
          <p className="text-slate-300 mt-2 max-w-2xl">{phase.description}</p>
          <div className="mt-5 max-w-md">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-white">{done} / {phase.concepts.length}</span>
            </div>
            <ProgressBar value={done} max={phase.concepts.length} color={phase.color} showLabel={false} />
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <button onClick={handleShare} className="btn-ghost text-sm"><Share2 size={14} /> Share</button>
          </div>
        </div>
      </header>

      {/* Phase resources */}
      {resources && resources.resources.length > 0 && (
        <div className="card border-ink-500/30">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink size={16} className="text-ink-300" />
            <h2 className="font-bold text-white">Official Resources for {resources.title}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {resources.resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-ink-500/40 transition group"
              >
                <span className="text-slate-200 group-hover:text-ink-300 text-sm flex-1 truncate">{r.name}</span>
                <ExternalLink size={12} className="text-slate-500 group-hover:text-ink-300" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {phase.concepts.map((concept, idx) => (
          <ConceptRow
            key={concept.id}
            concept={concept}
            index={idx}
            isComplete={!!completed[concept.id]}
            onToggle={() => handleToggle(dispatch, concept.id)}
            phaseColor={phase.color}
          />
        ))}
      </div>
    </div>
  );
}

async function handleToggle(dispatch, conceptId) {
  await dispatch(toggleConcept(conceptId)).unwrap();
  setTimeout(() => checkBadges(dispatch), 100);
}

function checkBadges(dispatch) {
  const state = store.getState();
  const completed = state.progress.completed;
  const totalCount = CURRICULUM.reduce((s, p) => s + p.concepts.length, 0);
  const completedCount = Object.keys(completed).length;
  const phaseComplete = {};
  CURRICULUM.forEach(p => {
    phaseComplete[p.id] = p.concepts.every(c => completed[c.id]);
  });
  const stats = {
    completedCount, totalCount, phaseComplete,
    streak: state.user.streak, notes: state.progress.notes,
    quizCorrect: state.progress.quizCorrect || 0,
    problemsSolved: state.progress.problemsSolved || 0,
  };
  const earned = state.user.earnedBadges || [];
  const newly = BADGES.filter(b => b.check(stats) && !earned.includes(b.id));
  if (newly.length > 0) {
    const b = newly[0];
    fireToast({ type: 'badge', message: `${b.name} — ${b.desc}`, badge: b });
    fireConfetti();
    import('../store/slices/userSlice').then(({ syncBadges }) => {
      dispatch(syncBadges([...earned, b.id]));
    });
  }
}

import { store } from '../store';

function ConceptRow({ concept, index, isComplete, onToggle, phaseColor }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const correctAnswers = useSelector(s => s.progress.mcqAnswers?.[concept.id] || {});
  const techs = CONCEPT_TECHS[concept.id] || [];

  return (
    <motion.div
      id={concept.id}
      initial={false}
      className={`card glass-hover transition-all ${isComplete ? 'ring-1 ring-emerald-500/40' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`shrink-0 mt-1 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            isComplete ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
          }`}
        >
          {isComplete ? <Check size={16} /> : <Circle size={16} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500 font-mono">#{index + 1}</div>
              <h3 className={`font-bold text-lg ${isComplete ? 'text-emerald-300' : 'text-white'}`}>
                {concept.title}
              </h3>
              <p className="text-sm text-slate-300 mt-1">{concept.summary}</p>
              {/* Tech logos */}
              {techs.length > 0 && (
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {techs.map(t => TECH_LOGOS[t]).filter(Boolean).map(t => (
                    <a
                      key={t.name}
                      href={t.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition group"
                      title={`${t.name} docs`}
                    >
                      <span className="w-3.5 h-3.5" style={{ color: t.color }} dangerouslySetInnerHTML={{ __html: t.logo }} />
                      <span className="text-xs text-slate-300 group-hover:text-white font-medium">{t.name}</span>
                      <ExternalLink size={10} className="text-slate-500" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <motion.button
              onClick={() => setExpanded(!expanded)}
              animate={{ rotate: expanded ? 90 : 0 }}
              className="text-slate-400 hover:text-white p-1 shrink-0"
            >
              <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
            </motion.button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  {(() => {
                    const D = DIAGRAMS[concept.id];
                    if (D) {
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-slate-950/60 border border-slate-800 rounded-xl p-3"
                        >
                          <D />
                        </motion.div>
                      );
                    }
                    // Defensive: if a concept has a diagram id but no SVG component
                    // defined, show a placeholder so it's obvious something is missing
                    // rather than silently rendering nothing.
                    if (concept.id?.startsWith('p') || concept.id?.includes('tcp')) {
                      return (
                        <div className="bg-slate-950/40 border border-dashed border-slate-700 rounded-xl p-3 text-center text-xs text-slate-500">
                          Diagram coming soon for: <code>{concept.id}</code>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <SectionBlock icon={Target} title="Key Points" delay={0.15}>
                    <ul className="space-y-1.5">
                      {concept.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm text-slate-200 flex items-start gap-2">
                          <span className="text-ink-400 mt-1 shrink-0">▸</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </SectionBlock>

                  {concept.analogy && (
                    <CalloutBlock icon={Lightbulb} color="ink" title="Analogy" delay={0.2}>
                      {concept.analogy}
                    </CalloutBlock>
                  )}

                  {concept.realWorldExample && (
                    <CalloutBlock icon={Globe} color="emerald" title="Real-World Example" delay={0.25}>
                      {concept.realWorldExample}
                    </CalloutBlock>
                  )}

                  {concept.interviewAngle && (
                    <CalloutBlock icon={Sparkles} color="pink" title="Interview Angle" delay={0.3}>
                      {concept.interviewAngle}
                    </CalloutBlock>
                  )}

                  {concept.compare && (
                    <SectionBlock icon={GitCompare} title={concept.compare.title} delay={0.35}>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <CompareCard data={concept.compare.left} color="from-blue-500/10 to-cyan-500/10 border-blue-500/30" />
                        <CompareCard data={concept.compare.right} color="from-purple-500/10 to-pink-500/10 border-purple-500/30" />
                      </div>
                    </SectionBlock>
                  )}

                  {concept.mcqs && concept.mcqs.length > 0 && (
                    <SectionBlock icon={Brain} title={`Quick Quiz · ${Object.keys(correctAnswers).filter(k => correctAnswers[k]?.correct).length}/${concept.mcqs.length} solved`} delay={0.4}>
                      <PaginatedMCQ
                        conceptId={concept.id}
                        mcqs={concept.mcqs}
                        savedAnswers={correctAnswers}
                      />
                    </SectionBlock>
                  )}

                  {concept.problem && (
                    <SectionBlock icon={Code2} title={`Practice: ${concept.problem.title}`} delay={0.45}>
                      <Problem conceptId={concept.id} problem={concept.problem} />
                    </SectionBlock>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function SectionBlock({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2 text-xs text-ink-300 font-semibold uppercase tracking-wider mb-2">
        <Icon size={14} /> {title}
      </div>
      {children}
    </motion.div>
  );
}

function CalloutBlock({ icon: Icon, color, title, children, delay = 0 }) {
  const colors = {
    ink: 'bg-ink-500/10 border-ink-500/30 text-ink-200',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
    pink: 'bg-pink-500/10 border-pink-500/30 text-pink-200',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`border rounded-xl p-3 ${colors[color]}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
        <Icon size={14} /> {title}
      </div>
      <p className="text-sm leading-relaxed">{children}</p>
    </motion.div>
  );
}

function CompareCard({ data, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} border rounded-xl p-4`}>
      <h5 className="font-bold text-white mb-2">{data.name}</h5>
      <ul className="space-y-1.5">
        {data.items.map((item, i) => (
          <li key={i} className="text-sm text-slate-200 flex items-start gap-2">
            <span className="text-slate-500 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Paginated MCQ — one question at a time ─────────────────────
function PaginatedMCQ({ conceptId, mcqs, savedAnswers }) {
  const dispatch = useDispatch();
  const [idx, setIdx] = useState(0);
  const mcq = mcqs[idx];
  const saved = savedAnswers[mcq.id];
  const [selected, setSelected] = useState(saved != null ? (saved.correct ? mcq.correct : saved.selected) : null);
  const [submitted, setSubmitted] = useState(saved != null);

  useEffect(() => {
    const s = savedAnswers[mcq.id];
    setSelected(s != null ? (s.correct ? mcq.correct : s.selected) : null);
    setSubmitted(s != null);
  }, [idx, mcq.id, savedAnswers]);

  const submit = async () => {
    if (!selected) return;
    setSubmitted(true);
    const isCorrect = selected === mcq.correct;
    try {
      await import('../api/client').then(({ api }) =>
        api.recordMcqAnswer({ conceptId, mcqId: mcq.id, selected, correct: isCorrect })
      );
      dispatch({ type: 'progress/recordMcqAnswer', payload: { conceptId, mcqId: mcq.id, selected, correct: isCorrect } });
      if (isCorrect) {
        dispatch({ type: 'user/setUserData', payload: { xp: (window.__lastXp || 0) + 5 } });
      }
    } catch {}
    if (isCorrect) {
      fireToast({ type: 'success', message: '✅ Correct! +5 XP' });
    } else {
      fireToast({ type: 'error', message: 'Not quite — see the explanation' });
    }
  };

  const next = () => setIdx(Math.min(idx + 1, mcqs.length - 1));
  const prev = () => setIdx(Math.max(idx - 1, 0));
  const reset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  // Use the locally-computed "is this submission correct" for the current question's
  // feedback. Reading from Redux (`saved?.correct`) is racy — the dispatch is async,
  // so right after submit() the saved value is still the OLD one, and the UI shows
  // the wrong verdict (e.g. "Not quite" when the user just answered correctly).
  // We compute it from `selected` and the current `mcq.correct` to get instant feedback.
  const lastAnswerCorrect = submitted && selected != null && selected === mcq.correct;
  // Has the user ever gotten this one right (from Redux)?
  const everCorrect = !!saved?.[mcq.id]?.correct;
  // The "Try again" button only makes sense if the current attempt was wrong AND
  // they haven't yet nailed it for this question.
  const showTryAgain = submitted && !lastAnswerCorrect && !everCorrect;

  const correctCount = mcqs.filter(m => savedAnswers[m.id]?.correct).length;

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Question {idx + 1} of {mcqs.length}</span>
            <span className="text-emerald-400 font-semibold">{correctCount} ✓ solved</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ink-500 to-pink-500 transition-all duration-300"
              style={{ width: `${((idx + 1) / mcqs.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-1">
          {mcqs.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setIdx(i)}
              className={`w-7 h-7 rounded text-xs font-bold transition ${
                i === idx
                  ? 'bg-ink-500 text-white'
                  : savedAnswers[m.id]?.correct
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : savedAnswers[m.id]
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <p className="font-semibold text-white">{mcq.question}</p>

      <div className="space-y-2">
        {mcq.options.map(opt => {
          const isCorrect = opt.id === mcq.correct;
          const isSelected = selected === opt.id;
          let bg = 'bg-slate-900/60 border-slate-700 hover:border-slate-600';
          if (submitted) {
            if (isCorrect) bg = 'bg-emerald-500/20 border-emerald-500/50';
            else if (isSelected && !isCorrect) bg = 'bg-red-500/20 border-red-500/50';
            else bg = 'bg-slate-900/40 border-slate-800 opacity-60';
          } else if (isSelected) {
            bg = 'bg-ink-500/20 border-ink-500/50';
          }
          return (
            <button
              key={opt.id}
              onClick={() => !submitted && setSelected(opt.id)}
              disabled={submitted}
              className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all ${bg} ${!submitted && 'cursor-pointer'}`}
            >
              <span className="text-sm text-slate-200">{opt.text}</span>
              {submitted && isCorrect && <CheckCircle2 className="inline ml-2 text-emerald-400" size={16} />}
              {submitted && isSelected && !isCorrect && <XCircle className="inline ml-2 text-red-400" size={16} />}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        {!submitted ? (
          <button onClick={submit} disabled={!selected} className="btn-primary flex-1 disabled:opacity-50">
            Submit answer
          </button>
        ) : (
          <>
            {showTryAgain && (
              <button onClick={reset} className="btn-ghost text-sm flex items-center gap-1">
                <RotateCcw size={12} /> Try again
              </button>
            )}
            <button onClick={prev} disabled={idx === 0} className="btn-ghost text-sm flex items-center gap-1 disabled:opacity-30">
              <ChevronLeft size={14} /> Prev
            </button>
            <button onClick={next} disabled={idx === mcqs.length - 1} className="btn-primary text-sm flex items-center gap-1 disabled:opacity-30">
              Next <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-sm ${
            lastAnswerCorrect
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200'
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-200'
          }`}
        >
          <strong className="block mb-1">
            {lastAnswerCorrect ? '✅ Correct!' : '❌ Not quite'}
          </strong>
          {mcq.explanation}
        </motion.div>
      )}
    </div>
  );
}

function Problem({ conceptId, problem }) {
  const dispatch = useDispatch();
  const solvedProblems = useSelector(s => s.progress.solvedProblems || []);
  const [showSolution, setShowSolution] = useState(false);
  const isSolved = solvedProblems.includes(`${conceptId}::${problem.title}`);

  const diffColors = {
    Easy: 'bg-emerald-500/20 text-emerald-300',
    Medium: 'bg-amber-500/20 text-amber-300',
    Hard: 'bg-red-500/20 text-red-300',
  };

  const handleSolve = async () => {
    try {
      await import('../api/client').then(({ api }) =>
        api.markProblemSolved(conceptId, problem.title)
      );
      dispatch({ type: 'progress/recordProblemSolved', payload: { conceptId, problemTitle: problem.title } });
      fireToast({ type: 'success', message: '🎉 +20 XP for solving!' });
    } catch {}
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${diffColors[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        {isSolved && <span className="text-xs text-emerald-400 font-semibold">✓ solved · +20 XP earned</span>}
      </div>
      <p className="text-sm text-slate-200 whitespace-pre-line">{problem.prompt}</p>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setShowSolution(!showSolution)} className="btn-ghost text-sm flex-1 sm:flex-none">
          {showSolution ? '🙈 Hide solution' : '💡 Show solution'}
        </button>
        {!isSolved && (
          <button onClick={handleSolve} className="btn-primary text-sm flex-1 sm:flex-none">
            <Check size={14} /> Mark as solved (+20 XP)
          </button>
        )}
      </div>
      <AnimatePresence>
        {showSolution && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 overflow-x-auto font-mono whitespace-pre-wrap"
          >
            {problem.solution}
          </motion.pre>
        )}
      </AnimatePresence>
    </div>
  );
}
