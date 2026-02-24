'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFiltersProps {
  maxDistance: number;
  onDistanceChange: (distance: number) => void;
  selectedSpecialties: string[];
  onSpecialtiesChange: (specialties: string[]) => void;
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  selectedSupplies: string[];
  onSuppliesChange: (supplies: string[]) => void;
  showChains: boolean;
  onShowChainsChange: (show: boolean) => void;
  openNow: boolean;
  onOpenNowChange: (openNow: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SPECIALTIES = [
  { label: 'Saltwater & Reef', value: 'saltwater' },
  { label: 'Reef', value: 'reef' },
  { label: 'Corals & SPS/LPS', value: 'corals' },
  { label: 'Freshwater Fish', value: 'freshwater' },
  { label: 'Cichlids', value: 'cichlids' },
  { label: 'Live Plants', value: 'planted' },
  { label: 'Invertebrates', value: 'invertebrates' },
  { label: 'Koi & Pond', value: 'koi' },
  { label: 'Goldfish', value: 'goldfish' },
  { label: 'Rare Species', value: 'rare' },
];

const SERVICES = [
  { label: 'Water Testing', value: 'water testing' },
  { label: 'Custom Tanks', value: 'custom tanks' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'Aquarium Maintenance', value: 'aquarium maintenance' },
  { label: 'Installation', value: 'installation' },
  { label: 'Aquarium Design', value: 'aquarium design' },
  { label: 'Coral Fragging', value: 'coral fragging' },
  { label: 'Fish Boarding', value: 'fish boarding' },
];

const SUPPLIES = [
  { label: 'Live Rock', value: 'live rock' },
  { label: 'Live Sand', value: 'live sand' },
  { label: 'Frozen Food', value: 'frozen food' },
  { label: 'Live Food', value: 'live food' },
  { label: 'Dry Food', value: 'dry food' },
  { label: 'RO Water', value: 'ro water' },
  { label: 'Salt Mix', value: 'salt mix' },
  { label: 'Reef Supplements', value: 'reef supplements' },
  { label: 'Lighting', value: 'lighting' },
  { label: 'Filtration', value: 'filtration' },
  { label: 'RO Unit', value: 'ro unit' },
  { label: 'Driftwood', value: 'driftwood' },
  { label: 'Medications', value: 'medications' },
  { label: 'CO2 Systems', value: 'co2 systems' },
];

export function SearchFilters({
  maxDistance,
  onDistanceChange,
  selectedSpecialties,
  onSpecialtiesChange,
  selectedServices,
  onServicesChange,
  selectedSupplies,
  onSuppliesChange,
  showChains,
  onShowChainsChange,
  openNow,
  onOpenNowChange,
  sortBy,
  onSortChange,
}: SearchFiltersProps) {
  const handleSpecialtyToggle = (value: string) => {
    const updated = selectedSpecialties.includes(value)
      ? selectedSpecialties.filter((s) => s !== value)
      : [...selectedSpecialties, value];
    onSpecialtiesChange(updated);
  };

  const handleServiceToggle = (value: string) => {
    const updated = selectedServices.includes(value)
      ? selectedServices.filter((s) => s !== value)
      : [...selectedServices, value];
    onServicesChange(updated);
  };

  const handleSupplyToggle = (value: string) => {
    const updated = selectedSupplies.includes(value)
      ? selectedSupplies.filter((s) => s !== value)
      : [...selectedSupplies, value];
    onSuppliesChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Distance Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Distance</Label>
          <span className="text-sm font-medium text-primary">{maxDistance} mi</span>
        </div>
        <Slider
          value={[maxDistance]}
          onValueChange={(value) => onDistanceChange(value[0])}
          min={5}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Specialty Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Specialty</Label>
        <div className="space-y-2">
          {SPECIALTIES.map((specialty) => (
            <div key={specialty.value} className="flex items-center space-x-2">
              <Checkbox
                id={`specialty-${specialty.value}`}
                checked={selectedSpecialties.includes(specialty.value)}
                onCheckedChange={() => handleSpecialtyToggle(specialty.value)}
              />
              <Label
                htmlFor={`specialty-${specialty.value}`}
                className="font-normal cursor-pointer"
              >
                {specialty.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Services Filter */}
      <div className="space-y-3 pt-3 border-t">
        <Label className="text-base font-semibold">Services</Label>
        <div className="space-y-2">
          {SERVICES.map((service) => (
            <div key={service.value} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service.value}`}
                checked={selectedServices.includes(service.value)}
                onCheckedChange={() => handleServiceToggle(service.value)}
              />
              <Label htmlFor={`service-${service.value}`} className="font-normal cursor-pointer">
                {service.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Supplies Filter */}
      <div className="space-y-3 pt-3 border-t">
        <Label className="text-base font-semibold">Supplies</Label>
        <div className="space-y-2">
          {SUPPLIES.map((supply) => (
            <div key={supply.value} className="flex items-center space-x-2">
              <Checkbox
                id={`supply-${supply.value}`}
                checked={selectedSupplies.includes(supply.value)}
                onCheckedChange={() => handleSupplyToggle(supply.value)}
              />
              <Label htmlFor={`supply-${supply.value}`} className="font-normal cursor-pointer">
                {supply.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Chain / Independent Toggle */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div>
          <Label htmlFor="show-chains" className="text-base font-semibold cursor-pointer">
            Show Chain Stores
          </Label>
          <p className="text-xs text-muted-foreground">Petco, PetSmart, etc.</p>
        </div>
        <Switch id="show-chains" checked={showChains} onCheckedChange={onShowChainsChange} />
      </div>

      {/* Open Now Toggle */}
      <div className="flex items-center justify-between pt-3 border-t">
        <Label htmlFor="open-now" className="text-base font-semibold cursor-pointer">
          Open Now
        </Label>
        <Switch id="open-now" checked={openNow} onCheckedChange={onOpenNowChange} />
      </div>

      {/* Sort By */}
      <div className="space-y-3 pt-3 border-t">
        <Label htmlFor="sort" className="text-base font-semibold">
          Sort By
        </Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="verified">Recently Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
