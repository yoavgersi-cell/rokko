'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Home, Clock, Sun, Footprints, BedDouble, ChevronDown, X, Check } from 'lucide-react';
import { CITIES } from '@/lib/data';

const SERVICES = [
  {
    id: 'boarding',
    label: 'דוגסיטר',
    subtitle: 'שמירה בבית של הדוגסיטר',
    Icon: BedDouble,
    searchService: 'boarding',
  },
  {
    id: 'sitting',
    label: 'האוסיטינג',
    subtitle: 'שמירה בבית שלכם',
    Icon: Home,
    searchService: 'sitting',
  },
  {
    id: 'walking',
    label: 'דוגווקר',
    subtitle: 'טיולים בשכונה שלכם',
    Icon: Footprints,
    searchService: 'walking',
  },
  {
    id: 'visiting',
    label: 'ביקורי בית',
    subtitle: 'האכלה ובדיקה קצרה',
    Icon: Clock,
    searchService: 'sitting',
  },
  {
    id: 'daycare',
    label: 'פנסיון',
    subtitle: 'אירוח מקצועי לכלבים',
    Icon: Sun,
    searchService: 'daycare',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('boarding');
  const [city, setCity] = useState('');
  const [open, setOpen] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const cityRefDesktop = useRef<HTMLDivElement>(null);
  const cityRefMobile = useRef<HTMLDivElement>(null);

  const selected = SERVICES.find((s) => s.id === selectedId) ?? SERVICES[0];

  const handleCityChange = (val: string) => {
    setCity(val);
    if (val.trim().length > 0) {
      const matches = CITIES.filter(c => c.startsWith(val.trim()));
      setCitySuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCity = (c: string) => {
    setCity(c);
    setShowSuggestions(false);
  };

  useEffect(() => {
    function handle(e: MouseEvent) {
      const target = e.target as Node;
      const inDesktop = cityRefDesktop.current?.contains(target);
      const inMobile = cityRefMobile.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('service', selected.searchService);
    if (city.trim()) params.set('city', city.trim());
    router.push(`/search?${params.toString()}`);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setTimeout(() => setOpen(false), 60);
  };

  /* ─── Shared: city autocomplete list ─── */
  const CityDropdown = () => (
    <AnimatePresence>
      {showSuggestions && (
        <motion.ul
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.12 }}
          className="absolute top-full right-0 left-0 mt-1 bg-white border border-[#E8E8E6] rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto"
        >
          {citySuggestions.map((c) => (
            <li key={c}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); selectCity(c); }}
                className="w-full text-right px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#E8F5EE] hover:text-[#2D7D5A] transition-colors flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                {c}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* ═══════════════════════════════════════
          MOBILE — Premium compact hero
          ═══════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Hero image */}
        <section className="relative overflow-hidden" style={{ minHeight: '40vh' }}>
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-old.png"
              alt="חיות מחמד מאושרות"
              fill
              className="object-cover object-[30%_18%]"
              priority
              sizes="100vw"
            />
            {/* Light top → heavy bottom gradient for clean card emergence */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0.72) 100%)',
              }}
            />
            <AnimatePresence>
              {open && (
                <motion.div
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Headline only — clean and focused */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative z-10 px-5 text-center"
            style={{ paddingTop: '74px', paddingBottom: '44px' }}
          >
            <h1 className="text-[23px] font-bold text-white leading-tight tracking-tight mb-2">
              בונים את הבית החדש<br />של בעלי חיות המחמד בישראל
            </h1>
            <h2 className="text-[16px] text-white font-medium leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              פלטפורמה חדשה למציאת דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים אמינים לחיות המחמד שלכם.
            </h2>
          </motion.div>
        </section>

        {/* Search card — unified, floating over hero */}
        <div className="relative z-20 -mt-7 mx-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.1 }}
            className="bg-white rounded-2xl overflow-hidden text-right"
            style={{ boxShadow: '0 6px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}
          >
            {/* Service selector */}
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#FAFAF8] active:bg-[#F0F0EE] transition-colors border-b border-[#EFEFED]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
                <selected.Icon className="w-[15px] h-[15px] text-[#2D7D5A]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-right min-w-0">
                <p className="text-[10px] text-[#ABABAB] leading-none mb-[3px] font-medium tracking-wide">שירות</p>
                <p className="font-semibold text-[#1A1A1A] text-sm leading-none">{selected.label}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#C0C0C0] flex-shrink-0" />
            </button>

            {/* City input */}
            <div className="relative border-b border-[#EFEFED]" ref={cityRefMobile}>
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#ABABAB] pointer-events-none z-10" />
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { setShowSuggestions(false); handleSearch(); }
                  if (e.key === 'Escape') setShowSuggestions(false);
                }}
                onFocus={() => city.trim() && citySuggestions.length > 0 && setShowSuggestions(true)}
                placeholder="באיזו עיר?"
                className="w-full pr-10 pl-4 py-3.5 bg-transparent text-[#1A1A1A] text-sm focus:outline-none placeholder:text-[#C0C0C0]"
              />
              <CityDropdown />
            </div>

            {/* Search button */}
            <div className="p-2.5">
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 py-[11px] bg-[#2D7D5A] text-white rounded-xl font-bold text-sm hover:bg-[#256B4E] active:bg-[#1D5238] transition-colors"
              >
                <Search className="w-[15px] h-[15px]" />
                חיפוש
              </button>
            </div>
          </motion.div>
        </div>

        {/* Trust signals — compact single row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="flex items-center justify-center gap-4 mt-3 px-4"
        >
          {['אנשים שאוהבים חיות', 'ביקורות אמיתיות', 'קשר ישיר עם הדוגסיטר'].map((label) => (
            <div key={label} className="flex items-center gap-1 text-[#9CA3AF] text-[12px] whitespace-nowrap">
              <div className="w-[5px] h-[5px] rounded-full bg-[#4CAF84] flex-shrink-0" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
          DESKTOP — original full-screen layout
          ═══════════════════════════════════════ */}
      <section
        className="relative hidden md:flex items-center justify-center overflow-hidden"
        style={{ minHeight: '78vh' }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-old.png"
            alt="חיות מחמד מאושרות"
            fill
            className="object-cover object-[center_25%] sm:object-[center_30%]"
            priority
            sizes="100vw"
          />
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.58) 100%)',
            }}
          />
          {/* Extra darkening layer when overlay is open */}
          <AnimatePresence>
            {open && (
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-bold text-white leading-snug mb-3 tracking-tight"
          >
            בונים את הבית החדש של בעלי חיות המחמד בישראל
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-white/80 text-base sm:text-lg mb-8 font-light"
          >
            פלטפורמה חדשה למציאת דוגסיטרים, דוגווקרים, פנסיונים ווטרינרים אמינים לחיות המחמד שלכם.
          </motion.p>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-2xl p-5 shadow-2xl text-right"
          >
            {/* Desktop: service pills */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-[#6B7280] mb-3 tracking-wide uppercase">
                איזה שירות אתם מחפשים?
              </p>
              <div className="flex gap-2 justify-end">
                {SERVICES.map(({ id, label, Icon }) => {
                  const isActive = id === selectedId;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedId(id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? 'border-[#2D7D5A] bg-[#E8F5EE] text-[#2D7D5A]'
                          : 'border-[#E8E8E6] text-[#374151] hover:border-[#2D7D5A] hover:text-[#2D7D5A]'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City input with autocomplete */}
            <div className="relative mb-4" ref={cityRefDesktop}>
              <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-[#9CA3AF] pointer-events-none z-10" />
              <input
                type="text"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { setShowSuggestions(false); handleSearch(); }
                  if (e.key === 'Escape') setShowSuggestions(false);
                }}
                onFocus={() => city.trim() && citySuggestions.length > 0 && setShowSuggestions(true)}
                placeholder="עיר"
                className="w-full pr-9 pl-4 py-3.5 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]"
              />
              <CityDropdown />
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors"
            >
              <Search className="w-4 h-4" />
              חיפוש
            </button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-5 mt-6"
          >
            {['אנשים שאוהבים חיות', 'ביקורות אמיתיות', 'קשר ישיר עם הדוגסיטר'].map((label) => (
              <div key={label} className="flex items-center gap-1.5 text-white/80 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF84]" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Full-screen service picker overlay (shared)
          ═══════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center">
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%', transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] } }}
              transition={{ type: 'spring', damping: 36, stiffness: 420, mass: 0.7 }}
            >
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-[#E0E0E0]" />
              </div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E6]">
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F3] transition-colors"
                >
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
                <p className="font-bold text-[#1A1A1A] text-base">בחרו שירות</p>
                <div className="w-8" />
              </div>
              {SERVICES.map((service) => {
                const isSelected = service.id === selectedId;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleSelect(service.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAF8] active:bg-[#F0F0EE] transition-colors border-b border-[#F5F5F3] last:border-0"
                  >
                    <motion.div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#E8F5EE]' : 'bg-[#F5F5F3]'}`}
                      animate={{ scale: isSelected ? 1.05 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <service.Icon
                        className={`w-5 h-5 ${isSelected ? 'text-[#2D7D5A]' : 'text-[#9CA3AF]'}`}
                        strokeWidth={1.5}
                      />
                    </motion.div>
                    <div className="flex-1 text-right">
                      <p className={`font-semibold text-base leading-none mb-1 ${isSelected ? 'text-[#2D7D5A]' : 'text-[#1A1A1A]'}`}>
                        {service.label}
                      </p>
                      <p className="text-[#9CA3AF] text-sm">{service.subtitle}</p>
                    </div>
                    <AnimatePresence mode="wait">
                      {isSelected ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <Check className="w-5 h-5 text-[#2D7D5A] flex-shrink-0" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="circle"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-5 h-5 rounded-full border-2 border-[#E8E8E6] flex-shrink-0"
                        />
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
