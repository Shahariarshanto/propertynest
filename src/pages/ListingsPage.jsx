import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../features/search/SearchBar';
import { FilterPanel } from '../features/search/FilterPanel';
import { PropertyGrid } from '../features/property/PropertyGrid';
import { SlidersHorizontal, X } from 'lucide-react';

export function ListingsPage() {
  const { filteredProperties, loading, filters } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Properties</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Showing {filteredProperties.length} available {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-sm text-gray-700 shadow-sm"
            >
              <SlidersHorizontal size={16} />
              <span>Filter Properties</span>
            </button>
          </div>

          <SearchBar className="max-w-xl" />

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
              properties={filteredProperties}
              loading={loading}
              emptyMessage="Try adjusting your search criteria or resetting filters to see more results."
            />
          </main>
        </div>

        {/* Mobile Filter Modal / Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
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
                  className="btn-brand w-full py-3"
                >
                  Show {filteredProperties.length} Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
