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
            w-full px-3 py-1.5
            bg-bg-secondary/50 dark:bg-bg-tertiary/50
            border border-glass-border
            rounded-xl
            text-left text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error/50 focus:border-error' : ''}
            ${isOpen ? 'ring-2 ring-mint/50 border-mint' : ''}
          `}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 flex flex-wrap gap-1 min-h-5">
              {displayValue || (
                <span className="text-text-muted">{placeholder}</span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
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
              className="absolute z-50 w-full mt-1.5 py-1.5 glass-panel rounded-xl overflow-hidden"
            >
              {searchable && (
                <div className="px-3 pb-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 bg-bg-tertiary/50 border border-glass-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50"
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
                          flex items-center justify-between gap-2
                          transition-colors duration-150
                          ${isSelected
                            ? 'bg-mint/10 text-mint'
                            : 'text-text-primary hover:bg-bg-tertiary'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4" />}
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
