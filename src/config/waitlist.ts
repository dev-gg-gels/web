/**
 * VENTELISTE-KONFIGURASJON
 * ========================
 * Bytt leverandør ved å endre `provider` og tilhørende felt her.
 * Resten av koden trenger ikke røres.
 *
 * OPPSETT:
 *
 * Alternativ 1 – MailerLite (anbefalt, gratis opp til 1 000 kontakter):
 *   1. Gå til MailerLite → Forms → Create new form → Embedded
 *   2. Fullfør veiviseren og gå til "Embed" steget
 *   3. Finn i embed-koden: data-account og data-form attributtene, f.eks.:
 *      <div ... data-account="123456" data-form="987654" ...>
 *   4. Sett provider: 'mailerlite', fyll inn accountId og formId under
 *
 * Alternativ 2 – Google Forms (ingen konto nødvendig):
 *   1. Lag et Google Form med feltene e-post, handicap, frekvens, smertepunkt
 *   2. Hent formResponse-URL og entry-IDer fra Forms-nettverksforespørsler (DevTools)
 *   3. Sett provider: 'google-forms', fyll inn endpoint og fieldMapping under
 *
 * Alternativ 3 – Formspree:
 *   1. Gå til https://formspree.io og opprett en gratis konto
 *   2. Lag et nytt form og kopier endpoint-URL-en (f.eks. https://formspree.io/f/xyzabc12)
 *   3. Sett provider: 'formspree' og lim inn endpoint under
 */

export type WaitlistProvider = 'mailerlite' | 'formspree' | 'google-forms' | 'brevo' | 'mailto';

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
  // MailerLite-spesifikk
  mailerlite?: {
    accountId: string; // data-account fra embed-koden
    formId: string;    // data-form fra embed-koden
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
  provider: 'google-forms',

  endpoint: 'https://docs.google.com/forms/d/e/1FAIpQLSfb4dn7d7mbhydDDZ6UdJXsMifNRqeUa8I-ZHnuxzqO0roCMg/formResponse',

  fieldMapping: {
    email: 'entry.35562819',
    handicap: 'entry.1195532204',
    frequency: 'entry.1749289089',
    painPoint: 'entry.768831619',
  },

  // MailerLite — sett PUBLIC_MAILERLITE_ACCOUNT_ID og PUBLIC_MAILERLITE_FORM_ID i .env:
  mailerlite: {
    accountId: import.meta.env.PUBLIC_MAILERLITE_ACCOUNT_ID ?? '',
    formId: import.meta.env.PUBLIC_MAILERLITE_FORM_ID ?? '',
  },

  // For Brevo — fyll ut om provider er 'brevo':
  brevo: {
    listId: 0,
    apiKey: '',
  },

  earlyBirdDiscount: '20%',
  maxEarlyBird: 500,
};
