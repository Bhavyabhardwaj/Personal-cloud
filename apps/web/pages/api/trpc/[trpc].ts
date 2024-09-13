import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/trpc/trpc"; 

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}), // This is optional and can be customized
});
