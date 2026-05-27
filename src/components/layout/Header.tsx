'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PawPrint, Menu, X, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/search', label: 'מצאו דוגסיטר', Icon: Search },
  { href: '/join', label: 'הצטרפו כדוגסיטר', Icon: Heart },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = scrolled || mobileOpen;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isLight
          ? 'bg-white/96 backdrop-blur-md shadow-sm border-b border-[#E8E8E6]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[66px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#2D7D5A] flex items-center justify-center shadow-sm">
              <PawPrint className="w-[18px] h-[18px] text-white" />
            </div>
            <span
              className={cn(
                'text-xl font-bold tracking-tight transition-colors',
                isLight ? 'text-[#1A1A1A]' : 'text-white'
              )}
            >
              Rokko
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                  isLight
                    ? 'text-[#374151] hover:bg-[#F5F5F3] hover:text-[#1A1A1A]'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/join"
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm',
                isLight
                  ? 'bg-[#2D7D5A] text-white hover:bg-[#236247]'
                  : 'bg-white text-[#1A1A1A] hover:bg-white/92'
              )}
            >
              התחילו עכשיו
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'md:hidden p-2 rounded-xl transition-colors',
              isLight ? 'text-[#1A1A1A] hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
            aria-label="תפריט"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E8E6]">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#374151] text-sm font-medium hover:bg-[#F5F5F3] hover:text-[#1A1A1A] transition-colors"
              >
                <Icon className="w-4 h-4 text-[#2D7D5A] flex-shrink-0" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-[#E8E8E6]">
              <Link
                href="/join"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-[#2D7D5A] text-white text-sm font-semibold"
              >
                התחילו עכשיו
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
