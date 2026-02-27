import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const FEATURED_CITIES = [
  { name: 'Los Angeles', state: 'CA', stateSlug: 'california' },
  { name: 'Houston',     state: 'TX', stateSlug: 'texas' },
  { name: 'Miami',       state: 'FL', stateSlug: 'florida' },
  { name: 'Chicago',     state: 'IL', stateSlug: 'illinois' },
  { name: 'New York',    state: 'NY', stateSlug: 'new-york' },
  { name: 'Phoenix',     state: 'AZ', stateSlug: 'arizona' },
  { name: 'Tampa',       state: 'FL', stateSlug: 'florida' },
  { name: 'Seattle',     state: 'WA', stateSlug: 'washington' },
];

export async function FeaturedCities() {
  // Fetch real store counts for each city from Supabase
  const { data } = await supabase
    .from('store_locations')
    .select('city, state')
    .in('state', ['CA', 'TX', 'FL', 'IL', 'NY', 'AZ', 'WA'])

  // Build a count lookup: "Los Angeles-CA" -> 47
  const countMap: Record<string, number> = {}
  data?.forEach(row => {
    if (row.city && row.state) {
      const key = `${row.city}-${row.state}`
      countMap[key] = (countMap[key] || 0) + 1
    }
  })

  const cities = FEATURED_CITIES.map(city => ({
    ...city,
    citySlug: city.name.toLowerCase().replace(/\s+/g, '-'),
    stores: countMap[`${city.name}-${city.state}`] || 0,
  }))

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-gray-900">Featured Cities</h2>
          <p className="text-lg text-gray-600">Explore verified fish stores in popular cities</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <Link
              key={`${city.name}-${city.state}`}
              href={`/${city.stateSlug}/${city.citySlug}`}
            >
              <Card className="cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center transition-all hover:shadow-lg hover:ring-2 hover:ring-[#4A90D9]">
                <h3 className="text-xl font-bold text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-600">{city.state}</p>
                <div className="mt-4 rounded-lg bg-white py-2">
                  <p className="text-2xl font-bold text-[#4A90D9]">{city.stores}</p>
                  <p className="text-xs text-gray-600">Stores Listed</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}