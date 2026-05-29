'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BedDouble, Home, Footprints, Clock, Sun,
  Stethoscope, Dumbbell, Scissors, Shield, HelpCircle,
  ArrowRight, Check, ChevronDown, Upload, X, FileVideo,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceType =
  | 'boarding' | 'sitting' | 'walking' | 'visiting'
  | 'pension' | 'vet' | 'training' | 'grooming'
  | 'insurance' | 'other';

type SetFn = (k: keyof FormData, v: unknown) => void;
type Screen = 'step1' | 'services' | 'step2' | 'step3' | 'done';

const SERVICES: { id: ServiceType; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'boarding',  label: 'דוגסיטר',           sub: 'שמירה בבית של הדוגסיטר',       Icon: BedDouble },
  { id: 'sitting',   label: 'האוסיטינג',          sub: 'שמירה בבית הלקוח',              Icon: Home },
  { id: 'walking',   label: 'דוגווקר',            sub: 'טיולים והוצאת כלבים',           Icon: Footprints },
  { id: 'visiting',  label: 'ביקורי בית',         sub: 'ביקורים קצרים בבית הלקוח',      Icon: Clock },
  { id: 'pension',   label: 'פנסיון',             sub: 'אירוח מקצועי לכלבים',           Icon: Sun },
  { id: 'vet',       label: 'וטרינר',             sub: 'מרפאה או ביקורי בית',           Icon: Stethoscope },
  { id: 'training',  label: 'אילוף',              sub: 'אילוף וטיפול התנהגותי',         Icon: Dumbbell },
  { id: 'grooming',  label: 'טיפוח',              sub: 'תספורת, רחצה וטיפול שוטף',      Icon: Scissors },
  { id: 'insurance', label: 'ביטוח לחיות מחמד',   sub: 'כיסוי וטרינרי וביטוחי חיים',   Icon: Shield },
  { id: 'other',     label: 'אחר',                sub: 'שירות שלא מופיע ברשימה',        Icon: HelpCircle },
];

const PET_CARE_SERVICES: ServiceType[] = ['boarding', 'sitting', 'walking', 'visiting'];

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const DOG_SIZES = ['זעיר (עד 5 ק״ג)', 'קטן (5–10 ק״ג)', 'בינוני (10–25 ק״ג)', 'גדול (25–45 ק״ג)', 'ענק (45+ ק״ג)'];
const VET_SPECS = ['רפואה כללית', 'כירורגיה', 'עיניים', 'שיניים', 'עור', 'התנהגות', 'חירום', 'הדמיה', 'אחר'];
const EXPERIENCE_OPTIONS = [
  { value: 'less_than_1', label: 'פחות משנה' },
  { value: '1_3', label: '1–3 שנים' },
  { value: '3_5', label: '3–5 שנים' },
  { value: '5_plus', label: '5+ שנים' },
];

// ─── Form state ───────────────────────────────────────────────────────────────

type FormData = {
  // Step 1 - contact
  full_name: string;
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  service_areas: string;
  social_instagram: string;
  social_facebook: string;
  social_website: string;
  notes: string;
  // Shared pet care
  shared_experience_years: string;
  shared_animal_experience: string[];
  shared_availability: string[];
  shared_description: string;
  // Boarding
  is_home_based: string;
  has_yard: string;
  has_other_pets: string;
  indoor_sleeping: string;
  boarding_max_pets: string;
  boarding_dog_sizes: string[];
  // Sitting
  sitting_animals: string[];
  sitting_overnight: string;
  // Walking
  walk_type: string;
  walk_dog_sizes: string[];
  available_days: string[];
  walk_duration: string;
  // Visiting
  visiting_animals: string[];
  visiting_per_day: string;
  visiting_availability: string[];
  // Pension
  pension_name: string;
  pension_type: string;
  pension_max_pets: string;
  pension_separation: string;
  pension_has_yard: string;
  pension_dog_sizes: string[];
  pension_inclusions: string[];
  pension_description: string;
  // Vet
  vet_type: string;
  vet_clinic_name: string;
  vet_clinic_address: string;
  vet_license: string;
  vet_emergency: string;
  vet_services: string[];
  vet_specializations: string[];
  vet_description: string;
  // Training
  training_types: string[];
  training_location: string;
  training_experience: string;
  training_description: string;
  // Grooming
  grooming_type: string;
  grooming_services: string[];
  grooming_dog_sizes: string[];
  grooming_experience: string;
  grooming_description: string;
  // Insurance
  company_name: string;
  insurance_types_text: string;
  contact_person: string;
  insurance_description: string;
  // Other
  other_description: string;
};

const defaultForm: FormData = {
  full_name: '', business_name: '', phone: '', whatsapp: '', email: '',
  city: '', service_areas: '', social_instagram: '', social_facebook: '',
  social_website: '', notes: '',
  shared_experience_years: '', shared_animal_experience: [], shared_availability: [], shared_description: '',
  is_home_based: '', has_yard: '', has_other_pets: '', indoor_sleeping: '',
  boarding_max_pets: '', boarding_dog_sizes: [],
  sitting_animals: [], sitting_overnight: '',
  walk_type: '', walk_dog_sizes: [], available_days: [], walk_duration: '',
  visiting_animals: [], visiting_per_day: '', visiting_availability: [],
  pension_name: '', pension_type: '', pension_max_pets: '', pension_separation: '',
  pension_has_yard: '', pension_dog_sizes: [], pension_inclusions: [], pension_description: '',
  vet_type: '', vet_clinic_name: '', vet_clinic_address: '', vet_license: '',
  vet_emergency: '', vet_services: [], vet_specializations: [], vet_description: '',
  training_types: [], training_location: '', training_experience: '', training_description: '',
  grooming_type: '', grooming_services: [], grooming_dog_sizes: [], grooming_experience: '', grooming_description: '',
  company_name: '', insurance_types_text: '', contact_person: '', insurance_description: '',
  other_description: '',
};

