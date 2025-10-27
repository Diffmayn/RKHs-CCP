# Technical Architecture Document

**Project:** RKH's Photo Order Management System  
**Document Type:** System Design & Architecture  
**Date:** January 6, 2025  
**Version:** 1.0  
**Audience:** Enterprise Architects, Technical Leadership, Development Team

---

## 1. Architecture Overview

### 1.1 System Purpose

RKH's Photo Order Management System is an enterprise desktop application designed to automate the photo order processing workflow, reducing manual processing time from 4 hours to 12 minutes per order through AI-powered automation and seamless PMR (Photo Management Repository) integration.

### 1.2 Architecture Principles

**Scalability:** Support 50-100 concurrent orders with ability to scale to 500+  
**Reliability:** 99.9% uptime target with graceful degradation  
**Security:** Enterprise-grade authentication, authorization, and data protection  
**Maintainability:** Modern, well-documented, standard technologies  
**Extensibility:** Plugin architecture for future AI model integration  
**Performance:** <100ms API response time, <3s UI interactions

### 1.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   Electron Desktop Application (Windows/Mac/Linux)      │   │
│  │   - React/HTML5 UI                                      │   │
│  │   - Real-time dashboards                                 │   │
│  │   - Drag-and-drop file handling                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Order Manager  │  │ AI Service   │  │  PMR Connector   │   │
│  │  - Workflow     │  │ - Image AI   │  │  - API Client    │   │
│  │  - Validation   │  │ - Content    │  │  - Sync Engine   │   │
│  │  - Queue        │  │ - Quality    │  │  - Auth Handler  │   │
│  └─────────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Runware AI API   │  │ PMR REST API     │  │ File System  │  │
│  │ (Google Gemini)  │  │ (Internal)       │  │ (Local/NAS)  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ SQLite (Local)   │  │ PostgreSQL       │  │ Redis Cache  │  │
│  │ - User settings  │  │ - Enterprise DB  │  │ - Session    │  │
│  │ - Order queue    │  │ - Audit logs     │  │ - Temp data  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Desktop Application (Electron)

**Technology:** Electron 28+ (Node.js 20 + Chromium)  
**UI Framework:** HTML5/CSS3/JavaScript (React optional for Phase 2)  
**IPC:** Electron IPC for main-renderer communication

**Key Components:**
1. **Main Process (`main.js`)**
   - Application lifecycle management
   - Window management
   - System tray integration
   - Auto-updater
   - Native OS integration

2. **Renderer Process (`index.html` + `fallback-bundle.js`)**
   - User interface
   - Event handling
   - Client-side business logic
   - Real-time updates

3. **Preload Scripts (`preload.js`)**
   - Secure IPC bridge
   - Context isolation
   - Security sandboxing

**Communication Flow:**
```
User Action → Renderer Process → IPC → Main Process → Backend API → Response
```

### 2.2 Backend Services (Node.js)

**Technology:** Node.js 20 LTS + Express 4.18+  
**API Style:** RESTful with WebSocket for real-time updates  
**Port:** 56789 (configurable)

**Core Services:**

**1. Order Service**
```javascript
POST   /api/orders           - Create new order
GET    /api/orders           - List orders (paginated)
GET    /api/orders/:id       - Get order details
PUT    /api/orders/:id       - Update order
DELETE /api/orders/:id       - Delete order
POST   /api/orders/:id/process - Process order with AI
```

**2. Event Service**
```javascript
GET    /api/events           - List Event IDs
POST   /api/events           - Create Event ID
GET    /api/events/:id       - Get event details
PUT    /api/events/:id       - Update event
GET    /api/events/:id/orders - Get orders for event
```

**3. AI Service**
```javascript
POST   /api/ai/process       - Process image with AI
POST   /api/ai/analyze       - Analyze image
POST   /api/ai/generate      - Generate content
GET    /api/ai/models        - List available models
GET    /api/ai/status        - Get AI service status
```

**4. PMR Integration Service**
```javascript
POST   /api/pmr/upload       - Upload to PMR
GET    /api/pmr/validate     - Validate Event ID
POST   /api/pmr/sync         - Sync order status
GET    /api/pmr/health       - Check PMR connectivity
```

**5. User Service**
```javascript
POST   /api/auth/login       - User authentication
POST   /api/auth/logout      - User logout
GET    /api/users/profile    - Get user profile
PUT    /api/users/settings   - Update settings
```

### 2.3 AI Integration Layer

