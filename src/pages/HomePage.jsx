import { Hero } from '../features/home/Hero';
import { CategoryPills } from '../features/home/CategoryPills';
import { FeaturedSection } from '../features/home/FeaturedSection';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PlusCircle, Search, MessageSquare, Shield } from 'lucide-react';

export function HomePage() {
  const { setIsPostModalOpen } = useApp();
  const { requireAuth } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <CategoryPills />
      <FeaturedSection />

      {/* How it works banner */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t('how_title')}
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-10">
            {t('how_subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-brand-50/50 border border-brand-100 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-4 shadow">
                <Search size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {t('how_step1_title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('how_step1_desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-earth-50/50 border border-earth-200/50 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-earth-600 text-white flex items-center justify-center mb-4 shadow">
                <MessageSquare size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {t('how_step2_title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('how_step2_desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/60 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center mb-4 shadow">
                <Shield size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {t('how_step3_title')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('how_step3_desc')}
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-12 bg-gradient-to-r from-brand-700 to-brand-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-brand-900/10">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-1">
                {t('cta_owner_title')}
              </h3>
              <p className="text-brand-100 text-sm max-w-lg">
                {t('cta_owner_desc')}
              </p>
            </div>
            <button
              onClick={() => requireAuth(() => setIsPostModalOpen(true))}
              className="px-6 py-3 rounded-xl bg-white text-brand-900 font-bold hover:bg-brand-50 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <PlusCircle size={18} />
              <span>{t('cta_post_btn')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
