import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>PDS View</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex justify-center w-full h-screen">
          <>
            <div className="min-w-full min-h-[100%] h-full select-none">
              <div className="flex flex-col items-center justify-center h-full gap-1 ">
                {/** 404 */}
                <div className="flex items-center text-6xl font-bold text-indigo-400">
                  <span className="-tracking-tighter">401</span>
                </div>

                {/** Oops  */}
                <div className="flex items-center text-3xl font-semibold text-gray-400">
                  <span className="tracking-tighter">NOT AUTHORIZED</span>
                </div>

                {/** Never existed  */}
                <div className="flex items-center text-lg font-medium ">
                  <span className="text-gray-700 ">
                    You are not allowed to access this page.
                  </span>
                </div>

                {/** Button */}
                <div className="flex items-center">
                  <button
                    className="bg-indigo-400 text-white px-3 py-2 rounded"
                    onClick={onClose}
                  >
                    Click here to return to the previous page
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
      </main>
    </>
  );
}
