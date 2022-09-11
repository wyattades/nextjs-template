import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { stuffRouter, STUFF_PREFIX } from 'lib/stuffApi';

export const appRouter = trpc.router().merge(STUFF_PREFIX, stuffRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  // createContext: () => null,
});
