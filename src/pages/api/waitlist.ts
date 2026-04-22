import type { APIRoute } from 'astro';
import { env as runtimeEnv } from 'cloudflare:workers';
import { z } from 'zod';

export const prerender = false;

type Locale = 'nb' | 'en';

const HANDICAP_VALUES = ['under-0', '0-10', '11-20', '21-plus'] as const;
const FREQUENCY_VALUES = [
  'a-few-times-a-season',
  'once-a-week',
  'twice-a-week',
  '3-plus-times-a-week',
] as const;
const CURRENT_SOLUTION_VALUES = [
  'sports-gels-regularly',
  'tried-not-a-habit',
  'food-and-snacks',
  'nothing',
] as const;
const PRIORITY_VALUES = [
  'steady-energy-and-focus',
  'good-taste',
  'price',
  'clean-ingredients',
] as const;
const PRICE_VALUES = ['under-200', '200-249', '250-299', '300-or-more', 'not-sure'] as const;
const ATTRIBUTION_VALUES = [
  'instagram-or-facebook',
  'google-search',
  'friend-or-club-recommendation',
  'golf-magazine-podcast-or-newsletter',
  'other',
] as const;

const ATTRIBUTION_OTHER_MAX = 200;
const CLUB_MAX = 100;

const waitlistSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    handicap: z.enum(HANDICAP_VALUES),
    frequency: z.enum(FREQUENCY_VALUES),
    currentSolution: z.enum(CURRENT_SOLUTION_VALUES),
    priorities: z.array(z.enum(PRIORITY_VALUES)).min(1),
    priceWillingness: z.enum(PRICE_VALUES),
    attribution: z.enum(ATTRIBUTION_VALUES),
    attributionOther: z.string().max(ATTRIBUTION_OTHER_MAX).optional().nullable(),
    club: z.string().max(CLUB_MAX).optional().nullable(),
    consent: z.literal(true),
    locale: z.enum(['nb', 'en']),
    turnstileToken: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.attribution === 'other' && !data.attributionOther?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['attributionOther'],
        message: 'required',
      });
    }
  });

type WaitlistInput = z.infer<typeof waitlistSchema>;

interface WaitlistRow {
  email: string;
  handicap: WaitlistInput['handicap'];
  frequency: WaitlistInput['frequency'];
  currentSolution: WaitlistInput['currentSolution'];
  priorities: WaitlistInput['priorities'];
  priceWillingness: WaitlistInput['priceWillingness'];
  attribution: WaitlistInput['attribution'];
  attributionOther: string | null;
  club: string | null;
  locale: Locale;
  consentAt: string;
  environment: 'production' | 'test';
}

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

class DuplicateEmailError extends Error {}

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
  env: Pick<Cloudflare.Env, 'SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY'>,
  row: WaitlistRow,
) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      email: row.email,
      handicap: row.handicap,
      frequency: row.frequency,
      current_solution: row.currentSolution,
      priorities: row.priorities.length ? row.priorities : null,
      price_willingness: row.priceWillingness,
      attribution: row.attribution,
      attribution_other: row.attribution === 'other' ? row.attributionOther : null,
      club: row.club,
      locale: row.locale,
      consent_at: row.consentAt,
      environment: row.environment,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text) as { code?: string };
      if (parsed?.code === '23505') {
        throw new DuplicateEmailError();
      }
    } catch (e) {
      if (e instanceof DuplicateEmailError) throw e;
    }
    throw new Error(`Supabase insert failed: ${res.status} ${text}`);
  }
}

