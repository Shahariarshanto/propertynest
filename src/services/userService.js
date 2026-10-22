import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockUsers } from '../data/mockUsers';

const SESSION_KEY = 'pn_session';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const profileCache = new Map();

export const userService = {
  async getProfile(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw new Error(error.message);

      const profile = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        showPhone: data.show_phone ?? false,
        avatar: data.avatar_url || null,
        role: data.role || 'renter',
        joinedAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      };
      profileCache.set(userId, profile);
      return profile;
    }

    await delay(150);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    // eslint-disable-next-line no-unused-vars
    const { password, ...safe } = user;
    return safe;
  },

  async updateProfile(userId, updates) {
    if (isSupabaseConfigured) {
      const dbUpdates = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.showPhone !== undefined) dbUpdates.show_phone = updates.showPhone;
      if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;

      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);

      const updated = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        showPhone: data.show_phone ?? false,
        avatar: data.avatar_url || null,
        role: data.role || 'renter',
        joinedAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      };

      profileCache.set(userId, updated);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    }

    await delay(200);
    const idx = mockUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    // eslint-disable-next-line no-unused-vars
    const { email, password, id, ...safeUpdates } = updates;
    Object.assign(mockUsers[idx], safeUpdates);
    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...session } = mockUsers[idx];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  getUserById(userId) {
    if (isSupabaseConfigured && profileCache.has(userId)) {
      return profileCache.get(userId);
    }
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return null;
    // eslint-disable-next-line no-unused-vars
    const { password, ...safe } = user;
    return safe;
  },
};
