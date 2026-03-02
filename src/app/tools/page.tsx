import type { Metadata } from 'next';
import { TankVolumeCalculator } from '@/components/tank-volume-calculator';
import { HeaterSizeCalculator } from '@/components/heater-size-calculator';
import { WaterChangeCalculator } from '@/components/water-change-calculator';
import { StockingDensityGuide } from '@/components/stocking-density-guide';
import { SalinityConverter } from '@/components/salinity-converter';
import { Co2Calculator } from '@/components/co2-calculator';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Aquarium Calculators & Tools | LFSDirectory.com',
  description:
    'Free aquarium tools for hobbyists: tank volume calculator, heater sizing, water change guide, stocking density, salinity converter, and CO2 calculator for planted tanks. No signup required.',
  openGraph: {
    title: 'Free Aquarium Calculators & Tools | LFSDirectory.com',
    description: 'Calculate tank volume, heater wattage, water changes, CO2 levels, salinity, and stocking density — free tools built for aquarium hobbyists.',
    url: 'https://www.lfsdirectory.com/tools',
  },
};

const faqs = [
  {
    q: 'How many gallons is my aquarium?',
    a: 'For a rectangular tank, multiply length × width × height (all in inches) and divide by 231. A standard 48"×12"×16" aquarium equals about 39.8 gallons. Use our Tank Volume Calculator above for instant results including cylindrical and bow-front tanks.',
  },
  {
    q: 'How often should I do water changes?',
    a: 'Most freshwater tanks benefit from a 25–30% water change weekly. Heavily stocked tanks or reef systems may need more frequent changes. Lightly stocked, well-planted tanks can often go every two weeks. Consistency matters more than exact percentage — the same schedule every week is better than irregular large changes.',
  },
  {
    q: 'What wattage heater do I need for my aquarium?',
    a: 'A common starting point is 5 watts per gallon. However, the temperature difference between your room and target water temp matters significantly. A tank in a cold room needs more wattage than one in a warm home. Our Heater Size Calculator accounts for this delta automatically.',
  },
  {
    q: 'What is the ideal salinity for a reef tank?',
    a: 'Most reef aquariums are kept at a specific gravity of 1.025–1.026, which equals approximately 33–35 ppt salinity. Fish-only saltwater tanks can be kept slightly lower at 1.020–1.025. Always use a quality refractometer rather than a swing-arm hydrometer for accurate readings.',
  },
  {
    q: 'How many fish can I put in my tank?',
    a: 'The classic "1 inch of fish per gallon" rule is a rough starting point for small community freshwater fish, but it breaks down quickly for larger fish, cichlids, and saltwater species. Bioload (waste production), swimming space, and aggression matter as much as size. Our Stocking Density Guide gives type-specific guidance.',
  },
  {
    q: 'What CO2 level is safe for a planted tank?',
    a: 'The ideal dissolved CO2 range for planted tanks is 15–30 ppm. Below 15 ppm, plant growth slows noticeably. Above 35–40 ppm, fish may show signs of stress (gasping at the surface). CO2 levels are estimated from pH and KH using the relationship CO2 = 3 × KH × 10^(7–pH).',
  },
  {
    q: 'Do I need to dechlorinate tap water for water changes?',
    a: 'Yes — always. Municipal tap water contains chlorine or chloramine, both of which are toxic to fish and beneficial bacteria. Use a quality dechlorinator (sodium thiosulfate treats chlorine; a product containing Prime or similar treats chloramine). Add it to the new water before it goes into the tank.',
  },
  {
    q: 'Where can I find a local fish store that tests water for free?',
    a: 'Many independent local fish stores offer free water testing — it\'s one of the biggest advantages of shopping local over online retailers. Use our directory to find stores near you and look for the "Water Testing" service tag on store profiles.',
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a5fa8] to-[#4A90D9] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-2xl">
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              Free Tools
            </span>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              Aquarium Calculators & Tools
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Whether you're setting up your first tank or dialing in a mature reef system,
              these free calculators take the guesswork out of the most common aquarium math.
              No signup, no ads, no nonsense — just the numbers you need.
            </p>
          </div>
        </div>
      </div>

      {/* Intro / How to use */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">How to Use These Tools</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            Each calculator below is interactive — just enter your tank's measurements or parameters
            and the result updates instantly. Start with the <strong>Tank Volume Calculator</strong> if
            you're setting up a new tank, since most other calculations depend on knowing your exact
            volume. For reef hobbyists, the <strong>Salinity Converter</strong> and <strong>CO2 Calculator</strong> are
            particularly useful for dialing in water parameters. All tools work on mobile — bookmark
            this page for quick access at your local fish store.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TankVolumeCalculator />
          <WaterChangeCalculator />
          <SalinityConverter />
          <HeaterSizeCalculator />
          <StockingDensityGuide />
          <Co2Calculator />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Common Aquarium Questions</h2>
            <p className="mt-3 text-gray-500">
              Answers to the questions hobbyists ask most — at the fish store, in the forums, and everywhere in between.
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="mb-2 text-base font-semibold text-gray-900">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#1a5fa8] to-[#4A90D9] py-14 text-white text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-2xl font-bold mb-3">Ready to shop local?</h2>
          <p className="text-blue-100 mb-8">
            Find a local fish store near you that carries the equipment and livestock you need.
          </p>
          <Link
            href="/find-a-store"
            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-[#1a5fa8] hover:bg-blue-50 transition-colors"
          >
            Find a Local Fish Store
          </Link>
        </div>
      </div>

    </main>
  );
}