const emailContent: Record<Locale, { subject: string; html: string; text: string; unsubscribeSubject: string }> = {
  nb: {
    subject: 'Du er med ⛳ — 20 % lanseringsrabatt er sikret',
    unsubscribeSubject: 'Avmeld',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1F1E1A; background: #F5F1E8;">
        <h1 style="font-size: 28px; line-height: 1.2; margin: 0 0 24px;">Du er med ⛳</h1>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Takk for at du meldte deg på ventelisten for GG-Gels — et system med fire energigels laget for golfens fire faser, fra første tee til siste putt.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Det betyr mye at du tror på prosjektet før første batch er produsert.
        </p>
        <div style="background: #ffffff; border-left: 3px solid #C9E265; padding: 20px 24px; margin: 28px 0;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">Det du akkurat sikret deg:</p>
          <ul style="font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px; color: #1F1E1A;">
            <li>20 % lanseringsrabatt</li>
            <li>Tilgang før alle andre</li>
            <li>Stemmerett på smak og pakning — vi spør ventelisten først</li>
          </ul>
        </div>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Vi sikter mot lansering til golfsesongen 2026. Neste livstegn kommer når vi har noe ekte å si — ingen nyhetsbrev-støy.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Kjenner du noen som spiller mye? Send dem <a href="https://gg-gels.no" style="color: #1F1E1A;">gg-gels.no</a> — de får plass foran i køen.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 8px;">Sees på banen.</p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 32px;">— Markus</p>
        <hr style="border: none; border-top: 1px solid #D9D4C7; margin: 32px 0;" />
        <p style="font-size: 13px; line-height: 1.6; color: #6B675E; margin: 0;">
          Du får denne e-posten fordi du meldte deg på ventelisten på gg-gels.no.
          Vil du melde deg av? <a href="mailto:hei@gg-gels.no?subject=Avmeld" style="color: #6B675E;">Send oss en e-post</a>, så sletter vi deg.
          Se også <a href="https://gg-gels.no/personvern" style="color: #6B675E;">personvernerklæringen</a>.
        </p>
      </div>
    `,
    text: `Du er med ⛳

Takk for at du meldte deg på ventelisten for GG-Gels — et system med fire energigels laget for golfens fire faser, fra første tee til siste putt.

Det betyr mye at du tror på prosjektet før første batch er produsert.

Det du akkurat sikret deg:
• 20 % lanseringsrabatt
• Tilgang før alle andre
• Stemmerett på smak og pakning — vi spør ventelisten først

Vi sikter mot lansering til golfsesongen 2026. Neste livstegn kommer når vi har noe ekte å si — ingen nyhetsbrev-støy.

Kjenner du noen som spiller mye? Send dem gg-gels.no — de får plass foran i køen.

Sees på banen.
— Markus

---
Du får denne e-posten fordi du meldte deg på ventelisten på gg-gels.no.
Vil du melde deg av? Svar på denne e-posten, eller skriv til hei@gg-gels.no med "Avmeld" i emnefeltet.
Personvern: https://gg-gels.no/personvern`,
  },
  en: {
    subject: "You're in ⛳ — your 20% launch discount is locked in",
    unsubscribeSubject: 'Unsubscribe',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1F1E1A; background: #F5F1E8;">
        <h1 style="font-size: 28px; line-height: 1.2; margin: 0 0 24px;">You're in ⛳</h1>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Thanks for joining the GG-Gels waitlist — a system of four energy gels built for golf's four phases, from the first tee to the final putt.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          It means a lot that you're backing this before the first batch is even produced.
        </p>
        <div style="background: #ffffff; border-left: 3px solid #C9E265; padding: 20px 24px; margin: 28px 0;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px; font-weight: 600;">What you just secured:</p>
          <ul style="font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px; color: #1F1E1A;">
            <li>20% launch discount</li>
            <li>First access, before anyone else</li>
            <li>A vote on flavours and pack choices — we'll ask the waitlist first</li>
          </ul>
        </div>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          We're aiming for the 2026 golf season. The next update lands when we have something real to say — no newsletter noise.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 20px;">
          Know someone who plays a lot? Send them <a href="https://gg-gels.no/en" style="color: #1F1E1A;">gg-gels.no</a> — they'll jump the queue.
        </p>
        <p style="font-size: 17px; line-height: 1.6; margin: 0 0 8px;">See you on the course.</p>
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

Thanks for joining the GG-Gels waitlist — a system of four energy gels built for golf's four phases, from the first tee to the final putt.

It means a lot that you're backing this before the first batch is even produced.

What you just secured:
• 20% launch discount
• First access, before anyone else
• A vote on flavours and pack choices — we'll ask the waitlist first

We're aiming for the 2026 golf season. The next update lands when we have something real to say — no newsletter noise.

Know someone who plays a lot? Send them gg-gels.no — they'll jump the queue.

See you on the course.
— Markus

---
You're receiving this email because you joined the waitlist at gg-gels.no.
Want to unsubscribe? Reply to this email, or write to hei@gg-gels.no with "Unsubscribe" as the subject.
Privacy: https://gg-gels.no/en/privacy`,
  },
};

async function sendConfirmationEmail(
  env: Pick<Cloudflare.Env, 'RESEND_API_KEY' | 'RESEND_FROM_EMAIL'>,
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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const env = runtimeEnv;

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const parsed = waitlistSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return jsonResponse(
      { error: 'validation_failed', issues: parsed.error.issues },
      400,
    );
  }
  const data = parsed.data;

  const turnstileOk = await verifyTurnstile(
    data.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    clientAddress ?? null,
  );
  if (!turnstileOk) {
    return jsonResponse({ error: 'turnstile_failed' }, 403);
  }

  const hostname = new URL(request.url).hostname;
  const environment: 'production' | 'test' =
    hostname === 'gg-gels.no' || hostname === 'www.gg-gels.no' ? 'production' : 'test';

  const clubTrimmed = data.club?.trim() || null;
  const attributionOtherTrimmed =
    data.attribution === 'other' ? data.attributionOther?.trim() || null : null;

  const row: WaitlistRow = {
    email: data.email,
    handicap: data.handicap,
    frequency: data.frequency,
    currentSolution: data.currentSolution,
    priorities: data.priorities,
    priceWillingness: data.priceWillingness,
    attribution: data.attribution,
    attributionOther: attributionOtherTrimmed,
    club: clubTrimmed,
    locale: data.locale,
    consentAt: new Date().toISOString(),
    environment,
  };

  try {
    await insertSupabase(env, row);
  } catch (err) {
    if (err instanceof DuplicateEmailError) {
      return jsonResponse({ error: 'already_registered' }, 409);
    }
    console.error(err);
    return jsonResponse({ error: 'storage_failed' }, 500);
  }

  try {
    await sendConfirmationEmail(env, data.email, data.locale);
  } catch (err) {
    // Email failure is non-fatal — the signup succeeded.
    console.error(err);
  }

  return jsonResponse({ ok: true });
};
