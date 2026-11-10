const getKey = (userId) => `pn_favs_${userId}`;

export const favoriteService = {
  getFavorites(userId) {
    if (!userId) return [];
    try { return JSON.parse(localStorage.getItem(getKey(userId)) || '[]'); }
    catch { return []; }
  },

  async loadFromSupabase(userId) {
    return this.getFavorites(userId);
  },

  async toggle(userId, propertyId) {
    const favs = this.getFavorites(userId);
    const exists = favs.includes(propertyId);
    const updated = exists ? favs.filter((id) => id !== propertyId) : [...favs, propertyId];
    localStorage.setItem(getKey(userId), JSON.stringify(updated));
    return { isFavorited: !exists, favorites: updated };
  },

  isFavorited(userId, propertyId) {
    return this.getFavorites(userId).includes(propertyId);
  },
};
