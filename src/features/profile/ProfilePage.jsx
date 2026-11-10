import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { useApp } from '../../context/AppContext';
import { ImageUploader } from '../../components/ImageUploader';
import { Save, Loader2, Phone, User, Edit3, ExternalLink } from 'lucide-react';

export function ProfilePage() {
  const { currentUser, setCurrentUser } = useAuth();
  const { properties, showToast, setEditingProperty, setActivePropertyId } = useApp();
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    phone: currentUser?.phone ?? '',
    showPhone: currentUser?.showPhone ?? false,
    avatar: currentUser?.avatar ?? '',
  });
  const [saving, setSaving] = useState(false);

  const myListings = properties.filter((p) => p.ownerId === currentUser?.id);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateProfile(currentUser.id, form);
      setCurrentUser(updated);
      showToast('Profile updated successfully! 🎉', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser)
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-400">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-2xl shadow-sm">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">Member since {currentUser.joinedAt}</p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <User size={16} className="text-brand-500" /> Edit Profile
        </h2>

        {/* Profile Avatar Upload */}
        <ImageUploader
          images={form.avatar ? [form.avatar] : []}
          onChange={(imgs) => setForm((p) => ({ ...p, avatar: imgs[0] || '' }))}
          maxImages={1}
          single={true}
          label="Profile Photo"
          helperText=""
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-10"
              placeholder="e.g. 01711-000000"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
        </div>

        {/* showPhone toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-700">Show phone to logged-in users</p>
            <p className="text-xs text-gray-400 mt-0.5">
              When enabled, logged-in visitors can reveal your number on your listings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, showPhone: !p.showPhone }))}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              form.showPhone ? 'bg-brand-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                form.showPhone ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button type="submit" disabled={saving} className="btn-brand">
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={15} /> Save Changes
            </>
          )}
        </button>
      </form>

      {/* My Listings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">My Listings ({myListings.length})</h2>
          <span className="text-xs text-gray-400">Click Modify to update details or photos</span>
        </div>
        {myListings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            You haven't posted any properties yet.
          </p>
        ) : (
          <div className="space-y-3">
            {myListings.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gray-50 hover:bg-gray-100/70 rounded-xl border border-gray-100 transition-colors"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  onClick={() => setActivePropertyId(p.id)}
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-16 h-14 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800 truncate hover:text-brand-600 transition-colors">
                        {p.title}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                          p.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {p.available ? '● Live' : '○ Rented'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{p.location}</p>
                    <p className="text-xs text-brand-600 font-bold mt-0.5">
                      ৳{Number(p.price).toLocaleString()}
                      {p.status === 'For Rent' ? '/mo' : ''}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setActivePropertyId(p.id)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                    title="View Property"
                  >
                    <ExternalLink size={13} />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProperty(p)}
                    className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors flex items-center gap-1.5"
                    title="Edit or Modify Listing"
                  >
                    <Edit3 size={13} />
                    <span>Modify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
