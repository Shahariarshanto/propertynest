import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Maximize2, Star } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const typeVariant = {
  Apartment: 'apartment', House: 'house', Studio: 'studio',
  Room: 'room', Commercial: 'commercial',
};

export function PropertyCard({ property }) {
  const { toggleFavorite, isFavorited, setActivePropertyId, showToast } = useApp();
  const { requireAuth } = useAuth();
  const [imgError, setImgError] = useState(false);

  const favorited = isFavorited(property.id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      const added = toggleFavorite(property.id);
      if (added !== false) {
        showToast(favorited ? 'Removed from favorites' : 'Added to favorites', 'success');
      }
    });
  };

  const formatPrice = (price, status) => {
    if (price >= 100000)
      return `৳${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L${status === 'For Rent' ? '/mo' : ''}`;
    return `৳${price.toLocaleString()}${status === 'For Rent' ? '/mo' : ''}`;
  };

  return (
    <motion.div
      className="card cursor-pointer group hover:shadow-md transition-shadow"
      onClick={() => setActivePropertyId(property.id)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imgError ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-brand-50">🏠</div>
        )}
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant={property.status === 'For Rent' ? 'rent' : 'sale'}>
            {property.status}
          </Badge>
          {property.featured && <Badge variant="featured">★ Featured</Badge>}
        </div>
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-xl shadow transition-all ${
            favorited ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Badge variant={typeVariant[property.type] ?? 'default'}>{property.type}</Badge>
          <div className="flex items-center gap-1 text-xs text-amber-500 flex-shrink-0">
            <Star size={12} fill="currentColor" />
            <span className="font-semibold">{property.rating}</span>
            <span className="text-gray-400">({property.reviews})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mt-2 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <MapPin size={12} className="flex-shrink-0 text-brand-500" />
          <span className="truncate">{property.location}</span>
        </div>

        <p className="text-brand-600 font-bold text-base mt-2">
          {formatPrice(property.price, property.status)}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
          {property.beds > 0 && (
            <span className="flex items-center gap-1">
              <Bed size={13} className="text-brand-400" />
              {property.beds} Bed{property.beds > 1 ? 's' : ''}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath size={13} className="text-brand-400" />
            {property.baths} Bath{property.baths > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={13} className="text-brand-400" />
            {property.area} sqft
          </span>
        </div>
      </div>
    </motion.div>
  );
}
