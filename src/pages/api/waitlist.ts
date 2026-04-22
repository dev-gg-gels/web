import type { APIRoute } from 'astro';

export const prerender = false;

type Locale = 'nb' | 'en';

interface WaitlistPayload {
  email: string;
  handicap: string;
  frequency: string;
  currentSolution: string;
  priorities: string[];
  priceWillingness: string;
  attribution: string;
  attributionOther: string;
  club: string;
  consent: boolean;
  locale: Locale;
  turnstileToken: string;
}

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
}

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

async function verifyTurnstile(token: string, secret: string, ip: string | null) {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

async function insertSupabase(
  env: Pick<Env, 'SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY'>,
  payload: Omit<WaitlistPayload, 'turnstileToken'>,
  environment: 'production' | 'test',
) {
  const priorities = Array.isArray(payload.priorities)
    ? payload.priorities.filter((p): p is string => typeof p === 'string').slice(0, 10)
    : [];

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      email: payload.email,
      handicap: payload.handicap || null,
      frequency: payload.frequency || null,
      current_solution: payload.currentSolution || null,
      priorities: priorities.length ? priorities : null,
      price_willingness: payload.priceWillingness || null,
      attribution: payload.attribution || null,
      attribution_other:
        payload.attribution === 'other' ? payload.attributionOther?.trim() || null : null,
      club: payload.club?.trim() || null,
      locale: payload.locale,
      environment,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${text}`);
  }
}

const emailContent: Record<Locale, { subject: string; html: string; text: string; unsubscribeSubject: string }> = {
  nb: {
    subject: 'Du er inne ⛳ — 20% rabatt er sikret',
    unsubscribeSubject: 'Avmeld',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1F1E1A; background: #F5F1E8;">
        <h1 style="font-size: 28px; line-height: 1.2; margin: 0 0 24px;">Du er inne ⛳</h1>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Takk for at du meldte deg på ventelisten for GG-Gels. Det betyr mye at du tror på prosjektet før vi har brygget den første produksjonsbatchen.
        </p>
        <div style="background: #ffffff; border-left: 3px solid #C9E265; padding: 20px 24px; margin: 28px 0;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">Det du akkurat sikret deg:</p>
          <ul style="font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px; color: #1F1E1A;">
            <li>20% early bird-rabatt ved lansering</li>
            <li>Tilgang før alle andre</li>
            <li>Mulighet til å forme produktet — vi kommer til å spørre ventelisten om smaks- og pakningsvalg</li>
          </ul>
        </div>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Vi sikter mot lansering til golfsesongen 2026. Frem til da dukker vi opp med oppdateringer kun når det er noe å si — ingen nyhetsbrev-støy.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 8px;">Ha en skarp runde.</p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 32px;">— Markus</p>
        <hr style="border: none; border-top: 1px solid #D9D4C7; margin: 32px 0;" />
        <p style="font-size: 13px; line-height: 1.6; color: #6B675E; margin: 0;">
          Du får denne e-posten fordi du meldte deg på ventelisten på gg-gels.no.
          Vil du melde deg av? <a href="mailto:hei@gg-gels.no?subject=Avmeld" style="color: #6B675E;">Send oss en e-post</a>, så sletter vi deg.
          Se også <a href="https://gg-gels.no/personvern" style="color: #6B675E;">personvernerklæringen</a>.
        </p>
      </div>
    `,
    text: `Du er inne ⛳

Takk for at du meldte deg på ventelisten for GG-Gels. Det betyr mye at du tror på prosjektet før vi har brygget den første produksjonsbatchen.

Det du akkurat sikret deg:
• 20% early bird-rabatt ved lansering
• Tilgang før alle andre
• Mulighet til å forme produktet — vi kommer til å spørre ventelisten om smaks- og pakningsvalg

Vi sikter mot lansering til golfsesongen 2026. Frem til da dukker vi opp med oppdateringer kun når det er noe å si — ingen nyhetsbrev-støy.

Ha en skarp runde.
— Markus

---
Du får denne e-posten fordi du meldte deg på ventelisten på gg-gels.no.
Vil du melde deg av? Svar på denne e-posten, eller skriv til hei@gg-gels.no med "Avmeld" i emnefeltet.
Personvern: https://gg-gels.no/personvern`,
  },
  en: {
    subject: "You're in ⛳ — your 20% early bird is locked in",
    unsubscribeSubject: 'Unsubscribe',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1F1E1A; background: #F5F1E8;">
        <h1 style="font-size: 28px; line-height: 1.2; margin: 0 0 24px;">You're in ⛳</h1>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Thanks for joining the GG-Gels waitlist. It means a lot that you're backing this before we've even brewed the first production batch.
        </p>
        <div style="background: #ffffff; border-left: 3px solid #C9E265; padding: 20px 24px; margin: 28px 0;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">What you just secured:</p>
          <ul style="font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px; color: #1F1E1A;">
            <li>20% early bird discount at launch</li>
            <li>First access, before anyone else</li>
            <li>A say in how the product turns out — we'll ask the waitlist about flavours and pack choices</li>
          </ul>
        </div>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          We're aiming for the 2026 golf season. Until then we'll only show up with updates when there's something actually worth saying — no newsletter noise.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 8px;">Play a sharp round out there.</p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 32px;">— Markus</p>
        <hr style="border: none; border-top: 1px solid #D9D4C7; margin: 32px 0;" />
        <p style="font-size: 13px; line-height: 1.6; color: #6B675E; margin: 0;">
          You're receiving this email because you joined the waitlist at gg-gels.no.
          Want to unsubscribe? <a href="mailto:hei@gg-gels.no?subject=Unsubscribe" style="color: #6B675E;">Email us</a> and we'll remove you.
          See also the <a href="https://gg-gels.no/en/privacy" style="color: #6B675E;">privacy policy</a>.
        </p>
      </div>
    `,
    text: `You're in ⛳

Thanks for joining the GG-Gels waitlist. It means a lot that you're backing this before we've even brewed the first production batch.

What you just secured:
• 20% early bird discount at launch
• First access, before anyone else
• A say in how the product turns out — we'll ask the waitlist about flavours and pack choices

We're aiming for the 2026 golf season. Until then we'll only show up with updates when there's something actually worth saying — no newsletter noise.

Play a sharp round out there.
— Markus

---
You're receiving this email because you joined the waitlist at gg-gels.no.
Want to unsubscribe? Reply to this email, or write to hei@gg-gels.no with "Unsubscribe" as the subject.
Privacy: https://gg-gels.no/en/privacy`,
  },
};

