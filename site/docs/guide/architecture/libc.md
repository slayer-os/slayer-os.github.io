# Custom LibC Implementation

SlayerOS includes a minimal, freestanding C++ standard library designed specifically for kernel development. This document explains the key components and design considerations of this custom LibC implementation.

## Overview

The SlayerOS LibC provides essential functionality without relying on any operating system services, making it suitable for bare-metal environments. It implements core C/C++ library functions while maintaining a small footprint.

## Key Components

### Core String Functions

The library provides fundamental string manipulation functions:

```cpp
// Basic string operations
void* memcpy(void* dest, const void* src, size_t n);
void* memset(void* s, int c, size_t n);
size_t strlen(const char* s);
int strcmp(const char* s1, const char* s2);

// Formatted output
int sprintf(char* str, const char* format, ...);
int vsprintf(char* str, const char* format, va_list args);
```

These functions form the foundation for text processing and debugging output in the kernel.

### Memory Management

Custom memory allocation functions replace the standard malloc/free:

```cpp
void* kmalloc(size_t size);
void kfree(void* ptr);
```

These functions interface with the kernel's memory management system rather than using OS-provided allocation.

### Type Definitions

The library defines standard types for consistent cross-platform development:

```cpp
typedef unsigned char      u8;
typedef unsigned short     u16;
typedef unsigned int       u32;
typedef unsigned long long u64;

typedef signed char        i8;
typedef signed short       i16;
typedef signed int         i32;
typedef signed long long   i64;
```

### Assertion Support

Debug assertions help catch programming errors early:

```cpp
#ifdef DEBUG
#define assert(condition, message) /* implementation */
#else
#define assert(condition, message) /* empty */
#endif
```

### Extended Integer Arithmetic

The library implements 512-bit unsigned integers for cryptographic operations:

```cpp
class u512 {
    u64 parts[8];
public:
    // Constructors
    u512();
    u512(u64 value);
    
    // Arithmetic operators
    u512 operator+(const u512& other) const;
    u512 operator-(const u512& other) const;
    u512 operator*(const u512& other) const;
    u512 operator/(const u512& other) const;
    
    // Modular arithmetic
    u512 expmod(const u512& exponent, const u512& modulus) const;
};
```

### ELF Parsing

Functions for parsing ELF (Executable and Linkable Format) files:

```cpp
struct elf_desc {
    Elf64_Ehdr* header;
    Elf64_Phdr* program_headers;
    Elf64_Shdr* section_headers;
    Elf64_Sym* symbols;
    char* strtab;
    size_t symbol_count;
};

int elf_parse(void* elf_data, elf_desc* desc);
```

This functionality supports dynamic loading and debugging capabilities.

### C++ Support

The library provides C++ runtime support for the freestanding environment:

```cpp
// Global operators for dynamic memory allocation
void* operator new(size_t size);
void* operator new[](size_t size);
void operator delete(void* ptr);
void operator delete[](void* ptr);
```

### Cryptography

Basic RSA implementation for encryption and decryption:

```cpp
namespace crypto {
    namespace rsa {
        void generate_keypair(u512& n, u512& e, u512& d);
        u512 encrypt(const u512& message, const u512& e, const u512& n);
        u512 decrypt(const u512& ciphertext, const u512& d, const u512& n);
    }
}
```

## Building the Library

The LibC is compiled as a static library (`libc.a`) using a custom Makefile with specific flags for freestanding environments:

```makefile
CFLAGS = -ffreestanding -O2 -Wall -Wextra -fno-exceptions -fno-rtti
LDFLAGS = -nostdlib
```

Key flags:
- `-ffreestanding`: Indicates code runs without OS support
- `-fno-exceptions`: Disables C++ exception handling
- `-fno-rtti`: Disables runtime type information
- `-nostdlib`: Prevents linking against standard libraries

## Freestanding Considerations

### No OS Dependencies

The library avoids any calls to operating system services:
- No file I/O functions
- No dynamic memory from the OS
- No process or thread management
- No environment variables

### Hardware Abstraction

When hardware interaction is necessary, the library uses:
- Inline assembly for direct hardware access
- Memory-mapped I/O for device communication
- Platform-specific code isolated in dedicated modules

### ABI Compatibility

The library maintains careful ABI (Application Binary Interface) compatibility:
- Consistent calling conventions
- Proper stack alignment
- Correct parameter passing
- Standardized return value handling

## Current Limitations

The current implementation has several areas for improvement:

1. **Incomplete DWARF Support**: The DWARF debugging format parser is planned but not yet implemented
2. **Limited Math Functions**: Only basic math operations are available
3. **Memory Allocator Dependencies**: Relies on external `kmalloc`/`kfree` implementations
4. **Partial RSA Implementation**: Cryptography functions need completion

## Use Cases

This LibC implementation is ideal for:

- Operating system kernel development
- Embedded systems with limited resources
- Bootloaders requiring minimal C/C++ support
- Educational projects exploring low-level programming

## Best Practices

When using this library:

1. Avoid assumptions about standard library behavior
2. Test thoroughly as implementations may differ from standard libc
3. Be mindful of memory management (no garbage collection)
4. Use assertions liberally to catch errors early
5. Consider performance implications of string and memory operations