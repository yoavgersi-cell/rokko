'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PawPrint, CheckCircle, ChevronLeft, ChevronRight, Camera, Home, Users, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SERVICES, CITIES } from '@/lib/data';
import { ServiceType, DogSize } from '@/lib/types';
import { cn } from '@/lib/utils';

const DOG_SIZES: { id: DogSize; label: string }[] = [
  { id: 'tiny', label: 'זעיר (עד 5 ק"ג)' },
  { id: 'small', label: 'קטן (5-10 ק"ג)' },
  { id: 'medium', label: 'בינוני (10-25 ק"ג)' },
  { id: 'large', label: 'גדול (25-45 ק"ג)' },
  { id: 'giant', label: 'ענק (45+ ק"ג)' },
];

const STEPS = [
  { id: 1, label: 'פרטים אישיים' },
  { id: 2, label: 'השירותים שלי' },
  { id: 3, label: 'סביבת הבית' },
  { id: 4, label: 'סיום' },
];

interface FormData {
  // Step 1
  fullName: string;
  city: string;
  neighborhood: string;
  whatsapp: string;
  bio: string;
  // Step 2
  services: ServiceType[];
  prices: Record<string, string>;
  dogSizes: DogSize[];
  // Step 3
  homeType: string;
  hasOtherDogs: boolean | null;
  hasCats: boolean | null;
  hasChildren: boolean | null;
  maxDogs: string;
  availableHours: string;
}

