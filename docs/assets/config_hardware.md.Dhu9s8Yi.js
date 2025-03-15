import{_ as s,c as a,o as e,ag as n}from"./chunks/framework.DPDPlp3K.js";const c=JSON.parse('{"title":"Hardware Support Configuration","description":"","frontmatter":{},"headers":[],"relativePath":"config/hardware.md","filePath":"config/hardware.md"}'),t={name:"config/hardware.md"};function h(l,i,r,p,o,k){return e(),a("div",null,i[0]||(i[0]=[n(`<h1 id="hardware-support-configuration" tabindex="-1">Hardware Support Configuration <a class="header-anchor" href="#hardware-support-configuration" aria-label="Permalink to &quot;Hardware Support Configuration&quot;">​</a></h1><p>This document explains how to configure SlayerOS for different hardware platforms and devices. Proper hardware configuration is essential for optimal performance and compatibility.</p><h2 id="supported-hardware" tabindex="-1">Supported Hardware <a class="header-anchor" href="#supported-hardware" aria-label="Permalink to &quot;Supported Hardware&quot;">​</a></h2><p>SlayerOS currently supports the following hardware:</p><ul><li><strong>CPU Architecture</strong>: x86_64 (64-bit)</li><li><strong>Boot</strong>: BIOS and UEFI via Limine bootloader</li><li><strong>Graphics</strong>: VESA/VBE framebuffer</li><li><strong>Input</strong>: PS/2 keyboard and mouse</li><li><strong>Storage</strong>: Basic ATA/IDE support</li><li><strong>Serial</strong>: 16550 UART</li></ul><h2 id="cpu-configuration" tabindex="-1">CPU Configuration <a class="header-anchor" href="#cpu-configuration" aria-label="Permalink to &quot;CPU Configuration&quot;">​</a></h2><h3 id="x86-64-features" tabindex="-1">x86_64 Features <a class="header-anchor" href="#x86-64-features" aria-label="Permalink to &quot;x86_64 Features&quot;">​</a></h3><p>You can configure which CPU features to use in <code>src/kernel/arch/cpu.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// CPU feature configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_SSE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // Streaming SIMD Extensions</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_AVX</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // Advanced Vector Extensions</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_XSAVE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Extended State Save/Restore</span></span></code></pre></div><h3 id="smp-configuration" tabindex="-1">SMP Configuration <a class="header-anchor" href="#smp-configuration" aria-label="Permalink to &quot;SMP Configuration&quot;">​</a></h3><p>Symmetric Multiprocessing can be configured in <code>src/kernel/arch/smp.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// SMP configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MAX_CPUS</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 16</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Maximum number of CPU cores supported</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SMP_ENABLED</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // Enable SMP support</span></span></code></pre></div><h2 id="memory-configuration" tabindex="-1">Memory Configuration <a class="header-anchor" href="#memory-configuration" aria-label="Permalink to &quot;Memory Configuration&quot;">​</a></h2><h3 id="physical-memory" tabindex="-1">Physical Memory <a class="header-anchor" href="#physical-memory" aria-label="Permalink to &quot;Physical Memory&quot;">​</a></h3><p>Configure physical memory limits in <code>src/include/host/flags.h</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Physical memory configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MAX_PHYSICAL_MEMORY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (4ULL * 1024 * 1024 * 1024)</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 4GB max physical memory</span></span></code></pre></div><h3 id="virtual-memory" tabindex="-1">Virtual Memory <a class="header-anchor" href="#virtual-memory" aria-label="Permalink to &quot;Virtual Memory&quot;">​</a></h3><p>Configure virtual memory layout in <code>misc/linkage.ld</code> and <code>src/mem/paging.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Virtual memory layout</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> KERNEL_VIRT_BASE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FFFFFFFF80000000</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // Kernel base address</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> KERNEL_HEAP_START</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">FFFFFFFFA0000000</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // Kernel heap start</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USER_SPACE_END</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">00007FFFFFFFFFFF</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // User space end</span></span></code></pre></div><h2 id="graphics-configuration" tabindex="-1">Graphics Configuration <a class="header-anchor" href="#graphics-configuration" aria-label="Permalink to &quot;Graphics Configuration&quot;">​</a></h2><h3 id="framebuffer" tabindex="-1">Framebuffer <a class="header-anchor" href="#framebuffer" aria-label="Permalink to &quot;Framebuffer&quot;">​</a></h3><p>Configure framebuffer settings in <code>src/drivers/fb_gfx/fb_driver.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Default framebuffer settings (fallback if bootloader doesn&#39;t provide)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DEFAULT_FB_WIDTH</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 800</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DEFAULT_FB_HEIGHT</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 600</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DEFAULT_FB_BPP</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 32</span></span></code></pre></div><h2 id="input-device-configuration" tabindex="-1">Input Device Configuration <a class="header-anchor" href="#input-device-configuration" aria-label="Permalink to &quot;Input Device Configuration&quot;">​</a></h2><h3 id="keyboard" tabindex="-1">Keyboard <a class="header-anchor" href="#keyboard" aria-label="Permalink to &quot;Keyboard&quot;">​</a></h3><p>Configure keyboard settings in <code>src/drivers/kbd/keyboard.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Keyboard configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> KEYBOARD_BUFFER_SIZE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 16</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // Size of keyboard input buffer</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_US_LAYOUT</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          // Use US keyboard layout</span></span></code></pre></div><h2 id="storage-configuration" tabindex="-1">Storage Configuration <a class="header-anchor" href="#storage-configuration" aria-label="Permalink to &quot;Storage Configuration&quot;">​</a></h2><h3 id="disk-controllers" tabindex="-1">Disk Controllers <a class="header-anchor" href="#disk-controllers" aria-label="Permalink to &quot;Disk Controllers&quot;">​</a></h3><p>Configure disk controller support in <code>src/drivers/storage/ata.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ATA/IDE configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> PRIMARY_ATA_BASE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1F0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // Primary ATA controller base I/O port</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SECONDARY_ATA_BASE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">170</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // Secondary ATA controller base I/O port</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ATA_IDENTIFY_TIMEOUT</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1000</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // Timeout for ATA identify command (ms)</span></span></code></pre></div><h2 id="serial-port-configuration" tabindex="-1">Serial Port Configuration <a class="header-anchor" href="#serial-port-configuration" aria-label="Permalink to &quot;Serial Port Configuration&quot;">​</a></h2><p>Configure serial port settings in <code>src/kernel/arch/serial.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Serial port configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> COM1_PORT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3F8</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          // COM1 base port</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> COM2_PORT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 0x</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2F8</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          // COM2 base port</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SERIAL_BAUD_RATE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 115200</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // Baud rate</span></span></code></pre></div><h2 id="hardware-detection" tabindex="-1">Hardware Detection <a class="header-anchor" href="#hardware-detection" aria-label="Permalink to &quot;Hardware Detection&quot;">​</a></h2><p>SlayerOS performs hardware detection during boot:</p><ol><li><strong>CPU Features</strong>: Detected using CPUID instruction</li><li><strong>Memory Map</strong>: Provided by bootloader</li><li><strong>Devices</strong>: Basic detection for common devices</li></ol><p>You can configure detection behavior in <code>src/kernel/kern.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Hardware detection configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DETECT_ACPI</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">            // Detect ACPI tables</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DETECT_PCI</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             // Scan PCI bus</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> VERBOSE_DETECTION</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // Verbose hardware detection</span></span></code></pre></div><h2 id="hardware-specific-optimizations" tabindex="-1">Hardware-Specific Optimizations <a class="header-anchor" href="#hardware-specific-optimizations" aria-label="Permalink to &quot;Hardware-Specific Optimizations&quot;">​</a></h2><h3 id="cache-configuration" tabindex="-1">Cache Configuration <a class="header-anchor" href="#cache-configuration" aria-label="Permalink to &quot;Cache Configuration&quot;">​</a></h3><p>Configure cache usage in <code>src/mem/cache.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Cache configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_WRITE_COMBINING</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Use write-combining for framebuffer</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CACHE_LINE_SIZE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 64</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       // CPU cache line size in bytes</span></span></code></pre></div><h3 id="i-o-configuration" tabindex="-1">I/O Configuration <a class="header-anchor" href="#i-o-configuration" aria-label="Permalink to &quot;I/O Configuration&quot;">​</a></h3><p>Configure I/O access methods in <code>src/kernel/arch/io.cxx</code>:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// I/O configuration</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_MMIO_WHEN_AVAILABLE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // Prefer MMIO over port I/O when available</span></span></code></pre></div><h2 id="testing-hardware-compatibility" tabindex="-1">Testing Hardware Compatibility <a class="header-anchor" href="#testing-hardware-compatibility" aria-label="Permalink to &quot;Testing Hardware Compatibility&quot;">​</a></h2><p>To test hardware compatibility:</p><ol><li><p>Build SlayerOS with verbose logging enabled:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">make</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> DEBUG=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> VERBOSE=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span></code></pre></div></li><li><p>Run in QEMU with various hardware configurations:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">make</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> QEMU_EXTRA=&quot;-cpu host -smp 2&quot;</span></span></code></pre></div></li><li><p>Check serial output for hardware detection messages</p></li></ol><h2 id="hardware-configuration-examples" tabindex="-1">Hardware Configuration Examples <a class="header-anchor" href="#hardware-configuration-examples" aria-label="Permalink to &quot;Hardware Configuration Examples&quot;">​</a></h2><h3 id="minimal-hardware-configuration" tabindex="-1">Minimal Hardware Configuration <a class="header-anchor" href="#minimal-hardware-configuration" aria-label="Permalink to &quot;Minimal Hardware Configuration&quot;">​</a></h3><p>For minimal systems or maximum compatibility:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_SSE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SMP_ENABLED</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DETECT_ACPI</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> DETECT_PCI</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span></code></pre></div><h3 id="modern-hardware-configuration" tabindex="-1">Modern Hardware Configuration <a class="header-anchor" href="#modern-hardware-configuration" aria-label="Permalink to &quot;Modern Hardware Configuration&quot;">​</a></h3><p>For modern systems with full feature support:</p><div class="language-cpp vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_SSE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_AVX</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SMP_ENABLED</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MAX_CPUS</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 32</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">#define</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> USE_WRITE_COMBINING</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li>Start with conservative hardware settings for maximum compatibility</li><li>Test thoroughly when enabling advanced hardware features</li><li>Provide fallback mechanisms for hardware that lacks certain features</li><li>Document hardware requirements for your specific configuration</li></ol>`,58)]))}const g=s(t,[["render",h]]);export{c as __pageData,g as default};
