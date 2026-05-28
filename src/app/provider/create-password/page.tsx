'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PawPrint, Eye, EyeOff, Check } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

type Phase = 'loading' | 'form' | 'success' | 'error';

function CreatePasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [phase, setPhase] = useState<Phase>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [providerName, setProviderName] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    if (!token) { setPhase('error'); setErrorMsg('קישור לא תקין.'); return; }

    fetch(`/api/provider/verify-invite?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setProviderName(data.name);
          setProviderEmail(data.email);
          setPhase('form');
        } else {
          const reasons: Record<string, string> = {
            not_found: 'הקישור לא נמצא.',
            expired: 'הקישור פג תוקף. פנו אלינו לקבלת קישור חדש.',
            already_used: 'הקישור כבר שומש. אפשר להתחבר עם הסיסמה שהגדרתם.',
            already_activated: 'החשבון כבר פעיל. אפשר להתחבר.',
          };
          setErrorMsg(reasons[data.reason] ?? 'קישור לא תקין.');
          setPhase('error');
        }
      })
      .catch(() => { setErrorMsg('שגיאת תקשורת. נסו שוב.'); setPhase('error'); });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');

    if (password.length < 8) { setFieldError('הסיסמה חייבת להכיל לפחות 8 תווים'); return; }
    if (password !== confirm) { setFieldError('הסיסמאות לא תואמות'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/provider/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setFieldError(data.error ?? 'שגיאה. נסו שוב.'); return; }

      // Auto sign-in after activation
      const supabase = getSupabaseClient();
      await supabase.auth.signInWithPassword({ email: providerEmail, password });

      setPhase('success');
      setTimeout(() => router.push('/provider/dashboard'), 1800);
    } catch {
      setFieldError('שגיאת תקשורת. נסו שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="text-xl font-extrabold text-[#1A1A1A]">Rokko</a>
        </div>

        {/* Loading */}
        {phase === 'loading' && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-[#2D7D5A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="bg-white border border-[#E8E8E6] rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] flex items-center justify-center mx-auto mb-5">
              <PawPrint className="w-7 h-7 text-[#EF4444]" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-[#1A1A1A] mb-3">הקישור לא תקין</h1>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">{errorMsg}</p>
            <a href="/provider/login"
              className="inline-block px-6 py-3 bg-[#2D7D5A] text-white rounded-xl font-semibold text-sm hover:bg-[#236247] transition-colors">
              התחברו לחשבון
            </a>
          </div>
        )}

        {/* Form */}
        {phase === 'form' && (
          <div className="bg-white border border-[#E8E8E6] rounded-2xl p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-5">
              <PawPrint className="w-7 h-7 text-[#2D7D5A]" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-[#1A1A1A] mb-1 text-center">
              ברוכים הבאים, {providerName.split(' ')[0]} 🐾
            </h1>
            <p className="text-[#6B7280] text-sm text-center mb-7 leading-relaxed">
              הפרופיל שלכם אושר. הגדירו סיסמה כדי לנהל אותו.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">אימייל</label>
                <input
                  type="email"
                  value={providerEmail}
                  disabled
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-[#F5F5F3] text-[#9CA3AF] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">סיסמה</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="לפחות 8 תווים"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]"
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">אימות סיסמה</label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="הזינו שוב את הסיסמה"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]"
                />
              </div>

              {fieldError && (
                <p className="text-[#EF4444] text-sm">{fieldError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? 'יוצרים חשבון...' : 'הגדירו סיסמה והיכנסו'}
              </button>
            </form>
          </div>
        )}

        {/* Success */}
        {phase === 'success' && (
          <div className="bg-white border border-[#E8E8E6] rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-5">
              <Check className="w-7 h-7 text-[#2D7D5A]" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-[#1A1A1A] mb-2">החשבון מוכן 🎉</h1>
            <p className="text-[#6B7280] text-sm">מעבירים אתכם לדשבורד...</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8]" />}>
      <CreatePasswordInner />
    </Suspense>
  );
}
