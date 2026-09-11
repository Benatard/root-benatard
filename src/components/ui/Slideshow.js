import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const FALLBACK_IMG = '/images/resource-placeholder.svg';

function SlideImage({ src, alt, onClick, className, onLoad }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <img
      src={failed ? FALLBACK_IMG : src}
      alt={alt || 'Photo'}
      loading="lazy"
      onClick={onClick}
      onLoad={(e) => onLoad && onLoad({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

const photoKey = (p) => ((p && (p.id || p.image)) || '').toString();

export default function Slideshow({
  photos = [],
  autoplayInterval = 5000,
  lightbox = true,
  thumbnails = true,
  dots = true,
  arrows = true,
  showCaption = true,
  slideClassName = 'aspect-video',
  className = '',
  onEmpty,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [ratios, setRatios] = useState({});
  const startX = useRef(null);
  const photosRef = useRef(photos);

  const list = useMemo(() => (Array.isArray(photos) ? photos : []), [photos]);

  const storeRatio = useCallback((source, dims) => {
    if (!source || !dims || !dims.width || !dims.height) return;
    const ratio = dims.width / dims.height;
    if (!Number.isFinite(ratio) || ratio <= 0) return;
    setRatios((prev) => (prev[source] === ratio ? prev : { ...prev, [source]: ratio }));
  }, []);

  useEffect(() => {
    photosRef.current = list;
  }, [list]);

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
    []
  );

  useEffect(() => {
    if (index >= list.length && list.length > 0) setIndex(list.length - 1);
    if (list.length === 0) setIndex(0);
  }, [index, list.length]);

  const next = useCallback(() => {
    if (!photosRef.current.length) return;
    setIndex((i) => (i + 1) % photosRef.current.length);
  }, []);

  const prev = useCallback(() => {
    if (!photosRef.current.length) return;
    setIndex((i) => (i - 1 + photosRef.current.length) % photosRef.current.length);
  }, []);

  const goTo = useCallback((i) => {
    if (!photosRef.current.length) return;
    setIndex(((i % photosRef.current.length) + photosRef.current.length) % photosRef.current.length);
  }, []);

  useEffect(() => {
    if (prefersReduced || paused || lightboxOpen || list.length <= 1) return;
    const id = setInterval(next, autoplayInterval);
    return () => clearInterval(id);
  }, [autoplayInterval, paused, lightboxOpen, prefersReduced, next, list.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, next, prev]);

  const handleKey = (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  const onPointerDown = (e) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    startX.current = null;
  };

  if (list.length === 0) {
    if (onEmpty) return onEmpty();
    return null;
  }

  const current = list[index] || list[0];
  const currentKey = photoKey(current);
  const currentRatio = current ? ratios[currentKey] : null;

  const renderNavLegends = (extra) => (
    <div className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:px-5 z-20 pointer-events-none ${extra}`}>
      {arrows && list.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Photo précédente"
            className="pointer-events-auto h-10 w-10 md:h-12 md:w-12 bg-white/85 dark:bg-gray-dark/85 text-dark dark:text-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Photo suivante"
            className="pointer-events-auto h-10 w-10 md:h-12 md:w-12 bg-white/85 dark:bg-gray-dark/85 text-dark dark:text-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-lg"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );

  const renderDots = (extra) =>
    dots && list.length > 1 ? (
      <div className={`flex items-center justify-center gap-2 z-20 ${extra}`}>
        {list.map((p, i) => (
          <button
            key={p.id || i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Aller à la photo ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-primary' : 'w-2.5 bg-stroke dark:bg-[#2C303B] hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    ) : null;

  const caption = current && (current.title || current.caption);

  return (
    <div
      className={`slideshow-root ${className}`}
      tabIndex={0}
      onKeyDown={handleKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`relative overflow-hidden ${slideClassName} bg-gray2 dark:bg-[#2C303B]`}
        style={{
          touchAction: 'pan-y',
          ...(currentRatio ? { aspectRatio: currentRatio } : {}),
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          startX.current = null;
        }}
      >
        {list.map((p, i) => (
          <div
            key={p.id || i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <button
              type="button"
              onClick={() => lightbox && setLightboxOpen(true)}
              className="w-full h-full cursor-pointer focus:outline-none"
              aria-label={`Agrandir ${p.title || 'la photo'}`}
            >
              <SlideImage
                    src={p.image}
                    alt={p.title}
                    onLoad={(dims) => storeRatio(photoKey(p), dims)}
                    className="w-full h-full object-contain"
                  />
            </button>
          </div>
        ))}

        {renderNavLegends('')}

        {list.length > 0 && (
          <div
            key={index}
            className="slideshow-progress absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-20 origin-left"
            style={{
              animation: `slideshow-progress ${autoplayInterval}ms linear both`,
              animationPlayState: paused || lightboxOpen ? 'paused' : 'running',
              visibility: autoplayInterval > 0 && !prefersReduced && list.length > 1 ? 'visible' : 'hidden',
            }}
          />
        )}

        {showCaption && caption && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-5 pb-4 pt-14 pointer-events-none">
            <span className="inline-block h-1 w-8 bg-primary mb-2.5" />
            {current.title && <h3 className="text-lg md:text-xl font-bold text-white">{current.title}</h3>}
            {current.caption && <p className="mt-1 text-sm text-white/85 leading-relaxed">{current.caption}</p>}
          </div>
        )}

        {list.length > 1 && (
          <span className="absolute top-3 right-3 z-20 bg-black/60 text-white text-xs font-semibold px-2.5 py-1">
            {index + 1} / {list.length}
          </span>
        )}
      </div>

      <div className="mt-4">{renderDots('')}</div>

      {thumbnails && list.length > 1 && (
        <div className="mt-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(list.length, 5)}, minmax(0, 1fr))` }}>
          {list.map((p, i) => (
            <button
              key={p.id || i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={p.title || `Photo ${i + 1}`}
              className={`relative overflow-hidden transition-all duration-300 ${
                i === index
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-gray-dark'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span
                className="block w-full"
                style={{ aspectRatio: '16/9' }}
              >
<SlideImage
                    src={p.image}
                    alt={p.title}
                    onLoad={(dims) => storeRatio(photoKey(p), dims)}
                    className="w-full h-full object-contain"
                  />
              </span>
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && list.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer la visionneuse"
            className="absolute top-4 right-4 md:top-6 md:right-6 h-11 w-11 bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center">
              <SlideImage
                src={current.image}
                alt={current.title}
                onLoad={(dims) => storeRatio(photoKey(current), dims)}
                className="max-w-full max-h-[75vh] w-auto h-auto object-contain mx-auto"
              />
              <span className="absolute top-3 right-3 z-20 bg-black/70 text-white text-xs font-semibold px-2.5 py-1">
                {index + 1} / {list.length}
              </span>
            </div>
            {showCaption && caption && (
              <div className="mt-4 text-center">
                {current.title && <h3 className="text-xl font-bold text-white">{current.title}</h3>}
                {current.caption && <p className="mt-1.5 text-sm text-white/80">{current.caption}</p>}
              </div>
            )}
            <div className="mt-5">
              {renderDots('')}
            </div>
          </div>

          {list.length > 1 && (
            <span className="absolute inset-y-0 left-4 md:left-8 right-auto flex items-center">
              <button
                type="button"
                onClick={prev}
                aria-label="Photo précédente"
                className="h-12 w-12 bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
            </span>
          )}
          {list.length > 1 && (
            <span className="absolute inset-y-0 right-4 md:right-8 flex items-center">
              <button
                type="button"
                onClick={next}
                aria-label="Photo suivante"
                className="h-12 w-12 bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}