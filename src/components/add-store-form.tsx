'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
  { id: 'saltwater', label: 'Saltwater & Reef' },
  { id: 'freshwater', label: 'Freshwater Fish' },
  { id: 'corals', label: 'Corals (SPS/LPS/Soft)' },
  { id: 'plants', label: 'Live Plants' },
  { id: 'koi', label: 'Koi & Pond' },
  { id: 'rare', label: 'Rare & Specialty Species' },
  { id: 'invertebrates', label: 'Invertebrates' },
];

const SERVICES = [
  { id: 'water-testing', label: 'Water Testing' },
  { id: 'custom-tanks', label: 'Custom Tanks' },
  { id: 'delivery', label: 'Delivery' },
];

interface FormData {
  storeName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  specialties: string[];
  services: string[];
  yourName: string;
  yourEmail: string;
  isOwner: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export function AddStoreForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    storeName: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    specialties: [],
    services: [],
    yourName: '',
    yourEmail: '',
    isOwner: 'no',
    notes: '',
  });

  const validateStep = (stepNum: number) => {
    const newErrors: FormErrors = {};

    if (stepNum === 1) {
      if (!formData.storeName.trim()) newErrors.storeName = 'Store name is required';
      if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zip.trim() || !/^\d{5}$/.test(formData.zip)) {
        newErrors.zip = 'Valid 5-digit ZIP code is required';
      }
    } else if (stepNum === 2) {
      if (formData.specialties.length === 0) newErrors.specialties = 'Select at least one specialty';
    } else if (stepNum === 3) {
      if (!formData.yourName.trim()) newErrors.yourName = 'Your name is required';
      if (!formData.yourEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.yourEmail)) {
        newErrors.yourEmail = 'Valid email is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSpecialtyChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(id)
        ? prev.specialties.filter(s => s !== id)
        : [...prev.specialties, id],
    }));
    if (errors.specialties) {
      setErrors(prev => ({ ...prev, specialties: '' }));
    }
  };

  const handleServiceChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/stores/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          storeName: '',
          streetAddress: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          website: '',
          specialties: [],
          services: [],
          yourName: '',
          yourEmail: '',
          isOwner: 'no',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Thanks for your submission!</h2>
        <p className="mb-6 text-lg text-muted-foreground">
          We'll review your submission within 48 hours.
        </p>
        <p className="mb-6 border-t border-blue-200 pt-4 text-sm text-muted-foreground">
          We verify all submissions before listing. Duplicate submissions will be merged.
        </p>
        <Button
          onClick={() => {
            setShowSuccess(false);
            setStep(1);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          Add Another Store
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                step >= num
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {num}
            </div>
            {num < 3 && (
              <div
                className={`mx-2 h-1 w-12 transition-colors sm:w-20 ${
                  step > num ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Store Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Step 1: Store Information</h2>
              <p className="text-muted-foreground">Tell us about the store</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="e.g., Aquatic Paradise"
                  className={errors.storeName ? 'border-destructive' : ''}
                />
                {errors.storeName && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {errors.storeName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main St"
                  className={errors.streetAddress ? 'border-destructive' : ''}
                />
                {errors.streetAddress && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {errors.streetAddress}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Miami"
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" /> {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.state ? 'border-destructive' : ''
                    }`}
                  >
                    <option value="">Select a state</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" /> {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="e.g., 33101"
                  maxLength={5}
                  className={errors.zip ? 'border-destructive' : ''}
                />
                {errors.zip && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {errors.zip}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., (305) 555-0123"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="e.g., https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Specialties & Services */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Step 2: Specialties & Services</h2>
              <p className="text-muted-foreground">What does this store offer?</p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold text-foreground">Specialties *</h3>
                <div className="space-y-3">
                  {SPECIALTIES.map(specialty => (
                    <div key={specialty.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty.id}
                        checked={formData.specialties.includes(specialty.id)}
                        onCheckedChange={() => handleSpecialtyChange(specialty.id)}
                      />
                      <Label htmlFor={specialty.id} className="font-normal cursor-pointer">
                        {specialty.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.specialties && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {errors.specialties}
                  </p>
                )}
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-foreground">Services (Optional)</h3>
                <div className="space-y-3">
                  {SERVICES.map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.services.includes(service.id)}
                        onCheckedChange={() => handleServiceChange(service.id)}
                      />
                      <Label htmlFor={service.id} className="font-normal cursor-pointer">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Your Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Step 3: Your Information</h2>
              <p className="text-muted-foreground">Help us verify this submission</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="yourName">Your Name *</Label>
                <Input
                  id="yourName"
                  name="yourName"
                  value={formData.yourName}
                  onChange={handleInputChange}
                  placeholder="e.g., John Smith"
                  className={errors.yourName ? 'border-destructive' : ''}
                />
                {errors.yourName && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {errors.yourName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="yourEmail">Your Email *</Label>
                <Input
                  id="yourEmail"
                  name="yourEmail"
                  type="email"
                  value={formData.yourEmail}
                  onChange={handleInputChange}
                  placeholder="e.g., john@example.com"
                  className={errors.yourEmail ? 'border-destructive' : ''}
                />
                {errors.yourEmail && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" /> {errors.yourEmail}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-3 block font-semibold">Are you the store owner?</Label>
                <RadioGroup value={formData.isOwner} onValueChange={(value) => setFormData(prev => ({ ...prev, isOwner: value }))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="owner-yes" />
                    <Label htmlFor="owner-yes" className="font-normal cursor-pointer">
                      Yes, I am the store owner
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="owner-no" />
                    <Label htmlFor="owner-no" className="font-normal cursor-pointer">
                      No, I'm submitting on behalf
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Anything else we should know about this store?"
                  rows={4}
                />
              </div>

              <Card className="border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-foreground">
                  We verify all submissions before listing. Duplicate submissions will be merged.
                </p>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Store'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
