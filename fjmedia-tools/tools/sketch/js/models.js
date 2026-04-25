const nowISO = () => new Date().toISOString();
const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export function createBoard(name) {
  const ts = nowISO();
  return {
    id: uid('brd'),
    name: name || 'Untitled',
    createdAt: ts,
    updatedAt: ts,
    mode: 'wire',
    stack: []
  };
}

export function createBlock(category) {
  return {
    id: uid('blk'),
    category,
    variant: 0,
    notes: '',
    doodle: null
  };
}

export function insertBlock(board, block, index) {
  if (index === null || index === undefined || index >= board.stack.length) {
    board.stack.push(block);
  } else {
    board.stack.splice(Math.max(0, index), 0, block);
  }
  board.updatedAt = nowISO();
}

export function removeBlock(board, blockId) {
  const i = board.stack.findIndex(b => b.id === blockId);
  if (i !== -1) board.stack.splice(i, 1);
  board.updatedAt = nowISO();
}

export function reorderBlock(board, fromIndex, toIndex) {
  if (fromIndex === toIndex) return;
  const [item] = board.stack.splice(fromIndex, 1);
  board.stack.splice(toIndex, 0, item);
  board.updatedAt = nowISO();
}

export function setVariant(board, blockId, variantIndex) {
  const blk = board.stack.find(b => b.id === blockId);
  if (blk) {
    blk.variant = variantIndex;
    board.updatedAt = nowISO();
  }
}

export function setNotes(board, blockId, notes) {
  const blk = board.stack.find(b => b.id === blockId);
  if (blk) {
    blk.notes = notes;
    board.updatedAt = nowISO();
  }
}

export function setDoodle(board, blockId, doodle) {
  const blk = board.stack.find(b => b.id === blockId);
  if (blk) {
    blk.doodle = doodle;
    board.updatedAt = nowISO();
  }
}

export function rollPolaroidTilt() {
  return Math.round((Math.random() * 12 - 6) * 10) / 10;
}

export function createPolaroid({ x = 0.4, y = 0.3 } = {}) {
  return {
    id: uid('pol'),
    x,
    y,
    rotation: rollPolaroidTilt(),
    caption: '',
    imageDataUrl: null,
    z: Date.now()
  };
}

export function serializeBoardToSpec(board, variantSummaryFn) {
  const lines = [`Board: ${board.name}`, ''];
  board.stack.forEach((blk, i) => {
    const summary = variantSummaryFn(blk.category, blk.variant);
    lines.push(`${i + 1}. ${summary}`);
  });
  const notesEntries = board.stack
    .map((blk, i) => ({ blk, i }))
    .filter(x => x.blk.notes && x.blk.notes.trim());
  if (notesEntries.length > 0) {
    lines.push('', 'Notes:');
    notesEntries.forEach(({ blk, i }) => {
      lines.push(`  - Block ${i + 1}: "${blk.notes.trim()}"`);
    });
  }
  return lines.join('\n');
}
