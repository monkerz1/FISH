'use client';

import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

interface MapToggleProps {
  isMapView: boolean;
  onToggle: () => void;
}

export function MapToggle({ isMapView, onToggle }: MapToggleProps) {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onToggle}
        variant={isMapView ? 'default' : 'outline'}
        className="gap-2"
      >
        <Map className="w-4 h-4" />
        {isMapView ? 'View List' : 'View on Map'}
      </Button>
    </div>
  );
}
