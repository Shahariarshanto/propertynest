import { SlidersHorizontal, RotateCcw, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export function FilterPanel({ compact = false }) {
  const { filters, updateFilter, resetFilters } = useApp();
  const { t, isBn, formatNumber } = useLanguage();

  const types = [
    { value: 'All', label: isBn ? 'সব ধরন' : 'All Types' },
    { value: 'Apartment', label: isBn ? 'ফ্ল্যাট / অ্যাপার্টমেন্ট' : 'Apartment' },
    { value: 'House', label: isBn ? 'বাড়ি / পরিবার' : 'Family House' },
    { value: 'Studio', label: isBn ? 'স্টুডিও' : 'Studio' },
    { value: 'Room', label: isBn ? 'ব্যাচেলর / মেস' : 'Room / Shared' },
    { value: 'Commercial', label: isBn ? 'বাণিজ্যিক স্পেস' : 'Commercial' },
  ];

  const statuses = [
    { value: 'All', label: isBn ? 'সব স্ট্যাটাস' : 'All Status' },
    { value: 'For Rent', label: isBn ? 'ভাড়ার জন্য' : 'For Rent' },
    { value: 'For Sale', label: isBn ? 'বিক্রির জন্য' : 'For Sale' },
  ];

  const locations = [
    { value: 'All', label: isBn ? 'সব এলাকা' : 'All Locations' },
    { value: 'Sadar Road', label: isBn ? 'সদর রোড, বরিশাল' : 'Sadar Road, Barishal' },
    { value: 'Rupatali', label: isBn ? 'রূপাতলী, বরিশাল' : 'Rupatali, Barishal' },
    { value: 'BM College', label: isBn ? 'বিএম কলেজ রোড, বরিশাল' : 'BM College Road, Barishal' },
    { value: 'Natun Bazar', label: isBn ? 'নতুন বাজার, বরিশাল' : 'Natun Bazar, Barishal' },
    { value: 'Alekanda', label: isBn ? 'আলেকান্দা, বরিশাল' : 'Alekanda, Barishal' },
    { value: 'Band Road', label: isBn ? 'ব্যান্ড রোড, বরিশাল' : 'Band Road, Barishal' },
    { value: 'Choumatha', label: isBn ? 'চৌমাথা, বরিশাল' : 'Choumatha, Barishal' },
    { value: 'Kashipur', label: isBn ? 'কাশীপুর, বরিশাল' : 'Kashipur, Barishal' },
    { value: 'C&B Road', label: isBn ? 'সিএন্ডবি রোড, বরিশাল' : 'C&B Road, Barishal' },
    { value: 'Dhaka', label: isBn ? 'ঢাকা' : 'Dhaka' },
    { value: 'Chittagong', label: isBn ? 'চট্টগ্রাম' : 'Chittagong' },
    { value: 'Sylhet', label: isBn ? 'সিলেট' : 'Sylhet' },
  ];

  const beds = [
    { value: 'Any', label: isBn ? 'যেকোনো বেড' : 'Any Beds' },
    { value: '1', label: isBn ? '১ বেড' : '1 Bed' },
    { value: '2', label: isBn ? '২ বেড' : '2 Beds' },
    { value: '3', label: isBn ? '৩ বেড' : '3 Beds' },
    { value: '4+', label: isBn ? '৪+ বেড' : '4+ Beds' },
  ];

  const sorts = [
    { value: 'newest', label: t('sort_newest') },
    { value: 'price_asc', label: t('sort_price_asc') },
    { value: 'price_desc', label: t('sort_price_desc') },
  ];

  const Select = ({ label, field, options }) => (
    <div>
      {!compact && (
        <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      )}
      <select
        value={filters[field]}
        onChange={(e) => updateFilter(field, e.target.value)}
        className="input-field text-xs sm:text-sm py-2 font-medium"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap scrollbar-none">
        <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
          <SlidersHorizontal size={16} />
        </div>

        {/* Location quick filter */}
        <select
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="flex-shrink-0 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-brand-50/50"
        >
          {locations.map((opt) => (
            <option key={opt.value} value={opt.value}>
              📍 {opt.label}
            </option>
          ))}
        </select>

        {/* Type quick filter */}
        <select
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="flex-shrink-0 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        >
          {types.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status quick filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="flex-shrink-0 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        >
          {statuses.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Beds quick filter */}
        <select
          value={filters.beds}
          onChange={(e) => updateFilter('beds', e.target.value)}
          className="flex-shrink-0 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        >
          {beds.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="flex-shrink-0 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        >
          {sorts.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600 font-bold px-2 whitespace-nowrap"
        >
          <RotateCcw size={13} /> {t('filter_reset')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-brand-600" /> {t('filter_heading')}
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-gray-400 hover:text-brand-600 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} /> {t('filter_reset')}
        </button>
      </div>

      {/* Barishal & Other Locations */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
          <MapPin size={13} className="text-brand-600" /> {isBn ? 'এলাকা (বরিশাল)' : 'Location'}
        </label>
        <select
          value={filters.location}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="input-field text-xs sm:text-sm py-2 font-medium bg-brand-50/30 border-brand-200"
        >
          {locations.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Select label={t('filter_type')} field="type" options={types} />
      <Select label={t('filter_status')} field="status" options={statuses} />
      <Select label={t('filter_beds')} field="beds" options={beds} />
      <Select label={t('filter_sort')} field="sortBy" options={sorts} />

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          {t('filter_price_max')}
        </label>
        <input
          type="range"
          min={0}
          max={15000000}
          step={10000}
          value={filters.maxPrice}
          onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1 font-medium">
          <span>৳০</span>
          <span className="text-brand-700 font-bold">
            ৳{formatNumber((filters.maxPrice / 100000).toFixed(0))} {isBn ? 'লাখ' : 'L'}
          </span>
          <span>৳{formatNumber(150)} {isBn ? 'লাখ' : 'L'}</span>
        </div>
      </div>
    </div>
  );
}
