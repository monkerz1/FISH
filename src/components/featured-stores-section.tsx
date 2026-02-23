import Link from 'next/link';
import { Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedStore {
  id: string;
  name: string;
  city: string;
  state: string;
  slug: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  description: string;
  claimed: boolean;
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

function StoreCard({ store }: { store: FeaturedStore }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{store.name}</h3>
            <p className="text-sm text-muted-foreground">{store.city}</p>
          </div>
          {store.claimed && (
            <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Verified</span>
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center gap-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(store.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">
            {store.rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({store.reviewCount})
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {store.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} className={getCategoryColor(specialty)}>
              {specialty}
            </Badge>
          ))}
        </div>

        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {store.description}
        </p>

        <Button
          variant="default"
          className="w-full"
          asChild
        >
          <Link href={`/${store.state.toLowerCase()}/${store.city.toLowerCase().replace(/\s+/g, '-')}/${store.slug}`}>
            View Store
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface FeaturedStoresProps {
  state: string;
  stores: FeaturedStore[];
}

export function FeaturedStoresSection({ state, stores }: FeaturedStoresProps) {
  return (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Top Rated Stores in {state}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.slice(0, 6).map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </div>
  );
}
