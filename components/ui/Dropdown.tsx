'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  multiple = false,
  searchable = false,
  disabled = false,
  error,
  className = '',
  size = 'md',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter((v) => v !== optionValue));
    }
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return null;

    if (multiple) {
      return selectedValues.map((val) => {
        const option = options.find((o) => o.value === val);
        return option ? (
          <span
            key={val}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-mint/20 text-mint rounded-lg text-sm"
          >
            {option.label}
            <button
              type="button"
              onClick={(e) => handleRemove(val, e)}
              className="hover:bg-mint/30 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ) : null;
      });
    }

    const option = options.find((o) => o.value === selectedValues[0]);
    return option ? (
      <span className="flex items-center gap-2">
        {option.icon}
        {option.label}
      </span>
    ) : null;
  };

  const displayValue = getDisplayValue();

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full
            ${size === 'sm' ? 'px-3 py-1.5' : 'px-3 py-1.5'}
            ${size === 'sm'
              ? 'bg-white/80 dark:bg-white/20 border-white/90 dark:border-white/25 hover:bg-white/90 dark:hover:bg-white/25'
              : 'bg-white/30 dark:bg-white/10 backdrop-blur-sm border-glass-border'}
            border
            ${size === 'sm' ? 'rounded-full' : 'rounded-xl'}
            text-left ${size === 'sm' ? 'text-xs' : 'text-sm'}
            transition-all duration-200
            focus:outline-none focus:ring-1 focus:ring-mint/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error/50 focus:border-error' : ''}
            ${isOpen ? 'ring-1 ring-mint/50' : ''}
          `}
        >
          <div className="flex items-center justify-between gap-2">
            <div className={`flex-1 flex flex-wrap gap-1 ${size === 'sm' ? 'min-h-4' : 'min-h-5'}`}>
              {displayValue || (
                <span className="text-text-muted">{placeholder}</span>
              )}
            </div>
            <ChevronDown
              className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-text-muted transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1.5 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-glass-border rounded-xl shadow-xl overflow-hidden"
            >
              {searchable && (
                <div className="p-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50"
                  />
                </div>
              )}

              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-text-muted text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`
                          w-full px-3 py-2 text-left text-sm
                          flex items-center gap-3
                          transition-colors duration-150
                          ${isSelected
                            ? 'bg-mint/10'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                          }
                        `}
                      >
                        {/* Checkbox indicator */}
                        <div
                          className={`
                            w-4 h-4 rounded border-2 shrink-0
                            flex items-center justify-center
                            transition-colors duration-150
                            ${isSelected
                              ? 'bg-mint border-mint'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                            }
                          `}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className="flex items-center gap-2 text-text-primary">
                          {option.icon}
                          {option.label}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
