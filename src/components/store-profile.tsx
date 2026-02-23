'use client';

import { MapPin, Phone, Globe, Star, MapPinIcon, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Store {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  description: string;
  isOpen: boolean;
  hoursToday: string;
  starRating: number;
  reviewCount: number;
  specialties: string[];
  services: string[];
  priceLevel: number;
  isClaimed: boolean;
  lastVerified: string;
  googlePlaceId: string;
}

const specialtyColors: Record<string, string> = {
  'Saltwater & Reef': 'bg-cyan-100 text-cyan-900',
  'Freshwater Fish': 'bg-green-100 text-green-900',
  'Corals & SPS/LPS': 'bg-amber-100 text-amber-900',
  'Reef': 'bg-indigo-100 text-indigo-900',
  'Live Plants': 'bg-lime-100 text-lime-900',
  'Koi & Pond': 'bg-teal-100 text-teal-900',
};

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const mockHours: Record<string, string> = {
  'Sunday': '10:00 AM - 6:00 PM',
  'Monday': '9:00 AM - 8:00 PM',
  'Tuesday': '9:00 AM - 8:00 PM',
  'Wednesday': '9:00 AM - 8:00 PM',
  'Thursday': '9:00 AM - 8:00 PM',
  'Friday': '9:00 AM - 9:00 PM',
  'Saturday': '9:00 AM - 8:00 PM',
};

const mockReviews = [
  {
    id: 1,
    rating: 5,
    name: 'Local Aquarist',
    date: '2 weeks ago',
    text: 'Fantastic selection of livestock! The staff really knew their stuff. All the fish I bought are thriving. Will definitely be back.',
    livestockHealth: 5,
    staffKnowledge: 5,
    quarantinePractices: 4,
  },
  {
    id: 2,
    rating: 4,
    name: 'Reef Keeper',
    date: '1 month ago',
    text: 'Great variety of corals and equipment. A bit pricey but quality is worth it. They have a solid quarantine setup which I appreciate.',
    livestockHealth: 4,
    staffKnowledge: 4,
    quarantinePractices: 5,
  },
  {
    id: 3,
    rating: 5,
    name: 'Fish Enthusiast',
    date: '6 weeks ago',
    text: 'Best local shop for planted tanks. The plants are healthy and the aquascaping advice from staff is excellent.',
    livestockHealth: 5,
    staffKnowledge: 5,
    quarantinePractices: 4,
  },
];

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export function StoreProfile({ store }: { store: Store }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(store.address)},${store.city},${store.state}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Store Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{store.name}</h1>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {store.city}, {store.state} {store.zip}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={store.starRating} />
                  <span className="text-sm font-medium text-foreground">
                    {store.starRating.toFixed(1)} ({store.reviewCount} reviews)
                  </span>
                </div>
                {store.isOpen ? (
                  <Badge className="bg-green-600 text-white">Open Now</Badge>
                ) : (
                  <Badge variant="destructive">Closed</Badge>
                )}
                {store.isClaimed ? (
                  <Badge className="bg-blue-600 text-white">Claimed & Verified</Badge>
                ) : (
                  <Badge variant="secondary">Unverified</Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Last verified: {store.lastVerified}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Info Bar */}
        <div className="mb-8 grid grid-cols-1 gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-3 sm:gap-4">
          <a
            href={`tel:${store.phone}`}
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-primary/20 p-3 transition hover:bg-primary/5 sm:border-0"
          >
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-center text-sm font-medium text-foreground">{store.phone}</span>
            <span className="text-xs text-muted-foreground">Call Store</span>
          </a>
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-primary/20 p-3 transition hover:bg-primary/5 sm:border-0"
          >
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-center text-sm font-medium text-foreground truncate">Website</span>
            <span className="text-xs text-muted-foreground">Visit</span>
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-primary/20 p-3 transition hover:bg-primary/5 sm:border-0"
          >
            <MapPinIcon className="h-5 w-5 text-primary" />
            <span className="text-center text-sm font-medium text-foreground">Directions</span>
            <span className="text-xs text-muted-foreground">Google Maps</span>
          </a>
        </div>

        {/* Specialties */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {store.specialties.map((specialty) => (
              <Badge
                key={specialty}
                className={`${specialtyColors[specialty] || 'bg-gray-100 text-gray-900'} border-0 px-3 py-1`}
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">About</h2>
          <p className="leading-relaxed text-foreground">{store.description}</p>
        </Card>

        {/* Hours Table */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Hours</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {days.map((day) => (
                  <tr
                    key={day}
                    className={`border-b last:border-b-0 ${day === today ? 'bg-blue-50' : ''}`}
                  >
                    <td className={`py-3 pr-4 font-medium ${day === today ? 'text-primary' : 'text-foreground'}`}>
                      {day}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{mockHours[day]}</td>
                    {day === today && (
                      <td className="py-3 pl-4">
                        <span className="text-xs font-semibold text-green-600">
                          {store.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Services */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Services</h2>
          <div className="flex flex-wrap gap-2">
            {store.services.map((service) => (
              <Badge key={service} variant="secondary" className="bg-gray-100 text-gray-900">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Level */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Price Range</h2>
          <div className="flex items-center gap-2">
            {[...Array(4)].map((_, i) => (
              <DollarSign
                key={i}
                className={`h-6 w-6 ${i < store.priceLevel ? 'text-primary' : 'text-muted'}`}
              />
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mb-8 p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Community Reviews</h2>
              <p className="mt-1 text-sm text-muted-foreground">Average rating based on {store.reviewCount} reviews</p>
            </div>
            <Button className="bg-primary text-white hover:bg-primary/90">Write a Review</Button>
          </div>

          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="font-medium text-foreground">{review.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="mb-4 leading-relaxed text-foreground">{review.text}</p>
                
                {/* Aquarium-specific dimensions */}
                <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/30 p-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="mb-1 font-semibold text-foreground">Livestock Health</p>
                    <StarRating rating={review.livestockHealth} size="sm" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-foreground">Staff Knowledge</p>
                    <StarRating rating={review.staffKnowledge} size="sm" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-foreground">Quarantine Practices</p>
                    <StarRating rating={review.quarantinePractices} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Is Store Still Open Section */}
        <Card className="border-2 border-primary/20 bg-blue-50 p-6">
          <div className="mb-4 flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Is this store still open?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Help the community — confirm this store is still open and verify the information.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="bg-green-600 text-white hover:bg-green-700">Yes, Still Open!</Button>
            <Button variant="outline">Report Closure</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
