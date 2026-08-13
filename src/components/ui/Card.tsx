import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'surface' | 'glass' | 'glow' | 'outline';
  isInteractive?: boolean;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', isInteractive = false, className, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[#1B1B1E] border border-[#2D2D31] text-[#FFFFFF]',
      surface: 'bg-[#232326] border border-[#2D2D31] text-[#FFFFFF]',
      glass:
        'bg-[#1B1B1E]/80 backdrop-blur-xl border border-[#2D2D31] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-[#FFFFFF]',
      glow:
        'bg-[#1B1B1E] border border-[#62DF7D]/40 shadow-[0_0_20px_rgba(98,223,125,0.12)] text-[#FFFFFF]',
      outline: 'bg-transparent border border-[#2D2D31] text-[#FFFFFF]',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={isInteractive ? { y: -2, transition: { duration: 0.15 } } : undefined}
        className={cn(
          'rounded-xl p-4 transition-all duration-200 relative overflow-hidden',
          variantStyles[variant],
          isInteractive && 'cursor-pointer hover:border-[#3F3F46] hover:shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const GlassCard = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  return <Card ref={ref} variant="glass" {...props} />;
});

GlassCard.displayName = 'GlassCard';

export interface GlowContainerProps extends HTMLMotionProps<'div'> {
  glowColor?: string;
  children?: React.ReactNode;
}

export const GlowContainer = React.forwardRef<HTMLDivElement, GlowContainerProps>(
  ({ glowColor = 'rgba(98, 223, 125, 0.15)', className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('relative rounded-xl p-0.5 bg-gradient-to-b from-[#62DF7D]/20 to-transparent', className)}
        style={{
          boxShadow: `0 0 25px ${glowColor}`,
        }}
        {...props}
      >
        <div className="bg-[#131315] rounded-[10px] p-4 h-full w-full">{children}</div>
      </motion.div>
    );
  }
);

GlowContainer.displayName = 'GlowContainer';
