import { forwardRef, InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, ...props }, ref) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        ref={ref}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
        {...props}
      />
    </div>
  ),
);
Field.displayName = "Field";
