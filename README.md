# SlayerOS Documentation Site

Official documentation site for SlayerOS, a lightweight, fast, and sleek operating system designed for x86_64 processors, focused on minimalism and efficiency.

## Features

* Comprehensive documentation for SlayerOS architecture and components
* Detailed guides for building, configuring, and extending the OS
* API reference for kernel, driver, and LibC interfaces
* Development blog with technical insights and updates
* Built with [VitePress](https://vitepress.dev/) and [UnoCSS](https://github.com/unocss/unocss)
* Local search functionality

## Documentation Structure

* **Guide**: Introduction and core concepts
* **Architecture**: Detailed technical documentation
* **Configuration**: Customization options
* **API Reference**: Programming interfaces
* **Contributing**: Development guidelines
* **Release Notes**: Version history and roadmap

## Local Development

### Prerequisites

* Node.js 16.x or higher
* pnpm (recommended) or npm

### Installation

```shell
# Clone the repository
git clone https://github.com/slayer-os/slayer-os-docs.git
cd slayer-os-docs

# Install dependencies
pnpm install
```

### Development Server

```shell
# Start the development server
pnpm dev
```

The site will be available at http://localhost:5173/

### Building for Production

```shell
# Build the static site
pnpm build
```

The built site will be in the `site/docs/.vitepress/dist` directory.

### Preview Production Build

```shell
# Preview the production build
pnpm preview
```

## Customization

### Adding New Pages

1. Create a new Markdown file in the appropriate directory under `site/docs/`
2. Update the sidebar configuration in `site/docs/.vitepress/config.mts` if needed

### Adding Favicon

1. Place favicon files in the `site/docs/public` directory
2. Update the `head` section in `site/docs/.vitepress/config.mts`

### Modifying Theme

1. Edit UnoCSS configuration in `unocss.config.ts`
2. Customize VitePress theme in `site/docs/.vitepress/theme`

## Deployment

The documentation site is automatically deployed via GitHub Actions when changes are pushed to the main branch.

## Contributing

Contributions to improve the documentation are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure your content follows the established style and organization.

## License

This documentation is licensed under the [GNU General Public License v3.0](https://github.com/slayer-os/SlayerOS/blob/main/LICENSE), the same license as the SlayerOS project.
