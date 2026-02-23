import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface StateHeaderProps {
  state: string;
  storeCount: number;
  cityCount: number;
}

export function StateHeader({ state, storeCount, cityCount }: StateHeaderProps) {
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/browse" className="text-muted-foreground hover:text-primary">
            Browse by State
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{state}</span>
        </nav>

        {/* Header Content */}
        <div className="space-y-2">
          <h1 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            Fish Stores in {state}
          </h1>
          <p className="text-lg text-muted-foreground">
            {storeCount} aquarium and fish stores listed across {cityCount} cities.
          </p>
        </div>
      </div>
    </div>
  );
}
