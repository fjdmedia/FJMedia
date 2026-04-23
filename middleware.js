export const config = {
  matcher: '/fjmedia-tools/:path*',
};

async function computeToken(secret, password) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default async function middleware(request) {
  const url = new URL(request.url);

  // Never gate the unlock page itself — would cause an infinite redirect loop.
  if (
    url.pathname === '/fjmedia-tools/unlock.html' ||
    url.pathname === '/fjmedia-tools/unlock'
  ) {
    return;
  }

  const SECRET =
    process.env.FJTOOLS_SECRET ||
    'fjmedia-default-change-me-in-vercel-env-vars';
  const PASSWORD = process.env.FJTOOLS_PASSWORD || '1711';
  const validToken = await computeToken(SECRET, PASSWORD);

  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(/fjtools_session=([a-f0-9]+)/);
  if (match && match[1] === validToken) {
    return; // authenticated — let the request through
  }

  const unlockUrl = new URL('/fjmedia-tools/unlock.html', request.url);
  unlockUrl.searchParams.set('next', url.pathname + url.search);
  return Response.redirect(unlockUrl.toString(), 302);
}
