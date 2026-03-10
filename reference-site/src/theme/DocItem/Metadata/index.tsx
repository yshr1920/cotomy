import Head from '@docusaurus/Head';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {PageMetadata} from '@docusaurus/theme-common';
import React, {type ReactNode} from 'react';

function toCanonicalUrl(pathname: string): string {
  const normalizedPath = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  return `https://cotomy.net${normalizedPath}`;
}

export default function DocItemMetadata(): ReactNode {
  const {metadata, frontMatter, assets} = useDoc();
  const description = metadata.description ?? frontMatter.description ?? '';
  const permalink = metadata.permalink;
  const canonicalUrl = toCanonicalUrl(permalink);
  const isOverview = permalink === '/' || metadata.unversionedId === 'reference/overview';

  const structuredData = isOverview
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Cotomy',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: 'https://cotomy.net/',
        description,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: metadata.title,
        description,
        url: canonicalUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Cotomy',
          url: 'https://cotomy.net/',
        },
      };

  return (
    <>
      <PageMetadata
        title={metadata.title}
        description={description}
        keywords={frontMatter.keywords}
        image={assets.image ?? frontMatter.image}
      />
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
    </>
  );
}
