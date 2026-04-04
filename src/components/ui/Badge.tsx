interface BadgeProps {
  urgency: 'pode esperar' | 'agende em breve' | 'procure atendimento urgente';
}

const config = {
  'pode esperar': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Tranquilo',
  },
  'agende em breve': {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    label: 'Atenção',
  },
  'procure atendimento urgente': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
    label: 'Urgente',
  },
};

export default function Badge({ urgency }: BadgeProps) {
  const c = config[urgency];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
