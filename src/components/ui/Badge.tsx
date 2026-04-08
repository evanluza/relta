type BadgeVariant = 'tip' | 'pay' | 'download';

const variants: Record<BadgeVariant, string> = {
  tip: 'bg-success/10 text-success border-success/20',
  pay: 'bg-primary/10 text-primary border-primary/20',
  download: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const labels: Record<BadgeVariant, string> = {
  tip: 'Tip Jar',
  pay: 'Pay Link',
  download: 'Download',
};

export function Badge({ type }: { type: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${variants[type]}`}>
      {labels[type]}
    </span>
  );
}
