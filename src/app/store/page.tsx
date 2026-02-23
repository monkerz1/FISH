'use client';

import { StoreProfile } from '@/components/store-profile';

const mockStore = {
  name: "Coral Castle Aquariums",
  address: "123 Ocean Drive",
  city: "Miami",
  state: "FL",
  zip: "33139",
  phone: "(305) 555-0142",
  website: "https://coralcastleaquariums.com",
  description: "Coral Castle Aquariums is a premier full-service aquarium shop specializing in reef aquaculture and marine livestock. With over 20 years of experience, we pride ourselves on providing healthy, vibrant corals and fish sourced from trusted suppliers worldwide. Our team of experienced aquarists is always ready to help you build the perfect reef setup. We offer custom tank design, professional installation, and ongoing maintenance services.",
  isOpen: true,
  hoursToday: "9:00 AM - 9:00 PM",
  starRating: 4.8,
  reviewCount: 127,
  specialties: ["Saltwater & Reef", "Corals & SPS/LPS", "Live Plants"],
  services: ["Water Testing", "Custom Tanks", "Delivery", "Aquascaping Consultation", "Quarantine Setup"],
  priceLevel: 3,
  isClaimed: true,
  lastVerified: "2024-02-15",
  googlePlaceId: "ChIJ_-HsSoNwI4gRwKWJpHk9S-w",
};

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background">
      <StoreProfile store={mockStore} />
    </div>
  );
}
