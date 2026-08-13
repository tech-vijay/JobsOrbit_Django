import { cn } from "@/lib/utils/cn";
import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "input resize-y min-h-[120px]",
            error && "input-error",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-neutral-400 mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
