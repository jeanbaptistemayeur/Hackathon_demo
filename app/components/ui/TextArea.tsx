import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, ...props }, ref) => (
    <div className="mb-4">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <textarea
        ref={ref}
        rows={3}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-y disabled:bg-gray-100 disabled:text-gray-500"
        {...props}
      />
    </div>
  ),
);
TextArea.displayName = "TextArea";
