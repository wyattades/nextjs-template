import { createSSGHelpers } from '@trpc/react/ssg';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
} from 'next';
import type { inferHandlerInput } from '@trpc/server';

import { AppRouter, appRouter } from 'pages/api/trpc/[trpc]';

type MiddlewareCtx = GetServerSidePropsContext &
  ReturnType<typeof createSSGHelpers<AppRouter>>;

type Middleware = (
  ctx: MiddlewareCtx,
) => Promise<void | GetServerSidePropsResult<any>>;

type TQueries = AppRouter['_def']['queries'];

export const withPrefetch =
  <TPath extends keyof TQueries & string, TProcedure extends TQueries[TPath]>(
    path: TPath,
    ...args: inferHandlerInput<TProcedure>
  ): Middleware =>
  async (ctx) => {
    await ctx.prefetchQuery(path, ...args);
  };

export const middleware = (
  ...middlewares: Middleware[]
): GetServerSideProps => {
  return async (ctx: GetServerSidePropsContext) => {
    const ssg = createSSGHelpers({
      router: appRouter,
      ctx: {},
    });

    const mCtx: MiddlewareCtx = { ...ctx, ...ssg };

    let res: GetServerSidePropsResult<any> | void;
    for (const fn of middlewares) {
      res = await fn(mCtx);
      if (res) break;
    }

    res ||= {
      props: {},
    };

    if ('props' in res) {
      res.props.trpcState = ssg.dehydrate();
    }

    return res;
  };
};
