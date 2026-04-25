import {
  createBoard, createBlock, insertBlock, removeBlock,
  reorderBlock, setVariant, setNotes, setDoodle
} from './models.js';
import { loadState, saveState, makeDebouncedSaver } from './storage.js';
import { CATEGORIES } from './blocks.js';
import { mountToolbar } from './ui-toolbar.js';
import { mountSidebar } from './ui-sidebar.js';
import { mountCanvas } from './ui-canvas.js';
import { openDoodle } from './ui-doodle.js';
import { copySpecToClipboard } from './export-json.js';
import { exportCanvasAsPng } from './export-png.js';

let state = loadState();
const saveDebounced = makeDebouncedSaver(300);

if (state.boards.length === 0) {
  const b = createBoard('My first sketch');
  state.boards.push(b);
  state.activeBoardId = b.id;
  saveState(state);
}
if (!state.activeBoardId || !state.boards.find(b => b.id === state.activeBoardId)) {
  state.activeBoardId = state.boards[0].id;
}

function activeBoard() {
  return state.boards.find(b => b.id === state.activeBoardId) || null;
}

function persist() { saveDebounced(state); }

const toolbarRoot = document.getElementById('topbar');
const sidebarRoot = document.getElementById('sidebar');
const canvasRoot  = document.getElementById('canvas');

const canvas = mountCanvas(canvasRoot, {
  getActiveBoard: () => activeBoard(),
  getMode: () => activeBoard()?.mode || 'wire',
  onCycleVariant: (blockId, dir) => {
    const board = activeBoard();
    const blk = board.stack.find(b => b.id === blockId);
    if (!blk) return;
    const cat = CATEGORIES[blk.category];
    if (!cat || cat.variants.length === 0) return;
    const next = (blk.variant + dir + cat.variants.length) % cat.variants.length;
    setVariant(board, blockId, next);
    persist(); canvas.render();
    canvas.setFocus(blockId);
  },
  onDeleteBlock: (blockId) => {
    removeBlock(activeBoard(), blockId);
    persist(); canvas.render();
  },
  onSetNotes: (blockId, notes) => {
    setNotes(activeBoard(), blockId, notes);
    persist();
  },
  onFocusBlock: (_id) => { /* noop */ },
  onReorder: (from, to) => {
    reorderBlock(activeBoard(), from, to);
    persist(); canvas.render();
  },
  onInsertFromVariant: (cat, variant, index) => {
    const blk = createBlock(cat); blk.variant = variant;
    insertBlock(activeBoard(), blk, index);
    persist(); canvas.render();
  },
  onEnterDoodle: (blockId) => openDoodleFor(blockId),
  onSaveFreeCanvas: (data) => {
    const board = activeBoard();
    if (!board) return;
    board.freeCanvas = data;
    board.updatedAt = new Date().toISOString();
    persist();
  }
});

function openDoodleFor(blockId) {
  openDoodle(blockId, {
    getDoodle: (id) => {
      const blk = activeBoard().stack.find(b => b.id === id);
      return blk ? blk.doodle : null;
    },
    onSaveDoodle: (id, doodle) => {
      setDoodle(activeBoard(), id, doodle);
      persist(); canvas.render();
    }
  });
}

const sidebar = mountSidebar(sidebarRoot, {
  onAddBlock: (cat, variant) => {
    const blk = createBlock(cat); blk.variant = variant;
    insertBlock(activeBoard(), blk, null);
    persist(); canvas.render();
  }
});

const toolbar = mountToolbar(toolbarRoot, {
  getState: () => ({
    boards: state.boards,
    activeBoardId: state.activeBoardId,
    mode: activeBoard()?.mode || 'wire'
  }),
  onSelectBoard: (id) => {
    state.activeBoardId = id;
    saveState(state);
    toolbar.render(); canvas.render();
  },
  onNewBoard: (name) => {
    const b = createBoard(name);
    state.boards.push(b);
    state.activeBoardId = b.id;
    saveState(state);
    toolbar.render(); canvas.render();
  },
  onRenameBoard: (name) => {
    const b = activeBoard();
    if (!b) return;
    b.name = name;
    b.updatedAt = new Date().toISOString();
    saveState(state);
    toolbar.render();
  },
  onDeleteBoard: () => {
    if (state.boards.length <= 1) {
      alert('Can’t delete the last board. Create a new one first.');
      return;
    }
    state.boards = state.boards.filter(b => b.id !== state.activeBoardId);
    state.activeBoardId = state.boards[0].id;
    saveState(state);
    toolbar.render(); canvas.render();
  },
  onSetMode: (mode) => {
    const board = activeBoard();
    if (!board) return;
    board.mode = mode;
    persist();
    toolbar.render(); canvas.render();
  },
  onExportPng: async () => {
    const board = activeBoard();
    if (!board) return;
    const fileName = `fjsketch-${board.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0,10)}`;
    flashStatus('Capturing PNG…');
    try {
      await exportCanvasAsPng(canvasRoot, fileName);
      flashStatus('PNG downloaded');
    } catch (err) {
      console.error(err);
      flashStatus('PNG failed — see console');
    }
  },
  onExportJson: async () => {
    const board = activeBoard();
    const result = await copySpecToClipboard(board);
    flashStatus(result.msg);
  }
});

toolbar.render();
sidebar.render();
canvas.render();

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (document.querySelector('.doodle-active-overlay')) return;
  if (document.querySelector('.spec-modal')) return;

  if (e.key === 'n' || e.key === 'N') {
    const firstSidebarBtn = sidebarRoot.querySelector('.sb-variant');
    if (firstSidebarBtn) firstSidebarBtn.focus();
  } else if (e.key === 'd' || e.key === 'D') {
    const id = canvas.getFocused();
    if (id) openDoodleFor(id);
  } else if (e.key === 'e' || e.key === 'E') {
    document.querySelector('#tb-png')?.click();
  } else if (e.key === 'j' || e.key === 'J') {
    document.querySelector('#tb-json')?.click();
  } else if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
    saveState(state);
    flashStatus('Saved');
  }
});

function flashStatus(msg) {
  let toast = document.getElementById('sk-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sk-toast';
    toast.className = 'sk-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('is-on');
  clearTimeout(window.__skToastT);
  window.__skToastT = setTimeout(() => toast.classList.remove('is-on'), 1600);
}

console.log('[sketch] app loaded');
