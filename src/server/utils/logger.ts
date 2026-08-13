type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [MobileSQL Backend] [${level}] ${message}${metaString}`;
  }

  info(message: string, meta?: any) {
    console.log(this.formatMessage('INFO', message, meta));
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage('WARN', message, meta));
  }

  error(message: string, meta?: any) {
    console.error(this.formatMessage('ERROR', message, meta));
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('DEBUG', message, meta));
    }
  }
}

export const logger = new Logger();
