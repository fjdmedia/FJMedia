// ── FJMedia Tools Platform — Shared Nav Logic ──

document.addEventListener('DOMContentLoaded', () => {
  updateApiKeyButtonState();
});

function updateApiKeyButtonState() {
  const btn = document.getElementById('apiKeyBtn');
  if (!btn) return;
  const key = localStorage.getItem('fjmedia_api_key');
  if (key) {
    btn.textContent = '🔑 Key Set';
    btn.classList.add('key-set');
  } else {
    btn.textContent = 'Set API Key';
    btn.classList.remove('key-set');
  }
}

function openApiModal() {
  const modal = document.getElementById('apiModal');
  if (!modal) return;
  const existing = localStorage.getItem('fjmedia_api_key') || '';
  document.getElementById('apiKeyInput').value = existing;
  modal.classList.add('open');
  setTimeout(() => document.getElementById('apiKeyInput').focus(), 100);
}

function closeApiModal() {
  const modal = document.getElementById('apiModal');
  if (modal) modal.classList.remove('open');
}

function saveApiKey() {
  const input = document.getElementById('apiKeyInput');
  const key = input.value.trim();
  if (key) {
    localStorage.setItem('fjmedia_api_key', key);
  } else {
    localStorage.removeItem('fjmedia_api_key');
  }
  updateApiKeyButtonState();
  closeApiModal();
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  const backdrop = document.getElementById('apiModal');
  if (backdrop && e.target === backdrop) closeApiModal();
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeApiModal();
});
