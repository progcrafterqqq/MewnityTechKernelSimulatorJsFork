# ProgCrafter Kernel

A browser-based terminal simulation that mimics a Unix-like kernel interface with process management, thread handling, and system monitoring capabilities.

## Overview

ProgCrafter Kernel is a purely client-side JavaScript application that simulates a terminal interface for interacting with an operating system kernel. It provides a realistic environment for exploring system administration concepts without any actual system modifications.

### Features

- **Process Management**: Create, monitor, and terminate processes
- **Thread Management**: Create and view threads associated with processes
- **Module System**: Load, unload, and inspect kernel modules
- **Resource Monitoring**: Real-time CPU and memory usage statistics
- **Command History**: Navigate through previously entered commands
- **Terminal Interface**: Authentic terminal experience with color-coded output

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server requirements - runs entirely in the browser

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ProgCrafterq/progcrafter-kernel.git
   ```

## Usage

The application simulates a kernel terminal with the following commands:

### Process Commands

- `ps`, `process list` - List all processes
- `ps <pid>`, `process info <pid>` - Show details for a specific process
- `process create <name> [priority]` - Create a new process
- `kill <pid>` - Terminate a process

### Thread Commands

- `thread list [pid]` - List all threads or threads for a specific process
- `thread create <pid> <name>` - Create a new thread for a process

### Module Commands

- `module list` - List all loaded modules
- `module info <name>` - Show details for a specific module
- `module load <name> [version]` - Load a new module
- `module unload <name>` - Unload a module

### System Commands

- `stats` - Display system statistics
- `uptime` - Show system uptime
- `clear` - Clear the terminal
- `help` - Display available commands
- `echo <text>` - Display text in the terminal

## Technical Details

The application consists of two main JavaScript classes:

1. **Kernel**: Simulates system processes, threads, modules, and resources
2. **Terminal**: Handles command input/output and user interaction

The system dynamically updates statistics and occasionally changes process statuses to simulate a live environment.

## Customization

You can customize the appearance by modifying the CSS variables in the `:root` selector:

```css
:root {
    --bg-color: #0a0a0a;
    --text-color: #33ff33;
    --accent-color: #007acc;
    /* Additional variables */
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- File system navigation and operations
- Network simulation with packet monitoring
- User management and permissions
- Process signals and communication
- Performance charts and visualizations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Unix/Linux terminal interfaces
- Built with vanilla JavaScript, HTML, and CSS
