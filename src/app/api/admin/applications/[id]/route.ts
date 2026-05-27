import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import {
  sendApprovalEmail,
  sendRejectionEmail,
  sendNeedsInfoEmail,
} from '@/lib/email';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status, admin_note } = body;

  const db = createServiceClient();

  // Fetch current application for email data
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

  // Save admin note if provided
  if (admin_note?.trim()) {
    await db.from('admin_notes').insert({ application_id: id, note: admin_note.trim() });
  }

  // Send email based on status change
  if (status !== app.status) {
    if (status === 'approved' || status === 'published') {
      await sendApprovalEmail(app.email, app.full_name).catch(console.error);
    } else if (status === 'rejected') {
      await sendRejectionEmail(app.email, app.full_name).catch(console.error);
    } else if (status === 'needs_info' && admin_note?.trim()) {
      await sendNeedsInfoEmail(app.email, app.full_name, admin_note.trim()).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
