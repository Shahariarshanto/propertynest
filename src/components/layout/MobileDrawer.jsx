import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Drawer } from '../Drawer';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Home, Search, Heart, Plus, User, LogOut, LogIn } from 'lucide-react';

export function MobileDrawer() {
  const { isMobileNavOpen, setIsMobileNavOpen, setIsPostModalOpen } = useApp();
  const { isLoggedIn, currentUser, logout, openAuthModal, requireAuth } = useAuth();
  const location = useLocation();

  // Close on route change
  useEffect(() => { setIsMobileNavOpen(false); }, [location.pathname, setIsMobileNavOpen]);

  const links = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/listings', icon: <Search size={20} />, label: 'Browse Properties' },
    { to: '/favorites', icon: <Heart size={20} />, label: 'Saved Properties' },
    ...(isLoggedIn ? [{ to: '/profile', icon: <User size={20} />, label: 'My Profile' }] : []),
  ];

  return (
    <Drawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} title="PropertyNest" side="left" width="w-72">
      <div className="flex flex-col h-full">
        <div className="flex-1 py-2">
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
              <span className={location.pathname === link.to ? 'text-brand-500' : 'text-gray-400'}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}

          <div className="px-4 py-3">
            <button
              onClick={() => requireAuth(() => { setIsMobileNavOpen(false); setIsPostModalOpen(true); })}
              className="btn-brand w-full">
              <Plus size={18} /> Post Property
            </button>
          </div>
        </div>

        {/* Bottom: auth */}
        <div className="border-t border-gray-100 p-4">
          {isLoggedIn ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button onClick={() => { logout(); setIsMobileNavOpen(false); }}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 px-2 py-1 w-full">
                <LogOut size={16} /> Log Out
              </button>
            </div>
          ) : (
            <button onClick={() => { openAuthModal('login'); setIsMobileNavOpen(false); }}
              className="flex items-center gap-2 text-sm font-medium text-brand-600 px-2 py-1 w-full">
              <LogIn size={16} /> Log In / Sign Up
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
