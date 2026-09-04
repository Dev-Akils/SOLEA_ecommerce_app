'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Privacy() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <main className="min-h-screen bg-[#3A0F14] text-[#EBDCC6] py-16 px-6 sm:px-10 lg:px-16 selection:bg-[#C4A77D] selection:text-[#3A0F14]">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-700/20 via-transparent to-black/80" />

      <div className="relative max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-[#EBDCC6]/60 hover:text-[#EBDCC6] transition-colors"
          >
            &larr; Back to Store
          </Link>
        </div>

        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#EBDCC6] drop-shadow-md">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-[#EBDCC6]/70">
            Last Updated: September 2026
          </p>
        </header>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl bg-[#24080B] p-1.5 border border-amber-900/30">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'privacy'
                  ? 'bg-gradient-to-r from-[#EBDCC6] via-[#D8BC93] to-[#C4A77D] text-[#3A0F14] shadow-md'
                  : 'text-[#EBDCC6]/70 hover:text-[#EBDCC6]'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'terms'
                  ? 'bg-gradient-to-r from-[#EBDCC6] via-[#D8BC93] to-[#C4A77D] text-[#3A0F14] shadow-md'
                  : 'text-[#EBDCC6]/70 hover:text-[#EBDCC6]'
              }`}
            >
              Terms & Conditions
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-[#24080B]/90 backdrop-blur-sm border border-amber-900/30 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-10 leading-relaxed text-[#EBDCC6]/85">
          {activeTab === 'privacy' ? (
            <article className="space-y-8">
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  1. Information We Collect
                </h2>
                <p className="text-sm">
                  When you visit our store, make a purchase, or create an account, we collect personal information including your name, shipping/billing address, email address, phone number, and payment details processed through encrypted payment gateways.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  2. How We Use Your Information
                </h2>
                <ul className="list-disc list-inside text-sm space-y-2 text-[#EBDCC6]/80">
                  <li>To fulfill, pack, and deliver orders accurately to your destination.</li>
                  <li>To send transactional updates, shipping tracking, and order receipts.</li>
                  <li>To prevent fraud, verify transactions, and secure customer accounts.</li>
                  <li>To improve website performance and user experience analytics.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  3. Cookies and Tracking
                </h2>
                <p className="text-sm">
                  We use cookies and local storage tokens to preserve your shopping cart sessions, remember preferences, and analyze site engagement. You can control or disable cookie settings via your browser preferences anytime.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  4. Data Sharing & Third Parties
                </h2>
                <p className="text-sm">
                  We do not sell, rent, or trade your personal data. Data is shared exclusively with essential fulfillment partners (logistics providers, payment processors) required to execute your purchase securely.
                </p>
              </section>
            </article>
          ) : (
            <article className="space-y-8">
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  1. Terms of Acceptance
                </h2>
                <p className="text-sm">
                  By accessing, browsing, or purchasing products from our store, you acknowledge and agree to be bound by these Terms and Conditions along with all applicable state and federal laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  2. Orders and Pricing
                </h2>
                <p className="text-sm">
                  All listed prices, discounts, and inventory availability are subject to change without prior notice. We reserve the right to decline, adjust, or cancel any order flagged for irregular purchasing behavior or pricing discrepancies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  3. Shipping, Returns & Exchanges
                </h2>
                <ul className="list-disc list-inside text-sm space-y-2 text-[#EBDCC6]/80">
                  <li>Items must be unworn, undamaged, and returned in their original packaging within 14 days of delivery.</li>
                  <li>Shipping timelines are estimates provided by postal services and may vary during high-demand promotional periods.</li>
                  <li>Clearance items marked as final sale are non-refundable.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#EBDCC6] mb-3">
                  4. Intellectual Property
                </h2>
                <p className="text-sm">
                  All graphics, typography, photography, branding marks, and layout designs presented on this website remain our exclusive intellectual property and cannot be reproduced without explicit written consent.
                </p>
              </section>
            </article>
          )}

          {/* Contact Support Section */}
          <div className="pt-8 border-t border-amber-900/30 text-xs text-[#EBDCC6]/60">
            Questions regarding our policies? Reach out to support at{' '}
            <a
              href="mailto:support@sneakers.com"
              className="text-[#EBDCC6] underline hover:text-amber-300"
            >
              support@sneakers.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}