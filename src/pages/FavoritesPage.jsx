import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { PropertyCard } from '../features/property/PropertyCard';
import { EmptyState } from '../components/EmptyState';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';

export function FavoritesPage() {
  const { favoriteProperties } = useApp();
  const { isLoggedIn, openAuthModal } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <EmptyState
          icon="🔒"
          title="Sign in to view saved properties"
          description="Keep track of your favorite apartments and houses across all your devices."
          action={
            <button onClick={() => openAuthModal('login')} className="btn-brand">
              Log In / Sign Up
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-red-50 text-red-500">
            <Heart size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Properties</h1>
            <p className="text-sm text-gray-500">
              You have {favoriteProperties.length} saved {favoriteProperties.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {favoriteProperties.length === 0 ? (
          <EmptyState
            icon="🤍"
            title="No favorites saved yet"
            description="Explore our available listings and click the heart icon on any property to save it here."
            action={
              <Link to="/listings" className="btn-brand inline-flex items-center gap-2">
                <Search size={16} />
                <span>Browse Listings</span>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
