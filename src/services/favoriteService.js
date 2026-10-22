import { supabase, isSupabaseConfigured } from '../lib/supabase';

const getKey = (userId) => `pn_favs_${userId}`;

export const favoriteService = {
  getFavorites(userId) {
    if (!userId) return [];
    try {
      return JSON.parse(localStorage.getItem(getKey(userId)) || '[]');
    } catch {
      return [];
    }
  },

  async loadFromSupabase(userId) {
    if (!isSupabaseConfigured || !userId) return this.getFavorites(userId);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

      if (!error && data) {
        const ids = data.map((row) => row.property_id);
        localStorage.setItem(getKey(userId), JSON.stringify(ids));
        return ids;
      }
    } catch (err) {
      console.warn('Failed to load favorites from Supabase:', err);
    }
    return this.getFavorites(userId);
  },

  async toggle(userId, propertyId) {
    const favs = this.getFavorites(userId);
    const exists = favs.includes(propertyId);
    const updated = exists ? favs.filter((id) => id !== propertyId) : [...favs, propertyId];
    localStorage.setItem(getKey(userId), JSON.stringify(updated));

    if (isSupabaseConfigured && userId) {
      try {
        if (exists) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('property_id', propertyId);
        } else {
          await supabase
            .from('favorites')
            .insert([{ user_id: userId, property_id: propertyId }]);
        }
      } catch (err) {
        console.warn('Supabase toggle favorite error:', err);
      }
    }

    return { isFavorited: !exists, favorites: updated };
  },

  isFavorited(userId, propertyId) {
    return this.getFavorites(userId).includes(propertyId);
  },
};
