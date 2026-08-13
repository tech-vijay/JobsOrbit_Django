import { cn } from "@/lib/utils/cn";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn("input", error && "input-error", className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="error-text" role="alert">
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

Input.displayName = "Input";
