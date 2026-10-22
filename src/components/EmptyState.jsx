/**
 * EmptyState component for empty lists, no results, etc.
 */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}
