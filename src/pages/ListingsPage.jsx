import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { SearchBar } from '../features/search/SearchBar';
import { FilterPanel } from '../features/search/FilterPanel';
import { PropertyGrid } from '../features/property/PropertyGrid';
import { SlidersHorizontal, X } from 'lucide-react';

export function ListingsPage() {
  const { filteredProperties, paginatedProperties, loading, filters, searchQuery, setSearchQuery, updateFilter, resetFilters } = useApp();
  const { t, formatNumber, isBn } = useLanguage();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const hasActiveFilters =
    filters.type !== 'All' ||
    filters.status !== 'All' ||
    filters.beds !== 'Any' ||
    filters.location !== 'All' ||
    filters.maxPrice < 15000000;

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {t('listings_title')}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {t('showing_prefix')}
                <span className="font-bold text-brand-600">{formatNumber(filteredProperties.length)}</span>
                {t('showing_suffix')}
              </p>
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>{t('filter_btn')}</span>
            </button>
          </div>

          <SearchBar
            className="max-w-2xl"
            placeholder={isBn ? "বরিশালের এলাকা, প্রপার্টি বা সুযোগ-সুবিধা দিয়ে খুঁজুন..." : "Search by area, title, amenities (e.g. Sadar Road, Rupatali)..."}
            buttonText={t('search_btn')}
          />

          {/* Active Search & Filter Chips */}
          {(Boolean(searchQuery) || hasActiveFilters) && (
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              <span className="text-gray-400 font-semibold">{t('active_filters')}</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
                  {t('search_label')} "{searchQuery}"
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-brand-900"
                    title="Remove search"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {filters.location !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                  {filters.location}
                  <button
                    type="button"
                    onClick={() => updateFilter('location', 'All')}
                    className="hover:text-gray-900"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {filters.type !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                  {filters.type}
                  <button
                    type="button"
                    onClick={() => updateFilter('type', 'All')}
                    className="hover:text-gray-900"
                    title="Clear property type filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {filters.status !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                  {filters.status}
                  <button
                    type="button"
                    onClick={() => updateFilter('status', 'All')}
                    className="hover:text-gray-900"
                    title="Clear status filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {filters.beds !== 'Any' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                  {filters.beds} {t('beds')}
                  <button
                    type="button"
                    onClick={() => updateFilter('beds', 'Any')}
                    className="hover:text-gray-900"
                    title="Clear beds filter"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              {filters.maxPrice < 15000000 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-medium">
                  Max: ৳{formatNumber((filters.maxPrice / 100000).toFixed(0))} {isBn ? 'লাখ' : 'Lakh'}
                  <button
                    type="button"
                    onClick={() => updateFilter('maxPrice', 15000000)}
                    className="hover:text-gray-900"
                    title="Reset max price"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="text-brand-600 hover:text-brand-700 font-bold underline ml-1 cursor-pointer"
              >
                {t('clear_all')}
              </button>
            </div>
          )}

          {/* Compact filters bar for mobile/quick toggle */}
          <div className="lg:hidden">
            <FilterPanel compact />
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <FilterPanel />
          </aside>

          {/* Main Grid */}
          <main className="flex-1 min-w-0">
            <PropertyGrid
              properties={paginatedProperties}
              loading={loading}
              emptyMessage={t('empty_properties_desc')}
            />
          </main>
        </div>

        {/* Mobile Filter Modal / Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-lg text-gray-900">{t('filter_heading')}</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterPanel />
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="btn-brand w-full py-3 font-bold"
                >
                  {isBn ? `${formatNumber(filteredProperties.length)} টি প্রপার্টি দেখুন` : `Show ${filteredProperties.length} Results`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
