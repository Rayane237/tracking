export const statusLabels = {
  created: 'Dossier cree',
  processing: 'Preparation',
  in_transit: 'En transit',
  at_port: 'Au port',
  customs: 'Dedouanement',
  delivered: 'Livre',
  delayed: 'Retard',
};

export const statusTone = {
  created: 'bg-slate-100 text-slate-700 ring-slate-200',
  processing: 'bg-blue-50 text-blue-700 ring-blue-100',
  in_transit: 'bg-red-50 text-brand-red ring-red-100',
  at_port: 'bg-amber-50 text-amber-700 ring-amber-100',
  customs: 'bg-purple-50 text-purple-700 ring-purple-100',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  delayed: 'bg-rose-50 text-rose-700 ring-rose-100',
};

export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
  value,
  label,
}));

