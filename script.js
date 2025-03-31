class Kernel {
    constructor() {
        this.processes = [
            { pid: 1, name: "init", status: "running", priority: "high", cpu: 0.1, memory: 8 },
            { pid: 2, name: "kerneld", status: "running", priority: "high", cpu: 0.5, memory: 24 },
            { pid: 3, name: "syslogd", status: "running", priority: "medium", cpu: 0.2, memory: 12 },
            { pid: 4, name: "netd", status: "running", priority: "medium", cpu: 0.4, memory: 18 },
            { pid: 5, name: "taskd", status: "waiting", priority: "low", cpu: 0.0, memory: 10 },
            { pid: 6, name: "userd", status: "running", priority: "medium", cpu: 0.3, memory: 22 },
            { pid: 7, name: "shelld", status: "running", priority: "medium", cpu: 0.3, memory: 15 }
        ];
        
        this.modules = [
            { name: "core.js", loaded: true, version: "1.0.0" },
            { name: "memory.js", loaded: true, version: "1.0.0" },
            { name: "process.js", loaded: true, version: "1.0.0" },
            { name: "filesystem.js", loaded: true, version: "1.0.0" },
            { name: "network.js", loaded: true, version: "1.0.0" },
            { name: "security.js", loaded: true, version: "1.0.0" }
        ];
        
        this.threads = [
            { id: 1, pid: 1, name: "init-main", status: "running" },
            { id: 2, pid: 2, name: "kernel-scheduler", status: "running" },
            { id: 3, pid: 2, name: "kernel-io", status: "running" },
            { id: 4, pid: 3, name: "syslog-writer", status: "running" },
            { id: 5, pid: 4, name: "network-listener", status: "running" },
            { id: 6, pid: 4, name: "network-handler", status: "waiting" },
            { id: 7, pid: 6, name: "user-auth", status: "running" },
            { id: 8, pid: 7, name: "shell-main", status: "running" }
        ];
        
        this.startTime = Date.now();
        this.nextPid = 8;
        this.nextThreadId = 9;
        this.systemMemory = 2048; // MB
        this.usedMemory = 109; // MB
        this.cpuUsage = 1.8; // %
        
        setInterval(() => this.updateStats(), 1000);
        setInterval(() => this.simulateSystemActivity(), 5000);
    }
    
    updateStats() {
        document.getElementById('uptime').textContent = this.getUptime();
        
        this.cpuUsage = Math.min(100, Math.max(0.5, this.cpuUsage + (Math.random() - 0.5) * 1.5));
        this.usedMemory = Math.min(this.systemMemory, Math.max(100, this.usedMemory + (Math.random() - 0.5) * 10));
        
        document.getElementById('cpu-usage').textContent = this.cpuUsage.toFixed(1) + '%';
        document.getElementById('memory-usage').textContent = `${Math.floor(this.usedMemory)}MB / ${this.systemMemory}MB`;
        document.getElementById('process-count').textContent = this.processes.length;
    }
    
    getUptime() {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    simulateSystemActivity() {
        this.processes.forEach(process => {
            if (process.pid > 2) { 
                const rand = Math.random();
                if (rand < 0.1) {
                    const newStatus = process.status === "running" ? "waiting" : "running";
                    this.changeProcessStatus(process.pid, newStatus);
                }
            }
        });
        
        this.updateProcessList();
    }
    
    changeProcessStatus(pid, newStatus) {
        const process = this.processes.find(p => p.pid === pid);
        if (process) {
            process.status = newStatus;
            
            this.threads.forEach(thread => {
                if (thread.pid === pid) {
                    thread.status = newStatus;
                }
            });
            
            if (newStatus === "running") {
                process.cpu = Math.random() * 0.5;
                this.cpuUsage += process.cpu;
            } else {
                this.cpuUsage -= process.cpu;
                process.cpu = 0;
            }
        }
    }
    
    updateProcessList() {
        const processList = document.getElementById('process-list');
        processList.innerHTML = '';
        
        this.processes.forEach(process => {
            const div = document.createElement('div');
            div.className = `process-item process-${process.status}`;
            div.setAttribute('data-pid', process.pid);
            div.textContent = `${process.name} (PID: ${process.pid})`;
            processList.appendChild(div);
        });
    }
    
    createProcess(name, priority = "medium") {
        const pid = this.nextPid++;
        const process = {
            pid,
            name,
            status: "running",
            priority,
            cpu: 0.3,
            memory: Math.floor(Math.random() * 10) + 10
        };
        
        this.processes.push(process);
        
        
        const threadId = this.nextThreadId++;
        this.threads.push({
            id: threadId,
            pid,
            name: `${name}-main`,
            status: "running"
        });
        
        this.cpuUsage += process.cpu;
        this.usedMemory += process.memory;
        
        this.updateProcessList();
        
        return process;
    }
    
    killProcess(pid) {
        const index = this.processes.findIndex(p => p.pid === parseInt(pid));
        if (index !== -1) {
            if (pid <= 2) {
                return { success: false, message: "Cannot kill system critical process" };
            }
            
            const process = this.processes[index];
            
            this.processes.splice(index, 1);
            
            this.threads = this.threads.filter(t => t.pid !== parseInt(pid));
            
            this.cpuUsage -= process.cpu;
            this.usedMemory -= process.memory;
            
            this.updateProcessList();
            
            return { success: true, message: `Process ${pid} (${process.name}) terminated` };
        }
        
        return { success: false, message: `Process with PID ${pid} not found` };
    }
    
    createThread(pid, name) {
        const process = this.processes.find(p => p.pid === parseInt(pid));
        if (!process) {
            return { success: false, message: `Process with PID ${pid} not found` };
        }
        
        const threadId = this.nextThreadId++;
        const thread = {
            id: threadId,
            pid: parseInt(pid),
            name,
            status: process.status
        };
        
        this.threads.push(thread);
        process.memory += 3; 
        this.usedMemory += 3;
        
        return { success: true, message: `Thread '${name}' created with ID ${threadId}`, thread };
    }
    
    listThreads(pid = null) {
        if (pid) {
            return this.threads.filter(t => t.pid === parseInt(pid));
        }
        return this.threads;
    }
    
    loadModule(name, version = "1.0.0") {
        if (this.modules.some(m => m.name === name)) {
            return { success: false, message: `Module ${name} already loaded` };
        }
        
        const module = { name, loaded: true, version };
        this.modules.push(module);
        this.usedMemory += 8; 
        
        const moduleList = document.getElementById('module-list');
        const div = document.createElement('div');
        div.className = 'module-item';
        div.textContent = name;
        moduleList.appendChild(div);
        
        return { success: true, message: `Module ${name} v${version} loaded successfully` };
    }
    
    unloadModule(name) {
        const index = this.modules.findIndex(m => m.name === name);
        if (index === -1) {
            return { success: false, message: `Module ${name} not found` };
        }
        
        if (['core.js', 'memory.js', 'process.js'].includes(name)) {
            return { success: false, message: `Cannot unload core module ${name}` };
        }
        
        this.modules.splice(index, 1);
        this.usedMemory -= 8;
        
        const moduleList = document.getElementById('module-list');
        moduleList.innerHTML = '';
        this.modules.forEach(m => {
            const div = document.createElement('div');
            div.className = 'module-item';
            div.textContent = m.name;
            moduleList.appendChild(div);
        });
        
        return { success: true, message: `Module ${name} unloaded successfully` };
    }
}

class Terminal {
    constructor(kernel) {
        this.kernel = kernel;
        this.outputElement = document.getElementById('output');
        this.inputElement = document.getElementById('input');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.setupEventListeners();
        
        this.writeOutput(`

███╗   ███╗███████╗██╗    ██╗███╗   ██╗██╗████████╗██╗   ██╗████████╗███████╗ ██████╗██╗  ██╗
████╗ ████║██╔════╝██║    ██║████╗  ██║██║╚══██╔══╝██║   ██║╚══██╔══╝██╔════╝██╔════╝██║  ██║
██╔████╔██║█████╗  ██║ █╗ ██║██╔██╗ ██║██║   ██║   ██║   ██║   ██║   █████╗  ██║     ███████║
██║╚██╔╝██║██╔══╝  ██║███╗██║██║╚██╗██║██║   ██║   ██║   ██║   ██║   ██╔══╝  ██║     ██╔══██║
██║ ╚═╝ ██║███████╗╚███╔███╔╝██║ ╚████║██║   ██║   ╚██████╔╝   ██║   ███████╗╚██████╗██║  ██║
╚═╝     ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═══╝╚═╝   ╚═╝    ╚═════╝    ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝

                          

MewnityTech Kernel v1.0 for BrowserOS v2.0
Type 'help' for available commands
`, 'info-text');
    }
    
    setupEventListeners() {
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.inputElement.value.trim();
                if (command) {
                    this.processCommand(command);
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                    this.inputElement.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputElement.value = this.commandHistory[this.historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.inputElement.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.commandHistory.length;
                    this.inputElement.value = '';
                }
                e.preventDefault();
            }
        });
        document.getElementById('process-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('process-item')) {
                const pid = e.target.getAttribute('data-pid');
                this.inputElement.value = `ps ${pid}`;
                this.inputElement.focus();
            }
        });
        
        document.getElementById('module-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('module-item')) {
                const moduleName = e.target.textContent;
                this.inputElement.value = `module info ${moduleName}`;
                this.inputElement.focus();
            }
        });
    }
    
    writeOutput(text, className = '') {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = text;
        this.outputElement.appendChild(div);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    
    writeCommandLine(command) {
        const div = document.createElement('div');
        div.className = 'cmd-line';
        div.textContent = `root@progcrafter# ${command}`;
        this.outputElement.appendChild(div);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    
    processCommand(input) {
        this.writeCommandLine(input);
        
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        switch (command) {
            case 'help':
                this.showHelp();
                break;
            case 'ps':
            case 'process':
                this.handleProcessCommand(args);
                break;
            case 'kill':
                this.killProcess(args);
                break;
            case 'thread':
                this.handleThreadCommand(args);
                break;
            case 'module':
                this.handleModuleCommand(args);
                break;
            case 'stats':
                this.showSystemStats();
                break;
            case 'clear':
                this.outputElement.innerHTML = '';
                break;
            case 'exit':
                this.writeOutput('Cannot exit kernel mode. System is running.', 'error-text');
                break;
            case 'echo':
                this.writeOutput(args.join(' '));
                break;
            case 'uptime':
                this.writeOutput(`System uptime: ${this.kernel.getUptime()}`);
                break;
            default:
                this.writeOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error-text');
        }
    }
    
    showHelp() {
        this.writeOutput(`
Available Commands:
help                    - Show this help message
ps, process list        - List all processes
ps <pid>, process info <pid> - Show process details
process create <name>   - Create a new process
kill <pid>              - Terminate a process
thread list [pid]       - List all threads or for specific process
thread create <pid> <name> - Create a new thread for a process
module list             - List loaded modules
module info <name>      - Show module details
module load <name>      - Load a new module
module unload <name>    - Unload a module
stats                   - Show system statistics
uptime                  - Show system uptime
clear                   - Clear terminal output
echo <text>             - Display text
exit                    - Try to exit kernel mode
`, 'info-text');
    }
    
    handleProcessCommand(args) {
        if (!args.length || args[0] === 'list') {
            this.writeOutput('\nProcess List:');
            this.writeOutput('PID\tStatus\t\tName\t\tCPU\tMemory');
            this.writeOutput('------------------------------------------------------');
            
            this.kernel.processes.forEach(proc => {
                this.writeOutput(`${proc.pid}\t${proc.status.padEnd(10)}\t${proc.name.padEnd(10)}\t${proc.cpu.toFixed(1)}%\t${proc.memory}MB`);
            });
        } else if (args[0] === 'create' && args[1]) {
            const name = args[1];
            const priority = args[2] || 'medium';
            const process = this.kernel.createProcess(name, priority);
            this.writeOutput(`Process created: ${process.name} with PID ${process.pid}`, 'success-text');
        } else if (args[0] === 'info' && args[1]) {
            this.showProcessInfo(args[1]);
        } else if (!isNaN(args[0])) {
            this.showProcessInfo(args[0]);
        } else {
            this.writeOutput('Invalid process command. Try "process list", "process info <pid>", or "process create <name>"', 'error-text');
        }
    }
    
    showProcessInfo(pid) {
        const process = this.kernel.processes.find(p => p.pid === parseInt(pid));
        if (process) {
            this.writeOutput(`\nProcess Information - PID: ${process.pid}`);
            this.writeOutput(`Name: ${process.name}`);
            this.writeOutput(`Status: ${process.status}`);
            this.writeOutput(`Priority: ${process.priority}`);
            this.writeOutput(`CPU Usage: ${process.cpu.toFixed(1)}%`);
            this.writeOutput(`Memory Usage: ${process.memory}MB`);
            
            const threads = this.kernel.listThreads(process.pid);
            this.writeOutput(`\nThreads (${threads.length}):`);
            threads.forEach(thread => {
                this.writeOutput(`  Thread ID: ${thread.id}, Name: ${thread.name}, Status: ${thread.status}`);
            });
        } else {
            this.writeOutput(`Process with PID ${pid} not found`, 'error-text');
        }
    }
    
    killProcess(args) {
        if (!args.length) {
            this.writeOutput('Usage: kill <pid>', 'error-text');
            return;
        }
        
        const pid = args[0];
        const result = this.kernel.killProcess(pid);
        
        if (result.success) {
            this.writeOutput(result.message, 'success-text');
        } else {
            this.writeOutput(result.message, 'error-text');
        }
    }
    
    handleThreadCommand(args) {
        if (!args.length || args[0] === 'list') {
            const pid = args[1] ? parseInt(args[1]) : null;
            const threads = this.kernel.listThreads(pid);
            
            if (pid) {
                const process = this.kernel.processes.find(p => p.pid === pid);
                if (!process) {
                    this.writeOutput(`Process with PID ${pid} not found`, 'error-text');
                    return;
                }
                this.writeOutput(`\nThreads for PID ${pid} (${process.name}):`);
            } else {
                this.writeOutput('\nAll Threads:');
            }
            
            this.writeOutput('ID\tPID\tStatus\t\tName');
            this.writeOutput('------------------------------------------------------');
            
            threads.forEach(thread => {
                this.writeOutput(`${thread.id}\t${thread.pid}\t${thread.status.padEnd(10)}\t${thread.name}`);
            });
        } else if (args[0] === 'create' && args[1] && args[2]) {
            const pid = parseInt(args[1]);
            const name = args[2];
            
            const result = this.kernel.createThread(pid, name);
            if (result.success) {
                this.writeOutput(result.message, 'success-text');
            } else {
                this.writeOutput(result.message, 'error-text');
            }
        } else {
            this.writeOutput('Invalid thread command. Try "thread list [pid]" or "thread create <pid> <name>"', 'error-text');
        }
    }
    
    handleModuleCommand(args) {
        if (!args.length || args[0] === 'list') {
            this.writeOutput('\nLoaded Modules:');
            this.writeOutput('Name\t\tVersion\t\tStatus');
            this.writeOutput('------------------------------------------------------');
            
            this.kernel.modules.forEach(module => {
                this.writeOutput(`${module.name.padEnd(10)}\t${module.version.padEnd(10)}\t${module.loaded ? 'Loaded' : 'Unloaded'}`);
            });
        } else if (args[0] === 'info' && args[1]) {
            const name = args[1];
            const module = this.kernel.modules.find(m => m.name === name);
            
            if (module) {
                this.writeOutput(`\nModule: ${module.name}`);
                this.writeOutput(`Version: ${module.version}`);
                this.writeOutput(`Status: ${module.loaded ? 'Loaded' : 'Unloaded'}`);
                
                if (module.name === 'core.js') {
                    this.writeOutput('Description: Core kernel functions and utilities');
                    this.writeOutput('Dependencies: None');
                }
                else if (module.name === 'memory.js') {
                    this.writeOutput('Description: Memory management and allocation');
                    this.writeOutput('Dependencies: core.js');
                }
                else if (module.name === 'process.js') {
                    this.writeOutput('Description: Process scheduling and management');
                    this.writeOutput('Dependencies: core.js, memory.js');
                }
                else if (module.name === 'filesystem.js') {
                    this.writeOutput('Description: Virtual filesystem operations');
                    this.writeOutput('Dependencies: core.js, memory.js');
                }
                else if (module.name === 'network.js') {
                    this.writeOutput('Description: Networking and communication');
                    this.writeOutput('Dependencies: core.js, security.js');
                }
                else if (module.name === 'security.js') {
                    this.writeOutput('Description: Security and access control');
                    this.writeOutput('Dependencies: core.js');
                }
                else {
                    this.writeOutput('Description: Custom module');
                    this.writeOutput('Dependencies: core.js');
                }
            } else {
                this.writeOutput(`Module ${name} not found`, 'error-text');
            }
        } else if (args[0] === 'load' && args[1]) {
            const name = args[1];
            const version = args[2] || "1.0.0";
            
            const result = this.kernel.loadModule(name, version);
            if (result.success) {
                this.writeOutput(result.message, 'success-text');
            } else {
                this.writeOutput(result.message, 'error-text');
            }
        } else if (args[0] === 'unload' && args[1]) {
            const name = args[1];
            
            const result = this.kernel.unloadModule(name);
            if (result.success) {
                this.writeOutput(result.message, 'success-text');
            } else {
                this.writeOutput(result.message, 'error-text');
            }
        } else {
            this.writeOutput('Invalid module command. Try "module list", "module info <name>", "module load <name>", or "module unload <name>"', 'error-text');
        }
    }
    
    showSystemStats() {
        const totalMemoryMB = this.kernel.systemMemory;
        const usedMemoryMB = Math.floor(this.kernel.usedMemory);
        const freeMemoryMB = totalMemoryMB - usedMemoryMB;
        const memoryUsagePercent = ((usedMemoryMB / totalMemoryMB) * 100).toFixed(1);
        
        this.writeOutput('\nSystem Statistics:');
        this.writeOutput(`CPU Usage: ${this.kernel.cpuUsage.toFixed(1)}%`);
        this.writeOutput(`Memory: ${usedMemoryMB}MB / ${totalMemoryMB}MB (${memoryUsagePercent}%)`);
        this.writeOutput(`Free Memory: ${freeMemoryMB}MB`);
        this.writeOutput(`Processes: ${this.kernel.processes.length}`);
        this.writeOutput(`Threads: ${this.kernel.threads.length}`);
        this.writeOutput(`Loaded Modules: ${this.kernel.modules.length}`);
        this.writeOutput(`System Uptime: ${this.kernel.getUptime()}`);
        
        this.writeOutput('\nTop Processes by CPU Usage:');
        const sortedByCPU = [...this.kernel.processes].sort((a, b) => b.cpu - a.cpu).slice(0, 3);
        sortedByCPU.forEach(proc => {
            this.writeOutput(`${proc.name} (PID: ${proc.pid}): ${proc.cpu.toFixed(1)}%`);
        });
        
        this.writeOutput('\nTop Processes by Memory Usage:');
        const sortedByMemory = [...this.kernel.processes].sort((a, b) => b.memory - a.memory).slice(0, 3);
        sortedByMemory.forEach(proc => {
            this.writeOutput(`${proc.name} (PID: ${proc.pid}): ${proc.memory}MB`);
        });
    }
}

const kernel = new Kernel();
const terminal = new Terminal(kernel);

document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('process-item')) {
        const pid = e.target.getAttribute('data-pid');
        const process = kernel.processes.find(p => p.pid === parseInt(pid));
        
        if (process) {
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = `
                <strong>${process.name}</strong><br>
                PID: ${process.pid}<br>
                Status: ${process.status}<br>
                CPU: ${process.cpu.toFixed(1)}%<br>
                Memory: ${process.memory}MB
            `;
            
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('process-item')) {
        document.getElementById('tooltip').style.display = 'none';
    }
});
