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

// ─── Types ──────────────────────────────────────────────────────────────────

type ProviderType =
  | 'boarding' | 'sitting' | 'pension' | 'walking' | 'visiting'
  | 'daycare' | 'vet' | 'training' | 'grooming'
  | 'insurance' | 'other';

const CATEGORIES: { id: ProviderType; label: string; sub: string; Icon: React.ElementType }[] = [
  { id: 'boarding',  label: 'דוגסיטר',           sub: 'שמירה בבית של הדוגסיטר',         Icon: BedDouble },
  { id: 'sitting',   label: 'האוסיטינג',          sub: 'שמירה בבית הלקוח',               Icon: Home },
  { id: 'walking',   label: 'דוגווקר',           sub: 'טיולים והוצאת כלבים',             Icon: Footprints },
  { id: 'visiting',  label: 'ביקורי בית',         sub: 'ביקורים קצרים בבית הלקוח',       Icon: Clock },
  { id: 'pension',   label: 'פנסיון',            sub: 'אירוח לכלבים',                   Icon: Sun },
  { id: 'vet',       label: 'וטרינר עד הבית',    sub: 'שירות וטרינרי בבית הלקוח',       Icon: Stethoscope },
  { id: 'training',  label: 'אילוף',             sub: 'אילוף וטיפול התנהגותי',           Icon: Dumbbell },
  { id: 'grooming',  label: 'טיפוח',             sub: 'תספורת, רחצה וטיפול שוטף',       Icon: Scissors },
  { id: 'insurance', label: 'ביטוח לחיות מחמד',  sub: 'כיסוי וטרינרי וביטוחי חיים',     Icon: Shield },
  { id: 'other',     label: 'אחר',               sub: 'שירות שלא מופיע ברשימה',          Icon: HelpCircle },
];

const TYPE_LABELS: Record<ProviderType, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.id, c.label])
) as Record<ProviderType, string>;

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const DOG_SIZES = ['זעיר (עד 5 ק״ג)', 'קטן (5–10 ק״ג)', 'בינוני (10–25 ק״ג)', 'גדול (25–45 ק״ג)', 'ענק (45+ ק״ג)'];
const VET_SPECS = ['רפואה כללית', 'כירורגיה', 'דרמטולוגיה', 'קרדיולוגיה', 'אורתופדיה', 'אונקולוגיה', 'עיניים', 'שיניים', 'אקזוטיים'];
const EXPERIENCE_OPTIONS = [
  { value: 'less_than_1', label: 'פחות משנה' },
  { value: '1_3', label: '1–3 שנים' },
  { value: '3_5', label: '3–5 שנים' },
  { value: '5_plus', label: '5+ שנים' },
];

// ─── Form state type ─────────────────────────────────────────────────────────

type FormData = {
  // common
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
  description: string;
  experience_years: string;
  notes: string;
  // boarding / pension
  is_home_based: string;
  has_yard: string;
  has_other_pets: string;
  max_pets: string;
  dog_sizes: string[];
  indoor_sleeping: string;
  // walking
  available_days: string[];
  walk_duration: string;
  walk_type: string;
  // vet
  clinic_name: string;
  clinic_address: string;
  working_hours: string;
  has_emergency: string;
  vet_specializations: string[];
  vet_type: string;
  vet_services: string[];
  license_number: string;
  // insurance
  company_name: string;
  insurance_types: string;
  contact_person: string;
  // pension
  pension_type: string;
  pension_inclusions: string[];
  pension_separation: string;
  // sitting
  sitting_animals: string[];
  sitting_overnight: string;
  sitting_visits_per_day: string;
  sitting_availability: string[];
  // training
  training_types: string[];
  training_location: string;
  // grooming
  grooming_type: string;
  grooming_services: string[];
  // dog experience
  dogs_experience: string[];
};

