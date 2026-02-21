// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

const githubOwner = process.env.GITHUB_OWNER ?? 'Tongzhao9417';
const githubRepository = process.env.GITHUB_REPOSITORY ?? 'Tongzhao9417/price_comparison';
const projectName = githubRepository.split('/')[1] ?? 'price_comparison';
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '中转站对比统计',
  tagline: 'Markdown 文档展示',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: `https://${githubOwner}.github.io`,
  baseUrl: isGitHubActions ? `/${projectName}/` : '/',

  organizationName: githubOwner,
  projectName,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  scripts: ['js/table-sort-v2.js', 'js/busuanzi-counter.js'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: '中转站对比统计',
        items: [
          {
            href: `https://github.com/${githubRepository}`,
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.github,
      },
    }),
};

export default config;
