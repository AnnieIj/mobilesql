import React from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMono?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, isMono = false, className, id, ...props }, ref) => {
    const inputId = id || (label ? `input_${label.toLowerCase().replace(/\s+/g, '_')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#C8C8CC] tracking-wider uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-[#8A8A90] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-[#131315] text-[#FFFFFF] placeholder-[#8A8A90] text-sm rounded-lg border border-[#2D2D31] px-3.5 py-2 transition-all duration-150',
              'focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              isMono && 'font-mono text-xs tracking-tight',
              error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
              props.disabled && 'opacity-50 cursor-not-allowed bg-[#1B1B1E]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#8A8A90] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="flex items-center gap-1 text-xs text-[#EF4444]">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isMono?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, isMono = false, className, id, ...props }, ref) => {
    const textareaId = id || (label ? `textarea_${label.toLowerCase().replace(/\s+/g, '_')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-[#C8C8CC] tracking-wider uppercase">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full bg-[#131315] text-[#FFFFFF] placeholder-[#8A8A90] text-sm rounded-lg border border-[#2D2D31] p-3 transition-all duration-150 resize-y min-h-[90px]',
            'focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]',
            isMono && 'font-mono text-xs tracking-tight',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
            props.disabled && 'opacity-50 cursor-not-allowed bg-[#1B1B1E]',
            className
          )}
          {...props}
        />
        {error && (
          <span className="flex items-center gap-1 text-xs text-[#EF4444]">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export interface SearchBarProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onSearch) onSearch(e.target.value);
    };

    return (
      <Input
        ref={ref}
        leftIcon={<Search className="w-4 h-4" />}
        placeholder="Search tables, queries, lessons..."
        onChange={handleChange}
        {...props}
      />
    );
  }
);

SearchBar.displayName = 'SearchBar';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const selectId = id || (label ? `select_${label.toLowerCase().replace(/\s+/g, '_')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-[#C8C8CC] tracking-wider uppercase">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full bg-[#131315] text-[#FFFFFF] text-sm rounded-lg border border-[#2D2D31] px-3.5 py-2 transition-all duration-150 cursor-pointer',
            'focus:outline-none focus:border-[#62DF7D] focus:ring-1 focus:ring-[#62DF7D]',
            error && 'border-[#EF4444]',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1B1B1E] text-[#FFFFFF]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-[#EF4444]">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
