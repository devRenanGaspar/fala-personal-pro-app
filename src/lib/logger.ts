/**
 * Logger utility that only logs in development environment
 * In production, errors are silently captured to avoid exposing details
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(message, error);
    }
    // In production, you could send to error tracking service like Sentry
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },
  
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },
  
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  }
};
