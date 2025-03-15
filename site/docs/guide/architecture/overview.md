# SlayerOS Architecture Overview

This document provides a detailed breakdown of the SlayerOS project structure and code from the perspective of a low-level developer. SlayerOS is a simple x86_64 operating system kernel designed with minimalism and efficiency in mind.

## I. Project Structure Overview

### GitHub Configuration
- `.github/`: Contains GitHub Actions configuration files for CI/CD.
  - `.github/codeql/codeql-config.yml`: Configuration for CodeQL, a static analysis tool. Specifies source code paths to analyze (src) and excludes certain directories (limine, libc, drivers). This is important for automatically finding potential bugs and security vulnerabilities in your code.
  - `.github/workflows/build_iso.yml`: A GitHub Actions workflow to automatically build an ISO image of the kernel when code is pushed to the main branch. It also creates a GitHub release when a commit message contains [major].
  - `.github/workflows/codeql.yml`: A GitHub Actions workflow to run CodeQL analysis on the code, triggered on pushes to main, pull requests to main, and scheduled runs.

### Root Directory Files
- `.gitignore`: Specifies intentionally untracked files that Git should ignore. Here, it's ignoring the build/ directory, which is where the compiled kernel and ISO image will be placed.
- `.gitmodules`: Defines Git submodules. This project uses drivers, libc (likely a minimal C standard library), and limine (a bootloader) as submodules. Submodules are a way to include other Git repositories within your project.
- `LICENSE`: The GNU General Public License v3.0. This means the project is open-source and anyone can use, modify, and distribute it, provided they adhere to the terms of the GPL.
- `Makefile`: A build automation file. Defines how to compile the kernel, link it, and create an ISO image. This is the central control point for building the system.
- `README.md`: Provides basic information about the project, instructions for building and running it, project goals, and the license.

### Miscellaneous Files
- `misc/`: Contains miscellaneous files needed for building the kernel.
  - `misc/boot/limine.conf`: Configuration file for the Limine bootloader. Tells the bootloader where to find the kernel.
  - `misc/linkage.ld`: A linker script. Defines how the kernel's object files are linked together to form the final kernel binary. Crucially, it specifies memory layout, section placement (text, data, rodata), and the entry point (_start).
  - `misc/make/base.mk`: A base Makefile fragment. Defines common compiler flags (CFLAGS), linker flags (LDFLAGS), and QEMU options.

### Source Code
- `src/`: Contains the source code for the kernel.
  - `src/include/`: Header files. Declare functions, structures, and constants used throughout the kernel.
    - `arch/`: Architecture-specific headers (x86_64 in this case). `serial.h` defines UART-related functions, and `sse.h` is related to Streaming SIMD Extensions.
    - `bootloader/`: `limine.h` Defines structures and functions for interacting with the Limine bootloader (getting memory map, framebuffer information, etc.).
    - `dbg/`: `log.h` Defines a simple logging system for the kernel.
    - `err/`: `handler.h` Declares structures and functions for handling kernel errors.
    - `host/`: `flags.h` Defines build-time flags, such as the kernel version.
    - `mem/`: Memory management headers. `frames.h` (frame allocator), `heap.h` (heap allocator), `mapper.h` (memory mapping), `paging.h` (paging).
  - `src/kernel/`: Kernel source code.
    - `arch/`: Architecture-specific code (x86_64). `serial.cxx` implements UART (serial port) initialization and I/O. `sse.cxx` Enables the SSE extensions
    - `bootloader/`: `limine.cxx` Code to retrieve bootloader information using the Limine protocol. It populates the boot_ctx structure.
    - `dbg/logger/`: `log.cxx` Implements the logging functions declared in dbg/log.h. It uses the serial port for output.
    - `err/`: `mangle.cxx` Code to demangle C++ symbol names to make tracebacks more readable. `meta_resolver.cxx` Code to resolve addresses of functions to symbol names and back
    - `kern.cxx`: The main kernel file. Contains the `_start` function (kernel entry point) and initialization routines.
    - `mem/`: Memory management implementation. `frames/frames.cxx` (frame allocator), `heap/heap.cxx` (heap allocator), `map/mapper.cxx` (memory mapping), `paging/paging.cxx` (paging).

## II. Key Code Components and Their Functions

