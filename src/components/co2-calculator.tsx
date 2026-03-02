'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Co2Calculator() {
  const [tankVolume, setTankVolume] = useState(55);
  const [ph, setPh] = useState(7.0);
  const [kh, setKh] = useState(4);

  // CO2 = 3 * KH * 10^(7 - pH)
  const co2ppm = parseFloat((3 * kh * Math.pow(10, 7 - ph)).toFixed(1));

  const getStatus = () => {
    if (co2ppm < 15) return { label: 'Too Low', color: 'text-red-500', bg: 'bg-red-50', desc: 'Plants will grow slowly. Consider adding CO2.' };
    if (co2ppm <= 30) return { label: 'Ideal', color: 'text-green-600', bg: 'bg-green-50', desc: 'Perfect range for a healthy planted tank.' };
    if (co2ppm <= 40) return { label: 'Slightly High', color: 'text-yellow-600', bg: 'bg-yellow-50', desc: 'Acceptable but monitor fish for stress.' };
    return { label: 'Dangerous', color: 'text-red-600', bg: 'bg-red-50', desc: 'Fish may suffocate. Reduce CO2 immediately.' };
  };

  const status = getStatus();

  // Bubble rate estimate (rough: 1 bps per 25 gallons as starting point)
  const bubbleRate = co2ppm < 15 ? Math.round(tankVolume / 25) : '—';

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3 font-semibold text-white text-sm tracking-wide flex items-center gap-2" style={{ background: '#059669' }}>
        <span>🌿</span> CO2 Calculator (Planted Tanks)
        <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">Popular</span>
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <p className="text-xs text-gray-500 leading-relaxed">
          Enter your tank's pH and KH (carbonate hardness) to estimate dissolved CO2. Ideal for planted tank hobbyists using pressurized CO2 systems.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tank Size (gal)</label>
            <input
              type="number"
              value={tankVolume}
              onChange={e => setTankVolume(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90D9] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">pH</label>
            <input
              type="number"
              step="0.1"
              min="6"
              max="8"
              value={ph}
              onChange={e => setPh(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90D9] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">KH (dKH)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={kh}
              onChange={e => setKh(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#4A90D9] focus:outline-none"
            />
          </div>
        </div>

        <div className={`rounded-lg p-4 ${status.bg}`}>
          <p className="text-xs text-gray-500 mb-1">Estimated CO2</p>
          <p className={`text-3xl font-bold ${status.color}`}>{co2ppm} ppm</p>
          <p className={`text-sm font-semibold mt-1 ${status.color}`}>{status.label}</p>
          <p className="text-xs text-gray-600 mt-1">{status.desc}</p>
          {co2ppm < 15 && (
            <p className="text-xs text-gray-500 mt-2">Suggested starting bubble rate: ~{bubbleRate} bps for this tank size</p>
          )}
        </div>

        <div className="mt-auto pt-2">
          <Link
            href="/find-a-store"
            className="block w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-sm text-gray-600 hover:border-[#4A90D9] hover:text-[#4A90D9] transition-colors"
          >
            Find a store that carries CO2 equipment
          </Link>
        </div>
      </div>
    </div>
  );
}