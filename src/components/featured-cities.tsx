'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';

const cities = [
  { name: 'Los Angeles', state: 'CA', stores: 234 },
  { name: 'Houston', state: 'TX', stores: 178 },
  { name: 'Miami', state: 'FL', stores: 156 },
  { name: 'Chicago', state: 'IL', stores: 189 },
  { name: 'New York', state: 'NY', stores: 312 },
  { name: 'Phoenix', state: 'AZ', stores: 142 },
  { name: 'Tampa', state: 'FL', stores: 128 },
  { name: 'Seattle', state: 'WA', stores: 167 },
];

export function FeaturedCities() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-gray-900">Featured Cities</h2>
          <p className="text-lg text-gray-600">Explore verified fish stores in popular cities</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <Link key={`${city.name}-${city.state}`} href={`/city/${city.state.toLowerCase()}/${city.name.toLowerCase()}`}>
              <Card className="cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center transition-all hover:shadow-lg hover:ring-2 hover:ring-[#4A90D9]">
                <h3 className="text-xl font-bold text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-600">{city.state}</p>
                <div className="mt-4 rounded-lg bg-white py-2">
                  <p className="text-2xl font-bold text-[#4A90D9]">{city.stores}</p>
                  <p className="text-xs text-gray-600">Verified Stores</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
