'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, PawPrint } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function ProviderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/provider/dashboard');
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError('אימייל או סיסמה שגויים');
        return;
      }
      router.push('/provider/dashboard');
    } catch {
      setError('שגיאת תקשורת. נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-xl font-extrabold text-[#1A1A1A]">Rokko</a>
        </div>

        <div className="bg-white border border-[#E8E8E6] rounded-2xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-5">
            <PawPrint className="w-7 h-7 text-[#2D7D5A]" strokeWidth={1.5} />
          </div>

          <h1 className="text-xl font-bold text-[#1A1A1A] mb-1 text-center">כניסה לדשבורד</h1>
          <p className="text-[#6B7280] text-sm text-center mb-7">אזור ניהול נותני שירות</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">אימייל</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                dir="ltr"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">סיסמה</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="הסיסמה שלכם"
                  dir="ltr"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] bg-white text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] placeholder:text-[#9CA3AF]"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-[#EF4444] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#2D7D5A] text-white rounded-xl font-bold text-base hover:bg-[#236247] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'מתחברים...' : 'כניסה'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
