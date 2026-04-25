import { getVariant, getCategoryLabel } from './blocks.js';

export function renderBlockStyled(block) {
  const root = document.createElement('div');
  root.className = 'styled-block';
  const variant = getVariant(block.category, block.variant);
  if (!variant) {
    root.innerHTML = `<div class="styled-empty">${getCategoryLabel(block.category)} — coming in Pass 2</div>`;
    return root;
  }
  root.innerHTML = variant.styledSpec.html;
  return root;
}
