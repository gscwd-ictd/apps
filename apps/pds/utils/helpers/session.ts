import axios from 'axios'
import { ServerResponse } from 'http'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { EmployeeDetails } from '../../src/types/data/employee.type'

var userDetails = {} as EmployeeDetails

const setUserDetails = ({ user, profile, employmentDetails }: EmployeeDetails) => {
  userDetails = { user, profile, employmentDetails }

  return userDetails
}

export const getUserDetails = () => userDetails

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
      }
    } else {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users`, {
        withCredentials: true,
        headers: { Cookie: `${context?.req.headers.cookie}` },
      })

      setUserDetails(data)

      return await serverSideProps(context)
    }
  }
}

export function invalidateSession(response: ServerResponse) {
  response.setHeader('Set-Cookie', 'ssid=deleted; Max-Age=0; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT')
}
