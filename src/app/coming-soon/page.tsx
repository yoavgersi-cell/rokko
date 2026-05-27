import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-6">
        <PawPrint className="w-7 h-7 text-[#2D7D5A]" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">בקרוב</h1>
      <p className="text-[#6B7280] text-base leading-relaxed max-w-xs mb-8">
        הדף הזה עדיין בבנייה. אנחנו עובדים על זה.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#2D7D5A] text-white rounded-xl font-semibold text-sm hover:bg-[#236247] transition-colors"
      >
        חזרה לדף הבית
      </Link>
    </main>
  );
}
