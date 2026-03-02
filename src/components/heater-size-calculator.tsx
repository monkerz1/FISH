'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function HeaterSizeCalculator() {
  const [tankVolume, setTankVolume] = useState('55');
  const [roomTemp, setRoomTemp] = useState('70');
  const [desiredTemp, setDesiredTemp] = useState('78');

  let minWattage = 0;
  let maxWattage = 0;

  if (tankVolume && roomTemp && desiredTemp) {
    const volume = parseFloat(tankVolume);
    const room = parseFloat(roomTemp);
    const desired = parseFloat(desiredTemp);
    const tempDelta = desired - room;

    const baseWattage = volume * 5;
    minWattage = baseWattage * (1 + tempDelta / 20);
    maxWattage = baseWattage * (1 + tempDelta / 15);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3 font-semibold text-white text-sm tracking-wide flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600">
        <span>🌡️</span> Aquarium Heater Size Calculator
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="space-y-4">
          <div>
            <Label htmlFor="volume">Tank Volume (gallons)</Label>
            <Input
              id="volume"
              type="number"
              value={tankVolume}
              onChange={(e) => setTankVolume(e.target.value)}
              placeholder="55"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="roomTemp">Room Temp (°F)</Label>
              <Input
                id="roomTemp"
                type="number"
                value={roomTemp}
                onChange={(e) => setRoomTemp(e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <Label htmlFor="desiredTemp">Desired Temp (°F)</Label>
              <Input
                id="desiredTemp"
                type="number"
                value={desiredTemp}
                onChange={(e) => setDesiredTemp(e.target.value)}
                placeholder="78"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-lg bg-orange-50 p-4">
            <div className="text-sm text-gray-600">Recommended Wattage</div>
            <div className="text-2xl font-bold text-orange-600">
              {minWattage.toFixed(0)} - {maxWattage.toFixed(0)} watts
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Based on 5W per gallon with temperature adjustment
            </div>
          </div>

          <Link href="/search?q=heaters">
            <Button variant="outline" className="w-full">
              Find a store that carries heaters
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
