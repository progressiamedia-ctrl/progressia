import type { InputHTMLAttributes, ReactNode } from 'react';
import React from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Reusable Input component with optional label, helper text, and error state.
 * Supports all standard HTML input types and includes accessibility features.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              px-4
              py-3
              border
              rounded-lg
              transition-all
              duration-200
              text-base
              bg-surface
              text-text-primary
              placeholder:text-text-tertiary
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary-500
              focus-visible:ring-offset-0
              disabled:bg-surface-hover
              disabled:text-text-secondary
              disabled:cursor-not-allowed
              ${error ? 'border-error focus-visible:ring-error' : 'border-border'}
              ${icon ? 'pl-10' : ''}
              ${className}
            `}
            {...props}
          />

          {icon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-text-tertiary">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm font-medium text-error flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586 3.313 7.899a1 1 0 00-1.414 1.414l7.071 7.071a1 1 0 001.414 0l8.485-8.485z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && <p className="text-sm text-text-tertiary">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
