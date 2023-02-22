import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

export const getEmployeeData = async (context: GetServerSidePropsContext) => {
  // production url
  const prodUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/employees/dashboard/${context.query.id}`;

  // mock url
  const mockUrl = 'http://192.168.1.84:2000/auth/dashboard/';

  // get data from the backend
  const result = await axios.get(`${prodUrl}`, {
    // add credentials
    withCredentials: true,

    // specify cookies in the request headers
    headers: { Cookie: `${context.req.headers.cookie}` },
  });

  // return employee data
  return result.data;
};
