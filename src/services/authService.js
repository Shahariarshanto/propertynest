import { mockUsers } from '../data/mockUsers';

const SESSION_KEY = 'pn_session';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const sanitize = (user) => { const { password, ...safe } = user; return safe; };

export const authService = {
  getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  },

  async login({ email, password }) {
    await delay(250);
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const session = sanitize(user);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async signup({ name, email, password }) {
    await delay(300);
    if (mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    const newUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: '',
      showPhone: false,
      avatar: null,
      role: 'owner',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    mockUsers.push(newUser);
    const session = sanitize(newUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async logout() {
    sessionStorage.removeItem(SESSION_KEY);
  },
};
