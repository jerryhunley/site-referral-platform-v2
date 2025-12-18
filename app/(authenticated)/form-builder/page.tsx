'use client';

import { FormBuilderProvider } from '@/lib/context/FormBuilderContext';
import { FormBuilder } from '@/components/form-builder/FormBuilder';

export default function FormBuilderPage() {
  return (
    <FormBuilderProvider>
      <FormBuilder />
    </FormBuilderProvider>
  );
}
