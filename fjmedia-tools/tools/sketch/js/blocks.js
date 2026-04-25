/**
 * Block library catalog.
 *
 * Pass 1 ships filled variants for: hero, features, cta.
 * Pass 2 will fill: trust, beforeAfter, process, pricing, testimonial, faq, footer.
 */

export const CATEGORIES = {
  hero: {
    label: 'Hero',
    variants: [
      {
        name: 'Split image right',
        wireSpec: {
          rows: [
            { label: 'HERO — split image right', weight: 1, cells: [
              { label: 'H1 + subhead\n+ 2 CTAs', kind: 'text', weight: 6 },
              { label: 'Image', kind: 'image', weight: 4 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-hero sk-hero--split">
            <div class="sk-hero__copy">
              <div class="sk-eyebrow">EYEBROW</div>
              <h1>Headline goes here, two-line max.</h1>
              <p>Short subhead, one line.</p>
              <div class="sk-cta-row">
                <button class="sk-btn sk-btn--gold">Primary CTA</button>
                <button class="sk-btn sk-btn--ghost">Secondary</button>
              </div>
            </div>
            <div class="sk-hero__img"></div>
          </section>` },
        jsonSummary: 'Hero: split-layout, image right, H1 + subhead, 2 CTAs (primary + ghost)'
      },
      {
        name: 'Centered',
        wireSpec: {
          rows: [
            { label: 'HERO — centered', weight: 1, cells: [
              { label: 'EYEBROW · H1 · subhead · 2 CTAs', kind: 'text-center', weight: 10 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-hero sk-hero--center">
            <div class="sk-eyebrow">EYEBROW</div>
            <h1>Centered headline, one big line.</h1>
            <p>Short subhead under it.</p>
            <div class="sk-cta-row sk-cta-row--center">
              <button class="sk-btn sk-btn--gold">Primary CTA</button>
              <button class="sk-btn sk-btn--ghost">Secondary</button>
            </div>
          </section>` },
        jsonSummary: 'Hero: centered, eyebrow + H1 + subhead + 2 CTAs'
      },
      {
        name: 'Stat cards',
        wireSpec: {
          rows: [
            { label: 'HERO — H1 + stat cards', weight: 1, cells: [
              { label: 'H1 + subhead', kind: 'text', weight: 10 }
            ]},
            { label: '3 stat cards', weight: 1, cells: [
              { label: 'Stat 1', kind: 'card', weight: 1 },
              { label: 'Stat 2', kind: 'card', weight: 1 },
              { label: 'Stat 3', kind: 'card', weight: 1 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-hero sk-hero--stats">
            <h1>Big headline, then proof underneath.</h1>
            <p>Subhead in one line.</p>
            <div class="sk-stat-row">
              <div class="sk-stat"><strong>120+</strong><span>Clients shipped</span></div>
              <div class="sk-stat"><strong>4.9★</strong><span>Avg rating</span></div>
              <div class="sk-stat"><strong>48h</strong><span>Avg turnaround</span></div>
            </div>
          </section>` },
        jsonSummary: 'Hero: H1 + subhead + 3 stat cards row underneath'
      },
      {
        name: 'Video background',
        wireSpec: {
          rows: [
            { label: 'HERO — video bg', weight: 1, cells: [
              { label: 'Video bg + overlay\nH1 + 1 CTA', kind: 'video', weight: 10 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-hero sk-hero--video">
            <div class="sk-hero__videobg"></div>
            <div class="sk-hero__overlay"></div>
            <div class="sk-hero__copy">
              <h1>Cinematic headline, single CTA.</h1>
              <button class="sk-btn sk-btn--gold">Primary CTA</button>
            </div>
          </section>` },
        jsonSummary: 'Hero: full-bleed video background, overlay, H1 + single CTA'
      },
      {
        name: 'Scarcity pill',
        wireSpec: {
          rows: [
            { label: 'HERO — scarcity', weight: 1, cells: [
              { label: 'pill: 1/5 spots\nH1 + subhead + CTA', kind: 'text', weight: 10 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-hero sk-hero--scarcity">
            <div class="sk-pill">1/5 build slots — May</div>
            <h1>Headline with scarcity above it.</h1>
            <p>Subhead reinforcing the pill.</p>
            <button class="sk-btn sk-btn--gold">Claim a slot</button>
          </section>` },
        jsonSummary: 'Hero: scarcity pill (X/Y slots) + H1 + subhead + 1 CTA'
      }
    ]
  },

  trust:        { label: 'Trust strip',     variants: [] },

  features: {
    label: 'Features',
    variants: [
      {
        name: '3-column',
        wireSpec: {
          rows: [
            { label: 'FEATURES — 3-col', weight: 1, cells: [
              { label: 'Icon\nTitle\nDesc', kind: 'card', weight: 1 },
              { label: 'Icon\nTitle\nDesc', kind: 'card', weight: 1 },
              { label: 'Icon\nTitle\nDesc', kind: 'card', weight: 1 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-features sk-features--3col">
            <h2>What you get</h2>
            <div class="sk-grid sk-grid--3">
              <div class="sk-feat"><div class="sk-feat__ico"></div><h3>Feature one</h3><p>One-line description.</p></div>
              <div class="sk-feat"><div class="sk-feat__ico"></div><h3>Feature two</h3><p>One-line description.</p></div>
              <div class="sk-feat"><div class="sk-feat__ico"></div><h3>Feature three</h3><p>One-line description.</p></div>
            </div>
          </section>` },
        jsonSummary: 'Features: 3-column, icon top, title + 1-line description each'
      },
      {
        name: 'Bento (2x2 mixed)',
        wireSpec: {
          rows: [
            { label: 'FEATURES — bento', weight: 2, cells: [
              { label: 'Big tile\n(2x2)', kind: 'card', weight: 2 },
              { label: 'Tile', kind: 'card', weight: 1 },
              { label: 'Tile', kind: 'card', weight: 1 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-features sk-features--bento">
            <h2>What you get</h2>
            <div class="sk-bento">
              <div class="sk-bento__big"><h3>Headline feature</h3><p>Two-line description goes here.</p></div>
              <div class="sk-bento__sm"><h3>Feature</h3><p>Short.</p></div>
              <div class="sk-bento__sm"><h3>Feature</h3><p>Short.</p></div>
              <div class="sk-bento__sm"><h3>Feature</h3><p>Short.</p></div>
            </div>
          </section>` },
        jsonSummary: 'Features: bento — 1 large headline tile + 3 smaller tiles'
      },
      {
        name: 'Alt-image',
        wireSpec: {
          rows: [
            { label: 'FEATURES — alt-image #1', weight: 1, cells: [
              { label: 'Image', kind: 'image', weight: 5 },
              { label: 'Title + body + CTA', kind: 'text', weight: 5 }
            ]},
            { label: 'FEATURES — alt-image #2', weight: 1, cells: [
              { label: 'Title + body + CTA', kind: 'text', weight: 5 },
              { label: 'Image', kind: 'image', weight: 5 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-features sk-features--alt">
            <div class="sk-alt-row">
              <div class="sk-alt-row__img"></div>
              <div class="sk-alt-row__copy"><h3>First benefit</h3><p>Body copy explaining it.</p><button class="sk-btn sk-btn--ghost">Learn more</button></div>
            </div>
            <div class="sk-alt-row sk-alt-row--reverse">
              <div class="sk-alt-row__copy"><h3>Second benefit</h3><p>Body copy explaining it.</p><button class="sk-btn sk-btn--ghost">Learn more</button></div>
              <div class="sk-alt-row__img"></div>
            </div>
          </section>` },
        jsonSummary: 'Features: alternating image/copy rows, 2+ rows, ghost CTA per row'
      },
      {
        name: 'Icon list',
        wireSpec: {
          rows: [
            { label: 'FEATURES — icon list', weight: 1, cells: [
              { label: 'Item 1\nItem 2\nItem 3\nItem 4', kind: 'text', weight: 10 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-features sk-features--list">
            <h2>What's included</h2>
            <ul class="sk-checks">
              <li>Item one in the list</li>
              <li>Item two in the list</li>
              <li>Item three in the list</li>
              <li>Item four in the list</li>
            </ul>
          </section>` },
        jsonSummary: 'Features: vertical checklist, 4-6 items, gold checkmarks'
      }
    ]
  },

  beforeAfter:  { label: 'Before / After', variants: [] },
  process:      { label: 'Process',         variants: [] },
  pricing:      { label: 'Pricing',         variants: [] },
  testimonial:  { label: 'Testimonial',     variants: [] },
  faq:          { label: 'FAQ',             variants: [] },

  cta: {
    label: 'CTA banner',
    variants: [
      {
        name: 'Full-width',
        wireSpec: {
          rows: [
            { label: 'CTA — full-width', weight: 1, cells: [
              { label: 'H2 + subhead + 1 CTA', kind: 'text-center', weight: 10 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-cta sk-cta--full">
            <h2>Ready to ship something they'll actually click?</h2>
            <p>One-line subhead reinforcing the offer.</p>
            <button class="sk-btn sk-btn--gold sk-btn--lg">Book a call</button>
          </section>` },
        jsonSummary: 'CTA banner: full-width, centered H2 + subhead + 1 button'
      },
      {
        name: 'Split (image + copy)',
        wireSpec: {
          rows: [
            { label: 'CTA — split', weight: 1, cells: [
              { label: 'H2 + 1 CTA', kind: 'text', weight: 6 },
              { label: 'Image', kind: 'image', weight: 4 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-cta sk-cta--split">
            <div class="sk-cta__copy">
              <h2>Headline left, image right.</h2>
              <button class="sk-btn sk-btn--gold">Primary CTA</button>
            </div>
            <div class="sk-cta__img"></div>
          </section>` },
        jsonSummary: 'CTA banner: split, H2 + CTA on left, image on right'
      },
      {
        name: 'Scarcity',
        wireSpec: {
          rows: [
            { label: 'CTA — scarcity', weight: 1, cells: [
              { label: 'pill: X/Y left\nH2 + 1 CTA', kind: 'text-center', weight: 10 }
            ]}
          ]
        },
        styledSpec: { html: `
          <section class="sk-cta sk-cta--scarcity">
            <div class="sk-pill">Only 1 build slot left this month</div>
            <h2>Don't wait — claim it now.</h2>
            <button class="sk-btn sk-btn--gold">Claim my slot</button>
          </section>` },
        jsonSummary: 'CTA banner: scarcity pill + H2 + 1 CTA, centered'
      }
    ]
  },

  footer:       { label: 'Footer',          variants: [] }
};

export function getCategory(key) {
  return CATEGORIES[key] || null;
}

export function getCategoryLabel(key) {
  const c = CATEGORIES[key];
  return c ? c.label : key;
}

export function getVariant(categoryKey, variantIndex) {
  const c = CATEGORIES[categoryKey];
  if (!c || c.variants.length === 0) return null;
  const i = (variantIndex >= 0 && variantIndex < c.variants.length) ? variantIndex : 0;
  return c.variants[i];
}

export function getJsonSummary(categoryKey, variantIndex) {
  const v = getVariant(categoryKey, variantIndex);
  return v ? v.jsonSummary : `${categoryKey}: variant ${variantIndex}`;
}
