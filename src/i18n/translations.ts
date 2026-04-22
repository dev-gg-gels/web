export type Locale = 'nb' | 'en';

export const translations = {
  nb: {
    nav: {
      logoAlt: 'GG-Gels',
      langSwitch: 'English',
      langSwitchLocale: 'en' as Locale,
      ctaLabel: 'Meld deg på',
    },

    hero: {
      eyebrow: 'Din ernæringscaddy',
      title: 'Energi som matcher runden.\nHull for hull.',
      body: 'Ikke én generisk sportsgel – et system av fire gels designet for golfens fire faser. Fra første tee til siste putt.',
      ctaPrimary: 'Meld deg på ventelisten',
      ctaSecondary: 'Se produktet',
      earlyBirdNote: 'Begrenset early bird-tilgang · 20% rabatt til de første 500',
    },

    problem: {
      eyebrow: 'Problemet',
      title: 'Kjenner du deg igjen?',
      items: [
        {
          title: 'Energikollaps på back 9',
          body: 'Du starter sterkt, men etter hull 12 er konsentrasjonen borte og kroppen gir etter. Det koster deg slag du egentlig har.',
        },
        {
          title: 'Hjernen når ikke med',
          body: 'Golf handler om finmotorikk og mental skjerphet – ikke bare kondisjon. Vanlig sportsgel er designet for løping, ikke putting.',
        },
        {
          title: 'Banan og proteinbar holder ikke',
          body: 'Du prøver å spise riktig, men hverken timing, mengde eller innhold er optimalisert for 18 hull i varierende intensitet.',
        },
      ],
      quoteText:
        '"Forskning viser at kognitiv ytelse hos golfspillere faller signifikant fra hull 10 – særlig på puttelinja og i beslutninger under press."',
      quoteSource: 'Basert på Mumford et al., 2016 / Nagashima et al., 2023',
      imageAlt: 'Golfer på fairway – illustrerer energiutfordring på back 9',
    },

    products: {
      eyebrow: 'Produktsystemet',
      title: 'Fire gels. Fire faser. Én runde.',
      body: 'Hvert gel er formulert for ett spesifikt moment i runden – ikke bare "ta én gel og håp på det beste".',
      ctaLabel: 'Bli med på ventelisten',
      gels: [
        {
          name: 'Tee Off',
          timing: 'Før runden',
          tagline: 'Skarp fra hull 1',
          description:
            'Starter runden med jevn energi og skjerpet fokus. Kombinasjonen av koffein og L-theanin gir ro med konsentrasjon – ingen koffein-jitter som ødelegger første tee.',
          benefits: ['Rolig fokus', 'Jevn energistart', 'Klar for presisjon'],
        },
        {
          name: 'Front 9 Focus',
          timing: 'Rundt hull 4–5',
          tagline: 'Hold nivået oppe',
          description:
            'Fyller opp glukoselagrene i forkant av midtpunktet uten å ødelegge konsentrasjonen. Ren karbohydratboost som holder deg skjerpet gjennom front 9.',
          benefits: ['Stabil blodsukker', 'Ingen trøtthet', 'Vedvarende rytme'],
        },
        {
          name: 'Back 9 Clutch',
          timing: 'Rundt hull 10–11',
          tagline: 'Full kraft fra hull 10',
          description:
            'Akkurat der energien pleier å svikte – et kraftig løft av fokus og utholdenhet. Ekstra L-theanin for å holde presisjonsnivået oppe når kroppen begynner å gi etter.',
          benefits: ['Motvirker utmattelse', 'Presisjon under press', 'Mentalt løft'],
        },
        {
          name: 'Finishing Putt',
          timing: 'Hull 15–16',
          tagline: 'Avslutt sterkt',
          description:
            'Null koffein, høy L-theanin. Designet for finmotorikk og ro på de avgjørende siste hullene – akkurat det du trenger for å holde nerven på den siste puttlinja.',
          benefits: ['Ro under press', 'Finmotorikk', 'Skarp til siste hull'],
        },
      ],
    },

    howItWorks: {
      eyebrow: 'Slik fungerer det',
      title: 'Enkelt nok til å tenke på golfen',
      steps: [
        {
          label: '01',
          title: 'Fest GG-Clip™ på bagen',
          body: 'Klipsen holder alle fire gels i rekkefølge på bagestropen. Du vet alltid hvilken som er neste – uten å lete.',
          imageAlt: 'GG-Clip med fire gels på golfbag-stropen',
        },
        {
          label: '02',
          title: 'Ta riktig gel til riktig tid',
          body: 'Store tall (1–4) viser deg hvilken du skal ta og når. Bygget for folk som tenker på golfen – ikke ernæringsplanen.',
          imageAlt: 'Tee Off gel holdt i hånden ved første tee',
        },
        {
          label: '03',
          title: 'Avslutt runden din – ikke overlev den',
          body: 'Med riktig næring til riktig tid holder du fokuset og energien oppe gjennom alle 18 hull.',
          imageAlt: 'Gel i lomme klar for bruk på fairway',
        },
      ],
    },

    finalCta: {
      eyebrow: 'Klar for å prøve?',
      title: 'Spill runden du vet du har i deg',
      body: 'Du har utstyret. Du har treningen. Det eneste som mangler er ernæringen som holder deg skjerpet alle 18 hull – ikke bare de første ni.',
      cta: 'Meld meg på ventelisten',
      imageAlt: 'Fire GG-Gels montert på golfbag med GG-Clip',
    },

    waitlist: {
      eyebrow: 'Early bird-tilgang',
      title: 'Bli blant de første {max}',
      body: 'Meld deg på ventelisten nå og få {discount} rabatt ved lansering, pluss eksklusiv informasjon om produktet før alle andre.',
      emailLabel: 'E-postadresse',
      emailPlaceholder: 'din@epost.no',
      handicapLegend: 'Hva er handicapet ditt?',
      handicapOptions: [
        { value: 'under-5', label: 'Under 5' },
        { value: '5-12', label: '5–12' },
        { value: '12-20', label: '12–20' },
        { value: '20-30', label: '20–30' },
        { value: 'over-30', label: '30+' },
      ],
      frequencyLegend: 'Hvor ofte spiller du?',
      frequencyOptions: [
        { value: 'casual', label: 'Noen ganger i sesongen' },
        { value: 'regular', label: '1 gang per uke' },
        { value: 'frequent', label: '2 ganger per uke' },
        { value: 'avid', label: '3+ ganger per uke' },
      ],
      currentSolutionLegend: 'Bruker du sportsgeler eller ernæring på runden i dag?',
      currentSolutionOptions: [
        { value: 'regular', label: 'Ja, bruker sportsgeler fast' },
        { value: 'tried', label: 'Har prøvd, men ikke fast rutine' },
        { value: 'food-only', label: 'Bare mat og snacks (banan, bar etc.)' },
        { value: 'none', label: 'Nei, ingenting' },
      ],
      prioritiesLegend: 'Hva er viktig for deg når du velger en sportsgel?',
      prioritiesHint: 'Flere valg mulig',
      prioritiesOptions: [
        { value: 'performance', label: 'Jevn energi og fokus gjennom hele runden' },
        { value: 'taste', label: 'God smak' },
        { value: 'price', label: 'Pris' },
        { value: 'ingredients', label: 'Rene/naturlige ingredienser' },
      ],
      priceLegend: 'Hva ville du betalt for en 4-pakke (én full runde)?',
      priceOptions: [
        { value: 'under-200', label: 'Under 200 kr' },
        { value: '200-249', label: '200–249 kr' },
        { value: '250-299', label: '250–299 kr' },
        { value: '300-plus', label: '300 kr eller mer' },
        { value: 'unsure', label: 'Usikker' },
      ],
      attributionLegend: 'Hvordan fant du GG-Gels?',
      attributionOptions: [
        { value: 'instagram', label: 'Instagram eller Facebook' },
        { value: 'google', label: 'Google-søk' },
        { value: 'referral', label: 'Anbefaling fra venn eller klubb' },
        { value: 'media', label: 'Golfmagasin, podcast eller nyhetsbrev' },
        { value: 'other', label: 'Annet' },
      ],
      attributionOtherLabel: 'Hvor hørte du om oss?',
      attributionOtherPlaceholder: 'Fortell oss hvor',
      clubLabel: 'Hvilken klubb spiller du i?',
      clubHint: 'Valgfritt',
      clubPlaceholder: 'F.eks. Oslo GK',
      submitLabel: 'Meld meg på ventelisten',
      submittingLabel: 'Sender...',
      privacyNote: 'Ingen spam. Kun viktige oppdateringer om GG-Gels. Meld deg av når som helst.',
      successEmoji: '⛳',
      successTitle: 'Du er med på listen!',
      successBody:
        'Vi sender deg en e-post med mer informasjon og {discount} rabattkode når vi er klare til lansering.',
      errorBody:
        'Noe gikk galt. Prøv igjen, eller send oss en e-post på hei@gg-gels.no.',
    },

    faq: {
      eyebrow: 'Spørsmål og svar',
      title: 'Vanlige spørsmål',
      contactPrompt: 'Har du et spørsmål som ikke er besvart her?',
      contactLabel: 'Send oss en e-post',
      items: [
        {
          question: 'Hva er egentlig GG-Gels?',
          answer:
            'GG-Gels er et system av fire energigels designet spesifikt for golfrunder. Hvert gel er formulert for én bestemt fase i runden – fra opplading før tee til presisjon på de siste hullene. I motsetning til generiske sportsgels tar vi hensyn til golfens unike blanding av utholdenhet, konsentrasjon og finmotorikk.',
        },
        {
          question: 'Hvorfor fire gels og ikke bare én?',
          answer:
            'En golfrunde varer 4–5 timer med svært varierende krav. Du trenger fokus og energi på tee, jevnt blodsukker gjennom front 9, et løft mot slutten, og ro i finmotorikken de siste hullene. Én gel kan ikke gjøre alt dette – det er et system.',
        },
        {
          question: 'Skader koffein putting-presisjon?',
          answer:
            'Det er akkurat derfor gel nr. 4 (Finishing Putt) ikke inneholder koffein – kun høy dose L-theanin. L-theanin uten koffein gir avslappet skjerphet og reduserer skjelvinger, som er det du vil ha på de avgjørende puttene.',
        },
        {
          question: 'Er gelene trygge for magen?',
          answer:
            'Vi bruker en isotonisk formel (300 mOsm/kg) uten fruktos og uten sukkeralkoholer – de vanligste synderne bak mageproblemer med sportsgel. Formelen er designet for å absorberes raskt uten å belaste magen.',
        },
        {
          question: 'Hva er GG-Clip™?',
          answer:
            'GG-Clip™ er en enkel holder som festes på golfbag-stropen og holder de fire gelene i rekkefølge. Du trenger aldri lete etter riktig gel i bagen – og store tall (1–4) viser deg alltid hvilken som er neste.',
        },
        {
          question: 'Når lanseres produktet?',
          answer:
            'Vi er i valideringsfasen nå og planlegger lansering til golfsesongen 2026. Ventelisten er vår måte å forstå etterspørselen på – og de første 500 som melder seg får 20% rabatt ved lansering.',
        },
        {
          question: 'Hva koster det?',
          answer:
            'Det er for tidlig å sette endelig pris, men vi sikter mot et nivå som er rettferdig for et premium ernæringsprodukt – ikke billig, men heller ikke urimelig for den som tar golfen seriøst. Du vil bli varslet om prissetting og få din early bird-rabatt.',
        },
      ],
    },

    footer: {
      tagline: 'Din ernæringscaddy',
      email: 'hei@gg-gels.no',
      instagramLabel: 'Instagram',
      waitlistLabel: 'Venteliste',
      copyright: '© {year} GG-Gels. Alle rettigheter forbeholdt.',
      location: 'Oslo, Norge',
    },
  },

  en: {
    nav: {
      logoAlt: 'GG-Gels',
      langSwitch: 'Norsk',
      langSwitchLocale: 'nb' as Locale,
      ctaLabel: 'Join waitlist',
    },

    hero: {
      eyebrow: 'Golf nutrition. Redesigned.',
      title: 'Energy that matches your round.\nHole by hole.',
      body: 'Not one generic sports gel – a system of four gels designed for golf\'s four phases. From the first tee to the final putt.',
      ctaPrimary: 'Join the waitlist',
      ctaSecondary: 'See the product',
      earlyBirdNote: 'Limited early bird access · 20% off for the first 500',
    },

    problem: {
      eyebrow: 'The problem',
      title: 'Sound familiar?',
      items: [
        {
          title: 'Energy crash on the back 9',
          body: 'You start strong, but by hole 12 your concentration is gone and your body gives in. It costs you strokes you know you had.',
        },
        {
          title: 'Your brain can\'t keep up',
          body: 'Golf is about fine motor control and mental sharpness – not just endurance. Regular sports gels are designed for running, not putting.',
        },
        {
          title: 'A banana and protein bar aren\'t cutting it',
          body: 'You try to eat right, but neither the timing, quantity nor content is optimised for 18 holes of varying intensity.',
        },
      ],
      quoteText:
        '"Research shows that cognitive performance in golfers declines significantly from hole 10 onwards – particularly on the putting line and in decisions under pressure."',
      quoteSource: 'Based on Mumford et al., 2016 / Nagashima et al., 2023',
      imageAlt: 'Golfer on the fairway – illustrating energy challenges on the back 9',
    },

    products: {
      eyebrow: 'The product system',
      title: 'Four gels. Four phases. One round.',
      body: 'Each gel is formulated for one specific moment in the round – not just "take a gel and hope for the best".',
      ctaLabel: 'Join the waitlist',
      gels: [
        {
          name: 'Tee Off',
          timing: 'Before the round',
          tagline: 'Sharp from hole 1',
          description:
            'Start the round with steady energy and sharpened focus. The combination of caffeine and L-theanine delivers calm concentration – no caffeine jitter to ruin the first tee.',
          benefits: ['Calm focus', 'Steady energy start', 'Ready for precision'],
        },
        {
          name: 'Front 9 Focus',
          timing: 'Around holes 4–5',
          tagline: 'Keep your level up',
          description:
            'Tops up glucose stores before the midpoint without disrupting concentration. A clean carbohydrate boost that keeps you sharp through the front 9.',
          benefits: ['Stable blood sugar', 'No fatigue', 'Sustained rhythm'],
        },
        {
          name: 'Back 9 Clutch',
          timing: 'Around holes 10–11',
          tagline: 'Full power from hole 10',
          description:
            'Right where energy usually fails – a powerful boost of focus and endurance. Extra L-theanine to maintain precision when your body starts to fade.',
          benefits: ['Fights fatigue', 'Precision under pressure', 'Mental lift'],
        },
        {
          name: 'Finishing Putt',
          timing: 'Holes 15–16',
          tagline: 'Finish strong',
          description:
            'Zero caffeine, high L-theanine. Designed for fine motor control and composure on the decisive final holes – exactly what you need to hold your nerve on the last putting line.',
          benefits: ['Composure under pressure', 'Fine motor control', 'Sharp to the last hole'],
        },
      ],
    },

    howItWorks: {
      eyebrow: 'How it works',
      title: 'Simple enough to think about golf',
      steps: [
        {
          label: '01',
          title: 'Clip GG-Clip™ onto your bag',
          body: 'The clip holds all four gels in order on your bag strap. You always know which is next – without searching.',
          imageAlt: 'GG-Clip with four gels on golf bag strap',
        },
        {
          label: '02',
          title: 'Take the right gel at the right time',
          body: 'Large numbers (1–4) show you which to take and when. Built for people thinking about golf – not their nutrition plan.',
          imageAlt: 'Tee Off gel held in hand at the first tee',
        },
        {
          label: '03',
          title: 'Finish your round – don\'t just survive it',
          body: 'With the right nutrition at the right time, you maintain focus and energy through all 18 holes.',
          imageAlt: 'Gel in pocket ready for use on the fairway',
        },
      ],
    },

    finalCta: {
      eyebrow: 'Ready to try it?',
      title: 'Play the round you know you have in you',
      body: 'You have the equipment. You have the practice. The only thing missing is the nutrition to keep you sharp for all 18 holes – not just the first nine.',
      cta: 'Join the waitlist',
      imageAlt: 'Four GG-Gels mounted on golf bag with GG-Clip',
    },

    waitlist: {
      eyebrow: 'Early bird access',
      title: 'Be among the first {max}',
      body: 'Join the waitlist now and get {discount} off at launch, plus exclusive information about the product before anyone else.',
      emailLabel: 'Email address',
      emailPlaceholder: 'your@email.com',
      handicapLegend: 'What is your handicap?',
      handicapOptions: [
        { value: 'under-5', label: 'Under 5' },
        { value: '5-12', label: '5–12' },
        { value: '12-20', label: '12–20' },
        { value: '20-30', label: '20–30' },
        { value: 'over-30', label: '30+' },
      ],
      frequencyLegend: 'How often do you play?',
      frequencyOptions: [
        { value: 'casual', label: 'A few times a season' },
        { value: 'regular', label: 'Once a week' },
        { value: 'frequent', label: 'Twice a week' },
        { value: 'avid', label: '3+ times a week' },
      ],
      currentSolutionLegend: 'Do you use sports gels or nutrition on the course today?',
      currentSolutionOptions: [
        { value: 'regular', label: 'Yes, I use sports gels regularly' },
        { value: 'tried', label: 'Tried them, but not a habit' },
        { value: 'food-only', label: 'Just food and snacks (banana, bar etc.)' },
        { value: 'none', label: 'No, nothing' },
      ],
      prioritiesLegend: 'What matters to you when picking a sports gel?',
      prioritiesHint: 'Select all that apply',
      prioritiesOptions: [
        { value: 'performance', label: 'Steady energy and focus through the round' },
        { value: 'taste', label: 'Good taste' },
        { value: 'price', label: 'Price' },
        { value: 'ingredients', label: 'Clean/natural ingredients' },
      ],
      priceLegend: 'What would you pay for a 4-pack (one full round)?',
      priceOptions: [
        { value: 'under-200', label: 'Under 200 NOK' },
        { value: '200-249', label: '200–249 NOK' },
        { value: '250-299', label: '250–299 NOK' },
        { value: '300-plus', label: '300 NOK or more' },
        { value: 'unsure', label: 'Not sure yet' },
      ],
      attributionLegend: 'How did you hear about GG-Gels?',
      attributionOptions: [
        { value: 'instagram', label: 'Instagram or Facebook' },
        { value: 'google', label: 'Google search' },
        { value: 'referral', label: 'Friend or club recommendation' },
        { value: 'media', label: 'Golf magazine, podcast or newsletter' },
        { value: 'other', label: 'Other' },
      ],
      attributionOtherLabel: 'Where did you hear about us?',
      attributionOtherPlaceholder: 'Tell us where',
      clubLabel: 'Which club do you play at?',
      clubHint: 'Optional',
      clubPlaceholder: 'E.g. Oslo GC',
      submitLabel: 'Add me to the waitlist',
      submittingLabel: 'Sending...',
      privacyNote: 'No spam. Only important updates about GG-Gels. Unsubscribe anytime.',
      successEmoji: '⛳',
      successTitle: 'You\'re on the list!',
      successBody:
        'We\'ll send you an email with more information and your {discount} discount code when we\'re ready to launch.',
      errorBody:
        'Something went wrong. Please try again, or email us at hei@gg-gels.no.',
    },

    faq: {
      eyebrow: 'Questions & answers',
      title: 'Frequently asked questions',
      contactPrompt: 'Have a question that isn\'t answered here?',
      contactLabel: 'Send us an email',
      items: [
        {
          question: 'What exactly is GG-Gels?',
          answer:
            'GG-Gels is a system of four energy gels designed specifically for golf rounds. Each gel is formulated for one specific phase of the round – from fuelling up before the tee to precision on the final holes. Unlike generic sports gels, we account for golf\'s unique blend of endurance, concentration, and fine motor control.',
        },
        {
          question: 'Why four gels and not just one?',
          answer:
            'A golf round lasts 4–5 hours with highly variable demands. You need focus and energy on the tee, steady blood sugar through the front 9, a boost towards the end, and composure in your fine motor skills on the final holes. One gel cannot do all of this – it\'s a system.',
        },
        {
          question: 'Does caffeine harm putting precision?',
          answer:
            'That\'s exactly why gel no. 4 (Finishing Putt) contains no caffeine – only a high dose of L-theanine. L-theanine without caffeine delivers relaxed alertness and reduces tremors, which is what you want on the decisive putts.',
        },
        {
          question: 'Are the gels safe for your stomach?',
          answer:
            'We use an isotonic formula (300 mOsm/kg) without fructose and without sugar alcohols – the most common culprits behind stomach issues with sports gels. The formula is designed to be absorbed quickly without burdening the stomach.',
        },
        {
          question: 'What is GG-Clip™?',
          answer:
            'GG-Clip™ is a simple holder that attaches to your golf bag strap and keeps the four gels in order. You never need to search for the right gel in your bag – and large numbers (1–4) always show you which is next.',
        },
        {
          question: 'When does the product launch?',
          answer:
            'We\'re in the validation phase now and are planning a launch for the 2026 golf season. The waitlist is our way of understanding demand – and the first 500 to sign up get 20% off at launch.',
        },
        {
          question: 'What does it cost?',
          answer:
            'It\'s too early to set a final price, but we\'re aiming for a level that\'s fair for a premium nutrition product – not cheap, but not unreasonable for someone who takes their golf seriously. You\'ll be notified about pricing and receive your early bird discount.',
        },
      ],
    },

    footer: {
      tagline: 'Golf nutrition. Redesigned.',
      email: 'hei@gg-gels.no',
      instagramLabel: 'Instagram',
      waitlistLabel: 'Waitlist',
      copyright: '© {year} GG-Gels. All rights reserved.',
      location: 'Oslo, Norway',
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];
