---
layout: home

hero:
  name: SlayerOS
  text: Lightweight x86_64 Operating System
  tagline: A minimalist, efficient OS designed for modern hardware
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: Configuration
      link: /config/
    - theme: alt
      text: View on GitHub
      link: https://github.com/slayer-os/SlayerOS

features:
- title: "Minimalist Kernel Architecture"
  details: Built from the ground up with a focus on simplicity, efficiency, and modern design principles. The kernel provides only what's necessary for a solid foundation.
- title: "Modular Driver Framework"
  details: Extensible driver system makes hardware support straightforward. Add support for new devices without modifying the core kernel.
- title: "Custom LibC Implementation"
  details: Includes a lightweight, freestanding C library optimized for kernel development, with essential string, memory, and math functions.
- title: "Memory Management"
  details: Advanced virtual memory system with paging, frame allocation, and heap management designed for reliability and performance.
- title: "Modern Bootloader Integration"
  details: Seamless integration with the Limine bootloader provides support for both BIOS and UEFI systems with minimal configuration.
- title: "Developer-Friendly"
  details: Comprehensive documentation, clean code structure, and straightforward build system make SlayerOS an excellent platform for OS development learning and experimentation.
---

## Quick Start

```bash
# Clone the repository with submodules
git clone --recursive https://github.com/slayer-os/SlayerOS.git
cd SlayerOS

# Build the kernel and ISO
make

# Run in QEMU
make run
```

## Project Status

SlayerOS is currently in active development. The core kernel components are functional, including memory management, basic driver support, and bootloader integration. We're working toward a more complete system with process scheduling, filesystem support, and expanded hardware compatibility.

## Community

Join our community to contribute, ask questions, or follow development:

- [GitHub Repository](https://github.com/slayer-os/SlayerOS)
- [Discord Server](https://discord.gg/PxuNjt5kHz)

## License

SlayerOS is open source software licensed under the [GNU General Public License v3.0](https://github.com/slayer-os/SlayerOS/blob/main/LICENSE).
