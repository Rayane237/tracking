import { CheckCircle2, Clock3 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function Timeline({ events = [] }) {
  return (
    <section className="rounded-[2rem] border border-brand-line bg-white p-5 shadow-premium">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">
            Historique
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-brand-dark">Mises a jour de la commande</h2>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-slate-500">
          {events.length} evenement(s)
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {events.map((event, index) => (
          <article key={event._id || `${event.title}-${index}`} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full ${
                  index === 0 ? 'bg-brand-red text-white' : 'bg-brand-soft text-slate-500'
                }`}
              >
                {index === 0 ? <Clock3 size={18} /> : <CheckCircle2 size={18} />}
              </div>
              {index < events.length - 1 && <div className="mt-2 h-full w-px bg-brand-line" />}
            </div>
            <div className="min-w-0 flex-1 rounded-2xl border border-brand-line p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-extrabold text-brand-dark">{event.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{event.location}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{event.description}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {new Date(event.date).toLocaleString('fr-FR')}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

