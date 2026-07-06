'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react'
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
        setActiveEdition(`${eds[0].year}-${eds[0].type}`)
        const mm: Record<string, MemoryMedia[]> = {}
        for (const ed of eds) {
          mm[`${ed.year}-${ed.type}`] = await getMediaByEdition(ed.id)
        }
        setMediaMap(mm)
      }
      setLoading(false)
    }
    load()
  }, [])

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
                <p className="text-gsc-white/30 font-heading text-3xl">Aucun souvenir pour le moment</p>
                <p className="text-gsc-white/20 text-sm mt-4">Les photos arrivent bientôt !</p>
              </div>
            ) : (
              <>
                {/* Éditions tabs */}
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                  {editions.map((ed) => {
                    const key = `${ed.year}-${ed.type}`
                    const count = mediaMap[key]?.length || 0
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveEdition(key)}
                        className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${
                          activeEdition === key
                            ? 'bg-gsc-red text-white'
                            : 'bg-gsc-gray/30 text-gsc-white/60 hover:text-gsc-white border border-gsc-gray/30'
                        }`}
                      >
                        {ed.title || `${ed.year} ${ed.type === 'basket' ? 'Basket' : 'Multisport'}`}
                        {count > 0 && (
                          <span className="ml-2 text-xs opacity-60">({count})</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Gallery grid */}
                {currentMedia.length === 0 ? (
                  <p className="text-center text-gsc-white/30 text-sm py-12">
                    Aucune photo ou vidéo dans cette édition pour le moment.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {currentMedia.map((media, idx) => (
                      <button
                        key={media.id}
                        onClick={() => setLightboxIndex(idx)}
                        className="aspect-square bg-gsc-gray/30 overflow-hidden hover:opacity-80 transition-opacity group relative"
                      >
                        {media.url ? (
                          media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={media.alt || ''}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gsc-gray/40 flex items-center justify-center relative">
                              <img
                                src={media.thumbnail_url || media.url}
                                alt=""
                                className="w-full h-full object-cover opacity-60"
                                loading="lazy"
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-white text-4xl font-heading">
                                ▶
                              </span>
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full bg-gsc-gray/40 flex items-center justify-center text-gsc-white/10 font-heading text-4xl">
                            ?
                          </div>
                        )}
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
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            >
              <X size={32} />
            </button>
            <button
              onClick={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
              className="absolute left-4 text-white/80 hover:text-white disabled:opacity-30"
              disabled={lightboxIndex === 0}
            >
              <ChevronLeft size={40} />
            </button>
            <div className="max-w-4xl max-h-[80vh] flex items-center justify-center">
              {currentMedia[lightboxIndex].type === 'image' ? (
                <img
                  src={currentMedia[lightboxIndex].url}
                  alt=""
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={currentMedia[lightboxIndex].url}
                  controls
                  className="max-w-full max-h-[80vh]"
                  autoPlay
                />
              )}
            </div>
            <button
              onClick={() => setLightboxIndex(Math.min(currentMedia.length - 1, lightboxIndex + 1))}
              className="absolute right-4 text-white/80 hover:text-white disabled:opacity-30"
              disabled={lightboxIndex === currentMedia.length - 1}
            >
              <ChevronRight size={40} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40">
              {lightboxIndex + 1} / {currentMedia.length}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
