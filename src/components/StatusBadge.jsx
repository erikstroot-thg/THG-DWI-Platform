const statusConfig = {
  concept: { label: 'Concept', kleur: 'bg-thg-orange text-white', volgorde: 1 },
  review: { label: 'Ter review', kleur: 'bg-yellow-500 text-white', volgorde: 2 },
  goedgekeurd: { label: 'Goedgekeurd', kleur: 'bg-thg-green text-white', volgorde: 3 },
  gepubliceerd: { label: 'Gepubliceerd', kleur: 'bg-thg-blue text-white', volgorde: 4 },
  gearchiveerd: { label: 'Gearchiveerd', kleur: 'bg-gray-400 text-white', volgorde: 5 },
  // Legacy statuses
  gereed: { label: 'Gereed', kleur: 'bg-thg-green text-white', volgorde: 3 },
  actief: { label: 'Actief', kleur: 'bg-thg-accent text-white', volgorde: 4 },
}

export const STATUS_FLOW = ['concept', 'review', 'goedgekeurd', 'gepubliceerd', 'gearchiveerd']

export const ALLOWED_TRANSITIONS = {
  concept: ['review'],
  review: ['concept', 'goedgekeurd'],
  goedgekeurd: ['gepubliceerd', 'concept'],
  gepubliceerd: ['gearchiveerd'],
  gearchiveerd: ['concept'], // re-activate
}

export function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.concept
}

export default function StatusBadge({ status }) {
  const config = getStatusConfig(status)
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.kleur}`}
    >
      {config.label}
    </span>
  )
}
