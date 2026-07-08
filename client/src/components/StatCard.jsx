export default function StatCard({ label, value, icon: Icon, tone = 'dark' }) {
  const toneClass = tone === 'red' ? 'bg-brand-red text-white shadow-glow' : 'bg-white text-brand-dark';

  return (
    <div className={`rounded-[2rem] border border-brand-line p-5 shadow-premium ${toneClass}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold opacity-70">{label}</p>
        {Icon && (
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/5">
            <Icon size={20} />
          </div>
        )}
      </div>
      <p className="mt-6 text-4xl font-extrabold">{value}</p>
    </div>
  );
}

