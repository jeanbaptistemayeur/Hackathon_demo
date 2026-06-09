import { forwardRef, InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        className={`h-4 w-4 rounded border-line text-brand accent-brand ${className ?? ""}`}
        {...props}
      />
      <span className="text-xs font-medium text-muted">{label}</span>
    </label>
  ),
);
Checkbox.displayName = "Checkbox";
