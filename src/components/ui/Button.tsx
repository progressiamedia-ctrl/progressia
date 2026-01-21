import type { ButtonHTMLAttributes, ReactNode } from 'react';
import React from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Reusable Button component with multiple variants and sizes.
 * Supports loading state, disabled state, and full-width layout.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles applied to all buttons
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-semibold',
      'rounded-xl',
      'transition-all',
      'duration-200',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-primary-500',
      'focus-visible:ring-offset-0',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'cursor-pointer',
    ];

    // Variant styles
    const variantStyles = {
      primary: [
        'bg-primary-500',
        'text-[#0A1628]',
        'hover:bg-primary-600',
        'shadow-glow-green',
      ],
      secondary: [
        'bg-surface',
        'text-text-primary',
        'border',
        'border-border',
        'hover:bg-surface-hover',
        'hover:shadow-md',
      ],
      destructive: [
        'bg-error',
        'text-white',
        'hover:bg-error/90',
        'shadow-sm',
      ],
      outline: [
        'border',
        'border-border',
        'text-text-primary',
        'hover:bg-surface-hover',
        'hover:shadow-md',
      ],
      ghost: [
        'text-primary-500',
        'hover:bg-surface-hover/60',
      ],
    };

    // Size styles
    const sizeStyles = {
      sm: ['px-4', 'py-2', 'text-sm', 'gap-2'],
      md: ['px-5', 'py-2.5', 'text-base', 'gap-2'],
      lg: ['px-6', 'py-3', 'text-lg', 'gap-3'],
    };

    // Full width
    const fullWidthStyle = fullWidth ? ['w-full'] : [];

    const allClasses = [
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...fullWidthStyle,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={allClasses}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
