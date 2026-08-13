import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#62DF7D] text-[#003914] font-semibold hover:bg-[#79F292] active:bg-[#4AE176] shadow-[0_0_15px_rgba(98,223,125,0.2)] border border-[#62DF7D]/30',
  secondary:
    'bg-[#1B1B1E] text-[#FFFFFF] font-medium hover:bg-[#232326] hover:text-[#FFFFFF] border border-[#2D2D31]',
  outline:
    'bg-transparent text-[#FFFFFF] font-medium border border-[#2D2D31] hover:border-[#62DF7D]/60 hover:text-[#62DF7D] hover:bg-[#62DF7D]/5',
  ghost:
    'bg-transparent text-[#C8C8CC] font-medium hover:bg-[#232326] hover:text-[#FFFFFF]',
  danger:
    'bg-[#EF4444]/10 text-[#EF4444] font-semibold border border-[#EF4444]/30 hover:bg-[#EF4444]/20 active:bg-[#EF4444]/30',
  glow:
    'bg-[#62DF7D] text-[#003914] font-bold shadow-[0_0_20px_rgba(98,223,125,0.3)] hover:bg-[#79F292] hover:shadow-[0_0_30px_rgba(121,242,146,0.4)] border border-[#62DF7D]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5 min-h-[32px]',
  md: 'px-4 py-2 text-sm rounded-lg gap-2 min-h-[40px]',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5 min-h-[48px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        whileHover={isDisabled ? undefined : { scale: 1.01 }}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62DF7D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131315]',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none shadow-none',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', ...props }, ref) => {
    const iconSizeClasses: Record<ButtonSize, string> = {
      sm: 'w-8 h-8 p-0 text-xs rounded-md',
      md: 'w-10 h-10 p-0 text-sm rounded-lg',
      lg: 'w-12 h-12 p-0 text-base rounded-xl',
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn('justify-center items-center shrink-0', iconSizeClasses[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
