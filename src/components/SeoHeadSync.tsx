import React, { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(data: Record<string, unknown>) {
  let script = document.head.querySelector<HTMLScriptElement>('script#aventra-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'aventra-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export const SeoHeadSync: React.FC = memo(() => {
  const { settings } = useData();
  const { pathname } = useLocation();

  useEffect(() => {
    const title =
      settings.seoTitle?.trim() ||
      `${settings.brandName} — ${settings.tagline}`;
    const description =
      settings.seoDescription?.trim() ||
      settings.footerDescription ||
      settings.heroSubheadline;
    const ogTitle = settings.ogTitle?.trim() || title;
    const ogDescription = settings.ogDescription?.trim() || description;
    const ogImage = settings.ogImage?.trim() || settings.heroImageUrl || '';
    const ogSiteName = settings.ogSiteName?.trim() || settings.brandName || 'AVENTRA';
    const ogType = settings.ogType?.trim() || 'website';
    const twitterCard = settings.twitterCard?.trim() || 'summary_large_image';
    const baseCanonical = settings.canonicalUrl?.trim().replace(/\/+$/, '');
    const resolvedUrl = baseCanonical
      ? `${baseCanonical}${pathname === '/' ? '' : pathname}`
      : `${window.location.origin}${pathname}`;

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', settings.seoKeywords?.trim() || '');
    upsertMeta('property', 'og:title', ogTitle);
    upsertMeta('property', 'og:description', ogDescription);
    upsertMeta('property', 'og:type', ogType);
    upsertMeta('property', 'og:site_name', ogSiteName);
    upsertMeta('property', 'og:url', resolvedUrl);
    upsertMeta('property', 'og:image', ogImage);

    upsertMeta('name', 'twitter:card', twitterCard);
    upsertMeta('name', 'twitter:title', ogTitle);
    upsertMeta('name', 'twitter:description', ogDescription);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertCanonical(resolvedUrl);

    upsertJsonLd({
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: settings.brandName || 'AVENTRA',
      description,
      url: baseCanonical || window.location.origin,
      email: settings.contactEmail,
      telephone: settings.contactPhone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.officeAddress,
        addressCountry: 'LK',
      },
      ...(ogImage ? { image: ogImage } : {}),
    });
  }, [settings, pathname]);

  return null;
});

SeoHeadSync.displayName = 'SeoHeadSync';