const initialData: FormData = {
  fullName: '',
  city: '',
  neighborhood: '',
  whatsapp: '',
  bio: '',
  services: [],
  prices: {},
  dogSizes: [],
  homeType: '',
  hasOtherDogs: null,
  hasCats: null,
  hasChildren: null,
  maxDogs: '1',
  availableHours: '',
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                current > step.id
                  ? 'bg-[#2D7D5A] text-white'
                  : current === step.id
                  ? 'bg-[#2D7D5A] text-white ring-4 ring-[#2D7D5A]/20'
                  : 'bg-[#E8E8E6] text-[#6B7280]'
              )}
            >
              {current > step.id ? '✓' : step.id}
            </div>
            <span
              className={cn(
                'text-xs mt-1.5 font-medium hidden sm:block',
                current === step.id ? 'text-[#2D7D5A]' : 'text-[#6B7280]'
              )}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-10 sm:w-16 mx-1 transition-colors duration-300',
                current > step.id + 1 ? 'bg-[#2D7D5A]' : 'bg-[#E8E8E6]'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Step1({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">שם מלא *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            placeholder="ישראל ישראלי"
            className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">מספר ווטסאפ *</label>
          <input
            type="tel"
            value={data.whatsapp}
            onChange={(e) => update({ whatsapp: e.target.value })}
            placeholder="050-1234567"
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">עיר *</label>
          <select
            value={data.city}
            onChange={(e) => update({ city: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] appearance-none"
          >
            <option value="">בחר עיר</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">שכונה</label>
          <input
            type="text"
            value={data.neighborhood}
            onChange={(e) => update({ neighborhood: e.target.value })}
            placeholder="שם השכונה"
            className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">ספרו על עצמכם *</label>
        <textarea
          value={data.bio}
          onChange={(e) => update({ bio: e.target.value })}
          rows={4}
          placeholder="ספרו לבעלי הכלבים קצת על עצמכם, הניסיון שלכם ואיך אתם עובדים..."
          className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">תמונת פרופיל</label>
        <div className="border-2 border-dashed border-[#E8E8E6] rounded-2xl p-8 text-center hover:border-[#2D7D5A] transition-colors cursor-pointer group">
          <Camera className="w-8 h-8 text-[#6B7280] group-hover:text-[#2D7D5A] mx-auto mb-2 transition-colors" />
          <p className="text-sm font-medium text-[#1A1A1A]">לחץ להעלאת תמונה</p>
          <p className="text-xs text-[#6B7280] mt-1">PNG, JPG עד 5MB</p>
        </div>
      </div>
    </div>
  );
}

function Step2({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  const toggleService = (s: ServiceType) => {
    const updated = data.services.includes(s)
      ? data.services.filter((x) => x !== s)
      : [...data.services, s];
    update({ services: updated });
  };

  const toggleSize = (size: DogSize) => {
    const updated = data.dogSizes.includes(size)
      ? data.dogSizes.filter((x) => x !== size)
      : [...data.dogSizes, size];
    update({ dogSizes: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-[#1A1A1A] mb-4">אילו שירותים אתם מציעים? *</h3>
        <div className="grid grid-cols-2 gap-3">
          {SERVICES.map((service) => {
            const selected = data.services.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right',
                  selected
                    ? 'border-[#2D7D5A] bg-[#E8F5EE]'
                    : 'border-[#E8E8E6] hover:border-[#2D7D5A]/50'
                )}
              >
                <span className="text-2xl">{service.icon}</span>
                <div className="flex-1">
                  <p className={cn('font-semibold text-sm', selected ? 'text-[#2D7D5A]' : 'text-[#1A1A1A]')}>
                    {service.label}
                  </p>
                  <p className="text-xs text-[#6B7280]">{service.priceLabel}</p>
                </div>
                {selected && <CheckCircle className="w-4 h-4 text-[#2D7D5A] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {data.services.length > 0 && (
        <div>
          <h3 className="font-bold text-[#1A1A1A] mb-4">מחירים לשירותים שבחרתם</h3>
          <div className="space-y-3">
            {data.services.map((serviceId) => {
              const svc = SERVICES.find((s) => s.id === serviceId)!;
              return (
                <div key={serviceId} className="flex items-center gap-3">
                  <span className="text-xl w-8">{svc.icon}</span>
                  <span className="text-sm font-medium text-[#1A1A1A] w-24">{svc.label}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[#6B7280]">₪</span>
                    <input
                      type="number"
                      value={data.prices[serviceId] || ''}
                      onChange={(e) => update({ prices: { ...data.prices, [serviceId]: e.target.value } })}
                      placeholder="150"
                      min="0"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A]"
                    />
                    <span className="text-[#6B7280] text-sm whitespace-nowrap">{svc.priceLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-[#1A1A1A] mb-4">גדלי כלבים שאתם מקבלים *</h3>
        <div className="grid grid-cols-1 gap-2">
          {DOG_SIZES.map((size) => {
            const selected = data.dogSizes.includes(size.id);
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => toggleSize(size.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-right',
                  selected
                    ? 'border-[#2D7D5A] bg-[#E8F5EE]'
                    : 'border-[#E8E8E6] hover:border-[#2D7D5A]/50'
                )}
              >
                <span className={cn('font-medium text-sm flex-1', selected ? 'text-[#2D7D5A]' : 'text-[#1A1A1A]')}>
                  {size.label}
                </span>
                {selected && <CheckCircle className="w-4 h-4 text-[#2D7D5A]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step3({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  const YesNoField = ({
    label,
    field,
  }: {
    label: string;
    field: keyof Pick<FormData, 'hasOtherDogs' | 'hasCats' | 'hasChildren'>;
  }) => (
    <div>
      <p className="text-sm font-semibold text-[#1A1A1A] mb-2">{label}</p>
      <div className="flex gap-3">
        {[
          { value: true, label: 'כן' },
          { value: false, label: 'לא' },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => update({ [field]: opt.value } as Partial<FormData>)}
            className={cn(
              'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
              data[field] === opt.value
                ? 'border-[#2D7D5A] bg-[#E8F5EE] text-[#2D7D5A]'
                : 'border-[#E8E8E6] text-[#1A1A1A] hover:border-[#2D7D5A]/50'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">סוג הבית *</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'house', label: 'בית פרטי', icon: '🏡' },
            { value: 'apartment', label: 'דירה', icon: '🏢' },
            { value: 'yard', label: 'עם חצר', icon: '🌿' },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => update({ homeType: type.value })}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                data.homeType === type.value
                  ? 'border-[#2D7D5A] bg-[#E8F5EE]'
                  : 'border-[#E8E8E6] hover:border-[#2D7D5A]/50'
              )}
            >
              <span className="text-2xl">{type.icon}</span>
              <span className={cn('text-xs font-medium', data.homeType === type.value ? 'text-[#2D7D5A]' : 'text-[#1A1A1A]')}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <YesNoField label="יש כלבים אחרים בבית?" field="hasOtherDogs" />
        <YesNoField label="יש חתולים בבית?" field="hasCats" />
        <YesNoField label="יש ילדים קטנים?" field="hasChildren" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">מספר כלבים מקסימלי בו-זמנית</label>
        <div className="flex gap-3">
          {['1', '2', '3', '4+'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => update({ maxDogs: num })}
              className={cn(
                'flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all',
                data.maxDogs === num
                  ? 'border-[#2D7D5A] bg-[#E8F5EE] text-[#2D7D5A]'
                  : 'border-[#E8E8E6] text-[#1A1A1A] hover:border-[#2D7D5A]/50'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">שעות זמינות</label>
        <input
          type="text"
          value={data.availableHours}
          onChange={(e) => update({ availableHours: e.target.value })}
          placeholder="לדוגמה: ימים א׳–ו׳, 8:00–20:00"
          className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#FAFAF8] text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A]"
        />
      </div>
    </div>
  );
}

function Step4({
  data,
  onSubmit,
  submitted,
}: {
  data: FormData;
  onSubmit: () => void;
  submitted: boolean;
}) {
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mb-6 mx-auto">
          <CheckCircle className="w-8 h-8 text-[#2D7D5A]" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
          הבקשה נשלחה
        </h2>
        <p className="text-[#6B7280] mb-2 leading-relaxed max-w-sm mx-auto">
          הפרופיל שלכם יועבר לאישור בתוך 24 שעות. ניצור אתכם קשר לאישור סופי.
        </p>
        <p className="text-[#2D7D5A] font-medium mb-8">ברוכים הבאים לקהילת Rokko</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-[#2D7D5A] text-white rounded-xl font-semibold hover:bg-[#236247] transition-colors"
          >
            חזרה לדף הבית
          </Link>
          <Link
            href="/search"
            className="px-8 py-3 border border-[#E8E8E6] text-[#1A1A1A] rounded-xl font-medium hover:bg-[#F5F5F3] transition-colors"
          >
            צפו במארחים אחרים
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-[#1A1A1A] text-lg">סיכום הפרטים שלכם</h3>

      {/* Summary Cards */}
      <div className="space-y-4">
        <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#E8E8E6]">
          <h4 className="font-semibold text-[#2D7D5A] mb-3 text-sm">פרטים אישיים</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-[#6B7280]">שם:</span> <span className="font-medium">{data.fullName || '—'}</span></div>
            <div><span className="text-[#6B7280]">עיר:</span> <span className="font-medium">{data.city || '—'}</span></div>
            <div><span className="text-[#6B7280]">שכונה:</span> <span className="font-medium">{data.neighborhood || '—'}</span></div>
            <div><span className="text-[#6B7280]">ווטסאפ:</span> <span className="font-medium">{data.whatsapp || '—'}</span></div>
          </div>
          {data.bio && <p className="text-[#4B5563] text-xs mt-3 line-clamp-2">{data.bio}</p>}
        </div>

        <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#E8E8E6]">
          <h4 className="font-semibold text-[#2D7D5A] mb-3 text-sm">שירותים ומחירים</h4>
          {data.services.length === 0 ? (
            <p className="text-[#6B7280] text-sm">לא נבחרו שירותים</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.services.map((s) => {
                const svc = SERVICES.find((sv) => sv.id === s);
                return (
                  <span key={s} className="bg-[#E8F5EE] text-[#2D7D5A] text-xs font-medium px-3 py-1.5 rounded-full">
                    {svc?.label} {data.prices[s] ? `• ₪${data.prices[s]}` : ''}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#E8E8E6]">
          <h4 className="font-semibold text-[#2D7D5A] mb-3 text-sm">סביבת הבית</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-[#6B7280]">סוג בית:</span> <span className="font-medium">
              {data.homeType === 'house' ? 'בית פרטי' : data.homeType === 'apartment' ? 'דירה' : data.homeType === 'yard' ? 'עם חצר' : '—'}
            </span></div>
            <div><span className="text-[#6B7280]">כלבים אחרים:</span> <span className="font-medium">{data.hasOtherDogs === null ? '—' : data.hasOtherDogs ? 'כן' : 'לא'}</span></div>
            <div><span className="text-[#6B7280]">חתולים:</span> <span className="font-medium">{data.hasCats === null ? '—' : data.hasCats ? 'כן' : 'לא'}</span></div>
            <div><span className="text-[#6B7280]">ילדים:</span> <span className="font-medium">{data.hasChildren === null ? '—' : data.hasChildren ? 'כן' : 'לא'}</span></div>
            <div><span className="text-[#6B7280]">מקסימום כלבים:</span> <span className="font-medium">{data.maxDogs}</span></div>
          </div>
        </div>
      </div>

      {/* Trust message */}
      <div className="bg-[#E8F5EE] rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-[#2D7D5A] flex-shrink-0 mt-0.5" />
        <p className="text-[#2D7D5A] text-sm leading-relaxed">
          <strong>הפרופיל שלכם יועבר לאישור בתוך 24 שעות.</strong> אנחנו בודקים כל מארח לפני האישור כדי לשמור על סטנדרט גבוה לכל בעלי החיות.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        className="w-full py-4 bg-[#2D7D5A] text-white font-semibold text-base rounded-2xl hover:bg-[#236247] transition-colors"
      >
        שלחו בקשה להצטרפות
      </button>
    </div>
  );
}

export default function BecomeProviderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (partial: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    setErrors([]);
  };

  const validate = (step: number): string[] => {
    const e: string[] = [];
    if (step === 1) {
      if (!formData.fullName.trim()) e.push('שם מלא הוא שדה חובה');
      if (!formData.city) e.push('יש לבחור עיר');
      if (!formData.whatsapp.trim()) e.push('מספר ווטסאפ הוא שדה חובה');
      if (!formData.bio.trim()) e.push('יש להזין תיאור אישי');
    }
    if (step === 2) {
      if (formData.services.length === 0) e.push('יש לבחור לפחות שירות אחד');
      if (formData.dogSizes.length === 0) e.push('יש לבחור לפחות גודל כלב אחד');
    }
    if (step === 3) {
      if (!formData.homeType) e.push('יש לבחור סוג בית');
    }
    return e;
  };

  const next = () => {
    const e = validate(currentStep);
    if (e.length > 0) {
      setErrors(e);
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Top Header */}
          {!submitted && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#E8F5EE] text-[#2D7D5A] text-sm font-medium px-4 py-2 rounded-full mb-4">
                <PawPrint className="w-4 h-4" />
                מחפשים מארחים ראשונים לקהילה
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
                הצטרפו אלינו ב-Rokko
              </h1>
              <p className="text-[#6B7280]">
                אנשים שאוהבים חיות ורוצים לעזור — זה כל מה שצריך
              </p>
            </div>
          )}

          {/* Card */}
          <div className="bg-white rounded-3xl card-shadow p-6 sm:p-8">
            {!submitted && <StepIndicator current={currentStep} />}

            {/* Progress Bar */}
            {!submitted && (
              <div className="h-1.5 bg-[#E8E8E6] rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-[#2D7D5A] rounded-full"
                  initial={false}
                  animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}

            {/* Step Title */}
            {!submitted && (
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">
                שלב {currentStep}: {STEPS[currentStep - 1].label}
              </h2>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 1 && <Step1 data={formData} update={update} />}
                {currentStep === 2 && <Step2 data={formData} update={update} />}
                {currentStep === 3 && <Step3 data={formData} update={update} />}
                {currentStep === 4 && (
                  <Step4 data={formData} onSubmit={handleSubmit} submitted={submitted} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Errors */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                {errors.map((e) => (
                  <p key={e} className="text-red-600 text-sm">• {e}</p>
                ))}
              </motion.div>
            )}

            {/* Navigation */}
            {!submitted && currentStep < 4 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8E8E6]">
                <button
                  onClick={back}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8E8E6] text-[#1A1A1A] font-medium text-sm hover:bg-[#F5F5F3] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                  הקודם
                </button>

                <span className="text-sm text-[#6B7280]">
                  {currentStep} / {STEPS.length}
                </span>

                <button
                  onClick={next}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2D7D5A] text-white rounded-xl font-bold text-sm hover:bg-[#1A5C40] transition-colors shadow-sm"
                >
                  הבא
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
