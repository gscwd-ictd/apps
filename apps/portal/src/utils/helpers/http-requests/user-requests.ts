import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { post } from '../../helpers/http-request';

const baseUrl = process.env.NEXT_PUBLIC_PORTAL_URL;

export async function userSignin(
  email: string,
  password: string,
  callBack: (result: string) => void
) {
  // attempt to sign in
  const { error, result } = await post(`${baseUrl}/users/web/signin`, {
    email,
    password,
  });

  // execute this callback only if there is an error
  if (error) callBack(result);

  // return error and result
  return { error, result };
}

export async function userSignup(
  _id: string,
  email: string,
  password: string,
  role: string,
  companyId: string | null,
  firstName: string,
  middleName: string,
  lastName: string,
  nameExt: string,
  callBack: (result: string) => void
) {
  // call api to request for signup
  const { error, result } = await post(`${baseUrl}/users/web/signup`, {
    _id,
    email,
    password,
    role,
    companyId,
    firstName,
    middleName,
    lastName,
    nameExt,
  });

  // execute this callback after signup request
  callBack(result);

  // return error and result
  return { error, result };
}

export async function verifyPendingUser(
  userId: string,
  context?: GetServerSidePropsContext
) {
  const { data } = await axios.get(
    `${baseUrl}/pending-users/verify/${userId}`,
    {
      // make sure to make use of session cookie
      withCredentials: true,

      // pass the generated ssid
      headers: { Cookie: `${context?.req.headers.cookie}` },
    }
  );

  return data;
}

export async function getUserDetails(
  userId: string,
  context?: GetServerSidePropsContext
) {
  // call api to get user details
  const { data } = await axios.get(`${baseUrl}/users/${userId}`, {
    // make sure to make use of session cookie
    withCredentials: true,

    // pass the generated ssid
    headers: { Cookie: `${context?.req.headers.cookie}` },
  });

  // return user details
  return data;
}

export async function verifySignupToken(token: string) {
  // call api to verify sign up token
  const { data } = await axios.get(
    `${baseUrl}/users/web/verify-signup/${token}`
  );

  // return the data
  return data;
}
