# gg-gels-web

Landingsside for GG-Gels med venteliste-innmelding. Astro 6 (SSR) på Cloudflare Workers, Supabase som database, Resend for bekreftelses-e-post, Turnstile for spam-beskyttelse.

## Stack

- **Astro 6** (SSR, `output: 'server'`) + TypeScript (strict) + Tailwind v4
- **Hosting:** Cloudflare Workers (`@astrojs/cloudflare`)
- **Database:** Supabase (Postgres) — `waitlist`-tabell, RLS på, kun service role skriver
- **E-post:** Resend (transaksjonelle bekreftelser)
- **Spam:** Cloudflare Turnstile
- **i18n:** `nb` (default) og `en`

## Arkitektur — ventelisteflyt

1. Bruker fyller ut `WaitlistSection.astro` → POST til `/api/waitlist`
2. API-ruten [src/pages/api/waitlist.ts](src/pages/api/waitlist.ts) kjører på Cloudflare Worker og:
   - Verifiserer Turnstile-token
   - Skriver raden til Supabase via REST (service role key)
   - Sender bekreftelses-e-post via Resend (feiler stille — innmeldingen er uansett lagret)

## Kommandoer

| Kommando | Beskrivelse |
| :--- | :--- |
| `pnpm install` | Installer avhengigheter |
| `pnpm dev` | Dev-server på `localhost:4321` |
| `pnpm build` | Bygg til `./dist/` |
| `pnpm preview` | Preview bygget lokalt |
| `pnpm generate-types` | Generer Cloudflare bindings-typer |

## Førstegangs-oppsett

### 1. Supabase

1. Opprett prosjekt på [supabase.com](https://supabase.com) (free tier)
2. Kjør [supabase/schema.sql](supabase/schema.sql) i SQL Editor
3. **Settings → API** — hent:
   - Project URL → `SUPABASE_URL`
   - `service_role` key (ikke anon) → `SUPABASE_SERVICE_ROLE_KEY`

Service role brukes kun server-side i Worker-en. RLS er aktivert, så anon-key har ingen tilgang til tabellen.

### 2. Resend

1. Opprett konto på [resend.com](https://resend.com)
2. **Domains → Add domain** — `gg-gels.no`
3. Legg SPF-, DKIM- og DMARC-records inn i Cloudflare DNS (proxying **av** for TXT)
4. Vent på "Verified", opprett API-key → `RESEND_API_KEY`
5. `RESEND_FROM_EMAIL=GG-Gels <hei@gg-gels.no>` (fungerer så snart domenet er verifisert)

### 3. Cloudflare Turnstile

1. Cloudflare dashboard → **Turnstile → Add site** (Managed challenge)
2. Site key → `PUBLIC_TURNSTILE_SITE_KEY`
3. Secret key → `TURNSTILE_SECRET_KEY`

### 4. Lokal `.env`

Kopier `.env.example` til `.env` og fyll inn alle verdier. Se `.env.example` for hele listen.

## Deploy

### Bygg

```sh
pnpm build
```

Dette genererer både statiske assets og Worker-entrypointet (`@astrojs/cloudflare`).

### Sett secrets på Worker-en

Secrets skal **ikke** ligge i `wrangler.jsonc` eller i repo. Sett dem via Wrangler:

```sh
pnpm wrangler secret put SUPABASE_URL
pnpm wrangler secret put SUPABASE_SERVICE_ROLE_KEY
pnpm wrangler secret put RESEND_API_KEY
pnpm wrangler secret put RESEND_FROM_EMAIL
pnpm wrangler secret put TURNSTILE_SECRET_KEY
```

`PUBLIC_TURNSTILE_SITE_KEY` inlines i klient-bundlen ved build-tid og må derfor ligge i build-miljøet (lokal `.env` ved `pnpm build`, eller env var i Cloudflare Pages/CI dersom du bygger i skyen).

### Deploy Worker

```sh
pnpm wrangler deploy
```

Worker-navn og entrypoint er satt i [wrangler.jsonc](wrangler.jsonc).

## Konfigurasjon

- **Ventelisteskjema-labels og språk:** [src/i18n/translations.ts](src/i18n/translations.ts)
- **Tallverdier (early bird, rabatt):** [src/config/waitlist.ts](src/config/waitlist.ts)
- **Skjema-markup:** [src/components/WaitlistSection.astro](src/components/WaitlistSection.astro)
- **API-logikk:** [src/pages/api/waitlist.ts](src/pages/api/waitlist.ts)
- **E-postmal:** inline i API-ruten (`sendConfirmationEmail`)

## Feilsøking

- **Innmelding feiler med `turnstile_failed`:** Site key og secret key hører sammen — sjekk at begge kommer fra samme Turnstile-widget.
- **Innmelding feiler med `storage_failed`:** Sjekk Worker-logg (`pnpm wrangler tail`). Oftest feil service role key eller at `schema.sql` ikke er kjørt.
- **E-post kommer ikke frem:** Sjekk at Resend-domenet er "Verified". Uverifisert domene → Resend avviser send, men innmeldingen lagres likevel (bevisst — se `waitlist.ts`).
- **Kontakter vs. volum:** Free tier på Resend tåler transaksjonelle bekreftelser greit. Når du skal kjøre én stor broadcast til hele listen, oppgrader Resend til Pro for én måned eller eksporter til en kampanje-tjeneste.