**Primary Provider:** Runware AI (Google Gemini Flash Image 2.5 "Nano Banana")  
**WebSocket Endpoint:** `wss://ws-api.runware.ai/v1`  
**Model:** `google:4@1`

**Capabilities:**
- Image analysis and understanding
- Content generation (descriptions, captions)
- Quality assessment
- Metadata extraction
- Batch processing

**Fallback Strategy:**
1. Primary: Runware AI (Google Gemini)
2. Secondary: Direct Google AI Studio API
3. Tertiary: Manual processing mode

**Implementation:**
```javascript
class RunwareWebSocketManager {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.pendingRequests = new Map();
  }

  async imageInference(prompt, imageData, options) {
    const payload = {
      positivePrompt: prompt,
      model: 'google:4@1',
      taskType: 'imageInference',
      outputType: ['URL'],
      outputFormat: 'JPG',
      ...options
    };
    return this.sendRequest(payload);
  }
}
```

### 2.4 PMR Integration

**Protocol:** REST API over HTTPS  
**Authentication:** OAuth 2.0 + API Key  
**Data Format:** JSON

**Integration Points:**
1. **Event Validation:** Verify Event ID exists in PMR
2. **Metadata Sync:** Upload order metadata
3. **File Upload:** Transfer processed images
4. **Status Updates:** Bi-directional status synchronization
5. **Customer Lookup:** Validate customer information

**Error Handling:**
- Retry logic: 3 attempts with exponential backoff
- Circuit breaker: Disable PMR integration if 5 consecutive failures
- Offline mode: Queue operations for later sync
- Manual override: Allow manual PMR upload if automation fails

---

## 3. Technology Stack

### 3.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Electron** | 28.x | Desktop application framework |
| **Node.js** | 20.x LTS | JavaScript runtime |
| **HTML5/CSS3** | Latest | User interface |
| **JavaScript ES6+** | Latest | Application logic |
| **Bootstrap** | 5.3+ | UI framework (optional) |
| **Chart.js** | 4.x | Analytics dashboards |

**Rationale:**
- **Electron:** Cross-platform, native OS integration, proven enterprise adoption (VS Code, Teams, Slack)
- **Node.js 20 LTS:** Long-term support, excellent performance, massive ecosystem
- **Modern Web Standards:** Fast development, easy maintenance, familiar to developers

### 3.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x LTS | Server runtime |
| **Express** | 4.18+ | Web framework |
| **SQLite** | 3.44+ | Local database |
| **PostgreSQL** | 15+ | Enterprise database |
| **Redis** | 7.x | Caching & session management |
| **Winston** | 3.x | Logging framework |

**Rationale:**
- **Express:** Lightweight, flexible, extensive middleware ecosystem
- **SQLite:** Zero-config local database for desktop app
- **PostgreSQL:** Enterprise-grade for production deployment
- **Redis:** High-performance caching for AI responses

### 3.3 AI & Integration

| Technology | Purpose |
|------------|---------|
| **Runware AI API** | Primary AI service (Google Gemini) |
| **WebSocket** | Real-time AI communication |
| **Axios** | HTTP client for REST APIs |
| **Sharp** | Image processing library |
| **Multer** | File upload handling |

### 3.4 Development & Operations

| Technology | Purpose |
|------------|---------|
| **Git** | Version control |
| **GitHub** | Code repository & CI/CD |
| **ESLint** | Code quality |
| **Jest** | Unit testing |
| **Docker** | Containerization |
| **Nginx** | Reverse proxy |

---

## 4. Data Architecture

### 4.1 Database Schema

**Orders Table:**
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  total_images INTEGER DEFAULT 0,
  processed_images INTEGER DEFAULT 0,
  ai_processed BOOLEAN DEFAULT FALSE,
  pmr_synced BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata JSON
);
```

**Images Table:**
```sql
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  mime_type VARCHAR(50),
  width INTEGER,
  height INTEGER,
  ai_analyzed BOOLEAN DEFAULT FALSE,
  ai_metadata JSON,
  pmr_url TEXT,
  status VARCHAR(50) DEFAULT 'uploaded',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

