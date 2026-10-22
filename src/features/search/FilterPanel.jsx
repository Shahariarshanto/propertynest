import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TYPES = ['All', 'Apartment', 'House', 'Studio', 'Room', 'Commercial'];
const STATUSES = ['All', 'For Rent', 'For Sale'];
const BEDS = ['Any', '1', '2', '3', '4+'];
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

export function FilterPanel({ compact = false }) {
  const { filters, updateFilter, resetFilters } = useApp();

  const Select = ({ label, field, options }) => (
    <div>
      {!compact && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
      <select
        value={filters[field]}
        onChange={e => updateFilter(field, e.target.value)}
        className="input-field text-sm py-2"
      >
        {options.map(opt => (
          <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
        <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
          <SlidersHorizontal size={16} />
        </div>
        {['type', 'status', 'beds', 'sortBy'].map(field => {
          const opts = field === 'type' ? TYPES : field === 'status' ? STATUSES : field === 'beds' ? BEDS : SORTS;
          return (
            <select key={field}
              value={filters[field]}
              onChange={e => updateFilter(field, e.target.value)}
              className="flex-shrink-0 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
              {opts.map(opt => (
                <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                  {typeof opt === 'string' ? (field === 'beds' && opt !== 'Any' ? `${opt} Bed${opt === '1' ? '' : 's'}` : opt) : opt.label}
                </option>
              ))}
            </select>
          );
        })}
        <button onClick={resetFilters} className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600 px-2">
          <RotateCcw size={13} /> Reset
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-brand-500" /> Filters
        </h3>
        <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-brand-600 flex items-center gap-1">
          <RotateCcw size={12} /> Reset
        </button>
      </div>
      <Select label="Property Type" field="type" options={TYPES} />
      <Select label="Status" field="status" options={STATUSES} />
      <Select label="Bedrooms" field="beds" options={BEDS} />
      <Select label="Sort By" field="sortBy" options={SORTS} />
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
        <input type="range" min={0} max={15000000} step={10000}
          value={filters.maxPrice}
          onChange={e => updateFilter('maxPrice', Number(e.target.value))}
          className="w-full accent-brand-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>৳0</span>
          <span className="text-brand-600 font-medium">৳{(filters.maxPrice / 100000).toFixed(0)}L</span>
          <span>৳150L</span>
        </div>
      </div>
    </div>
  );
}
