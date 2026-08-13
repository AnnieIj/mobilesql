import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { IconButton } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full rounded-2xl bg-[#131315] border border-[#2D2D31] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]',
              sizeClasses[size]
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="p-5 border-b border-[#2D2D31] flex items-start justify-between bg-[#1B1B1E]">
                <div>
                  {title && <h3 className="text-base font-bold text-[#FFFFFF]">{title}</h3>}
                  {description && <p className="text-xs text-[#8A8A90] mt-0.5">{description}</p>}
                </div>
                <IconButton
                  icon={<X className="w-4 h-4" />}
                  aria-label="Close modal"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                />
              </div>
            )}

            {/* Content */}
            <div className="p-5 overflow-y-auto flex-1 text-sm text-[#C8C8CC]">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="p-4 border-t border-[#2D2D31] bg-[#1B1B1E] flex items-center justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'right';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
}) => {
  const isBottom = position === 'bottom';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={isBottom ? { y: '100%' } : { x: '100%' }}
            animate={isBottom ? { y: 0 } : { x: 0 }}
            exit={isBottom ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className={cn(
              'relative z-10 bg-[#131315] border-[#2D2D31] shadow-2xl flex flex-col overflow-hidden',
              isBottom
                ? 'mt-auto w-full max-h-[85vh] rounded-t-2xl border-t'
                : 'ml-auto h-full w-full max-w-md border-l'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#2D2D31] flex items-center justify-between bg-[#1B1B1E]">
              <h3 className="text-sm font-bold text-[#FFFFFF]">{title}</h3>
              <IconButton
                icon={<X className="w-4 h-4" />}
                aria-label="Close drawer"
                variant="ghost"
                size="sm"
                onClick={onClose}
              />
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1 text-sm text-[#C8C8CC]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen = false,
  onToggle,
}) => {
  return (
    <div className="border border-[#2D2D31] rounded-xl overflow-hidden bg-[#1B1B1E]">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left text-sm font-semibold text-[#FFFFFF] hover:bg-[#232326] transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('w-4 h-4 text-[#8A8A90] transition-transform duration-200', isOpen && 'rotate-180 text-[#62DF7D]')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[#2D2D31] bg-[#131315]"
          >
            <div className="p-4 text-xs text-[#C8C8CC] leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              'absolute z-50 px-2.5 py-1 text-[11px] font-mono text-[#FFFFFF] bg-[#232326] border border-[#2D2D31] rounded-md shadow-xl whitespace-nowrap pointer-events-none',
              position === 'top' ? 'bottom-full mb-1.5 left-1/2 -translate-x-1/2' : 'top-full mt-1.5 left-1/2 -translate-x-1/2'
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
