import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// Global error handler for NavigatorLockAcquireTimeoutError
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (error && (
      error.name === 'NavigatorLockAcquireTimeoutError' ||
      error.message?.includes('NavigatorLockAcquireTimeoutError') ||
      error.message?.includes('lock:sb-')
    )) {
      // Suppress this error - it's handled internally by Supabase
      event.preventDefault();
      event.stopPropagation();
    }
  }, { capture: true });

  // Suppress console errors for lock manager (only for specific errors)
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const errorString = String(args[0] || '');
    if (errorString.includes('NavigatorLockAcquireTimeoutError') || 
        errorString.includes('lock:sb-') ||
        (args[0]?.name === 'NavigatorLockAcquireTimeoutError')) {
      return; // Suppress lock manager errors silently
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const errorString = String(args[0] || '');
    if (errorString.includes('NavigatorLockAcquireTimeoutError') || 
        errorString.includes('lock:sb-')) {
      return; // Suppress lock manager warnings
    }
    originalWarn.apply(console, args);
  };
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => {
  // Don't log NavigatorLockAcquireTimeoutError
  if (!err?.name?.includes('NavigatorLockAcquireTimeoutError') && 
      !err?.message?.includes('lock:sb-')) {
    console.error(err);
  }
});

