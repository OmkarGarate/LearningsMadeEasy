export default function ProgressBar({ value, max = 100, color = 'from-ink-500 to-pink-500', showLabel = true, size = 'md' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${pct}%`, height: '100%' }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>{value} / {max}</span>
          <span className="font-semibold text-slate-200">{pct}%</span>
        </div>
      )}
    </div>
  );
}
