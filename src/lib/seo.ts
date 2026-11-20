import { SITE, CONTACT } from '../consts';

const abs = (path: string) => new URL(path, SITE.url).href;

export function personJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#mark`,
    name: 'Mark Joseph Cacay',
    alternateName: 'Mark Cacay',
    url: SITE.url,
    image: abs('/og/default.png'),
    jobTitle: 'AI-driven Web Developer',
    email: `mailto:${CONTACT.email}`,
    address: { '@type': 'PostalAddress', addressCountry: 'PH' },
    knowsAbout: ['WordPress', 'PHP', 'Debugging', 'AI-assisted development', 'WooCommerce', 'GoHighLevel', 'HubSpot', 'Klaviyo', 'Laravel', 'Vue.js', 'PHP', 'JavaScript', 'SEO'],
    sameAs: [CONTACT.linkedin, ...(CONTACT.github ? [CONTACT.github] : [])],
  };
}

type WorkEntry = { id: string; data: { title: string; summary: string; client: string; url?: string; stack: string[] } };

export function caseStudyJsonLd(entry: WorkEntry): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: entry.data.title,
    abstract: entry.data.summary,
    url: abs(`/work/${entry.id}/`),
    creator: { '@id': `${SITE.url}/#mark` },
    about: entry.data.client,
    keywords: entry.data.stack.join(', '),
    ...(entry.data.url ? { sameAs: entry.data.url } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}
