import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

async function getAuthenticatedProvider(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const db = createServiceClient();
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) return null;

  const { data: provider } = await db
    .from('providers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return provider ?? null;
}

export async function GET(req: NextRequest) {
  const provider = await getAuthenticatedProvider(req);
  if (!provider) {
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });
  }
  return NextResponse.json({ provider });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  const db = createServiceClient();
  const { data: { user }, error: authError } = await db.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 });

  try {
    const body = await req.json();
    const allowed = [
      'description', 'city', 'service_areas', 'whatsapp',
      'social_instagram', 'social_facebook', 'social_website',
      'services', 'media_urls',
    ];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const { data, error } = await db
      .from('providers')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('[provider/me PUT] update error:', error);
      return NextResponse.json({ error: 'שגיאה בעדכון' }, { status: 500 });
    }

    return NextResponse.json({ provider: data });
  } catch (err) {
    console.error('[provider/me PUT] unexpected error:', err);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
