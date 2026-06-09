import { forwardRef, InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => (
    <div className="flex items-center gap-2">
      <input ref={ref} type="checkbox" className="rounded" {...props} />
      <label className="text-xs text-gray-500">{label}</label>
    </div>
  ),
);
Checkbox.displayName = "Checkbox";