const defaultForm: FormData = {
  full_name: '', business_name: '', phone: '', whatsapp: '', email: '',
  city: '', service_areas: '', social_instagram: '', social_facebook: '',
  social_website: '', description: '', experience_years: '', notes: '',
  is_home_based: '', has_yard: '', has_other_pets: '', max_pets: '',
  dog_sizes: [], indoor_sleeping: '',
  available_days: [], walk_duration: '', walk_type: '',
  clinic_name: '', clinic_address: '', working_hours: '', has_emergency: '',
  vet_specializations: [], vet_type: '', vet_services: [], license_number: '',
  company_name: '', insurance_types: '', contact_person: '',
  pension_type: '', pension_inclusions: '', pension_separation: '',
  sitting_animals: [], sitting_overnight: '', sitting_visits_per_day: '', sitting_availability: [],
  training_types: [], training_location: '',
  grooming_type: '', grooming_services: [],
  dogs_experience: [],
} as unknown as FormData;

// ─── UI Helpers ──────────────────────────────────────────────────────────────

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

// ─── File Upload ─────────────────────────────────────────────────────────────

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
        <p className="text-xs text-[#9CA3AF] mt-1">תמונות וסרטונים — עד 50MB לקובץ</p>
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

// ─── Progress Indicator ───────────────────────────────────────────────────────

