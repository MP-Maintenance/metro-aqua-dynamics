import { supabase } from "@/integrations/supabase/client";

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
};

export class RateLimiter {
  private config: RateLimitConfig;
  private storageKey: string;

  constructor(identifier: string, config?: Partial<RateLimitConfig>) {
    this.storageKey = `rate_limit_${identifier}`;
    this.config = { ...DEFAULT_RATE_LIMIT, ...config };
  }

  private getRecord(): AttemptRecord {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return { count: 0, firstAttempt: Date.now() };
    }
    return JSON.parse(stored);
  }

  private setRecord(record: AttemptRecord): void {
    localStorage.setItem(this.storageKey, JSON.stringify(record));
  }

  private clearRecord(): void {
    localStorage.removeItem(this.storageKey);
  }

  isBlocked(): boolean {
    const record = this.getRecord();
    const now = Date.now();

    // Check if currently blocked
    if (record.blockedUntil && record.blockedUntil > now) {
      return true;
    }

    // Clear block if expired
    if (record.blockedUntil && record.blockedUntil <= now) {
      this.clearRecord();
      return false;
    }

    return false;
  }

  getRemainingBlockTime(): number {
    const record = this.getRecord();
    const now = Date.now();
    
    if (record.blockedUntil && record.blockedUntil > now) {
      return Math.ceil((record.blockedUntil - now) / 1000);
    }
    
    return 0;
  }

  recordAttempt(): void {
    const record = this.getRecord();
    const now = Date.now();

    // Reset if window expired
    if (now - record.firstAttempt > this.config.windowMs) {
      this.setRecord({ count: 1, firstAttempt: now });
      return;
    }

    // Increment attempt count
    record.count += 1;

    // Block if max attempts exceeded
    if (record.count >= this.config.maxAttempts) {
      record.blockedUntil = now + this.config.blockDurationMs;
    }

    this.setRecord(record);
  }

  reset(): void {
    this.clearRecord();
  }
}

export type SecurityEventType = 
  | 'login_success' 
  | 'login_failed' 
  | 'login_blocked' 
  | 'unauthorized_access' 
  | 'admin_access_denied'
  | 'signup_success'
  | 'signup_failed'
  | 'logout';

export interface SecurityEventData {
  eventType: SecurityEventType;
  userId?: string;
  email?: string;
  details?: string;
}

export async function logSecurityEvent(data: SecurityEventData): Promise<void> {
  try {
    // Get IP address (note: in production, you'd want to get this from a backend service)
    const ipAddress = await getClientIP();

    const { error } = await supabase
      .from('auth_event_logs')
      .insert({
        user_id: data.userId || null,
        event_type: data.eventType,
        ip_address: ipAddress,
      });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

async function getClientIP(): Promise<string> {
  try {
    // In production, you'd want to get this from your backend or a service
    // For now, we'll use a placeholder
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}
