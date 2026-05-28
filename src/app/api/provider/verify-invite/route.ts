import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ valid: false, reason: 'missing_token' }, { status: 400 });
  }

  const db = createServiceClient();

  const { data: invite, error } = await db
    .from('provider_invites')
    .select('id, email, expires_at, used_at, provider_id, providers(full_name, user_id)')
    .eq('token', token)
    .single();

  if (error || !invite) {
    return NextResponse.json({ valid: false, reason: 'not_found' });
  }

  if (invite.used_at) {
    return NextResponse.json({ valid: false, reason: 'already_used' });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: 'expired' });
  }

  const provider = Array.isArray(invite.providers) ? invite.providers[0] : invite.providers;

  if (provider?.user_id) {
    return NextResponse.json({ valid: false, reason: 'already_activated' });
  }

  return NextResponse.json({
    valid: true,
    email: invite.email,
    name: provider?.full_name ?? '',
  });
}
