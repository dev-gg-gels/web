/** Matches Tailwind's `md:` breakpoint (768px min-width). */
export const MOBILE_BREAKPOINT = 768;

/** Use in HTML `media` attributes and CSS `@media` queries for below-md viewports. */
export const MOBILE_MEDIA = `(max-width: ${MOBILE_BREAKPOINT - 1}px)` as const;
