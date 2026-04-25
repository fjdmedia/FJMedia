function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export function mountToolbar(rootEl, controller) {
  function render() {
    const state = controller.getState();
    const opts = state.boards.map(b =>
      `<option value="${b.id}" ${b.id === state.activeBoardId ? 'selected' : ''}>${escapeHtml(b.name)}</option>`
    ).join('');

    rootEl.innerHTML = `
      <div class="tb-group tb-group--left">
        <label class="tb-lbl">Board</label>
        <select class="tb-select" id="tb-board">${opts || '<option>(none)</option>'}</select>
        <button class="tb-btn tb-btn--ghost" id="tb-new">+ New</button>
        <button class="tb-btn tb-btn--ghost" id="tb-rename" title="Rename board">✎</button>
        <button class="tb-btn tb-btn--ghost" id="tb-delete" title="Delete board">⌫</button>
      </div>
      <div class="tb-group tb-group--center">
        <div class="tb-toggle" role="tablist">
          <button class="tb-toggle__opt ${state.mode==='wire'?'is-on':''}" id="tb-mode-wire">Wire</button>
          <button class="tb-toggle__opt ${state.mode==='styled'?'is-on':''}" id="tb-mode-styled">Styled</button>
          <button class="tb-toggle__opt ${state.mode==='free'?'is-on':''}" id="tb-mode-free">Free</button>
        </div>
      </div>
      <div class="tb-group tb-group--right">
        <button class="tb-btn" id="tb-png">Export PNG</button>
        <button class="tb-btn tb-btn--gold" id="tb-json">Copy Spec</button>
      </div>
    `;

    rootEl.querySelector('#tb-board').addEventListener('change', (e) => controller.onSelectBoard(e.target.value));
    rootEl.querySelector('#tb-new').addEventListener('click', () => {
      const name = prompt('New board name:', 'Untitled');
      if (name && name.trim()) controller.onNewBoard(name.trim());
    });
    rootEl.querySelector('#tb-rename').addEventListener('click', () => {
      const current = controller.getState();
      const board = current.boards.find(b => b.id === current.activeBoardId);
      if (!board) return;
      const name = prompt('Rename board:', board.name);
      if (name && name.trim()) controller.onRenameBoard(name.trim());
    });
    rootEl.querySelector('#tb-delete').addEventListener('click', () => {
      if (confirm('Delete this board? (cannot undo)')) controller.onDeleteBoard();
    });
    rootEl.querySelector('#tb-mode-wire').addEventListener('click', () => controller.onSetMode('wire'));
    rootEl.querySelector('#tb-mode-styled').addEventListener('click', () => controller.onSetMode('styled'));
    rootEl.querySelector('#tb-mode-free').addEventListener('click', () => controller.onSetMode('free'));
    rootEl.querySelector('#tb-png').addEventListener('click', () => controller.onExportPng());
    rootEl.querySelector('#tb-json').addEventListener('click', () => controller.onExportJson());
  }

  return { render };
}
