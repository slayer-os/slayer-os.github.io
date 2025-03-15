import Unocss from 'unocss/vite'
import { defineConfig } from 'vitepress'
import { version } from '../package.json'

export default defineConfig({
  base: '/',
  description: 'A lightweight, fast, and sleek operating system designed for x86_64 processors, focused on minimalism and efficiency',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#613dc1' }],
    ['meta', { name: 'background-color', content: '#2c0735' }],
    ['meta', { name: 'description', content: 'SlayerOS - A lightweight, fast, and sleek operating system designed for x86_64 processors, focused on minimalism and efficiency' }],
    ['meta', { name: 'keywords', content: 'SlayerOS, Operating System, x86_64, Minimalism, Efficiency' }],
    ['meta', { property: 'og:title', content: 'SlayerOS' }],
    ['meta', { property: 'og:description', content: 'A lightweight, fast, and sleek operating system designed for x86_64 processors, focused on minimalism and efficiency' }],
    ['meta', { property: 'og:image', content: '/og.png' }],
    ['meta', { property: 'og:url', content: 'https://slayer-os.github.io' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'SlayerOS' }],
    ['meta', { name: 'twitter:description', content: 'A lightweight, fast, and sleek operating system designed for x86_64 processors, focused on minimalism and efficiency' }],
    ['meta', { name: 'twitter:image', content: '/og.png' }],
  ],
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
      { icon: 'github', link: 'https://github.com/slayer-os/' },
    ],
    editLink: {
      pattern: 'https://github.com/slayer-os/slayer-os.github.io/edit/main/docs/:path',
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
    { text: 'Configuration', link: '/config/', activeMatch: '/config/' },
    { text: 'Contributing', link: '/contributing/', activeMatch: '/contributing/' },
    {
      text: 'Resources',
      items: [
        {
          text: 'OS Development Wiki',
          link: 'https://wiki.osdev.org/Main_Page',
        },
        {
          text: 'x86_64 Reference',
          link: 'https://www.felixcloutier.com/x86/',
        },
        {
          text: 'Limine Bootloader',
          link: 'https://github.com/limine-bootloader/limine',
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
        {
          text: 'Roadmap',
          link: 'https://github.com/slayer-os/SlayerOS/blob/main/ROADMAP.md',
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
      text: 'Architecture',
      collapsible: true,
      items: [
        { text: 'Project Structure', link: '/guide/architecture/overview' },
        { text: 'Memory Management', link: '/guide/architecture/memory' },
        { text: 'Bootloader', link: '/guide/architecture/bootloader' },
        { text: 'Driver', link: '/guide/architecture/driver' },
        { text: 'LibC', link: '/guide/architecture/libc' },
      ],
    },
    {
      text: 'Development',
      collapsible: true,
      items: [
        { text: 'Building', link: '/guide/development/building' },
        { text: 'Debugging', link: '/guide/development/debugging' },
      ],
    },
  ]
}

function sidebarConfig() {
  return [
    {
      text: 'Configuration',
      items: [
        { text: 'Introduction', link: '/config/' },
        { text: 'Kernel Configuration', link: '/config/kernel' },
        { text: 'Build Options', link: '/config/build' },
        { text: 'Hardware Support', link: '/config/hardware' },
      ],
    },
  ]
}
