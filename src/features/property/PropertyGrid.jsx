import { useApp } from '../../context/AppContext';
import { PropertyCard } from './PropertyCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { EmptyState } from '../../components/EmptyState';

export function PropertyGrid({ properties, loading, emptyMessage = 'No properties found' }) {
  const { setIsPostModalOpen } = useApp();

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
        title="No properties found"
        description={emptyMessage}
        action={
          <button onClick={() => setIsPostModalOpen(true)} className="btn-brand">
            Post a Property
          </button>
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
