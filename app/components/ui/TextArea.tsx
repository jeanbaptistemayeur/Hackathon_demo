import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className, ...props }, ref) => (
    <div className="mb-4">
      <label className="akk-label">{label}</label>
      <textarea
        ref={ref}
        rows={3}
        className={`akk-input resize-y ${className ?? ""}`}
        {...props}
      />
    </div>
  ),
);
TextArea.displayName = "TextArea";
