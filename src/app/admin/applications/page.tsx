'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, LogOut, RefreshCw } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type Status = 'pending' | 'needs_info' | 'approved' | 'rejected' | 'published';

type Application = {
  id: string;
  provider_type: string;
  full_name: string;
  business_name?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  city: string;
  service_areas?: string;
  description?: string;
  experience_years?: number;
  social_instagram?: string;
  social_facebook?: string;
  social_website?: string;
  notes?: string;
  category_data?: Record<string, unknown>;
  status: Status;
  utm_source?: string;
  utm_campaign?: string;
  utm_owner?: string;
  submitted_at: string;
  updated_at: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<Status, string> = {
  pending: 'ממתין לבדיקה',
  needs_info: 'נדרש מידע נוסף',
  approved: 'מאושר',
  rejected: 'נדחה',
  published: 'פורסם',
};

const STATUS_COLORS: Record<Status, string> = {
  pending: 'bg-[#FEF3C7] text-[#92400E]',
  needs_info: 'bg-[#EDE9FE] text-[#5B21B6]',
  approved: 'bg-[#D1FAE5] text-[#065F46]',
  rejected: 'bg-[#FEE2E2] text-[#991B1B]',
  published: 'bg-[#E8F5EE] text-[#2D7D5A]',
};

const TYPE_LABELS: Record<string, string> = {
  boarding: 'לינה ביתית', pension: 'פנסיון', walking: 'טיולים / דוג ווקר',
  visiting: 'ביקורי בית', daycare: 'טיפול יומי', vet: 'וטרינר',
  training: 'אילוף', grooming: 'טיפוח', insurance: 'ביטוח', other: 'אחר',
};

// ─── Row expanded detail ─────────────────────────────────────────────────────

function ApplicationDetail({ app, onStatusChange }: {
  app: Application;
  onStatusChange: (id: string, status: Status, note: string) => Promise<void>;
}) {
  const [newStatus, setNewStatus] = useState<Status>(app.status);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onStatusChange(app.id, newStatus, note);
    setSaved(true);
    setNote('');
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const catData = app.category_data ?? {};

  return (
    <div className="bg-[#FAFAF8] border-t border-[#E8E8E6] p-5 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {/* Bio */}
        {app.description && (
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">תיאור</p>
            <p className="text-[#1A1A1A] leading-relaxed">{app.description}</p>
          </div>
        )}

        {/* Service areas */}
        {app.service_areas && (
          <div>
            <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">אזורי שירות</p>
            <p className="text-[#1A1A1A]">{app.service_areas}</p>
          </div>
        )}

        {/* Experience */}
        {app.experience_years && (
          <div>
            <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">ניסיון</p>
            <p className="text-[#1A1A1A]">{app.experience_years} שנים</p>
          </div>
        )}

        {/* Social links */}
        {(app.social_instagram || app.social_facebook || app.social_website) && (
          <div>
            <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">קישורים</p>
            <div className="space-y-1">
              {app.social_instagram && (
                <a href={app.social_instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#2D7D5A] hover:underline text-xs">
                  <ExternalLink className="w-3 h-3" /> Instagram
                </a>
              )}
              {app.social_facebook && (
                <a href={app.social_facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#2D7D5A] hover:underline text-xs">
                  <ExternalLink className="w-3 h-3" /> Facebook
                </a>
              )}
              {app.social_website && (
                <a href={app.social_website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#2D7D5A] hover:underline text-xs">
                  <ExternalLink className="w-3 h-3" /> אתר
                </a>
              )}
            </div>
          </div>
        )}

        {/* UTM */}
        {(app.utm_source || app.utm_campaign || app.utm_owner) && (
          <div>
            <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">Attribution</p>
            <p className="text-[#6B7280] text-xs">
              {[app.utm_source, app.utm_campaign, app.utm_owner].filter(Boolean).join(' / ')}
            </p>
          </div>
        )}

        {/* Category-specific data */}
        {Object.keys(catData).filter(k => {
          const v = catData[k];
          return v !== null && v !== undefined && v !== '' &&
            !(Array.isArray(v) && v.length === 0);
        }).length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">פרטים ספציפיים</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(catData).filter(([, v]) =>
                v !== null && v !== undefined && v !== '' &&
                !(Array.isArray(v) && v.length === 0)
              ).map(([k, v]) => (
                <div key={k} className="bg-white rounded-lg border border-[#E8E8E6] px-3 py-2">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase mb-0.5">{k}</p>
                  <p className="text-xs text-[#1A1A1A]">
                    {Array.isArray(v) ? v.join(', ') : String(v)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {app.notes && (
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold text-[#6B7280] mb-1 uppercase tracking-wide">הערות</p>
            <p className="text-[#1A1A1A] text-sm">{app.notes}</p>
          </div>
        )}
      </div>

      {/* Admin actions */}
      <div className="border-t border-[#E8E8E6] pt-4">
        <p className="text-xs font-semibold text-[#6B7280] mb-3 uppercase tracking-wide">פעולות Admin</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">שינוי סטטוס</label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as Status)}
              className="px-3 py-2 rounded-lg border border-[#E8E8E6] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7D5A]"
            >
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[#374151] mb-1">הערה פנימית / לשלוח למגיש</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="הערה (תישלח במייל אם סטטוס = נדרש מידע נוסף)"
              className="w-full px-3 py-2 rounded-lg border border-[#E8E8E6] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A]"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              saved ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#2D7D5A] text-white hover:bg-[#236247]'
            } disabled:opacity-60`}
          >
            {saving ? 'שומר...' : saved ? 'נשמר' : 'שמירה'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/applications');
    if (res.ok) {
      const data = await res.json();
      setApps(data);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: Status, note: string) => {
    await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_note: note }),
    });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.href = '/admin/login';
  };

  const filtered = filterStatus === 'all' ? apps : apps.filter(a => a.status === filterStatus);

  const counts: Record<string, number> = apps.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#FAFAF8]" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E8E6] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[#1A1A1A]">Rokko</span>
            <span className="text-[#9CA3AF] text-sm">/ Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-2 rounded-lg hover:bg-[#F5F5F3] transition-colors" title="רענן">
              <RefreshCw className="w-4 h-4 text-[#6B7280]" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">
              <LogOut className="w-4 h-4" />
              יציאה
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {([['all', 'הכל', apps.length], ...Object.entries(STATUS_LABELS).map(([k, l]) => [k, l, counts[k] ?? 0])] as [string, string, number][]).map(([k, label, count]) => (
            <button
              key={k}
              onClick={() => setFilterStatus(k as Status | 'all')}
              className={`rounded-xl border p-3 text-right transition-all ${
                filterStatus === k
                  ? 'border-[#2D7D5A] bg-[#E8F5EE]'
                  : 'border-[#E8E8E6] bg-white hover:border-[#2D7D5A]'
              }`}
            >
              <p className="text-2xl font-bold text-[#1A1A1A]">{count}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{label}</p>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-[#9CA3AF] text-sm">טוען...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#9CA3AF] text-sm">אין בקשות</div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8E8E6] overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#F0F0EE] text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
              <span>שם</span>
              <span>קטגוריה</span>
              <span>עיר</span>
              <span>טלפון</span>
              <span>תאריך</span>
              <span>סטטוס</span>
              <span></span>
            </div>

            {filtered.map((app, i) => (
              <div key={app.id} className={i > 0 ? 'border-t border-[#F0F0EE]' : ''}>
                {/* Row */}
                <button
                  className="w-full text-right"
                  onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 hover:bg-[#FAFAF8] transition-colors items-center">
                    {/* Name */}
                    <div>
                      <p className="font-semibold text-sm text-[#1A1A1A]">{app.full_name}</p>
                      {app.business_name && <p className="text-xs text-[#9CA3AF]">{app.business_name}</p>}
                      <p className="text-xs text-[#9CA3AF] md:hidden">{app.email}</p>
                    </div>
                    {/* Category */}
                    <p className="text-sm text-[#374151]">{TYPE_LABELS[app.provider_type] ?? app.provider_type}</p>
                    {/* City */}
                    <p className="text-sm text-[#374151]">{app.city}</p>
                    {/* Phone */}
                    <a href={`tel:${app.phone}`} onClick={e => e.stopPropagation()}
                      className="text-sm text-[#2D7D5A] hover:underline font-medium" dir="ltr">
                      {app.phone}
                    </a>
                    {/* Date */}
                    <p className="text-xs text-[#9CA3AF]">
                      {new Date(app.submitted_at).toLocaleDateString('he-IL')}
                    </p>
                    {/* Status badge */}
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${STATUS_COLORS[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                    {/* Chevron */}
                    <div className="flex justify-center">
                      {expanded === app.id
                        ? <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
                        : <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />}
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded === app.id && (
                  <ApplicationDetail app={app} onStatusChange={handleStatusChange} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
