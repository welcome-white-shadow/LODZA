/**
 * Sound & Native Notification Service for LODZA
 * Uses Web Audio API synthesizers to produce crisp, lag-free audible alerts
 * for incoming driver dispatch pings, trip acceptance, customer alerts, and delivery completion.
 * Also integrates browser Notification API for real background push/system notifications.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private radarInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Request browser notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        return result === 'granted';
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Fire system notification
   */
  sendNotification(title: string, options?: NotificationOptions) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/icon-192.svg',
          badge: '/icon-192.svg',
          ...options
        });
      }
    } catch {
      // Ignore background restrictions
    }
  }

  /**
   * Play urgent incoming trip offer alert (Dual-tone chime Porter / Uber style)
   */
  playIncomingOffer() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High-low urgency double beep
      const freqs = [659.25, 880, 659.25, 987.77];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);
        gain.gain.setValueAtTime(0.25, now + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.2);
      });
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Start looping radar ping while order is searching for driver
   */
  startRadarLoop() {
    this.stopRadarLoop();
    this.playIncomingOffer();
    this.radarInterval = window.setInterval(() => {
      this.playIncomingOffer();
    }, 3000);
  }

  stopRadarLoop() {
    if (this.radarInterval) {
      clearInterval(this.radarInterval);
      this.radarInterval = null;
    }
  }

  /**
   * Trip accepted celebration chime
   */
  playSuccess() {
    this.stopRadarLoop();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Graceful ignore
    }
  }

  /**
   * Cash / UPI payment collected or completed delivery
   */
  playPaymentCollected() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Driver arrived at pickup bell chime
   */
  playDriverArrived() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [784, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.2, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundService();
