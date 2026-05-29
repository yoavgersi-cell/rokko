import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendProviderConfirmation, sendAdminNotification, triggerProviderApplicationEvent } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      services,           // string[] - new multi-service array
      provider_type,      // string  - first service (backwards compat)
      full_name, business_name, phone, whatsapp, email,
      city, service_areas, social_instagram, social_facebook, social_website,
      description, notes, media_urls,
      service_specific_fields,
      utm_type, utm_source, utm_campaign, utm_owner,
    } = body;

    // Validation
    if (!full_name || !phone || !email || !city) {
      return NextResponse.json({ error: 'חסרים שדות חובה' }, { status: 400 });
    }
    const serviceList: string[] = Array.isArray(services) && services.length > 0
      ? services
      : provider_type ? [provider_type] : [];
    if (serviceList.length === 0) {
      return NextResponse.json({ error: 'יש לבחור לפחות שירות אחד' }, { status: 400 });
    }

    const db = createServiceClient();

    const { data, error } = await db
      .from('provider_applications')
      .insert({
        provider_type: serviceList[0],
        full_name,
        business_name: business_name || null,
        phone,
        whatsapp: whatsapp || phone,
        email,
        city,
        service_areas: service_areas || null,
        social_instagram: social_instagram || null,
        social_facebook: social_facebook || null,
        social_website: social_website || null,
        description: description || null,
        notes: notes || null,
        media_urls: media_urls || [],
        category_data: {
          services: serviceList,
          ...service_specific_fields,
        },
        status: 'pending',
        utm_type: utm_type || null,
        utm_source: utm_source || null,
        utm_campaign: utm_campaign || null,
        utm_owner: utm_owner || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'שגיאה בשמירת הנתונים' }, { status: 500 });
    }

    await Promise.allSettled([
      sendProviderConfirmation(email, full_name),
      sendAdminNotification({
        name: full_name,
        businessName: business_name || '',
        providerType: serviceList.join(', '),
        city,
        phone,
        email,
        applicationId: data.id,
      }),
      triggerProviderApplicationEvent({
        provider_type: serviceList[0],
        full_name,
        email,
        phone,
        city,
      }),
    ]);

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Application submission error:', err);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
