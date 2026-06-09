import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, className, ...props }, ref) => (
    <div>
      <label className="akk-label">{label}</label>
      <select
        ref={ref}
        className={`akk-input cursor-pointer ${className ?? ""}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
);
SelectField.displayName = "SelectField";
