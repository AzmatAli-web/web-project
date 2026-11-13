// Build a clean public listing URL, excluding query strings and account state.
export function listingUrl(origin, id) {
  const base = new URL(origin);
  if (!['http:', 'https:'].includes(base.protocol) || typeof id !== 'string' || !id.trim()) throw new Error('Invalid listing link');
  return `${base.origin}/product/${encodeURIComponent(id)}`;
}
export async function shareListing({ title, url }, browser) {
  if (typeof browser.share === 'function') {
    try {
      await browser.share({ title, url });
      return 'shared';
    } catch (error) {
      // Cancellation must not unexpectedly copy anything to the clipboard.
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }
  if (typeof browser.clipboard?.writeText === 'function') {
    try { await browser.clipboard.writeText(url); return 'copied'; }
    catch { /* A visible selectable link remains available below. */ }
  }
  return 'manual';
}
