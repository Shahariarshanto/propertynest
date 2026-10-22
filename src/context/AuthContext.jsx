import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getSession());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const clearError = () => setAuthError('');

  const login = useCallback(async (creds) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const user = await authService.login(creds);
      setCurrentUser(user);
      setAuthModalOpen(false);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const signup = useCallback(async (data) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const user = await authService.signup(data);
      setCurrentUser(user);
      setAuthModalOpen(false);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  // Call this to trigger an auth-gated action
  const requireAuth = useCallback(
    (callback) => {
      if (currentUser) {
        callback();
      } else {
        setAuthModalTab('login');
        setAuthModalOpen(true);
      }
    },
    [currentUser]
  );

  const openAuthModal = useCallback((tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        authLoading,
        authError,
        clearError,
        login,
        signup,
        logout,
        requireAuth,
        openAuthModal,
        isLoggedIn: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
