import { mockUsers } from '../data/mockUsers';

const SESSION_KEY = 'pn_session';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const userService = {
  async getProfile(userId) {
    await delay(150);
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    const { password, ...safe } = user;
    return safe;
  },

  async updateProfile(userId, updates) {
    await delay(200);
    const idx = mockUsers.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    const { email, password, id, ...safeUpdates } = updates;
    Object.assign(mockUsers[idx], safeUpdates);
    const { password: _pw, ...session } = mockUsers[idx];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  getUserById(userId) {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },
};
