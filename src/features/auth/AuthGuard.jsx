import { useAuth } from '../../context/AuthContext';

/**
 * AuthGuard: Renders children if logged in, otherwise renders fallback or a login prompt.
 *
 * @param {React.ReactNode} children - content to show when authenticated
 * @param {React.ReactNode} [fallback] - content to show when not authenticated
 */
export function AuthGuard({ children, fallback }) {
  const { isLoggedIn, openAuthModal } = useAuth();

  if (isLoggedIn) return children;

  return fallback ?? (
    <button
      onClick={() => openAuthModal('login')}
      className="btn-outline text-sm"
    >
      🔒 Login to continue
    </button>
  );
}
