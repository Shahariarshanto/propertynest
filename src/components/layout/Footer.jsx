import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">🏡</span>
              </div>
              <span className="font-bold text-white text-lg">PropertyNest</span>
            </div>
            <p className="text-xs leading-relaxed">
              Find your perfect home. Browse, compare, and connect directly with property owners across Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Browse</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/listings" className="hover:text-white transition-colors">All Properties</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">Apartments</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">Family Houses</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">Studios & Rooms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account & Safety</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Saved Properties</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors text-brand-400 font-medium">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Popular Areas</h4>
            <ul className="space-y-2 text-xs">
              {['Gulshan, Dhaka', 'Dhanmondi, Dhaka', 'Uttara, Dhaka', 'Agrabad, Chittagong', 'Zindabazar, Sylhet'].map(city => (
                <li key={city}><Link to="/listings" className="hover:text-white transition-colors">{city}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 PropertyNest. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white text-gray-400 transition-colors underline">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <span>Built with React + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
