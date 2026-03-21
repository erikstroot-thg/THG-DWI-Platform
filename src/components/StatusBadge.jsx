const statusConfig = {
  gereed: { label: 'Gereed', kleur: 'bg-thg-green text-white' },
  concept: { label: 'Concept', kleur: 'bg-thg-orange text-white' },
  actief: { label: 'Actief', kleur: 'bg-thg-accent text-white' },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.concept
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.kleur}`}
    >
      {config.label}
    </span>
  )
}
