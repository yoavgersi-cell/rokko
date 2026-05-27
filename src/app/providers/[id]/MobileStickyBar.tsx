'use client';

import { MessageCircle } from 'lucide-react';

interface MobileStickyBarProps {
  price: number;
  providerName: string;
  whatsappUrl: string;
}

export default function MobileStickyBar({ price, providerName, whatsappUrl }: MobileStickyBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E8E8E6] px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-between max-w-lg mx-auto gap-4">
        <div>
          <span className="text-2xl font-black text-[#1A1A1A]">₪{price}</span>
          <span className="text-[#6B7280] text-sm mr-1">/ לילה</span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#FF7854] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#e8673d] transition-colors shadow-lg flex-1 justify-center"
        >
          <MessageCircle className="w-5 h-5" />
          צור קשר עם {providerName}
        </a>
      </div>
    </div>
  );
}
