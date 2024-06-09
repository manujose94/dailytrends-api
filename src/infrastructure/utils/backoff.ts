export function backoff(attempt: number, maxDelay: number = 30000): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, attempt), maxDelay);
    return new Promise(resolve => setTimeout(resolve, delay));
  }