import { useState, useEffect, useRef } from 'react';
import API from '../config';

// In-memory cache shared across hook instances
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const isFresh = (key) => {
  const entry = cache.get(key);
  return entry && Date.now() - entry.ts < CACHE_TTL;
};

const getCache = (key) => cache.get(key)?.data ?? null;
const setCache = (key, data) => cache.set(key, { data, ts: Date.now() });

// Generic fetch hook with cache
function useFetch(url, cacheKey) {
  const [data, setData] = useState(() => isFresh(cacheKey) ? getCache(cacheKey) : null);
  const [loading, setLoading] = useState(!isFresh(cacheKey));
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!url) return;
    if (isFresh(cacheKey)) {
      setData(getCache(cacheKey));
      setLoading(false);
      return;
    }

    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: abortRef.current.signal })
      .then(async (r) => {
        // Treat non-2xx as errors so callers don't receive unexpected payloads
        const text = await r.text();
        let parsed = null;
        try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = text; }
        if (!r.ok) throw new Error(parsed?.message || `Request failed with status ${r.status}`);
        return parsed;
      })
      .then(result => {
        setCache(cacheKey, result);
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || String(err));
          setLoading(false);
        }
      });

    return () => abortRef.current?.abort();
  }, [url, cacheKey]);

  return { data, loading, error };
}

// Hook: fetch all products (optionally by category)
export function useProducts(category = null) {
  const query = category ? `?category=${category}` : '';
  const cacheKey = `products:${category || 'all'}`;
  const { data, loading, error } = useFetch(`${API}/products${query}`, cacheKey);
  return { products: data ?? [], loading, error };
}

// Hook: fetch single product by slug
export function useProduct(slug) {
  if (!slug) return { product: null, loading: false, error: null };
  // Try variants in order: normalized lowercase, original as-provided, capitalized-first-letter
  const normalized = encodeURIComponent(String(slug).toLowerCase());
  const original = encodeURIComponent(String(slug));
  const capitalized = encodeURIComponent(String(slug).charAt(0).toUpperCase() + String(slug).slice(1));
  const cacheKeyBase = `product:${normalized}`;

  const [attempt, setAttempt] = useState(0);
  const urls = [
    `${API}/products/${normalized}`,
    `${API}/products/${original}`,
    `${API}/products/${capitalized}`,
  ];

  const url = urls[attempt] || urls[0];
  const { data, loading, error } = useFetch(url, cacheKeyBase + `:attempt${attempt}`);

  // On 404, advance to next attempt until we've tried all variants
  useEffect(() => {
    if (error && /404|Not Found/i.test(String(error)) && attempt < urls.length - 1) {
      setAttempt(a => a + 1);
    }
  }, [attempt, error]);

  // Only expose the error once we've exhausted all attempts
  const exposedError = attempt >= urls.length - 1 ? error : null;
  return { product: data, loading, error: exposedError, attempt, attempts: urls.length };
}

// Invalidate cache (call after admin edits)
export function invalidateProductCache() {
  for (const key of cache.keys()) {
    if (key.startsWith('product')) cache.delete(key);
  }
}
