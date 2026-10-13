// Cookie-consent gated analytics tracker (Item 15)
class AnalyticsService {
  private analyticsId: string | undefined;
  private hasConsent: boolean = false;
  private initialized: boolean = false;

  constructor() {
    this.analyticsId = import.meta.env.VITE_ANALYTICS_ID;
  }

  public setConsent(granted: boolean): void {
    this.hasConsent = granted;
    if (granted && !this.initialized && this.analyticsId) {
      this.init();
    }
  }

  private init(): void {
    this.initialized = true;
    // In production, insert measurement script tag or beacon here
    if (import.meta.env.DEV) {
      console.info(`[Analytics] Initialized with ID: ${this.analyticsId}`);
    }
  }

  public trackPageView(path: string, title: string): void {
    if (!this.hasConsent) return;
    if (import.meta.env.DEV) {
      console.info(`[Analytics] PageView: ${path} - ${title}`);
    }
  }

  public trackEvent(category: string, action: string, label?: string, value?: number): void {
    if (!this.hasConsent) return;
    if (import.meta.env.DEV) {
      console.info(`[Analytics] Event: [${category}] ${action} ${label || ''} ${value !== undefined ? `(${value})` : ''}`);
    }
  }
}

export const analytics = new AnalyticsService();
