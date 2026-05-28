import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase';
import {
  sendProviderInviteEmail,
  sendRejectionEmail,
  sendNeedsInfoEmail,
} from '@/lib/email';

const INVITE_TTL_DAYS = 7;

async function createProviderAndInvite(db: ReturnType<typeof createServiceClient>, applicationId: string) {
  // Fetch full application data
  const { data: app } = await db
    .from('provider_applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  if (!app) return null;

  // Upsert provider record (idempotent — safe to call multiple times)
  const { data: existing } = await db
    .from('providers')
    .select('id, user_id')
    .eq('application_id', applicationId)
    .maybeSingle();

  let providerId: string;

  if (existing) {
    providerId = existing.id;
  } else {
    const services: string[] =
      (app.category_data as { services?: string[] } | null)?.services ??
      (app.provider_type ? [app.provider_type] : []);

    const { data: newProvider, error } = await db
      .from('providers')
      .insert({
        application_id: applicationId,
        full_name: app.full_name,
        business_name: app.business_name ?? null,
        email: app.email,
        phone: app.phone ?? null,
        whatsapp: app.whatsapp ?? null,
        city: app.city ?? null,
        service_areas: app.service_areas ?? null,
        services,
        description: app.description ?? null,
        media_urls: (app as { media_urls?: string[] }).media_urls ?? [],
        social_instagram: app.social_instagram ?? null,
        social_facebook: app.social_facebook ?? null,
        social_website: app.social_website ?? null,
        public_profile_data: app.category_data ?? {},
        status: 'approved',
        is_published: false,
      })
      .select('id')
      .single();

    if (error || !newProvider) return null;
    providerId = newProvider.id;
  }

  // Only send invite if provider hasn't activated yet (no user_id)
  if (existing?.user_id) return { providerId, alreadyActivated: true };

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await db.from('provider_invites').insert({
    provider_id: providerId,
    email: app.email,
    token,
    expires_at: expiresAt,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rokko.co.il';
  const inviteUrl = `${siteUrl}/provider/create-password?token=${token}`;

  await sendProviderInviteEmail(app.email, app.full_name, inviteUrl).catch(console.error);

  return { providerId, alreadyActivated: false };
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status, admin_note } = body;

  const db = createServiceClient();

  // Fetch current application
  const { data: app, error: fetchError } = await db
    .from('provider_applications')
    .select('full_name, email, status')
    .eq('id', id)
    .single();

  if (fetchError || !app) {
    return NextResponse.json({ error: 'לא נמצא' }, { status: 404 });
  }

  // Update status
  const { error: updateError } = await db
    .from('provider_applications')
    .update({ status })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Save admin note
  if (admin_note?.trim()) {
    await db.from('admin_notes').insert({ application_id: id, note: admin_note.trim() });
  }

  // Handle status transitions
  const wasApproved = app.status === 'approved' || app.status === 'published';
  const nowApproved = status === 'approved' || status === 'published';

  if (status !== app.status) {
    if (nowApproved && !wasApproved) {
      // First-time approval → create provider record + send invite with password link
      await createProviderAndInvite(db, id);
    } else if (nowApproved && wasApproved) {
      // Re-approve (e.g. published after approved) — just update is_published flag
      await db
        .from('providers')
        .update({ is_published: status === 'published' })
        .eq('application_id', id);
    } else if (status === 'rejected') {
      await sendRejectionEmail(app.email, app.full_name).catch(console.error);
    } else if (status === 'needs_info' && admin_note?.trim()) {
      await sendNeedsInfoEmail(app.email, app.full_name, admin_note.trim()).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
