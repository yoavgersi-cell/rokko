'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: 'השארנו את לוי אצל דנה לשבוע שלם. היא שלחה תמונות כל יום. הוא חזר שמח – ואנחנו גם.',
    authorName: 'מוסטפה ואמינה',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    dogName: 'לוי',
    petType: 'כלב',
    rating: 5,
    city: 'תל אביב',
  },
  {
    id: 2,
    text: 'הכלב שלנו קפץ על אבי כאילו הוא חבר ישן. לא ציפינו לזה בפגישה הראשונה.',
    authorName: 'שירה מ.',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    dogName: 'בארון',
    petType: 'כלב',
    rating: 5,
    city: 'גבעתיים',
  },
  {
    id: 3,
    text: 'קוקי מפחדת מאמבטיה. אצל רחל היא שונה לגמרי. לא יודעת מה היא עושה אחרת, אבל זה עובד.',
    authorName: 'יעל ס.',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dogName: 'קוקי',
    petType: 'חתולה',
    rating: 5,
    city: 'חיפה',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#F5F9F7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
            מה אומרים בעלי החיות
          </h2>
          <p className="text-[#6B7280]">
            חוויות אמיתיות מהמשפחות הראשונות שלנו
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#E8E8E6]"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-[#1A1A1A] leading-relaxed text-sm mb-5">
                "{t.text}"
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8E6]">
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={t.authorAvatar}
                    alt={t.authorName}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">{t.authorName}</p>
                  <p className="text-[#9CA3AF] text-xs">עם {t.dogName} ה{t.petType} · {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
