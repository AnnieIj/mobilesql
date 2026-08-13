import { logger } from './logger';

export interface PerformanceMetric {
  operation: string;
  durationMs: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

class TelemetryService {
  private slowQueryThresholdMs = 250;
  private metricsBuffer: PerformanceMetric[] = [];
  private maxBufferSize = 500;

  /**
   * Profiles query execution time and flags slow queries
   */
  public recordQueryMetric(query: string, durationMs: number, success: boolean, dialect = 'postgresql') {
    const metric: PerformanceMetric = {
      operation: 'sql_execution',
      durationMs,
      timestamp: new Date().toISOString(),
      metadata: {
        querySample: query.slice(0, 100).replace(/\s+/g, ' ').trim(),
        success,
        dialect,
      },
    };

    this.metricsBuffer.push(metric);
    if (this.metricsBuffer.length > this.maxBufferSize) {
      this.metricsBuffer.shift();
    }

    if (durationMs > this.slowQueryThresholdMs) {
      logger.warn(`[Slow Query Detected] ${durationMs.toFixed(2)}ms — Query: "${metric.metadata?.querySample}"`);
    }
  }

  /**
   * Captures application exceptions to Sentry / Error Aggregator
   */
  public captureException(error: Error, context?: Record<string, any>) {
    logger.error(`[Telemetry Error] ${error.message}`, {
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });

    if (process.env.SENTRY_DSN) {
      // Sentry hook if initialized
      try {
        // e.g. Sentry.captureException(error, { extra: context });
      } catch (e) {
        // Safe guard
      }
    }
  }

  /**
   * Returns current health & resource utilization status
   */
  public getSystemDiagnostics() {
    const memory = process.memoryUsage();
    return {
      status: 'healthy',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      resources: {
        rssMb: (memory.rss / 1024 / 1024).toFixed(2),
        heapUsedMb: (memory.heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMb: (memory.heapTotal / 1024 / 1024).toFixed(2),
        externalMb: (memory.external / 1024 / 1024).toFixed(2),
      },
      telemetry: {
        recentMetricsRecorded: this.metricsBuffer.length,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
      },
    };
  }
}

export const telemetry = new TelemetryService();
