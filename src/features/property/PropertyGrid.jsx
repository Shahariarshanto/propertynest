import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PropertyCard } from './PropertyCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { EmptyState } from '../../components/EmptyState';
import { RotateCcw } from 'lucide-react';

export function PropertyGrid({ properties, loading, emptyMessage }) {
  const { setIsPostModalOpen, searchQuery, filters, resetFilters, hasMore, loadMore } = useApp();
  const { isBn, formatNumber } = useLanguage();

  const isFiltering =
    Boolean(searchQuery) ||
    filters.type !== 'All' ||
    filters.status !== 'All' ||
    filters.beds !== 'Any' ||
    filters.location !== 'All' ||
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
        title={isBn ? 'কোনো প্রপার্টি পাওয়া যায়নি' : 'No matching properties'}
        description={
          isFiltering
            ? isBn
              ? 'আপনার সার্চ বা ফিল্টারের সাথে কোনো লিস্টিং মেলেনি। কীওয়ার্ড পরিবর্তন করুন অথবা ফিল্টার রিসেট করুন।'
              : "We couldn't find any listings matching your search or filters. Try adjusting your keywords or clearing filters."
            : emptyMessage || (isBn ? 'কোনো প্রপার্টি নেই' : 'No properties found')
        }
        action={
          isFiltering ? (
            <button
              onClick={resetFilters}
              className="btn-brand flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>{isBn ? 'সার্চ ও ফিল্টার রিসেট করুন' : 'Reset Search & Filters'}</span>
            </button>
          ) : (
            <button onClick={() => setIsPostModalOpen(true)} className="btn-brand">
              {isBn ? 'প্রপার্টি পোস্ট করুন' : 'Post a Property'}
            </button>
          )
        }
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {properties.map(p => <PropertyCard key={p.id} property={p} />)}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
          >
            {isBn ? 'আরও প্রপার্টি দেখুন' : 'Load More Properties'}
          </button>
        </div>
      )}
    </div>
  );
}
