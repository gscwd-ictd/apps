import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { PendingUser } from '../../../types/user.type';

const baseUrl = process.env.NEXT_PUBLIC_PORTAL_URL;

export const getEmployeeDetailsFromHr = async (
  context?: GetServerSidePropsContext
) => {
  // call api to get employee details
  const { data } = await axios.get(`${baseUrl}/employees/hr-details`, {
    // make sure to make use of session cookie
    withCredentials: true,

    // pass the generated ssid
    headers: { Cookie: `${context?.req.headers.cookie}` },
  });

  // return employee details
  return data;
};

export const getEmployeeProfile = async (
  userId: string,
  context?: GetServerSidePropsContext
) => {
  const { data } = await axios.get(`${baseUrl}/employees?user=${userId}`, {
    // make sure to make use of session cookie
    withCredentials: true,

    // pass the generated ssid
    headers: { Cookie: `${context?.req.headers.cookie}` },
  });

  return data;
};

export const createEmployee = async (pendingUser: PendingUser) => {
  try {
    return await axios.post(`${baseUrl}/employees`, pendingUser, {
      withCredentials: true,
    });
  } catch (error) {
    console.log(
      error,
      'employee-requests: error coming from create employee profile'
    );
  }
};
