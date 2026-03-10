import Head from '@docusaurus/Head';
import type {WithContext, BreadcrumbList} from 'schema-dts';
import React, {type ReactNode} from 'react';
import {useBreadcrumbsStructuredData} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/DocBreadcrumbs/StructuredData';

function toCanonicalUrl(url: string): string {
  if (!url.startsWith('https://cotomy.net/')) {
    return url;
  }

  return url === 'https://cotomy.net/'
    ? url
    : `${url.replace(/\/+$/, '')}/`;
}

export default function DocBreadcrumbsStructuredData(props: Props): ReactNode {
  const structuredData = useBreadcrumbsStructuredData({
    breadcrumbs: props.breadcrumbs,
  });
  const normalizedStructuredData: WithContext<BreadcrumbList> = {
    ...structuredData,
    itemListElement: structuredData.itemListElement.map((item) => ({
      ...item,
      item: toCanonicalUrl(item.item),
    })),
  };

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(normalizedStructuredData)}
      </script>
    </Head>
  );
}
