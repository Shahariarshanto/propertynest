import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AuthGuard } from '../auth/AuthGuard';
import { CheckCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = ['Basic Info', 'Details', 'Amenities', 'Preview'];
const AMENITY_OPTIONS = ['Parking', 'AC', 'WiFi', 'Gym', 'Pool', 'Security', 'Generator', 'Garden', 'Elevator', 'Rooftop'];
const TYPES = ['Apartment', 'House', 'Studio', 'Room', 'Commercial'];
const FURNISHINGS = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];

const defaultForm = {
  title: '', type: 'Apartment', status: 'For Rent', location: '', price: '',
  beds: '1', baths: '1', area: '', floor: '1', furnishing: 'Semi-Furnished',
  amenities: [], images: [''], description: '',
};

function Step1({ form, setForm }) {
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input required className="input-field" placeholder="e.g. Modern 2BR Apartment in Gulshan"
          value={form.title} onChange={e => set('title', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select className="input-field" value={form.type} onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
            <option>For Rent</option><option>For Sale</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
        <input required className="input-field" placeholder="e.g. Gulshan, Dhaka"
          value={form.location} onChange={e => set('location', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (BDT{form.status === 'For Rent' ? '/month' : ''}) *
        </label>
        <input required type="number" min={0} className="input-field" placeholder="e.g. 35000"
          value={form.price} onChange={e => set('price', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea rows={3} required className="input-field resize-none"
          placeholder="Describe the property..."
          value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
    </div>
  );
}

function Step2({ form, setForm }) {
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select className="input-field" value={form.beds} onChange={e => set('beds', e.target.value)}>
            {['0','1','2','3','4','5'].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <select className="input-field" value={form.baths} onChange={e => set('baths', e.target.value)}>
            {['1','2','3','4'].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft) *</label>
          <input required type="number" min={50} className="input-field" placeholder="e.g. 1200"
            value={form.area} onChange={e => set('area', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
          <input type="number" min={0} className="input-field"
            value={form.floor} onChange={e => set('floor', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
        <select className="input-field" value={form.furnishing} onChange={e => set('furnishing', e.target.value)}>
          {FURNISHINGS.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );
}

function Step3({ form, setForm }) {
  const toggleAmenity = (a) => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }));
  const setImage = (i, v) => setForm(p => {
    const imgs = [...p.images]; imgs[i] = v; return { ...p, images: imgs };
  });
  const addImg = () => { if (form.images.length < 4) setForm(p => ({ ...p, images: [...p.images, ''] })); };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITY_OPTIONS.map(a => (
            <label key={a} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
              form.amenities.includes(a) ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)}
                className="accent-brand-500" />
              <span className="text-sm">{a}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (up to 4)</label>
        <div className="space-y-2">
          {form.images.map((img, i) => (
            <input key={i} type="url" className="input-field text-sm" placeholder={`Image ${i + 1} URL`}
              value={img} onChange={e => setImage(i, e.target.value)} />
          ))}
          {form.images.length < 4 && (
            <button type="button" onClick={addImg} className="text-sm text-brand-600 hover:underline">+ Add another image</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step4({ form }) {
  const formatPrice = (p, s) => `৳${Number(p).toLocaleString()}${s === 'For Rent' ? '/mo' : ''}`;
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Review your listing before submitting:</p>
      {form.images[0] && (
        <img src={form.images[0]} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
      )}
      <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-sm">
        <p><span className="text-gray-500">Title:</span> <span className="font-semibold">{form.title}</span></p>
        <p><span className="text-gray-500">Type:</span> {form.type} · {form.status}</p>
        <p><span className="text-gray-500">Location:</span> {form.location}</p>
        <p><span className="text-gray-500">Price:</span> <span className="text-brand-600 font-bold">{formatPrice(form.price, form.status)}</span></p>
        <p><span className="text-gray-500">Size:</span> {form.beds}BR · {form.baths}BA · {form.area}sqft · Floor {form.floor}</p>
        <p><span className="text-gray-500">Furnishing:</span> {form.furnishing}</p>
        {form.amenities.length > 0 && (
          <p><span className="text-gray-500">Amenities:</span> {form.amenities.join(', ')}</p>
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

  const reset = () => { setStep(0); setForm(defaultForm); setDone(false); };
  const close = () => { setIsPostModalOpen(false); reset(); };

  const validateStep = () => {
    if (step === 0) return form.title && form.location && form.price && form.description;
    if (step === 1) return form.area;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const data = {
      ...form,
      price: Number(form.price),
      beds: Number(form.beds),
      baths: Number(form.baths),
      area: Number(form.area),
      floor: Number(form.floor),
      images: form.images.filter(Boolean).length > 0
        ? form.images.filter(Boolean)
        : [`https://picsum.photos/seed/${Date.now()}/800/500`],
    };
    await addProperty(data);
    setSubmitting(false);
    setDone(true);
    showToast('Property listed successfully! 🎉');
  };

  const steps = [<Step1 form={form} setForm={setForm} />, <Step2 form={form} setForm={setForm} />, <Step3 form={form} setForm={setForm} />, <Step4 form={form} />];

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
            <p className="text-gray-500 text-sm mb-6">Your property is now live on PropertyNest.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={close} className="btn-brand px-6">Done</button>
              <button onClick={reset} className="btn-outline px-6">Post Another</button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                {STEPS.map((s, i) => (
                  <span key={s} className={`text-xs font-medium ${i <= step ? 'text-brand-600' : 'text-gray-300'}`}>{s}</span>
                ))}
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>

            {/* Step content */}
            <div className="mb-6">{steps[step]}</div>

            {/* Navigation */}
            <div className="flex justify-between gap-3">
              <button onClick={() => step > 0 ? setStep(s => s - 1) : close()}
                className="btn-ghost flex items-center gap-1">
                <ChevronLeft size={16} /> {step === 0 ? 'Cancel' : 'Back'}
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!validateStep()}
                  className="btn-brand flex items-center gap-1">
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="btn-brand">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : '🚀 Submit Listing'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
