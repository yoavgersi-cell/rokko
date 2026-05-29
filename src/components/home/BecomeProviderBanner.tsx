'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function BecomeProviderBanner() {
  return (
    <section className="py-8 md:py-12 bg-[#F5F9F7] border-t border-[#E8E8E6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#2D7D5A] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 md:mb-5">
              <Sparkles className="w-3 h-3" />
              מחפשים דוגסיטרים ודוגווקרים לקהילה
            </div>

            <h2 className="text-xl md:text-3xl font-bold text-[#1A1A1A] leading-snug mb-2 md:mb-3">
              אתם דוגסיטר, דוגווקר
              <br />
              או וטרינר?
            </h2>

            <p className="text-[#6B7280] leading-relaxed mb-5 md:mb-7 text-sm">
              Rokko מחפשת אנשים שאוהבים חיות ורוצים לעשות מזה משהו. ההצטרפות ללא עלות - כל פרופיל עובר בדיקה ידנית לפני שעולה לאתר.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3">
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 bg-[#2D7D5A] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#236247] transition-colors"
              >
                הצטרפו לקהילה
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 border border-[#E8E8E6] text-[#1A1A1A] font-medium text-sm px-6 py-3 rounded-xl hover:bg-white transition-colors"
              >
                מצאו דוגסיטר לחיית המחמד שלכם
              </Link>
            </div>
          </motion.div>

          {/* Image - hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative hidden lg:block h-72 rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop&q=80"
              alt="אדם עם חיית מחמד"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
