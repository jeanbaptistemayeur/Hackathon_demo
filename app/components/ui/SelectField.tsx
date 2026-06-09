import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, ...props }, ref) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select
        ref={ref}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
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
