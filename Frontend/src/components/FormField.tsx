import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, ...props }: FormFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-ink-800">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-teal-100"
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}
