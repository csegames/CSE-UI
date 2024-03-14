import { ListenerHandle } from '../listenerHandle';

// Usage:
//
// const tracker = RetryTracker.create(250, 1600);
//
// while(tracker.shouldRetry) {
//   if (action) break;
//   tracker.onFailed();
// }

export interface RetryTracker extends ListenerHandle {
  readonly shouldRetry: boolean;
  onFailed(): Promise<void>;
}

export class RetryTracker {
  public static create(startDelay: number, maxDelay: number, maxRetries?: number): RetryTracker {
    return new BackOffRetryTracker(startDelay, maxDelay, maxRetries);
  }
}

// add a random +/- 5% to value to prevent synchronization due to request burst
function jitter(input: number) {
  return input * ((10 + Math.random() - 0.5) / 10);
}

export class BackOffRetryTracker implements RetryTracker {
  private delay: number;
  private remainingRetries: number;
  constructor(readonly startDelay: number, readonly maxDelay: number, readonly maxRetries?: number) {
    this.delay = startDelay * ((Math.random() + 5) / 6);
    this.remainingRetries = maxRetries ?? Number.MAX_SAFE_INTEGER;
  }

  public close() {
    this.remainingRetries = 0;
  }

  public get shouldRetry(): boolean {
    return this.remainingRetries > 0;
  }

  public onFailed(): Promise<void> {
    return new Promise((resolve) => {
      if (this.remainingRetries == 0) return;
      --this.remainingRetries;
      setTimeout(resolve, jitter(this.delay));
      this.delay = Math.min(this.delay * 2, this.maxDelay);
    });
  }
}
