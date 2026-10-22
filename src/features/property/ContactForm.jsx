import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { AuthGuard } from '../auth/AuthGuard';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

/** Auth-gated contact / inquiry form inside PropertyModal */
export function ContactForm({ property }) {
  const { currentUser } = useAuth();
  const { showToast } = useApp();
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in "${property.title}". Please contact me.`,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700)); // simulate send
    setLoading(false);
    setSubmitted(true);
    showToast('Inquiry sent! The owner will contact you soon.', 'success');
  };

  return (
    <AuthGuard
      fallback={
        <div className="p-5 bg-gray-50 rounded-2xl text-center border border-gray-100">
          <p className="text-gray-500 text-sm mb-3">
            Please log in to contact the property owner.
          </p>
          <button
            onClick={() => {}}
            className="btn-brand text-sm px-6"
          >
            🔒 Login to Contact
          </button>
        </div>
      }
    >
      {submitted ? (
        <div className="p-5 bg-brand-50 border border-brand-100 rounded-2xl text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-semibold text-brand-700">Inquiry Sent!</p>
          <p className="text-sm text-brand-600 mt-1">The owner will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input required className="input-field text-sm py-2" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" required className="input-field text-sm py-2" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
            <input className="input-field text-sm py-2" value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
            <textarea rows={3} required className="input-field text-sm py-2 resize-none" value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
          </div>
          <button type="submit" disabled={loading} className="btn-brand w-full py-2.5">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Send size={15} /> Send Inquiry</>}
          </button>
        </form>
      )}
    </AuthGuard>
  );
}
