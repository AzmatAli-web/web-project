import { useSyncExternalStore } from 'react';
import { COLLECTION_KEY, createCollectionStore } from './collectionStore';
let storage;
try { storage = window.localStorage; } catch { /* Private browser / storage denied. */ }
export const collections = createCollectionStore(storage);
window.addEventListener('storage', event => {
  if ((event.key === COLLECTION_KEY || event.key === null) && event.storageArea === storage) collections.sync(event.newValue);
});
export function useCollections() { return useSyncExternalStore(collections.subscribe, collections.getSnapshot); }
