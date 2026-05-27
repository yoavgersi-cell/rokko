'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { getFeaturedProviders } from '@/lib/data';

export default function FeaturedProviders() {
  const providers = getFeaturedProviders();

  return (
    <section className="py-20 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
              אנשים שאוהבים חיות
            </h2>
            <p className="text-[#6B7280]">
              כל מארח עבר אימות ויש לו ביקורות אמיתיות מבעלי חיות אחרים
            </p>
          </div>
          <Link
            href="/search"
            className="hidden sm:block text-[#2D7D5A] font-semibold text-sm hover:underline"
          >
            צפה בכולם ←
          </Link>
        </motion.div>

        {/* Grid — horizontal scroll on mobile */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 w-72 md:w-auto snap-start"
            >
              <Link href={`/providers/${provider.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-200">
                  {/* Image */}
                  <div className="relative h-56 w-full">
                    <Image
                      src={provider.images[0]}
                      alt={provider.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 288px, 25vw"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Verified Badge */}
                    {provider.verified && (
                      <div className="absolute top-3 left-3 bg-[#2D7D5A] text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        נבדק ידנית
                      </div>
                    )}

                    {/* Bottom info overlay */}
                    <div className="absolute bottom-0 right-0 left-0 p-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-white font-bold text-base">{provider.name}</p>
                          <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {provider.city}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-bold text-sm">{provider.rating}</span>
                          </div>
                          <p className="text-white/80 text-xs">({provider.reviewCount})</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {provider.services.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-[#E8F5EE] text-[#2D7D5A] font-medium px-2 py-0.5 rounded-full"
                        >
                          {s === 'boarding' ? 'לינה' :
                           s === 'sitting' ? 'שמירה' :
                           s === 'walking' ? 'טיול' :
                           s === 'daycare' ? 'מעון יום' :
                           s === 'grooming' ? 'טיפוח' :
                           s === 'training' ? 'אילוף' :
                           s === 'vet' ? 'וטרינר' : 'מונית'}
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-[#1A1A1A] text-sm">
                      ₪{provider.pricePerNight}
                      <span className="text-[#6B7280] font-normal text-xs"> / לילה</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-[#2D7D5A] font-semibold"
          >
            צפה בכל המארחים ←
          </Link>
        </div>
      </div>
    </section>
  );
}
