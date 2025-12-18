'use client';

import { useState, useMemo } from 'react';
import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';
import { cn } from '@/lib/utils';
import { MapPin, Building2 } from 'lucide-react';

// Mock study sites with locations
const mockSites = [
  { id: 'site-1', name: 'Metro Clinical Research Center', address: '123 Medical Plaza, New York, NY 10001', zipCode: '10001', distance: 0 },
  { id: 'site-2', name: 'Westside Health Partners', address: '456 Health Ave, Los Angeles, CA 90001', zipCode: '90001', distance: 0 },
  { id: 'site-3', name: 'Downtown Research Institute', address: '789 Science Blvd, Chicago, IL 60601', zipCode: '60601', distance: 0 },
  { id: 'site-4', name: 'Riverside Medical Center', address: '321 River Road, Houston, TX 77001', zipCode: '77001', distance: 0 },
  { id: 'site-5', name: 'Summit Clinical Trials', address: '654 Mountain View, Phoenix, AZ 85001', zipCode: '85001', distance: 0 },
];

// Mock function to calculate distance (in a real app, this would use geocoding)
function calculateMockDistance(userZip: string, siteZip: string): number {
  if (!userZip || userZip.length < 5) return 999;
  // Simple mock: use difference in zip codes as rough distance indicator
  const diff = Math.abs(parseInt(userZip) - parseInt(siteZip));
  return Math.round(diff / 100); // Rough miles estimate
}

interface SiteSelectorFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function SiteSelectorField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: SiteSelectorFieldProps) {
  const [userZip, setUserZip] = useState('');

  // Calculate distances and sort sites
  const sortedSites = useMemo(() => {
    return mockSites
      .map((site) => ({
        ...site,
        distance: calculateMockDistance(userZip, site.zipCode),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [userZip]);

  return (
    <BaseFieldWrapper field={field} error={error}>
      <div className="space-y-3">
        {/* Zip Code Input */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            type="text"
            value={userZip}
            onChange={(e) => setUserZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="Enter your zip code"
            disabled={disabled}
            maxLength={5}
            className="flex-1 px-4 py-2 rounded-lg bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 transition-colors text-sm"
          />
        </div>

        {/* Site List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedSites.map((site) => (
            <label
              key={site.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors',
                'bg-bg-tertiary border border-glass-border',
                value === site.id && 'border-mint bg-mint/5',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
                  value === site.id
                    ? 'border-mint bg-mint'
                    : 'border-glass-border'
                )}
              >
                {value === site.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <input
                type="radio"
                name={field.name}
                value={site.id}
                checked={value === site.id}
                onChange={() => onChange?.(site.id)}
                disabled={disabled}
                className="sr-only"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-mint flex-shrink-0" />
                    <span className="text-sm font-medium text-text-primary">
                      {site.name}
                    </span>
                  </div>
                  {userZip.length === 5 && (
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      ~{site.distance} mi
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1 pl-6">{site.address}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </BaseFieldWrapper>
  );
}
