import type { NextPage } from 'next';

import { Layout } from 'components/Layout';
import { useMutation, useQuery } from 'lib/trpc';
import { middleware } from 'lib/middleware';
import { useUrlParam } from 'lib/useUrlParam';

export const getServerSideProps = middleware(
  // withPrefetch('stuff.all', { order: null }),
  async (ctx) => {
    await ctx.prefetchQuery('stuff.all', {
      order: (ctx.query.sort_order as 'asc' | 'desc' | undefined) || null,
    });

    return {
      props: {
        serverTime: new Date().toString(),
      },
    };
  },
);

const HomePage: NextPage<{
  serverTime: string;
}> = (backendData) => {
  const [order, setOrder] = useUrlParam<'asc' | 'desc'>('sort_order');

  const {
    error,
    data: { stuff = null } = {},
    refetch: refreshStuff,
  } = useQuery(['stuff.all', { order: order || null }]);

  const { mutateAsync: addStuff } = useMutation(['stuff.add'], {
    onSuccess() {
      refreshStuff();
    },
  });

  return (
    <Layout>
      <div
        className="mx-auto w-full px-20 py-32 space-y-4"
        style={{ maxWidth: '50rem' }}
      >
        <h1 className="text-center text-6xl font-bold">Hello World!</h1>

        <p>
          <strong>Server time:</strong> {backendData.serverTime}
        </p>

        <div>
          <label>
            Set Order:
            <select
              className="p-2 rounded ml-2"
              value={order ?? ''}
              onChange={(e) => {
                setOrder((e.target.value as 'asc' | 'desc' | '') || null);
              }}
            >
              {['asc', 'desc', null].map((d) => {
                return (
                  <option key={d ?? ''} value={d ?? ''}>
                    {d ?? 'None'}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        {error ? (
          <p className="text-red-500">Error: {error.toString()}</p>
        ) : (
          <p>
            <strong>Stuff:</strong> {stuff?.join(', ')}
          </p>
        )}

        <p className="text-center">
          <button
            type="button"
            className="p-2 rounded bg-gray-100 hover:bg-gray-200"
            onClick={async () => {
              await addStuff({
                next: (Math.random() * 1000) | 0,
              });
            }}
          >
            Create Stuff
          </button>
        </p>
      </div>
    </Layout>
  );
};

export default HomePage;
