import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleConcept, saveNote } from '../store/slices/progressSlice';
import { fireToast, fireConfetti } from '../App';
import { CURRICULUM, BADGES } from '../data/curriculum';
import ProgressBar from '../components/ProgressBar';
import { DIAGRAMS } from '../components/Diagrams';
import { Check, Circle, ArrowLeft, Lightbulb, Target, MessageSquare, Save, ChevronRight, Loader2 } from 'lucide-react';

export function LearnIndexPage() {
  const completed = useSelector(s => s.progress.completed);
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold text-white">All Phases</h1>
        <p className="text-slate-400 mt-1">Pick a phase to start. Each concept is bite-sized and checkable.</p>
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

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate('/learn')} className="btn-ghost text-sm"><ArrowLeft size={16} /> All phases</button>
      <header className={`rounded-3xl p-6 sm:p-8 glass relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${phase.color}`} />
        <div className="absolute -right-10 -top-10 text-9xl opacity-10 select-none">{phase.icon}</div>
        <div className="relative">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Phase {phase.num} · {phase.weeks}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">{phase.title}</h1>
          <p className="text-slate-300 mt-2 max-w-2xl">{phase.description}</p>
          <div className="mt-5 max-w-md">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-white">{done} / {phase.concepts.length}</span>
            </div>
            <ProgressBar value={done} max={phase.concepts.length} color={phase.color} showLabel={false} />
          </div>
        </div>
      </header>

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
  // After toggle, check for new badges
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
  const stats = { completedCount, totalCount, phaseComplete, streak: state.user.streak, notes: state.progress.notes };
  const earned = state.user.earnedBadges || [];
  const newly = BADGES.filter(b => b.check(stats) && !earned.includes(b.id));
  if (newly.length > 0) {
    const b = newly[0];
    fireToast({ type: 'badge', message: `${b.name} — ${b.desc}`, badge: b });
    fireConfetti();
    dispatch({ type: 'user/syncBadges/pending' });
    // We import the thunk to call it
    import('../store/slices/userSlice').then(({ syncBadges }) => {
      dispatch(syncBadges([...earned, b.id]));
    });
  }
}

// We need store reference for checkBadges
import { store } from '../store';

function ConceptRow({ concept, index, isComplete, onToggle, phaseColor }) {
  const dispatch = useDispatch();
  const noteText = useSelector(s => s.progress.notes[concept.id] || '');
  const saving = useSelector(s => s.progress.saving);
  const [expanded, setExpanded] = useState(false);
  const [localNote, setLocalNote] = useState(noteText);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLocalNote(noteText); }, [noteText]);

  const saveNote = () => {
    if (localNote === noteText) return;
    dispatch(saveNote({ conceptId: concept.id, text: localNote }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div id={concept.id} className={`card glass-hover transition-all ${isComplete ? 'ring-1 ring-emerald-500/40' : ''}`}>
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
            <div>
              <div className="text-xs text-slate-500 font-mono">#{index + 1}</div>
              <h3 className={`font-bold text-lg ${isComplete ? 'text-emerald-300' : 'text-white'}`}>{concept.title}</h3>
              <p className="text-sm text-slate-300 mt-1">{concept.summary}</p>
            </div>
            <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-white p-1 shrink-0">
              <ChevronRight size={20} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {expanded && (
            <div className="mt-4 space-y-4 animate-fade-in">
              {DIAGRAMS[concept.id] && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                  {(() => { const D = DIAGRAMS[concept.id]; return <D />; })()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-xs text-ink-300 font-semibold uppercase tracking-wider mb-2"><Target size={14} /> Key points</div>
                <ul className="space-y-1.5">
                  {concept.keyPoints.map((point, i) => (
                    <li key={i} className="text-sm text-slate-200 flex items-start gap-2">
                      <span className="text-ink-400 mt-1 shrink-0">▸</span><span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {concept.analogy && (
                <div className="bg-ink-500/10 border border-ink-500/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-xs text-ink-300 font-semibold uppercase tracking-wider mb-1"><Lightbulb size={14} /> Analogy</div>
                  <p className="text-sm text-slate-200 italic">{concept.analogy}</p>
                </div>
              )}

              {concept.interviewAngle && (
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-3">
                  <div className="text-xs text-pink-300 font-semibold uppercase tracking-wider mb-1">🎯 Interview angle</div>
                  <p className="text-sm text-slate-200">{concept.interviewAngle}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  <MessageSquare size={14} /> Your notes
                  {saving && <Loader2 size={12} className="animate-spin" />}
                </div>
                <textarea
                  value={localNote}
                  onChange={e => setLocalNote(e.target.value)}
                  onBlur={saveNote}
                  placeholder="Write what you learned, questions you have, examples..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ink-500/60 focus:ring-1 focus:ring-ink-500/30 resize-y min-h-[80px]"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">Auto-saves to your account</span>
                  <button onClick={saveNote} className="text-xs text-ink-300 hover:text-ink-200 flex items-center gap-1">
                    <Save size={12} /> {saved ? 'Saved!' : 'Save now'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
