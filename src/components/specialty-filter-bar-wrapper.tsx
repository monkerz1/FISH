'use client';

import { useState } from 'react';
import { SpecialtyFilterBar } from '@/components/specialty-filter-bar';

export function SpecialtyFilterBarWrapper() {
  const [activeFilter, setActiveFilter] = useState('all');
  return (
    <SpecialtyFilterBar
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />
  );
}