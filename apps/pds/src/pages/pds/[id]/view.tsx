import Head from 'next/head';
import {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import dayjs from 'dayjs';
import { PdsDocument } from '../../../components/personal-data-sheet/PdsDocument';
import { isEmpty } from 'lodash';
import axios from 'axios';

const PersonalDataSheetPdf: NextPage = ({
  applicantPds,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const formatDate = (assignedDate: string) => {
    if (!isEmpty(assignedDate)) {
      const date = new Date(assignedDate);
      return dayjs(date.toLocaleDateString()).format('MM/DD/YYYY');
    } else {
      return '';
    }
  };

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
                    <span className="tracking-tighter">
                      Personal Data Sheet is not yet filled out
                    </span>
                  </div>

                  {/** Never existed  */}
                  <div className="flex items-center text-lg font-medium ">
                    <span className="text-gray-700 ">
                      ...maybe the page you&apos;re looking for is not found or
                      never existed.
                    </span>
                  </div>

                  {/** Button */}
                  <div className="flex items-center">
                    <button
                      className="bg-indigo-400 text-white px-3 py-2 rounded"
                      onClick={onClose}
                    >
                      Click here to close this tab
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <PdsDocument formatDate={formatDate} pds={applicantPds} />
          )}
        </div>
      </main>
    </>
  );
};

export default PersonalDataSheetPdf;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const applicantPds = await axios.get(
      `${process.env.NEXT_PUBLIC_PORTAL_BE_URL}/pds/v2/${context.params?.id}`
    );

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
