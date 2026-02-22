'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';

const specialties = [
  { name: 'Saltwater & Reef', emoji: '🐠', slug: 'saltwater' },
  { name: 'Freshwater Fish', emoji: '🐟', slug: 'freshwater' },
  { name: 'Corals & SPS/LPS', emoji: '🪸', slug: 'corals' },
  { name: 'Live Plants', emoji: '🌱', slug: 'plants' },
  { name: 'Koi & Pond', emoji: '🐟', slug: 'koi' },
  { name: 'Rare & Specialty', emoji: '✨', slug: 'specialty' },
];

export function BrowseSpecialty() {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-gray-900">Browse by Specialty</h2>
          <p className="text-lg text-gray-600">Find stores that specialize in what you're looking for</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((specialty) => (
            <Link key={specialty.slug} href={`/specialty/${specialty.slug}`}>
              <Card className="flex cursor-pointer flex-col items-center gap-4 bg-white p-8 text-center transition-all hover:shadow-lg hover:ring-2 hover:ring-[#4A90D9]">
                <div className="text-5xl">{specialty.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900">{specialty.name}</h3>
                <p className="text-sm text-gray-500">Browse stores →</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
