/**
 * Client Error Monitoring Adapter (Checklist Item 20)
 * Pluggable adapter to connect to Sentry, Datadog, or custom telemetry.
 */

export interface ErrorReportContext {
  componentStack?: string;
  userId?: string;
  url?: string;
  metadata?: Record<string, any>;
}

class ErrorReporter {
  private serviceName: string = 'console-fallback';

  public configure(serviceName: string): void {
    this.serviceName = serviceName;
  }

  public report(error: Error, context?: ErrorReportContext): void {
    const payload = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      ...context,
    };

    if (import.meta.env.DEV) {
      console.warn(`[ErrorReporter] [${this.serviceName}] Caught error:`, payload);
    }

    // When the user configures their remote service (e.g., Sentry.captureException),
    // they can wire it here or register an observer.
  }
}

export const errorReporter = new ErrorReporter();
