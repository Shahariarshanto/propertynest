import { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { useApp } from '../../context/AppContext';
import { Loader2, Save, X, Plus } from 'lucide-react';

const TYPES = ['Apartment', 'House', 'Studio', 'Room', 'Commercial'];
const STATUSES = ['For Rent', 'For Sale'];
const FURNISHINGS = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
const AMENITY_OPTIONS = [
  'Parking', 'AC', 'WiFi', 'Gym', 'Pool',
  'Security', 'Generator', 'Garden', 'Elevator', 'Rooftop'
];

export function EditPropertyModal() {
  const { editingProperty, setEditingProperty, updateProperty, showToast } = useApp();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sync form state whenever editingProperty changes
  useEffect(() => {
    if (editingProperty) {
      setForm({
        title: editingProperty.title || '',
        type: editingProperty.type || 'Apartment',
        status: editingProperty.status || 'For Rent',
        location: editingProperty.location || '',
        price: editingProperty.price || '',
        beds: String(editingProperty.beds ?? '1'),
        baths: String(editingProperty.baths ?? '1'),
        area: String(editingProperty.area ?? ''),
        floor: String(editingProperty.floor ?? '1'),
        furnishing: editingProperty.furnishing || 'Semi-Furnished',
        amenities: editingProperty.amenities ? [...editingProperty.amenities] : [],
        images: editingProperty.images ? [...editingProperty.images] : [''],
        description: editingProperty.description || '',
        available: editingProperty.available ?? true,
      });
    } else {
      setForm(null);
    }
  }, [editingProperty]);

  if (!editingProperty || !form) return null;

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleAmenity = (item) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(item)
        ? p.amenities.filter((a) => a !== item)
        : [...p.amenities, item],
    }));
  };

  const handleImageChange = (index, value) => {
    setForm((p) => {
      const nextImages = [...p.images];
      nextImages[index] = value;
      return { ...p, images: nextImages };
    });
  };

  const addImageField = () => {
    if (form.images.length < 5) {
      setForm((p) => ({ ...p, images: [...p.images, ''] }));
    }
  };

  const removeImageField = (index) => {
    setForm((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedData = {
        ...form,
        price: Number(form.price),
        beds: Number(form.beds),
        baths: Number(form.baths),
        area: Number(form.area),
        floor: Number(form.floor),
        images: form.images.filter(Boolean).length > 0
          ? form.images.filter(Boolean)
          : editingProperty.images,
      };

      await updateProperty(editingProperty.id, updatedData);
      showToast('Property updated successfully! 🎉', 'success');
      setEditingProperty(null);
    } catch (err) {
      showToast(err.message || 'Failed to update property', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={!!editingProperty}
      onClose={() => setEditingProperty(null)}
      title="Edit Property Listing"
      size="lg"
    >
      <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
        {/* Availability Status Banner */}
        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">Listing Status</p>
            <p className="text-xs text-gray-500">
              {form.available
                ? 'Active — visible to renters in search results'
                : 'Marked as Rented / Inactive — hidden from active listings'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setField('available', !form.available)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              form.available
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {form.available ? '● Live / Available' : '○ Rented / Inactive'}
          </button>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Basic Information
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              className="input-field text-sm"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Property Type</label>
              <select
                className="input-field text-sm"
                value={form.type}
                onChange={(e) => setField('type', e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                className="input-field text-sm"
                value={form.status}
                onChange={(e) => setField('status', e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price (BDT{form.status === 'For Rent' ? '/month' : ''}) *
              </label>
              <input
                type="number"
                required
                min={0}
                className="input-field text-sm"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              required
              className="input-field text-sm"
              value={form.location}
              onChange={(e) => setField('location', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              className="input-field text-sm resize-none"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>
        </div>

        {/* Property Specs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Specifications
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bedrooms</label>
              <select
                className="input-field text-sm"
                value={form.beds}
                onChange={(e) => setField('beds', e.target.value)}
              >
                {['0', '1', '2', '3', '4', '5'].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bathrooms</label>
              <select
                className="input-field text-sm"
                value={form.baths}
                onChange={(e) => setField('baths', e.target.value)}
              >
                {['1', '2', '3', '4'].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Area (sqft) *</label>
              <input
                type="number"
                required
                min={50}
                className="input-field text-sm"
                value={form.area}
                onChange={(e) => setField('area', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Floor</label>
              <input
                type="number"
                min={0}
                className="input-field text-sm"
                value={form.floor}
                onChange={(e) => setField('floor', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Furnishing</label>
            <select
              className="input-field text-sm"
              value={form.furnishing}
              onChange={(e) => setField('furnishing', e.target.value)}
            >
              {FURNISHINGS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Amenities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMENITY_OPTIONS.map((am) => (
              <label
                key={am}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  form.amenities.includes(am)
                    ? 'border-brand-500 bg-brand-50 font-semibold text-brand-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.amenities.includes(am)}
                  onChange={() => toggleAmenity(am)}
                  className="accent-brand-500"
                />
                <span>{am}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold text-gray-900">Photo URLs</h3>
            {form.images.length < 5 && (
              <button
                type="button"
                onClick={addImageField}
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-semibold"
              >
                <Plus size={14} /> Add photo
              </button>
            )}
          </div>

          <div className="space-y-2">
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder={`Photo ${i + 1} URL`}
                  className="input-field text-xs py-2 flex-1"
                  value={url}
                  onChange={(e) => handleImageChange(i, e.target.value)}
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(i)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
          <button
            type="button"
            onClick={() => setEditingProperty(null)}
            className="btn-ghost text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-brand text-sm px-6"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
