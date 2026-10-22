import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { propertyService } from '../services/propertyService';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { currentUser } = useAuth();

  // ── Properties ─────────────────────────────────────────────────────────────
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService.getAll().then((data) => {
      setProperties(data);
      setLoading(false);
    });
  }, []);

  // ── Search & Filters ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    status: 'All',
    minPrice: 0,
    maxPrice: 15000000,
    beds: 'Any',
    location: 'All',
    sortBy: 'newest',
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({
      type: 'All',
      status: 'All',
      minPrice: 0,
      maxPrice: 15000000,
      beds: 'Any',
      location: 'All',
      sortBy: 'newest',
    });
  }, []);

  const filteredProperties = useMemo(() => {
    let result = properties.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchType = filters.type === 'All' || p.type === filters.type;
      const matchStatus = filters.status === 'All' || p.status === filters.status;
      const matchPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      const matchBeds =
        filters.beds === 'Any' ||
        (filters.beds === '4+' ? p.beds >= 4 : p.beds === Number(filters.beds));
      const matchLocation =
        filters.location === 'All' || p.location.includes(filters.location);
      return matchQuery && matchType && matchStatus && matchPrice && matchBeds && matchLocation;
    });

    // Sort
    if (filters.sortBy === 'price_asc') result = result.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === 'price_desc') result = result.sort((a, b) => b.price - a.price);
    else if (filters.sortBy === 'rating') result = result.sort((a, b) => b.rating - a.rating);
    else result = result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));

    return result;
  }, [properties, searchQuery, filters]);

  // ── Favorites ──────────────────────────────────────────────────────────────
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (currentUser?.id) {
      favoriteService.loadFromSupabase(currentUser.id).then(setFavoriteIds);
    } else {
      setFavoriteIds([]);
    }
  }, [currentUser]);

  const toggleFavorite = useCallback(
    async (propertyId) => {
      if (!currentUser) return false;
      const { favorites } = await favoriteService.toggle(currentUser.id, propertyId);
      setFavoriteIds(favorites);
      return true;
    },
    [currentUser]
  );

  const isFavorited = useCallback(
    (propertyId) => favoriteIds.includes(propertyId),
    [favoriteIds]
  );

  const favoriteProperties = useMemo(
    () => properties.filter((p) => favoriteIds.includes(p.id)),
    [properties, favoriteIds]
  );

  // ── UI State ───────────────────────────────────────────────────────────────
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isFavDrawerOpen, setIsFavDrawerOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Add & Update Property ───────────────────────────────────────────────────
  const addProperty = useCallback(
    async (data) => {
      if (!currentUser) return;
      const newProp = await propertyService.create(data, currentUser.id);
      setProperties((prev) => [newProp, ...prev]);
      return newProp;
    },
    [currentUser]
  );

  const updateProperty = useCallback(
    async (id, data) => {
      const updated = await propertyService.update(id, data);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
      return updated;
    },
    []
  );

  const activeProperty = useMemo(
    () => properties.find((p) => p.id === activePropertyId) ?? null,
    [properties, activePropertyId]
  );

  return (
    <AppContext.Provider
      value={{
        properties,
        filteredProperties,
        loading,
        searchQuery,
        setSearchQuery,
        filters,
        updateFilter,
        resetFilters,
        favoriteIds,
        favoriteProperties,
        toggleFavorite,
        isFavorited,
        activePropertyId,
        setActivePropertyId,
        activeProperty,
        editingProperty,
        setEditingProperty,
        isPostModalOpen,
        setIsPostModalOpen,
        isFavDrawerOpen,
        setIsFavDrawerOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,
        toast,
        showToast,
        addProperty,
        updateProperty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
