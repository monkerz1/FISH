import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AddStoreCTA() {
  return (
    <div className="w-full bg-gradient-to-r from-primary to-blue-600 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
          Know a fish store we missed?
        </h2>
        <p className="mb-6 text-lg text-blue-100">
          Help build the most comprehensive directory of local fish stores.
        </p>
        <Link href="/add-store">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-gray-50"
          >
            Add It Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
