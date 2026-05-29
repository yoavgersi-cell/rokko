'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'בוחרים שירות',
    description: 'דוגסיטר, דוגווקר, פנסיון או ביקורי בית - מה שמתאים לכם ולחיה שלכם.',
  },
  {
    number: '02',
    title: 'מדברים עם הדוגסיטר / האוסיטר',
    description: 'פרופיל אמיתי, ביקורות מהקהילה, וקשר ישיר בוואטסאפ - בלי אמצעים.',
  },
  {
    number: '03',
    title: 'סוגרים בראש שקט',
    description: 'בלי מתווכים, בלי עמלות. רק אתם והדוגסיטר שבחרתם.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-8 md:py-14 bg-[#FAFAF8] border-y border-[#E8E8E6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-5 md:mb-10"
        >
          <h2 className="text-xl md:text-3xl font-bold text-[#1A1A1A] mb-1">
            איך זה עובד?
          </h2>
          <p className="text-[#6B7280] text-sm">
            שלושה צעדים - ולא עוד דאגות
          </p>
        </motion.div>

        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-8 right-[calc(33.33%+1rem)] left-[calc(33.33%+1rem)] h-px bg-[#E0EDE8] z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="relative z-10 flex flex-row-reverse items-center gap-3 md:flex-col md:items-start bg-white md:bg-transparent rounded-xl md:rounded-none px-4 py-3 md:p-0 border border-[#EFEFED] md:border-0"
            >
              {/* Step number */}
              <div className="flex-shrink-0 md:mb-4">
                <div className="w-11 h-11 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#E8F5EE] flex items-center justify-center">
                  <span className="text-xl md:text-3xl font-black text-[#2D7D5A] leading-none tracking-tighter">
                    {step.number}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0 md:flex-none">
                <h3 className="text-sm md:text-lg font-bold text-[#1A1A1A] leading-tight mb-0.5 md:mb-1">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-xs md:text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
