import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const typeVariant = {
  Apartment: 'apartment',
  House: 'house',
  Studio: 'studio',
  Room: 'room',
  Commercial: 'commercial',
};

export function PropertyCard({ property }) {
  const { toggleFavorite, isFavorited, setActivePropertyId, showToast } = useApp();
  const { requireAuth } = useAuth();
  const { t, isBn, formatNumber } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const favorited = isFavorited(property.id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      const added = toggleFavorite(property.id);
      if (added !== false) {
        showToast(
          favorited
            ? isBn ? 'ফেভারিট থেকে সরানো হয়েছে' : 'Removed from favorites'
            : isBn ? 'ফেভারিটে যোগ করা হয়েছে' : 'Added to favorites',
          'success'
        );
      }
    });
  };

  const formatPrice = (price, status) => {
    const isRent = status === 'For Rent';
    if (price >= 100000) {
      const lakh = (price / 100000).toFixed(price % 100000 === 0 ? 0 : 1);
      return `৳${formatNumber(lakh)} ${isBn ? 'লাখ' : 'L'}${isRent ? t('per_month') : ''}`;
    }
    return `৳${formatNumber(price)}${isRent ? t('per_month') : ''}`;
  };

  const displayTitle = isBn && property.titleBn ? property.titleBn : property.title;
  const statusLabel =
    property.status === 'For Rent' ? (isBn ? 'ভাড়া' : 'For Rent') : (isBn ? 'বিক্রয়' : 'For Sale');

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
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-brand-50">
            🏠
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant={property.status === 'For Rent' ? 'rent' : 'sale'}>
            {statusLabel}
          </Badge>
          {property.featured && (
            <Badge variant="featured">★ {isBn ? 'ফিচার্ড' : 'Featured'}</Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          type="button"
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-xl shadow transition-all ${
            favorited ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500'
          }`}
          title="Save Property"
        >
          <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Badge variant={typeVariant[property.type] ?? 'default'}>
            {isBn
              ? property.type === 'Apartment'
                ? 'ফ্ল্যাট'
                : property.type === 'House'
                ? 'বাড়ি'
                : property.type === 'Room'
                ? 'মেস রুম'
                : property.type === 'Studio'
                ? 'স্টুডিও'
                : 'বাণিজ্যিক'
              : property.type}
          </Badge>

        </div>

        <h3 className="font-bold text-gray-900 mt-2 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
          {displayTitle}
        </h3>

        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <MapPin size={12} className="flex-shrink-0 text-brand-500" />
          <span className="truncate font-medium">{property.location}</span>
        </div>

        <p className="text-brand-700 font-extrabold text-base mt-2">
          {formatPrice(property.price, property.status)}
        </p>

        {/* Specs row */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mt-3">
          <span className="flex items-center gap-1 font-medium">
            <Bed size={13} className="text-gray-400" />
            {formatNumber(property.beds)} {t('beds')}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Bath size={13} className="text-gray-400" />
            {formatNumber(property.baths)} {t('baths')}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Maximize2 size={13} className="text-gray-400" />
            {formatNumber(property.area)} {t('sqft')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
