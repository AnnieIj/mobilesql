import { logger } from './logger';

export interface EnvValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required core variables
  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      errors.push('JWT_SECRET is missing in production environment.');
    } else {
      warnings.push('JWT_SECRET not set. Using default development fallback secret.');
    }
  }

  // Database URL check
  if (!process.env.DATABASE_URL) {
    warnings.push('DATABASE_URL is not configured. Running in in-memory resilience sandbox mode.');
  }

  // Gemini API Key check
  if (!process.env.GEMINI_API_KEY) {
    warnings.push('GEMINI_API_KEY is not set. AI Copilot features will return mock responses or prompt for key.');
  }

  const isValid = errors.length === 0;

  return { isValid, warnings, errors };
}

export function printStartupBanner(port: number) {
  const isProd = process.env.NODE_ENV === 'production';
  const nodeVer = process.version;
  
  const banner = `
  ======================================================
     __  __       _     _ _      ____   ___  _     
    |  \\/  | ___ | |__ (_) | ___/ ___| / _ \\| |    
    | |\\/| |/ _ \\| '_ \\| | |/ _ \\___ \\| | | | |    
    | |  | | (_) | |_) | | |  __/___) | |_| | |___ 
    |_|  |_|\\___/|_.__/|_|_|\\___|____/ \\__\\_\\_____|
                                                 
    Mobile-First SQL IDE & AI Academy v1.0.0-PROD
  ======================================================
  * Runtime: Node ${nodeVer} (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'})
  * HTTP Endpoint: http://0.0.0.0:${port}
  * REST API: http://0.0.0.0:${port}/api/v1
  * Health Probe: http://0.0.0.0:${port}/api/health
  * Security: Helmet CSP, Rate-Limiting, HMAC-SHA256 JWT
  * Sandbox Dialects: PostgreSQL 16, SQLite WASM, MySQL 8
  ======================================================
  `;

  console.log(banner);

  const envCheck = validateEnvironment();
  if (envCheck.warnings.length > 0) {
    envCheck.warnings.forEach((w) => logger.warn(`[Env Warning] ${w}`));
  }
  if (envCheck.errors.length > 0) {
    envCheck.errors.forEach((e) => logger.error(`[Env Error] ${e}`));
  }
}
