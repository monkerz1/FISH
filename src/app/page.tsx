import { supabase } from '@/lib/supabase';
import { Hero } from '@/components/hero';
import { StatsBar } from '@/components/stats-bar';
import { BrowseSpecialty } from '@/components/browse-specialty';
import { FeaturedCities } from '@/components/featured-cities';
import { HowItWorks } from '@/components/how-it-works';
import { RecentStores } from '@/components/recent-stores';
import { CTABanner } from '@/components/cta-banner';
import { Footer } from '@/components/footer';

export const dynamic = 'force-dynamic'
export default async function Home() {
  const { count: storeCount } = await supabase
    .from('stores')
    .select('*', { count: 'exact', head: true })
    .eq('is_reviewed', true)

  return (
    <main className="w-full">
      <Hero />
      <StatsBar storeCount={storeCount ?? 2738} />
      <BrowseSpecialty />
      <FeaturedCities />
      <HowItWorks />
      <RecentStores />
      <CTABanner />
      <Footer />
    </main>
  );
}