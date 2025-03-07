import Unocss from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { version } from '../../../package.json'

export default defineConfig({
  base: '/',
  description: 'A lightweight, fast, and sleek operating system designed for x86_64 processors, focused on minimalism and efficiency',
  markdown: {
    headers: {
      level: [0, 0],
    },
  },
  themeConfig: {
    footer: {
      message: 'SlayerOS',
      copyright: 'Copyright © 2025 SlayerOS',
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SlayerOS' },
    ],
    editLink: {
      pattern: 'https://github.com/slayer-os/SlayerOS/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    nav: nav(),
    sidebar: {
      '/guide/': sidebarGuide(),
      '/config/': sidebarConfig(),
    },

  },
  title: 'SlayerOS',
  vite: {
    plugins: [
      Unocss({
        configFile: '../../unocss.config.ts',
      }),
    ],
  },
})

function nav() {
  return [
    { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
    { text: 'Configs', link: '/config/', activeMatch: '/config/' },
    { text: 'Blog', link: '/blog/', activeMatch: '/blog/' },
    {
      text: 'External Docs',
      items: [
        {
          text: 'Vitepress',
          link: 'https://vitepress.vuejs.org',
        },
        {
          text: 'UnoCSS',
          link: 'https://uno.antfu.me',
        },
      ],
    },
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/slayer-os/SlayerOS/blob/main/CHANGELOG.md',
        },
      ],
    },
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        { text: 'What is this?', link: '/guide/' },
      ],
    },
    {
      text: 'Features',
      collapsible: true,
      items: [
        { text: 'UnoCSS', link: '/guide/features/unocss' },
      ],
    },
  ]
}

function sidebarConfig() {
  return [
    {
      text: 'Config',
      items: [
        { text: 'Introduction', link: '/config/' },
        { text: 'UnoCSS', link: '/config/unocss' },
      ],
    },
  ]
}
