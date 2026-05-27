import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProviderPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-7">
          <PawPrint className="w-8 h-8 text-[#2D7D5A]" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 leading-snug">
          הקהילה שלנו גדלה מיום ליום 🐾
        </h1>

        <p className="text-[#6B7280] text-base leading-relaxed max-w-sm mb-3">
          אנחנו בונים את Rokko עכשיו — מוסיפים דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים שאפשר לסמוך עליהם.
        </p>
        <p className="text-[#6B7280] text-base leading-relaxed max-w-xs mb-10">
          בעוד כמה ימים נפתח את השירות לכולם. כבר מתרגשים.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/join"
            className="px-6 py-3 bg-[#2D7D5A] text-white rounded-xl font-semibold text-sm hover:bg-[#236247] transition-colors"
          >
            הצטרפו כנותני שירות
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-[#E8E8E6] text-[#374151] rounded-xl font-semibold text-sm hover:bg-white transition-colors"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
