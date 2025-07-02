import Head from 'next/head';
import { NextPage, GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { WesDocumentView } from 'apps/job-portal/src/components/work-experience-sheet/WesDocumentView';

const WorkExperienceSheetPdf: NextPage = ({ applicantWes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Work Experience View</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex justify-center w-full h-screen">
          <WesDocumentView applicantWes={applicantWes && []} />
        </div>
      </main>
    </>
  );
};

export default WorkExperienceSheetPdf;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const applicantWes = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/pds/work-experience-sheet/${context.query.external_applicant_id}`
    );

    return {
      props: {
        applicantWes: applicantWes.data,
      },
    };
  } catch (error) {
    return { props: {} };
  }
};
