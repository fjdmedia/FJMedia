import { CATEGORIES } from './blocks.js';

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export function mountSidebar(rootEl, controller) {
  function render() {
    const html = Object.entries(CATEGORIES).map(([key, cat]) => {
      const empty = cat.variants.length === 0;
      const variants = empty
        ? `<div class="sb-empty">Coming in Pass 2</div>`
        : cat.variants.map((v, i) =>
            `<button class="sb-variant" draggable="true" data-cat="${key}" data-variant="${i}">${escapeHtml(v.name)}</button>`
          ).join('');
      return `
        <details class="sb-cat ${empty ? 'sb-cat--empty' : ''}" ${empty ? '' : 'open'}>
          <summary><span class="sb-cat__label">${escapeHtml(cat.label)}</span><span class="sb-cat__count">${empty ? '—' : cat.variants.length}</span></summary>
          <div class="sb-variants">${variants}</div>
        </details>
      `;
    }).join('');
    rootEl.innerHTML = `<div class="sb-head">Block Library</div>${html}`;

    rootEl.querySelectorAll('.sb-variant').forEach(btn => {
      btn.addEventListener('click', () => controller.onAddBlock(btn.dataset.cat, parseInt(btn.dataset.variant, 10)));
      btn.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('application/x-fjsketch-variant', JSON.stringify({ cat: btn.dataset.cat, variant: parseInt(btn.dataset.variant, 10) }));
      });
    });
  }

  return { render };
}
