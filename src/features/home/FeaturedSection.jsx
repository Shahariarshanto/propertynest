import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PropertyCard } from '../property/PropertyCard';
import { SkeletonCard } from '../../components/SkeletonCard';
import { ArrowRight, Flame } from 'lucide-react';

export function FeaturedSection() {
  const { properties, loading } = useApp();

  const featured = properties.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-earth-700 font-semibold text-xs tracking-wider uppercase mb-1">
              <Flame size={16} className="text-earth-600" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Listings</h2>
          </div>
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 group"
          >
            <span>View All</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid or Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
