# Build Configuration

This document explains the build configuration options available for SlayerOS. These settings control how the operating system is compiled and linked.

## Makefile Options

The main `Makefile` supports several variables that can be set to customize the build:

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Enable debug build | 0 (disabled) |
| `OPT_LEVEL` | Optimization level (0-3) | 2 |
| `WARNINGS` | Warning level | all |
| `QEMU_EXTRA` | Extra QEMU options | (empty) |

### Example Usage

```bash
# Build with debug symbols and no optimization
make DEBUG=1 OPT_LEVEL=0

# Build with maximum optimization
make OPT_LEVEL=3

# Run with extra QEMU options
make run QEMU_EXTRA="-m 2G -smp 4"
```

## Base Makefile Configuration

The `misc/make/base.mk` file defines common build settings:

```makefile
# Compiler selection
CC = x86_64-elf-gcc
CXX = x86_64-elf-g++
LD = x86_64-elf-ld
AS = nasm

# Base flags
CFLAGS = -ffreestanding -O$(OPT_LEVEL) -Wall -Wextra -std=c11
CXXFLAGS = -ffreestanding -O$(OPT_LEVEL) -Wall -Wextra -std=c++17 -fno-exceptions -fno-rtti
LDFLAGS = -nostdlib
ASFLAGS = -f elf64
```

## Compiler Flags

### C/C++ Compiler Flags

| Flag | Description |
|------|-------------|
| `-ffreestanding` | Compile for a freestanding environment (no standard library) |
| `-O$(OPT_LEVEL)` | Optimization level |
| `-Wall -Wextra` | Enable comprehensive warnings |
| `-std=c++17` | Use C++17 standard |
| `-fno-exceptions` | Disable C++ exceptions |
| `-fno-rtti` | Disable runtime type information |
| `-g` | Include debug symbols (when DEBUG=1) |
| `-D_DEBUG` | Define _DEBUG macro (when DEBUG=1) |

### Assembler Flags

| Flag | Description |
|------|-------------|
| `-f elf64` | Output ELF64 format |

### Linker Flags

| Flag | Description |
|------|-------------|
| `-nostdlib` | Don't use standard system startup files or libraries |
| `-T $(LINKER_SCRIPT)` | Use the specified linker script |

## Linker Script

The `misc/linkage.ld` script controls how the kernel is linked:

```
SECTIONS
{
    . = KERNEL_VIRT_BASE + KERNEL_PHYS_BASE;
    
    .text : AT(ADDR(.text) - KERNEL_VIRT_BASE)
    {
        *(.text*)
    }
    
    /* Other sections... */
}
```

Key aspects of the linker script:
- Places the kernel at the correct virtual address
- Organizes sections (.text, .rodata, .data, .bss)
- Sets up the entry point (_start)

## ISO Configuration

The ISO build process is configured in the Makefile:

```makefile
$(ISO_FILE): $(LIMINE_BIN) $(KERNEL_BIN)
	mkdir -p $(ISO_DIR)/boot/limine
	mkdir -p $(ISO_DIR)/EFI/BOOT
	cp $(KERNEL_BIN) $(ISO_DIR)/boot/slay.kernel
	cp -v $(LIMINE_CFG) $(LIMINE_DIR)/limine-bios.sys $(LIMINE_DIR)/limine-bios-cd.bin $(LIMINE_DIR)/limine-uefi-cd.bin $(ISO_DIR)/boot/limine
	cp -v $(LIMINE_DIR)/BOOTX64.EFI $(LIMINE_DIR)/BOOTIA32.EFI $(ISO_DIR)/EFI/BOOT
	xorriso -as mkisofs -b boot/limine/limine-bios-cd.bin \
		-no-emul-boot -boot-load-size 4 -boot-info-table \
		--efi-boot boot/limine/limine-uefi-cd.bin \
		-efi-boot-part --efi-boot-image --protective-msdos-label \
		$(ISO_DIR) -o $@
	$(LIMINE_BIN) bios-install $@
```

## Customizing the Build

### Adding New Source Files

When adding new source files, the build system automatically detects them:

```makefile
SOURCE_FILES = $(shell find $(KERNEL_SRC) -name "*.cxx")
OBJECT_FILES = $(patsubst $(KERNEL_SRC)/%.cxx,$(OBJ_DIR)/%.o,$(SOURCE_FILES))
```

### Adding New Include Directories

To add a new include directory:

```makefile
INCLUDES += -I/path/to/new/include
```

### Creating Custom Build Targets

You can add custom build targets to the Makefile:

```makefile
custom_target: $(KERNEL_BIN)
	@echo "Running custom build steps..."
	# Custom commands here
```

## Best Practices

1. Use `make clean` before changing build options
2. Start with debug builds during development
3. Use optimized builds for performance testing
4. Document any custom build configurations
5. Use version control to track build configuration changes