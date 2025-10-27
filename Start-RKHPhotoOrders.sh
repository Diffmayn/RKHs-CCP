#!/bin/bash

# RKH's Photo Order Management System - Linux/macOS Launcher
# Cross-platform launcher script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default settings
PORT=8080
CITRIX_MODE=false
DEBUG=false
AUTO_OPEN=true

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}🔧 $1${NC}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --citrix)
            CITRIX_MODE=true
            shift
            ;;
        --port)
            PORT="$2"
            shift 2
            ;;
        --debug)
            DEBUG=true
            shift
            ;;
        --no-browser)
            AUTO_OPEN=false
            shift
            ;;
        -h|--help)
            echo "RKH's Photo Order Management System Launcher"
            echo ""
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --citrix        Enable Citrix optimizations"
            echo "  --port PORT     Set server port (default: 8080)"
            echo "  --debug         Enable debug mode"
            echo "  --no-browser    Don't auto-open browser"
            echo "  -h, --help      Show this help message"
            echo ""
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}🚀 RKH's Photo Order Management System${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""

# Get application directory
APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_ROOT"

print_info "Application directory: $APP_ROOT"

# Check prerequisites
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    print_error "Python is not installed or not in PATH"
    echo "Please install Python 3.6+ from https://python.org"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

print_status "Using $PYTHON_CMD"

# Check if application files exist
if [ ! -f "fallback-bundle.js" ]; then
    print_error "Application bundle not found"
    echo "Please ensure fallback-bundle.js exists in the application directory"
    exit 1
fi

if [ ! -f "index.html" ]; then
    print_error "Main application file not found"
    echo "Please ensure index.html exists in the application directory"
    exit 1
fi

print_status "Application files verified"

# Check if port is available
if command -v netstat &> /dev/null; then
    if netstat -an 2>/dev/null | grep -q ":$PORT "; then
        print_warning "Port $PORT is already in use"
        
        # Try to find available port
        for ((test_port=PORT+1; test_port<=PORT+100; test_port++)); do
            if ! netstat -an 2>/dev/null | grep -q ":$test_port "; then
                PORT=$test_port
                print_status "Using port $PORT instead"
                break
            fi
        done
        
        if netstat -an 2>/dev/null | grep -q ":$PORT "; then
            print_error "Could not find an available port"
            exit 1
        fi
    fi
fi

# Configure firewall (Linux with ufw)
if command -v ufw &> /dev/null && [ "$EUID" -eq 0 ]; then
    print_info "Configuring firewall..."
    ufw allow $PORT/tcp >/dev/null 2>&1 || print_warning "Could not configure firewall automatically"
fi

# Citrix optimizations
if [ "$CITRIX_MODE" = true ]; then
    print_info "Citrix mode enabled - applying optimizations"
    export RKHS_CITRIX_MODE=true
    export RKHS_REDUCE_ANIMATIONS=true
    export RKHS_VIRTUAL_ENV=true
fi

# Set environment variables
export RKHS_PORT=$PORT
export RKHS_DEBUG=$DEBUG

# Create Python server script
cat > temp_server.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys
import time
import threading
import json
import signal
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get('RKHS_PORT', 8080))
DEBUG = os.environ.get('RKHS_DEBUG', 'false').lower() == 'true'
CITRIX_MODE = os.environ.get('RKHS_CITRIX_MODE', 'false').lower() == 'true'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                'status': 'healthy',
                'version': '1.0.0',
                'citrix': CITRIX_MODE,
                'debug': DEBUG,
                'timestamp': time.time()
            }
            self.wfile.write(json.dumps(response).encode())
            return
        elif self.path == '/api/system-info':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {
                'platform': sys.platform,
                'python_version': sys.version,
                'citrix_mode': CITRIX_MODE,
                'debug_mode': DEBUG
            }
            self.wfile.write(json.dumps(response).encode())
            return
        
        super().do_GET()

    def log_message(self, format, *args):
        if DEBUG:
            super().log_message(format, *args)

def open_browser():
    time.sleep(2)
    try:
        webbrowser.open(f'http://localhost:{PORT}')
        print(f'🌐 Opened http://localhost:{PORT} in browser')
    except Exception as e:
        if DEBUG:
            print(f'Browser open error: {e}')
        print(f'💡 Please open http://localhost:{PORT} in your browser')

def signal_handler(sig, frame):
    print('\n🛑 Shutting down server...')
    sys.exit(0)

if __name__ == '__main__':
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Set up signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        with socketserver.TCPServer(('localhost', PORT), CustomHandler) as httpd:
            print(f'🌐 Server running on http://localhost:{PORT}')
            print('🛑 Press Ctrl+C to stop the server')
            
            if CITRIX_MODE:
                print('🏢 Citrix mode active - optimized for virtual environments')
            
            # Auto-open browser
            if os.environ.get('AUTO_OPEN', 'true').lower() == 'true':
                browser_thread = threading.Thread(target=open_browser)
                browser_thread.daemon = True
                browser_thread.start()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print('\n🛑 Shutting down server...')
        sys.exit(0)
    except Exception as e:
        print(f'❌ Error starting server: {e}')
        sys.exit(1)
EOF

# Set environment variable for auto-open
export AUTO_OPEN=$AUTO_OPEN

print_info "Starting local server on port $PORT..."

# Start the server
echo ""
echo -e "${GREEN}🎉 Starting RKH's Photo Order Management System...${NC}"
echo -e "${CYAN}🌐 URL: http://localhost:$PORT${NC}"
echo ""

# Handle cleanup on exit
cleanup() {
    echo ""
    print_info "Cleaning up..."
    if [ -f "temp_server.py" ]; then
        rm -f temp_server.py
    fi
    print_status "Cleanup completed"
    echo -e "${CYAN}👋 Thank you for using RKH's Photo Order Management System!${NC}"
}

trap cleanup EXIT

# Start the Python server
$PYTHON_CMD temp_server.py
