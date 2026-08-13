import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import apiRouter from './src/server/routes/index';
import { errorHandler } from './src/server/middlewares/errorHandler';
import { securityHeaders } from './src/server/middlewares/security';
import { rateLimiter } from './src/server/middlewares/rateLimiter';
import { logger } from './src/server/utils/logger';

const currentDirname = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Core Production Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(securityHeaders);
  app.use(rateLimiter(300, 60000)); // 300 requests per min

  // Initialize Gemini AI client lazily
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({ apiKey });
  };

  // 2. Mount Versioned REST API Routes (/api/v1)
  app.use('/api/v1', apiRouter);

  // Legacy health check alias
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'MobileSQL Express Backend',
      version: '1.0.0-prod',
      timestamp: new Date().toISOString(),
    });
  });

  // 3. AI Copilot: Query Explanation Endpoint
  app.post('/api/copilot/explain', async (req, res, next) => {
    try {
      const { sql, schemaContext, dialect = 'PostgreSQL' } = req.body;

      if (!sql) {
        return res.status(400).json({ success: false, error: 'SQL query is required.' });
      }

      const ai = getGeminiClient();
      const prompt = `
You are the MobileSQL Senior Database Architect Copilot.
Explain the following ${dialect} SQL query for a database learner.
Keep explanations concise, structured, and easy to read on a mobile screen.

Context Schema:
${schemaContext ? JSON.stringify(schemaContext, null, 2) : 'Default E-Commerce Schema'}

Query to Explain:
\`\`\`sql
${sql}
\`\`\`

Provide output in JSON format with fields:
- "summary": One-sentence high-level summary of what the query achieves
- "breakdown": Array of key SQL operations (e.g. JOIN type, WHERE filtering, GROUP BY aggregation)
- "performanceTip": One actionable performance tip or indexing advice
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text;
      const parsed = responseText ? JSON.parse(responseText) : {};
      return res.json({ success: true, data: parsed });
    } catch (error) {
      next(error);
    }
  });

  // 4. AI Copilot: Natural Language to SQL Endpoint
  app.post('/api/copilot/generate', async (req, res, next) => {
    try {
      const { userPrompt, schemaContext, dialect = 'PostgreSQL' } = req.body;

      if (!userPrompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required.' });
      }

      const ai = getGeminiClient();
      const systemInstruction = `
You are MobileSQL Copilot, an expert SQL query generator for ${dialect}.
Convert the user's natural language request into clean, efficient, standard SQL.

Available Schema:
${schemaContext ? JSON.stringify(schemaContext, null, 2) : 'Default E-Commerce Schema (users, orders, products, order_items)'}

Format response in JSON with:
- "sql": The exact executable SQL string
- "explanation": Brief explanation of how the query works
- "estimatedComplexity": "Low" | "Medium" | "High"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const parsed = response.text ? JSON.parse(response.text) : {};
      return res.json({ success: true, data: parsed });
    } catch (error) {
      next(error);
    }
  });

  // 5. Global Error Handling Middleware
  app.use(errorHandler);

  // 6. Vite Dev Server Integration vs Production Static File Serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`[MobileSQL Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  logger.error('[MobileSQL Server Fatal Error]', err);
  process.exit(1);
});
