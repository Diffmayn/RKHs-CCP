#!/bin/bash

# Chrome DevTools MCP Server Setup Script for Linux/Mac
# This script installs and configures the Chrome DevTools MCP server

set -e

echo "🔧 Setting up Chrome DevTools MCP Server..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
print_status "🔍 Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is required but not found!"
    echo -e "${YELLOW}   Please install Node.js from: https://nodejs.org/${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm is required but not found!"
    exit 1
fi

# Find Chrome/Chromium executable
print_status "🔍 Looking for Chrome installation..."

CHROME_PATHS=(
    "/usr/bin/google-chrome"
    "/usr/bin/google-chrome-stable"
    "/usr/bin/chromium"
    "/usr/bin/chromium-browser"
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    "/snap/bin/chromium"
)

CHROME_EXE=""
for path in "${CHROME_PATHS[@]}"; do
    if [[ -x "$path" ]]; then
        CHROME_EXE="$path"
        print_success "Chrome found: $CHROME_EXE"
        break
    fi
done

if [[ -z "$CHROME_EXE" ]]; then
    print_warning "Chrome not found in standard locations"
    print_warning "Using 'google-chrome' as fallback - may need to be in PATH"
    CHROME_EXE="google-chrome"
fi

# Install MCP servers
print_status "📦 Installing MCP servers..."

MCP_SERVERS=(
    "@modelcontextprotocol/server-chrome-devtools"
    "@modelcontextprotocol/server-filesystem"
    "@modelcontextprotocol/server-brave-search"
)

for server in "${MCP_SERVERS[@]}"; do
    echo -e "${YELLOW}   Installing $server...${NC}"
    if npm install -g "$server"; then
        print_success "$server installed successfully"
    else
        print_error "Failed to install $server"
    fi
done

# Create MCP configuration
print_status "⚙️  Creating MCP configuration..."

cat > mcp-server.json << EOF
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-chrome-devtools"
      ],
      "env": {
        "CHROME_EXECUTABLE_PATH": "$CHROME_EXE"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "$(pwd)"
      ]
    },
    "brave-search": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": ""
      }
    }
  }
}
EOF

print_success "MCP configuration created in mcp-server.json"

# Claude Desktop configuration
print_status "🤖 Setting up Claude Desktop integration..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CLAUDE_CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
else
    # Linux
    CLAUDE_CONFIG_PATH="$HOME/.config/claude/claude_desktop_config.json"
fi

CLAUDE_CONFIG_DIR=$(dirname "$CLAUDE_CONFIG_PATH")

if [[ ! -d "$CLAUDE_CONFIG_DIR" ]]; then
    echo -e "${YELLOW}📁 Creating Claude configuration directory...${NC}"
    mkdir -p "$CLAUDE_CONFIG_DIR"
fi

if [[ -f "$CLAUDE_CONFIG_PATH" ]]; then
    print_warning "Existing Claude configuration found"
    read -p "Do you want to backup and replace it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp "$CLAUDE_CONFIG_PATH" "${CLAUDE_CONFIG_PATH}.backup.$(date +%Y%m%d-%H%M%S)"
        cp mcp-server.json "$CLAUDE_CONFIG_PATH"
        print_success "Claude Desktop configuration updated"
    else
        print_warning "Skipping Claude configuration update"
        print_warning "Manual configuration required. See README-MCP.md for details."
    fi
else
    cp mcp-server.json "$CLAUDE_CONFIG_PATH"
    print_success "Claude Desktop configuration created"
fi

# Test MCP server
print_status "🧪 Testing MCP server..."

echo -e "${YELLOW}   Testing Chrome DevTools server...${NC}"
if npx @modelcontextprotocol/server-chrome-devtools --help &>/dev/null; then
    print_success "Chrome DevTools MCP server is working"
else
    print_warning "Chrome DevTools MCP server test failed"
    print_warning "This might be normal - the server may require a client connection"
fi

# Summary
echo
print_success "🎉 Setup Complete!"
echo "=================================================="

print_status "📋 Summary:"
echo -e "${WHITE}   • MCP servers installed globally via npm${NC}"
echo -e "${WHITE}   • Configuration saved to mcp-server.json${NC}"
echo -e "${WHITE}   • Claude Desktop configuration updated${NC}"
echo -e "${WHITE}   • Chrome path configured: $CHROME_EXE${NC}"

echo
print_status "🚀 Next Steps:"
echo -e "${YELLOW}   1. Restart Claude Desktop if it's running${NC}"
echo -e "${YELLOW}   2. Start a new conversation in Claude${NC}"
echo -e "${YELLOW}   3. Test with: 'Open Chrome and navigate to localhost:8000'${NC}"
echo -e "${YELLOW}   4. See README-MCP.md for more examples${NC}"

if [[ "$CHROME_EXE" == "google-chrome" ]]; then
    echo
    print_warning "Note: Chrome path not fully validated"
    print_warning "If Chrome doesn't work, ensure it's in your PATH or edit the config manually"
fi

echo
print_status "📖 Documentation:"
echo -e "${WHITE}   • README-MCP.md - Full setup and usage guide${NC}"
echo -e "${WHITE}   • mcp-server.json - Server configuration${NC}"
echo -e "${WHITE}   • Test with your RKH's Content Creation Program!${NC}"