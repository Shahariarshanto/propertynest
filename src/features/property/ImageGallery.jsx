import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageGallery({ images = [], title = '' }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = (e) => { e?.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e?.stopPropagation(); setActive(i => (i + 1) % images.length); };

  if (!images.length) return (
    <div className="h-64 bg-brand-50 flex items-center justify-center rounded-t-2xl text-6xl">🏠</div>
  );

  return (
    <>
      {/* Main Image */}
      <div className="relative h-64 sm:h-80 bg-gray-100 cursor-zoom-in" onClick={() => setLightbox(true)}>
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${title} ${active + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            loading="lazy"
          />
        </AnimatePresence>
        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-xl hover:bg-black/60 transition">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-xl hover:bg-black/60 transition">
              <ChevronRight size={20} />
            </button>
          </>
        )}
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setActive(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white w-4' : 'bg-white/60'}`} />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 px-4 pt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === active ? 'border-brand-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-xl">
              <X size={24} />
            </button>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-xl">
              <ChevronLeft size={28} />
            </button>
            <img
              src={images[active]} alt={title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-xl">
              <ChevronRight size={28} />
            </button>
            <div className="absolute bottom-4 text-white/60 text-sm">{active + 1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
