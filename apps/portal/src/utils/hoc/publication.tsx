import axios from 'axios';
import useSWR from 'swr';
import { fetchWithSession } from './fetcher';

export const getPublication = async (vppId: string) => {
  // production url
  const publicationsGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${vppId}`;
  // mock url
  const mockUrl = 'http://192.168.1.84:2000/auth/dashboard/';

  // get data from the backend
  const publicationDetails = await axios.get(`${publicationsGetUrl}`, { withCredentials: true })

  // return employee data
  return publicationDetails.data;
};


//  const applicantGetUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/${vppId}/all`;