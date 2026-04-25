import { describe, it, assertTrue, assertEqual } from './test-runner.js';
import { CATEGORIES, getCategory, getVariant, getJsonSummary, getCategoryLabel } from '../js/blocks.js';

describe('CATEGORIES', () => {
  it('contains all 10 category keys', () => {
    const expected = ['hero','trust','features','beforeAfter','process','pricing','testimonial','faq','cta','footer'];
    expected.forEach(key => assertTrue(CATEGORIES[key], `missing category: ${key}`));
  });
  it('Pass 1 categories (hero, features, cta) have at least 3 variants each', () => {
    assertTrue(CATEGORIES.hero.variants.length >= 3, 'hero variants');
    assertTrue(CATEGORIES.features.variants.length >= 3, 'features variants');
    assertTrue(CATEGORIES.cta.variants.length >= 3, 'cta variants');
  });
  it('every variant has name, wireSpec, styledSpec, jsonSummary', () => {
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      cat.variants.forEach((v, i) => {
        assertTrue(typeof v.name === 'string' && v.name.length > 0, `${key}[${i}].name`);
        assertTrue(v.wireSpec && typeof v.wireSpec === 'object', `${key}[${i}].wireSpec`);
        assertTrue(v.styledSpec && typeof v.styledSpec.html === 'string' && v.styledSpec.html.length > 0, `${key}[${i}].styledSpec.html`);
        assertTrue(typeof v.jsonSummary === 'string' && v.jsonSummary.length > 0, `${key}[${i}].jsonSummary`);
      });
    });
  });
});

describe('getCategory / getVariant / getJsonSummary / getCategoryLabel', () => {
  it('getCategory returns the category object', () => {
    assertEqual(getCategory('hero').label, CATEGORIES.hero.label);
  });
  it('getVariant returns variant 0 by default for known category', () => {
    const v = getVariant('hero', 0);
    assertTrue(v.name.length > 0, 'variant has name');
  });
  it('getVariant clamps out-of-range index to 0', () => {
    const v = getVariant('hero', 999);
    assertEqual(v.name, CATEGORIES.hero.variants[0].name);
  });
  it('getJsonSummary returns the variant jsonSummary', () => {
    const expected = CATEGORIES.hero.variants[0].jsonSummary;
    assertEqual(getJsonSummary('hero', 0), expected);
  });
  it('getCategoryLabel returns the human label', () => {
    assertEqual(getCategoryLabel('cta'), CATEGORIES.cta.label);
  });
});
