import { useState } from 'react';
import { SearchBar } from '../search/SearchBar';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Building, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPULAR_TAGS_BN = [
  'সদর রোড, বরিশাল',
  'রূপাতলী',
  'বিএম কলেজ',
  'নতুন বাজার',
  'আলেকান্দা',
  'চৌমাথা',
  'ব্যান্ড রোড',
];

const POPULAR_TAGS_EN = [
  'Sadar Road, Barishal',
  'Rupatali',
  'BM College',
  'Natun Bazar',
  'Alekanda',
  'Choumatha',
  'Band Road',
];

export function Hero() {
  const navigate = useNavigate();
  const { filters, updateFilter, setSearchQuery } = useApp();
  const { t, isBn } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'All');

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    updateFilter('status', status);
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    navigate('/listings');
  };

  const popularTags = isBn ? POPULAR_TAGS_BN : POPULAR_TAGS_EN;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-gray-50 pt-8 pb-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles size={14} className="text-brand-600" />
            <span>{t('hero_tag')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t('hero_title_1')}{' '}
            <span className="text-brand-600 underline decoration-brand-200">
              {t('hero_title_highlight')}
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
            {t('hero_subtitle')}
          </p>

          {/* Quick status tabs + Search bar */}
          <div className="mt-8 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-2xl mx-auto">
            <div className="flex gap-2 mb-3 px-1">
              {[
                { label: t('tab_all'), value: 'All' },
                { label: t('tab_rent'), value: 'For Rent' },
                { label: t('tab_sale'), value: 'For Sale' },
              ].map((tab) => {
                const isActive = selectedStatus === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleStatusChange(tab.value)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <SearchBar
              placeholder={t('search_placeholder')}
              buttonText={t('search_btn')}
              autoNavigate={true}
              onSearch={() => {
                updateFilter('status', selectedStatus);
              }}
            />

            {/* Popular Searches for Barishal */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs text-gray-500 text-left px-1">
              <span className="font-semibold text-gray-400 flex items-center gap-1 mr-1">
                <MapPin size={12} className="text-brand-500" /> {t('popular_label')}
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-brand-50 hover:text-brand-700 text-gray-700 font-medium transition-colors border border-gray-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Value props */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-600 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-600" /> {t('prop_direct_owner')}
            </span>
            <span className="flex items-center gap-1.5">
              <Building size={16} className="text-brand-600" /> {t('prop_verified')}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-brand-600" /> {t('prop_privacy')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
