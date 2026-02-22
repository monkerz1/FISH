import { Button } from '@/components/ui/button';

export function CTABanner() {
  return (
    <section className="w-full bg-gradient-to-r from-[#4A90D9] to-[#2E5C8A] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
          Own a Fish Store?
        </h2>
        <p className="mb-8 text-lg text-blue-100">
          Claim your free listing and reach aquarium enthusiasts in your area
        </p>
        <Button className="bg-white px-8 py-6 text-lg font-semibold text-[#4A90D9] hover:bg-blue-50">
          Claim Your Free Listing
        </Button>
      </div>
    </section>
  );
}
