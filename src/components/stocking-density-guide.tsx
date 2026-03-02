'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function StockingDensityGuide() {
  const [tankSize, setTankSize] = useState('55');
  const [fishType, setFishType] = useState('freshwater');

  const volume = parseFloat(tankSize) || 0;

  const guides: Record<
    string,
    { ratio: number; description: string; minStock: number; maxStock: number }
  > = {
    freshwater: {
      ratio: 1,
      description: '1 inch of fish per gallon (community fish)',
      minStock: volume,
      maxStock: Math.floor(volume * 1.5),
    },
    cichlids: {
      ratio: 1.5,
      description: '1 inch of fish per 1.5 gallons (cichlids are aggressive)',
      minStock: Math.floor(volume / 1.5),
      maxStock: Math.floor(volume / 2),
    },
    saltwater: {
      ratio: 3,
      description: '1 inch of fish per 3 gallons (FOWLR - Fish Only With Live Rock)',
      minStock: Math.floor(volume / 3),
      maxStock: Math.floor(volume / 4),
    },
    reef: {
      ratio: 4,
      description: '1 inch of fish per 4 gallons (Reef tanks - lower bioload)',
      minStock: Math.floor(volume / 4),
      maxStock: Math.floor(volume / 5),
    },
  };

  const guide = guides[fishType];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3 font-semibold text-white text-sm tracking-wide flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600">
        <span>🐟</span> Stocking Density Guide
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tanksize">Tank Size (gallons)</Label>
            <Input
              id="tanksize"
              type="number"
              value={tankSize}
              onChange={(e) => setTankSize(e.target.value)}
              placeholder="55"
            />
          </div>

          <div>
            <Label htmlFor="fishtype">Fish Type</Label>
            <Select value={fishType} onValueChange={setFishType}>
              <SelectTrigger id="fishtype">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freshwater">
                  Freshwater Community
                </SelectItem>
                <SelectItem value="cichlids">Cichlids</SelectItem>
                <SelectItem value="saltwater">Saltwater FOWLR</SelectItem>
                <SelectItem value="reef">Reef</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 space-y-3 rounded-lg bg-green-50 p-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Rule of Thumb</div>
              <div className="text-sm font-semibold text-green-700">
                {guide.description}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Recommended Stock Range</div>
              <div className="text-2xl font-bold text-green-600">
                {guide.minStock} - {guide.maxStock} inches of fish
              </div>
            </div>
          </div>

          <Link href="/search?q=fish">
            <Button variant="outline" className="w-full">
              Find a store near you
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
