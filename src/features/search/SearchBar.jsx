import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return deb;
}

export function SearchBar({
  placeholder = 'Search by location, title, amenities...',
  className = '',
  showButton = true,
  buttonText = 'Search',
  autoNavigate = true,
  onSearch,
}) {
  const { searchQuery, setSearchQuery } = useApp();
  const [input, setInput] = useState(searchQuery);
  const debounced = useDebounce(input, 300);
  const navigate = useNavigate();
  const location = useLocation();
  const isDirectSubmit = useRef(false);

  // Sync debounced input with context, but only when user is on /listings to allow live filtering
  useEffect(() => {
    if (location.pathname === '/listings' && !isDirectSubmit.current) {
      setSearchQuery(debounced);
    }
  }, [debounced, location.pathname, setSearchQuery]);

  // Sync local input if global searchQuery was reset or changed externally
  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  const executeSearch = (query) => {
    isDirectSubmit.current = true;
    const trimmed = (query ?? input).trim();
    setSearchQuery(trimmed);

    if (onSearch) {
      onSearch(trimmed);
    }

    if (autoNavigate && location.pathname !== '/listings') {
      navigate('/listings');
    }

    // Reset flag after state settles
    setTimeout(() => {
      isDirectSubmit.current = false;
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(input);
  };

  const handleClear = () => {
    setInput('');
    setSearchQuery('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`relative flex items-center gap-2 ${className}`}
    >
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl pl-10 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm"
        />
        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {showButton && (
        <button
          type="submit"
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm rounded-xl sm:rounded-2xl transition-all shadow-sm shadow-brand-500/20 flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
        >
          <Search size={16} />
          <span className="hidden xs:inline sm:inline">{buttonText}</span>
        </button>
      )}
    </form>
  );
}
