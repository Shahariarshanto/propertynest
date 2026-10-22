import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockUsers } from '../data/mockUsers';

const SESSION_KEY = 'pn_session';

export const authService = {
  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  },

  async login({ email, password }) {
    // Check if it's one of the pre-configured demo accounts first
    const demoUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!error && data?.user) {
          // Fetch user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userSession = {
            id: data.user.id,
            email: data.user.email,
            name: profile?.name || data.user.user_metadata?.name || 'User',
            phone: profile?.phone || '',
            showPhone: profile?.show_phone ?? false,
            avatar: profile?.avatar_url || null,
            role: profile?.role || 'renter',
            joinedAt: profile?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          };

          sessionStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
          return userSession;
        }
      } catch (err) {
        console.warn('Supabase login error, checking demo accounts:', err.message);
      }
    }

    // Demo account fallback
    if (demoUser) {
      const session = sanitize(demoUser);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    }

    throw new Error('Invalid email or password');
  },

  async signup({ name, email, password }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: 'owner',
          },
        },
      });
      if (error) throw new Error(error.message);

      const userSession = {
        id: data.user.id,
        email: data.user.email,
        name: name.trim(),
        phone: '',
        showPhone: false,
        avatar: null,
        role: 'owner',
        joinedAt: new Date().toISOString().split('T')[0],
      };

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
      return userSession;
    }

    // Mock fallback
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
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(SESSION_KEY);
  },
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const sanitize = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, ...safe } = user;
  return safe;
};
