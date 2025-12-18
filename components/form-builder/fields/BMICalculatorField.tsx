'use client';

import { useState, useMemo } from 'react';
import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';
import { cn } from '@/lib/utils';

interface BMICalculatorFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: { height: number; weight: number; bmi: number };
  onChange?: (value: { height: number; weight: number; bmi: number }) => void;
  error?: string;
}

function calculateBMI(
  height: number,
  weight: number,
  heightUnit: 'inches' | 'cm',
  weightUnit: 'lbs' | 'kg'
): number {
  if (!height || !weight) return 0;

  // Convert to metric
  const heightInMeters = heightUnit === 'inches' ? height * 0.0254 : height / 100;
  const weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;

  // BMI = kg / m^2
  return weightInKg / (heightInMeters * heightInMeters);
}

function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi === 0) return { label: '', color: 'text-text-muted' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { label: 'Normal', color: 'text-mint' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-500' };
  return { label: 'Obese', color: 'text-error' };
}

export function BMICalculatorField({
  field,
  disabled,
  value,
  onChange,
  error,
}: BMICalculatorFieldProps) {
  const heightUnit = field.heightUnit || 'inches';
  const weightUnit = field.weightUnit || 'lbs';

  const [height, setHeight] = useState(value?.height || 0);
  const [weight, setWeight] = useState(value?.weight || 0);

  const bmi = useMemo(() => {
    return calculateBMI(height, weight, heightUnit, weightUnit);
  }, [height, weight, heightUnit, weightUnit]);

  const category = getBMICategory(bmi);

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    const newBmi = calculateBMI(newHeight, weight, heightUnit, weightUnit);
    onChange?.({ height: newHeight, weight, bmi: newBmi });
  };

  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight);
    const newBmi = calculateBMI(height, newWeight, heightUnit, weightUnit);
    onChange?.({ height, weight: newWeight, bmi: newBmi });
  };

  return (
    <BaseFieldWrapper field={field} error={error}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Height Input */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Height ({heightUnit})
            </label>
            <input
              type="number"
              value={height || ''}
              onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
              placeholder={heightUnit === 'inches' ? '70' : '178'}
              disabled={disabled}
              min={0}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 transition-colors"
            />
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Weight ({weightUnit})
            </label>
            <input
              type="number"
              value={weight || ''}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
              placeholder={weightUnit === 'lbs' ? '150' : '68'}
              disabled={disabled}
              min={0}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 transition-colors"
            />
          </div>
        </div>

        {/* BMI Result */}
        <div
          className={cn(
            'p-4 rounded-xl bg-bg-tertiary border border-glass-border',
            bmi > 0 && 'border-mint/30'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Your BMI</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-text-primary">
                {bmi > 0 ? bmi.toFixed(1) : '--'}
              </span>
              {category.label && (
                <p className={cn('text-xs font-medium mt-0.5', category.color)}>
                  {category.label}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseFieldWrapper>
  );
}
