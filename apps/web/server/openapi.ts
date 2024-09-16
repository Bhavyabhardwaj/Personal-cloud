// apps/web/src/server/openapi.ts
import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from '../server/trpc/trpc';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Cloud Storage API',
  version: '1.0.0',
  baseUrl: 'https://localhost:3000/api',
  docsUrl: 'https://github.com/your-repo',
  tags: ['auth', 'users', 'files', 'notes'],
});

// apps/web/src/pages/api/[...trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createOpenApiNextHandler } from 'trpc-openapi';
import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});

const openApiHandler = createOpenApiNextHandler({
  router: appRouter,
  createContext: createTRPCContext,
});

export default async function handler(req: any, res: any) {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== process.env.API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Use OpenAPI handler for GET /api/users, otherwise use tRPC handler
  if (req.method === 'GET' && req.url?.startsWith('/api/users')) {
    await openApiHandler(req, res);
  } else {
    await nextApiHandler(req, res);
  }
}