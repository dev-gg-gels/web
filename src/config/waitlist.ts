/**
 * VENTELISTE-KONFIGURASJON
 * ========================
 * Bytt leverandør ved å endre `provider` og `endpoint` her.
 * Resten av koden trenger ikke røres.
 *
 * OPPSETT:
 *
 * Alternativ 1 – Formspree (anbefalt for start):
 *   1. Gå til https://formspree.io og opprett en gratis konto
 *   2. Lag et nytt form og kopier endpoint-URL-en (f.eks. https://formspree.io/f/xyzabc12)
 *   3. Sett provider: 'formspree' og lim inn endpoint under
 *
 * Alternativ 2 – Google Forms (ingen konto nødvendig):
 *   1. Lag et Google Form med feltene e-post, handicap, frekvens, smertepunkt
 *   2. Hent formResponse-URL og entry-IDer fra Forms-nettverksforespørsler (DevTools)
 *   3. Sett provider: 'google-forms', fyll inn endpoint og fieldMapping under
 *
 * Alternativ 3 – Brevo:
 *   1. Sett BREVO_API_KEY i miljøvariabler
 *   2. Sett provider: 'brevo' og listId nedenfor
 */

export type WaitlistProvider = 'formspree' | 'google-forms' | 'brevo' | 'mailto';

export interface WaitlistConfig {
  provider: WaitlistProvider;
  endpoint: string;
  // For Google Forms: map felt til entry-IDer (f.eks. 'entry.1234567890')
  fieldMapping: {
    email: string;
    handicap: string;
    frequency: string;
    painPoint: string;
  };
  // Brevo-spesifikk
  brevo?: {
    listId: number;
    apiKey: string;
  };
  earlyBirdDiscount: string;
  maxEarlyBird: number;
}

export const waitlistConfig: WaitlistConfig = {
  // ENDRE DETTE for å bytte leverandør:
  provider: 'formspree',

  // ENDRE DETTE til din faktiske endpoint:
  endpoint: 'https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID',

  // For Google Forms — erstatt med faktiske entry-IDer:
  fieldMapping: {
    email: 'email',
    handicap: 'handicap',
    frequency: 'frequency',
    painPoint: 'painPoint',
  },

  // For Brevo — fyll ut om provider er 'brevo':
  brevo: {
    listId: 0, // Sett liste-ID her
    apiKey: '', // Sett inn public API-nøkkel her (eller bruk env var)
  },

  earlyBirdDiscount: '20%',
  maxEarlyBird: 500,
};
