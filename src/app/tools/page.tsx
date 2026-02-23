import { TankVolumeCalculator } from '@/components/tank-volume-calculator';
import { HeaterSizeCalculator } from '@/components/heater-size-calculator';
import { WaterChangeCalculator } from '@/components/water-change-calculator';
import { StockingDensityGuide } from '@/components/stocking-density-guide';
import { SalinityConverter } from '@/components/salinity-converter';

export const metadata = {
  title: 'Aquarium Tools & Calculators - LFS Directory',
  description:
    'Free aquarium calculators to help you set up and maintain the perfect tank. Tank volume, heater sizing, water changes, stocking density, and salinity conversion tools.',
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Aquarium Tools & Calculators
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Free tools to help you set up and maintain your aquarium. From tank
            volume calculations to salinity conversions, we have everything you
            need.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <TankVolumeCalculator />
          <HeaterSizeCalculator />
          <WaterChangeCalculator />
          <StockingDensityGuide />
          <SalinityConverter />
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border bg-muted py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
            Ready to set up or upgrade your tank?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Use our calculator results to find the right products and supplies at
            local fish stores near you.
          </p>
          <div className="mt-8">
            <a
              href="/search"
              className="inline-flex items-center rounded-lg bg-primary px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Search for Local Fish Stores
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
