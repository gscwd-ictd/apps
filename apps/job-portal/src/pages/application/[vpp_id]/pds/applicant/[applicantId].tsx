import {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next';
import dayjs from 'dayjs';
import { PdsDocument } from '../../../../../components/personal-data-sheet/PdsDocument';
import axios from 'axios';
import { Pds } from '../../../../../store/pds.store';

type DashboardProps = {
  vppId: string;
  externalApplicantId: string;
  applicantPds: Pds;
};

export default function PersonalDataSheetPdf({
  vppId,
  applicantPds,
  externalApplicantId,
}: DashboardProps) {
  const formatDate = (assignedDate: string) => {
    const date = new Date(assignedDate);
    return dayjs(date.toLocaleDateString()).format('MM/DD/YYYY');
  };

  return (
    <>
      <div className="flex justify-center w-full h-screen">
        <PdsDocument formatDate={formatDate} pds={applicantPds} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/pds`,
      {
        withCredentials: true,
        headers: { Cookie: `${context.req.headers.cookie}` },
      }
    );

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
