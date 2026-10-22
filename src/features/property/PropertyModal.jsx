import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { ImageGallery } from './ImageGallery';
import { PhoneReveal } from './PhoneReveal';
import { ContactForm } from './ContactForm';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { userService } from '../../services/userService';
import {
  MapPin, Bed, Bath, Maximize2, Star, Heart, Share2,
  MessageSquare, Calendar, Wifi, Car, Wind, Dumbbell,
  Shield, Zap, Waves, TreeDeciduous, Building2, Edit3
} from 'lucide-react';

const amenityIcons = {
  'WiFi': <Wifi size={14} />, 'Parking': <Car size={14} />, 'AC': <Wind size={14} />,
  'Gym': <Dumbbell size={14} />, 'Security': <Shield size={14} />, 'Generator': <Zap size={14} />,
  'Pool': <Waves size={14} />, 'Garden': <TreeDeciduous size={14} />, 'Elevator': <Building2 size={14} />,
};

const formatPrice = (price, status) => {
  if (price >= 100000) return `৳${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L${status === 'For Rent' ? '/mo' : ''}`;
  return `৳${price.toLocaleString()}${status === 'For Rent' ? '/mo' : ''}`;
};

export function PropertyModal() {
  const { activeProperty, setActivePropertyId, toggleFavorite, isFavorited, showToast, setEditingProperty } = useApp();
  const { requireAuth, currentUser } = useAuth();
  const { startChat } = useChat();

  if (!activeProperty) return null;
  const p = activeProperty;
  const owner = userService.getUserById(p.ownerId);
  const favorited = isFavorited(p.id);
  const isOwner = currentUser?.id === p.ownerId;

  const handleFavorite = () => {
    requireAuth(() => {
      toggleFavorite(p.id);
      showToast(favorited ? 'Removed from favorites' : 'Added to favorites');
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'info');
  };

  const handleChat = () => {
    requireAuth(() => {
      startChat(p.ownerId, p.id, p.title);
    });
  };

  return (
    <Modal isOpen={!!activeProperty} onClose={() => setActivePropertyId(null)} size="xl">
      <div className="overflow-y-auto max-h-[90vh]">
        {/* Gallery */}
        <ImageGallery images={p.images} title={p.title} />

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge variant={p.status === 'For Rent' ? 'rent' : 'sale'}>{p.status}</Badge>
                <Badge variant={p.type.toLowerCase()}>{p.type}</Badge>
                {p.featured && <Badge variant="featured">★ Featured</Badge>}
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">{p.title}</h2>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <MapPin size={14} className="text-brand-500 flex-shrink-0" />
                {p.location}
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {isOwner && (
                <button
                  onClick={() => {
                    setActivePropertyId(null);
                    setEditingProperty(p);
                  }}
                  className="p-2.5 rounded-xl border border-brand-200 text-brand-600 hover:bg-brand-50 transition-all"
                  title="Modify Listing"
                >
                  <Edit3 size={18} />
                </button>
              )}
              <button onClick={handleFavorite}
                className={`p-2.5 rounded-xl border transition-all ${favorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}>
                <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
              </button>
              <button onClick={handleShare}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-500 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center justify-between p-4 bg-brand-50 rounded-2xl">
            <div>
              <p className="text-2xl font-bold text-brand-600">{formatPrice(p.price, p.status)}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {p.furnishing} · Floor {p.floor}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(p.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{p.rating} ({p.reviews} reviews)</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {p.beds > 0 && (
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Bed size={18} className="text-brand-500 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-800">{p.beds}</p>
                <p className="text-xs text-gray-500">Bedroom{p.beds > 1 ? 's' : ''}</p>
              </div>
            )}
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Bath size={18} className="text-brand-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-800">{p.baths}</p>
              <p className="text-xs text-gray-500">Bathroom{p.baths > 1 ? 's' : ''}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Maximize2 size={18} className="text-brand-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-800">{p.area}</p>
              <p className="text-xs text-gray-500">sqft</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">About this property</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
          </div>

          {/* Amenities */}
          {p.amenities?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {p.amenities.map(am => (
                  <span key={am} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl text-xs font-medium">
                    {amenityIcons[am] ?? '✓'} {am}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          {owner && (
            <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm flex-shrink-0">
                {owner.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{owner.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={11} /> Listed {new Date(p.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <PhoneReveal ownerId={p.ownerId} />
            </div>
          )}

          {/* Chat button */}
          <button onClick={handleChat}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-brand-200 text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors">
            <MessageSquare size={18} />
            Chat with Owner
          </button>

          {/* Contact Form */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Send an Inquiry</h3>
            <ContactForm property={p} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
