import { PhotoOrderApp } from './app.js';

class AppBootstrap {
  private app: PhotoOrderApp;

  constructor() {
    this.app = new PhotoOrderApp();
  }

  async start(): Promise<void> {
    try {
      // Hide loading screen
      setTimeout(() => {
        this.hideLoadingScreen();
      }, 500);

      // Initialize app
      await this.app.init();
      
      // Make app globally accessible for inline event handlers
      (window as any).photoApp = this.app;
      
      // Mark app as started
      (window as any).__APP_STARTED__ = true;
      
      console.log('Photo Order Management System initialized successfully');
      
    } catch (error) {
      console.error('Failed to start application:', error);
      this.showError('Failed to initialize application. Please refresh the page.');
    }
  }

  private hideLoadingScreen(): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
  }

  private showError(message: string): void {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="max-w-md mx-auto text-center">
            <div class="mb-4">
              <span class="text-6xl">⚠️</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Application Error</h2>
            <p class="text-gray-600 mb-4">${message}</p>
            <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Reload Page
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Start the application
const bootstrap = new AppBootstrap();
bootstrap.start().catch(error => {
  console.error('Bootstrap failed:', error);
});
