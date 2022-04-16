import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';

import { Layout } from 'components/Layout';

export const getServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const backendData = { serverTime: new Date().toString() };

  return {
    props: {
      backendData,
    },
  };
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ backendData }) => {
  return (
    <Layout>
      <div
        className="mx-auto w-full px-20 py-32"
        style={{ maxWidth: '100rem' }}
      >
        <h1 className="mb-8 text-center text-6xl font-bold">Hello World!</h1>

        <pre className="bg-gray-200 p-4">
          {JSON.stringify(backendData, null, 2)}
        </pre>
      </div>
    </Layout>
  );
};

export default Home;
