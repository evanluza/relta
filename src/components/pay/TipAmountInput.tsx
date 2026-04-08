'use client';

const presets = [1, 5, 10, 25];

interface TipAmountInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function TipAmountInput({ value, onChange }: TipAmountInputProps) {
  return (
    <div>
      <label className="text-sm font-medium text-muted mb-2 block">Choose amount (USDC)</label>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {presets.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => onChange(amt)}
            className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
              value === amt
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-card-border hover:border-muted'
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted">$</span>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 px-3 py-2 rounded-lg bg-card border border-card-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Custom amount"
        />
        <span className="text-muted">USDC</span>
      </div>
    </div>
  );
}
