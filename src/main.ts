import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Global error handler for NavigatorLockAcquireTimeoutError
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (error && (
      error.name === 'NavigatorLockAcquireTimeoutError' ||
      error.message?.includes('NavigatorLockAcquireTimeoutError') ||
      error.message?.includes('lock:sb-') ||
      error.message?.includes('Multiple GoTrueClient')
    )) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, { capture: true });

  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const errorString = String(args[0] || '');
    if (errorString.includes('NavigatorLockAcquireTimeoutError') || 
        errorString.includes('lock:sb-') ||
        errorString.includes('Multiple GoTrueClient') ||
        (args[0]?.name === 'NavigatorLockAcquireTimeoutError')) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const errorString = String(args[0] || '');
    if (errorString.includes('NavigatorLockAcquireTimeoutError') || 
        errorString.includes('lock:sb-') ||
        errorString.includes('Multiple GoTrueClient')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

bootstrapApplication(AppComponent, appConfig)
.catch(err => {
  if (!err?.name?.includes('NavigatorLockAcquireTimeoutError') && 
      !err?.message?.includes('lock:sb-') &&
      !err?.message?.includes('Multiple GoTrueClient')) {
    console.error(err);
  }
});