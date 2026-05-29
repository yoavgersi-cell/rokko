'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import { Provider } from '@/lib/types';
import { SERVICES, DOG_SIZE_LABELS } from '@/lib/data';
import { cn } from '@/lib/utils';

const SERVICE_LABELS: Record<string, string> = {
  boarding: 'דוגסיטר',
  sitting: 'האוסיטינג',
  walking: 'דוגווקר',
  daycare: 'פנסיון',
  grooming: 'טיפוח',
  training: 'אילוף',
  vet: 'וטרינר',
  taxi: 'הסעות',
};

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  const whatsappUrl = `https://wa.me/${provider.whatsapp}?text=${encodeURIComponent('שלום, ראיתי את הפרופיל שלך ב-Rokko')}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-200 border border-[#E8E8E6]"
    >
      {/* Image Section */}
      <Link href={`/providers/${provider.id}`} className="block">
        <div className="relative h-52 w-full">
          <Image
            src={provider.images[0]}
            alt={`${provider.name} - ${provider.city}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Verified Badge */}
          {provider.verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#2D7D5A] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
              <CheckCircle className="w-3 h-3" />
              נבדק ידנית
            </div>
          )}

          {/* Distance badge */}
          {provider.distance && (
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg">
              {provider.distance}
            </div>
          )}

          {/* Provider Avatar - overlapping */}
          <div className="absolute -bottom-5 right-4 w-12 h-12 rounded-full border-3 border-white overflow-hidden shadow-md" style={{ borderWidth: 3 }}>
            <Image
              src={provider.avatar}
              alt={provider.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 pt-8">
        <Link href={`/providers/${provider.id}`} className="block">
          {/* Name + City */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-[#1A1A1A] text-base">{provider.name}</h3>
              <div className="flex items-center gap-1 text-[#6B7280] text-xs mt-0.5">
                <MapPin className="w-3 h-3" />
                {provider.city}, {provider.neighborhood}
              </div>
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 bg-[#FFF9E6] px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-[#1A1A1A] text-sm">{provider.rating}</span>
              <span className="text-[#6B7280] text-xs">({provider.reviewCount})</span>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {provider.services.map((s) => (
              <span
                key={s}
                className="text-xs bg-[#E8F5EE] text-[#2D7D5A] font-medium px-2 py-0.5 rounded-full"
              >
                {SERVICE_LABELS[s] || s}
              </span>
            ))}
          </div>

          {/* Dog Sizes */}
          <div className="flex flex-wrap gap-1 mb-3">
            {provider.dogSizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs bg-[#F5F5F3] text-[#6B7280] px-2 py-0.5 rounded-full"
              >
                {DOG_SIZE_LABELS[size].split(' ')[0]}
              </span>
            ))}
            {provider.dogSizes.length > 3 && (
              <span className="text-xs text-[#6B7280]">+{provider.dogSizes.length - 3}</span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[#6B7280] text-xs mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              מגיב {provider.responseTime}
            </div>
            {provider.repeatCustomers >= 80 && (
              <div className="flex items-center gap-1 text-[#2D7D5A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D7D5A]" />
                {provider.repeatCustomers}% לקוחות חוזרים
              </div>
            )}
          </div>
        </Link>

        {/* Price + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E8E6]">
          <div>
            <span className="text-xl font-black text-[#1A1A1A]">₪{provider.pricePerNight}</span>
            <span className="text-[#6B7280] text-xs"> / לילה</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/providers/${provider.id}`}
              className="px-3 py-2 rounded-xl border border-[#2D7D5A] text-[#2D7D5A] text-xs font-medium hover:bg-[#E8F5EE] transition-colors"
            >
              פרטים מלאים
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center hover:bg-[#20bd5b] transition-colors"
              aria-label="שלח הודעה בווטסאפ"
            >
              <MessageCircle className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
