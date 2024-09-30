import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { Pds } from '../../../../../store/pds.store';
import { PdsDocumentView } from 'apps/job-portal/src/components/personal-data-sheet/PdsDocumentView';

type DashboardProps = {
  vppId: string;
  externalApplicantId: string;
  applicantPds: Pds;
};

export default function PersonalDataSheetPdf({ applicantPds }: DashboardProps) {
  return (
    <>
      <div className="flex justify-center w-full h-screen">
        <PdsDocumentView applicantPds={applicantPds} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/pds`, {
      withCredentials: true,
      headers: { Cookie: `${context.req.headers.cookie}` },
    });

    return {
      props: {
        vppId: data.vppId,
        applicantPds: data.pdsDetails,
        externalApplicantId: data.externalApplicantId,
      },
    };
  } catch (error) {
    return { props: { vppId: context.query.vpp_id } };
  }
};
