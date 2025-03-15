# Kernel Configuration

This document explains the kernel configuration options available in SlayerOS. These settings control the core behavior and features of the operating system.

## Feature Flags

SlayerOS uses compile-time feature flags to enable or disable specific kernel features. These flags are defined in `src/include/host/flags.h`.

### Core Features

```cpp
// Enable/disable kernel features
#define ENABLE_SMP 1           // Symmetric Multiprocessing support
#define ENABLE_ACPI 1          // Advanced Configuration and Power Interface
#define ENABLE_APIC 1          // Advanced Programmable Interrupt Controller
#define ENABLE_SERIAL_LOGGING 1 // Serial port logging
```

### Memory Management

```cpp
// Memory management configuration
#define PAGE_SIZE 4096         // Size of memory pages in bytes
#define KERNEL_HEAP_INITIAL_SIZE (4 * 1024 * 1024) // 4MB initial heap
#define MAX_PHYSICAL_MEMORY (4ULL * 1024 * 1024 * 1024) // 4GB max physical memory
```

### Debug Options

```cpp
// Debug configuration
#define ENABLE_DEBUG_SYMBOLS 0 // Include debug symbols in release build
#define STACK_PROTECTOR 1      // Enable stack protection
#define HEAP_VALIDATION 0      // Enable heap validation (performance impact)
```

## Kernel Parameters

The kernel accepts several parameters that can be passed via the bootloader:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `debug` | Enable debug output | Disabled |
| `serial` | Enable serial output | Enabled |
| `vga` | Use VGA text mode instead of framebuffer | Disabled |
| `noacpi` | Disable ACPI | ACPI Enabled |
| `nomce` | Disable Machine Check Exception handling | MCE Enabled |

## Memory Layout

The kernel memory layout is defined in `misc/linkage.ld`:

```
KERNEL_VIRT_BASE = 0xFFFFFFFF80000000;  /* Kernel virtual base address */
KERNEL_PHYS_BASE = 0x100000;            /* Kernel physical base (1MB) */
```

This places the kernel in the higher half of the virtual address space, starting at -2GB.

## Interrupt Configuration

Interrupt handling can be configured in `src/kernel/arch/interrupts.cxx`:

```cpp
// IRQ assignments
#define PIT_IRQ 0      // Programmable Interval Timer
#define KEYBOARD_IRQ 1 // Keyboard controller
#define CASCADE_IRQ 2  // Cascade for IRQs 8-15
#define COM1_IRQ 4     // Serial port COM1
#define MOUSE_IRQ 12   // PS/2 Mouse
```

## Scheduler Settings

The kernel scheduler can be configured in `src/kernel/sched/scheduler.cxx`:

```cpp
// Scheduler configuration
#define TIMESLICE_MS 10        // Default timeslice in milliseconds
#define MAX_PRIORITY 32        // Number of priority levels
#define DEFAULT_PRIORITY 16    // Default process priority
```

## Customizing the Kernel

To customize the kernel configuration:

1. Edit the appropriate configuration file
2. Rebuild the kernel with `make clean && make`
3. Test your changes in QEMU before deploying

## Configuration Examples

### Minimal Configuration

For a minimal system with reduced memory footprint:

```cpp
#define ENABLE_SMP 0
#define ENABLE_ACPI 0
#define KERNEL_HEAP_INITIAL_SIZE (1 * 1024 * 1024) // 1MB initial heap
```

### Debug Configuration

For a debug-friendly configuration:

```cpp
#define ENABLE_DEBUG_SYMBOLS 1
#define ENABLE_SERIAL_LOGGING 1
#define STACK_PROTECTOR 1
#define HEAP_VALIDATION 1
```

## Best Practices

1. Only enable features you need to minimize kernel size and attack surface
2. Test thoroughly after changing configuration options
3. Consider hardware compatibility when disabling features like ACPI
4. Document any custom configurations you create