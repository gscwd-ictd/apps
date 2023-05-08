import Head from 'next/head';
import { SuccessSVG } from '../components/fixed/svg/Success';

export default function SubmitSuccess(): JSX.Element {
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
            className={`mt-10 select-none text-5xl font-semibold text-indigo-500 `}
          >
            Submit successful!
          </h1>
          <p className="text-3xl select-none ">
            Thank you for submitting your PDS
          </p>
        </div>
      </main>
    </>
  );
}
