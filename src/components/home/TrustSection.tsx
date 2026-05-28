'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, PhoneCall, MessageCircle, Award } from 'lucide-react';

const ITEMS = [
  {
    Icon: ClipboardCheck,
    title: 'אימות אישי לכל פרופיל',
    text: 'כל פרופיל עובר בדיקה ידנית ואימות על ידי צוות Rokko לפני שהוא עולה לאוויר.',
  },
  {
    Icon: PhoneCall,
    title: 'אימות פרטים ויצירת קשר',
    text: 'אנחנו בודקים פרטי קשר, שירותים ותמונות כדי לוודא שהפרופיל אמיתי ורלוונטי.',
  },
  {
    Icon: MessageCircle,
    title: 'ביקורות אמיתיות מהקהילה',
    text: 'חוות דעת אמיתיות מבעלי חיות מחמד אחרים — כי אין תחליף לניסיון אישי.',
  },
  {
    Icon: Award,
    title: 'איכות לפני כמות',
    text: 'מעדיפים להוסיף פחות ספקים — אבל כאלה שבאמת היינו סומכים עליהם בעצמנו.',
  },
];

export default function TrustSection() {
  return (
    <section className="py-8 md:py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-5 md:mb-8"
        >
          <h2 className="text-xl md:text-3xl font-bold text-[#1A1A1A] mb-1">
            איך אנחנו בונים את האמון
          </h2>
          <p className="text-[#6B7280] text-sm">
            קהילה שנבנית על בסיס אנושי ואמיתי — לא אלגוריתמים
          </p>
        </motion.div>

        {/* 2-col on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {ITEMS.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
              className="bg-[#FAFAF8] border border-[#EFEFED] rounded-xl md:rounded-2xl p-4 text-right cursor-default"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#E8F5EE] flex items-center justify-center mb-2.5 md:mb-3.5">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#2D7D5A]" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-xs md:text-sm mb-1 leading-snug">{title}</h3>
              <p className="text-[#6B7280] text-[11px] md:text-xs leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
