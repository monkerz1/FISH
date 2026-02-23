'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSpecialtyFilter = (specialty: string) => {
    router.push(`/search?specialty=${encodeURIComponent(specialty)}`);
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#4A90D9] to-[#2E5C8A] py-20 md:py-32">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 30c10-10 20-10 30 0s20 10 30 0" stroke="white" stroke-width="2" fill="none"/%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
          Find Your Local Fish Store
        </h1>
        <p className="mb-8 text-lg text-blue-100">
          Discover verified aquarium shops in your area. Browse by specialty and support your local LFS.
        </p>
        {/* Search Bar */}
        <div className="mb-8 flex w-full items-center gap-2 rounded-lg bg-white p-2 shadow-lg">
          <Input
            type="text"
            placeholder="Search by city, state, or zip code..."
            className="flex-1 border-0 bg-transparent px-4 text-gray-900 placeholder-gray-500 focus-visible:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSearch}
            className="bg-[#4A90D9] px-6 text-white hover:bg-[#3A7AC9]"
          >
            Search
          </Button>
        </div>
        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#4A90D9]"
            onClick={() => handleSpecialtyFilter('Saltwater & Reef')}
          >
            Saltwater & Reef
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#4A90D9]"
            onClick={() => handleSpecialtyFilter('Freshwater')}
          >
            Freshwater
          </Button>
          <Button
            variant="outline"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#4A90D9]"
            onClick={() => handleSpecialtyFilter('Corals & Plants')}
          >
            Corals & Plants
          </Button>
        </div>
      </div>
    </section>
  );
}