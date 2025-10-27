# Chrome DevTools MCP Server Setup

This directory contains the Chrome DevTools Model Context Protocol (MCP) server setup for the RKH's Content Creation Program.

## What is Chrome DevTools MCP?

The Chrome DevTools MCP server allows AI assistants to:
- Navigate web pages and interact with them
- Inspect HTML elements and CSS styles  
- Execute JavaScript in browser contexts
- Take screenshots and extract content
- Monitor network requests and responses
- Debug web applications

## Installation

### Quick Setup (Recommended)
Run the setup script:
```powershell
.\Setup-MCP.ps1
```

### Manual Setup
```bash
# Install the Chrome DevTools MCP server
npm install -g @modelcontextprotocol/server-chrome-devtools

# Install additional MCP servers
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-brave-search
```

## Configuration

The MCP servers are configured in `mcp-server.json`:

- **chrome-devtools**: Controls Chrome browser automation
- **filesystem**: Provides file system access
- **brave**: Enables web search capabilities

## Usage with Claude Desktop

1. Install Claude Desktop from Anthropic
2. Copy the MCP configuration to your Claude config:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`

3. Add this configuration:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-chrome-devtools"],
      "env": {
        "CHROME_EXECUTABLE_PATH": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      }
    }
  }
}
```

## Usage Examples

Once connected to Claude Desktop, you can:

```
"Open my Content Creation Program in Chrome and take a screenshot"

"Navigate to the photo orders page and extract all order information"

"Inspect the CSS for the main navigation and suggest improvements"

"Test the Gemini AI integration and show me any console errors"

"Monitor network requests when I upload a photo"
```

## Troubleshooting

### Chrome Not Found
If you get a Chrome executable error, check these paths:
- `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`

Update the `CHROME_EXECUTABLE_PATH` in the configuration accordingly.

### Permission Issues
Run PowerShell as Administrator if you encounter permission errors during installation.

### Port Conflicts
The MCP server runs on default ports. If you have conflicts, you can specify custom ports in the configuration.

## Security Notes

- The Chrome DevTools MCP server can execute arbitrary JavaScript
- Only use with trusted AI assistants and in controlled environments  
- Consider running in a sandboxed browser profile for production use

## Integration with RKH's CCP

This MCP setup is specifically configured for the RKH's Content Creation Program:

1. **Web Testing**: Test your application UI and functionality
2. **Debug AI Integration**: Monitor Gemini and Runware API calls
3. **Performance Analysis**: Analyze loading times and resource usage
4. **User Experience**: Take screenshots and validate layouts
5. **Data Extraction**: Extract order information and export data

## Advanced Configuration

For advanced users, you can extend the MCP configuration with:

- Custom Chrome launch arguments
- Headless vs. headed browser modes  
- Multiple browser profiles
- Custom timeout settings
- Proxy configurations

Refer to the official MCP documentation for more advanced options.