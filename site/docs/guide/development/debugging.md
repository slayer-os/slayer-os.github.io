# Debugging SlayerOS

This guide covers techniques and tools for debugging SlayerOS. Effective debugging is essential for kernel development, where traditional debugging methods may not be available.

## Debugging Approaches

SlayerOS supports several debugging approaches:

1. **Serial Port Logging**: Output debug messages via serial port
2. **GDB Remote Debugging**: Connect GDB to QEMU for source-level debugging
3. **Core Dumps**: Analyze memory dumps after crashes
4. **Assertions**: Catch programming errors at runtime

## Serial Port Debugging

Serial port debugging is the most basic and reliable method for kernel debugging.

### Enabling Serial Output

Serial output is enabled by default in `limine.conf`:

```
SERIAL=yes
```

### Logging Functions

The kernel provides several logging functions in `dbg/log.h`:

```cpp
// Log levels
enum LogLevel {
    LOG_DEBUG,
    LOG_INFO,
    LOG_WARN,
    LOG_ERROR,
    LOG_FATAL
};

// Logging functions
void log_debug(const char* fmt, ...);
void log_info(const char* fmt, ...);
void log_warn(const char* fmt, ...);
void log_error(const char* fmt, ...);
void log_fatal(const char* fmt, ...);
```

Example usage:

```cpp
#include <dbg/log.h>

void initialize_device() {
    log_debug("Initializing device at 0x%x", device_addr);
    
    if (!device_present()) {
        log_error("Device not found!");
        return;
    }
    
    log_info("Device initialized successfully");
}
```

### Viewing Serial Output

When running in QEMU, use the `-serial stdio` option to redirect serial output to the terminal:

```bash
make run
```

The Makefile already includes this option.

## GDB Remote Debugging

GDB allows source-level debugging of the kernel running in QEMU.

### Starting a Debug Session

1. Start QEMU with GDB server:

```bash
make debug
```

2. In another terminal, start GDB:

```bash
make gdb
```

This connects GDB to the QEMU GDB server.

### Common GDB Commands

```
(gdb) break _start                # Set breakpoint at kernel entry
(gdb) break kernel.cxx:42         # Set breakpoint at line 42 in kernel.cxx
(gdb) continue                    # Continue execution
(gdb) step                        # Step into function
(gdb) next                        # Step over function
(gdb) print variable              # Print variable value
(gdb) info registers              # Show CPU registers
(gdb) x/10x 0x1000                # Examine 10 hex words at address 0x1000
(gdb) backtrace                   # Show call stack
```

### Debugging with Symbols

For effective debugging, ensure debug symbols are enabled:

```bash
make clean
make DEBUG=1
```

## Assertions

Assertions help catch programming errors early by checking conditions that should always be true.

### Using Assertions

```cpp
#include <libc/assert.h>

void process_data(void* data, size_t size) {
    // Verify preconditions
    assert(data != nullptr, "Data pointer cannot be null");
    assert(size > 0, "Size must be positive");
    
    // Process data...
}
```

When an assertion fails, it prints the error message and halts the kernel.

## Memory Debugging

### Heap Corruption

To debug heap corruption:

1. Enable heap validation in `mem/heap.cxx`:

```cpp
#define HEAP_VALIDATE
```

2. This adds checks before and after each allocation to detect buffer overflows.

### Memory Leaks

Track memory allocations by implementing a simple memory tracker:

```cpp
struct allocation_info {
    void* ptr;
    size_t size;
    const char* file;
    int line;
};

// In a debug build, modify kmalloc/kfree to track allocations
```

## ELF and Symbol Debugging

SlayerOS includes ELF parsing capabilities that can be used for debugging:

### Symbol Resolution

The `err/meta_resolver.cxx` file contains functions to resolve addresses to symbol names:

```cpp
const char* resolve_symbol(uintptr_t addr);
```

This is used for generating meaningful backtraces.

## Debugging Boot Issues

Boot problems can be particularly challenging to debug:

1. **Enable verbose boot**: Add `VERBOSE=yes` to `limine.conf`
2. **Check memory map**: Use `log_debug` to print the memory map early in boot
3. **Verify bootloader requests**: Ensure all Limine requests are properly set up
4. **Single-step through initialization**: Use GDB to step through the boot process

## Hardware Debugging

For debugging hardware interaction:

1. **I/O Port Monitoring**: Use QEMU's `-d ioport` option
2. **Instruction Tracing**: Use QEMU's `-d in_asm` option
3. **Memory Tracing**: Use QEMU's `-d page` option

Example:

```bash
qemu-system-x86_64 -cdrom build/slay.iso -serial stdio -d ioport,in_asm
```

## Best Practices

1. **Log liberally**: Add detailed logging, especially for initialization code
2. **Use assertions**: Check preconditions and invariants
3. **Isolate problems**: Test components individually when possible
4. **Incremental changes**: Make small, testable changes
5. **Version control**: Commit working versions before major changes

## Debugging Tools Reference

| Tool | Purpose | Command |
|------|---------|---------|
| GDB | Source-level debugging | `make gdb` |
| QEMU Monitor | VM control and inspection | Press Ctrl+Alt+2 in QEMU |
| Serial Console | Kernel output | Built into `make run` |
| Objdump | Disassemble kernel | `objdump -d build/slay.kernel` |
| Readelf | Examine ELF structure | `readelf -a build/slay.kernel` |
