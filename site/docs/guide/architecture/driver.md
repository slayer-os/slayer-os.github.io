# Memory Management in SlayerOS

SlayerOS implements a comprehensive memory management system with four key components: frame allocation, paging, heap management, and memory mapping. This document explains how these components work together to provide efficient memory management.

## Memory Layout

SlayerOS uses a higher-half kernel design where the kernel occupies the upper portion of the virtual address space. This provides:

- Clear separation between user and kernel memory
- Protection against unauthorized access to kernel memory
- Ability to remap user memory independently

## Frame Allocator

The frame allocator manages physical memory at the granularity of 4KB frames.

### Implementation

- **Initialization**: `Frame::init()` parses the Limine-provided memory map to identify usable memory regions
- **Tracking**: Uses a bitmap where each bit represents one physical frame (1=used, 0=free)
- **API**:
  ```cpp
  void* Frame::alloc();       // Allocates a single frame
  void Frame::free(void* ptr); // Releases a previously allocated frame
  ```

The allocator carefully avoids regions marked as reserved, bootloader data, or hardware-mapped areas in the memory map.

## Paging System

The paging system implements virtual memory using the x86_64 four-level paging structure.

### Implementation

- **Page Tables**: Uses PML4, PML3, PML2, and PML1 tables (also known as Page Map Level 4, PDPT, PD, and PT)
- **API**:
  ```cpp
  void Paging::init();                                  // Initializes paging
  void Paging::map(uintptr_t phys, uintptr_t virt, uint64_t flags); // Maps physical to virtual
  void Paging::unmap(uintptr_t virt);                   // Removes mapping
  ```

### Page Flags

- `PAGE_PRESENT`: Page is in memory
- `PAGE_WRITABLE`: Page can be written to
- `PAGE_USER`: Page is accessible from user mode
- `PAGE_WRITETHROUGH`: Write-through caching
- `PAGE_NOCACHE`: Disable caching
- `PAGE_NX`: No-execute (prevents code execution)

## Heap Allocator

The heap allocator provides dynamic memory allocation (similar to `malloc`/`free`).

### Implementation

- **Structure**: Divides memory into pages, each containing segments
- **Tracking**: Uses linked lists of free and used segments
- **API**:
  ```cpp
  void* kmalloc(size_t size);  // Allocates memory
  void kfree(void* ptr);       // Frees allocated memory
  ```

The allocator implements basic coalescing to prevent fragmentation by merging adjacent free segments.

## Memory Mapper

The memory mapper creates the initial virtual memory layout during kernel initialization.

### Implementation

- **Initialization**: `Mapper::full_map()` sets up all required mappings
- **Key Mappings**:
  - Kernel code and data sections
  - Higher Half Direct Map (HHDM) for accessing physical memory
  - Framebuffer for graphics output
  - Bootloader data structures

### Address Translation

```cpp
// Convert physical address to virtual
#define PHYS2VIRT(addr) ((void*)((uintptr_t)(addr) + hhdm_offset))

// Convert virtual address to physical
#define VIRT2PHYS(addr) ((void*)((uintptr_t)(addr) - hhdm_offset))
```

## Memory Management Flow

1. **Boot**: Limine provides memory map and HHDM information
2. **Initialization**: Frame allocator initializes using memory map
3. **Paging Setup**: Kernel creates initial page tables
4. **Mapping**: Memory mapper creates standard mappings
5. **Heap Setup**: Heap allocator initializes for dynamic allocation
6. **Runtime**: Kernel uses `kmalloc`/`kfree` for memory management

## Best Practices

- Always check allocation results for NULL
- Free all allocated memory to prevent leaks
- Use appropriate page flags for security (e.g., NX for data)
- Be aware of alignment requirements for hardware operations
```

```markdown:site/docs/guide/architecture/bootloader.md
# Bootloader Integration in SlayerOS

SlayerOS uses the Limine bootloader to initialize hardware and load the kernel. This document explains the boot process and how the kernel interacts with Limine.

