# Hardware Support Configuration

This document explains how to configure SlayerOS for different hardware platforms and devices. Proper hardware configuration is essential for optimal performance and compatibility.

## Supported Hardware

SlayerOS currently supports the following hardware:

- **CPU Architecture**: x86_64 (64-bit)
- **Boot**: BIOS and UEFI via Limine bootloader
- **Graphics**: VESA/VBE framebuffer
- **Input**: PS/2 keyboard and mouse
- **Storage**: Basic ATA/IDE support
- **Serial**: 16550 UART

## CPU Configuration

### x86_64 Features

You can configure which CPU features to use in `src/kernel/arch/cpu.cxx`:

```cpp
// CPU feature configuration
#define USE_SSE 1      // Streaming SIMD Extensions
#define USE_AVX 0      // Advanced Vector Extensions
#define USE_XSAVE 0    // Extended State Save/Restore
```

### SMP Configuration

Symmetric Multiprocessing can be configured in `src/kernel/arch/smp.cxx`:

```cpp
// SMP configuration
#define MAX_CPUS 16    // Maximum number of CPU cores supported
#define SMP_ENABLED 1  // Enable SMP support
```

## Memory Configuration

### Physical Memory

Configure physical memory limits in `src/include/host/flags.h`:

```cpp
// Physical memory configuration
#define MAX_PHYSICAL_MEMORY (4ULL * 1024 * 1024 * 1024) // 4GB max physical memory
```

### Virtual Memory

Configure virtual memory layout in `misc/linkage.ld` and `src/mem/paging.cxx`:

```cpp
// Virtual memory layout
#define KERNEL_VIRT_BASE 0xFFFFFFFF80000000 // Kernel base address
#define KERNEL_HEAP_START 0xFFFFFFFFA0000000 // Kernel heap start
#define USER_SPACE_END 0x00007FFFFFFFFFFF   // User space end
```

## Graphics Configuration

### Framebuffer

Configure framebuffer settings in `src/drivers/fb_gfx/fb_driver.cxx`:

```cpp
// Default framebuffer settings (fallback if bootloader doesn't provide)
#define DEFAULT_FB_WIDTH 800
#define DEFAULT_FB_HEIGHT 600
#define DEFAULT_FB_BPP 32
```

## Input Device Configuration

### Keyboard

Configure keyboard settings in `src/drivers/kbd/keyboard.cxx`:

```cpp
// Keyboard configuration
#define KEYBOARD_BUFFER_SIZE 16  // Size of keyboard input buffer
#define USE_US_LAYOUT 1          // Use US keyboard layout
```

## Storage Configuration

### Disk Controllers

Configure disk controller support in `src/drivers/storage/ata.cxx`:

```cpp
// ATA/IDE configuration
#define PRIMARY_ATA_BASE 0x1F0   // Primary ATA controller base I/O port
#define SECONDARY_ATA_BASE 0x170 // Secondary ATA controller base I/O port
#define ATA_IDENTIFY_TIMEOUT 1000 // Timeout for ATA identify command (ms)
```

## Serial Port Configuration

Configure serial port settings in `src/kernel/arch/serial.cxx`:

```cpp
// Serial port configuration
#define COM1_PORT 0x3F8          // COM1 base port
#define COM2_PORT 0x2F8          // COM2 base port
#define SERIAL_BAUD_RATE 115200  // Baud rate
```

## Hardware Detection

SlayerOS performs hardware detection during boot:

1. **CPU Features**: Detected using CPUID instruction
2. **Memory Map**: Provided by bootloader
3. **Devices**: Basic detection for common devices

You can configure detection behavior in `src/kernel/kern.cxx`:

```cpp
// Hardware detection configuration
#define DETECT_ACPI 1            // Detect ACPI tables
#define DETECT_PCI 1             // Scan PCI bus
#define VERBOSE_DETECTION 0      // Verbose hardware detection
```

## Hardware-Specific Optimizations

### Cache Configuration

Configure cache usage in `src/mem/cache.cxx`:

```cpp
// Cache configuration
#define USE_WRITE_COMBINING 1    // Use write-combining for framebuffer
#define CACHE_LINE_SIZE 64       // CPU cache line size in bytes
```

### I/O Configuration

Configure I/O access methods in `src/kernel/arch/io.cxx`:

```cpp
// I/O configuration
#define USE_MMIO_WHEN_AVAILABLE 1 // Prefer MMIO over port I/O when available
```

## Testing Hardware Compatibility

To test hardware compatibility:

1. Build SlayerOS with verbose logging enabled:
   ```bash
   make DEBUG=1 VERBOSE=1
   ```

2. Run in QEMU with various hardware configurations:
   ```bash
   make run QEMU_EXTRA="-cpu host -smp 2"
   ```

3. Check serial output for hardware detection messages

## Hardware Configuration Examples

### Minimal Hardware Configuration

For minimal systems or maximum compatibility:

```cpp
#define USE_SSE 0
#define SMP_ENABLED 0
#define DETECT_ACPI 0
#define DETECT_PCI 0
```

### Modern Hardware Configuration

For modern systems with full feature support:

```cpp
#define USE_SSE 1
#define USE_AVX 1
#define SMP_ENABLED 1
#define MAX_CPUS 32
#define USE_WRITE_COMBINING 1
```

## Best Practices

1. Start with conservative hardware settings for maximum compatibility
2. Test thoroughly when enabling advanced hardware features
3. Provide fallback mechanisms for hardware that lacks certain features
4. Document hardware requirements for your specific configuration