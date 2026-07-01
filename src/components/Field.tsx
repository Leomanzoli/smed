import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, required, hint, error, htmlFor, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label className={`label ${required ? 'req' : ''}`} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
