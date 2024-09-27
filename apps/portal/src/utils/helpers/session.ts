import axios from 'axios';
import { ServerResponse } from 'http';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { EmployeeDetails } from '../../../src/types/employee.type';

let userDetails = {} as EmployeeDetails;

const setUserDetails = ({ user, profile, employmentDetails }: EmployeeDetails) => {
  userDetails = { user, profile, employmentDetails };

  return userDetails;
};

export const getUserDetails = () => userDetails;

/**
 * Require authentication via session cookies to protect page routes.
 *
 * @param serverSideProps A callback function to enable server side rendering.
 *
 */

// updated cookie with session
export function withCookieSession(serverSideProps: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    try {
      // assign context cookie to cookie
      const cookie = context.req.headers.cookie;

      // assign the splitted cookie to cookies array

      const cookiesArray = cookie.split(';') as string[];
      const portalSsid = getPortalSsid(cookiesArray);

      if (portalSsid.length > 0) {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users`, {
          withCredentials: true,
          headers: { Cookie: portalSsid, 'Accept-Encoding': 'gzip,deflate,compress' },
        });

        setUserDetails(data);
        return await serverSideProps(context);
      } else {
        return {
          redirect: {
            permanent: false,
            destination: '/login',
          },
        };
      }
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }
  };
}

// target portal ssid
export function getPortalSsid(cookiesArray: Array<string> | null) {
  // initialize the ssid array
  let cookieSsid: Array<string> = [];

  // execute this if there are cookies
  if (cookiesArray.length > 0) {
    // filter the cookies array
    cookieSsid = cookiesArray.filter((cookie) => cookie.includes('ssid_portal'));

    return cookieSsid;
  }
  return cookiesArray;
}

export function invalidateSession(response: ServerResponse) {
  response.setHeader('Set-Cookie', 'ssid_portal=deleted; Max-Age=0; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
}
