import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode; // input / select / textarea
}

export default function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <p className="alan">
      <label htmlFor={id}>{label}</label>
      {children}
      <span className="hata-metni" role="alert">{error}</span>
    </p>
  );
}
