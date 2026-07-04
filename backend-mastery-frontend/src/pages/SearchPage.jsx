import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CURRICULUM } from '../data/curriculum';
import { Search, CheckCircle2, BookOpen, Brain, Code2, GitCompare, Globe } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const completed = useSelector(s => s.progress.completed);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const matches = [];
    CURRICULUM.forEach(phase => {
      phase.concepts.forEach(c => {
        const score = scoreMatch(c, q);
        if (score > 0) {
          matches.push({ concept: c, phase, score, isComplete: !!completed[c.id] });
        }
      });
    });
    return matches.sort((a, b) => b.score - a.score).slice(0, 30);
  }, [query, completed]);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Search className="text-ink-300" /> Search
        </h1>
        <p className="text-slate-400 mt-1">Find any concept, MCQ, analogy, or example across the entire curriculum.</p>
      </header>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Try: cache, JWT, indexing, OAuth, fan-out..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-ink-500/60 focus:ring-1 focus:ring-ink-500/30"
          autoFocus
        />
      </div>

      {!query && (
        <div className="card text-center py-8">
          <p className="text-slate-500 text-sm">Type at least 2 characters to search...</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-slate-500">No results for "{query}".</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <SearchResult key={i} {...r} query={query} />
          ))}
        </div>
      )}
    </div>
  );
}

function scoreMatch(concept, q) {
  let score = 0;
  if (concept.title.toLowerCase().includes(q)) score += 10;
  if (concept.summary.toLowerCase().includes(q)) score += 5;
  concept.keyPoints.forEach(p => { if (p.toLowerCase().includes(q)) score += 3; });
  if (concept.analogy && concept.analogy.toLowerCase().includes(q)) score += 2;
  if (concept.realWorldExample && concept.realWorldExample.toLowerCase().includes(q)) score += 2;
  if (concept.interviewAngle && concept.interviewAngle.toLowerCase().includes(q)) score += 2;
  if (concept.mcqs) {
    concept.mcqs.forEach(m => {
      if (m.question.toLowerCase().includes(q)) score += 2;
      if (m.explanation.toLowerCase().includes(q)) score += 1;
    });
  }
  return score;
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-500/30 text-yellow-200 px-0.5 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function SearchResult({ concept, phase, score, isComplete, query }) {
  return (
    <Link
      to={`/learn/${phase.id}#${concept.id}`}
      className="block card glass-hover"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">{phase.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Phase {phase.num} · {phase.title}</span>
            {isComplete && <CheckCircle2 size={12} className="text-emerald-400" />}
          </div>
          <h3 className="font-bold text-white">
            {highlightMatch(concept.title, query)}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {highlightMatch(concept.summary, query)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">score: {score}</span>
            {concept.mcqs && <span className="text-xs text-ink-300 flex items-center gap-1"><Brain size={10} /> {concept.mcqs.length} MCQs</span>}
            {concept.problem && <span className="text-xs text-emerald-300 flex items-center gap-1"><Code2 size={10} /> Problem</span>}
            {concept.compare && <span className="text-xs text-blue-300 flex items-center gap-1"><GitCompare size={10} /> Compare</span>}
            {concept.realWorldExample && <span className="text-xs text-purple-300 flex items-center gap-1"><Globe size={10} /> Example</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
