import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const GITHUB_URL = 'https://github.com/TabletopFoundry/pnp-hub';

const config: Config = {
  title: 'PnP Hub',
  tagline: 'Discover, optimize, and print tabletop games at home.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://tabletopfoundry.github.io',
  baseUrl: '/pnp-hub/',

  organizationName: 'TabletopFoundry',
  projectName: 'pnp-hub',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: `${GITHUB_URL}/edit/main/website/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
    metadata: [
      { name: 'keywords', content: 'print-and-play, board games, marketplace, nextjs, sqlite, tabletop' },
      { name: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'PnP Hub',
      logo: {
        alt: 'PnP Hub logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        { to: '/getting-started/quickstart', label: 'Quickstart', position: 'left' },
        { to: '/reference/configuration', label: 'Reference', position: 'left' },
        { to: '/why', label: 'Why PnP Hub', position: 'left' },
        {
          href: GITHUB_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Quickstart', to: '/getting-started/quickstart' },
            { label: 'Core Concepts', to: '/concepts/architecture' },
            { label: 'Guides', to: '/guides/seed-the-catalog' },
            { label: 'Reference', to: '/reference/configuration' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub Discussions', href: `${GITHUB_URL}/discussions` },
            { label: 'Issue Tracker', href: `${GITHUB_URL}/issues` },
            { label: 'Contributing', to: '/contributing' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Changelog', to: '/changelog' },
            { label: 'Troubleshooting', to: '/troubleshooting' },
            { label: 'GitHub', href: GITHUB_URL },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PnP Hub contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'sql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
