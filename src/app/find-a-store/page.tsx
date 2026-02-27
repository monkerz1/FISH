'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FindAStorePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'detecting' | 'manual' | 'error'>('detecting');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            '';
          const state = data.address?.state || '';

          if (city) {
            router.replace(`/search?q=${encodeURIComponent(`${city}, ${state}`)}`);
          } else {
            setStatus('manual');
          }
        } catch {
          setStatus('manual');
        }
      },
      () => setStatus('manual'),
      { timeout: 8000 }
    );
  }, [router]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  if (status === 'detecting') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-6">🐠</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Finding stores near you...</h1>
          <p className="text-muted-foreground mb-6">
            Please allow location access when prompted by your browser.
          </p>
          <button
            onClick={() => setStatus('manual')}
            className="mt-4 text-sm text-muted-foreground underline hover:text-foreground"
          >
            Skip — let me type my city instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6 max-w-md w-full">
        <div className="text-6xl mb-6">🐟</div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Find Fish Stores Near You</h1>
        <p className="text-muted-foreground mb-8">
          Enter your city, state, or zip code to find local fish stores.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="City, state, or zip..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
            autoFocus
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-[#4A90D9] px-5 py-3 text-sm font-medium text-white hover:bg-[#3A7AC9]"
          >
            Search
          </button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Try: "Chicago, IL" · "90210" · "Miami"
        </p>
      </div>
    </div>
  );
}
