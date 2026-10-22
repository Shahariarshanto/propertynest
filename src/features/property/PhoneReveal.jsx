import { useState } from 'react';
import { Phone, Eye, EyeOff } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

/** Shows/hides owner phone number based on login state and owner's showPhone setting */
export function PhoneReveal({ ownerId }) {
  const { isLoggedIn, openAuthModal } = useAuth();
  const [revealed, setRevealed] = useState(false);
  const owner = userService.getUserById(ownerId);

  if (!owner || !owner.showPhone) return null;

  const handleReveal = () => {
    if (!isLoggedIn) { openAuthModal('login'); return; }
    setRevealed(true);
  };

  if (revealed) {
    return (
      <a
        href={`tel:${owner.phone}`}
        className="flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-800 transition-colors"
      >
        <div className="p-2 bg-brand-50 rounded-xl">
          <Phone size={16} className="text-brand-600" />
        </div>
        {owner.phone}
      </a>
    );
  }

  return (
    <button onClick={handleReveal} className="flex items-center gap-2 btn-outline text-sm py-2">
      {isLoggedIn ? (
        <><Eye size={15} /> Show Phone Number</>
      ) : (
        <><EyeOff size={15} /> Login to see phone</>
      )}
    </button>
  );
}
