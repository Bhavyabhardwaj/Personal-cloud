import { createOpenApi } from "trpc-openapi";
import { appRouter } from "./trpc";
import { TRPCError } from '@trpc/server';

// Example API key - should be an environment variable in production
const API_KEY = "hardcoded-api-key"; // Replace with a real API key or an env variable

export const openApiAppRouter = createOpenApi({
  router: appRouter,
  endpoint: "/api",
  createContext: ({ req }) => {
    const apiKey = req.headers['x-api-key']; // Retrieve the x-api-key from the request headers

    if (apiKey !== API_KEY) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid API Key',
      });
    }

    return {}; // You can add more context data here if needed
  },
});
