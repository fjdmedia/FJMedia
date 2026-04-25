import { renderBlockWire } from './render-wire.js';
import { renderBlockStyled } from './render-styled.js';
import { renderDoodleOverlay } from './ui-doodle.js';
import { CATEGORIES } from './blocks.js';

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export function mountCanvas(rootEl, controller) {
  let focusedId = null;

  function render() {
    const board = controller.getActiveBoard();
    if (!board) {
      rootEl.innerHTML = `<div class="cv-empty">No board. Click "+ New" in the topbar to start.</div>`;
      return;
    }
    const mode = controller.getMode();
    if (mode === 'free') {
      renderFreeMode(board);
      return;
    }
    if (board.stack.length === 0) {
      rootEl.innerHTML = `<div class="cv-empty">Empty board. Click a variant in the sidebar to add a block.<br/><br/>(or drag one onto here, or switch to Free mode to just draw)</div>`;
      const tail = document.createElement('div');
      tail.className = 'cv-drop';
      tail.dataset.dropIndex = '0';
      rootEl.appendChild(tail);
      attachDrop(tail, 0);
      return;
    }
    rootEl.innerHTML = '';
    board.stack.forEach((blk, idx) => rootEl.appendChild(buildBlockEl(blk, idx, mode)));
    installDropZones();
  }

  function renderFreeMode(board) {
    rootEl.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'cv-free-wrap';
    wrap.innerHTML = `
      <div class="cv-free-bar">
        <span class="cv-free-label">FREE SKETCH — click and drag to draw</span>
        <button class="doodle-btn" id="cv-free-undo">Undo</button>
        <button class="doodle-btn" id="cv-free-clear">Clear</button>
      </div>
    `;
    const surface = document.createElement('div');
    surface.className = 'cv-free-surface';
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.classList.add('cv-free-svg');
    svg.setAttribute('viewBox', '0 0 1200 1600');
    svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    surface.appendChild(svg);
    wrap.appendChild(surface);
    rootEl.appendChild(wrap);

    const W = 1200, H = 1600;
    const paths = (board.freeCanvas && board.freeCanvas.paths) ? board.freeCanvas.paths.map(p => p.slice()) : [];
    let drawing = null;

    function redraw() {
      let html = paths.map(p =>
        `<polyline points="${p.map(pt => `${pt.x},${pt.y}`).join(' ')}" fill="none" stroke="#071520" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
      ).join('');
      if (drawing && drawing.length > 1) {
        html += `<polyline points="${drawing.map(pt => `${pt.x},${pt.y}`).join(' ')}" fill="none" stroke="#071520" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      svg.innerHTML = html;
    }
    function ptFromEvent(e) {
      const r = svg.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * W,
        y: ((e.clientY - r.top) / r.height) * H
      };
    }
    function commit() {
      controller.onSaveFreeCanvas(paths.length === 0 ? null : { paths });
    }
    svg.addEventListener('pointerdown', (e) => {
      svg.setPointerCapture(e.pointerId);
      drawing = [ptFromEvent(e)];
      redraw();
    });
    svg.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      drawing.push(ptFromEvent(e));
      redraw();
    });
    svg.addEventListener('pointerup', () => {
      if (drawing && drawing.length > 1) paths.push(drawing);
      drawing = null;
      redraw();
      commit();
    });
    wrap.querySelector('#cv-free-undo').addEventListener('click', () => { paths.pop(); redraw(); commit(); });
    wrap.querySelector('#cv-free-clear').addEventListener('click', () => {
      if (!confirm('Clear the whole free canvas?')) return;
      paths.length = 0; redraw(); commit();
    });
    redraw();
  }

  function buildBlockEl(block, index, mode) {
    const wrap = document.createElement('div');
    wrap.className = 'cv-block-wrap' + (block.id === focusedId ? ' is-focused' : '');
    wrap.dataset.blockId = block.id;
    wrap.dataset.index = String(index);
    wrap.tabIndex = 0;

    const cat = CATEGORIES[block.category];
    const variantCount = cat ? cat.variants.length : 0;
    const variantLabel = (cat && cat.variants[block.variant])
      ? cat.variants[block.variant].name
      : '—';

    const head = document.createElement('div');
    head.className = 'cv-block-head';
    head.innerHTML = `
      <span class="cv-block-handle" title="Drag to reorder" draggable="true">⋮</span>
      <span class="cv-block-label">${escapeHtml(cat ? cat.label : block.category)} <span class="cv-block-variant">— ${escapeHtml(variantLabel)}${variantCount > 1 ? ` (${block.variant + 1}/${variantCount})` : ''}</span></span>
      <span class="cv-block-spacer"></span>
      <button class="cv-mini" title="Cycle variant ←" data-act="prev">←</button>
      <button class="cv-mini" title="Cycle variant →" data-act="next">→</button>
      <button class="cv-mini" title="Doodle" data-act="doodle">✎</button>
      <button class="cv-mini cv-mini--danger" title="Delete" data-act="delete">⌫</button>
    `;

    const body = document.createElement('div');
    body.className = `cv-block-body cv-block-body--${mode}`;
    const renderer = mode === 'styled' ? renderBlockStyled : renderBlockWire;
    body.appendChild(renderer(block));
    const doodleEl = renderDoodleOverlay(block.doodle);
    if (doodleEl) body.appendChild(doodleEl);

    const note = document.createElement('div');
    note.className = 'cv-block-note';
    note.innerHTML = `<input type="text" class="cv-note-input" placeholder="add a note (one line)…" value="${escapeHtml(block.notes || '')}" />`;

    wrap.appendChild(head);
    wrap.appendChild(body);
    wrap.appendChild(note);

    // Drag-reorder via the handle
    const handle = head.querySelector('.cv-block-handle');
    handle.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/x-fjsketch-reorder', String(index));
      wrap.classList.add('is-dragging');
    });
    handle.addEventListener('dragend', () => {
      wrap.classList.remove('is-dragging');
      rootEl.querySelectorAll('.cv-drop').forEach(d => d.classList.remove('is-active'));
    });

    head.querySelector('[data-act="prev"]').addEventListener('click', (e) => { e.stopPropagation(); controller.onCycleVariant(block.id, -1); });
    head.querySelector('[data-act="next"]').addEventListener('click', (e) => { e.stopPropagation(); controller.onCycleVariant(block.id, +1); });
    head.querySelector('[data-act="doodle"]').addEventListener('click', (e) => { e.stopPropagation(); controller.onEnterDoodle(block.id); });
    head.querySelector('[data-act="delete"]').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Delete this block?')) controller.onDeleteBlock(block.id);
    });
    note.querySelector('.cv-note-input').addEventListener('change', (e) => {
      controller.onSetNotes(block.id, e.target.value);
    });
    wrap.addEventListener('focus', () => setFocus(block.id));
    wrap.addEventListener('click', () => setFocus(block.id));
    wrap.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); controller.onCycleVariant(block.id, -1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); controller.onCycleVariant(block.id, +1); }
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (confirm('Delete this block?')) controller.onDeleteBlock(block.id);
      }
    });

    return wrap;
  }

  function installDropZones() {
    const wraps = Array.from(rootEl.querySelectorAll('.cv-block-wrap'));
    wraps.forEach((w, i) => {
      const drop = document.createElement('div');
      drop.className = 'cv-drop';
      drop.dataset.dropIndex = String(i);
      w.parentNode.insertBefore(drop, w);
      attachDrop(drop, i);
    });
    const tail = document.createElement('div');
    tail.className = 'cv-drop';
    tail.dataset.dropIndex = String(wraps.length);
    rootEl.appendChild(tail);
    attachDrop(tail, wraps.length);
  }

  function attachDrop(drop, idx) {
    drop.addEventListener('dragover', (e) => {
      const types = e.dataTransfer.types;
      if (types.includes('application/x-fjsketch-reorder') || types.includes('application/x-fjsketch-variant')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = types.includes('application/x-fjsketch-variant') ? 'copy' : 'move';
        drop.classList.add('is-active');
      }
    });
    drop.addEventListener('dragleave', () => drop.classList.remove('is-active'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('is-active');
      const reorderRaw = e.dataTransfer.getData('application/x-fjsketch-reorder');
      const variantRaw = e.dataTransfer.getData('application/x-fjsketch-variant');
      if (reorderRaw !== '') {
        const from = parseInt(reorderRaw, 10);
        let to = idx;
        if (to > from) to = to - 1;
        controller.onReorder(from, to);
      } else if (variantRaw) {
        const { cat, variant } = JSON.parse(variantRaw);
        controller.onInsertFromVariant(cat, variant, idx);
      }
    });
  }

  function setFocus(id) {
    focusedId = id;
    rootEl.querySelectorAll('.cv-block-wrap').forEach(el => {
      el.classList.toggle('is-focused', el.dataset.blockId === id);
    });
    controller.onFocusBlock(id);
  }

  function getFocused() { return focusedId; }

  return { render, getFocused, setFocus };
}
