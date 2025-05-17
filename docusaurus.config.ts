import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import matomoPlugin from './plugins/matomo-plugin';
import { redirects } from './plugins/redirect/index';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'TLSNotary',
  tagline: 'Privacy-preserving data portability',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://tlsnotary.org/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tlsnotary', // Usually your GitHub org/user name.
  projectName: 'TLSNotary', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  plugins: [
    matomoPlugin,
    ['@docusaurus/plugin-client-redirects', { redirects },],
  ],

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tlsnotary/landing-page',
          // Enable math support in docs
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    navbar: {
      title: 'TLSNotary',
      logo: {
        alt: 'TLSNotary Logo',
        src: 'img/logo/tlsn-logo-blue.svg',
      },
      items: [
        { to: '/about', label: 'About', position: 'left' },

        { to: '/use-cases', label: 'Use Cases', position: 'left' },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },

        { to: '/docs/faq', label: 'FAQ', position: 'left' },

        { to: '/blog', label: 'Blog', position: 'left' },


        { href: 'https://tlsnotary.github.io/tlsn/tlsn_prover/', label: 'API', position: 'right' },
        {
          href: 'https://github.com/tlsnotary',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://x.com/tlsnotary',
          label: 'X',
          position: 'right',
        },
        {
          href: 'https://discord.com/invite/9XwESXtcN7',
          label: 'Discord',
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
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
            {
              label: 'Quick Start',
              to: '/docs/quick_start',
            },
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/9XwESXtcN7',
            },
            {
              label: 'X',
              href: 'https://x.com/tlsnotary',
            },
            {
              label: 'PSE',
              href: 'https://pse.dev',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/tlsnotary',
            },
          ],
        },
      ],
      copyright: `TLSNotary is a project of Privacy and Scaling Explorations, an Ethereum Foundation supported team.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
