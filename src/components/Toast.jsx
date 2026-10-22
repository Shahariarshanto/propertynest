import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} className="text-green-500" />,
  error:   <AlertCircle size={18} className="text-red-500" />,
  info:    <Info size={18} className="text-blue-500" />,
};

const styles = {
  success: 'bg-white border-green-200',
  error:   'bg-white border-red-200',
  info:    'bg-white border-blue-200',
};

export function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.message}
          className="fixed top-5 right-5 z-[100] max-w-sm"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border ${styles[toast.type ?? 'success']}`}>
            {icons[toast.type ?? 'success']}
            <p className="text-sm font-medium text-gray-800 flex-1">{toast.message}</p>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
