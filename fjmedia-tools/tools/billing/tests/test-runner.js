const results = [];
let currentGroup = null;

export function describe(name, fn) {
  const group = { name, tests: [] };
  results.push(group);
  currentGroup = group;
  fn();
  currentGroup = null;
}

export function it(name, fn) {
  try {
    fn();
    currentGroup.tests.push({ name, pass: true });
  } catch (err) {
    currentGroup.tests.push({ name, pass: false, error: err.message });
  }
}

export function assertEqual(actual, expected, msg = '') {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${msg} — expected ${e}, got ${a}`);
}

export function assertTrue(value, msg = '') {
  if (!value) throw new Error(`${msg} — expected truthy, got ${value}`);
}

export function renderResults(rootEl) {
  let html = '';
  let pass = 0, fail = 0;
  results.forEach(g => {
    html += `<h2 class="text-lg font-bold mt-4">${g.name}</h2><ul>`;
    g.tests.forEach(t => {
      if (t.pass) { pass++; html += `<li class="text-green-700">✓ ${t.name}</li>`; }
      else { fail++; html += `<li class="text-red-700">✗ ${t.name} — ${t.error}</li>`; }
    });
    html += '</ul>';
  });
  rootEl.innerHTML = `<div class="mb-4 font-bold">${pass} passed, ${fail} failed</div>` + html;
}
