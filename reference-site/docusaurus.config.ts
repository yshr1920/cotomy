import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Cotomy',
  tagline: 'A DOM-first UI runtime for screen-oriented business systems.',
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
        name: 'Cotomy',
        url: 'https://cotomy.net/',
        description: 'A DOM-first UI runtime for screen-oriented internal business systems.',
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
        sameAs: ['https://blog.cotomy.net/', 'https://github.com/yshr1920/cotomy'],
      }),
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.png',
    metadata: [
      {
        name: 'description',
        content: 'Cotomy is a DOM-first UI runtime for screen-oriented internal business systems.',
      },
      {
        name: 'keywords',
        content: 'Cotomy, UI runtime, DOM-first, internal systems, business screens, TypeScript',
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
      disableSwitch: true,
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
          to: '/architecture/',
          position: 'left',
          label: 'Architecture',
          activeBaseRegex: '^/architecture/?$',
        },
        {
          to: '/use-cases/',
          position: 'left',
          label: 'Use Cases',
          activeBaseRegex: '^/use-cases/?$',
        },
        {
          to: '/design-philosophy/',
          position: 'left',
          label: 'Design Philosophy',
          activeBaseRegex: '^/design-philosophy/?$',
        },
        {
          to: '/comparison/',
          position: 'left',
          label: 'Comparison',
          activeBaseRegex: '^/comparison/?$',
        },
        {
          to: '/reference/getting-started/',
          position: 'left',
          label: 'Getting Started',
          activeBaseRegex: '^/reference/getting-started(?:/|$)',
        },
        {
          to: '/reference/',
          position: 'left',
          label: 'Reference',
          activeBaseRegex: '^/reference(?:/(?!getting-started(?:/|$)|release-notes(?:/|$)).*)?/?$',
        },
        {
          to: '/reference/release-notes/',
          position: 'left',
          label: 'Release Notes',
          activeBaseRegex: '^/reference/release-notes/?$',
        },
        {
          to: '/contact/',
          position: 'right',
          label: 'Contact',
          activeBaseRegex: '^/contact/?$',
        },
        {
          to: '/privacy-policy/',
          position: 'right',
          label: 'Privacy Policy',
          activeBaseRegex: '^/privacy-policy/?$',
        },
        {
          href: 'https://blog.cotomy.net/',
          position: 'right',
          label: 'Blog',
        },
        {
          href: 'https://github.com/yshr1920/cotomy',
          position: 'right',
          label: 'GitHub',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Blog',
          items: [
            {
              label: 'Cotomy Blog',
              href: 'https://blog.cotomy.net/',
            },
          ],
        },
        {
          title: 'GitHub',
          items: [
            {
              label: 'Repository',
              href: 'https://github.com/yshr1920/cotomy',
            },
          ],
        },
        {
          title: 'npm',
          items: [
            {
              label: 'cotomy package',
              href: 'https://www.npmjs.com/package/cotomy',
            },
          ],
        },
        {
          title: 'License',
          items: [
            {
              label: 'MIT License',
              href: 'https://github.com/yshr1920/cotomy/blob/main/LICENSE',
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
