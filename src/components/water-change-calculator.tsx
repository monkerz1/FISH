'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function WaterChangeCalculator() {
  const [tankSize, setTankSize] = useState('55');
  const [percentage, setPercentage] = useState([25]);

  const gallonsToChange = (parseFloat(tankSize) * percentage[0]) / 100 || 0;

  let frequency = 'Weekly';
  if (percentage[0] <= 15) {
    frequency = 'Every 2 weeks';
  } else if (percentage[0] > 40) {
    frequency = 'Twice weekly or more';
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
        <CardTitle>Water Change Calculator</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
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
            <div className="flex items-center justify-between mb-2">
              <Label>Water Change Percentage</Label>
              <span className="text-sm font-semibold text-cyan-600">
                {percentage[0]}%
              </span>
            </div>
            <Slider
              value={percentage}
              onValueChange={setPercentage}
              min={10}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-lg bg-cyan-50 p-4">
            <div>
              <div className="text-sm text-gray-600">Water to Change</div>
              <div className="text-2xl font-bold text-cyan-600">
                {gallonsToChange.toFixed(1)} gallons
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Recommended Frequency</div>
              <div className="text-lg font-semibold text-cyan-700">
                {frequency}
              </div>
            </div>
          </div>

          <Link href="/search?q=water+conditioning">
            <Button variant="outline" className="w-full">
              Find a store that carries water treatments
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