### Bootstrapping and Limine (src/bootloader/, misc/boot/)
The kernel relies on the Limine bootloader to load it into memory, set up basic hardware, and provide information (memory map, framebuffer, etc.).
- `misc/boot/limine.conf`: Specifies where the kernel is located on the ISO image.
- `src/bootloader/limine.h/cxx`: Defines structures to hold bootloader information and functions to retrieve it. The `BootloaderCtx` structure stores crucial data.
- **Limine Protocol**: The code interacts with the Limine bootloader using specific "requests" (e.g., `limine_memmap_request`). These requests are placed in special sections in the kernel binary. When Limine loads the kernel, it recognizes these requests, processes them, and populates the corresponding responses.

### Memory Management (src/mem/)
This is fundamental to any OS kernel.

#### Paging (src/mem/paging.h/cxx)
Implements virtual memory using paging. This allows the kernel to use more memory than physically available and provides memory protection.
- `Paging::init()`: Initializes the paging system. It allocates a PML4 table and sets up mappings.
- `Paging::map(phys, virt, flags)`: Maps a physical address (phys) to a virtual address (virt) with the specified flags (present, writable, user/kernel, etc.).
- Uses multi-level page tables (PML4, PML3, PML2, PML1) for address translation.

#### Frame Allocator (src/mem/frames.h/cxx)
Manages physical memory frames (fixed-size blocks of physical memory).
- `Frame::init()`: Initializes the frame allocator. It uses the memory map provided by Limine to determine available physical memory. It creates a bitmap (frames) to track which frames are free and which are allocated.
- `Frame::alloc()`: Allocates a single free frame.
- `Frame::free(frame)`: Frees a previously allocated frame.

#### Heap Allocator (src/mem/heap.h/cxx)
Provides dynamic memory allocation within the kernel (like malloc in userspace). It's built on top of the frame allocator.
- `kmalloc(size)`: Allocates a block of memory of the specified size from the kernel heap.
- `kfree(addr)`: Frees a block of memory previously allocated with kmalloc.
- Uses heap pages (`heap_page_t`) and segments (`heap_segment_t`) to manage the heap.

#### Memory Mapper (src/mem/mapper.h/cxx)
Responsible for creating initial memory mappings.
- `Mapper::full_map()`: Creates all initial mappings, which might include:
  - Mapping the kernel's text, rodata, and data sections.
  - Mapping the Higher Half Direct Map (HHDM), which allows the kernel to directly access physical memory.
  - Mapping framebuffer memory.
  - Mapping bootloader-reclaimable memory.

### Architecture (src/arch/)
- `serial.h/cxx`: Provides functions for serial port (UART) I/O. This is often used for early-stage debugging and logging. The code uses inline assembly (`__asm__ __volatile__`) to directly access I/O ports.
- `sse.h/cxx`: Check for SSE support, enabling it if possible

### Kernel Entry Point (src/kernel/kern.cxx)
- `_start()`: The very first function executed by the kernel after the bootloader loads it.
- `_kernel_start()`: A C++ function called from `_start()`. It performs kernel initialization:
  - Initializes the UART for logging.
  - Collects bootloader information.
  - Initializes the frame allocator.
  - Initializes the paging system.
  - Initializes framebuffer for graphics output.
  - Runs some basic tests.

After initialization, the kernel enters an infinite loop (`for(;;);`).

### Debugging (src/dbg/)
- `log.h/cxx`: Defines a simple logging system for the kernel. It uses printf-like functions to format output and sends it to the serial port. Uses ANSI escape codes for colored output.

### Error Handling (src/err/)
- `handler.h/cxx`: Code to parse ELF files and resolve addresses of functions

## III. Makefile Breakdown

The Makefile is crucial for automating the build process. Here's a breakdown of some of the key parts:

### Variables
Defines variables for compiler flags, linker flags, source directories, object directories, etc. This makes the Makefile more maintainable.

### Submodule Management
```makefile
$(LIMINE_MAKEFILE):
	git submodule update --init --recursive
```
This ensures that the Limine, libc, and drivers submodules are initialized and updated.

### Compilation Rules
```makefile
$(OBJ_DIR)/%.o: $(KERNEL_SRC)/%.cxx
	@mkdir -p $(@D)
	$(CXX) $(CFLAGS) $(INCLUDES) -c -o $@ $<
```
This is a pattern rule. It says that to build an object file (.o) in the OBJ_DIR from a corresponding C++ source file (.cxx) in the KERNEL_SRC, use the C++ compiler ($(CXX)) with the specified flags ($(CFLAGS), $(INCLUDES)). The -c flag tells the compiler to compile only (not link). The $@ is an automatic variable representing the target file, and $< represents the prerequisite file.

