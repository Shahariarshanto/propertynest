import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './features/profile/ProfilePage';

import { AuthModal } from './features/auth/AuthModal';
import { PropertyModal } from './features/property/PropertyModal';
import { EditPropertyModal } from './features/property/EditPropertyModal';
import { PostPropertyModal } from './features/post/PostPropertyModal';
import { ChatDrawer } from './features/chat/ChatDrawer';
import { FavoritesDrawer } from './features/favorites/FavoritesDrawer';

import { useApp } from './context/AppContext';

export default function App() {
  const { toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <Navbar />
      <MobileDrawer />

      {/* Pages */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal />
      <PropertyModal />
      <EditPropertyModal />
      <PostPropertyModal />
      <ChatDrawer />
      <FavoritesDrawer />

      {/* Notifications */}
      <Toast toast={toast} />
    </div>
  );
}
