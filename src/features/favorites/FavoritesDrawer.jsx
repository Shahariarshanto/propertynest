import { Drawer } from '../../components/Drawer';
import { EmptyState } from '../../components/EmptyState';
import { useApp } from '../../context/AppContext';
import { Heart, MapPin, X } from 'lucide-react';

const formatPrice = (price, status) => {
  if (price >= 100000) return `৳${(price / 100000).toFixed(0)}L${status === 'For Rent' ? '/mo' : ''}`;
  return `৳${price.toLocaleString()}${status === 'For Rent' ? '/mo' : ''}`;
};

export function FavoritesDrawer() {
  const { isFavDrawerOpen, setIsFavDrawerOpen, favoriteProperties, toggleFavorite, setActivePropertyId, showToast } = useApp();

  return (
    <Drawer
      isOpen={isFavDrawerOpen}
      onClose={() => setIsFavDrawerOpen(false)}
      title={`❤️ Saved (${favoriteProperties.length})`}
      side="right"
    >
      {favoriteProperties.length === 0 ? (
        <EmptyState
          icon="🤍"
          title="No saved properties"
          description="Tap the heart on any property to save it here."
          action={
            <button onClick={() => setIsFavDrawerOpen(false)} className="btn-brand">
              Browse Properties
            </button>
          }
        />
      ) : (
        <div className="divide-y divide-gray-50">
          {favoriteProperties.map(p => (
            <div key={p.id} className="flex gap-3 p-4 hover:bg-gray-50 transition-colors">
              <button
                className="flex-1 flex gap-3 text-left"
                onClick={() => { setActivePropertyId(p.id); setIsFavDrawerOpen(false); }}
              >
                <img
                  src={p.images[0]} alt={p.title}
                  className="w-16 h-14 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.style.display = 'none'; }}
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{p.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <MapPin size={10} className="text-brand-400" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  <p className="text-brand-600 font-bold text-sm mt-1">{formatPrice(p.price, p.status)}</p>
                </div>
              </button>
              <button
                onClick={() => { toggleFavorite(p.id); showToast('Removed from favorites'); }}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 self-start"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
