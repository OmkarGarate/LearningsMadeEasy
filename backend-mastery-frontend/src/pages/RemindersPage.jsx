import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReminder, toggleReminder, deleteReminder } from '../store/slices/remindersSlice';
import { setPreferences } from '../store/slices/userSlice';
import { Bell, Plus, Trash2, Check, Clock, BellRing } from 'lucide-react';

function toLocalInputValue(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function RemindersPage() {
  const dispatch = useDispatch();
  const reminders = useSelector(s => s.reminders.items);
  const preferences = useSelector(s => s.user.preferences);
  const [text, setText] = useState('');
  const [datetime, setDatetime] = useState(toLocalInputValue(Date.now() + 3600000));
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');

  const sorted = [...reminders].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  const upcoming = sorted.filter(r => !r.done);
  const past = sorted.filter(r => r.done);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim() || !datetime) return;
    dispatch(addReminder({ text: text.trim(), datetime: new Date(datetime).toISOString() }));
    setText('');
    setDatetime(toLocalInputValue(Date.now() + 3600000));
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3"><Bell className="text-pink-400" /> Reminders</h1>
        <p className="text-slate-400 mt-1">Stay consistent. Schedule what you want to study or review.</p>
      </header>

      <div className="card">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shrink-0">
            <BellRing size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">Daily study reminder</h3>
            <p className="text-sm text-slate-400 mt-0.5">We'll nudge you every day at this time to keep your streak alive.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                Time:
                <input
                  type="time"
                  value={preferences.dailyReminderTime || '19:00'}
                  onChange={e => dispatch(setPreferences({ dailyReminderTime: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-ink-500"
                />
              </label>
              {permission !== 'granted' && permission !== 'unsupported' && (
                <button onClick={requestNotificationPermission} className="btn-ghost text-sm">🔔 Enable browser notifications</button>
              )}
              {permission === 'granted' && <span className="text-xs text-emerald-400 font-semibold">✓ Browser notifications on</span>}
              {permission === 'denied' && <span className="text-xs text-amber-400">Browser blocked. In-app reminders still work.</span>}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="card">
        <h3 className="font-bold text-white mb-3">Add a reminder</h3>
        <div className="space-y-3">
          <input type="text" value={text} onChange={e => setText(e.target.value)}
            placeholder="e.g. Review database indexes"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-ink-500/60 focus:ring-1 focus:ring-ink-500/30" />
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)}
              className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-ink-500/60 focus:ring-1 focus:ring-ink-500/30" />
            <button type="submit" className="btn-primary"><Plus size={16} /> Add reminder</button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Tip: schedule short 25-min study blocks. Easier to commit to.</p>
      </form>

      <section>
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Clock size={18} /> Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <div className="card text-center py-8 text-slate-500 text-sm">No upcoming reminders. Add one above ↑ </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map(r => (
              <ReminderRow key={r._id} reminder={r} onToggle={(id) => dispatch(toggleReminder(id))} onDelete={(id) => dispatch(deleteReminder(id))} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 text-slate-400"><Check size={18} /> Completed ({past.length})</h2>
          <div className="space-y-2 opacity-60">
            {past.map(r => (
              <ReminderRow key={r._id} reminder={r} onToggle={(id) => dispatch(toggleReminder(id))} onDelete={(id) => dispatch(deleteReminder(id))} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReminderRow({ reminder, onToggle, onDelete }) {
  const dt = new Date(reminder.datetime);
  const isPast = dt < new Date();
  return (
    <div className={`card flex items-center gap-3 ${reminder.done ? 'opacity-50' : ''}`}>
      <button onClick={() => onToggle(reminder._id)}
        className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition ${
          reminder.done ? 'bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-500'
        }`}>
        <Check size={16} />
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${reminder.done ? 'line-through text-slate-500' : 'text-white'}`}>{reminder.text}</p>
        <p className="text-xs text-slate-400">
          {dt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          {isPast && !reminder.done && <span className="ml-2 text-amber-400">overdue</span>}
        </p>
      </div>
      <button onClick={() => onDelete(reminder._id)} className="text-slate-500 hover:text-red-400 p-1.5 shrink-0" aria-label="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
