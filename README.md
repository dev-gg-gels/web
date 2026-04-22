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
   - Validerer e-post og at samtykke-checkboksen er huket av (`consent === true`)
   - Verifiserer Turnstile-token
   - Skriver raden til Supabase via REST (service role key), inkludert `locale` (`nb` / `en`) for senere språk-riktig kommunikasjon
   - Sender lokalisert bekreftelses-e-post via Resend (feiler stille — innmeldingen er uansett lagret)

Personvernerklæring ligger på [`/personvern`](src/pages/personvern.astro) og [`/en/privacy`](src/pages/en/privacy.astro), lenket fra footer og fra samtykke-checkboksen.

## Kommandoer

| Kommando | Beskrivelse |
| :--- | :--- |
| `pnpm install` | Installer avhengigheter |
| `pnpm dev` | Dev-server på `localhost:4321` |
| `pnpm build` | Bygg til `./dist/` |
| `pnpm preview` | Preview bygget lokalt |
| `pnpm deploy` | Build + deploy til Cloudflare i én kommando |
| `pnpm generate-types` | Generer Cloudflare bindings-typer manuelt (kalles automatisk av `dev`/`build`) |

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

### 4. Lokal konfig — `.env` og `.dev.vars`

To filer trengs lokalt (begge er gitignored):

- **`.env`** — brukes av Astro/Vite ved build/dev for `PUBLIC_*`-variabler (f.eks. `PUBLIC_TURNSTILE_SITE_KEY`) som inlines i klient-bundlen.
- **`.dev.vars`** — Wrangler-konvensjon, brukes av `@astrojs/cloudflare` i dev slik at API-ruten får tilgang til Worker-secrets via `import { env } from "cloudflare:workers"`. Uten denne returnerer `/api/waitlist` 500 på localhost.

Enkleste oppsett:

```sh
cp .env.example .env
cp .env .dev.vars
```

Fyll inn verdier i begge. For Turnstile lokalt er det praktisk å bytte til Cloudflares ["always-pass"-testnøkler](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) i `.dev.vars` slik at du ikke trenger å hviteliste localhost i produksjons-widgeten:

```
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Lokale signups havner automatisk med `environment = 'test'` i Supabase (jf. hostname-sjekk i [waitlist.ts](src/pages/api/waitlist.ts)), så de blander seg ikke med produksjonsdata. Rydd dem med `delete from public.waitlist where environment = 'test';`.

## Deploy

### One-shot

```sh
pnpm deploy
```

Dette bygger (`astro build`) og deployer Worker-en til Cloudflare i én kommando. Hvis build feiler, avbrytes deployen.

### Sett secrets på Worker-en (én gang)

Secrets skal **ikke** ligge i `wrangler.jsonc` eller i repo — de er gitignored via `.dev.vars`. Sett dem via Wrangler:

```sh
pnpm wrangler secret put SUPABASE_URL
pnpm wrangler secret put SUPABASE_SERVICE_ROLE_KEY
pnpm wrangler secret put RESEND_API_KEY
pnpm wrangler secret put TURNSTILE_SECRET_KEY
```

`RESEND_FROM_EMAIL` ligger som public var i [wrangler.jsonc](wrangler.jsonc).

`PUBLIC_TURNSTILE_SITE_KEY` inlines i klient-bundlen ved build-tid og må derfor ligge i build-miljøet (lokal `.env` ved `pnpm build`, eller env var i CI dersom du bygger i skyen).

Verifiser med:

```sh
pnpm wrangler secret list
pnpm wrangler tail     # live Worker-logger
```

Worker-navn og entrypoint er satt i [wrangler.jsonc](wrangler.jsonc). `worker-configuration.d.ts` er auto-generert (og gitignored) — `dev` og `build` regenererer den som første steg.

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
