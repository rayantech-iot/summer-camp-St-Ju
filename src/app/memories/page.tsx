'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Loader, Camera, Play } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { getEditions, getMediaByEdition } from '@/lib/data-service'
import type { Edition, MemoryMedia } from '@/lib/types'

export default function MemoriesPage() {
  const [editions, setEditions] = useState<Edition[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, MemoryMedia[]>>({})
  const [activeEdition, setActiveEdition] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const eds = await getEditions()
      setEditions(eds)
      if (eds.length > 0) {
        setActiveEdition(eds[0].id)
        const mm: Record<string, MemoryMedia[]> = {}
        for (const ed of eds) {
          mm[ed.id] = await getMediaByEdition(ed.id)
        }
        setMediaMap(mm)
      }
      setLoading(false)
    }
    load()
  }, [])

  const currentEdition = editions.find((e) => e.id === activeEdition)
  const currentMedia = mediaMap[activeEdition] || []

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              Memories
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              Les souvenirs de chaque édition, en photos et en vidéos.
            </p>
          </div>
        </section>

        <AnimatedSection className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="animate-spin text-gsc-red" size={32} />
              </div>
            ) : editions.length === 0 ? (
              <div className="text-center py-20">
                <Camera size={48} className="text-gsc-white/10 mx-auto mb-4" />
                <p className="text-gsc-white/30 font-heading text-3xl">Aucun souvenir pour le moment</p>
                <p className="text-gsc-white/20 text-sm mt-4">Les photos arrivent bientôt !</p>
              </div>
            ) : (
              <>
                {/* Éditions tabs */}
                <div className="flex flex-wrap gap-3 mb-16 justify-center">
                  {editions.map((ed) => {
                    const count = mediaMap[ed.id]?.length || 0
                    const isActive = activeEdition === ed.id
                    return (
                      <button
                        key={ed.id}
                        onClick={() => setActiveEdition(ed.id)}
                        className={`group relative px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                          isActive
                            ? 'bg-gsc-red text-white shadow-lg shadow-gsc-red/20'
                            : 'bg-gsc-gray/20 text-gsc-white/50 border border-gsc-gray/30 hover:border-gsc-red/40 hover:text-gsc-white'
                        }`}
                      >
                        <span>{ed.title || `${ed.year} ${ed.type === 'basket' ? 'Basket' : 'Multisport'}`}</span>
                        {count > 0 && (
                          <span className={`ml-2 text-xs ${isActive ? 'text-white/60' : 'text-gsc-white/30'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Album header */}
                {currentEdition && (
                  <div className="mb-12 text-center">
                    <div className="w-16 h-1 bg-gsc-red mx-auto mb-6" />
                    <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider">
                      {currentEdition.title}
                    </h2>
                    <p className="text-sm text-gsc-white/40 mt-3">
                      {currentEdition.year} - {currentEdition.type === 'basket' ? 'Camp Basket' : 'Multisport'}
                      {currentMedia.length > 0 && (
                        <span className="ml-2">· {currentMedia.length} {currentMedia.length > 1 ? 'photos' : 'photo'}</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Gallery grid */}
                {currentMedia.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gsc-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera size={28} className="text-gsc-white/20" />
                    </div>
                    <p className="text-gsc-white/30 text-sm">
                      Aucune photo dans cette édition pour le moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentMedia.map((media, idx) => (
                      <button
                        key={media.id}
                        onClick={() => setLightboxIndex(idx)}
                        className="group aspect-square bg-gsc-gray/30 overflow-hidden relative"
                      >
                        {media.url ? (
                          media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={media.alt || ''}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full relative">
                              <img
                                src={media.thumbnail_url || media.url}
                                alt=""
                                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-gsc-red/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play size={22} className="text-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full bg-gsc-gray/40 flex items-center justify-center text-gsc-white/10 font-heading text-4xl">
                            ?
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </AnimatedSection>

        {/* Lightbox */}
        {lightboxIndex !== null && currentMedia[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10 transition-colors"
            >
              <X size={32} />
            </button>
            {currentMedia.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex(lightboxIndex === 0 ? currentMedia.length - 1 : lightboxIndex - 1)}
                  className="absolute left-4 text-white/60 hover:text-white transition-colors z-10"
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  onClick={() => setLightboxIndex(lightboxIndex === currentMedia.length - 1 ? 0 : lightboxIndex + 1)}
                  className="absolute right-4 text-white/60 hover:text-white transition-colors z-10"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}
            <div className="max-w-5xl max-h-[85vh] flex items-center justify-center">
              {currentMedia[lightboxIndex].type === 'image' ? (
                <img
                  src={currentMedia[lightboxIndex].url}
                  alt=""
                  className="max-w-full max-h-[85vh] object-contain"
                />
              ) : (
                <video
                  src={currentMedia[lightboxIndex].url}
                  controls
                  className="max-w-full max-h-[85vh]"
                  autoPlay
                />
              )}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40 bg-black/60 px-3 py-1.5 rounded-full">
              {lightboxIndex + 1} / {currentMedia.length}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
