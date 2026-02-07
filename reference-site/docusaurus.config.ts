import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Cotomy Reference',
  tagline: 'Cotomy API and class reference',
  favicon: 'img/logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cotomy', // Usually your GitHub org/user name.
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

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
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
          docId: 'reference/classes/view/cotomy-element',
          position: 'left',
          label: 'Reference',
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
              to: '/reference/overview',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cotomy.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
