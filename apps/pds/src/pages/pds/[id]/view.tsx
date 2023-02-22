import Head from 'next/head';
import { NextPage, GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import dayjs from 'dayjs';
import { PdsDocument } from '../../../components/personal-data-sheet/PdsDocument';
import { isEmpty } from 'lodash';
import axios from 'axios';

const PersonalDataSheetPdf: NextPage = ({ applicantPds }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const formatDate = (assignedDate: string) => {
    if (!isEmpty(assignedDate)) {
      const date = new Date(assignedDate);
      return dayjs(date.toLocaleDateString()).format('MM/DD/YYYY');
    } else {
      return '';
    }
  };

  return (
    <>
      <Head>
        <title>PDS View</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-full w-full justify-center">
          {isEmpty(applicantPds) ? (
            <>
              <div className="flex flex-col">
                <p className="text-3xl">Personal Data Sheet is not yet filled out</p>
                <div className="flex justify-items-center"></div>
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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const applicantPds = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_BE_URL}/pds/v2/${context.params?.id}`);
    console.log(applicantPds.data);
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
