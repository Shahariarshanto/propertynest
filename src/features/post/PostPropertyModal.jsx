import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AuthGuard } from '../auth/AuthGuard';
import { ImageUploader } from '../../components/ImageUploader';
import { CheckCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = ['Basic Info', 'Details', 'Amenities & Photos', 'Preview'];
const AMENITY_OPTIONS = [
  'Parking', 'AC', 'WiFi', 'Gym', 'Pool',
  'Security', 'Generator', 'Garden', 'Elevator', 'Rooftop'
];
const TYPES = ['Apartment', 'House', 'Studio', 'Room', 'Commercial'];
const FURNISHINGS = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];

const defaultForm = {
  title: '',
  type: 'Apartment',
  status: 'For Rent',
  location: '',
  price: '',
  beds: '1',
  baths: '1',
  area: '',
  floor: '1',
  furnishing: 'Semi-Furnished',
  amenities: [],
  images: [],
  description: '',
};

function Step1({ form, setForm }) {
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          required
          className="input-field"
          placeholder="e.g. Modern 2BR Apartment in Gulshan"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            className="input-field"
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            className="input-field"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            <option>For Rent</option>
            <option>For Sale</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
        <input
          required
          className="input-field"
          placeholder="e.g. Gulshan, Dhaka"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (BDT{form.status === 'For Rent' ? '/month' : ''}) *
        </label>
        <input
          required
          type="number"
          min={0}
          className="input-field"
          placeholder="e.g. 35000"
          value={form.price}
          onChange={(e) => set('price', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          rows={3}
          required
          className="input-field resize-none"
          placeholder="Describe the property..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>
    </div>
  );
}

function Step2({ form, setForm }) {
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            className="input-field"
            value={form.beds}
            onChange={(e) => set('beds', e.target.value)}
          >
            {['0', '1', '2', '3', '4', '5'].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <select
            className="input-field"
            value={form.baths}
            onChange={(e) => set('baths', e.target.value)}
          >
            {['1', '2', '3', '4'].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft) *</label>
          <input
            required
            type="number"
            min={50}
            className="input-field"
            placeholder="e.g. 1200"
            value={form.area}
            onChange={(e) => set('area', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={form.floor}
            onChange={(e) => set('floor', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
        <select
          className="input-field"
          value={form.furnishing}
          onChange={(e) => set('furnishing', e.target.value)}
        >
          {FURNISHINGS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Step3({ form, setForm }) {
  const toggleAmenity = (a) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <label
              key={a}
              className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                form.amenities.includes(a)
                  ? 'border-brand-500 bg-brand-50 text-brand-800 font-semibold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="accent-brand-500"
              />
              <span className="text-sm">{a}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <ImageUploader
          images={form.images}
          onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
          maxImages={5}
          label="Property Photos"
          helperText="Upload photos from your computer or phone (first photo will be the cover photo)"
        />
      </div>
    </div>
  );
}

function Step4({ form }) {
  const formatPrice = (p, s) =>
    `৳${Number(p).toLocaleString()}${s === 'For Rent' ? '/mo' : ''}`;
  const validImages = form.images.filter(Boolean);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Review your listing before submitting:</p>

      {validImages.length > 0 ? (
        <div className="space-y-2">
          <img
            src={validImages[0]}
            alt="Preview Cover"
            className="w-full h-48 object-cover rounded-2xl shadow-sm"
          />
          {validImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {validImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
          No photos uploaded (a default property photo will be assigned)
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-sm">
        <p>
          <span className="text-gray-500">Title:</span>{' '}
          <span className="font-semibold text-gray-900">{form.title}</span>
        </p>
        <p>
          <span className="text-gray-500">Type:</span> {form.type} · {form.status}
        </p>
        <p>
          <span className="text-gray-500">Location:</span> {form.location}
        </p>
        <p>
          <span className="text-gray-500">Price:</span>{' '}
          <span className="text-brand-600 font-bold">
            {formatPrice(form.price, form.status)}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Size:</span> {form.beds}BR · {form.baths}BA ·{' '}
          {form.area}sqft · Floor {form.floor}
        </p>
        <p>
          <span className="text-gray-500">Furnishing:</span> {form.furnishing}
        </p>
        {form.amenities.length > 0 && (
          <p>
            <span className="text-gray-500">Amenities:</span> {form.amenities.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}

export function PostPropertyModal() {
  const { isPostModalOpen, setIsPostModalOpen, addProperty, showToast } = useApp();
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setStep(0);
    setForm(defaultForm);
    setDone(false);
  };
  const close = () => {
    setIsPostModalOpen(false);
    reset();
  };

  const validateStep = () => {
    if (step === 0)
      return form.title && form.location && form.price && form.description;
    if (step === 1) return form.area;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const validImages = form.images.filter(Boolean);
      const data = {
        ...form,
        price: Number(form.price),
        beds: Number(form.beds),
        baths: Number(form.baths),
        area: Number(form.area),
        floor: Number(form.floor),
        images:
          validImages.length > 0
            ? validImages
            : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop'],
      };
      await addProperty(data);
      showToast('Property listed successfully! 🎉');
      setDone(true);
    } catch (err) {
      showToast(err.message || 'Failed to post property', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    <Step1 key="s1" form={form} setForm={setForm} />,
    <Step2 key="s2" form={form} setForm={setForm} />,
    <Step3 key="s3" form={form} setForm={setForm} />,
    <Step4 key="s4" form={form} />,
  ];

  return (
    <Modal isOpen={isPostModalOpen} onClose={close} title="Post Your Property" size="md">
      <div className="px-6 pb-6">
        {!isLoggedIn ? (
          <div className="py-8 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-gray-600 mb-4">Please log in to post a property</p>
            <AuthGuard />
          </div>
        ) : done ? (
          <div className="py-10 text-center">
            <CheckCircle size={56} className="text-brand-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Listed Successfully!</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your property is now live on PropertyNest with your uploaded photos.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={close} className="btn-brand px-6">
                Done
              </button>
              <button onClick={reset} className="btn-outline px-6">
                Post Another
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                {STEPS.map((s, i) => (
                  <span
                    key={s}
                    className={`text-xs font-medium ${
                      i <= step ? 'text-brand-600 font-semibold' : 'text-gray-300'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step content */}
            <div className="mb-6">{steps[step]}</div>

            {/* Navigation */}
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => (step > 0 ? setStep((s) => s - 1) : close())}
                className="btn-ghost flex items-center gap-1"
              >
                <ChevronLeft size={16} /> {step === 0 ? 'Cancel' : 'Back'}
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!validateStep()}
                  className="btn-brand flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-brand"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    '🚀 Submit Listing'
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