function ProgressBar({
  step, total, type, onBack,
}: {
  step: number; total: number; type: ProviderType; onBack: () => void;
}) {
  const cat = CATEGORIES.find(c => c.id === type)!;
  const Icon = cat.Icon;
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
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="w-7 h-7 rounded-lg bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-[#2D7D5A]" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-semibold text-[#1A1A1A] truncate">{TYPE_LABELS[type]}</span>
        </div>
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

// ─── Step 2: Service-specific fields ─────────────────────────────────────────

function BoardingStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏠 על הבית שלכם</SectionHeader>
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
        <input
          type="number"
          value={form.max_pets}
          onChange={e => set('max_pets', e.target.value)}
          placeholder="לדוגמה: 2"
          min={1}
          className="w-24 px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]"
          dir="ltr"
        />
      </Field>
      <Field label="אילו גדלי כלבים מתקבלים?">
        <CheckboxGroup values={form.dog_sizes} onChange={v => set('dog_sizes', v)} options={DOG_SIZES} />
      </Field>

      <SectionHeader>🐾 הניסיון שלכם</SectionHeader>
      <Field label="כמה זמן אתם עובדים עם כלבים?">
        <Select value={form.experience_years} onChange={v => set('experience_years', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ניסיון עם:">
        <CheckboxGroup
          values={form.dogs_experience}
          onChange={v => set('dogs_experience', v)}
          options={['גורים', 'כלבים גדולים', 'כלבים מבוגרים', 'מתן תרופות', 'כלבים חרדתיים']}
        />
      </Field>
      <Field label="ספרו קצת עליכם ועל הקשר שלכם לכלבים 🐾" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="אני מטפל/ת בכלבים כבר... אוהב/ת במיוחד..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function SittingStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏡 על השירות שלכם</SectionHeader>
      <Field label="לאילו חיות אתם מגיעים?">
        <CheckboxGroup
          values={form.sitting_animals}
          onChange={v => set('sitting_animals', v)}
          options={['כלבים', 'חתולים', 'ציפורים ומכרסמים', 'אחר']}
        />
      </Field>
      <Field label="האם אתם נשארים ללינה?">
        <RadioGroup
          value={form.sitting_overnight}
          onChange={v => set('sitting_overnight', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }, { value: 'on_request', label: 'לפי בקשה' }]}
        />
      </Field>
      <Field label="כמה ביקורים ביום אפשר לבצע?">
        <Select
          value={form.sitting_visits_per_day}
          onChange={v => set('sitting_visits_per_day', v)}
          placeholder="בחרו"
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: 'flexible', label: 'גמיש' },
          ]}
        />
      </Field>
      <Field label="זמינות:">
        <CheckboxGroup
          values={form.sitting_availability}
          onChange={v => set('sitting_availability', v)}
          options={['בוקר (06-12)', 'צהריים (12-17)', 'ערב (17-22)', 'סוף שבוע']}
        />
      </Field>

      <SectionHeader>🐾 הניסיון שלכם</SectionHeader>
      <Field label="כמה זמן אתם עובדים עם חיות מחמד?">
        <Select value={form.experience_years} onChange={v => set('experience_years', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ניסיון עם:">
        <CheckboxGroup
          values={form.dogs_experience}
          onChange={v => set('dogs_experience', v)}
          options={['חתולים', 'גורים', 'מתן תרופות', 'חרדת נטישה', 'כלבים מיוחדים']}
        />
      </Field>
      <Field label="ספרו קצת על עצמכם ועל איך אתם עובדים" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="ספרו לנו על הגישה שלכם, מה מייחד אותכם..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function WalkingStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🦮 על הטיולים שלכם</SectionHeader>
      <Field label="סוג הטיול:">
        <RadioGroup
          value={form.walk_type}
          onChange={v => set('walk_type', v)}
          options={[
            { value: 'private', label: 'פרטי בלבד' },
            { value: 'group', label: 'קבוצתי' },
            { value: 'both', label: 'שניהם' },
          ]}
        />
      </Field>
      <Field label="אילו גדלי כלבים?">
        <CheckboxGroup values={form.dog_sizes} onChange={v => set('dog_sizes', v)} options={DOG_SIZES} />
      </Field>
      <Field label="ימים זמינים:">
        <CheckboxGroup values={form.available_days} onChange={v => set('available_days', v)} options={DAYS} />
      </Field>
      <Field label="משך טיול:">
        <Select
          value={form.walk_duration}
          onChange={v => set('walk_duration', v)}
          placeholder="בחרו משך"
          options={[
            { value: '30', label: '30 דקות' },
            { value: '45', label: '45 דקות' },
            { value: '60', label: 'שעה' },
            { value: '90', label: 'שעה וחצי' },
          ]}
        />
      </Field>

      <SectionHeader>🐾 הניסיון שלכם</SectionHeader>
      <Field label="כמה זמן אתם עובדים עם כלבים?">
        <Select value={form.experience_years} onChange={v => set('experience_years', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ניסיון עם:">
        <CheckboxGroup
          values={form.dogs_experience}
          onChange={v => set('dogs_experience', v)}
          options={['גורים', 'כלבים חזקים', 'כלבים חרדתיים', 'ריבוי כלבים']}
        />
      </Field>
      <Field label="ספרו קצת עליכם" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="מה אוהבים בעבודה עם כלבים, איך נראה טיול אצלכם..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function PensionStep2({ form, set, daycare }: { form: FormData; set: (k: keyof FormData, v: unknown) => void; daycare?: boolean }) {
  const title = daycare ? '🏢 על המרכז היומי' : '🏢 על הפנסיון';
  return (
    <div className="space-y-5">
      <SectionHeader>{title}</SectionHeader>
      {!daycare && (
        <Field label="שם הפנסיון">
          <Input value={form.clinic_name} onChange={v => set('clinic_name', v)} placeholder="שם הפנסיון" />
        </Field>
      )}
      <Field label="סוג המקום:">
        <RadioGroup
          value={form.pension_type}
          onChange={v => set('pension_type', v)}
          options={[
            { value: 'home', label: 'ביתי' },
            { value: 'professional', label: 'מקצועי' },
            { value: 'farm', label: 'חווה' },
          ]}
        />
      </Field>
      <Field label={daycare ? 'כמה כלבים אפשר לקלוט ביום?' : 'כמה כלבים אפשר לארח?'}>
        <input
          type="number"
          value={form.max_pets}
          onChange={e => set('max_pets', e.target.value)}
          placeholder="לדוגמה: 10"
          min={1}
          className="w-24 px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]"
          dir="ltr"
        />
      </Field>
      <Field label="יש הפרדה בין כלבים?">
        <RadioGroup value={form.pension_separation} onChange={v => set('pension_separation', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="יש חצר?">
        <RadioGroup value={form.has_yard} onChange={v => set('has_yard', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="אילו גדלים מתקבלים?">
        <CheckboxGroup values={form.dog_sizes} onChange={v => set('dog_sizes', v)} options={DOG_SIZES} />
      </Field>

      <SectionHeader>✅ מה כלול בשהייה</SectionHeader>
      <CheckboxGroup
        values={form.pension_inclusions}
        onChange={v => set('pension_inclusions', v)}
        options={['טיולים יומיים', 'עדכונים ותמונות', 'זמן משחק', 'מתן תרופות', 'שינה בתוך הבית']}
      />
      <Field label={daycare ? 'איך נראה יום טיפוסי אצלכם?' : 'איך נראה היום של הכלבים אצלכם?'} required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="ספרו על שגרת היום, הטיולים, האוכל..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function VetStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🩺 על השירות שלכם</SectionHeader>
      <Field label="סוג השירות:">
        <RadioGroup
          value={form.vet_type}
          onChange={v => set('vet_type', v)}
          options={[
            { value: 'clinic', label: 'מרפאה בלבד' },
            { value: 'mobile', label: 'ביקורי בית בלבד' },
            { value: 'both', label: 'גם וגם' },
          ]}
        />
      </Field>
      <Field label="שם המרפאה">
        <Input value={form.clinic_name} onChange={v => set('clinic_name', v)} placeholder="מרפאה וטרינרית ..." />
      </Field>
      {(form.vet_type === 'clinic' || form.vet_type === 'both') && (
        <Field label="כתובת המרפאה">
          <Input value={form.clinic_address} onChange={v => set('clinic_address', v)} placeholder="רחוב, עיר" />
        </Field>
      )}
      <Field label="מספר רישיון (אופציונלי)">
        <Input value={form.license_number} onChange={v => set('license_number', v)} placeholder="מספר רישיון" dir="ltr" />
      </Field>
      <Field label="שירות חירום?">
        <RadioGroup value={form.has_emergency} onChange={v => set('has_emergency', v)}
          options={[{ value: 'yes', label: 'כן' }, { value: 'no', label: 'לא' }]} />
      </Field>
      <Field label="שירותים:">
        <CheckboxGroup
          values={form.vet_services}
          onChange={v => set('vet_services', v)}
          options={['חיסונים', 'בדיקות שגרתיות', 'שבבים', 'ניתוחים', 'דרמטולוגיה', 'שיניים', 'אחר']}
        />
      </Field>
      <Field label="תחומי התמחות:">
        <CheckboxGroup values={form.vet_specializations} onChange={v => set('vet_specializations', v)} options={VET_SPECS} />
      </Field>
      <Field label="ספרו קצת עליכם ועל השירות שלכם" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="הניסיון שלכם, הגישה, מה מייחד את השירות..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function TrainingStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🎓 על האילוף שלכם</SectionHeader>
      <Field label="סוג האילוף:">
        <CheckboxGroup
          values={form.training_types}
          onChange={v => set('training_types', v)}
          options={['הכשרת גורים', 'ציות בסיסי', 'טיפול בפחדים', 'אילוף ספורטיבי', 'שיטות חיוביות בלבד']}
        />
      </Field>
      <Field label="האילוף מתבצע:">
        <RadioGroup
          value={form.training_location}
          onChange={v => set('training_location', v)}
          options={[
            { value: 'client_home', label: 'בבית הלקוח' },
            { value: 'trainer_home', label: 'בבית המאלף' },
            { value: 'both', label: 'שניהם' },
          ]}
        />
      </Field>
      <Field label="כמה זמן אתם מאלפים?">
        <Select value={form.experience_years} onChange={v => set('experience_years', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ספרו על שיטת העבודה שלכם" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="אני עובד/ת עם שיטות חיוביות בלבד..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function GroomingStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>✂️ על הטיפוח שלכם</SectionHeader>
      <Field label="סוג השירות:">
        <RadioGroup
          value={form.grooming_type}
          onChange={v => set('grooming_type', v)}
          options={[
            { value: 'salon', label: 'מספרה קבועה' },
            { value: 'mobile', label: 'ניידת' },
            { value: 'both', label: 'שניהם' },
          ]}
        />
      </Field>
      <Field label="סוגי טיפולים:">
        <CheckboxGroup
          values={form.grooming_services}
          onChange={v => set('grooming_services', v)}
          options={['רחצה', 'תספורת', 'ניקוי אוזניים', 'חיתוך ציפורניים', 'טיפול בשיניים', 'עיצוב']}
        />
      </Field>
      <Field label="אילו גדלים מטפלים?">
        <CheckboxGroup values={form.dog_sizes} onChange={v => set('dog_sizes', v)} options={DOG_SIZES} />
      </Field>
      <Field label="כמה זמן אתם עוסקים בטיפוח?">
        <Select value={form.experience_years} onChange={v => set('experience_years', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ספרו קצת עליכם" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="הניסיון שלכם, הגישה, מה מייחד אתכם..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function VisitingStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏠 על השירות שלכם</SectionHeader>
      <Field label="לאילו חיות אתם מגיעים?">
        <CheckboxGroup
          values={form.sitting_animals}
          onChange={v => set('sitting_animals', v)}
          options={['כלבים', 'חתולים', 'ציפורים ומכרסמים', 'אחר']}
        />
      </Field>
      <Field label="כמה ביקורים ביום אפשר לבצע?">
        <Select
          value={form.sitting_visits_per_day}
          onChange={v => set('sitting_visits_per_day', v)}
          placeholder="בחרו"
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: 'flexible', label: 'גמיש' },
          ]}
        />
      </Field>
      <Field label="זמינות:">
        <CheckboxGroup
          values={form.sitting_availability}
          onChange={v => set('sitting_availability', v)}
          options={['בוקר (06-12)', 'צהריים (12-17)', 'ערב (17-22)', 'סוף שבוע']}
        />
      </Field>
      <Field label="כמה זמן אתם עוסקים בזה?">
        <Select value={form.experience_years} onChange={v => set('experience_years', v)}
          placeholder="בחרו טווח" options={EXPERIENCE_OPTIONS} />
      </Field>
      <Field label="ספרו קצת עליכם" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="הניסיון שלכם, הגישה, מה מייחד אתכם..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function InsuranceStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🏢 פרטי החברה</SectionHeader>
      <Field label="שם החברה">
        <Input value={form.company_name} onChange={v => set('company_name', v)} placeholder="שם חברת הביטוח" />
      </Field>
      <Field label="סוגי ביטוחים">
        <Input value={form.insurance_types} onChange={v => set('insurance_types', v)} placeholder="לדוגמה: ביטוח בריאות, ביטוח חיים" />
      </Field>
      <Field label="איש קשר">
        <Input value={form.contact_person} onChange={v => set('contact_person', v)} placeholder="שם ותפקיד" />
      </Field>
      <Field label="ספרו קצת על השירות שלכם" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="הכיסויים שאתם מציעים, מה מייחד אתכם..."
          rows={5}
        />
      </Field>
    </div>
  );
}

function OtherStep2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader>🐾 על השירות שלכם</SectionHeader>
      <Field label="תארו את השירות שאתם מציעים" required>
        <Textarea
          value={form.description}
          onChange={v => set('description', v)}
          placeholder="ספרו לנו מה אתם עושים, למי זה מתאים, ומה מייחד אתכם..."
          rows={6}
        />
      </Field>
    </div>
  );
}

function Step2Fields({ type, form, set }: { type: ProviderType; form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  switch (type) {
    case 'boarding': return <BoardingStep2 form={form} set={set} />;
    case 'sitting': return <SittingStep2 form={form} set={set} />;
    case 'walking': return <WalkingStep2 form={form} set={set} />;
    case 'pension': return <PensionStep2 form={form} set={set} />;
    case 'daycare': return <PensionStep2 form={form} set={set} daycare />;
    case 'vet': return <VetStep2 form={form} set={set} />;
    case 'training': return <TrainingStep2 form={form} set={set} />;
    case 'grooming': return <GroomingStep2 form={form} set={set} />;
    case 'visiting': return <VisitingStep2 form={form} set={set} />;
    case 'insurance': return <InsuranceStep2 form={form} set={set} />;
    case 'other': return <OtherStep2 form={form} set={set} />;
    default: return null;
  }
}

function getStep2Title(type: ProviderType): { title: string; subtitle: string } {
  const map: Record<ProviderType, { title: string; subtitle: string }> = {
    boarding:  { title: 'הצטרפו ל-Rokko כדוגסיטר 🐶', subtitle: 'שומרים על כלבים בבית שלכם? בואו נבנה לכם פרופיל שיגרום לבעלי חיות להרגיש בטוחים.' },
    sitting:   { title: 'הצטרפו ל-Rokko כהאוסיטרים 🏡', subtitle: 'מגיעים לבית של בעל החיה? בואו נבנה לכם פרופיל.' },
    walking:   { title: 'הצטרפו ל-Rokko כדוגווקרים 🦮', subtitle: 'מטיילים עם כלבים בשכונה? בואו נבנה לכם פרופיל.' },
    visiting:  { title: 'הצטרפו ל-Rokko לביקורי בית 🏠', subtitle: 'מבקרים בבתים לטיפול קצר? בואו נבנה לכם פרופיל.' },
    pension:   { title: 'הצטרפו ל-Rokko כפנסיון 🐾', subtitle: 'מתחם אירוח לכלבים? בואו נבנה לכם פרופיל מקצועי.' },
    daycare:   { title: 'הצטרפו ל-Rokko כמרכז יומי 🌞', subtitle: 'מרכז יומי לכלבים? בואו נבנה לכם פרופיל מקצועי.' },
    vet:       { title: 'הצטרפו ל-Rokko כווטרינרים 🩺', subtitle: 'מרפאה או ביקורי בית? בואו נבנה לכם פרופיל.' },
    training:  { title: 'הצטרפו ל-Rokko כמאלפים 🎓', subtitle: 'מאלפים כלבים? בואו נבנה לכם פרופיל.' },
    grooming:  { title: 'הצטרפו ל-Rokko כמטפחים ✂️', subtitle: 'טיפוח לכלבים? בואו נבנה לכם פרופיל.' },
    insurance: { title: 'הצטרפו ל-Rokko כחברת ביטוח 🛡️', subtitle: 'ביטוח לחיות מחמד? בואו נבנה לכם פרופיל.' },
    other:     { title: 'הצטרפו ל-Rokko 🐾', subtitle: 'שירות ייחודי לחיות מחמד? בואו נבנה לכם פרופיל.' },
  };
  return map[type];
}

// ─── Category selection screen ────────────────────────────────────────────────

function CategoryScreen({ onSelect }: { onSelect: (t: ProviderType) => void }) {
  const [hovered, setHovered] = useState<ProviderType | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Compact header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-6 pb-5"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1.5 leading-snug">
          איזה שירות אתם מציעים? 🐾
        </h1>
        <p className="text-[#6B7280] text-sm leading-relaxed">
          בחרו את סוג השירות שלכם כדי להתחיל בהצטרפות ל-Rokko.
        </p>
      </motion.div>

      {/* 2-col compact grid on mobile, 2-col on desktop too */}
      <div className="grid grid-cols-2 gap-2.5 pb-8">
        {CATEGORIES.map(({ id, label, sub, Icon }, i) => {
          const isActive = hovered === id;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.22 }}
              className={`flex flex-col items-end text-right p-3.5 rounded-2xl border-2 transition-all duration-150 active:scale-[0.97] ${
                isActive
                  ? 'border-[#2D7D5A] bg-[#E8F5EE] shadow-[0_2px_12px_rgba(45,125,90,0.15)]'
                  : 'border-[#EBEBEA] bg-white hover:border-[#2D7D5A] hover:bg-[#F4FBF7]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                isActive ? 'bg-[#2D7D5A]' : 'bg-[#F5F5F3]'
              }`}>
                <Icon
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-[#6B7280]'}`}
                  strokeWidth={1.5}
                />
              </div>
              <p className={`font-semibold text-sm leading-none mb-1 transition-colors ${
                isActive ? 'text-[#2D7D5A]' : 'text-[#1A1A1A]'
              }`}>
                {label}
              </p>
              <p className="text-[#9CA3AF] text-[11px] leading-snug">{sub}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Contact info ─────────────────────────────────────────────────────

function Step1Contact({
  form, set, errors, sameWhatsapp, setSameWhatsapp,
}: {
  form: FormData;
  set: (k: keyof FormData, v: unknown) => void;
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
        <Input
          value={form.service_areas}
          onChange={v => set('service_areas', v)}
          placeholder="לדוגמה: תל אביב, רמת גן, גבעתיים"
        />
      </Field>
    </div>
  );
}

// ─── Step 3: Media + submit ───────────────────────────────────────────────────

function Step3Media({
  form, set, mediaFiles, setMediaFiles,
}: {
  form: FormData;
  set: (k: keyof FormData, v: unknown) => void;
  mediaFiles: UploadedFile[];
  setMediaFiles: (f: UploadedFile[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <FileUpload files={mediaFiles} onChange={setMediaFiles} />
        <p className="text-xs text-[#9CA3AF] mt-2 text-center">
          תמונות מהבית, עם כלבים, מהחצר — כל תמונה עוזרת
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#1A1A1A] mb-3">קישורים</p>
        <div className="space-y-3">
          <Input value={form.social_instagram} onChange={v => set('social_instagram', v)} placeholder="אינסטגרם (instagram.com/...)" dir="ltr" />
          <Input value={form.social_facebook} onChange={v => set('social_facebook', v)} placeholder="פייסבוק (facebook.com/...)" dir="ltr" />
          <Input value={form.social_website} onChange={v => set('social_website', v)} placeholder="אתר אינטרנט" dir="ltr" />
        </div>
      </div>

      <Field label="הערות נוספות">
        <Textarea
          value={form.notes}
          onChange={v => set('notes', v)}
          placeholder="כל מה שחשוב לכם שנדע ולא הופיע בשאלות"
          rows={3}
        />
      </Field>

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

// ─── Confirmation screen ──────────────────────────────────────────────────────

function ConfirmationScreen() {
  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-8">
          <Check className="w-9 h-9 text-[#2D7D5A]" strokeWidth={2} />
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 leading-snug">
          איזה כיף שהצטרפתם ל-Rokko 🐾
        </h2>

        {/* Sub text */}
        <p className="text-[#6B7280] text-base leading-relaxed mb-2 max-w-sm mx-auto">
          קיבלנו את הבקשה שלכם ואנחנו עוברים עכשיו על הפרטים כדי לשמור על קהילה איכותית ובטוחה לכולם.
        </p>
        <p className="text-[#6B7280] text-base leading-relaxed mb-10">
          נחזור אליכם בקרוב עם עדכון.
        </p>

        {/* Trust card */}
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

        {/* Bottom reassurance */}
        <p className="text-[#9CA3AF] text-xs">
          הפרטים שלכם נשמרים בצורה מאובטחת.
        </p>
      </motion.div>
    </div>
  );
}

// ─── Bottom action bar ────────────────────────────────────────────────────────

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

// ─── Main component ───────────────────────────────────────────────────────────

type Screen = 'category' | 'step1' | 'step2' | 'step3' | 'done';

function JoinPageInner() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get('type') as ProviderType | null;

  const [screen, setScreen] = useState<Screen>(urlType ? 'step1' : 'category');
  const [providerType, setProviderType] = useState<ProviderType>(urlType ?? 'boarding');
  const [form, setForm] = useState<FormData>({ ...defaultForm });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [mediaFiles, setMediaFiles] = useState<UploadedFile[]>([]);
  const [sameWhatsapp, setSameWhatsapp] = useState(true);

  const setField = (k: keyof FormData, v: unknown) => setForm(prev => ({ ...prev, [k]: v }));

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goTo = (s: Screen) => { setScreen(s); scrollTop(); };

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
    if (!form.description.trim()) e.description = 'תיאור נדרש';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep1 = () => {
    if (!validateStep1()) return;
    goTo('step2');
  };

  const handleNextStep2 = () => {
    if (!validateStep2()) return;
    goTo('step3');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        provider_type: providerType,
        ...form,
        whatsapp: sameWhatsapp ? form.phone : form.whatsapp,
        media_urls: mediaFiles.filter(f => f.url).map(f => f.url),
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

  const selectCategory = (t: ProviderType) => {
    setProviderType(t);
    setErrors({});
    goTo('step1');
  };

  const step2Info = getStep2Title(providerType);

  const isStep = screen === 'step1' || screen === 'step2' || screen === 'step3';
  const stepNum = screen === 'step1' ? 1 : screen === 'step2' ? 2 : screen === 'step3' ? 3 : 0;

  return (
    <main className="min-h-screen bg-[#FAFAF8]" dir="rtl">
      {/* Minimal header */}
      <header className="border-b border-[#E8E8E6] bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <a href="/" className="text-lg font-extrabold text-[#1A1A1A] hover:opacity-80 transition-opacity">
            Rokko
          </a>
        </div>
      </header>

      {/* Progress bar for steps 1-3 */}
      {isStep && (
        <ProgressBar
          step={stepNum}
          total={3}
          type={providerType}
          onBack={() => {
            if (screen === 'step1') goTo('category');
            else if (screen === 'step2') goTo('step1');
            else if (screen === 'step3') goTo('step2');
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {/* Category selection */}
        {screen === 'category' && (
          <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <CategoryScreen onSelect={selectCategory} />
          </motion.div>
        )}

        {/* Step 1: Contact */}
        {screen === 'step1' && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-10">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">פרטי קשר</h2>
              <p className="text-sm text-[#6B7280] mb-8">כדי שנוכל לבנות לכם פרופיל ולחזור אליכם</p>
              <Step1Contact
                form={form}
                set={setField}
                errors={errors}
                sameWhatsapp={sameWhatsapp}
                setSameWhatsapp={setSameWhatsapp}
              />
              {/* Desktop next button */}
              <div className="hidden sm:block mt-8">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors"
                >
                  המשך ←
                </button>
              </div>
            </div>
            <BottomBar label="המשך ←" onClick={handleNextStep1} />
          </motion.div>
        )}

        {/* Step 2: Service-specific */}
        {screen === 'step2' && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-10">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">{step2Info.title}</h2>
              <p className="text-sm text-[#6B7280] mb-8 leading-relaxed">{step2Info.subtitle}</p>
              <Step2Fields type={providerType} form={form} set={setField} />
              {errors.description && (
                <p className="text-[#EF4444] text-xs mt-3">{errors.description}</p>
              )}
              {/* Desktop next button */}
              <div className="hidden sm:block mt-8">
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors"
                >
                  המשך ←
                </button>
              </div>
            </div>
            <BottomBar label="המשך ←" onClick={handleNextStep2} />
          </motion.div>
        )}

        {/* Step 3: Media + Submit */}
        {screen === 'step3' && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-10">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">כמעט סיימנו! 📸</h2>
              <p className="text-sm text-[#6B7280] mb-8">פרופילים עם תמונות מקבלים יותר פניות 🐶</p>
              <Step3Media
                form={form}
                set={setField}
                mediaFiles={mediaFiles}
                setMediaFiles={setMediaFiles}
              />
              {/* Desktop submit button */}
              <div className="hidden sm:block mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'שולחים...' : 'שלחו את הבקשה 🚀'}
                </button>
              </div>
            </div>
            <BottomBar label="שלחו את הבקשה 🚀" onClick={handleSubmit} loading={submitting} />
          </motion.div>
        )}

        {/* Confirmation */}
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
