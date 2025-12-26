'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-[linear-gradient(135deg,#36A67E_0%,#2E9B73_50%,#1F7A58_100%)] text-white hover:bg-[linear-gradient(135deg,#4AC498_0%,#36A67E_50%,#2E9B73_100%)] focus:ring-mint/50 shadow-sm hover:shadow-md',
        secondary:
          'glass-button text-text-primary border border-glass-border hover:border-mint/30 focus:ring-mint/30',
        ghost:
          'bg-transparent text-text-primary hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-sm',
        danger:
          'bg-error text-white hover:bg-red-600 focus:ring-error/50 shadow-sm',
        outline:
          'border border-glass-border bg-transparent text-text-primary hover:bg-white/50 dark:hover:bg-white/10',
        link: 'text-mint underline-offset-4 hover:underline bg-transparent',
      },
      size: {
        sm: 'px-2.5 py-1 text-sm gap-1.5',
        md: 'px-3.5 py-1.5 text-sm gap-2',
        lg: 'px-5 py-2 text-base gap-2',
        icon: 'h-8 w-8 !rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Type for non-animated button
type BaseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

// Type for animated button (motion.button)
type MotionButtonProps = Omit<
  HTMLMotionProps<'button'>,
  'ref' | 'children'
> &
  VariantProps<typeof buttonVariants> & {
    asChild?: false;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
  };

export type ButtonProps = BaseButtonProps | MotionButtonProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // If asChild is true, use Slot (no animation)
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </Slot>
      );
    }

    // Default: use motion.button with hover/tap animations
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        {...(props as Omit<HTMLMotionProps<'button'>, 'ref' | 'children'>)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
