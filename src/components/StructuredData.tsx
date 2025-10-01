import Script from 'next/script';

interface OrganizationData {
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint?: {
    contactType: string;
    email: string;
  };
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

interface PersonData {
  name: string;
  jobTitle: string;
  affiliation: string;
  email: string;
  url: string;
  sameAs?: string[];
}

interface ResearchProjectData {
  name: string;
  description: string;
  keywords: string[];
  url: string;
}

export function OrganizationStructuredData({ data }: { data: OrganizationData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: data.name,
    description: data.description,
    url: data.url,
    logo: data.logo,
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: data.contactPoint.contactType,
        email: data.contactPoint.email,
      },
    }),
    ...(data.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.streetAddress,
        addressLocality: data.address.addressLocality,
        addressRegion: data.address.addressRegion,
        postalCode: data.address.postalCode,
        addressCountry: data.address.addressCountry,
      },
    }),
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function PersonStructuredData({ data }: { data: PersonData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    affiliation: {
      '@type': 'Organization',
      name: data.affiliation,
    },
    email: data.email,
    url: data.url,
    ...(data.sameAs && { sameAs: data.sameAs }),
  };

  return (
    <Script
      id="person-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ResearchProjectStructuredData({ data }: { data: ResearchProjectData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    name: data.name,
    description: data.description,
    keywords: data.keywords.join(', '),
    url: data.url,
  };

  return (
    <Script
      id="research-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'System 2 ML Lab at Korea University',
    alternateName: 'KU System 2 ML Lab',
    url: 'https://mllab.korea.ac.kr',
    description: 'Research lab focusing on System 2 deep learning, large language model reasoning, meta-learning, and Bayesian inference at Korea University.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mllab.korea.ac.kr/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ScholarlyArticleStructuredData({
  title,
  authors,
  datePublished,
  venue,
  url,
  abstract
}: {
  title: string;
  authors: string[];
  datePublished: string;
  venue: string;
  url: string;
  abstract?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: title,
    author: authors.map(author => ({
      '@type': 'Person',
      name: author,
    })),
    datePublished,
    publisher: {
      '@type': 'Organization',
      name: venue,
    },
    url,
    ...(abstract && { abstract }),
  };

  return (
    <Script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
