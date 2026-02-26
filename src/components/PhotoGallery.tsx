'use client'

import { useState, useEffect, useCallback } from 'react'

function photoUrl(resourceName: string) {
  return `https://places.googleapis.com/v1/${resourceName}/media?maxWidthPx=1200&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
}

function photoThumbUrl(resourceName: string) {
  return `https://places.googleapis.com/v1/${resourceName}/media?maxWidthPx=400&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
}

export default function PhotoGallery({ photos }: { photos: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const validPhotos = photos.filter(p => p && p !== '__none').slice(0, 10)
  if (validPhotos.length === 0) return null

  const heroUrl = photoUrl(validPhotos[0])
  const thumbUrls = validPhotos.slice(1, 5).map(p => photoThumbUrl(p))

  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex(i => i === null ? null : (i - 1 + validPhotos.length) % validPhotos.length)
  }, [validPhotos.length])

  const next = useCallback(() => {
    setLightboxIndex(i => i === null ? null : (i + 1) % validPhotos.length)
  }, [validPhotos.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, prev, next])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  return (
    <>
      {/* Gallery */}
      <div className="rounded-t-2xl overflow-hidden">
        <div
          className="relative bg-slate-900 cursor-pointer"
          style={{ height: '380px' }}
          onClick={() => openLightbox(0)}
        >
          <img src={heroUrl} alt="Store photo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            📷 {validPhotos.length} photo{validPhotos.length > 1 ? 's' : ''} — click to view
          </div>
        </div>
        {thumbUrls.length > 0 && (
          <div className="flex gap-1 p-2 bg-slate-50">
            {thumbUrls.map((url, i) => (
              <div
                key={i}
                className="flex-1 rounded-lg overflow-hidden cursor-pointer relative group"
                style={{ height: '64px' }}
                onClick={() => openLightbox(i + 1)}
              >
                <img src={url} alt="" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                {/* Show "+N more" overlay on the last visible thumb if there are more photos */}
                {i === thumbUrls.length - 1 && validPhotos.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+{validPhotos.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all z-10"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-4 py-1.5 rounded-full">
            {lightboxIndex + 1} / {validPhotos.length}
          </div>

          {/* Prev button */}
          {validPhotos.length > 1 && (
            <button
              className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-all z-10"
              onClick={e => { e.stopPropagation(); prev() }}
            >
              ‹
            </button>
          )}

          {/* Main image */}
          <div
            className="max-w-5xl max-h-screen w-full px-20 flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={photoUrl(validPhotos[lightboxIndex])}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next button */}
          {validPhotos.length > 1 && (
            <button
              className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-all z-10"
              onClick={e => { e.stopPropagation(); next() }}
            >
              ›
            </button>
          )}

          {/* Thumbnail strip */}
          {validPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4">
              {validPhotos.map((p, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${i === lightboxIndex ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                >
                  <img src={photoThumbUrl(p)} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}