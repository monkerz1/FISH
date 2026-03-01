import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

async function getSpotlightStores() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('stores')
    .select('id, name, city, state, specialty_tags, rating, slug')
    .eq('is_featured', true)
    .or(`featured_until.is.null,featured_until.gte.${today}`)
    .limit(4);

  if (error) {
    console.error('Error fetching spotlight stores:', error);
    return [];
  }
  return data || [];
}

export async function RecentStores() {
  const stores = await getSpotlightStores();

  if (stores.length === 0) return null;

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-7 w-7 text-yellow-400 fill-yellow-400" />
            <h2 className="text-4xl font-bold text-gray-900">Spotlight Stores</h2>
            <Sparkles className="h-7 w-7 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-lg text-gray-600">Hand-picked local fish stores worth checking out</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stores.map((store) => (
            <Card key={store.id} className="flex flex-col gap-4 bg-white p-6 transition-all hover:shadow-lg border-yellow-200 border-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.city}, {store.state}</p>
                </div>
                <span className="text-yellow-400 text-lg">⭐</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(store.specialty_tags || []).slice(0, 3).map((specialty: string, idx: number) => (
                  <Badge key={idx} className="bg-blue-100 text-[#4A90D9]">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">
                  {store.rating ? store.rating.toFixed(1) : 'New'}
                </span>
              </div>
              <Link href={`/${store.state.toLowerCase()}/${store.city.toLowerCase().replace(/\s+/g, '-')}/${store.slug}`}>
                <Button className="w-full bg-[#4A90D9] text-white hover:bg-[#3A7AC9]">
                  View Store
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}