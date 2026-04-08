interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-card border border-card-border rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
