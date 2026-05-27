'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') ?? '/admin/applications';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(from);
      } else {
        setError('סיסמה שגויה');
      }
    } catch {
      setError('שגיאה. נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-extrabold text-[#1A1A1A]">Rokko</span>
          <p className="text-[#6B7280] text-sm mt-1">Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E8E6] p-6 shadow-sm">
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">סיסמה</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E8E6] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7D5A] mb-4"
            placeholder="הכניסו סיסמת Admin"
            dir="ltr"
            autoFocus
          />
          {error && <p className="text-[#EF4444] text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2D7D5A] text-white rounded-xl font-bold text-sm hover:bg-[#236247] transition-colors disabled:opacity-60"
          >
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8]" />}>
      <LoginForm />
    </Suspense>
  );
}
