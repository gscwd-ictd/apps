import useSWR from 'swr';
import { fetchWithSession } from './fetcher';

export const getApplicants = async (vppId: string) => {
  // production url
  const applicantGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/${vppId}/all`;
  // mock url
  const mockUrl = 'http://192.168.1.84:2000/auth/dashboard/';

  // get data from the backend
  const { data: applicants } = useSWR(applicantGetUrl, fetchWithSession)

  // return employee data
  return applicants;
};


//  const applicantGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/${vppId}/all`;