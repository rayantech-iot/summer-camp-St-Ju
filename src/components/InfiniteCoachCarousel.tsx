'use client'

import Link from 'next/link'
import Image from 'next/image'
import { coaches } from '@/lib/data'

export default function InfiniteCoachCarousel() {
  const duplicated = [...coaches, ...coaches, ...coaches]

  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused]">
        {duplicated.map((coach, i) => (
          <Link
            key={`${coach.id}-${i}`}
            href="/coachs"
            className="group flex-shrink-0 w-[180px] sm:w-[220px]"
          >
            <div className="aspect-[3/4] bg-gsc-gray/40 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gsc-black/80 via-transparent to-transparent z-10 transition-opacity group-hover:opacity-70" />
              {coach.image_url ? (
                <Image
                  src={coach.image_url}
                  alt={coach.name}
                  fill
                  sizes="(max-width: 640px) 180px, 220px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gsc-gray/50 flex items-center justify-center text-gsc-white/10 font-heading text-5xl">
                  {coach.name.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <h3 className="font-heading text-lg text-gsc-white tracking-wider group-hover:text-gsc-red transition-colors">
                  {coach.name}
                </h3>
                <p className="text-xs text-gsc-white/50 mt-1 truncate">{coach.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
