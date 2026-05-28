import { NextRequest, NextResponse } from 'next/server';
import { sendProviderConfirmation } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email } = body ?? {};

    if (!full_name || typeof full_name !== 'string') {
      return NextResponse.json({ error: 'full_name נדרש' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'email לא תקין' }, { status: 400 });
    }

    try {
      await sendProviderConfirmation(email, full_name);
    } catch (emailErr) {
      console.error('[confirmation-email] Resend failed:', emailErr);
      // Do not fail — return success so the onboarding flow is never blocked
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[confirmation-email] Unexpected error:', err);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
