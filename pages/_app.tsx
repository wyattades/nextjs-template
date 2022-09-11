import type { AppProps } from 'next/app';
import Head from 'next/head';
import { withTRPC } from '@trpc/next';

import type { AppRouter } from 'pages/api/trpc/[trpc]';

import 'styles/globals.scss';
import { getBasePath } from 'lib/env';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Hello World!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx: _ctx }) {
    return {
      url: getBasePath(),
      /** @link https://react-query.tanstack.com/reference/QueryClient */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnMount: false,
          },
        },
      },
    };
  },

  /**
   * @link https://trpc.io/docs/ssr
   * Disable this so we can still use getServerSideProps. Requires us to prefetch manually
   */
  ssr: false,
})(App);