**Events Table:**
```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id VARCHAR(50) UNIQUE NOT NULL,
  event_name VARCHAR(255),
  event_date DATE,
  event_type VARCHAR(100),
  customer_id VARCHAR(100),
  pmr_validated BOOLEAN DEFAULT FALSE,
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Users Table:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  settings JSON,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Audit Logs Table:**
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id INTEGER,
  details JSON,
  ip_address VARCHAR(45),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 4.2 Data Flow

**Order Processing Flow:**
```
1. User uploads images → Stored in local temp directory
2. System creates order record → SQLite database
3. Images associated with order → images table
4. Event ID validated → PMR API call
5. AI processing triggered → Runware API
6. AI metadata stored → images.ai_metadata
7. Processed images uploaded → PMR
8. PMR URLs stored → images.pmr_url
9. Order status updated → orders.status = 'completed'
10. User notified → UI update + notification
```

### 4.3 Caching Strategy

**Redis Cache Layers:**
1. **Session Cache:** User authentication tokens (TTL: 24 hours)
2. **Event Cache:** Event ID validation results (TTL: 1 hour)
3. **AI Response Cache:** Common AI processing results (TTL: 7 days)
4. **PMR Metadata Cache:** Customer and event metadata (TTL: 4 hours)

**Cache Invalidation:**
- Time-based: Automatic expiration via TTL
- Event-based: Manual invalidation on data updates
- Size-based: LRU eviction when cache full

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

**Authentication Methods:**
1. **OAuth 2.0:** Primary authentication via Azure AD / Google Workspace
2. **API Keys:** Service-to-service authentication (PMR, AI services)
3. **Session Tokens:** Secure session management with JWT

**Authorization Model (RBAC):**
```
Admin:
  - Full system access
  - User management
  - System configuration
  - All order operations

Manager:
  - View all orders
  - Process orders
  - Manage events
  - View analytics

User:
  - Create orders
  - View own orders
  - Process assigned orders
  - Upload images

Viewer:
  - Read-only access
  - View orders
  - View analytics
```

### 5.2 Data Security

**Encryption:**
- **In Transit:** TLS 1.3 for all network communication
- **At Rest:** AES-256 encryption for sensitive data in database
- **API Keys:** Encrypted storage in OS keychain (Windows Credential Manager, macOS Keychain)

**Data Protection:**
1. **PII Handling:** Minimal collection, encrypted storage, GDPR compliance
2. **File Storage:** Secure temp directories with restricted permissions
3. **Audit Logging:** All sensitive operations logged with user/timestamp
4. **Data Retention:** Configurable retention policies (default: 90 days)

### 5.3 Network Security

**Firewalls & Access Control:**
- Application listens only on localhost (127.0.0.1:56789)
- PMR API access via whitelisted IPs
- AI API access with rate limiting
- No inbound connections required

**API Security:**
- Rate limiting: 100 requests/minute per user
- Input validation: Sanitize all user inputs
- CORS: Restrict cross-origin requests
- API versioning: /api/v1/ for future compatibility

### 5.4 Security Monitoring

**Logging:**
- Failed authentication attempts
- Authorization violations
- API errors and exceptions
- PMR integration failures
- AI service anomalies

**Alerts:**
- 5+ failed login attempts in 5 minutes
- Unauthorized access attempts
- PMR/AI service downtime
- Unusual data access patterns

---

## 6. Scalability & Performance

### 6.1 Performance Requirements

| Metric | Target | Acceptable |
|--------|--------|------------|
| UI Response Time | <500ms | <1s |
| API Response Time | <100ms | <250ms |
| AI Processing Time | <30s | <60s |
| PMR Upload Time | <5s/image | <15s/image |
| Concurrent Users | 50 | 100 |
| Concurrent Orders | 100 | 200 |
| Database Query Time | <10ms | <50ms |

### 6.2 Scaling Strategy

**Phase 1: Desktop Application (Current)**
- Single-user Electron app
- SQLite local database
- Direct API calls to AI and PMR
- Target: 1-5 concurrent users per instance

**Phase 2: Multi-User Desktop (Months 3-6)**
- Shared backend API server
- SQLite → PostgreSQL migration
- Redis caching layer
- Target: 50 concurrent users

**Phase 3: Enterprise Scale (Year 1-2)**
- Load-balanced API servers
- Database read replicas
- CDN for static assets
- Horizontal scaling via Kubernetes
- Target: 200+ concurrent users

### 6.3 Performance Optimizations

**Frontend:**
- Lazy loading for large image sets
- Virtual scrolling for order lists
- Debounced API calls
- Local caching of frequently accessed data
- Progressive image loading

**Backend:**
- Connection pooling for database
- Query optimization with indexes
- Async/await for non-blocking I/O
- Batch processing for bulk operations
- Compression for API responses

**AI Processing:**
- Batch API calls for multiple images
- WebSocket for real-time progress updates
- Queue-based processing for large orders
- Result caching for similar images
- Fallback to lower-quality models under load

---

## 7. Deployment Architecture

### 7.1 Development Environment

```
Developer Machine:
├── Node.js 20 LTS
├── SQLite 3.44+
├── Git
├── VS Code / IDE
├── Electron Dev Tools
└── Local test servers (AI mock, PMR mock)
```

### 7.2 Production Environment

**Desktop Deployment:**
```
User Machine (Windows/Mac/Linux):
├── Electron App (installed via installer)
│   ├── Embedded Node.js runtime
│   ├── SQLite database (local)
│   └── Application files
├── Backend API Server (optional for enterprise)
│   ├── Node.js 20
│   ├── PostgreSQL 15
│   ├── Redis 7
│   └── Nginx reverse proxy
└── External Services
    ├── Runware AI API (cloud)
    └── PMR API (internal network)
