import axios from 'axios';
import { ServerResponse } from 'http';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

type UserAccess = {
  I: string;
  this: string;
};

export type UserProfile = {
  _id: string; // employee id
  fullName: string;
  isSuperUser: boolean;
  photoUrl: string;
  email: string;
  userAccess: Array<UserAccess>;
  userId: string; // superuser id
};

type UserDetails = {
  userDetails: UserProfile;
};

// set user details

let userLoginDetails = {} as UserDetails;

const setUserLoginDetails = ({ userDetails }: UserDetails) => {
  //
  userLoginDetails = { userDetails };

  return userLoginDetails;
};

export const getUserLoginDetails = () => userLoginDetails;

/**
 * Require authentication via session cookies to protect page routes.
 *
 * @param serverSideProps A callback function to enable server side rendering.
 *
 */

export async function getCookieFromServer(cookie) {
  // assign the splitted cookie to cookies array of string

  const cookiesArray = cookie ? (cookie.split(';') as string[]) : null;

  // get the element where name is ssid_hrms
  const hrmsSsid = getHrmsSsid(cookiesArray);

  // get the hrms ssid length else redirect to /login
  if (hrmsSsid && hrmsSsid.length > 0) {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRMS_DOMAIN_BE}/users/details`, {
      withCredentials: true,
      headers: { Cookie: `${hrmsSsid}` },
    });

    setUserLoginDetails(data);
    return data;
  } else return null;
}

// updated cookie with session
export function withCookieSession(serverSideProps: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    // console.log(context);
    try {
      // assign context cookie to cookie
      const cookie = context.req.headers.cookie;

      // assign the splitted cookie to cookies array of string
      const cookiesArray = cookie.split(';') as string[];

      // get the element where name is ssid_hrms
      const hrmsSsid = getHrmsSsid(cookiesArray);

      // get the hrms ssid length else redirect to /login
      if (hrmsSsid.length > 0) {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRMS_DOMAIN_BE}/users/details`, {
          withCredentials: true,
          headers: { Cookie: `${hrmsSsid}` },
        });

        // setUserDetails(data);
        setUserLoginDetails(data);
        // console.log(data);

        return await serverSideProps(context);
      } else {
        return {
          redirect: {
            permanent: false,
            destination: '/login',
          },
        };
      }
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
  };
}

// target hrms ssid
export function getHrmsSsid(cookiesArray: Array<string> | null) {
  // initialize the ssid array
  let cookieSsid: Array<string> = [];

  // execute this if there are cookies
  if (cookiesArray && cookiesArray.length > 0) {
    // filter the cookies array
    cookieSsid = cookiesArray.filter((cookie) => cookie.includes('ssid_hrms'));

    return cookieSsid;
  }
  return cookiesArray;
}

export function invalidateSession(response: ServerResponse) {
  response.setHeader('Set-Cookie', 'ssid_portal=deleted; Max-Age=0; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
}
