// Browser-local product snapshots: no contact details or account credentials.
export const COLLECTION_KEY = 'campus.collections.v1';
export function snapshot(product) {
  if (!product || typeof product._id !== 'string' || !product._id || typeof product.name !== 'string') return null;
  return { _id: product._id, name: product.name.slice(0, 200), price: Number.isFinite(Number(product.price)) ? Number(product.price) : 0,
    imageUrl: typeof product.imageUrl === 'string' && /^(https?:\/\/|\/[^/])/.test(product.imageUrl) ? product.imageUrl : '',
    category: typeof product.category === 'string' ? product.category.slice(0, 80) : '' };
}
export function decode(raw) {
  try {
    const data = JSON.parse(raw);
    const clean = (items, limit) => Array.isArray(items) ? [...new Map(items.map(snapshot).filter(Boolean).map(p => [p._id, p])).values()].slice(0, limit) : [];
    return { favorites: clean(data?.favorites, 100), recent: clean(data?.recent, 12), warning: '' };
  } catch { return { favorites: [], recent: [], warning: '' }; }
}
export function createCollectionStore(storage) {
  let state;
  try { state = decode(storage?.getItem(COLLECTION_KEY)); } catch { state = decode(null); }
  const listeners = new Set();
  const publish = () => listeners.forEach(fn => fn());
  function save(next) {
    state = { ...next, warning: '' };
    try { if (!storage) throw Error(); storage.setItem(COLLECTION_KEY, JSON.stringify({ favorites: state.favorites, recent: state.recent })); }
    catch { state = { ...state, warning: 'Browser storage is unavailable or full. Changes will last only while this page stays open.' }; }
    publish();
  }
  return {
    getSnapshot: () => state,
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
    sync: raw => { state = decode(raw); publish(); },
    toggle: product => { const p = snapshot(product); if (!p) return;
      const exists = state.favorites.some(x => x._id === p._id);
      if (!exists && state.favorites.length >= 100) { state = { ...state, warning: 'You have 100 saved finds. Remove one before saving another.' }; publish(); return; }
      save({ ...state, favorites: exists ? state.favorites.filter(x => x._id !== p._id) : [p, ...state.favorites] });
    },
    visit: product => { const p = snapshot(product); if (!p) return;
      save({ ...state, recent: [p, ...state.recent.filter(x => x._id !== p._id)].slice(0, 12), favorites: state.favorites.map(x => x._id === p._id ? p : x) });
    },
    clearRecent: () => save({ ...state, recent: [] }),
  };
}
