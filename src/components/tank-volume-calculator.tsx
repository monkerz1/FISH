'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export function TankVolumeCalculator() {
  const [length, setLength] = useState('20');
  const [width, setWidth] = useState('10');
  const [height, setHeight] = useState('12');
  const [shape, setShape] = useState('rectangular');

  let volumeGallons = 0;

  if (length && width && height) {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (shape === 'rectangular') {
      volumeGallons = (l * w * h) / 231;
    } else if (shape === 'cylinder') {
      const radius = w / 2;
      volumeGallons = (3.14159 * radius * radius * h) / 231;
    } else if (shape === 'bowfront') {
      volumeGallons = (l * w * h * 0.9) / 231;
    }
  }

  const volumeLiters = volumeGallons * 3.78541;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle>Tank Volume Calculator</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="shape">Tank Shape</Label>
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger id="shape">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectangular">Rectangular</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="bowfront">Bow Front</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="length">Length (in)</Label>
              <Input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="20"
              />
            </div>
            <div>
              <Label htmlFor="width">Width (in)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (in)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="12"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-lg bg-blue-50 p-4">
            <div className="text-sm text-gray-600">Volume</div>
            <div className="text-2xl font-bold text-blue-600">
              {volumeGallons.toFixed(1)} gallons
            </div>
            <div className="text-sm text-gray-600">
              {volumeLiters.toFixed(1)} liters
            </div>
          </div>

          <Link href="/search?q=heaters">
            <Button variant="outline" className="w-full">
              Find a store that carries tank kits
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
