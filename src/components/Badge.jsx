/**
 * Reusable Badge component.
 * Usage: <Badge variant="rent">For Rent</Badge>
 */
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:    'bg-gray-100 text-gray-700',
    rent:       'bg-brand-100 text-brand-700',
    sale:       'bg-earth-100 text-earth-700',
    apartment:  'bg-blue-100 text-blue-700',
    house:      'bg-purple-100 text-purple-700',
    studio:     'bg-pink-100 text-pink-700',
    room:       'bg-orange-100 text-orange-700',
    commercial: 'bg-gray-100 text-gray-700',
    featured:   'bg-yellow-400 text-yellow-900',
    available:  'bg-green-100 text-green-700',
  };
  return (
    <span className={`badge ${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </span>
  );
}
