# Bootloader

SlayerOS uses the Limine bootloader to initialize the system and load the kernel. This document explains how the bootloader works and how the kernel interacts with it.

## Limine Bootloader

[Limine](https://github.com/limine-bootloader/limine) is a modern, feature-rich bootloader that supports both BIOS and UEFI systems. It provides a clean interface for the kernel to retrieve system information and resources.

### Key Features

- Multiboot2 and Limine protocol support
- BIOS and UEFI compatibility
- Memory map information
- Framebuffer initialization
- Module loading
- SMP (Symmetric Multiprocessing) initialization

## Boot Process

1. The system firmware (BIOS or UEFI) loads the Limine bootloader
2. Limine parses its configuration file (`limine.conf`)
3. Limine loads the kernel into memory
4. Limine prepares the environment (memory map, framebuffer, etc.)
5. Limine transfers control to the kernel's entry point (`_start`)

## Limine Configuration

The Limine configuration file (`misc/boot/limine.conf`) specifies various boot parameters: 

```
TIMEOUT=0
SERIAL=yes

:SlayerOS
PROTOCOL=limine
KERNEL_PATH=boot/slay.kernel
```

- `TIMEOUT=0`: Boot immediately without showing a menu
- `SERIAL=yes`: Enable serial output for debugging
- `:SlayerOS`: Start of an entry named "SlayerOS"
- `PROTOCOL=limine`: Use the Limine protocol
- `KERNEL_PATH=boot/slay.kernel`: Path to the kernel binary on the boot medium

## Limine Protocol

The Limine protocol is a communication mechanism between the bootloader and the kernel. The kernel places "requests" in its binary, and the bootloader fills in "responses" before transferring control.

### Request Structure

```cpp
struct limine_request {
    uint64_t id[4];
    uint64_t revision;
    void *response;
};
```

### Common Requests

SlayerOS uses several Limine requests:

- **Memory Map Request**: Provides information about available memory regions
- **Framebuffer Request**: Provides a framebuffer for graphics output
- **HHDM Request**: Provides a Higher Half Direct Map for accessing physical memory
- **Kernel File Request**: Provides information about the kernel file

## Boot Context

SlayerOS defines a `BootloaderCtx` structure to store information provided by the bootloader:

```cpp
struct BootloaderCtx {
    struct limine_memmap_response *memmap;
    struct limine_framebuffer_response *fb_info;
    struct limine_hhdm_response *hhdm;
    struct limine_kernel_file_response *kernel_file;
};
```

This structure is populated in `bootloader/limine.cxx` and used throughout the kernel.

## Kernel Initialization

After the bootloader transfers control to the kernel, the following steps occur:

1. The `_start` function (assembly) sets up the stack and calls `_kernel_start`
2. `_kernel_start` initializes the UART for logging
3. The kernel collects bootloader information by accessing the Limine responses
4. The kernel initializes the frame allocator using the memory map
5. The kernel initializes the paging system
6. The kernel initializes the framebuffer for graphics output

## Debugging with Serial Output

Limine can redirect kernel output to a serial port for debugging. This is enabled with the `SERIAL=yes` option in `limine.conf`. The kernel can then use the serial port for logging and debugging output.

## Building and Running

To build an ISO image with Limine and the SlayerOS kernel:

1. Compile the kernel
2. Create a directory structure for the ISO
3. Copy the kernel and Limine files to the appropriate locations
4. Use `xorriso` to create the ISO image
5. Install the Limine bootloader to the ISO

This process is automated in the Makefile with the `iso` target.

## Best Practices

When working with the bootloader:

1. Always check that bootloader responses are valid before using them
2. Don't rely on bootloader-reclaimable memory after initialization
3. Use the memory map to avoid overwriting important memory regions
4. Initialize essential hardware (like the serial port) early for debugging
```

These documents provide comprehensive information about the memory management system and bootloader in SlayerOS, based on the architecture overview. They explain the key components, their functions, and how they work together to initialize and manage the system.
