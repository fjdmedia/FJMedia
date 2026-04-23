import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let password = '';
  try {
    password = (req.body && req.body.password) || '';
  } catch (e) {
    password = '';
  }

  const PASSWORD = process.env.FJTOOLS_PASSWORD || '1711';
  const SECRET =
    process.env.FJTOOLS_SECRET ||
    'fjmedia-default-change-me-in-vercel-env-vars';

  // Small delay defeats trivial rapid-fire brute forcing.
  await new Promise((r) => setTimeout(r, 350));

  if (password !== PASSWORD) {
    return res.status(401).json({ error: 'Wrong access code.' });
  }

  const token = crypto.createHmac('sha256', SECRET).update(PASSWORD).digest('hex');
  res.setHeader(
    'Set-Cookie',
    `fjtools_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
  );
  return res.status(200).json({ ok: true });
}
