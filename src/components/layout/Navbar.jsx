import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageSquare, Menu, Plus, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useChat } from '../../context/ChatContext';

export function Navbar() {
  const { currentUser, isLoggedIn, logout, openAuthModal, requireAuth } = useAuth();
  const { favoriteIds, setIsFavDrawerOpen, setIsMobileNavOpen, setIsPostModalOpen } = useApp();
  const { unreadCount, setIsChatOpen } = useChat();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/listings', label: 'Browse' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-sm">🏡</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">PropertyNest</span>
          </Link>
        </div>

        {/* Center: nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                location.pathname === link.to
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Post Property */}
          <button
            onClick={() => requireAuth(() => setIsPostModalOpen(true))}
            className="hidden sm:flex btn-brand text-sm py-2 px-3 sm:px-4"
          >
            <Plus size={16} />
            <span className="hidden md:inline">Post Property</span>
          </button>

          {/* Chat */}
          {isLoggedIn && (
            <button onClick={() => setIsChatOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
              <MessageSquare size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Favorites */}
          <button onClick={() => requireAuth(() => setIsFavDrawerOpen(true))}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
            <Heart size={20} fill={favoriteIds.length > 0 ? '#ef4444' : 'none'} className={favoriteIds.length > 0 ? 'text-red-500' : ''} />
            {favoriteIds.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {favoriteIds.length}
              </span>
            )}
          </button>

          {/* User menu or login */}
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-700">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={15} /> My Profile
                  </Link>
                  <Link to="/favorites" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <Heart size={15} /> Saved ({favoriteIds.length})
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => openAuthModal('login')} className="btn-brand text-sm py-2 px-4">
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
