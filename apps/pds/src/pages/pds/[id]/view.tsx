import Head from 'next/head';
import { NextPage, GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { PdsView } from 'apps/pds/src/components/personal-data-sheet/PdsView';

const PersonalDataSheetPdf: NextPage = ({ applicantPds }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const onClose = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  return (
    <>
      <Head>
        <title>PDS View</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex justify-center w-full h-screen">
          {isEmpty(applicantPds) ? (
            <>
              <div className="min-w-full min-h-[100%] h-full select-none">
                <div className="flex flex-col items-center justify-center h-full gap-1 ">
                  {/** 404 */}
                  <div className="flex items-center text-6xl font-bold text-indigo-400">
                    <span className="-tracking-tighter">404</span>
                  </div>

                  {/** Oops  */}
                  <div className="flex items-center text-3xl font-semibold text-gray-400">
                    <span className="tracking-tighter">Personal Data Sheet is not yet filled out</span>
                  </div>

                  {/** Never existed  */}
                  <div className="flex items-center text-lg font-medium ">
                    <span className="text-gray-700 ">
                      ...maybe the page you&apos;re looking for is not found or never existed.
                    </span>
                  </div>

                  {/** Button */}
                  <div className="flex items-center">
                    <button className="px-3 py-2 text-white bg-indigo-400 rounded" onClick={onClose}>
                      Click here to close this tab
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <PdsView applicantPds={applicantPds} />
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default PersonalDataSheetPdf;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  /*
  {
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    }
  */
  try {
    const applicantPds = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_BE_URL}/pds/v2/${context.params?.id}`);

    return {
      props: {
        applicantPds: applicantPds.data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
