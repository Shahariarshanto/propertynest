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
              Find your perfect home. Browse, compare, and connect with property owners across Bangladesh.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Browse</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/listings" className="hover:text-white transition-colors">All Properties</Link></li>
              <li><Link to="/listings?type=Apartment" className="hover:text-white transition-colors">Apartments</Link></li>
              <li><Link to="/listings?type=House" className="hover:text-white transition-colors">Houses</Link></li>
              <li><Link to="/listings?type=Commercial" className="hover:text-white transition-colors">Commercial</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">Saved Properties</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Locations</h4>
            <ul className="space-y-2 text-xs">
              {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'].map(city => (
                <li key={city}><span className="hover:text-white transition-colors cursor-pointer">{city}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">© 2026 PropertyNest. All rights reserved.</p>
          <p className="text-xs">Built with React + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
