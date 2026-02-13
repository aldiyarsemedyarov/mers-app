import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'agent' | 'human' | 'source' | 'status' | 'conflict';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'status', className = '', children, ...props }, ref) => {
    const variantClasses = {
      agent: 'card-tag tag-agent',
      human: 'card-tag tag-human',
      source: 'card-tag tag-source',
      status: 'status-pill',
      conflict: 'conflict-badge',
    };

    return (
      <span
        ref={ref}
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
