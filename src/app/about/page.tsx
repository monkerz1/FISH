import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About LFSDirectory.com — Built by Fish Hobbyists, for Fish Hobbyists',
  description:
    'LFSDirectory.com was created by passionate aquarium hobbyists tired of outdated, incomplete fish store listings. We built the most accurate, community-verified local fish store directory in the USA.',
  openGraph: {
    title: 'About LFSDirectory.com',
    description:
      'Discover the story behind LFSDirectory.com — the USA\'s most complete directory of local fish stores, built by hobbyists for hobbyists.',
    url: 'https://www.lfsdirectory.com/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#e8f4fd] to-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#4A90D9]/10 px-4 py-1 text-sm font-medium text-[#4A90D9]">
            Our Story
          </span>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Built by Fish Hobbyists,<br />for Fish Hobbyists
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            LFSDirectory.com exists because we got frustrated. Frustrated with driving across town to
            a store that had closed. Frustrated with Google results that mixed pet superstores in
            with real aquarium shops. Frustrated with directories so outdated they still listed stores
            that shut down years ago. So we built something better.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-3xl px-6 py-14">

        <h2 className="mb-4 text-2xl font-bold text-gray-900">The Problem We Kept Running Into</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          If you've been in the aquarium hobby for any length of time, you know the frustration. You
          want a specific fish — maybe a pair of Mandarin dragonets, a rare LPS coral frag, or a
          healthy school of wild-caught Cardinal tetras — and you have no reliable way to find out
          which local fish store near you actually carries it. Google Maps mixes in Walmart pet
          sections and big-box chains alongside the real specialty shops. Yelp listings go years
          without being updated. And the handful of fish store directories that do exist online
          haven't been meaningfully maintained in a long time.
        </p>
        <p className="mb-10 text-gray-700 leading-relaxed">
          We've personally driven 45 minutes to a store that turned out to be permanently closed.
          We've called numbers that were disconnected. We've shown up on a Saturday only to find
          hours that didn't match what was listed anywhere online. Every aquarium hobbyist has a
          version of this story. It's a problem the community has lived with for years simply because
          nobody built the right tool to fix it.
        </p>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">Why We Built LFSDirectory.com</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          We're hobbyists first. Between us we've kept freshwater planted tanks, FOWLR setups,
          full reef systems, and everything in between. We've haunted local fish stores the way other
          people haunt record shops or used bookstores — always hoping to find something rare,
          always striking up conversations with staff who know their livestock better than any
          website ever could. The local fish store is irreplaceable to this hobby, and yet finding a
          good one has always been harder than it should be.
        </p>
        <p className="mb-4 text-gray-700 leading-relaxed">
          LFSDirectory.com was built to be the resource we always wished existed. A single place
          where you can search by city, zip code, or state and find real aquarium shops — not pet
          superstores, not chain retailers, not places that happen to sell a single betta in a cup.
          We're talking about dedicated fish stores: the kind run by people who are as obsessed with
          this hobby as you are.
        </p>
        <p className="mb-10 text-gray-700 leading-relaxed">
          We wanted specialty filtering so reef hobbyists could find reef stores, planted tank
          enthusiasts could find shops stocked with aquatic plants, and koi keepers could find pond
          specialists. We wanted community-verified listings so you'd know a store was actually still
          open before you drove there. And we wanted it to be free — because the aquarium community
          has always been generous with knowledge, and this directory should be too.
        </p>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">What Makes Us Different</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          There are a few other fish store directories out there, and we've used them all. They
          share the same core problem: the data goes stale and nobody's maintaining it. Stores close,
          hours change, phone numbers get disconnected — and the directory just sits there, silently
          sending hobbyists to dead ends.
        </p>
        <p className="mb-4 text-gray-700 leading-relaxed">
          We built LFSDirectory.com with freshness and trust as core features, not afterthoughts.
          Every listing includes a "Still Open?" community verification widget so visitors can
          confirm — or flag — whether a store is still operating. Store owners can claim their free
          listing and keep their own information updated. We scrub our database regularly to remove
          chains, big-box stores, and businesses that are no longer operating as aquarium shops.
        </p>
        <p className="mb-10 text-gray-700 leading-relaxed">
          We also go deeper than name, address, and phone. We track specialty tags so you can filter
          for saltwater and reef stores, freshwater-only shops, coral specialists, live plant
          retailers, koi and pond suppliers, and rare species dealers. We list services like in-store
          water testing, custom tank installation, and livestock delivery where stores offer them.
          This is the level of detail that actually helps you decide where to go.
        </p>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">A Directory Built With the Community</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          No directory team is large enough to personally verify thousands of fish stores across all
          50 states. We built LFSDirectory.com to be community-powered from the start. Hobbyists
          can submit stores we've missed. Visitors can confirm a store is still open. Store owners
          can claim and update their own listings for free. Every data point improves the experience
          for the next person who searches.
        </p>
        <p className="mb-10 text-gray-700 leading-relaxed">
          If you know a great local fish store that isn't in our directory yet, please add it. If
          you visited a store and found it closed, let us know. If you're a store owner who wants to
          update your hours, add photos, or highlight your specialties — claim your listing. This
          directory gets better every time a hobbyist contributes to it, and we're grateful to
          everyone who has.
        </p>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Coverage</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          LFSDirectory.com currently lists thousands of local fish stores across all 50 US states,
          from major metro areas like Los Angeles, Houston, Miami, Chicago, and New York, to smaller
          cities and towns where a single great independent aquarium shop serves the entire local
          hobbyist community. We update our listings regularly and our coverage grows every week.
        </p>
        <p className="mb-10 text-gray-700 leading-relaxed">
          Our goal is to be the most complete and most accurate local fish store directory in the
          United States — and we're not there yet, but we're getting closer every day. If your city
          or region looks thin, that's an opportunity: submit the stores you know, and help us build
          out the directory for your area.
        </p>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">For Store Owners</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          If you operate a local fish store, LFSDirectory.com is built to help customers find you.
          A basic listing is completely free — it includes your store name, address, phone, website,
          and hours. Claiming your listing lets you keep that information accurate and add specialty
          tags so hobbyists searching for exactly what you carry can find you specifically.
        </p>
        <p className="mb-10 text-gray-700 leading-relaxed">
          We know that independent aquarium retailers are up against a lot — online competition,
          rising livestock costs, and customers who don't always know the best local option exists.
          We want to send more hobbyists through your door. Claim your listing and let us help.
        </p>

        {/* CTAs */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/find-a-store"
            className="flex items-center justify-center rounded-lg bg-[#4A90D9] px-6 py-4 font-semibold text-white hover:bg-[#3a7bc8] transition-colors"
          >
            🔍 Find a Fish Store Near You
          </Link>
          <Link
            href="/add-store"
            className="flex items-center justify-center rounded-lg border-2 border-[#4A90D9] px-6 py-4 font-semibold text-[#4A90D9] hover:bg-[#4A90D9]/5 transition-colors"
          >
            ➕ Add a Missing Store
          </Link>
        </div>

      </section>
    </main>
  );
}