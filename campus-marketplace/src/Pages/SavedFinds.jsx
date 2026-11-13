import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collections, useCollections } from '../features/useCollections';
import SaveFindButton from '../Component/SaveFindButton';
import { FALLBACK_IMAGE } from '../api/config';
export default function SavedFinds() {
  const { favorites, recent, warning } = useCollections();
  const [tab, setTab] = useState('favorites');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const items = (tab === 'favorites' ? favorites : recent).filter(p => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  if (sort !== 'newest') items.sort((a,b) => sort === 'low' ? a.price - b.price : b.price - a.price);
  return <main className="site-width browse-page saved-page"><div className="page-intro"><span className="eyebrow">YOUR CAMPUS SHORTLIST</span><h1>Good finds. Kept close.</h1><p>Save your favorites and pick up where you left off.</p><small>Stored on this browser, not your account. Saved prices may change; open a listing to check current availability.</small></div>
    <div className="collection-toolbar"><div className="filter-tabs" aria-label="Your collections"><button aria-pressed={tab === 'favorites'} className={tab === 'favorites' ? 'active' : ''} onClick={() => setTab('favorites')}>Saved finds ({favorites.length})</button><button aria-pressed={tab === 'recent'} className={tab === 'recent' ? 'active' : ''} onClick={() => setTab('recent')}>Recently viewed ({recent.length})</button></div><Link className="text-link" to="/browse">Explore more ↗</Link></div>
    <div className="collection-toolbar"><label>Search your collection<input className="form-control" value={query} onChange={e => setQuery(e.target.value)} placeholder="Name or category" /></label><label>Sort saved prices<select className="form-select" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Most recent</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>{tab === 'recent' && recent.length > 0 && <button className="button button-outline" onClick={() => { if(window.confirm('Clear recently viewed history in this browser? Your saved finds will remain.')) collections.clearRecent(); }}>Clear history</button>}</div>
    {warning && <p role="status" className="alert alert-warning">{warning}</p>}
    <p role="status" className="collection-count">{items.length} {items.length === 1 ? 'find' : 'finds'}</p>
    {items.length ? <div className="listing-grid">{items.map(p => <article className="listing-card" key={p._id}><Link to={`/product/${encodeURIComponent(p._id)}`} className="listing-image"><img src={p.imageUrl || FALLBACK_IMAGE} alt={p.name} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}/><span className="listing-category">{p.category || 'Campus find'}</span></Link><div className="listing-body"><h3><Link to={`/product/${encodeURIComponent(p._id)}`}>{p.name}</Link></h3><p className="listing-price">Rs. {p.price.toLocaleString('en-PK')}</p><div className="saved-actions"><SaveFindButton product={p}/><Link className="text-link" to={`/product/${encodeURIComponent(p._id)}`}>View listing ↗</Link></div></div></article>)}</div> : <div className="collection-message"><h2>{query ? 'No matching finds.' : tab === 'favorites' ? 'Your next great find belongs here.' : 'Start exploring.'}</h2><p>{query ? 'Try a different name or category.' : tab === 'favorites' ? 'Tap Save on any product to keep it in your shortlist.' : 'The last 12 products you open will appear here.'}</p><Link className="button button-dark" to="/browse">Explore the marketplace</Link></div>}
  </main>;
}
