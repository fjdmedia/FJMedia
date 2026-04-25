/**
 * Inline doodle mode — overlays an SVG on top of a block's body so the user
 * can draw ON the block without losing sight of it.
 */
export function openDoodle(blockId, controller) {
  // Find the block in the canvas DOM
  const wrap = document.querySelector(`.cv-block-wrap[data-block-id="${blockId}"]`);
  if (!wrap) return;
  const body = wrap.querySelector('.cv-block-body');
  if (!body) return;

  // If a doodle session is already open on this block, no-op
  if (body.querySelector('.doodle-active-overlay')) return;

  // Hide any existing read-only overlay so we don't draw over old strokes invisibly
  const readOnly = body.querySelector('.doodle-overlay');
  const readOnlyDisplay = readOnly ? readOnly.style.display : null;
  if (readOnly) readOnly.style.display = 'none';

  const existing = controller.getDoodle(blockId) || { paths: [] };
  const paths = existing.paths.map(p => p.slice());

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('doodle-active-overlay');
  svg.setAttribute('viewBox', '0 0 800 600');
  svg.setAttribute('preserveAspectRatio', 'none');
  body.appendChild(svg);

  // Floating toolbar (anchored to block head)
  const bar = document.createElement('div');
  bar.className = 'doodle-inline-bar';
  bar.innerHTML = `
    <span class="doodle-inline-label">DOODLING — Esc to exit</span>
    <button class="doodle-btn" data-act="undo">Undo</button>
    <button class="doodle-btn" data-act="clear">Clear</button>
    <button class="doodle-btn" data-act="cancel">Cancel</button>
    <button class="doodle-btn doodle-btn--save" data-act="save">Save</button>
  `;
  body.appendChild(bar);

  body.classList.add('is-doodling');

  let drawing = null;

  function redraw() {
    const W = 800, H = 600;
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
      x: ((e.clientX - r.left) / r.width) * 800,
      y: ((e.clientY - r.top) / r.height) * 600
    };
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
  });

  bar.querySelector('[data-act="undo"]').addEventListener('click', () => { paths.pop(); redraw(); });
  bar.querySelector('[data-act="clear"]').addEventListener('click', () => { paths.length = 0; redraw(); });
  bar.querySelector('[data-act="cancel"]').addEventListener('click', () => closeWithoutSaving());
  bar.querySelector('[data-act="save"]').addEventListener('click', () => saveAndClose());

  function onKey(e) {
    if (e.key === 'Escape') saveAndClose();
    else if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); paths.pop(); redraw(); }
  }
  document.addEventListener('keydown', onKey);

  function teardown() {
    document.removeEventListener('keydown', onKey);
    svg.remove();
    bar.remove();
    body.classList.remove('is-doodling');
    if (readOnly) readOnly.style.display = readOnlyDisplay || '';
  }

  function saveAndClose() {
    teardown();
    controller.onSaveDoodle(blockId, paths.length === 0 ? null : { paths });
  }
  function closeWithoutSaving() {
    teardown();
  }

  redraw();
}

export function renderDoodleOverlay(doodle) {
  if (!doodle || !doodle.paths || doodle.paths.length === 0) return null;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('doodle-overlay');
  svg.setAttribute('viewBox', '0 0 800 600');
  svg.setAttribute('preserveAspectRatio', 'none');
  doodle.paths.forEach(p => {
    const pl = document.createElementNS(NS, 'polyline');
    pl.setAttribute('points', p.map(pt => `${pt.x},${pt.y}`).join(' '));
    pl.setAttribute('fill', 'none');
    pl.setAttribute('stroke', '#071520');
    pl.setAttribute('stroke-width', '3');
    pl.setAttribute('stroke-linecap', 'round');
    pl.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(pl);
  });
  return svg;
}
