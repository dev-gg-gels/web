import type { APIRoute } from 'astro';

export const prerender = false;

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
      environment,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${text}`);
  }
}

async function sendConfirmationEmail(
  env: Pick<Env, 'RESEND_API_KEY' | 'RESEND_FROM_EMAIL'>,
  email: string,
) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Velkommen på GG-Gels early bird-listen ⛳',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">Du er på listen!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Takk for at du meldte deg på ventelisten for GG-Gels. Du er nå sikret 20% early bird-rabatt ved lansering.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Vi sender deg en e-post når vi nærmer oss lansering med mer informasjon om produktet og din rabattkode.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 32px;">— Teamet bak GG-Gels</p>
        </div>
      `,
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

  try {
    await insertSupabase(env, payload, environment);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: 'storage_failed' }, 500);
  }

  try {
    await sendConfirmationEmail(env, payload.email);
  } catch (err) {
    // Email failure is non-fatal — the signup succeeded.
    console.error(err);
  }

  return jsonResponse({ ok: true });
};
