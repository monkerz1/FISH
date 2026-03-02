import Link from 'next/link';


export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">LFS Directory</h3>
            <p className="text-gray-600">
              Your guide to finding verified local fish stores across the USA.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#4A90D9]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/add-store" className="text-gray-600 hover:text-[#4A90D9]">
                  Add a Store
                </Link>
              </li>
              <li>
                <Link href="/claim" className="text-gray-600 hover:text-[#4A90D9]">
                  Claim Listing
                </Link>
              </li>
              <li>
                <Link href="/states" className="text-gray-600 hover:text-[#4A90D9]">
                  Browse by State
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Contact</h4>
            <ul className="space-y-2">

              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#4A90D9]">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} LFSDirectory.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
