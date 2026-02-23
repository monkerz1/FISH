import { AddStoreForm } from '@/components/add-store-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Add a Fish Store - LFS Directory',
  description: 'Submit a fish store to our directory. Help us grow our community of aquarium shops.',
};

export default function AddStorePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Add a Fish Store</h1>
          <p className="text-lg text-muted-foreground">
            Know a fish store we missed? Help us grow our directory by adding it for free.
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-lg border border-border bg-card shadow-sm p-6 sm:p-8">
          <AddStoreForm />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Have questions? <Link href="/contact" className="text-primary hover:underline">Contact us</Link></p>
        </div>
      </div>
    </main>
  );
}
