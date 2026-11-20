import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Drawer } from '../Drawer';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, Search, Heart, Plus, User, LogOut, LogIn, Globe } from 'lucide-react';

export function MobileDrawer() {
  const { isMobileNavOpen, setIsMobileNavOpen, setIsPostModalOpen } = useApp();
  const { isLoggedIn, currentUser, logout, openAuthModal, requireAuth } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname, setIsMobileNavOpen]);

  const links = [
    { to: '/', icon: <Home size={20} />, label: t('nav_home') },
    { to: '/listings', icon: <Search size={20} />, label: t('nav_browse') },
    { to: '/favorites', icon: <Heart size={20} />, label: t('nav_saved') },
    ...(isLoggedIn ? [{ to: '/profile', icon: <User size={20} />, label: t('nav_profile') }] : []),
  ];

  return (
    <Drawer
      isOpen={isMobileNavOpen}
      onClose={() => setIsMobileNavOpen(false)}
      title="PropertyNest • বরিশাল"
      side="left"
      width="w-72"
    >
      <div className="flex flex-col h-full">
        {/* Language Switcher inside Mobile Drawer */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">ভাষা / Language:</span>
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-brand-700 shadow-sm"
          >
            <Globe size={14} className="text-brand-600" />
            <span>{lang === 'bn' ? 'English এ দেখুন' : 'বাংলায় দেখুন'}</span>
          </button>
        </div>

        <div className="flex-1 py-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-colors ${
                location.pathname === link.to
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={location.pathname === link.to ? 'text-brand-500' : 'text-gray-400'}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}

          <div className="px-4 py-3">
            <button
              onClick={() =>
                requireAuth(() => {
                  setIsMobileNavOpen(false);
                  setIsPostModalOpen(true);
                })
              }
              className="btn-brand w-full"
            >
              <Plus size={18} /> {t('nav_post')}
            </button>
          </div>
        </div>

        {/* Bottom: auth */}
        <div className="border-t border-gray-100 p-4">
          {isLoggedIn ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-2 py-2">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileNavOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 px-2 py-1 w-full"
              >
                <LogOut size={16} /> {t('nav_logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                openAuthModal('login');
                setIsMobileNavOpen(false);
              }}
              className="flex items-center gap-2 text-sm font-medium text-brand-600 px-2 py-1 w-full"
            >
              <LogIn size={16} /> {t('nav_login')}
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