```

**System Requirements:**
- **OS:** Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **RAM:** 4GB minimum, 8GB recommended
- **Disk:** 500MB application + 10GB working space
- **Network:** Stable internet connection for AI and PMR APIs

### 7.3 CI/CD Pipeline

```
Git Push → GitHub Actions →
  1. Lint & Code Quality (ESLint)
  2. Unit Tests (Jest)
  3. Build Electron App
  4. Code Signing (Windows/macOS)
  5. Create Installers (NSIS/DMG)
  6. Upload to Release Server
  7. Auto-update deployment
```

### 7.4 Monitoring & Observability

**Application Monitoring:**
- **Logs:** Winston → File/Console/Cloud (Azure Log Analytics)
- **Metrics:** Custom metrics for orders, processing time, errors
- **Alerts:** Email/Slack notifications for critical errors
- **Uptime:** Ping health check endpoint every 5 minutes

**User Analytics:**
- Order processing metrics
- Feature usage tracking
- Performance bottlenecks
- Error frequency and types

---

## 8. Disaster Recovery & Business Continuity

### 8.1 Backup Strategy

**Local Data (Desktop App):**
- Automatic daily backup of SQLite database
- Backup location: User's Documents folder
- Retention: 7 days rolling backup
- Manual backup option available

**Enterprise Data (Backend):**
- PostgreSQL: Automated daily backups
- Redis: AOF (Append-Only File) persistence
- File Storage: Replicated to backup server
- Retention: 30 days

### 8.2 Recovery Procedures

**Desktop App Corruption:**
1. User reinstalls application
2. Restore from local backup
3. Re-sync with PMR if needed
4. Recovery time: <30 minutes

**Backend Failure:**
1. Automatic failover to secondary server
2. Restore from latest backup
3. Resume processing from last checkpoint
4. Recovery time: <2 hours

### 8.3 Offline Mode

**Capabilities:**
- Create and queue orders locally
- View previously processed orders
- Export data for manual processing
- Automatic sync when connection restored

**Limitations:**
- No AI processing (requires internet)
- No PMR integration (requires internal network)
- No real-time collaboration

---

## 9. Testing Strategy

### 9.1 Testing Levels

**Unit Testing (Target: 80% coverage)**
- Individual functions and components
- Mock external dependencies (AI API, PMR API)
- Framework: Jest + Supertest

**Integration Testing (Target: 60% coverage)**
- API endpoint testing
- Database operations
- External service integration
- Framework: Jest + Testcontainers

**End-to-End Testing (Target: Critical paths)**
- Full user workflows
- Cross-component interactions
- Framework: Playwright / Electron Spectron

### 9.2 Test Environments

1. **Local:** Developer machines, mocked services
2. **Development:** Shared dev server, test APIs
3. **Staging:** Production-like environment, real APIs (test accounts)
4. **Production:** Live environment, monitored deployments

---

## 10. Technical Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI API rate limits | High | Medium | Implement caching, batch processing, fallback models |
| PMR API changes | High | Low | Version API calls, maintain adapter layer, regular integration tests |
| Electron security vulnerabilities | Medium | Medium | Regular updates, security audits, CSP headers |
| Database corruption | High | Low | Automated backups, data validation, transaction management |
| Network connectivity issues | Medium | High | Offline mode, retry logic, queue-based processing |
| Performance degradation at scale | Medium | Medium | Load testing, performance monitoring, horizontal scaling |

---

**Document Owner:** [Your Name], Lead Architect  
**Last Updated:** January 6, 2025  
**Next Review:** April 2025
