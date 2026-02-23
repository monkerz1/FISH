'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface NoResultsStateProps {
  query: string;
  distance: number;
}

export function NoResultsState({ query, distance }: NoResultsStateProps) {
  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="ml-2 text-amber-800">
        No stores found within {distance} miles of {query}. Try expanding your search radius.
      </AlertDescription>
    </Alert>
  );
}
