import { collections, useCollections } from '../features/useCollections';
export default function SaveFindButton({ product }) {
  const { favorites, warning } = useCollections();
  const saved = favorites.some(p => p._id === product._id);
  return <div className="save-find-wrap"><button type="button" className={`save-find ${saved ? 'is-saved' : ''}`} aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`} onClick={() => collections.toggle(product)}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>{saved ? 'Saved' : 'Save'}</button>{warning && <small className="collection-warning" role="status">{warning}</small>}</div>;
}
