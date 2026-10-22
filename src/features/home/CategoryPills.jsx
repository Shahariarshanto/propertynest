import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CATEGORIES = [
  { label: 'All', icon: '🏠', type: 'All' },
  { label: 'Apartments', icon: '🏢', type: 'Apartment' },
  { label: 'Houses', icon: '🏡', type: 'House' },
  { label: 'Studios', icon: '🛋️', type: 'Studio' },
  { label: 'Rooms / Shared', icon: '🛏️', type: 'Room' },
  { label: 'Commercial', icon: '🏬', type: 'Commercial' },
];

export function CategoryPills() {
  const navigate = useNavigate();
  const { filters, updateFilter } = useApp();

  const handleSelect = (type) => {
    updateFilter('type', type);
    navigate('/listings');
  };

  return (
    <section className="py-6 border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.type === cat.type;
            return (
              <button
                key={cat.type}
                onClick={() => handleSelect(cat.type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
