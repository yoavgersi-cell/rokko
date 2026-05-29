'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, BedDouble, Home, Footprints, Clock, Stethoscope, Shield, Building2 } from 'lucide-react';

const CORE_SERVICES = [
  {
    id: 'boarding',
    label: 'דוגסיטר',
    tagline: 'יחס אישי בבית פרטי',
    description: 'חיית המחמד שלכם נשארת בבית של הדוגסיטר - לא כלוב, לא פנסיון. סביבה ביתית, יחס אישי, ומישהו שבאמת שם בשבילה.',
    photo: '/dogsitter-illustration.png',
    Icon: BedDouble,
    tag: 'לכלבים וחתולים',
    href: '/search?service=boarding',
    cta: 'מצאו בית חם לחיית המחמד שלכם',
  },
  {
    id: 'sitting',
    label: 'האוסיטינג',
    tagline: 'הדוגסיטר מגיע אליכם הביתה',
    description: 'חיית המחמד נשארת בסביבה המוכרת שלה. הדוגסיטר מגיע לבית שלכם - אוכל, שגרה, ושקט נפשי לשניכם.',
    photo: '/housesitting-illustration.png',
    Icon: Home,
    tag: 'לכלבים וחתולים',
    href: '/search?service=sitting',
    cta: 'מצאו האוסיטר',
  },
  {
    id: 'walking',
    label: 'דוגווקר',
    tagline: 'דוגווקר קבוע שהכלב שלכם מכיר ואוהב',
    description: 'טיולים יומיים עם דוגווקר מנוסה שמכיר את הכלב שלכם באמת. עדכונים מכל טיול - ואתם ראש שקט בעבודה.',
    photo: '/dogwalker-illustration.png',
    Icon: Footprints,
    tag: 'לכלבים',
    href: '/search?service=walking',
    cta: 'מצאו דוגווקר',
  },
  {
    id: 'visiting',
    label: 'ביקורי בית',
    tagline: 'האכלה, משחק ובדיקה - בזמן שאתם לא בבית',
    description: 'מישהו שמגיע לבקר, להאכיל ולוודא שהכל בסדר. מצוין לחתולים ולכלבים שמסתדרים לבד רוב היום.',
    photo: '/visiting-illustration.png',
    Icon: Clock,
    tag: 'לכלבים וחתולים',
    href: '/search?service=sitting',
    cta: 'מצאו מבקר בית',
  },
];

const ADDITIONAL_SERVICES = [
  {
    id: 'pension',
    label: 'פנסיון לכלבים',
    description: 'פנסיונים ומתחמי אירוח מקצועיים עם השגחה צמודה, פעילות ויחס אישי.',
    Icon: Building2,
    href: '/search?service=daycare',
    cta: 'מצאו פנסיון',
  },
  {
    id: 'vet-home',
    label: 'וטרינר עד הבית',
    description: 'וטרינרים שמגיעים אליכם. בלי הלחץ של הנסיעה, בלי המתנה בקליניקה.',
    Icon: Stethoscope,
    href: '/search?service=vet',
    cta: 'מצאו וטרינר',
  },
  {
    id: 'vet-clinic',
    label: 'וטרינרים',
    description: 'מרפאות שבעלי חיות ממליצים עליהן - שעות, מיקום ומומחיות. כולל חירום.',
    Icon: Stethoscope,
    href: '/search?service=vet',
    cta: 'מצאו קליניקה',
  },
  {
    id: 'insurance',
    label: 'ביטוח לחיות מחמד',
    description: 'מדריך ברור שיעזור לכם להבין מה הביטוח מכסה ומה לא.',
    Icon: Shield,
    href: '/search',
    cta: 'קראו עוד',
  },
];

export default function ServiceCards() {
  return (
    <section className="py-6 md:py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-6 md:mb-10"
        >
          <h2 className="text-xl md:text-3xl font-bold text-[#1A1A1A] mb-1">
            מה תמצאו ב-Rokko
          </h2>
          <p className="text-[#6B7280] text-sm">
            דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים - אנשים שאפשר לסמוך עליהם
          </p>
        </motion.div>

        {/* Core Services */}
        <div className="flex flex-col gap-4 md:gap-8 mb-8 md:mb-14">
          {CORE_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex flex-row items-start gap-3 md:gap-6"
            >
              {/* Mobile: compact square thumbnail */}
              <div className="relative md:hidden w-[92px] h-[92px] flex-shrink-0 rounded-xl overflow-hidden border border-black/10">
                <Image
                  src={service.photo}
                  alt={service.label}
                  fill
                  className="object-cover"
                  sizes="92px"
                />
              </div>

              {/* Desktop: large 4/3 image */}
              <div
                className="relative hidden md:block md:w-60 flex-shrink-0 rounded-2xl overflow-hidden border border-black/10"
                style={{ aspectRatio: '4/3' }}
              >
                <Image
                  src={service.photo}
                  alt={service.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="240px"
                />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 md:py-1">
                <div className="flex items-center gap-2 md:gap-3 mb-1">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
                    <service.Icon className="w-3 h-3 md:w-4 md:h-4 text-[#2D7D5A]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] text-base md:text-lg leading-tight">{service.label}</h3>
                </div>

                <p className="text-[#2D7D5A] text-[11px] md:text-xs font-semibold mb-1 mr-8 md:mr-11 leading-tight">
                  {service.tagline}
                </p>

                <p className="text-[#4B5563] text-xs md:text-sm leading-relaxed mb-2.5 md:mb-5 md:mr-11 line-clamp-2 md:line-clamp-none">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1.5 md:gap-2 text-[#2D7D5A] text-xs md:text-sm font-semibold md:border md:border-[#E8E8E6] md:text-[#1A1A1A] md:px-5 md:py-2.5 md:rounded-xl md:hover:bg-[#E8F5EE] md:hover:border-[#2D7D5A] md:hover:text-[#2D7D5A] transition-all duration-200"
                >
                  {service.cta}
                  <ArrowLeft className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="border-t border-[#E8E8E6] pt-6 md:pt-10 mb-4 md:mb-6"
        >
          <h3 className="text-base md:text-xl font-bold text-[#1A1A1A] mb-0.5">
            בריאות, טיפוח ושגרה
          </h3>
          <p className="text-[#6B7280] text-xs md:text-sm">
            עוד שירותים לבעלי חיות שרוצים להיות מוכנים לכל מצב
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {ADDITIONAL_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.07)', transition: { duration: 0.2 } }}
              className="bg-[#FAFAF8] border border-[#E8E8E6] rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col cursor-default"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white border border-[#E8E8E6] flex items-center justify-center mb-2.5 md:mb-3.5">
                <service.Icon className="w-4 h-4 md:w-5 md:h-5 text-[#2D7D5A]" strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-[#1A1A1A] text-sm mb-1 md:mb-1.5">{service.label}</h4>
              <p className="text-[#6B7280] text-xs leading-relaxed flex-1 mb-3">
                {service.description}
              </p>
              <Link
                href={service.href}
                className="inline-flex items-center gap-1 text-[#2D7D5A] text-xs font-semibold hover:underline"
              >
                {service.cta}
                <ArrowLeft className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