// ─── UI Primitives ────────────────────────────────────────────────────────────

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
        {label}{required && <span className="text-[#EF4444] mr-1">*</span>}
      </label>
      {hint && <p className="text-xs text-[#9CA3AF] mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', dir, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; dir?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      dir={dir}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF] transition-shadow disabled:bg-[#F5F5F3] disabled:text-[#9CA3AF]"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF] resize-none transition-shadow"
    />
  );
}

function RadioGroup({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            value === opt.value
              ? 'bg-[#2D7D5A] text-white border-[#2D7D5A]'
              : 'bg-white text-[#374151] border-[#E8E8E6] hover:border-[#2D7D5A]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ values, onChange, options }: {
  values: string[]; onChange: (v: string[]) => void; options: string[];
}) {
  const toggle = (opt: string) =>
    onChange(values.includes(opt) ? values.filter(v => v !== opt) : [...values, opt]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-2 rounded-xl text-sm border transition-all ${
            values.includes(opt)
              ? 'bg-[#E8F5EE] text-[#2D7D5A] border-[#2D7D5A] font-medium'
              : 'bg-white text-[#374151] border-[#E8E8E6] hover:border-[#2D7D5A]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] appearance-none transition-shadow ${
          value ? 'text-[#1A1A1A]' : 'text-[#9CA3AF]'
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-2 pb-1 border-t border-[#F0F0EE]">
      <p className="text-sm font-bold text-[#1A1A1A]">{children}</p>
    </div>
  );
}

// ─── File Upload ──────────────────────────────────────────────────────────────

type UploadedFile = { file: File; preview: string | null; url: string | null; uploading: boolean; error: string | null };

function FileUpload({ files, onChange }: { files: UploadedFile[]; onChange: (f: UploadedFile[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = async (incoming: FileList | null) => {
    if (!incoming) return;
    const allowed = Array.from(incoming).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    const newEntries: UploadedFile[] = allowed.map(f => ({
      file: f,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      url: null,
      uploading: true,
      error: null,
    }));
    onChange([...files, ...newEntries]);

    const supabase = getSupabaseClient();
    const updated = [...files, ...newEntries];
    await Promise.all(
      newEntries.map(async (entry, idx) => {
        const globalIdx = files.length + idx;
        try {
          const ext = entry.file.name.split('.').pop();
          const path = `applications/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error } = await supabase.storage.from('provider-media').upload(path, entry.file, { upsert: false });
          if (error) throw error;
          const { data } = supabase.storage.from('provider-media').getPublicUrl(path);
          updated[globalIdx] = { ...updated[globalIdx], url: data.publicUrl, uploading: false };
        } catch {
          updated[globalIdx] = { ...updated[globalIdx], uploading: false, error: 'שגיאה בהעלאה' };
        }
        onChange([...updated]);
      })
    );
  };

  const remove = (idx: number) => {
    const copy = [...files];
    if (copy[idx].preview) URL.revokeObjectURL(copy[idx].preview!);
    copy.splice(idx, 1);
    onChange(copy);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-[#2D7D5A] bg-[#E8F5EE]' : 'border-[#E8E8E6] bg-[#FAFAF8] hover:border-[#2D7D5A] hover:bg-[#F0FAF5]'
        }`}
      >
        <Upload className="w-7 h-7 text-[#9CA3AF] mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-sm font-medium text-[#374151]">גררו קבצים לכאן או לחצו לבחירה</p>
        <p className="text-xs text-[#9CA3AF] mt-1">תמונות וסרטונים - עד 50MB לקובץ</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden bg-[#F5F5F3] aspect-square flex items-center justify-center">
              {f.preview ? (
                <img src={f.preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 p-2">
                  <FileVideo className="w-6 h-6 text-[#6B7280]" strokeWidth={1.5} />
                  <p className="text-[10px] text-[#6B7280] text-center truncate w-full px-1">{f.file.name}</p>
                </div>
              )}
              {f.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {f.error && (
                <div className="absolute inset-0 bg-red-500/60 flex items-center justify-center">
                  <p className="text-white text-xs font-bold">שגיאה</p>
                </div>
              )}
              {!f.uploading && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total, onBack }: {
  step: number; total: number; onBack: () => void;
}) {
  return (
    <div className="border-b border-[#E8E8E6] bg-white sticky top-0 z-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors flex-shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
          <span className="hidden sm:inline">חזרה</span>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < step ? 'bg-[#2D7D5A]' : 'bg-[#E8E8E6]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#9CA3AF] whitespace-nowrap">שלב {step} מתוך {total}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Bar ───────────────────────────────────────────────────────────────

function BottomBar({ label, onClick, loading, disabled }: {
  label: string; onClick: () => void; loading?: boolean; disabled?: boolean;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E8E8E6] px-4 py-3 sm:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'שולחים...' : label}
      </button>
    </div>
  );
}

// ─── Confirmation ─────────────────────────────────────────────────────────────

function ConfirmationScreen() {
  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="w-20 h-20 rounded-3xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-8">
          <Check className="w-9 h-9 text-[#2D7D5A]" strokeWidth={2} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 leading-snug">
          איזה כיף שהצטרפתם ל-Rokko 🐾
        </h2>
        <p className="text-[#6B7280] text-base leading-relaxed mb-2 max-w-sm mx-auto">
          קיבלנו את הבקשה שלכם ואנחנו עוברים עכשיו על הפרטים כדי לשמור על קהילה איכותית ובטוחה לכולם.
        </p>
        <p className="text-[#6B7280] text-base leading-relaxed mb-10">
          נחזור אליכם בקרוב עם עדכון.
        </p>
        <div className="flex items-start gap-4 p-5 bg-[#F4FBF7] border border-[#D6EFE3] rounded-2xl text-right mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#2D7D5A] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A] text-sm mb-1">בדיקה ידנית על ידי צוות Rokko</p>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              כל בקשה נבדקת ידנית כדי לשמור על קהילה איכותית ובטוחה.
            </p>
          </div>
        </div>
        <p className="text-[#9CA3AF] text-xs">הפרטים שלכם נשמרים בצורה מאובטחת.</p>
      </motion.div>
    </div>
  );
}

// ─── Step 1: Contact ──────────────────────────────────────────────────────────

function Step1Contact({
  form, set, errors, sameWhatsapp, setSameWhatsapp,
}: {
  form: FormData;
  set: SetFn;
  errors: Partial<Record<keyof FormData, string>>;
  sameWhatsapp: boolean;
  setSameWhatsapp: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="שם מלא" required>
        <Input value={form.full_name} onChange={v => set('full_name', v)} placeholder="השם שיופיע בפרופיל" />
        {errors.full_name && <p className="text-[#EF4444] text-xs mt-1">{errors.full_name}</p>}
      </Field>

      <Field label="יש לכם שם לעסק או לפרופיל?">
        <Input value={form.business_name} onChange={v => set('business_name', v)} placeholder="שם העסק, המרפאה או הפרופיל" />
      </Field>

      <Field label="טלפון" required>
        <Input value={form.phone} onChange={v => {
          set('phone', v);
          if (sameWhatsapp) set('whatsapp', v);
        }} placeholder="05X-XXXXXXX" type="tel" dir="ltr" />
        {errors.phone && <p className="text-[#EF4444] text-xs mt-1">{errors.phone}</p>}
      </Field>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="same-whatsapp"
          checked={sameWhatsapp}
          onChange={e => {
            setSameWhatsapp(e.target.checked);
            if (e.target.checked) set('whatsapp', form.phone);
          }}
          className="w-4 h-4 rounded border-[#E8E8E6] accent-[#2D7D5A] cursor-pointer"
        />
        <label htmlFor="same-whatsapp" className="text-sm text-[#374151] cursor-pointer select-none">
          זה גם מספר הוואטסאפ שלי
        </label>
      </div>

      {!sameWhatsapp && (
        <Field label="מספר וואטסאפ">
          <Input value={form.whatsapp} onChange={v => set('whatsapp', v)} placeholder="05X-XXXXXXX" type="tel" dir="ltr" />
        </Field>
      )}

      <Field label="אימייל" required>
        <Input value={form.email} onChange={v => set('email', v)} placeholder="your@email.com" type="email" dir="ltr" />
        {errors.email && <p className="text-[#EF4444] text-xs mt-1">{errors.email}</p>}
      </Field>

      <Field label="עיר" required>
        <Input value={form.city} onChange={v => set('city', v)} placeholder="תל אביב" />
        {errors.city && <p className="text-[#EF4444] text-xs mt-1">{errors.city}</p>}
      </Field>

      <Field label="אזורי שירות">
        <Input value={form.service_areas} onChange={v => set('service_areas', v)} placeholder="לדוגמה: תל אביב, רמת גן, גבעתיים" />
      </Field>

      <div className="pt-1">
        <p className="text-sm font-semibold text-[#1A1A1A] mb-3">קישורים (אופציונלי)</p>
        <div className="space-y-3">
          <Input value={form.social_instagram} onChange={v => set('social_instagram', v)} placeholder="אינסטגרם (instagram.com/...)" dir="ltr" />
          <Input value={form.social_facebook} onChange={v => set('social_facebook', v)} placeholder="פייסבוק (facebook.com/...)" dir="ltr" />
          <Input value={form.social_website} onChange={v => set('social_website', v)} placeholder="אתר אינטרנט" dir="ltr" />
        </div>
      </div>

      <Field label="הערות נוספות">
        <Textarea value={form.notes} onChange={v => set('notes', v)} placeholder="כל מה שחשוב לכם שנדע" rows={3} />
      </Field>
    </div>
  );
}

// ─── Services selection ───────────────────────────────────────────────────────

function ServicesScreen({
  selected, onToggle, onContinue,
}: {
  selected: ServiceType[];
  onToggle: (s: ServiceType) => void;
  onContinue: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-28 sm:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-6 pb-5"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1.5 leading-snug">
          אילו שירותים אתם מציעים? 🐾
        </h1>
        <p className="text-[#6B7280] text-sm leading-relaxed">אפשר לבחור יותר משירות אחד</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2.5">
        {SERVICES.map(({ id, label, sub, Icon }, i) => {
          const isSelected = selected.includes(id);
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.22 }}
              className={`flex flex-col items-end text-right p-3.5 rounded-2xl border-2 transition-all duration-150 active:scale-[0.97] ${
                isSelected
                  ? 'border-[#2D7D5A] bg-[#E8F5EE] shadow-[0_2px_12px_rgba(45,125,90,0.15)]'
                  : 'border-[#EBEBEA] bg-white hover:border-[#2D7D5A] hover:bg-[#F4FBF7]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                isSelected ? 'bg-[#2D7D5A]' : 'bg-[#F5F5F3]'
              }`}>
                {isSelected
                  ? <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                  : <Icon className="w-5 h-5 text-[#6B7280]" strokeWidth={1.5} />
                }
              </div>
              <p className={`font-semibold text-sm leading-none mb-1 transition-colors ${
                isSelected ? 'text-[#2D7D5A]' : 'text-[#1A1A1A]'
              }`}>
                {label}
              </p>
              <p className="text-[#9CA3AF] text-[11px] leading-snug">{sub}</p>
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hidden sm:block mt-8">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors"
          >
            המשך - {selected.length} {selected.length === 1 ? 'שירות נבחר' : 'שירותים נבחרו'} ←
          </button>
        </motion.div>
      )}

      <BottomBar
        label={selected.length > 0
          ? `המשך - ${selected.length} ${selected.length === 1 ? 'שירות' : 'שירותים'} ←`
          : 'בחרו לפחות שירות אחד'}
        onClick={onContinue}
        disabled={selected.length === 0}
      />
    </div>
  );
}

// ─── Step 2: Service-specific field sections ──────────────────────────────────

function SharedPetCareSection({ form, set }: { form: FormData; set: SetFn }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🐾 הניסיון והזמינות שלכם</SectionHeader>
      <Field label="כמה זמן אתם עובדים עם חיות?">
        <Select value={form.shared_experience_years} onChange={v => set('shared_experience_years', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="עם אילו חיות יש לכם ניסיון?">
        <CheckboxGroup
          values={form.shared_animal_experience}
          onChange={v => set('shared_animal_experience', v)}
          options={['כלבים', 'חתולים', 'גורים', 'כלבים מבוגרים', 'כלבים חרדתיים', 'מתן תרופות', 'אחר']}
        />
      </Field>
      <Field label="זמינות כללית:">
        <CheckboxGroup
          values={form.shared_availability}
          onChange={v => set('shared_availability', v)}
          options={['בוקר', 'צהריים', 'ערב', 'סופי שבוע', 'חגים']}
        />
      </Field>
      <Field label="ספרו קצת עליכם ועל הקשר שלכם לחיות 🐾" required>
        <Textarea value={form.shared_description} onChange={v => set('shared_description', v)}
          placeholder="אני מטפל/ת בחיות כבר... אוהב/ת במיוחד..." rows={5} />
      </Field>
    </div>
  );
}

function BoardingSection({ form, set }: { form: FormData; set: SetFn }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏠 דוגסיטר - על הבית שלכם</SectionHeader>
      <Field label="האירוח מתבצע ב:">
        <RadioGroup value={form.is_home_based} onChange={v => set('is_home_based', v)}
          options={[{ value: 'apartment', label: 'דירה' }, { value: 'house', label: 'בית פרטי' }]} />
      </Field>
      <Field label="יש חצר?">
        <RadioGroup value={form.has_yard} onChange={v => set('has_yard', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="יש חיות נוספות בבית?">
        <RadioGroup value={form.has_other_pets} onChange={v => set('has_other_pets', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="הכלבים ישנים בתוך הבית?">
        <RadioGroup value={form.indoor_sleeping} onChange={v => set('indoor_sleeping', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="כמה כלבים אפשר לארח במקביל?">
        <input type="number" value={form.boarding_max_pets} onChange={e => set('boarding_max_pets', e.target.value)}
          placeholder="לדוגמה: 2" min={1} dir="ltr"
          className="w-24 px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]" />
      </Field>
      <Field label="אילו גדלי כלבים מתקבלים?">
        <CheckboxGroup values={form.boarding_dog_sizes} onChange={v => set('boarding_dog_sizes', v)} options={DOG_SIZES} />
      </Field>
    </div>
  );
}

function SittingSection({ form, set }: { form: FormData; set: SetFn }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏡 האוסיטינג - על השירות שלכם</SectionHeader>
      <Field label="לאילו חיות אתם מגיעים?">
        <CheckboxGroup values={form.sitting_animals} onChange={v => set('sitting_animals', v)}
          options={['כלבים', 'חתולים', 'ציפורים ומכרסמים', 'אחר']} />
      </Field>
      <Field label="האם נשארים ללינה?">
        <RadioGroup value={form.sitting_overnight} onChange={v => set('sitting_overnight', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }, { value: 'on_request', label: 'לפי בקשה' }]} />
      </Field>
    </div>
  );
}

function WalkingSection({ form, set }: { form: FormData; set: SetFn }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🦮 דוגווקר - על הטיולים שלכם</SectionHeader>
      <Field label="סוג הטיול:">
        <RadioGroup value={form.walk_type} onChange={v => set('walk_type', v)}
          options={[{ value: 'private', label: 'פרטי בלבד' }, { value: 'group', label: 'קבוצתי' }, { value: 'both', label: 'שניהם' }]} />
      </Field>
      <Field label="אילו גדלי כלבים אתם מטיילים?">
        <CheckboxGroup values={form.walk_dog_sizes} onChange={v => set('walk_dog_sizes', v)} options={DOG_SIZES} />
      </Field>
      <Field label="ימים זמינים:">
        <CheckboxGroup values={form.available_days} onChange={v => set('available_days', v)} options={DAYS} />
      </Field>
      <Field label="משך טיול:">
        <Select value={form.walk_duration} onChange={v => set('walk_duration', v)} placeholder="בחרו משך"
          options={[{ value: '30', label: '30 דקות' }, { value: '45', label: '45 דקות' }, { value: '60', label: 'שעה' }, { value: '90', label: 'שעה וחצי' }]} />
      </Field>
    </div>
  );
}

function VisitingSection({ form, set }: { form: FormData; set: SetFn }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏠 ביקורי בית - על השירות שלכם</SectionHeader>
      <Field label="לאילו חיות אתם מגיעים?">
        <CheckboxGroup values={form.visiting_animals} onChange={v => set('visiting_animals', v)}
          options={['כלבים', 'חתולים', 'ציפורים', 'אחר']} />
      </Field>
      <Field label="כמה ביקורים ביום אפשריים?">
        <Select value={form.visiting_per_day} onChange={v => set('visiting_per_day', v)} placeholder="בחרו"
          options={[{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: 'flexible', label: 'גמיש' }]} />
      </Field>
      <Field label="זמינות:">
        <CheckboxGroup values={form.visiting_availability} onChange={v => set('visiting_availability', v)}
          options={['בוקר', 'צהריים', 'ערב', 'סופי שבוע']} />
      </Field>
    </div>
  );
}

function PensionSection({ form, set, errors }: { form: FormData; set: SetFn; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏢 פנסיון - על המקום שלכם</SectionHeader>
      <Field label="שם הפנסיון">
        <Input value={form.pension_name} onChange={v => set('pension_name', v)} placeholder="שם הפנסיון" />
      </Field>
      <Field label="סוג המקום:">
        <RadioGroup value={form.pension_type} onChange={v => set('pension_type', v)}
          options={[{ value: 'home', label: 'ביתי' }, { value: 'professional', label: 'מקצועי' }, { value: 'farm', label: 'חווה' }]} />
      </Field>
      <Field label="כמה כלבים אפשר לארח?">
        <input type="number" value={form.pension_max_pets} onChange={e => set('pension_max_pets', e.target.value)}
          placeholder="לדוגמה: 10" min={1} dir="ltr"
          className="w-24 px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]" />
      </Field>
      <Field label="יש הפרדה בין כלבים?">
        <RadioGroup value={form.pension_separation} onChange={v => set('pension_separation', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="יש חצר?">
        <RadioGroup value={form.pension_has_yard} onChange={v => set('pension_has_yard', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="אילו גדלי כלבים מתקבלים?">
        <CheckboxGroup values={form.pension_dog_sizes} onChange={v => set('pension_dog_sizes', v)} options={DOG_SIZES} />
      </Field>
      <Field label="מה כלול בשהייה:">
        <CheckboxGroup values={form.pension_inclusions} onChange={v => set('pension_inclusions', v)}
          options={['טיולים יומיים', 'עדכונים ותמונות', 'זמן משחק', 'מתן תרופות', 'שינה בתוך הבית']} />
      </Field>
      <Field label="איך נראה יום טיפוסי אצלכם?" required>
        <Textarea value={form.pension_description} onChange={v => set('pension_description', v)}
          placeholder="ספרו על שגרת היום, הטיולים, האוכל..." rows={4} />
        {errors.pension_description && <p className="text-[#EF4444] text-xs mt-1">{errors.pension_description}</p>}
      </Field>
    </div>
  );
}

function VetSection({ form, set, errors }: { form: FormData; set: SetFn; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🩺 וטרינר - על השירות שלכם</SectionHeader>
      <Field label="סוג השירות:">
        <RadioGroup value={form.vet_type} onChange={v => set('vet_type', v)}
          options={[{ value: 'clinic', label: 'מרפאה בלבד' }, { value: 'mobile', label: 'ביקורי בית בלבד' }, { value: 'both', label: 'גם וגם' }]} />
      </Field>
      <Field label="שם המרפאה">
        <Input value={form.vet_clinic_name} onChange={v => set('vet_clinic_name', v)} placeholder="מרפאה וטרינרית ..." />
      </Field>
      {(form.vet_type === 'clinic' || form.vet_type === 'both') && (
        <Field label="כתובת המרפאה">
          <Input value={form.vet_clinic_address} onChange={v => set('vet_clinic_address', v)} placeholder="רחוב, עיר" />
        </Field>
      )}
      <Field label="מספר רישיון (אופציונלי)">
        <Input value={form.vet_license} onChange={v => set('vet_license', v)} placeholder="מספר רישיון" dir="ltr" />
      </Field>
      <Field label="שירות חירום?">
        <RadioGroup value={form.vet_emergency} onChange={v => set('vet_emergency', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="שירותים:">
        <CheckboxGroup values={form.vet_services} onChange={v => set('vet_services', v)}
          options={['חיסונים', 'בדיקות שגרתיות', 'שבבים', 'ניתוחים', 'דרמטולוגיה', 'שיניים', 'אחר']} />
      </Field>
      <Field label="תחומי התמחות:">
        <CheckboxGroup values={form.vet_specializations} onChange={v => set('vet_specializations', v)} options={VET_SPECS} />
      </Field>
      <Field label="ספרו קצת עליכם ועל השירות שלכם" required>
        <Textarea value={form.vet_description} onChange={v => set('vet_description', v)}
          placeholder="הניסיון שלכם, הגישה, מה מייחד את השירות..." rows={4} />
        {errors.vet_description && <p className="text-[#EF4444] text-xs mt-1">{errors.vet_description}</p>}
      </Field>
    </div>
  );
}

function TrainingSection({ form, set, errors }: { form: FormData; set: SetFn; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🎓 אילוף - על השירות שלכם</SectionHeader>
      <Field label="סוגי אילוף:">
        <CheckboxGroup values={form.training_types} onChange={v => set('training_types', v)}
          options={['הכשרת גורים', 'ציות בסיסי', 'טיפול בפחדים', 'אילוף ספורטיבי', 'שיטות חיוביות בלבד']} />
      </Field>
      <Field label="האילוף מתבצע:">
        <RadioGroup value={form.training_location} onChange={v => set('training_location', v)}
          options={[{ value: 'client_home', label: 'בבית הלקוח' }, { value: 'trainer_home', label: 'בבית המאלף' }, { value: 'both', label: 'שניהם' }]} />
      </Field>
      <Field label="כמה זמן אתם מאלפים?">
        <Select value={form.training_experience} onChange={v => set('training_experience', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ספרו על שיטת העבודה שלכם" required>
        <Textarea value={form.training_description} onChange={v => set('training_description', v)}
          placeholder="אני עובד/ת עם שיטות חיוביות בלבד..." rows={4} />
        {errors.training_description && <p className="text-[#EF4444] text-xs mt-1">{errors.training_description}</p>}
      </Field>
    </div>
  );
}

function GroomingSection({ form, set, errors }: { form: FormData; set: SetFn; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-5">
      <SectionHeader>✂️ טיפוח - על השירות שלכם</SectionHeader>
      <Field label="סוג השירות:">
        <RadioGroup value={form.grooming_type} onChange={v => set('grooming_type', v)}
          options={[{ value: 'salon', label: 'מספרה קבועה' }, { value: 'mobile', label: 'ניידת' }, { value: 'both', label: 'שניהם' }]} />
      </Field>
      <Field label="סוגי טיפולים:">
        <CheckboxGroup values={form.grooming_services} onChange={v => set('grooming_services', v)}
          options={['רחצה', 'תספורת', 'ניקוי אוזניים', 'חיתוך ציפורניים', 'טיפול בשיניים', 'עיצוב']} />
      </Field>
      <Field label="אילו גדלים מטפלים?">
        <CheckboxGroup values={form.grooming_dog_sizes} onChange={v => set('grooming_dog_sizes', v)} options={DOG_SIZES} />
      </Field>
      <Field label="כמה זמן אתם עוסקים בטיפוח?">
        <Select value={form.grooming_experience} onChange={v => set('grooming_experience', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ספרו קצת עליכם" required>
        <Textarea value={form.grooming_description} onChange={v => set('grooming_description', v)}
          placeholder="הניסיון שלכם, הגישה, מה מייחד אתכם..." rows={4} />
        {errors.grooming_description && <p className="text-[#EF4444] text-xs mt-1">{errors.grooming_description}</p>}
      </Field>
    </div>
  );
}

function InsuranceSection({ form, set, errors }: { form: FormData; set: SetFn; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🛡️ ביטוח - פרטי החברה</SectionHeader>
      <Field label="שם החברה">
        <Input value={form.company_name} onChange={v => set('company_name', v)} placeholder="שם חברת הביטוח" />
      </Field>
      <Field label="סוגי ביטוחים">
        <Input value={form.insurance_types_text} onChange={v => set('insurance_types_text', v)} placeholder="לדוגמה: ביטוח בריאות, ביטוח חיים" />
      </Field>
      <Field label="איש קשר">
        <Input value={form.contact_person} onChange={v => set('contact_person', v)} placeholder="שם ותפקיד" />
      </Field>
      <Field label="ספרו קצת על השירות שלכם" required>
        <Textarea value={form.insurance_description} onChange={v => set('insurance_description', v)}
          placeholder="הכיסויים שאתם מציעים, מה מייחד אתכם..." rows={4} />
        {errors.insurance_description && <p className="text-[#EF4444] text-xs mt-1">{errors.insurance_description}</p>}
      </Field>
    </div>
  );
}

function OtherSection({ form, set, errors }: { form: FormData; set: SetFn; errors: Partial<Record<keyof FormData, string>> }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🐾 שירות אחר</SectionHeader>
      <Field label="תארו את השירות שאתם מציעים" required>
        <Textarea value={form.other_description} onChange={v => set('other_description', v)}
          placeholder="ספרו לנו מה אתם עושים, למי זה מתאים, ומה מייחד אתכם..." rows={6} />
        {errors.other_description && <p className="text-[#EF4444] text-xs mt-1">{errors.other_description}</p>}
      </Field>
    </div>
  );
}

function Step2ServiceFields({
  services, form, set, errors,
}: {
  services: ServiceType[];
  form: FormData;
  set: SetFn;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  const hasPetCare = services.some(s => PET_CARE_SERVICES.includes(s));
  return (
    <div className="space-y-8">
      {hasPetCare && <SharedPetCareSection form={form} set={set} />}
      {errors.shared_description && (
        <p className="text-[#EF4444] text-xs -mt-4">{errors.shared_description}</p>
      )}
      {services.includes('boarding') && <BoardingSection form={form} set={set} />}
      {services.includes('sitting') && <SittingSection form={form} set={set} />}
      {services.includes('walking') && <WalkingSection form={form} set={set} />}
      {services.includes('visiting') && <VisitingSection form={form} set={set} />}
      {services.includes('pension') && <PensionSection form={form} set={set} errors={errors} />}
      {services.includes('vet') && <VetSection form={form} set={set} errors={errors} />}
      {services.includes('training') && <TrainingSection form={form} set={set} errors={errors} />}
      {services.includes('grooming') && <GroomingSection form={form} set={set} errors={errors} />}
      {services.includes('insurance') && <InsuranceSection form={form} set={set} errors={errors} />}
      {services.includes('other') && <OtherSection form={form} set={set} errors={errors} />}
    </div>
  );
}

// ─── Step 3: Media ────────────────────────────────────────────────────────────

function Step3Media({ mediaFiles, setMediaFiles }: {
  mediaFiles: UploadedFile[];
  setMediaFiles: (f: UploadedFile[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <FileUpload files={mediaFiles} onChange={setMediaFiles} />
        <p className="text-xs text-[#9CA3AF] mt-2 text-center">
          תמונות מהבית, עם כלבים, מהחצר - כל תמונה עוזרת
        </p>
      </div>
      <div className="flex items-start gap-3 p-4 bg-[#E8F5EE] rounded-xl">
        <div className="w-5 h-5 rounded-full bg-[#2D7D5A] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
        </div>
        <p className="text-sm text-[#374151] leading-relaxed">
          כל פרופיל עובר בדיקה ידנית על ידי צוות Rokko לפני שהוא מופיע באתר. נחזור אליכם בתוך מספר ימי עסקים.
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function JoinPageInner() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get('type') as ServiceType | null;

  const [screen, setScreen] = useState<Screen>('step1');
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(
    urlType && SERVICES.some(s => s.id === urlType) ? [urlType] : []
  );
  const [form, setForm] = useState<FormData>({ ...defaultForm });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);
  const [sameWhatsapp, setSameWhatsapp] = useState(true);

  const setField: SetFn = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goTo = (s: Screen) => { setScreen(s); scrollTop(); };

  const toggleService = (s: ServiceType) =>
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const validateStep1 = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.full_name.trim()) e.full_name = 'שם מלא נדרש';
    if (!form.phone.trim()) e.phone = 'טלפון נדרש';
    if (!form.email.trim()) e.email = 'אימייל נדרש';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'אימייל לא תקין';
    if (!form.city.trim()) e.city = 'עיר נדרשת';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (selectedServices.some(s => PET_CARE_SERVICES.includes(s)) && !form.shared_description.trim())
      e.shared_description = 'תיאור נדרש';
    if (selectedServices.includes('pension') && !form.pension_description.trim())
      e.pension_description = 'תיאור נדרש';
    if (selectedServices.includes('vet') && !form.vet_description.trim())
      e.vet_description = 'תיאור נדרש';
    if (selectedServices.includes('training') && !form.training_description.trim())
      e.training_description = 'תיאור נדרש';
    if (selectedServices.includes('grooming') && !form.grooming_description.trim())
      e.grooming_description = 'תיאור נדרש';
    if (selectedServices.includes('insurance') && !form.insurance_description.trim())
      e.insurance_description = 'תיאור נדרש';
    if (selectedServices.includes('other') && !form.other_description.trim())
      e.other_description = 'תיאור נדרש';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const primaryDescription =
        form.shared_description ||
        form.pension_description ||
        form.vet_description ||
        form.training_description ||
        form.grooming_description ||
        form.insurance_description ||
        form.other_description || '';

      const payload = {
        services: selectedServices,
        provider_type: selectedServices[0] ?? 'other',
        full_name: form.full_name,
        business_name: form.business_name || null,
        phone: form.phone,
        whatsapp: sameWhatsapp ? form.phone : form.whatsapp,
        email: form.email,
        city: form.city,
        service_areas: form.service_areas || null,
        social_instagram: form.social_instagram || null,
        social_facebook: form.social_facebook || null,
        social_website: form.social_website || null,
        description: primaryDescription,
        notes: form.notes || null,
        media_urls: mediaFiles.filter(f => f.url).map(f => f.url),
        service_specific_fields: {
          shared_pet_care: selectedServices.some(s => PET_CARE_SERVICES.includes(s)) ? {
            experience_years: form.shared_experience_years,
            animal_experience: form.shared_animal_experience,
            availability: form.shared_availability,
            description: form.shared_description,
          } : undefined,
          ...(selectedServices.includes('boarding') && {
            boarding: {
              is_home_based: form.is_home_based,
              has_yard: form.has_yard,
              has_other_pets: form.has_other_pets,
              indoor_sleeping: form.indoor_sleeping,
              max_pets: form.boarding_max_pets,
              dog_sizes: form.boarding_dog_sizes,
            },
          }),
          ...(selectedServices.includes('sitting') && {
            sitting: { animals: form.sitting_animals, overnight: form.sitting_overnight },
          }),
          ...(selectedServices.includes('walking') && {
            walking: {
              walk_type: form.walk_type,
              dog_sizes: form.walk_dog_sizes,
              available_days: form.available_days,
              duration: form.walk_duration,
            },
          }),
          ...(selectedServices.includes('visiting') && {
            visiting: {
              animals: form.visiting_animals,
              per_day: form.visiting_per_day,
              availability: form.visiting_availability,
            },
          }),
          ...(selectedServices.includes('pension') && {
            pension: {
              name: form.pension_name,
              type: form.pension_type,
              max_pets: form.pension_max_pets,
              separation: form.pension_separation,
              has_yard: form.pension_has_yard,
              dog_sizes: form.pension_dog_sizes,
              inclusions: form.pension_inclusions,
              description: form.pension_description,
            },
          }),
          ...(selectedServices.includes('vet') && {
            vet: {
              type: form.vet_type,
              clinic_name: form.vet_clinic_name,
              clinic_address: form.vet_clinic_address,
              license: form.vet_license,
              emergency: form.vet_emergency,
              services: form.vet_services,
              specializations: form.vet_specializations,
              description: form.vet_description,
            },
          }),
          ...(selectedServices.includes('training') && {
            training: {
              types: form.training_types,
              location: form.training_location,
              experience: form.training_experience,
              description: form.training_description,
            },
          }),
          ...(selectedServices.includes('grooming') && {
            grooming: {
              type: form.grooming_type,
              services: form.grooming_services,
              dog_sizes: form.grooming_dog_sizes,
              experience: form.grooming_experience,
              description: form.grooming_description,
            },
          }),
          ...(selectedServices.includes('insurance') && {
            insurance: {
              company_name: form.company_name,
              types: form.insurance_types_text,
              contact_person: form.contact_person,
              description: form.insurance_description,
            },
          }),
          ...(selectedServices.includes('other') && {
            other: { description: form.other_description },
          }),
        },
        utm_type: searchParams.get('type'),
        utm_source: searchParams.get('source'),
        utm_campaign: searchParams.get('campaign'),
        utm_owner: searchParams.get('outreach_owner'),
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('שגיאה בשליחה');
      goTo('done');
    } catch {
      alert('אירעה שגיאה. אנא נסו שוב או פנו אלינו ישירות.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepNum = { step1: 1, services: 2, step2: 3, step3: 4, done: 0 }[screen] ?? 0;

  return (
    <main className="min-h-screen bg-[#FAFAF8]" dir="rtl">
      <header className="border-b border-[#E8E8E6] bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <a href="/" className="text-lg font-extrabold text-[#1A1A1A] hover:opacity-80 transition-opacity">
            Rokko
          </a>
        </div>
      </header>

      {screen !== 'done' && (
        <ProgressBar
          step={stepNum}
          total={4}
          onBack={() => {
            if (screen === 'step1') window.history.back();
            else if (screen === 'services') goTo('step1');
            else if (screen === 'step2') goTo('services');
            else if (screen === 'step3') goTo('step2');
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {screen === 'step1' && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-10">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">פרטי קשר</h2>
              <p className="text-sm text-[#6B7280] mb-8">כדי שנוכל לבנות לכם פרופיל ולחזור אליכם</p>
              <Step1Contact form={form} set={setField} errors={errors} sameWhatsapp={sameWhatsapp} setSameWhatsapp={setSameWhatsapp} />
              <div className="hidden sm:block mt-8">
                <button type="button" onClick={() => { if (validateStep1()) goTo('services'); }}
                  className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors">
                  המשך ←
                </button>
              </div>
            </div>
            <BottomBar label="המשך ←" onClick={() => { if (validateStep1()) goTo('services'); }} />
          </motion.div>
        )}

        {screen === 'services' && (
          <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <ServicesScreen
              selected={selectedServices}
              onToggle={toggleService}
              onContinue={() => { if (selectedServices.length > 0) goTo('step2'); }}
            />
          </motion.div>
        )}

        {screen === 'step2' && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-10">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">פרטי השירותים שלכם</h2>
              <p className="text-sm text-[#6B7280] mb-8">
                {selectedServices.length === 1
                  ? 'ספרו לנו קצת על השירות שלכם'
                  : `בחרתם ${selectedServices.length} שירותים - ספרו לנו קצת על כל אחד`}
              </p>
              <Step2ServiceFields services={selectedServices} form={form} set={setField} errors={errors} />
              <div className="hidden sm:block mt-8">
                <button type="button" onClick={() => { if (validateStep2()) goTo('step3'); }}
                  className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors">
                  המשך ←
                </button>
              </div>
            </div>
            <BottomBar label="המשך ←" onClick={() => { if (validateStep2()) goTo('step3'); }} />
          </motion.div>
        )}

        {screen === 'step3' && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-10">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">כמעט סיימנו! 📸</h2>
              <p className="text-sm text-[#6B7280] mb-8">פרופילים עם תמונות מקבלים יותר פניות 🐶</p>
              <Step3Media mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
              <div className="hidden sm:block mt-8">
                <button type="button" onClick={handleSubmit} disabled={submitting}
                  className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'שולחים...' : 'שלחו את הבקשה 🚀'}
                </button>
              </div>
            </div>
            <BottomBar label="שלחו את הבקשה 🚀" onClick={handleSubmit} loading={submitting} />
          </motion.div>
        )}

        {screen === 'done' && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ConfirmationScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8]" />}>
      <JoinPageInner />
    </Suspense>
  );
}
