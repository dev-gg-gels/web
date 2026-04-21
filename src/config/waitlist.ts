/**
 * VENTELISTE-KONFIGURASJON
 * ========================
 * Skjemaet sender til `/api/waitlist`, en SSR-rute på Cloudflare Workers
 * som verifiserer Turnstile, skriver til Supabase og sender bekreftelses-
 * e-post via Resend. Se .env.example for nødvendige miljøvariabler.
 */

export interface WaitlistConfig {
  earlyBirdDiscount: string;
  maxEarlyBird: number;
}

export const waitlistConfig: WaitlistConfig = {
  earlyBirdDiscount: '20%',
  maxEarlyBird: 500,
};
