import { useApp } from '../../context/AppContext';
import { PropertyCard } from './PropertyCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { EmptyState } from '../../components/EmptyState';
import { RotateCcw } from 'lucide-react';

export function PropertyGrid({ properties, loading, emptyMessage = 'No properties found' }) {
  const { setIsPostModalOpen, searchQuery, filters, resetFilters } = useApp();

  const isFiltering =
    Boolean(searchQuery) ||
    filters.type !== 'All' ||
    filters.status !== 'All' ||
    filters.beds !== 'Any' ||
    filters.maxPrice < 15000000;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No matching properties"
        description={
          isFiltering
            ? `We couldn't find any listings matching your search or filters. Try adjusting your keywords or clearing filters.`
            : emptyMessage
        }
        action={
          isFiltering ? (
            <button
              onClick={resetFilters}
              className="btn-brand flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Reset Search & Filters</span>
            </button>
          ) : (
            <button onClick={() => setIsPostModalOpen(true)} className="btn-brand">
              Post a Property
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {properties.map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
  );
}
