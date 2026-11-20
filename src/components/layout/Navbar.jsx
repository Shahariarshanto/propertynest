import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageSquare, Menu, Plus, User, LogOut, ChevronDown, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useChat } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

export function Navbar() {
  const { currentUser, isLoggedIn, logout, openAuthModal, requireAuth } = useAuth();
  const { favoriteIds, setIsFavDrawerOpen, setIsMobileNavOpen, setIsPostModalOpen } = useApp();
  const { unreadCount, setIsChatOpen } = useChat();
  const { t, lang, toggleLang } = useLanguage();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/listings', label: t('nav_browse') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
            title="Menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white text-sm">🏡</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900 text-lg leading-tight block">
                PropertyNest
              </span>
              <span className="text-[10px] text-brand-600 font-bold block -mt-1 tracking-tight">
                বরিশাল • বাংলাদেশ
              </span>
            </div>
          </Link>
        </div>

        {/* Center: nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                location.pathname === link.to
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: actions & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 hover:border-brand-300 bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-700 transition-all shadow-sm"
            title="ভাষা পরিবর্তন করুন / Switch Language"
          >
            <Globe size={14} className="text-brand-600" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Post Property */}
          <button
            onClick={() => requireAuth(() => setIsPostModalOpen(true))}
            className="hidden sm:flex btn-brand text-sm py-2 px-3 sm:px-4"
          >
            <Plus size={16} />
            <span className="hidden md:inline">{t('nav_post')}</span>
          </button>

          {/* Chat */}
          {isLoggedIn && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              title={t('nav_chat')}
            >
              <MessageSquare size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Favorites */}
          <button
            onClick={() => requireAuth(() => setIsFavDrawerOpen(true))}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            title={t('nav_saved')}
          >
            <Heart
              size={20}
              fill={favoriteIds.length > 0 ? '#ef4444' : 'none'}
              className={favoriteIds.length > 0 ? 'text-red-500' : ''}
            />
            {favoriteIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {favoriteIds.length}
              </span>
            )}
          </button>

          {/* User menu or login */}
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-700">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1.5 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <User size={15} /> {t('nav_profile')}
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <Heart size={15} /> {t('nav_saved')} ({favoriteIds.length})
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left font-medium"
                  >
                    <LogOut size={15} /> {t('nav_logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="btn-brand text-xs sm:text-sm py-2 px-3 sm:px-4"
            >
              {t('nav_login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
