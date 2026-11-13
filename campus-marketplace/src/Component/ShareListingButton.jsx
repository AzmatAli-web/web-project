import { useId, useState } from 'react';
import { listingUrl, shareListing } from '../features/shareListing';
export default function ShareListingButton({ product }) {
  const id = useId();
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const url = listingUrl(window.location.origin, product._id);
  async function share() {
    setBusy(true);
    setResult('');
    try { setResult(await shareListing({ title: product.name, url }, navigator)); }
    finally { setBusy(false); }
  }
  return <div className="share-listing">
    <button type="button" className="save-find" disabled={busy} onClick={share} aria-label={`Share ${product.name}`} aria-describedby={`${id}-status`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4M9 14l6 4"/></svg>
      {busy ? 'Opening…' : 'Share listing'}
    </button>
    <small id={`${id}-status`} role="status" aria-live="polite">{result === 'copied' ? 'Listing link copied.' : result === 'shared' ? 'Listing shared.' : result === 'cancelled' ? 'Sharing cancelled.' : result === 'manual' ? 'Copy the link below to share this listing.' : ''}</small>
    {result === 'manual' && <label className="share-link-label">Listing link<input className="form-control" readOnly value={url} onFocus={event => event.currentTarget.select()} /></label>}
  </div>;
}
