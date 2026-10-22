import { SearchBar } from '../search/SearchBar';
import { useApp } from '../../context/AppContext';
import { Building, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();
  const { updateFilter } = useApp();

  const handleQuickSearch = (status) => {
    updateFilter('status', status);
    navigate('/listings');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-gray-50 pt-8 pb-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/70 text-brand-800 text-xs font-semibold mb-6">
            <Sparkles size={14} className="text-brand-600" />
            <span>Modern Rental Experience in Bangladesh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Find a place you'll <span className="text-brand-600 underline decoration-brand-200">love to live</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Discover verified apartments, homes, studios, and shared spaces across Dhaka, Chittagong, Sylhet & more.
          </p>

          {/* Quick status tabs + Search bar */}
          <div className="mt-8 bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-xl mx-auto">
            <div className="flex gap-2 mb-2 px-1">
              <button
                onClick={() => handleQuickSearch('For Rent')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
              >
                For Rent
              </button>
              <button
                onClick={() => handleQuickSearch('For Sale')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                For Sale
              </button>
            </div>
            <SearchBar placeholder="Search by area (e.g. Gulshan, Mirpur, Sylhet)..." />
          </div>

          {/* Value props */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-600" /> Direct Owner Connection
            </span>
            <span className="flex items-center gap-1.5">
              <Building size={16} className="text-brand-600" /> Verified Listings
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-brand-600" /> Hidden Phone Privacy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
