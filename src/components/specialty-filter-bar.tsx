'use client';

import { Button } from '@/components/ui/button';

interface SpecialtyFilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const specialties = [
  { id: 'all', label: 'All' },
  { id: 'saltwater', label: 'Saltwater & Reef' },
  { id: 'freshwater', label: 'Freshwater' },
  { id: 'corals', label: 'Corals' },
  { id: 'plants', label: 'Live Plants' },
  { id: 'koi', label: 'Koi & Pond' },
  { id: 'rare', label: 'Rare Species' },
];

export function SpecialtyFilterBar({
  activeFilter,
  onFilterChange,
}: SpecialtyFilterBarProps) {
  return (
    <div className="w-full border-b border-border bg-card py-4">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {specialties.map((specialty) => (
            <Button
              key={specialty.id}
              onClick={() => onFilterChange(specialty.id)}
              variant={activeFilter === specialty.id ? 'default' : 'outline'}
              className="shrink-0 whitespace-nowrap"
            >
              {specialty.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
