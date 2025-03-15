# Memory Management

SlayerOS implements a comprehensive memory management system that handles physical and virtual memory allocation, paging, and heap management. This document explains the core components of the memory subsystem.

## Memory Layout

SlayerOS uses a higher-half kernel design, where the kernel is mapped to the higher half of the virtual address space. This separation provides several benefits:

- Clear distinction between user and kernel memory spaces
- Protection against user-mode access to kernel memory
- Ability to remap user memory without affecting kernel memory

## Frame Allocator

The frame allocator manages physical memory at the granularity of frames (typically 4KB blocks).

### Key Components

- **Initialization**: `Frame::init()` uses the memory map provided by the Limine bootloader to identify available physical memory.
- **Bitmap Tracking**: A bitmap tracks which frames are free and which are allocated.
- **Core Functions**:
  - `Frame::alloc()`: Allocates a single free frame
  - `Frame::free(frame)`: Returns a previously allocated frame to the free pool

### Implementation Details

The frame allocator scans the memory map to find usable memory regions, excluding reserved areas like the kernel itself, bootloader data, and hardware-reserved regions. It then creates a bitmap where each bit represents one physical frame, with 1 indicating "in use" and 0 indicating "free".

## Paging System

The paging system implements virtual memory, allowing the kernel to use more memory than physically available and providing memory protection.

### Key Components

- **Page Tables**: SlayerOS uses the x86_64 four-level paging structure (PML4, PML3, PML2, PML1)
- **Core Functions**:
  - `Paging::init()`: Initializes the paging system by allocating a PML4 table and setting up initial mappings
  - `Paging::map(phys, virt, flags)`: Maps a physical address to a virtual address with specified flags
  - `Paging::unmap(virt)`: Removes a virtual memory mapping

### Page Flags

The paging system supports various flags for memory mappings:

- Present: Indicates the page is currently in memory
- Writable: Allows write access to the page
- User/Supervisor: Controls whether user-mode code can access the page
- Write-Through: Controls caching behavior
- No-Execute: Prevents code execution from the page

## Heap Allocator

The heap allocator provides dynamic memory allocation within the kernel (similar to `malloc` in userspace).

### Key Components

- **Heap Pages**: The heap is divided into pages, each managed by a `heap_page_t` structure
- **Segments**: Within each page, memory is divided into segments (`heap_segment_t`)
- **Core Functions**:
  - `kmalloc(size)`: Allocates a block of memory of the specified size
  - `kfree(addr)`: Frees a previously allocated block of memory

### Implementation Details

The heap allocator uses a linked list of segments to track free and allocated memory blocks. When a memory allocation request is made, it searches for a free segment of sufficient size. If found, it splits the segment if necessary and returns the allocated portion. When memory is freed, adjacent free segments are merged to prevent fragmentation.

## Memory Mapper

The memory mapper is responsible for creating initial memory mappings during kernel initialization.

### Key Components

- **Full Mapping**: `Mapper::full_map()` creates all initial mappings
- **Mapping Types**:
  - Kernel text, rodata, and data sections
  - Higher Half Direct Map (HHDM) for direct physical memory access
  - Framebuffer memory for graphics output
  - Bootloader-reclaimable memory

### Address Translation

The kernel provides macros for translating between virtual and physical addresses:

- `PHYS2VIRT(addr)`: Converts a physical address to its corresponding virtual address
- `VIRT2PHYS(addr)`: Converts a virtual address to its corresponding physical address

## Best Practices

When working with SlayerOS memory management:

1. Always use the appropriate allocation function for your needs
2. Free all allocated memory to prevent memory leaks
3. Be aware of page boundaries when working with direct memory access
4. Use the correct memory flags when mapping memory to ensure proper protection 