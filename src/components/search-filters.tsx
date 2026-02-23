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
  openNow: boolean;
  onOpenNowChange: (openNow: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SPECIALTIES = [
  'Saltwater & Reef',
  'Freshwater Fish',
  'Corals & SPS/LPS',
  'Live Plants',
  'Koi & Pond',
  'Rare Species',
];

const SERVICES = ['Water Testing', 'Custom Tanks', 'Delivery'];

export function SearchFilters({
  maxDistance,
  onDistanceChange,
  selectedSpecialties,
  onSpecialtiesChange,
  selectedServices,
  onServicesChange,
  openNow,
  onOpenNowChange,
  sortBy,
  onSortChange,
}: SearchFiltersProps) {
  const handleSpecialtyToggle = (specialty: string) => {
    const updated = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];
    onSpecialtiesChange(updated);
  };

  const handleServiceToggle = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    onServicesChange(updated);
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
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={`specialty-${specialty}`}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => handleSpecialtyToggle(specialty)}
              />
              <Label
                htmlFor={`specialty-${specialty}`}
                className="font-normal cursor-pointer"
              >
                {specialty}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Services Filter */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Services</Label>
        <div className="space-y-2">
          {SERVICES.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service}`}
                checked={selectedServices.includes(service)}
                onCheckedChange={() => handleServiceToggle(service)}
              />
              <Label htmlFor={`service-${service}`} className="font-normal cursor-pointer">
                {service}
              </Label>
            </div>
          ))}
        </div>
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
