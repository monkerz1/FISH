'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SalinityConverter() {
  const [ppt, setPpt] = useState('35');
  const [sg, setSg] = useState('1.0264');
  const [activeTab, setActiveTab] = useState('ppt');

  const handlePptChange = (value: string) => {
    setPpt(value);
    if (value) {
      const pptNum = parseFloat(value);
      const sgCalc = 1.0 + pptNum / 1000;
      setSg(sgCalc.toFixed(4));
    }
  };

  const handleSgChange = (value: string) => {
    setSg(value);
    if (value) {
      const sgNum = parseFloat(value);
      const pptCalc = (sgNum - 1.0) * 1000;
      setPpt(pptCalc.toFixed(1));
    }
  };

  const sgNum = parseFloat(sg) || 0;
  let statusColor = 'bg-yellow-50';
  let statusText = 'Slightly Low';

  if (sgNum >= 1.025 && sgNum <= 1.026) {
    statusColor = 'bg-green-50';
    statusText = 'Ideal Reef Range';
  } else if (sgNum < 1.025) {
    statusColor = 'bg-red-50';
    statusText = 'Too Low';
  } else if (sgNum > 1.026) {
    statusColor = 'bg-yellow-50';
    statusText = 'Slightly High';
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2">
          Salinity / Specific Gravity Converter
          <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">Popular</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ppt">PPT</TabsTrigger>
              <TabsTrigger value="sg">Specific Gravity</TabsTrigger>
            </TabsList>

            <TabsContent value="ppt" className="space-y-4">
              <div>
                <Label htmlFor="ppt">Salinity (PPT)</Label>
                <Input
                  id="ppt"
                  type="number"
                  value={ppt}
                  onChange={(e) => handlePptChange(e.target.value)}
                  placeholder="35"
                  step="0.1"
                />
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                Specific Gravity: {sg}
              </div>
            </TabsContent>

            <TabsContent value="sg" className="space-y-4">
              <div>
                <Label htmlFor="sg">Specific Gravity</Label>
                <Input
                  id="sg"
                  type="number"
                  value={sg}
                  onChange={(e) => handleSgChange(e.target.value)}
                  placeholder="1.0264"
                  step="0.0001"
                />
              </div>
              <div className="text-sm text-gray-600 font-semibold">PPT: {ppt}</div>
            </TabsContent>
          </Tabs>

          <div className={`mt-6 rounded-lg p-4 ${statusColor}`}>
            <div className="text-sm text-gray-600 mb-1">Reef Target Range</div>
            <div className="text-sm mb-2">
              <span className="font-semibold">1.025 - 1.026 SG</span> (Ideal)
            </div>
            <div className="text-sm font-semibold">
              <span className="text-indigo-700">Status: {statusText}</span>
            </div>
          </div>

          <Link href="/search?q=reef+salt">
            <Button variant="outline" className="w-full">
              Find a store that carries reef salt
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
