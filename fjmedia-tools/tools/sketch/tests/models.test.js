import { describe, it, assertEqual, assertTrue } from './test-runner.js';
import {
  createBoard,
  createBlock,
  insertBlock,
  removeBlock,
  reorderBlock,
  setVariant,
  setNotes,
  serializeBoardToSpec
} from '../js/models.js';

describe('createBoard', () => {
  it('returns a board with a name, ids, timestamps, default mode wire, empty stack', () => {
    const b = createBoard('My board');
    assertEqual(b.name, 'My board');
    assertTrue(b.id.startsWith('brd_'), 'id prefix');
    assertEqual(b.mode, 'wire');
    assertEqual(b.stack, []);
    assertTrue(typeof b.createdAt === 'string', 'createdAt');
    assertTrue(typeof b.updatedAt === 'string', 'updatedAt');
  });
});

describe('createBlock', () => {
  it('returns a block with category, variant 0, empty notes, null doodle', () => {
    const blk = createBlock('hero');
    assertTrue(blk.id.startsWith('blk_'), 'id prefix');
    assertEqual(blk.category, 'hero');
    assertEqual(blk.variant, 0);
    assertEqual(blk.notes, '');
    assertEqual(blk.doodle, null);
  });
});

describe('insertBlock', () => {
  it('appends to end when index is null', () => {
    const b = createBoard('B');
    insertBlock(b, createBlock('hero'), null);
    insertBlock(b, createBlock('cta'), null);
    assertEqual(b.stack.map(x => x.category), ['hero', 'cta']);
  });
  it('inserts at given index', () => {
    const b = createBoard('B');
    insertBlock(b, createBlock('hero'), null);
    insertBlock(b, createBlock('cta'), null);
    insertBlock(b, createBlock('features'), 1);
    assertEqual(b.stack.map(x => x.category), ['hero', 'features', 'cta']);
  });
});

describe('removeBlock', () => {
  it('removes by id', () => {
    const b = createBoard('B');
    const a = createBlock('hero');
    const c = createBlock('cta');
    insertBlock(b, a, null);
    insertBlock(b, c, null);
    removeBlock(b, a.id);
    assertEqual(b.stack.length, 1);
    assertEqual(b.stack[0].id, c.id);
  });
});

describe('reorderBlock', () => {
  it('moves a block from one index to another', () => {
    const b = createBoard('B');
    insertBlock(b, createBlock('hero'), null);
    insertBlock(b, createBlock('cta'), null);
    insertBlock(b, createBlock('features'), null);
    reorderBlock(b, 2, 0);
    assertEqual(b.stack.map(x => x.category), ['features', 'hero', 'cta']);
  });
});

describe('setVariant', () => {
  it('sets the variant index on a block by id', () => {
    const b = createBoard('B');
    const a = createBlock('hero');
    insertBlock(b, a, null);
    setVariant(b, a.id, 3);
    assertEqual(b.stack[0].variant, 3);
  });
});

describe('setNotes', () => {
  it('sets notes on a block by id', () => {
    const b = createBoard('B');
    const a = createBlock('hero');
    insertBlock(b, a, null);
    setNotes(b, a.id, 'use stat cards');
    assertEqual(b.stack[0].notes, 'use stat cards');
  });
});

describe('serializeBoardToSpec', () => {
  it('returns a plain-text spec with numbered blocks and notes section', () => {
    const variantSummaryFn = (cat, v) => {
      if (cat === 'hero' && v === 0) return 'Hero: split-layout, image right, H1 + subhead, 2 CTAs';
      if (cat === 'features' && v === 1) return 'Features: 3-col bento, icon top';
      if (cat === 'cta' && v === 0) return 'CTA banner: full-width, single button';
      return `${cat}: variant ${v}`;
    };
    const b = createBoard('Lisa v1');
    const a = createBlock('hero'); a.variant = 0;
    const f = createBlock('features'); f.variant = 1; f.notes = 'icons must match brand';
    const c = createBlock('cta'); c.variant = 0;
    insertBlock(b, a, null); insertBlock(b, f, null); insertBlock(b, c, null);
    const out = serializeBoardToSpec(b, variantSummaryFn);
    assertTrue(out.includes('Board: Lisa v1'), 'has board name');
    assertTrue(out.includes('1. Hero: split-layout'), 'block 1');
    assertTrue(out.includes('2. Features: 3-col bento'), 'block 2');
    assertTrue(out.includes('3. CTA banner: full-width'), 'block 3');
    assertTrue(out.includes('Notes:'), 'notes header');
    assertTrue(out.includes('Block 2: "icons must match brand"'), 'note line');
  });
  it('omits Notes section when no block has notes', () => {
    const b = createBoard('Empty');
    insertBlock(b, createBlock('hero'), null);
    const out = serializeBoardToSpec(b, () => 'Hero');
    assertTrue(!out.includes('Notes:'), 'no notes section');
  });
});
