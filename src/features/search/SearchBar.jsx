import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return deb;
}

export function SearchBar({ placeholder = 'Search by location, title...', className = '' }) {
  const { searchQuery, setSearchQuery } = useApp();
  const [input, setInput] = useState(searchQuery);
  const debounced = useDebounce(input, 300);

  useEffect(() => { setSearchQuery(debounced); }, [debounced, setSearchQuery]);
  useEffect(() => { if (!searchQuery) setInput(''); }, [searchQuery]);

  return (
    <div className={`relative ${className}`}>
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-11 pr-10"
      />
      {input && (
        <button onClick={() => { setInput(''); setSearchQuery(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
