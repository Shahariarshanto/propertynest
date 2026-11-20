import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { ImageGallery } from './ImageGallery';
import { PhoneReveal } from './PhoneReveal';

import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';
import { userService } from '../../services/userService';
import {
  MapPin, Bed, Bath, Maximize2, Heart, Share2,
  MessageSquare, Calendar, Wifi, Car, Wind, Dumbbell,
  Shield, Zap, Waves, TreeDeciduous, Building2, Edit3
} from 'lucide-react';

const amenityIcons = {
  WiFi: <Wifi size={14} />,
  Parking: <Car size={14} />,
  AC: <Wind size={14} />,
  Gym: <Dumbbell size={14} />,
  Security: <Shield size={14} />,
  Generator: <Zap size={14} />,
  Pool: <Waves size={14} />,
  Garden: <TreeDeciduous size={14} />,
  Elevator: <Building2 size={14} />,
};

const amenityBn = {
  WiFi: 'ওয়াইফাই',
  Parking: 'পার্কিং',
  AC: 'এসি',
  Gym: 'জিম',
  Security: 'নিরাপত্তা প্রহরী',
  Generator: 'জেনারেটর',
  Pool: 'সুইমিং পুল',
  Garden: 'বাগান',
  Elevator: 'লিফট',
  Rooftop: 'ছাদ বাগান',
  Riverview: 'নদী ভিউ',
  Balcony: 'বারান্দা',
  'Gas Line': 'গ্যাস লাইন',
};

export function PropertyModal() {
  const {
    activeProperty,
    setActivePropertyId,
    toggleFavorite,
    isFavorited,
    showToast,
    setEditingProperty,
  } = useApp();
  const { requireAuth, currentUser } = useAuth();
  const { startChat } = useChat();
  const { t, isBn, formatNumber } = useLanguage();

  if (!activeProperty) return null;
  const p = activeProperty;
  const owner = userService.getUserById(p.ownerId);
  const favorited = isFavorited(p.id);
  const isOwner = currentUser?.id === p.ownerId;

  const displayTitle = isBn && p.titleBn ? p.titleBn : p.title;

  const handleFavorite = () => {
    requireAuth(() => {
      toggleFavorite(p.id);
      showToast(
        favorited
          ? isBn ? 'ফেভারিট থেকে সরানো হয়েছে' : 'Removed from favorites'
          : isBn ? 'ফেভারিটে যোগ করা হয়েছে' : 'Added to favorites'
      );
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(isBn ? 'লিংক কপি করা হয়েছে!' : 'Link copied to clipboard!', 'info');
  };

  const handleChat = () => {
    requireAuth(() => {
      startChat(p.ownerId, p.id, displayTitle);
    });
  };

  const formatPrice = (price, status) => {
    const isRent = status === 'For Rent';
    if (price >= 100000) {
      const lakh = (price / 100000).toFixed(price % 100000 === 0 ? 0 : 1);
      return `৳${formatNumber(lakh)} ${isBn ? 'লাখ' : 'L'}${isRent ? t('per_month') : ''}`;
    }
    return `৳${formatNumber(price)}${isRent ? t('per_month') : ''}`;
  };

  const statusLabel =
    p.status === 'For Rent' ? (isBn ? 'ভাড়া' : 'For Rent') : (isBn ? 'বিক্রয়' : 'For Sale');

  return (
    <Modal isOpen={!!activeProperty} onClose={() => setActivePropertyId(null)} size="xl">
      <div className="overflow-y-auto max-h-[90vh]">
        {/* Gallery */}
        <ImageGallery images={p.images} title={displayTitle} />

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge variant={p.status === 'For Rent' ? 'rent' : 'sale'}>{statusLabel}</Badge>
                <Badge variant={p.type.toLowerCase()}>
                  {isBn
                    ? p.type === 'Apartment'
                      ? 'ফ্ল্যাট'
                      : p.type === 'House'
                      ? 'বাড়ি'
                      : p.type === 'Room'
                      ? 'মেস রুম'
                      : p.type === 'Studio'
                      ? 'স্টুডিও'
                      : 'বাণিজ্যিক'
                    : p.type}
                </Badge>
                {p.featured && (
                  <Badge variant="featured">★ {isBn ? 'ফিচার্ড' : 'Featured'}</Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">{displayTitle}</h2>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 font-medium">
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
                  className="p-2.5 rounded-xl border border-brand-200 text-brand-600 hover:bg-brand-50 transition-all shadow-sm"
                  title="Modify Listing"
                >
                  <Edit3 size={18} />
                </button>
              )}
              <button
                onClick={handleFavorite}
                className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                  favorited
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                }`}
                title="Favorite"
              >
                <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-500 transition-all shadow-sm"
                title="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center justify-between p-4 bg-brand-50 rounded-2xl">
            <div>
              <p className="text-2xl font-extrabold text-brand-700">
                {formatPrice(p.price, p.status)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {p.furnishing} · {isBn ? `${formatNumber(p.floor)} তলা` : `Floor ${p.floor}`}
              </p>
            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {p.beds > 0 && (
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Bed size={18} className="text-brand-500 mx-auto mb-1" />
                <p className="text-sm font-bold text-gray-800">{formatNumber(p.beds)}</p>
                <p className="text-xs text-gray-500 font-medium">{t('beds')}</p>
              </div>
            )}
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Bath size={18} className="text-brand-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-800">{formatNumber(p.baths)}</p>
              <p className="text-xs text-gray-500 font-medium">{t('baths')}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Maximize2 size={18} className="text-brand-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-800">{formatNumber(p.area)}</p>
              <p className="text-xs text-gray-500 font-medium">{t('sqft')}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">
              {isBn ? 'প্রপার্টি সম্পর্কে' : 'About this property'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              {p.description}
            </p>
          </div>

          {/* Amenities */}
          {p.amenities?.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">
                {isBn ? 'সুযোগ-সুবিধা' : 'Amenities'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {p.amenities.map((am) => (
                  <span
                    key={am}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl text-xs font-semibold"
                  >
                    {amenityIcons[am] ?? '✓'} {isBn ? (amenityBn[am] || am) : am}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          {owner && (
            <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm flex-shrink-0">
                {owner.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm">{owner.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Calendar size={11} /> {isBn ? 'লিস্টিং তারিখ' : 'Listed'}: {p.postedAt}
                </p>
              </div>
              <PhoneReveal ownerId={p.ownerId} />
            </div>
          )}

          {/* Chat button */}
          <button
            type="button"
            onClick={handleChat}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-brand-500 text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-sm"
          >
            <MessageSquare size={18} />
            <span>{t('modal_chat_btn')}</span>
          </button>

          {/* Contact Form */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">
              {isBn ? 'সরাসরি ইনকোয়ারি পাঠান' : 'Send an Inquiry'}
            </h3>
            <ContactForm property={p} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
