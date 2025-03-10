import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([{ text: 'Welcome to Terminal. Type "help" to see available commands.', isCommand: false }]);
  const [currentDirectory, setCurrentDirectory] = useState('/home/user');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // File system simulation - flat structure with paths as keys
  const [fileSystem, setFileSystem] = useState({
    '/home/user': { type: 'directory', contents: ['documents', 'pictures', 'projects', 'hello.txt'] },
    '/home/user/documents': { type: 'directory', contents: ['resume.pdf', 'notes.txt'] },
    '/home/user/pictures': { type: 'directory', contents: ['vacation', 'profile.png'] },
    '/home/user/pictures/vacation': { type: 'directory', contents: ['beach.jpg', 'mountain.jpg'] },
    '/home/user/projects': { type: 'directory', contents: ['webapp'] },
    '/home/user/projects/webapp': { type: 'directory', contents: ['index.html', 'styles.css', 'app.js'] },
    '/home/user/hello.txt': { type: 'file', size: '1 KB' },
    '/home/user/documents/resume.pdf': { type: 'file', size: '245 KB' },
    '/home/user/documents/notes.txt': { type: 'file', size: '12 KB' },
    '/home/user/pictures/profile.png': { type: 'file', size: '350 KB' },
    '/home/user/pictures/vacation/beach.jpg': { type: 'file', size: '1.2 MB' },
    '/home/user/pictures/vacation/mountain.jpg': { type: 'file', size: '950 KB' },
    '/home/user/projects/webapp/index.html': { type: 'file', size: '5 KB' },
    '/home/user/projects/webapp/styles.css': { type: 'file', size: '2 KB' },
    '/home/user/projects/webapp/app.js': { type: 'file', size: '15 KB' }
  });
  
  // Focus input on mount and on click
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  const handleTerminalClick = () => {
    inputRef.current.focus();
  };
  
  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    // Don't do anything for empty input
    if (!trimmedInput) return;
    
    // Add command to history display
    setHistory([...history, { text: `${currentDirectory} $ ${trimmedInput}`, isCommand: true }]);
    
    // Add command to command history for up/down arrow navigation
    setCommandHistory([...commandHistory, trimmedInput]);
    setHistoryIndex(-1);
    
    // Process command
    const [command, ...args] = trimmedInput.split(' ');
    processCommand(command.toLowerCase(), args);
    
    // Clear input
    setInput('');
  };
  
  // Resolve path (handle relative, absolute, and special paths)
  const resolvePath = (path) => {
    // Handle empty path
    if (!path) return currentDirectory;
    
    // Handle home directory
    if (path === '~') return '/home/user';
    if (path.startsWith('~/')) return '/home/user/' + path.substring(2);
    
    // Handle absolute path
    if (path.startsWith('/')) return path;
    
    // Handle relative path
    let resolvedPath = currentDirectory;
    if (!resolvedPath.endsWith('/')) resolvedPath += '/';
    resolvedPath += path;
    
    // Normalize path (handle .. and .)
    const parts = resolvedPath.split('/').filter(Boolean);
    const normalizedParts = [];
    
    for (const part of parts) {
      if (part === '..') {
        normalizedParts.pop();
      } else if (part !== '.') {
        normalizedParts.push(part);
      }
    }
    
    return '/' + normalizedParts.join('/');
  };
  
  const processCommand = (command, args) => {
    switch (command) {
      case 'ls':
        handleLs(args);
        break;
      case 'cd':
        handleCd(args);
        break;
      case 'pwd':
        handlePwd();
        break;
      case 'clear':
        handleClear();
        break;
      case 'help':
        handleHelp();
        break;
      case 'cat':
        handleCat(args);
        break;
      case 'mkdir':
        handleMkdir(args);
        break;
      case 'touch':
        handleTouch(args);
        break;
      default:
        setHistory([...history, { 
          text: `Command not found: ${command}. Type "help" to see available commands.`, 
          isCommand: false 
        }]);
    }
  };
  
  const handleLs = (args) => {
    let targetPath = currentDirectory;
    
    if (args.length > 0) {
      targetPath = resolvePath(args[0]);
    }
    
    // Check if directory exists
    if (!fileSystem[targetPath]) {
      setHistory([...history, { text: `ls: cannot access '${args[0]}': No such file or directory`, isCommand: false }]);
      return;
    }
    
    // Check if it's a directory
    if (fileSystem[targetPath].type !== 'directory') {
      setHistory([...history, { text: `ls: cannot access '${args[0]}': Not a directory`, isCommand: false }]);
      return;
    }
    
    const contents = fileSystem[targetPath].contents;
    
    if (contents.length === 0) {
      setHistory([...history, { text: '(empty directory)', isCommand: false }]);
      return;
    }
    
    const formattedContents = contents.map(name => {
      const itemPath = targetPath.endsWith('/') ? `${targetPath}${name}` : `${targetPath}/${name}`;
      const item = fileSystem[itemPath];
      
      if (item && item.type === 'directory') {
        return <span key={name} className="text-blue-500 mr-4">{name}/</span>;
      } else {
        return <span key={name} className="text-gray-300 mr-4">{name}</span>;
      }
    });
    
    setHistory([...history, { text: <div className="flex flex-wrap">{formattedContents}</div>, isCommand: false }]);
  };
  
  const handleCd = (args) => {
    let targetPath;
    
    // No args or ~ means go to home directory
    if (args.length === 0 || args[0] === '~') {
      setCurrentDirectory('/home/user');
      return;
    }
    
    targetPath = resolvePath(args[0]);
    
    // Check if directory exists
    if (!fileSystem[targetPath]) {
      setHistory([...history, { text: `cd: no such directory: ${args[0]}`, isCommand: false }]);
      return;
    }
    
    // Check if it's a directory
    if (fileSystem[targetPath].type !== 'directory') {
      setHistory([...history, { text: `cd: not a directory: ${args[0]}`, isCommand: false }]);
      return;
    }
    
    setCurrentDirectory(targetPath);
  };
  
  const handlePwd = () => {
    setHistory([...history, { text: currentDirectory, isCommand: false }]);
  };
  
  const handleClear = () => {
    setHistory([{ text: 'Terminal cleared.', isCommand: false }]);
  };
  
  const handleHelp = () => {
    const helpText = (
      <div className="flex flex-col">
        <span>Available commands:</span>
        <span><strong className="text-green-400">ls</strong> [directory] - List directory contents</span>
        <span><strong className="text-green-400">cd</strong> [directory] - Change directory</span>
        <span><strong className="text-green-400">pwd</strong> - Print working directory</span>
        <span><strong className="text-green-400">cat</strong> [file] - Display file contents</span>
        <span><strong className="text-green-400">mkdir</strong> [directory] - Create a new directory</span>
        <span><strong className="text-green-400">touch</strong> [file] - Create a new file</span>
        <span><strong className="text-green-400">clear</strong> - Clear terminal</span>
        <span><strong className="text-green-400">help</strong> - Display this help message</span>
      </div>
    );
    
    setHistory([...history, { text: helpText, isCommand: false }]);
  };
  
  const handleCat = (args) => {
    if (args.length === 0) {
      setHistory([...history, { text: 'cat: missing file operand', isCommand: false }]);
      return;
    }
    
    const targetPath = resolvePath(args[0]);
    
    // Check if file exists
    if (!fileSystem[targetPath]) {
      setHistory([...history, { text: `cat: ${args[0]}: No such file or directory`, isCommand: false }]);
      return;
    }
    
    // Check if it's a file
    if (fileSystem[targetPath].type === 'directory') {
      setHistory([...history, { text: `cat: ${args[0]}: Is a directory`, isCommand: false }]);
      return;
    }
    
    // Simulate file contents based on filename
    let fileContents = "This is a sample file content.";
    
    if (targetPath.includes('resume')) {
      fileContents = "[PDF CONTENT] This appears to be a resume document. Cannot display binary content.";
    } else if (targetPath.includes('notes.txt')) {
      fileContents = "Meeting notes:\n- Discuss project timeline\n- Review design mockups\n- Assign tasks to team members";
    } else if (targetPath.includes('.jpg') || targetPath.includes('.png')) {
      fileContents = "[IMAGE CONTENT] Cannot display binary content.";
    } else if (targetPath.includes('hello.txt')) {
      fileContents = "Hello, world! Welcome to the terminal simulator.";
    } else if (targetPath.includes('html')) {
      fileContents = "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Web App</title>\n</head>\n<body>\n  <h1>Welcome!</h1>\n</body>\n</html>";
    } else if (targetPath.includes('css')) {
      fileContents = "body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}";
    } else if (targetPath.includes('js')) {
      fileContents = "// Main application code\nconst app = {\n  init() {\n    console.log('App initialized');\n  }\n};\n\napp.init();";
    }
    
    setHistory([...history, { text: fileContents, isCommand: false }]);
  };
  
  const handleMkdir = (args) => {
    if (args.length === 0) {
      setHistory([...history, { text: 'mkdir: missing operand', isCommand: false }]);
      return;
    }
    
    const dirName = args[0];
    
    // Check if name contains slashes (path separators)
    if (dirName.includes('/')) {
      setHistory([...history, { text: 'mkdir: cannot create directory with path separators in name', isCommand: false }]);
      return;
    }
    
    const newPath = currentDirectory.endsWith('/') ? 
      `${currentDirectory}${dirName}` : 
      `${currentDirectory}/${dirName}`;
    
    // Check if directory already exists
    if (fileSystem[newPath]) {
      setHistory([...history, { text: `mkdir: cannot create directory '${dirName}': File exists`, isCommand: false }]);
      return;
    }
    
    // Create new directory
    const newFileSystem = { ...fileSystem };
    newFileSystem[newPath] = { type: 'directory', contents: [] };
    
    // Add to parent directory's contents
    const parentContents = [...newFileSystem[currentDirectory].contents];
    parentContents.push(dirName);
    newFileSystem[currentDirectory] = { ...newFileSystem[currentDirectory], contents: parentContents };
    
    setFileSystem(newFileSystem);
    setHistory([...history, { text: `Directory created: ${dirName}`, isCommand: false }]);
  };
  
  const handleTouch = (args) => {
    if (args.length === 0) {
      setHistory([...history, { text: 'touch: missing file operand', isCommand: false }]);
      return;
    }
    
    const fileName = args[0];
    
    // Check if name contains slashes (path separators)
    if (fileName.includes('/')) {
      setHistory([...history, { text: 'touch: cannot create file with path separators in name', isCommand: false }]);
      return;
    }
    
    const newPath = currentDirectory.endsWith('/') ? 
      `${currentDirectory}${fileName}` : 
      `${currentDirectory}/${fileName}`;
    
    // Check if file already exists
    if (fileSystem[newPath]) {
      setHistory([...history, { text: `File updated: ${fileName}`, isCommand: false }]);
      return;
    }
    
    // Create new file
    const newFileSystem = { ...fileSystem };
    newFileSystem[newPath] = { type: 'file', size: '0 KB' };
    
    // Add to parent directory's contents
    const parentContents = [...newFileSystem[currentDirectory].contents];
    parentContents.push(fileName);
    newFileSystem[currentDirectory] = { ...newFileSystem[currentDirectory], contents: parentContents };
    
    setFileSystem(newFileSystem);
    setHistory([...history, { text: `File created: ${fileName}`, isCommand: false }]);
  };
  
  const handleKeyDown = (e) => {
    // Handle up and down arrows for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion could be implemented here
    }
  };
  
  return (
    <div 
      className="w-full h-[200px] lg:h-[300px] bg-opacity-20 rounded-md overflow-hidden flex flex-col font-mono text-sm backdrop-blur-md"
      onClick={handleTerminalClick}
      style={{ 
        backgroundColor: 'rgba(17, 24, 39, 0.75)', // Transparent dark background
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(31, 41, 55, 0.5)'
      }}
    >
      <div className="p-2 border-b border-gray-700 flex items-center"
           style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }} 
      >
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-xs flex-1 text-center">Terminal</div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-2 overflow-y-auto text-gray-200"
        style={{backgroundColor: 'transparent'}}
      >
        {history.map((item, index) => (
          <div key={index} className={`mb-1 ${item.isCommand ? 'text-green-400' : 'text-gray-300'}`}>
            {item.text}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} 
      className="flex p-2 border-t border-gray-800"
      style={{ backgroundColor: 'transparent' }}
      >
        <span className="text-green-500 mr-2">{currentDirectory} $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-300"
          spellCheck="false"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Terminal;