### Linking Rule
```makefile
$(KERNEL_BIN): $(LIBC_LIB) $(DRIVERS_LIB) $(KERN_OBJECTS)
	$(LD) $(KERN_LDFLAGS) -o $(KERNEL_BIN) $(KERN_OBJECTS) $(DRIVERS_LIB) $(LIBC_LIB)
```
This rule links all the kernel object files, the libc library, and the drivers library together to create the final kernel binary ($(KERNEL_BIN)). The linker ($(LD)) uses the linker script ($(LINKER_SCRIPT)) to determine the memory layout.

### ISO Image Creation
```makefile
$(ISO_FILE): $(LIMINE_BIN) $(KERNEL_BIN)
	mkdir -p $(ISO_DIR)/boot/limine
	mkdir -p $(ISO_DIR)/EFI/BOOT

	cp $(KERNEL_BIN) $(ISO_DIR)/boot/slay.kernel
	cp -v $(LIMINE_CFG) $(LIMINE_DIR)/limine-bios.sys $(LIMINE_DIR)/limine-bios-cd.bin $(LIMINE_DIR)/limine-uefi-cd.bin $(ISO_DIR)/boot/limine
	cp -v $(LIMINE_DIR)/BOOTX64.EFI $(LIMINE_DIR)/BOOTIA32.EFI $(ISO_DIR)/EFI/BOOT
	xorriso -as mkisofs -R -r -J -b boot/limine/limine-bios-cd.bin \
		-no-emul-boot -boot-load-size 4 -boot-info-table -hfsplus \
		-apm-block-size 2048 --efi-boot boot/limine/limine-uefi-cd.bin \
		-efi-boot-part --efi-boot-image --protective-msdos-label \
		$(ISO_DIR) -o $@
	$(LIMINE_BIN) bios-install $@
```
This rule creates the ISO image. It copies the kernel, Limine bootloader files, and configuration into a directory structure and then uses xorriso to create the ISO image. It also installs the Limine bootloader into the ISO.

### QEMU Rules
```makefile
run: $(ISO_FILE)
	qemu-system-x86_64 $(QEMU_ARGS) $(QEMU_OPT) -cdrom $(ISO_FILE)
```
These rules define how to run the kernel in QEMU. The run target runs the kernel without debugging. debug starts QEMU in debug mode, and gdb starts the GDB debugger.

## IV. Low-Level Considerations

- **-ffreestanding**: This compiler flag is essential for kernel development. It tells the compiler that the code doesn't rely on a standard C library or operating system environment. Everything the kernel needs must be provided explicitly.
- **-nostdlib**: This linker flag tells the linker not to link against the standard C library. Again, this is because the kernel provides its own minimal runtime environment.
- **Linker Script**: The `linkage.ld` file is critical. It defines the memory layout of the kernel. The `.text` section contains the executable code, the `.rodata` section contains read-only data, and the `.data` section contains initialized data. The linker script also specifies the entry point (`_start`) of the kernel. The virtual base is very important since this tells the kernel where it will be placed in memory.
- **Inline Assembly**: The `serial.cxx` file uses inline assembly to directly access I/O ports for serial communication. This is a common technique in low-level programming when you need to interact directly with hardware.
- **Virtual and Physical Addresses**: The kernel deals with both virtual and physical addresses. Virtual addresses are used by the kernel code, while physical addresses refer to actual memory locations. The paging system translates virtual addresses to physical addresses. The `PHYS2VIRT` and `VIRT2PHYS` macros are used to convert between physical and virtual addresses.
- **Memory Mapping**: The kernel must carefully map physical memory to virtual memory so that it can access hardware, data, and code. The `Mem::Paging::map()` function is used to create these mappings.
- **Bootloader Reliance**: The kernel relies heavily on the bootloader (Limine) to set up the initial environment (memory map, etc.). The kernel must use the information provided by the bootloader to properly initialize itself.
- **Frame Allocation**: The frame allocator takes a chunk of memory and divides it into frames, these frames act as a paging cache allowing memory to be managed effectively.

## V. Potential Areas for Improvement/Further Investigation

- **Error Handling**: The kernel's error handling is currently very basic. A more robust error handling system (e.g., panic handler, exception handling) would be beneficial.
- **Interrupts**: Interrupt handling is not yet implemented. This is essential for interacting with hardware devices.
- **Drivers**: The project includes a drivers submodule, but there's no driver code in the provided files. Writing drivers for devices like the keyboard, mouse, and graphics card would be a major step forward.
- **Filesystem**: There is no filesystem so there is no way to persist data, it is all in RAM.
- **Testing**: More robust unit tests for the kernel would be beneficial.