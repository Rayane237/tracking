import { statusLabels, statusTone } from '../data/status.js';

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        statusTone[status] || statusTone.created
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
}