async function sendConfirmationEmail(
  env: Pick<Env, 'RESEND_API_KEY' | 'RESEND_FROM_EMAIL'>,
  email: string,
  locale: Locale,
) {
  const content = emailContent[locale] ?? emailContent.nb;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: email,
      reply_to: 'hei@gg-gels.no',
      subject: content.subject,
      html: content.html,
      text: content.text,
      headers: {
        'List-Unsubscribe': `<mailto:hei@gg-gels.no?subject=${encodeURIComponent(content.unsubscribeSubject)}>`,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend send failed: ${res.status} ${text}`);
  }
}

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const env = (locals as unknown as { runtime: { env: Env } }).runtime.env;

  let payload: WaitlistPayload;
  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  if (!payload.email || !isValidEmail(payload.email)) {
    return jsonResponse({ error: 'invalid_email' }, 400);
  }

  if (payload.consent !== true) {
    return jsonResponse({ error: 'consent_required' }, 400);
  }

  if (!payload.turnstileToken) {
    return jsonResponse({ error: 'missing_turnstile_token' }, 400);
  }

  const turnstileOk = await verifyTurnstile(
    payload.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    clientAddress ?? null,
  );
  if (!turnstileOk) {
    return jsonResponse({ error: 'turnstile_failed' }, 403);
  }

  const hostname = new URL(request.url).hostname;
  const environment: 'production' | 'test' =
    hostname === 'gg-gels.no' || hostname === 'www.gg-gels.no' ? 'production' : 'test';

  const locale: Locale = payload.locale === 'en' ? 'en' : 'nb';
  payload.locale = locale;

  try {
    await insertSupabase(env, payload, environment);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'storage_failed' }, 500);
  }

  try {
    await sendConfirmationEmail(env, payload.email, locale);
  } catch (err) {
    // Email failure is non-fatal — the signup succeeded.
    console.error(err);
  }

  return jsonResponse({ ok: true });
};
