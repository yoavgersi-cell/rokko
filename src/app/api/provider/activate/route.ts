import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: 'פרטים חסרים או סיסמה קצרה מדי' }, { status: 400 });
    }

    const db = createServiceClient();

    // Verify token
    const { data: invite, error: inviteError } = await db
      .from('provider_invites')
      .select('id, email, expires_at, used_at, provider_id')
      .eq('token', token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'קישור לא תקין' }, { status: 400 });
    }
    if (invite.used_at) {
      return NextResponse.json({ error: 'קישור כבר שומש' }, { status: 400 });
    }
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'הקישור פג תוקף' }, { status: 400 });
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await db.auth.admin.createUser({
      email: invite.email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'חשבון עם אימייל זה כבר קיים' }, { status: 409 });
      }
      console.error('[activate] auth.admin.createUser error:', authError);
      return NextResponse.json({ error: 'שגיאה ביצירת החשבון' }, { status: 500 });
    }

    const userId = authData.user.id;

    // Link auth user to provider record
    await db
      .from('providers')
      .update({ user_id: userId })
      .eq('id', invite.provider_id);

    // Mark invite as used
    await db
      .from('provider_invites')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invite.id);

    return NextResponse.json({ success: true, email: invite.email });
  } catch (err) {
    console.error('[activate] unexpected error:', err);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
