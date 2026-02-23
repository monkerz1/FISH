'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface StoreResultCardProps {
  id: string;
  name: string;
  distance: number;
  city: string;
  state: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  hours: string;
  description: string;
  isVerified: boolean;
  onViewStore: (id: string) => void;
}

const SPECIALTY_COLORS: Record<string, string> = {
  'Saltwater & Reef': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Freshwater Fish': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Corals & SPS/LPS': 'bg-amber-100 text-amber-800 border-amber-200',
  'Live Plants': 'bg-lime-100 text-lime-800 border-lime-200',
  'Koi & Pond': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Rare Species': 'bg-teal-100 text-teal-800 border-teal-200',
};

export function StoreResultCard({
  id,
  name,
  distance,
  city,
  state,
  specialties,
  rating,
  reviewCount,
  isOpen,
  hours,
  description,
  isVerified,
  onViewStore,
}: StoreResultCardProps) {
  const displaySpecialties = specialties.slice(0, 3);

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header with Name and Verified */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-foreground">{name}</h3>
                {isVerified && (
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {distance.toFixed(1)} mi away • {city}, {state}
              </p>
            </div>
            <span className="text-sm font-medium text-primary whitespace-nowrap">
              {distance.toFixed(1)} mi
            </span>
          </div>

          {/* Specialty Tags */}
          <div className="flex flex-wrap gap-2">
            {displaySpecialties.map((specialty) => (
              <Badge
                key={specialty}
                variant="outline"
                className={`${SPECIALTY_COLORS[specialty] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
              >
                {specialty}
              </Badge>
            ))}
          </div>

          {/* Rating and Hours */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-primary">{rating.toFixed(1)}★</span>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full" />
            <div
              className={`font-medium ${isOpen ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {isOpen ? 'Open Now' : 'Closed'} • {hours}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

          {/* View Store Button */}
          <div className="pt-2">
            <Button
              onClick={() => onViewStore(id)}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View Store
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
