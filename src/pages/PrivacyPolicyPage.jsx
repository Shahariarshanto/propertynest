import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Mail, Shield, CheckCircle } from 'lucide-react';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-600 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="card p-6 sm:p-8 mb-8 border-brand-100 bg-gradient-to-br from-white via-white to-brand-50/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold mb-4">
            <ShieldCheck size={14} className="text-brand-600" />
            <span>PropertyNest Privacy Standard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
            At PropertyNest, we are dedicated to protecting your personal information and ensuring
            transparency about how your data is collected, protected, and used when discovering or listing properties.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span>Last Updated: November 10, 2026</span>
            <span>•</span>
            <span>Applicable across Bangladesh</span>
          </div>
        </div>

        {/* Key Privacy Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-5 border-gray-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Eye size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Phone Privacy Protection</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Owner phone numbers are hidden from unverified visitors and only revealed to authenticated users when permitted.
            </p>
          </div>

          <div className="card p-5 border-gray-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Lock size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">No Third-Party Brokers</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We never sell, rent, or trade your personal data to marketing agencies or third-party lead brokers.
            </p>
          </div>

          <div className="card p-5 border-gray-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Secure Media Hosting</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Photos uploaded for listings are processed securely and served over encrypted global CDN connections.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="card p-6 sm:p-8 space-y-8 text-gray-700 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">1</span>
              Information We Collect
            </h2>
            <p className="text-gray-600">
              When you use PropertyNest, we collect information necessary to provide a smooth, safe rental and listing experience:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>
                <strong>Account Information:</strong> Your full name, email address, password hash, and optional phone number when registering.
              </li>
              <li>
                <strong>Property Listing Details:</strong> Property title, location/address, rental or sale price, specs (bedrooms, bathrooms, square footage, floor), amenities, and photographs.
              </li>
              <li>
                <strong>Communications:</strong> Messages exchanged between renters and landlords via the PropertyNest in-app chat and inquiry forms.
              </li>
              <li>
                <strong>Saved Preferences:</strong> Favorite properties and customized filter searches stored for your account convenience.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">2</span>
              How We Use Your Information
            </h2>
            <p className="text-gray-600">
              We use the collected information solely for genuine platform operations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                'Enabling seamless search, filtering, and property browsing',
                'Connecting prospective tenants directly with verified landlords',
                'Preventing spam, fake listings, and duplicate content',
                'Allowing owners to manage and modify active listings',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle size={16} className="text-brand-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">3</span>
              Owner Phone Number Privacy
            </h2>
            <p className="text-gray-600">
              Unlike traditional classifieds where your phone number is indexed publicly across the web, PropertyNest provides dedicated privacy controls:
            </p>
            <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 space-y-2 text-xs text-brand-950">
              <p>
                <strong>Privacy by Default:</strong> Your phone number is hidden from unregistered web scrapers and casual visitors.
              </p>
              <p>
                <strong>Owner Choice:</strong> In your Profile settings, you can toggle whether authenticated, logged-in renters can reveal your number or if they must contact you via in-app messaging first.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">4</span>
              Image & Media Hosting
            </h2>
            <p className="text-gray-600">
              Photos uploaded for property listings and user avatars are hosted securely using cloud content delivery networks (CDNs).
              Uploaded media is public so that prospective renters can view photos of your listing. Please do not upload photos containing sensitive personal documents (such as NID cards, passports, or financial statements).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">5</span>
              Your Rights & Data Control
            </h2>
            <p className="text-gray-600">
              You maintain full control over your content on PropertyNest:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Update your profile details, name, or phone number anytime in your Profile.</li>
              <li>Edit, update pricing, or mark your listings as Rented / Inactive at any time.</li>
              <li>Delete your listings or request complete account removal by reaching out to support.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold">6</span>
              Contact Us Regarding Privacy
            </h2>
            <p className="text-gray-600">
              If you have any questions, feedback, or concerns regarding your privacy or data protection on PropertyNest, please contact our team:
            </p>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-brand-600">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">PropertyNest Privacy Team</p>
                <p className="text-xs text-brand-600 font-medium">privacy@propertynest.com • Dhaka, Bangladesh</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
