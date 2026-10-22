import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

/** Tabbed Login / Signup modal */
export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab,
    login, signup, authLoading, authError, clearError } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try { await login(loginForm); } catch { /* error shown via authError */ }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try { await signup(signupForm); } catch { /* error shown via authError */ }
  };

  const switchTab = (tab) => { setAuthModalTab(tab); clearError(); };

  return (
    <Modal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} size="sm">
      <div className="px-6 pb-6 pt-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
            <span className="text-white text-xl">🏡</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">PropertyNest</h2>
          <p className="text-sm text-gray-500">
            {authModalTab === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {['login', 'signup'].map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                authModalTab === tab
                  ? 'bg-white shadow text-brand-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Error */}
        {authError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {authError}
          </div>
        )}

        {/* Login Form */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required
                className="input-field"
                placeholder="your@email.com"
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} required
                  className="input-field pr-11"
                  placeholder="••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={authLoading} className="btn-brand w-full py-3 text-base">
              {authLoading ? <Loader2 size={18} className="animate-spin" /> : 'Log In'}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {authModalTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required className="input-field" placeholder="Your Name"
                value={signupForm.name}
                onChange={e => setSignupForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required className="input-field" placeholder="your@email.com"
                value={signupForm.email}
                onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required minLength={6}
                  className="input-field pr-11" placeholder="Min 6 characters"
                  value={signupForm.password}
                  onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={authLoading} className="btn-brand w-full py-3 text-base">
              {authLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>
        )}

        {/* Demo accounts */}
        <div className="mt-5 p-4 bg-brand-50 border border-brand-100 rounded-xl">
          <p className="text-xs font-semibold text-brand-700 mb-2">🧪 Demo Accounts</p>
          <div className="space-y-1">
            {[
              { email: 'owner@demo.com', label: 'Owner' },
              { email: 'renter@demo.com', label: 'Renter' },
              { email: 'karim@demo.com', label: 'Owner 2' },
            ].map(acc => (
              <button key={acc.email} onClick={() => {
                setLoginForm({ email: acc.email, password: 'demo123' });
                setAuthModalTab('login');
              }}
                className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-800 hover:underline w-full text-left">
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-brand-200">{acc.email}</span>
                <span className="text-gray-400">/ demo123</span>
                <span className="ml-auto text-brand-500 text-[10px]">{acc.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
