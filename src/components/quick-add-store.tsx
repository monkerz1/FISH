'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const SPECIALTIES = [
  'Saltwater & Reef',
  'Freshwater Fish',
  'Corals (SPS/LPS/Soft)',
  'Live Plants',
  'Koi & Pond',
  'Rare & Specialty Species',
  'Invertebrates',
];

interface QuickAddFormData {
  storeName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  specialties: string[];
}

interface QuickAddStoreProps {
  onSubmit?: (data: QuickAddFormData) => Promise<void>;
}

export function QuickAddStore({ onSubmit }: QuickAddStoreProps) {
  const [formData, setFormData] = useState<QuickAddFormData>({
    storeName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    specialties: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSuccess(true);
      setFormData({
        storeName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        website: '',
        specialties: [],
      });
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Quick Add Store</h2>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName" className="text-sm font-medium">Store Name</Label>
              <Input
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                placeholder="Store Name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-sm font-medium">State</Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select State</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street Address"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zip" className="text-sm font-medium">ZIP</Label>
              <Input
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="12345"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website" className="text-sm font-medium">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Specialties</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SPECIALTIES.map(specialty => (
                <div key={specialty} className="flex items-center">
                  <Checkbox
                    id={specialty}
                    checked={formData.specialties.includes(specialty)}
                    onCheckedChange={() => handleSpecialtyToggle(specialty)}
                  />
                  <Label htmlFor={specialty} className="ml-2 text-sm font-normal cursor-pointer">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              {isSubmitting ? 'Adding...' : 'Add Store'}
            </Button>
            {success && (
              <div className="flex-1 bg-green-50 border border-green-200 rounded-md flex items-center justify-center text-green-700 text-sm font-medium">
                Store added successfully!
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
