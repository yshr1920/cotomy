import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Cotomy Reference',
  tagline: 'Cotomy API and class reference',
  favicon: 'img/logo.svg',
  trailingSlash: true,

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://cotomy.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'yshr1920', // Usually your GitHub org/user name.
  projectName: 'cotomy', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        gtag: {
          trackingID: 'G-0HS12QXSH7',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  headTags: [
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Cotomy Reference',
        url: 'https://cotomy.net/',
        description: 'Official Cotomy API and class reference for DOM-centric business UI.',
      }),
    },
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'labo1920',
        url: 'https://cotomy.net/',
        email: 'yshr1920@gmail.com',
      }),
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    metadata: [
      {
        name: 'description',
        content: 'Cotomy reference documentation for classes, forms, API integration, and page-scoped UI architecture.',
      },
      {
        name: 'keywords',
        content: 'Cotomy, TypeScript, DOM, UI runtime, API forms, reference documentation',
      },
      {
        name: 'robots',
        content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Cotomy',
      logo: {
        alt: 'Cotomy Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'reference/overview',
          position: 'left',
          label: 'Overview',
        },
        {
          type: 'doc',
          docId: 'reference/comparison',
          position: 'left',
          label: 'Comparison',
        },
        {
          type: 'doc',
          docId: 'reference/getting-started',
          position: 'left',
          label: 'Getting Started',
        },
        {
          type: 'doc',
          docId: 'reference/index',
          position: 'left',
          label: 'Class Index',
        },
        {
          type: 'doc',
          docId: 'reference/classes/view/cotomy-element',
          position: 'left',
          label: 'Reference',
        },
        {
          to: '/contact/',
          position: 'right',
          label: 'Contact',
        },
        {
          to: '/privacy-policy/',
          position: 'right',
          label: 'Privacy Policy',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Reference',
          items: [
            {
              label: 'Overview',
              to: '/',
            },
            {
              label: 'Comparison',
              to: '/comparison',
            },
            {
              label: 'Getting Started',
              to: '/reference/getting-started',
            },
            {
              label: 'Reference',
              to: '/reference/classes/view/cotomy-element',
            },
          ],
        },
        {
          title: 'Contact',
          items: [
            {
              label: 'Contact Form',
              to: '/contact/',
            },
            {
              label: 'Privacy Policy',
              to: '/privacy-policy/',
            },
            {
              label: 'yshr1920@gmail.com',
              href: 'mailto:yshr1920@gmail.com',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} labo1920. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
