'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, CheckCircle, Clock, Eye, PawPrint,
  MessageSquare, MapPin, Pencil, X, Check,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type Provider = {
  id: string;
  full_name: string;
  business_name?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  service_areas?: string;
  services: string[];
  description?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_website?: string;
  status: string;
  is_published: boolean;
};

const SERVICE_LABELS: Record<string, string> = {
  boarding: 'דוגסיטר', sitting: 'האוסיטינג', walking: 'דוגווקר',
  visiting: 'ביקורי בית', pension: 'פנסיון', vet: 'וטרינר',
  training: 'אילוף', grooming: 'טיפוח', insurance: 'ביטוח', other: 'אחר',
};

// ─── Status card ──────────────────────────────────────────────────────────────

function StatusCard({ provider }: { provider: Provider }) {
  const config = provider.is_published
    ? { label: 'פורסם באתר', color: 'bg-[#E8F5EE] text-[#2D7D5A]', Icon: CheckCircle }
    : provider.status === 'approved'
    ? { label: 'מאושר — לא פורסם עדיין', color: 'bg-[#D1FAE5] text-[#065F46]', Icon: CheckCircle }
    : { label: 'ממתין לאישור', color: 'bg-[#FEF3C7] text-[#92400E]', Icon: Clock };

  return (
    <div className="bg-white border border-[#E8E8E6] rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
        <config.Icon className="w-5 h-5" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-xs font-semibold text-[#9CA3AF] mb-0.5">סטטוס פרופיל</p>
        <p className={`text-sm font-bold px-2 py-0.5 rounded-lg inline-block ${config.color}`}>
          {config.label}
        </p>
      </div>
    </div>
  );
}

// ─── Editable profile ─────────────────────────────────────────────────────────

function ProfileEditor({ provider, onSaved }: { provider: Provider; onSaved: (p: Provider) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState({
    description: provider.description ?? '',
    city: provider.city ?? '',
    service_areas: provider.service_areas ?? '',
    whatsapp: provider.whatsapp ?? '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/provider/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (res.ok) {
        onSaved(data.provider);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]';

  return (
    <div className="bg-white border border-[#E8E8E6] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#1A1A1A]">הפרופיל שלכם</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm text-[#2D7D5A] font-semibold hover:underline">
            <Pencil className="w-3.5 h-3.5" /> עריכה
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="w-7 h-7 rounded-lg border border-[#E8E8E6] flex items-center justify-center text-[#6B7280] hover:bg-[#F5F5F3]">
              <X className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleSave} disabled={saving}
              className="w-7 h-7 rounded-lg bg-[#2D7D5A] flex items-center justify-center text-white hover:bg-[#236247] disabled:opacity-60">
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Services (display only) */}
        {provider.services?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF] mb-2">שירותים</p>
            <div className="flex flex-wrap gap-1.5">
              {provider.services.map(s => (
                <span key={s} className="px-2.5 py-1 bg-[#E8F5EE] text-[#2D7D5A] rounded-lg text-xs font-medium">
                  {SERVICE_LABELS[s] ?? s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-xs font-semibold text-[#9CA3AF] mb-1.5">תיאור</p>
          {editing ? (
            <textarea
              value={fields.description}
              onChange={e => setFields(f => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="ספרו עליכם..."
              className={`${inputCls} resize-none`}
            />
          ) : (
            <p className="text-sm text-[#374151] leading-relaxed">
              {provider.description || <span className="text-[#9CA3AF]">לא הוזן עדיין</span>}
            </p>
          )}
        </div>

        {/* City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF] mb-1.5">עיר</p>
            {editing ? (
              <input value={fields.city} onChange={e => setFields(f => ({ ...f, city: e.target.value }))}
                placeholder="תל אביב" className={inputCls} />
            ) : (
              <p className="text-sm text-[#374151] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                {provider.city || <span className="text-[#9CA3AF]">—</span>}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF] mb-1.5">אזורי שירות</p>
            {editing ? (
              <input value={fields.service_areas} onChange={e => setFields(f => ({ ...f, service_areas: e.target.value }))}
                placeholder="תל אביב, רמת גן..." className={inputCls} />
            ) : (
              <p className="text-sm text-[#374151]">
                {provider.service_areas || <span className="text-[#9CA3AF]">—</span>}
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <p className="text-xs font-semibold text-[#9CA3AF] mb-1.5">וואטסאפ</p>
          {editing ? (
            <input value={fields.whatsapp} onChange={e => setFields(f => ({ ...f, whatsapp: e.target.value }))}
              placeholder="05X-XXXXXXX" dir="ltr" className={inputCls} />
          ) : (
            <p className="text-sm text-[#374151] dir-ltr">
              {provider.whatsapp || <span className="text-[#9CA3AF]">—</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Leads placeholder ────────────────────────────────────────────────────────

function LeadsSection() {
  return (
    <div className="bg-white border border-[#E8E8E6] rounded-2xl p-5">
      <h2 className="text-base font-bold text-[#1A1A1A] mb-4">פניות</h2>
      <div className="flex flex-col items-center py-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F3] flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6 text-[#9CA3AF]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-[#1A1A1A] mb-1">עדיין אין פניות חדשות</p>
        <p className="text-xs text-[#9CA3AF] max-w-xs leading-relaxed">
          כשבעלי חיות ייצרו איתכם קשר דרך Rokko, הפניות יופיעו כאן.
        </p>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/provider/login'); return; }

      const res = await fetch('/api/provider/me', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (!res.ok) { router.replace('/provider/login'); return; }

      const data = await res.json();
      setProvider(data.provider);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push('/provider/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2D7D5A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!provider) return null;

  const firstName = provider.full_name.split(' ')[0];

  return (
    <main className="min-h-screen bg-[#FAFAF8]" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E8E6] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="text-lg font-extrabold text-[#1A1A1A] hover:opacity-80 transition-opacity">
            Rokko
          </a>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E8F5EE] flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-[#2D7D5A]" strokeWidth={1.5} />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">יציאה</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">שלום {firstName} 👋</h1>
          <p className="text-[#6B7280] text-sm mt-1">ברוכים הבאים לדשבורד שלכם ב-Rokko</p>
        </div>

        {/* Status */}
        <StatusCard provider={provider} />

        {/* Profile editor */}
        <ProfileEditor provider={provider} onSaved={setProvider} />

        {/* Leads */}
        <LeadsSection />

        {/* Preview button */}
        <div className="flex justify-center pb-4">
          <button
            onClick={() => alert('בקרוב — תצוגת הפרופיל הציבורי מוכנה כשנשיק את האתר')}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#E8E8E6] rounded-xl text-sm font-semibold text-[#374151] hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            צפו בפרופיל כפי שיופיע באתר
          </button>
        </div>
      </div>
    </main>
  );
}
