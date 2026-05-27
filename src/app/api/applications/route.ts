import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendProviderConfirmation, sendAdminNotification, triggerProviderApplicationEvent } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      provider_type, full_name, business_name, phone, whatsapp, email,
      city, service_areas, social_instagram, social_facebook, social_website,
      description, experience_years, notes, media_urls,
      // category-specific
      is_home_based, has_yard, has_other_pets, max_pets, dog_sizes,
      available_days, walk_duration, walk_type,
      clinic_name, clinic_address, working_hours, has_emergency, vet_specializations,
      company_name, insurance_types, contact_person,
      // UTM
      utm_type, utm_source, utm_campaign, utm_owner,
    } = body;

    // Basic validation
    if (!full_name || !phone || !email || !city || !provider_type) {
      return NextResponse.json({ error: 'חסרים שדות חובה' }, { status: 400 });
    }

    const category_data = {
      // boarding/pension
      is_home_based, has_yard, has_other_pets, max_pets, dog_sizes,
      // walking
      available_days, walk_duration, walk_type,
      // vet
      clinic_name, clinic_address, working_hours, has_emergency, vet_specializations,
      // insurance
      company_name, insurance_types, contact_person,
    };

    const db = createServiceClient();

    const { data, error } = await db
      .from('provider_applications')
      .insert({
        provider_type,
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
        description,
        experience_years: experience_years ? parseInt(experience_years) : null,
        notes: notes || null,
        media_urls: media_urls || [],
        category_data,
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

    // Send emails + trigger Resend automation (non-blocking — don't fail the request if any of these fail)
    await Promise.allSettled([
      sendProviderConfirmation(email, full_name),
      sendAdminNotification({
        name: full_name,
        businessName: business_name || '',
        providerType: provider_type,
        city,
        phone,
        email,
        applicationId: data.id,
      }),
      triggerProviderApplicationEvent({
        provider_type,
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
