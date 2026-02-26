'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface CityCardProps {
  name: string;
  storeCount: number;
  topSpecialty: string;
  state: string;
}

function getCategoryColor(specialty: string): string {
  const colors: Record<string, string> = {
    'Saltwater & Reef': 'bg-cyan-100 text-cyan-900',
    'Freshwater Fish': 'bg-green-100 text-green-900',
    'Corals & SPS/LPS': 'bg-amber-100 text-amber-900',
    'Live Plants': 'bg-emerald-100 text-emerald-900',
    'Koi & Pond': 'bg-indigo-100 text-indigo-900',
    'Rare & Specialty': 'bg-lime-100 text-lime-900',
  };
  return colors[specialty] || 'bg-gray-100 text-gray-900';
}

function CityCard({ name, storeCount, topSpecialty, state }: CityCardProps) {
  return (
    <Link
      href={`/${state.toLowerCase()}/${name.toLowerCase().replace(/\s+/g, '-')}`}
      className="group"
    >
      <div className="rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md">
        <div className="flex flex-col justify-between h-full gap-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {storeCount} {storeCount === 1 ? 'store' : 'stores'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(topSpecialty)}>
              {topSpecialty}
            </Badge>
            <span className="text-primary text-sm font-medium group-hover:underline">
              View Stores →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface CitiesGridProps {
  cities: Array<{ name: string; storeCount: number; topSpecialty: string }>;
  state: string;
}

export function CitiesGrid({ cities, state }: CitiesGridProps) {
  const [showAll, setShowAll] = useState(false);
  const sortedCities = [...cities].sort((a, b) => b.storeCount - a.storeCount);
  const alphabeticalCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));
  const visibleCities = showAll ? alphabeticalCities : sortedCities.slice(0, 12);

  return (
    <div className="w-full bg-background py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Browse by City
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCities.map((city) => (
            <CityCard
              key={city.name}
              name={city.name}
              storeCount={city.storeCount}
              topSpecialty={city.topSpecialty}
              state={state}
            />
          ))}
        </div>
        {sortedCities.length > 12 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
            >
              {showAll ? 'Show Less' : `Show All ${sortedCities.length} Cities`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
