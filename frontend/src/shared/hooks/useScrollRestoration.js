import { useEffect, useLayoutEffect } from 'react';

// Simple scroll restoration using sessionStorage.
// Usage: useScrollRestoration('key');
// Optionally pass getContainer to target a custom scrollable element.
export default function useScrollRestoration(key, { getContainer } = {}) {
 const storageKey = `scroll:${key}`;

 // Restore as early as possible to avoid jumpy paint
 useLayoutEffect(() => {
 const container = (typeof getContainer === 'function' ? getContainer() : null) || window;
 const stored = sessionStorage.getItem(storageKey);
 if (stored != null) {
 const y = parseInt(stored, 10) || 0;
 if (container === window) {
 window.scrollTo(0, y);
 } else if (container && container.scrollTo) {
 container.scrollTop = y;
 }
 }
 }, [storageKey, getContainer]);

 // Save on unmount and before unload
 useEffect(() => {
 const container = (typeof getContainer === 'function' ? getContainer() : null) || window;
 const save = () => {
 const y = container === window ? window.scrollY : container?.scrollTop || 0;
 sessionStorage.setItem(storageKey, String(y));
 };

 window.addEventListener('beforeunload', save);
 return () => {
 save();
 window.removeEventListener('beforeunload', save);
 };
 }, [storageKey, getContainer]);
}

