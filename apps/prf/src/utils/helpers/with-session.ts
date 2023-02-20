import axios from 'axios';
import { ServerResponse } from 'http';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getEmployeeDetailsFromHr } from '../../http-requests/employee-requests';
import { EmployeeDetails } from '../../types/employee.type';

var employee = {} as EmployeeDetails;

const setEmployee = (employeeDetails: any) => {
  employee = employeeDetails;
};

export const getEmployee = () => employee;

/**
 * Require authentication via session cookies to protect page routes.
 *
 * @param serverSideProps A callback function to enable server side rendering.
 *
 */
export function withSession(serverSideProps: GetServerSideProps) {
  return async (context?: GetServerSidePropsContext) => {
    if (!context?.req.headers.cookie) {
      return {
        redirect: {
          permanent: false,
          destination: '/signin',
        },
      };
    } else {
      // get employee details
      // const test = {...employee, await getEmployeeDetailsFromHr(context)}
      //setEmployee(await getEmployeeDetailsFromHr(context));

      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users`, {
          withCredentials: true,
          headers: { Cookie: `${context?.req.headers.cookie}` },
        });

        setEmployee(data);
      } catch (error: any) {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_PORTAL_URL}/pending-users/${context.req.headers.cookie}`,
          {
            withCredentials: true,
            headers: { Cookie: `${context?.req.headers.cookie}` },
          }
        );

        // setEmployee(data, 'pending user');
        console.log(data);
      }

      // return the result
      return await serverSideProps(context);
    }
  };
}

export function invalidateSession(response: ServerResponse) {
  response.setHeader('Set-Cookie', 'ssid=deleted; Max-Age=0; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
}
