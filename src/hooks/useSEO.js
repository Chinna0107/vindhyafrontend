import { useEffect } from 'react';

const BASE_URL = 'https://vindhyafoodsandsnacks.in';
const DEFAULT_IMAGE = `${BASE_URL}/logo.jpeg`;
const SITE_NAME = 'Vindhya Pickles & Foods';

export default function useSEO({ title, description, canonical, image, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Authentic Andhra Pickles | Buy Online India`;

    const desc = description ||
      'Buy authentic Andhra pickles online — Mango Avakaya, Gongura Pachadi, Chicken Pickle, Karam Podi & more. Handcrafted by Beemanaboina Sridevi. Free delivery across India.';

    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    const ogImage = image || DEFAULT_IMAGE;

    // Title
    document.title = fullTitle;

    // Helper to set/create meta
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('="');
        el.setAttribute(attrName, attrVal.replace('"', ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);
  }, [title, description, canonical, image, type]);
}
