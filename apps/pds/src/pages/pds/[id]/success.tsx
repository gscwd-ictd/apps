/* eslint-disable react/jsx-no-target-blank */
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { SuccessSVG } from '../../../components/fixed/svg/Success';

type SubmitSuccessProps = {
  userId: string;
};

export default function SubmitSuccess({
  userId,
}: SubmitSuccessProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Success!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col items-center justify-center h-screen">
          <SuccessSVG />
          <h1
            className={`mt-10 select-none text-3xl font-medium text-indigo-600 `}
          >
            Submit successful!
          </h1>
          <p className="text-2xl select-none">
            Thank you for submitting your Personal Data Sheet
          </p>

          <div className="flex items-center">
            <a
              href={`${process.env.NEXT_PUBLIC_PERSONAL_DATA_SHEET}/pds/${userId}/view`}
              target="_blank"
              className="px-3 py-2 mt-5 text-4xl text-white bg-indigo-600 rounded-xl"
            >
              Click here to view PDS
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return { props: { userId: context.query.id } };
};
