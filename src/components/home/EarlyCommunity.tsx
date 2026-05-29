'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, MapPin, TrendingUp } from 'lucide-react';

const STATS = [
  { Icon: Users, label: '40+ דוגסיטרים ודוגווקרים' },
  { Icon: MapPin, label: '8 ערים' },
  { Icon: TrendingUp, label: 'גדלים כל שבוע' },
];

export default function EarlyCommunity() {
  return (
    <section className="py-10 md:py-14 bg-[#1A1A1A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Social proof bar - compact single row on mobile */}
          <div className="flex items-center gap-4 md:gap-5 mb-5 md:mb-7 flex-wrap">
            {STATS.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-[#4CAF84] flex-shrink-0" strokeWidth={1.5} />
                <span className="text-white/60 text-xs md:text-sm">{label}</span>
              </div>
            ))}
          </div>

          <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-5 leading-snug">
            כי למצוא דוגסיטר טוב
            <br />
            לא אמור להיות כל כך מסובך
          </h2>

          <div className="space-y-2.5 md:space-y-3.5 mb-6 md:mb-8">
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              עד היום זה עבד ככה: פרסום בקבוצת פייסבוק, קבלת 40 תגובות, ניסיון להבין מי רציני - ואז ניהול שיחות בוואטסאפ עם 10 אנשים שונים.
            </p>

            <p className="text-white text-sm leading-relaxed font-semibold">
              Rokko נבנית כדי לשנות את זה.
            </p>

            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              מקום אחד למצוא דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים - עם פרופילים אמיתיים, ביקורות מבעלי חיות שכבר השתמשו בשירות, ודרך פשוטה לפנות ישירות.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#2D7D5A] text-white font-semibold text-sm rounded-xl hover:bg-[#236247] transition-colors"
            >
              מצאו דוגסיטר או דוגווקר
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white/80 font-medium text-sm rounded-xl hover:bg-white/5 transition-colors"
            >
              הצטרפו כדוגסיטר / דוגווקר
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
