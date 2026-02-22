import { Hero } from '@/components/hero';
import { StatsBar } from '@/components/stats-bar';
import { BrowseSpecialty } from '@/components/browse-specialty';
import { FeaturedCities } from '@/components/featured-cities';
import { HowItWorks } from '@/components/how-it-works';
import { RecentStores } from '@/components/recent-stores';
import { CTABanner } from '@/components/cta-banner';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <StatsBar />
      <BrowseSpecialty />
      <FeaturedCities />
      <HowItWorks />
      <RecentStores />
      <CTABanner />
      <Footer />
    </main>
  );
}
