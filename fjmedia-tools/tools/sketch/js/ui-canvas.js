import { renderBlockWire } from './render-wire.js';
import { renderBlockStyled } from './render-styled.js';
import { renderDoodleOverlay } from './ui-doodle.js';
import { CATEGORIES } from './blocks.js';
import { createPolaroid, rollPolaroidTilt } from './models.js';

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export function mountCanvas(rootEl, controller) {
  let focusedId = null;

  function render() {
    if (rootEl.__freeTeardown) { rootEl.__freeTeardown(); rootEl.__freeTeardown = null; }
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
        <button class="doodle-btn" id="cv-free-add-polaroid">+ Polaroid</button>
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

    const polaroidLayer = document.createElement('div');
    polaroidLayer.className = 'sk-polaroid-layer';
    surface.appendChild(polaroidLayer);

    wrap.appendChild(surface);
    rootEl.appendChild(wrap);

    const W = 1200, H = 1600;
    const fc = board.freeCanvas || {};
    const paths = Array.isArray(fc.paths) ? fc.paths.map(p => p.slice()) : [];
    const polaroids = Array.isArray(fc.polaroids) ? fc.polaroids.map(p => ({ ...p })) : [];
    let drawing = null;
    let selectedId = null;
    let openMenuEl = null;

    function commit() {
      const empty = paths.length === 0 && polaroids.length === 0;
      controller.onSaveFreeCanvas(empty ? null : { paths, polaroids });
    }

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

    function escapeHtmlLocal(s) {
      return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function renderPolaroids() {
      polaroidLayer.innerHTML = '';
      const sorted = polaroids.slice().sort((a, b) => (a.z || 0) - (b.z || 0));
      sorted.forEach(p => polaroidLayer.appendChild(buildPolaroidEl(p)));
    }

    function buildPolaroidEl(p) {
      const el = document.createElement('div');
      el.className = 'sk-polaroid' + (p.id === selectedId ? ' is-selected' : '');
      el.dataset.id = p.id;
      el.style.left = (p.x * 100) + '%';
      el.style.top = (p.y * 100) + '%';
      el.style.transform = `rotate(${p.rotation}deg)`;
      el.style.zIndex = String(p.z || 0);

      const photo = document.createElement('div');
      photo.className = 'sk-polaroid__photo';
      if (p.imageDataUrl) {
        const img = document.createElement('img');
        img.src = p.imageDataUrl;
        img.alt = '';
        img.draggable = false;
        photo.appendChild(img);
      } else {
        const hint = document.createElement('span');
        hint.className = 'sk-polaroid__hint';
        hint.textContent = '+ photo';
        photo.appendChild(hint);
      }

      const cap = document.createElement('div');
      cap.className = 'sk-polaroid__caption';
      const capInput = document.createElement('input');
      capInput.type = 'text';
      capInput.placeholder = 'caption…';
      capInput.value = p.caption || '';
      cap.appendChild(capInput);

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.className = 'sk-polaroid__file';
      fileInput.hidden = true;

      el.appendChild(photo);
      el.appendChild(cap);
      el.appendChild(fileInput);

      // Caption edit
      capInput.addEventListener('input', () => { p.caption = capInput.value; });
      capInput.addEventListener('change', () => commit());
      capInput.addEventListener('pointerdown', (e) => e.stopPropagation());

      // Image upload via dblclick on photo
      photo.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
      fileInput.addEventListener('change', () => {
        const f = fileInput.files && fileInput.files[0];
        if (!f) return;
        if (f.size > 1.5 * 1024 * 1024) {
          alert('Image is too big. Pick something under 1.5 MB.');
          fileInput.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          p.imageDataUrl = reader.result;
          renderPolaroids();
          commit();
        };
        reader.readAsDataURL(f);
      });

      // Drag + select
      let dragState = null;
      el.addEventListener('pointerdown', (e) => {
        if (e.target === capInput) return;
        if (e.button !== 0) return;
        e.stopPropagation();
        selectPolaroid(p.id);
        bringToTop(p);
        const surfaceRect = surface.getBoundingClientRect();
        const startX = e.clientX, startY = e.clientY;
        const startPx = p.x, startPy = p.y;
        dragState = { surfaceRect, startX, startY, startPx, startPy, moved: false };
        el.setPointerCapture(e.pointerId);
      });
      el.addEventListener('pointermove', (e) => {
        if (!dragState) return;
        const dx = (e.clientX - dragState.startX) / dragState.surfaceRect.width;
        const dy = (e.clientY - dragState.startY) / dragState.surfaceRect.height;
        if (Math.abs(e.clientX - dragState.startX) > 3 || Math.abs(e.clientY - dragState.startY) > 3) {
          dragState.moved = true;
        }
        p.x = clamp01(dragState.startPx + dx);
        p.y = clamp01(dragState.startPy + dy);
        el.style.left = (p.x * 100) + '%';
        el.style.top = (p.y * 100) + '%';
      });
      el.addEventListener('pointerup', (e) => {
        if (!dragState) return;
        const moved = dragState.moved;
        dragState = null;
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        if (moved) commit();
      });

      // Right-click context menu
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectPolaroid(p.id);
        openContextMenu(p, e.clientX, e.clientY);
      });

      return el;
    }

    function clamp01(v) { return Math.max(0, Math.min(1, v)); }

    function bringToTop(p) {
      const maxZ = polaroids.reduce((m, pl) => Math.max(m, pl.z || 0), 0);
      if ((p.z || 0) < maxZ) {
        p.z = maxZ + 1;
        const el = polaroidLayer.querySelector(`.sk-polaroid[data-id="${p.id}"]`);
        if (el) el.style.zIndex = String(p.z);
      }
    }

    function sendToBack(p) {
      const minZ = polaroids.reduce((m, pl) => Math.min(m, pl.z || 0), 0);
      p.z = minZ - 1;
      renderPolaroids();
    }

    function selectPolaroid(id) {
      selectedId = id;
      polaroidLayer.querySelectorAll('.sk-polaroid').forEach(el => {
        el.classList.toggle('is-selected', el.dataset.id === id);
      });
    }

    function deselect() {
      selectedId = null;
      polaroidLayer.querySelectorAll('.sk-polaroid').forEach(el => el.classList.remove('is-selected'));
    }

    function addPolaroidAt(xFrac, yFrac) {
      const maxZ = polaroids.reduce((m, pl) => Math.max(m, pl.z || 0), 0);
      const p = createPolaroid({ x: xFrac, y: yFrac });
      p.z = maxZ + 1;
      polaroids.push(p);
      selectedId = p.id;
      renderPolaroids();
      commit();
    }

    function duplicateById(id) {
      const src = polaroids.find(pl => pl.id === id);
      if (!src) return;
      const maxZ = polaroids.reduce((m, pl) => Math.max(m, pl.z || 0), 0);
      const copy = {
        ...src,
        id: 'pol_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7),
        x: clamp01(src.x + 0.025),
        y: clamp01(src.y + 0.025),
        rotation: rollPolaroidTilt(),
        z: maxZ + 1
      };
      polaroids.push(copy);
      selectedId = copy.id;
      renderPolaroids();
      commit();
    }

    function deleteById(id) {
      const i = polaroids.findIndex(pl => pl.id === id);
      if (i === -1) return;
      polaroids.splice(i, 1);
      if (selectedId === id) selectedId = null;
      renderPolaroids();
      commit();
    }

    function rerollTilt(p) {
      p.rotation = rollPolaroidTilt();
      renderPolaroids();
      commit();
    }

    function closeContextMenu() {
      if (openMenuEl) { openMenuEl.remove(); openMenuEl = null; }
    }

    function openContextMenu(p, clientX, clientY) {
      closeContextMenu();
      const menu = document.createElement('div');
      menu.className = 'sk-ctx-menu';
      menu.innerHTML = `
        <button data-act="duplicate">Duplicate</button>
        <button data-act="reroll">Re-roll tilt</button>
        <button data-act="front">Bring to front</button>
        <button data-act="back">Send to back</button>
        <button data-act="delete" class="sk-ctx-menu__danger">Delete</button>
      `;
      document.body.appendChild(menu);
      // Position, clamping to viewport
      const mw = 180, mh = 200;
      const left = Math.min(clientX, window.innerWidth - mw - 8);
      const top = Math.min(clientY, window.innerHeight - mh - 8);
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      openMenuEl = menu;

      menu.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        const act = b.dataset.act;
        closeContextMenu();
        if (act === 'duplicate') duplicateById(p.id);
        else if (act === 'reroll') rerollTilt(p);
        else if (act === 'front') { bringToTop(p); commit(); }
        else if (act === 'back') { sendToBack(p); commit(); }
        else if (act === 'delete') deleteById(p.id);
      });
    }

    // Drawing on the SVG (only fires when not interacting with a polaroid)
    svg.addEventListener('pointerdown', (e) => {
      closeContextMenu();
      deselect();
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

    // Toolbar
    wrap.querySelector('#cv-free-add-polaroid').addEventListener('click', () => {
      addPolaroidAt(0.4 + Math.random() * 0.1, 0.25 + Math.random() * 0.1);
    });
    wrap.querySelector('#cv-free-undo').addEventListener('click', () => { paths.pop(); redraw(); commit(); });
    wrap.querySelector('#cv-free-clear').addEventListener('click', () => {
      if (!confirm('Clear the whole free canvas?')) return;
      paths.length = 0;
      polaroids.length = 0;
      selectedId = null;
      renderPolaroids();
      redraw();
      commit();
    });

    // Click outside polaroid area closes menu + deselects
    document.addEventListener('pointerdown', onDocPointerDown);
    function onDocPointerDown(e) {
      if (openMenuEl && !openMenuEl.contains(e.target)) closeContextMenu();
      if (!e.target.closest('.sk-polaroid')) deselect();
    }

    // Keyboard: Cmd/Ctrl+D duplicate, Delete/Backspace remove
    function onDocKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!selectedId) return;
      if ((e.metaKey || e.ctrlKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateById(selectedId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteById(selectedId);
      } else if (e.key === 'Escape') {
        closeContextMenu();
        deselect();
      }
    }
    document.addEventListener('keydown', onDocKey);

    rootEl.__freeTeardown = () => {
      document.removeEventListener('keydown', onDocKey);
      document.removeEventListener('pointerdown', onDocPointerDown);
      closeContextMenu();
    };

    redraw();
    renderPolaroids();
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
