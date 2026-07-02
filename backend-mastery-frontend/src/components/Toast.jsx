import { useEffect } from 'react';
import { Trophy, X, Bell, CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const config = {
    badge:    { icon: Trophy,     color: 'from-yellow-500 to-orange-500',     ring: 'ring-yellow-500/40' },
    success:  { icon: CheckCircle, color: 'from-emerald-500 to-green-500',    ring: 'ring-emerald-500/40' },
    error:    { icon: AlertCircle, color: 'from-red-500 to-rose-500',         ring: 'ring-red-500/40' },
    reminder: { icon: Bell,       color: 'from-blue-500 to-cyan-500',         ring: 'ring-blue-500/40' },
  }[toast.type] || { icon: Bell, color: 'from-purple-500 to-pink-500', ring: 'ring-purple-500/40' };

  const Icon = config.icon;

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-up max-w-sm">
      <div className={`glass rounded-2xl p-4 ring-2 ${config.ring} shadow-2xl flex gap-3 items-start`}>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          {toast.badge && (
            <div className="text-3xl mb-1">{toast.badge.icon}</div>
          )}
          <p className="text-sm font-semibold text-white leading-snug">{toast.message}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white shrink-0">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
