import { forwardRef, InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, className, ...props }, ref) => (
    <div>
      <label className="akk-label">{label}</label>
      <input ref={ref} className={`akk-input ${className ?? ""}`} {...props} />
    </div>
  ),
);
Field.displayName = "Field";
