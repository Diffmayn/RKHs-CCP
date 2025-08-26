// Enhanced Fallback Runtime with better UX and debugging
(function(){
  const root = document.getElementById('app');
  if(!root || window.__APP_STARTED__) return;

  console.log('[Fallback] Activating fallback runtime');

  // Mark fallback as active
  window.__FALLBACK_ACTIVE__ = true;

  // Enhanced sample data
  const orders = [
    {orderNumber:'ORD-2025-001', title:'Premium Dog Food - Hero Shot', status:'Complete', photographer:'John Smith', deadline:'2025-08-30', costCenter:'CC-101'},
    {orderNumber:'ORD-2025-002', title:'Espresso Beans - Lifestyle Photography', status:'Preparing for Shipping', photographer:'Emily Brown', deadline:'2025-09-05', costCenter:'CC-102'},
    {orderNumber:'ORD-2025-003', title:'Organic Vegetables - Detail Shots', status:'Pending', photographer:'David Lee', deadline:'2025-08-28', costCenter:'CC-103'},
    {orderNumber:'ORD-2025-006', title:'Wireless Speaker - Product Shot', status:'Pending', photographer:'Mike Wilson', deadline:'2025-09-15', costCenter:'CC-106'},
    {orderNumber:'ORD-2025-008', title:'Running Shoes - Action Shots', status:'Received', photographer:'Tom Anderson', deadline:'2025-09-08', costCenter:'CC-108'},
    {orderNumber:'ORD-2025-009', title:'Educational Toys - Process Photography', status:'Complete', photographer:'Sarah Johnson', deadline:'2025-08-27', costCenter:'CC-109'}
  ];

  const css = `
    #fallback-app { font-family: system-ui, 'Segoe UI', Arial, sans-serif; line-height: 1.5; }
    #fallback-app h1 { margin: 0 0 8px; font-size: 22px; color: #1f2937; font-weight: 600; }
    #fallback-app .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 16px 0; }
    #fallback-app .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
    #fallback-app .stat-number { font-size: 24px; font-weight: bold; color: #2563eb; }
    #fallback-app .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    #fallback-app table { border-collapse: collapse; width: 100%; margin-top: 12px; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    #fallback-app th, #fallback-app td { border-bottom: 1px solid #e5e7eb; padding: 8px 12px; font-size: 13px; text-align: left; }
    #fallback-app th { background: #f8fafc; font-weight: 600; color: #374151; }
    #fallback-app tbody tr:hover { background: #f9fafb; }
    #fallback-app .status { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; display: inline-block; }
    #fallback-app .Complete { background: #d1fae5; color: #065f46; }
    #fallback-app .Pending { background: #fef3c7; color: #92400e; }
    #fallback-app .Received { background: #e0f2fe; color: #075985; }
    #fallback-app .toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
    #fallback-app .btn { background: #4b5563; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: background 0.2s; }
    #fallback-app .btn:hover { background: #374151; }
    #fallback-app .btn-primary { background: #2563eb; }
    #fallback-app .btn-primary:hover { background: #1d4ed8; }
    #fallback-app input { flex: 1; min-width: 240px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; }
    #fallback-app .alert { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px; }
  `;

  if(!document.getElementById('fallback-style')){
    const st = document.createElement('style');
    st.id = 'fallback-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function getStats() {
    const total = orders.length;
    const complete = orders.filter(o => o.status === 'Complete').length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const inProgress = orders.filter(o => !['Complete', 'Pending'].includes(o.status)).length;
    return { total, complete, pending, inProgress };
  }

  function render() {
    const stats = getStats();
    root.innerHTML = `
      <div id="fallback-app" style="max-width: 1200px; margin: 32px auto; background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div class="alert">
          <strong>⚠️ Fallback Mode Active</strong> - You are viewing a simplified version. Build and serve the full application for complete functionality.
        </div>
        
        <h1>📸 Photo Order Management</h1>
        <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">
          Enterprise photo order tracking and management system
        </p>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total Orders</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #059669">${stats.complete}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #d97706">${stats.pending}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" style="color: #2563eb">${stats.inProgress}</div>
            <div class="stat-label">In Progress</div>
          </div>
        </div>

        <div class="toolbar">
          <input id="searchBox" placeholder="🔍 Search orders by title, number, or photographer..." />
          <button id="exportCsv" class="btn">📊 Export CSV</button>
          <button id="envInfo" class="btn">🔧 Environment</button>
          <button id="buildInstructions" class="btn btn-primary">🚀 Build Guide</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Title</th>
              <th>Status</th>
              <th>Photographer</th>
              <th>Cost Center</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody id="ordersBody"></tbody>
        </table>

        <div id="diag" style="margin-top: 16px; font-size: 12px; color: #6b7280; white-space: pre-wrap; max-height: 200px; overflow-y: auto;"></div>
      </div>
    `;

    const tbody = document.getElementById('ordersBody');
    const searchBox = document.getElementById('searchBox');

    function drawRows() {
      const term = searchBox.value.toLowerCase();
      const filtered = orders.filter(o => 
        !term || 
        o.title.toLowerCase().includes(term) ||
        o.orderNumber.toLowerCase().includes(term) ||
        o.photographer.toLowerCase().includes(term) ||
        o.costCenter.toLowerCase().includes(term)
      );
      
      tbody.innerHTML = filtered.length ? filtered.map(o => `
        <tr>
          <td><strong>${o.orderNumber}</strong></td>
          <td>${o.title}</td>
          <td><span class="status ${o.status}">${o.status}</span></td>
          <td>${o.photographer}</td>
          <td>${o.costCenter}</td>
          <td>${new Date(o.deadline).toLocaleDateString()}</td>
        </tr>
      `).join('') : '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:20px;">No orders match your search</td></tr>';
    }

    searchBox.addEventListener('input', drawRows);

    document.getElementById('exportCsv').addEventListener('click', () => {
      const header = 'Order Number,Title,Status,Photographer,Cost Center,Deadline';
      const rows = orders.map(o => [
        o.orderNumber, o.title, o.status, o.photographer, o.costCenter, o.deadline
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\\n');
      
      const blob = new Blob(['\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `photo_orders_fallback_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    });

    document.getElementById('envInfo').addEventListener('click', () => {
      const diag = document.getElementById('diag');
      const info = {
        userAgent: navigator.userAgent.slice(0, 100) + '...',
        location: location.href,
        localStorage: (() => { try { localStorage.setItem('__test', '1'); localStorage.removeItem('__test'); return 'accessible'; } catch(e) { return 'blocked: ' + e.message; } })(),
        sessionStorage: (() => { try { sessionStorage.setItem('__test', '1'); sessionStorage.removeItem('__test'); return 'accessible'; } catch(e) { return 'blocked: ' + e.message; } })(),
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        online: navigator.onLine
      };
      diag.textContent = JSON.stringify(info, null, 2);
    });

    document.getElementById('buildInstructions').addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:600px;margin:20px;max-height:80vh;overflow-y:auto;">
          <h2 style="margin:0 0 16px;font-size:20px;color:#1f2937">🚀 Full Application Setup</h2>
          <div style="background:#f8fafc;padding:16px;border-radius:8px;margin-bottom:16px;">
            <h3 style="margin:0 0 8px;font-size:16px;color:#374151">Quick Start (Windows)</h3>
            <ol style="margin:8px 0;padding-left:20px;line-height:1.6;color:#4b5563">
              <li>Open Command Prompt (cmd) or PowerShell as Administrator</li>
              <li>Navigate: <code style="background:#e5e7eb;padding:2px 4px;border-radius:3px">cd "C:\\Users\\248075\\.vscode\\cli\\RKHs CCP"</code></li>
              <li>Install: <code style="background:#e5e7eb;padding:2px 4px;border-radius:3px">npm ci</code></li>
              <li>Build: <code style="background:#e5e7eb;padding:2px 4px;border-radius:3px">npm run build</code></li>
              <li>Serve: <code style="background:#e5e7eb;padding:2px 4px;border-radius:3px">npm run serve:dist</code></li>
              <li>Open: <a href="http://localhost:4173/" target="_blank" style="color:#2563eb">http://localhost:4173/</a></li>
            </ol>
          </div>
          <div style="background:#fef3c7;padding:12px;border-radius:6px;margin-bottom:16px;">
            <strong>Alternative:</strong> Double-click <code>start-server.bat</code> in the project folder
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="background:#2563eb;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer">Close</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    });

    drawRows();
  }

  // Smooth entrance
  setTimeout(() => {
    render();
    const app = document.getElementById('fallback-app');
    if (app) {
      app.style.opacity = '0';
      app.style.transform = 'translateY(20px)';
      app.style.transition = 'all 0.5s ease-out';
      setTimeout(() => {
        app.style.opacity = '1';
        app.style.transform = 'translateY(0)';
      }, 50);
    }
  }, 100);
})();
