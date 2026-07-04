import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BLOGS, BLOG_IDS } from '../data/blogs';
import { CURRICULUM } from '../data/curriculum';
import { ArrowLeft, BookOpen, Clock, Search, Sparkles } from 'lucide-react';

export function BlogIndexPage() {
  const [query, setQuery] = useState('');
  const completed = useSelector(s => s.progress.completed);

  const allBlogs = useMemo(() => {
    const items = [];
    BLOG_IDS.forEach(id => {
      const blog = BLOGS[id];
      const concept = CURRICULUM.flatMap(p => p.concepts).find(c => c.id === id);
      const phase = CURRICULUM.find(p => p.concepts.some(c => c.id === id));
      if (concept && phase) {
        items.push({
          id,
          title: blog.title,
          subtitle: blog.subtitle,
          readTime: blog.readTime,
          phaseId: phase.id,
          phaseTitle: phase.title,
          phaseIcon: phase.icon,
          isComplete: !!completed[id],
        });
      }
    });
    return items;
  }, [completed]);

  const filtered = allBlogs.filter(b =>
    !query || b.title.toLowerCase().includes(query.toLowerCase()) || b.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <BookOpen className="text-pink-400" /> Deep-Dive Blog
        </h1>
        <p className="text-slate-400 mt-1">Long-form articles that go deeper than the MCQs and key points.</p>
      </header>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-ink-500/60"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(blog => (
          <Link
            key={blog.id}
            to={`/blog/${blog.id}`}
            className="card glass-hover group"
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="text-3xl">{blog.phaseIcon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 uppercase tracking-wider">{blog.phaseTitle}</div>
                <h3 className="font-bold text-white group-hover:text-ink-300 transition leading-tight">{blog.title}</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2">{blog.subtitle}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
              {blog.isComplete && <span className="text-emerald-400">✓ Read concept</span>}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-slate-500 py-12">No articles match "{query}".</div>
      )}
    </div>
  );
}

export function BlogPostPage() {
  const { blogId } = useParams();
  const blog = BLOGS[blogId];
  const concept = CURRICULUM.flatMap(p => p.concepts).find(c => c.id === blogId);
  const phase = CURRICULUM.find(p => p.concepts.some(c => c.id === blogId));

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Article not found.</p>
        <Link to="/blog" className="btn-ghost mt-4 inline-flex">← All articles</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link to="/blog" className="btn-ghost text-sm inline-flex"><ArrowLeft size={14} /> All articles</Link>

      <article className="card !p-8">
        <div className="text-sm text-slate-400 mb-3 flex items-center gap-2">
          <span className="text-2xl">{phase?.icon}</span>
          <Link to={`/learn/${phase?.id}`} className="text-ink-300 hover:text-ink-200">
            {phase?.title}
          </Link>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{blog.title}</h1>
        <p className="text-lg text-slate-300 mt-3 italic">{blog.subtitle}</p>

        <div className="mt-8 space-y-8">
          {blog.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-2xl font-bold text-white mb-3">{s.heading}</h2>
              <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed whitespace-pre-line">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800">
          <Link to={`/learn/${phase?.id}#${blogId}`} className="btn-primary">
            <Sparkles size={16} /> Go to concept
          </Link>
        </div>
      </article>
    </div>
  );
}
