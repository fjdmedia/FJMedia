import { getVariant, getCategoryLabel } from './blocks.js';

export function renderBlockWire(block) {
  const root = document.createElement('div');
  root.className = 'wire-block';
  root.dataset.kind = block.category;

  const variant = getVariant(block.category, block.variant);
  if (!variant) {
    root.classList.add('wire-block--empty');
    root.innerHTML = `<div class="wire-empty">${getCategoryLabel(block.category)} — coming in Pass 2</div>`;
    return root;
  }

  const grid = document.createElement('div');
  grid.className = 'wire-grid';
  variant.wireSpec.rows.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'wire-row';
    rowEl.style.flex = String(row.weight || 1);
    if (row.label) {
      const lbl = document.createElement('div');
      lbl.className = 'wire-row__label';
      lbl.textContent = row.label;
      rowEl.appendChild(lbl);
    }
    const cellsWrap = document.createElement('div');
    cellsWrap.className = 'wire-cells';
    row.cells.forEach(cell => {
      const c = document.createElement('div');
      c.className = `wire-cell wire-cell--${cell.kind || 'text'}`;
      c.style.flex = String(cell.weight || 1);
      c.textContent = cell.label;
      cellsWrap.appendChild(c);
    });
    rowEl.appendChild(cellsWrap);
    grid.appendChild(rowEl);
  });
  root.appendChild(grid);
  return root;
}
