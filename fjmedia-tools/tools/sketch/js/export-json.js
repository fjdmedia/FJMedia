import { serializeBoardToSpec } from './models.js';
import { getJsonSummary } from './blocks.js';

export async function copySpecToClipboard(board) {
  if (!board) return { ok: false, msg: 'No board' };
  const text = serializeBoardToSpec(board, getJsonSummary);
  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, msg: 'Spec copied!' };
  } catch (err) {
    showFallbackModal(text);
    return { ok: true, msg: 'Spec shown — copy manually' };
  }
}

function showFallbackModal(text) {
  const modal = document.createElement('div');
  modal.className = 'spec-modal';
  modal.innerHTML = `
    <div class="spec-modal__bar">
      <span class="spec-modal__label">Spec — Cmd/Ctrl+A then Cmd/Ctrl+C</span>
      <button class="doodle-btn doodle-btn--save" id="spec-close">Close</button>
    </div>
    <textarea style="flex:1;font-family:monospace;padding:24px;background:#071520;color:#EDEAE5;border:none;resize:none;"></textarea>
  `;
  modal.querySelector('textarea').value = text;
  modal.querySelector('#spec-close').onclick = () => modal.remove();
  document.body.appendChild(modal);
  modal.querySelector('textarea').focus();
  modal.querySelector('textarea').select();
}
