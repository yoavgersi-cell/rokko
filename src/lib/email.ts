import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Missing RESEND_API_KEY');
  return new Resend(key);
}

export async function triggerProviderApplicationEvent(data: {
  provider_type: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
}) {
  try {
    const resend = getResend();
    const { error } = await resend.events.send({
      event: 'provider_application_submitted',
      email: data.email,
      payload: {
        provider_type: data.provider_type,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        application_status: 'pending',
      },
    });
    if (error) {
      console.error('[Resend] Automation event failed:', error);
    }
  } catch (err) {
    console.error('[Resend] Automation event exception:', err);
  }
}

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Rokko <noreply@rokko.co.il>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@rokko.co.il';

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rokko</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:'Helvetica Neue',Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E8E8E6;">
          <!-- Logo -->
          <tr>
            <td style="padding:28px 32px 24px;border-bottom:1px solid #F0F0EE;">
              <span style="font-size:20px;font-weight:800;color:#1A1A1A;letter-spacing:-0.5px;">Rokko</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #F0F0EE;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;">
                Rokko — קהילת מארחי חיות המחמד הראשונה בישראל<br/>
                <a href="https://rokko.co.il" style="color:#2D7D5A;text-decoration:none;">rokko.co.il</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendProviderConfirmation(to: string, name: string) {
  const html = baseLayout(`
    <p style="margin:0 0 8px;font-size:16px;color:#6B7280;">היי ${name},</p>
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1A1A1A;line-height:1.3;">
      קיבלנו את בקשת ההצטרפות שלכם ל-Rokko
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
      תודה שהצטרפתם. קיבלנו את הפרטים שלכם והבקשה עברה לבדיקה ידנית.
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
      אנחנו עוברים על כל פרופיל כדי לוודא שהוא מתאים לקהילה שאנחנו בונים — ונעדכן אתכם ברגע שהפרופיל יאושר, או אם נצטרך פרטים נוספים.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
      תודה על הסבלנות.
    </p>
    <p style="margin:0;font-size:15px;color:#6B7280;">
      צוות Rokko
    </p>
  `);

  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'קיבלנו את בקשת ההצטרפות שלכם ל-Rokko',
    html,
  });
}

export async function sendAdminNotification(data: {
  name: string;
  businessName: string;
  providerType: string;
  city: string;
  phone: string;
  email: string;
  applicationId: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rokko.co.il';
  const html = baseLayout(`
    <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#1A1A1A;">
      בקשת הצטרפות חדשה ל-Rokko
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #E8E8E6;">
      <tr style="background:#FAFAF8;">
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#6B7280;width:120px;">שם</td>
        <td style="padding:12px 16px;font-size:14px;color:#1A1A1A;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#6B7280;border-top:1px solid #F0F0EE;">שם עסק</td>
        <td style="padding:12px 16px;font-size:14px;color:#1A1A1A;border-top:1px solid #F0F0EE;">${data.businessName || '—'}</td>
      </tr>
      <tr style="background:#FAFAF8;">
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#6B7280;border-top:1px solid #F0F0EE;">קטגוריה</td>
        <td style="padding:12px 16px;font-size:14px;color:#1A1A1A;border-top:1px solid #F0F0EE;">${data.providerType}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#6B7280;border-top:1px solid #F0F0EE;">עיר</td>
        <td style="padding:12px 16px;font-size:14px;color:#1A1A1A;border-top:1px solid #F0F0EE;">${data.city}</td>
      </tr>
      <tr style="background:#FAFAF8;">
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#6B7280;border-top:1px solid #F0F0EE;">טלפון</td>
        <td style="padding:12px 16px;font-size:14px;color:#1A1A1A;border-top:1px solid #F0F0EE;">${data.phone}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#6B7280;border-top:1px solid #F0F0EE;">אימייל</td>
        <td style="padding:12px 16px;font-size:14px;color:#1A1A1A;border-top:1px solid #F0F0EE;">${data.email}</td>
      </tr>
    </table>
    <div style="margin-top:24px;">
      <a href="${siteUrl}/admin/applications" style="display:inline-block;padding:12px 24px;background:#2D7D5A;color:#FFFFFF;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">
        צפו בבקשה בדשבורד
      </a>
    </div>
  `);

  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `בקשת הצטרפות חדשה ל-Rokko — ${data.name}`,
    html,
  });
}

export async function sendApprovalEmail(to: string, name: string) {
  const html = baseLayout(`
    <p style="margin:0 0 8px;font-size:16px;color:#6B7280;">היי ${name},</p>
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1A1A1A;line-height:1.3;">
      הפרופיל שלכם אושר
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
      עברנו על הפרטים שלכם ואנחנו שמחים להודיע שהפרופיל אושר ויעלה לאתר בקרוב.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
      נשלח לכם עדכון נוסף ברגע שהוא פעיל. תודה שאתם חלק מהקהילה שאנחנו בונים.
    </p>
    <p style="margin:0;font-size:15px;color:#6B7280;">
      צוות Rokko
    </p>
  `);

  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'הפרופיל שלכם ב-Rokko אושר',
    html,
  });
}

export async function sendRejectionEmail(to: string, name: string) {
  const html = baseLayout(`
    <p style="margin:0 0 8px;font-size:16px;color:#6B7280;">היי ${name},</p>
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1A1A1A;line-height:1.3;">
      עדכון על בקשת ההצטרפות שלכם
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
      תודה על ההתעניינות. לאחר בדיקת הפרטים, בשלב זה הפרופיל שלכם לא מתאים לפרמטרים של הקהילה שאנחנו בונים.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
      אם חל שינוי בפרטים שלכם בעתיד, תוכלו לפנות אלינו שוב.
    </p>
    <p style="margin:0;font-size:15px;color:#6B7280;">
      צוות Rokko
    </p>
  `);

  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'עדכון על בקשת ההצטרפות שלכם ל-Rokko',
    html,
  });
}

export async function sendNeedsInfoEmail(to: string, name: string, note: string) {
  const html = baseLayout(`
    <p style="margin:0 0 8px;font-size:16px;color:#6B7280;">היי ${name},</p>
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1A1A1A;line-height:1.3;">
      נדרשים פרטים נוספים
    </h2>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
      עברנו על הבקשה שלכם ויש כמה שאלות לפני שנוכל להמשיך:
    </p>
    <div style="background:#FAFAF8;border-right:3px solid #2D7D5A;padding:16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <p style="margin:0;font-size:15px;color:#1A1A1A;line-height:1.7;">${note}</p>
    </div>
    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
      אפשר להשיב ישירות למייל הזה עם הפרטים.
    </p>
    <p style="margin:0;font-size:15px;color:#6B7280;">
      צוות Rokko
    </p>
  `);

  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'נדרשים פרטים נוספים לגבי ההצטרפות שלכם ל-Rokko',
    html,
  });
}
