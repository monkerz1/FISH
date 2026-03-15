import type { Metadata } from 'next'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Terms of Service | LFSDirectory',
  description: 'Terms of Service for LFSDirectory.com',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

        <div className="bg-white rounded-xl shadow p-8 space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using LFSDirectory.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Use of the Directory</h2>
            <p>LFSDirectory.com is a directory of local fish stores in the United States. Store information is provided for informational purposes only. We do not guarantee the accuracy, completeness, or current status of any listing.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. User Submissions</h2>
            <p>When you submit a store, review, or any other content, you grant LFSDirectory.com a non-exclusive, royalty-free license to display and use that content. You are responsible for ensuring your submissions are accurate and do not violate any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Store Claims</h2>
            <p>Store owners may claim their listing by verifying their identity. Submitting false claim information may result in removal of your listing. LFSDirectory.com reserves the right to approve or reject any claim at its discretion.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Reviews</h2>
            <p>Reviews submitted by users reflect their personal opinions. LFSDirectory.com does not endorse any review and reserves the right to remove reviews that are abusive, fraudulent, or otherwise inappropriate.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Intellectual Property</h2>
            <p>All content on LFSDirectory.com, including text, design, and code, is the property of LFSDirectory.com unless otherwise noted. You may not reproduce or redistribute any content without written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Disclaimer of Warranties</h2>
            <p>This site is provided "as is" without warranties of any kind. We do not guarantee that the site will be uninterrupted, error-free, or that store information is accurate or up to date.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Limitation of Liability</h2>
            <p>LFSDirectory.com shall not be liable for any damages arising from your use of the site or reliance on any store listing information.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Contact</h2>
            <p>For questions about these terms, please use our <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.</p>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
