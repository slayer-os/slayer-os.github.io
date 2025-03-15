# Building SlayerOS

This guide explains how to build SlayerOS from source code. The build process creates a bootable ISO image that can be run in a virtual machine or installed on physical hardware.

## Prerequisites

Before building SlayerOS, ensure you have the following tools installed:

- **GCC/G++** (10.0 or newer) with x86_64 cross-compilation support
- **NASM** (Assembly compiler)
- **xorriso** (For creating ISO images)
- **make** (Build automation tool)
- **git** (Version control)
- **qemu** (For testing, optional)

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install build-essential nasm xorriso make git qemu-system-x86
```

### Arch Linux

```bash
sudo pacman -S base-devel nasm libisoburn make git qemu
```

### macOS (using Homebrew)

```bash
brew install x86_64-elf-gcc nasm xorriso make git qemu
```

### Windows (using WSL)

Install WSL with Ubuntu, then follow the Ubuntu instructions above.

## Getting the Source Code

Clone the repository with submodules:

```bash
git clone --recursive https://github.com/slayer-os/SlayerOS.git
cd SlayerOS
```

If you already cloned without `--recursive`, initialize the submodules:

```bash
git submodule update --init --recursive
```

## Build Process

SlayerOS uses a Makefile-based build system with several targets:

### Building the Kernel

To build just the kernel binary:

```bash
make kernel
```

This compiles the kernel source code and produces `build/slay.kernel`.

### Building the ISO

To build a bootable ISO image:

```bash
make iso
```

This builds the kernel, sets up the ISO directory structure with the Limine bootloader, and creates `build/slay.iso`.

### Building Everything

To build everything (kernel, libraries, and ISO):

```bash
make all
```

### Cleaning the Build

To remove all build artifacts:

```bash
make clean
```

## Build System Structure

The build system consists of several components:

### Main Makefile

The root `Makefile` coordinates the entire build process:

- Compiles the kernel source files
- Builds the LibC and drivers libraries
- Creates the ISO image with Limine

### Base Makefile Fragment

`misc/make/base.mk` defines common variables:

- Compiler and linker flags
- Include paths
- QEMU options for testing

### Linker Script

`misc/linkage.ld` controls how the kernel is linked:

- Defines memory layout
- Places sections (.text, .data, .bss)
- Sets the entry point

## Custom Build Options

### Debug Build

To build with debug symbols and assertions enabled:

```bash
make DEBUG=1
```

### Optimization Level

To change the optimization level:

```bash
make OPT_LEVEL=0  # No optimization (for debugging)
make OPT_LEVEL=2  # Default
make OPT_LEVEL=3  # Maximum optimization
```

### Custom QEMU Options

To pass custom options to QEMU when testing:

```bash
make run QEMU_EXTRA="-m 1G -smp 2"
```

## Running the OS

### In QEMU

To run the OS in QEMU after building:

```bash
make run
```

### With GDB Debugging

To run with GDB debugging enabled:

```bash
make debug
```

In another terminal:

```bash
make gdb
```

### On Real Hardware

To create a bootable USB drive (be careful with the device name):

```bash
sudo dd if=build/slay.iso of=/dev/sdX bs=4M status=progress
```

## Troubleshooting

### Common Build Issues

1. **Missing dependencies**
   - Error: `command not found`
   - Solution: Install the missing tool

2. **Submodule issues**
   - Error: `No such file or directory: 'limine/limine-bios.sys'`
   - Solution: Run `git submodule update --init --recursive`

3. **Compilation errors**
   - Check compiler version: `g++ --version`
   - Ensure you have the correct cross-compiler if needed

4. **ISO creation fails**
   - Verify xorriso is installed
   - Check disk space

### Getting Help

If you encounter issues not covered here:

1. Check the GitHub repository issues
2. Join the community Discord
3. Open a new issue with detailed information about the problem 