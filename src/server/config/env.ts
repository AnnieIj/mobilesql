import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',

  jwt: {
    secret: process.env.JWT_SECRET || 'mobilesql_production_super_secret_key_2026_jwt_token',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'mobilesql_production_refresh_token_secret_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  db: {
    url: process.env.DATABASE_URL || 'postgresql://mobilesql_admin:securepass@127.0.0.1:5432/mobilesql_db',
    poolMin: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DATABASE_POOL_MAX || '20', 10),
    idleTimeoutMs: parseInt(process.env.DATABASE_IDLE_TIMEOUT_MS || '30000', 10),
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    defaultModel: 'gemini-2.5-flash',
  },

  security: {
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300', 10),
  },

  cache: {
    ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10),
  },
};
