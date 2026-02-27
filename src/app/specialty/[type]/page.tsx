'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const specialtyLabels: Record<string, string> = {
  saltwater: 'Saltwater & Reef',
  freshwater: 'Freshwater',
  corals: 'Corals & SPS/LPS',
  plants: 'Live Plants',
  koi: 'Koi & Pond',
  specialty: 'Rare & Specialty',
};

export default function SpecialtyPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const label = specialtyLabels[type] || type;

  const [zip, setZip] = useState('');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  // Try to auto-detect location on load
  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      const { query } = JSON.parse(saved);
      router.push(`/search?q=${encodeURIComponent(query)}&specialty=${encodeURIComponent(type)}`);
    }
  }, []);

  const handleUseLocation = () => {
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const zip = data.address?.postcode || '';
          const city = data.address?.city || data.address?.town || data.address?.village || '';
          const query = zip || city;
          localStorage.setItem('userLocation', JSON.stringify({ query, latitude, longitude }));
          router.push(`/search?q=${encodeURIComponent(query)}&specialty=${encodeURIComponent(type)}`);
        } catch {
          setError('Could not determine your location. Please enter your zip code.');
          setLocating(false);
        }
      },
      () => {
        setError('Location access denied. Please enter your zip code below.');
        setLocating(false);
      }
    );
  };

  const handleZipSearch = () => {
    const trimmed = zip.trim();
    if (!trimmed) return;
    localStorage.setItem('userLocation', JSON.stringify({ query: trimmed }));
    router.push(`/search?q=${encodeURIComponent(trimmed)}&specialty=${encodeURIComponent(type)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90D9] to-[#2E5C8A] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">
          {type === 'saltwater' ? '🐠' : type === 'freshwater' ? '🐟' : type === 'corals' ? '🪸' : type === 'plants' ? '🌱' : type === 'koi' ? '🐟' : '✨'}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Find {label} Stores Near You
        </h1>
        <p className="text-gray-500 mb-6">
          We need your location to show you the closest stores.
        </p>

        <button
          onClick={handleUseLocation}
          disabled={locating}
          className="w-full mb-4 bg-[#4A90D9] text-white py-3 rounded-lg font-semibold hover:bg-[#3A7AC9] disabled:opacity-60 transition"
        >
          {locating ? '📍 Locating...' : '📍 Use My Current Location'}
        </button>

        <div className="flex items-center gap-2 mb-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-gray-400 text-sm">or enter zip code</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter zip code..."
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleZipSearch()}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
          />
          <button
            onClick={handleZipSearch}
            className="bg-[#4A90D9] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#3A7AC9] transition"
          >
            Search
          </button>
        </div>

        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