## Limine Bootloader

[Limine](https://github.com/limine-bootloader/limine) is a modern bootloader supporting both BIOS and UEFI systems. It provides a clean protocol for retrieving system information and resources.

### Key Features

- Multiboot2 and Limine protocol support
- BIOS and UEFI compatibility
- Detailed memory map information
- Framebuffer initialization
- Module loading capability
- SMP initialization

## Boot Process

1. Firmware (BIOS/UEFI) loads Limine
2. Limine reads its configuration (`limine.conf`)
3. Limine loads the kernel into memory
4. Limine prepares boot information structures
5. Control transfers to kernel entry point (`_start`)

## Limine Protocol

The Limine protocol uses a request/response mechanism for communication between the bootloader and kernel.

### Request Structure

```cpp
struct limine_request {
    uint64_t id[4];         // Unique identifier
    uint64_t revision;      // Protocol revision
    void *response;         // Filled by bootloader
};
```

### Key Requests Used by SlayerOS

- **Memory Map Request**: `limine_memmap_request`
  - Provides information about available memory regions
  - Identifies usable, reserved, ACPI, and other memory types

- **Framebuffer Request**: `limine_framebuffer_request`
  - Provides initialized graphics framebuffer
  - Includes resolution, pixel format, and memory address

- **HHDM Request**: `limine_hhdm_request`
  - Provides Higher Half Direct Map offset
  - Enables easy physical memory access from kernel space

- **Kernel File Request**: `limine_kernel_file_request`
  - Provides information about the kernel ELF file
  - Useful for accessing embedded data

## Boot Context

SlayerOS stores bootloader information in a central structure:

```cpp
struct BootloaderCtx {
    struct limine_memmap_response *memmap;
    struct limine_framebuffer_response *fb_info;
    struct limine_hhdm_response *hhdm;
    struct limine_kernel_file_response *kernel_file;
};

extern BootloaderCtx boot_ctx;
```

This structure is populated in `bootloader/limine.cxx` and accessed throughout the kernel.

## Kernel Initialization Sequence

1. **Entry Point**: `_start` (assembly)
   - Sets up stack
   - Calls `_kernel_start`

2. **Early Initialization**: `_kernel_start`
   - Initializes serial port for debugging
   - Retrieves bootloader information
   - Sets up essential services

3. **Memory Setup**:
   - Initializes frame allocator using memory map
   - Sets up paging system
   - Creates memory mappings

4. **Driver Initialization**:
   - Initializes framebuffer driver
   - Sets up other hardware drivers

## Limine Configuration

SlayerOS uses a minimal `limine.conf`:

```
TIMEOUT=0
SERIAL=yes

:SlayerOS
PROTOCOL=limine
KERNEL_PATH=boot/slay.kernel
```

## Building a Bootable Image

The build process:

1. Compile kernel into ELF binary
2. Create ISO directory structure
3. Copy kernel and Limine files
4. Generate ISO with xorriso
5. Install Limine bootloader to ISO

```bash
# Example build command (from Makefile)
xorriso -as mkisofs -b boot/limine/limine-bios-cd.bin \
    -no-emul-boot -boot-load-size 4 -boot-info-table \
    --efi-boot boot/limine/limine-uefi-cd.bin \
    -efi-boot-part --efi-boot-image --protective-msdos-label \
    $(ISO_DIR) -o $(ISO_FILE)
```

## Debugging Boot Issues

- Enable serial output with `SERIAL=yes` in `limine.conf`
- Use QEMU with `-serial stdio` to view serial output
- Check early initialization code for errors
- Verify memory map is being correctly interpreted
- Ensure kernel entry point is properly aligned

## Best Practices

- Always validate bootloader responses before use
- Don't rely on bootloader-reclaimable memory after initialization
- Use the provided memory map to avoid overwriting critical regions
- Initialize serial port early for debugging capability
