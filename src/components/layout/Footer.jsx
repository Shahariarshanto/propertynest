import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { isBn } = useLanguage();

  const barishalAreas = [
    { en: 'Sadar Road, Barishal', bn: 'সদর রোড, বরিশাল' },
    { en: 'Rupatali, Barishal', bn: 'রূপাতলী, বরিশাল' },
    { en: 'BM College Road, Barishal', bn: 'বিএম কলেজ রোড, বরিশাল' },
    { en: 'Natun Bazar, Barishal', bn: 'নতুন বাজার, বরিশাল' },
    { en: 'Alekanda, Barishal', bn: 'আলেকান্দা, বরিশাল' },
    { en: 'Band Road, Barishal', bn: 'ব্যান্ড রোড, বরিশাল' },
    { en: 'Choumatha, Barishal', bn: 'চৌমাথা, বরিশাল' },
  ];

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
              {isBn
                ? 'আপনার স্বপ্নের বাসা খুঁজুন। বরিশাল ও সারাদেশে সরাসরি মালিকের সাথে যোগাযোগ করুন।'
                : 'Find your perfect home. Browse, compare, and connect directly with property owners across Bangladesh.'}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              {isBn ? 'ব্রাউজ করুন' : 'Browse'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/listings" className="hover:text-white transition-colors">{isBn ? 'সব প্রপার্টি' : 'All Properties'}</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">{isBn ? 'ফ্ল্যাট / অ্যাপার্টমেন্ট' : 'Apartments'}</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">{isBn ? 'পরিবার বাড়ি' : 'Family Houses'}</Link></li>
              <li><Link to="/listings" className="hover:text-white transition-colors">{isBn ? 'স্টুডিও ও মেস রুম' : 'Studios & Rooms'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              {isBn ? 'অ্যাকাউন্ট ও নিরাপত্তা' : 'Account & Safety'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/profile" className="hover:text-white transition-colors">{isBn ? 'আমার প্রোফাইল' : 'My Profile'}</Link></li>
              <li><Link to="/favorites" className="hover:text-white transition-colors">{isBn ? 'সেভ করা প্রপার্টি' : 'Saved Properties'}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors text-brand-400 font-medium">{isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              {isBn ? 'বরিশালের জনপ্রিয় এলাকা' : 'Popular Areas'}
            </h4>
            <ul className="space-y-2 text-xs">
              {barishalAreas.map((area) => (
                <li key={area.en}>
                  <Link to="/listings" className="hover:text-white transition-colors">
                    {isBn ? area.bn : area.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 PropertyNest. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white text-gray-400 transition-colors underline">
              {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </Link>
            <span className="text-gray-600">•</span>
            <span>Built with React + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
