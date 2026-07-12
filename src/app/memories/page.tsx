'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Loader, Camera, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { useLanguage } from '@/contexts/LanguageContext'
import { getEditions, getMediaByEdition } from '@/lib/data-service'
import type { Edition, MemoryMedia } from '@/lib/types'

export default function MemoriesPage() {
  const { t } = useLanguage()
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return
    if (e.key === 'Escape') setLightboxIndex(null)
    if (e.key === 'ArrowLeft') {
      setLightboxIndex(lightboxIndex === 0 ? currentMedia.length - 1 : lightboxIndex - 1)
    }
    if (e.key === 'ArrowRight') {
      setLightboxIndex(lightboxIndex === currentMedia.length - 1 ? 0 : lightboxIndex + 1)
    }
  }, [lightboxIndex, currentMedia.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getCoverImage = (editionId: string) => {
    const media = mediaMap[editionId] || []
    return media.find((m) => m.type === 'image') || media[0] || null
  }

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              {t('memories.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              {t('memories.pageSubtitle')}
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
                <p className="text-gsc-white/30 font-heading text-3xl">{t('memories.empty')}</p>
                <p className="text-gsc-white/20 text-sm mt-4">{t('memories.emptyDesc')}</p>
              </div>
            ) : (
              <>
                {/* Album covers grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-16">
                  {editions.map((ed) => {
                    const cover = getCoverImage(ed.id)
                    const count = mediaMap[ed.id]?.length || 0
                    const isActive = activeEdition === ed.id
                    return (
                      <button
                        key={ed.id}
                        onClick={() => setActiveEdition(ed.id)}
                        className={`group relative aspect-[4/5] overflow-hidden text-left transition-all duration-500 ${
                          isActive
                            ? 'ring-2 ring-gsc-red ring-offset-2 ring-offset-gsc-black shadow-lg shadow-gsc-red/20'
                            : 'ring-1 ring-gsc-gray/30 hover:ring-gsc-red/50'
                        }`}
                      >
                        {cover ? (
                          <Image
                            src={cover.url}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gsc-gray/30 flex items-center justify-center">
                            <Camera size={24} className="text-gsc-white/10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-2 right-2">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 ${
                            ed.type === 'basket' ? 'bg-gsc-red' : 'bg-gsc-orange'
                          } text-white`}>
                            {ed.type === 'basket' ? t('memories.badge.basket') : t('memories.badge.multisport')}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <span className="font-heading text-2xl sm:text-3xl text-gsc-white tracking-wider leading-none block">
                            {ed.year}
                          </span>
                          {count > 0 && (
                            <span className="text-[10px] text-gsc-white/40 mt-1 block">
                              {count} {count > 1 ? t('memories.photos') : t('memories.photo')}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Active album */}
                {currentEdition && currentMedia.length > 0 && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeEdition}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {/* Album header */}
                      <div className="mb-10 text-center">
                        <div className="w-16 h-1 bg-gsc-red mx-auto mb-6" />
                        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-gsc-white tracking-wider">
                          {currentEdition.title}
                        </h2>
                        <p className="text-sm text-gsc-white/40 mt-3">
                          {currentEdition.year} - {currentEdition.type === 'basket' ? t('memories.campBasket') : t('memories.multisport')}
                          <span className="ml-2">· {currentMedia.length} {currentMedia.length > 1 ? t('memories.photos') : t('memories.photo')}</span>
                        </p>
                      </div>

                      {/* Gallery grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {currentMedia.map((media, idx) => (
                          <button
                            key={media.id}
                            onClick={() => setLightboxIndex(idx)}
                            className="group aspect-square bg-gsc-gray/30 overflow-hidden relative"
                          >
                            {media.url ? (
                              media.type === 'image' ? (
                                <Image
                                  src={media.url}
                                  alt={media.alt || ''}
                                  fill
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              ) : (
                                <div className="w-full h-full relative">
                                  <Image
                                    src={media.thumbnail_url || media.url}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
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
                    </motion.div>
                  </AnimatePresence>
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
                <Image
                  src={currentMedia[lightboxIndex].url}
                  alt=""
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-[85vh] object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                  sizes="(max-width: 1200px) 100vw, 80vw"
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
