import axios from 'axios';
import { ServerResponse } from 'http';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { EmployeeDetails } from '../../src/types/data/employee.type';

let userDetails = {} as EmployeeDetails;

const setUserDetails = ({
  user,
  profile,
  employmentDetails,
}: EmployeeDetails) => {
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
export function withSession(serverSideProps: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    if (!context.req.headers.cookie) {
      return {
        redirect: {
          permanent: false,
          destination: `${process.env.NEXT_PUBLIC_PORTAL_FE_URL}/login`,
        },
      };
    } else {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/users`,
        {
          withCredentials: true,
          headers: { Cookie: `${context?.req.headers.cookie}` },
        }
      );

      setUserDetails(data);

      return await serverSideProps(context);
    }
  };
}

// updated cookie with session
export function withCookieSession(serverSideProps: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    // assign context cookie to cookie
    const cookie = context.req.headers.cookie;

    // assign the splitted cookie to cookies array
    const cookiesArray = cookie.split(';') as string[];
    if (!cookie) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    } else {
      const portalSsid = getPortalSsid(cookiesArray);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/users`,
        {
          withCredentials: true,
          headers: { Cookie: `${portalSsid}` },
        }
      );

      setUserDetails(data);

      return await serverSideProps(context);
    }
  };
}

// target portal ssid
export function getPortalSsid(
  cookiesArray: Array<string> | null
): string | null {
  // initialize the ssid array
  let cookieSsids: Array<string> = [];

  // initialize the portal ssid array
  let portalSsid: Array<string | undefined> = [];

  // execute this if there are cookies
  if (cookiesArray.length > 0) {
    // map the cookies array
    cookieSsids = cookiesArray.map((cookie) => {
      // return if it includes ssid_portal return undefined otherwise
      return cookie.includes('ssid_portal') ? cookie : undefined;
    });
    // map the result and return cookie if not undefined
    portalSsid = cookieSsids.map((cookie) => {
      if (cookie !== undefined) return cookie;
    });

    // return the result, expected result should be the cookie from ssid_portal
    return portalSsid[0];
  }
  // return cookiesArray if array length is 0 or less
  return null;
}

export function invalidateSession(response: ServerResponse) {
  response.setHeader(
    'Set-Cookie',
    'ssid=deleted; Max-Age=0; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );
}
