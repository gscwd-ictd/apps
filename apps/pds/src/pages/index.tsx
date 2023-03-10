/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  getUserDetails,
  withCookieSession,
} from 'apps/pds/utils/helpers/session';
import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { SVGWelcomeCats } from '../components/fixed/svg/WelcomeCats';

export default function Index(): JSX.Element {
  return (
    <>
      <div className="mt-[10%] flex flex-col items-center">
        <SVGWelcomeCats />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employee = getUserDetails();
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_PORTAL_BE_URL}/pds/v2/${employee.employmentDetails.userId}`
      );

      return {
        props: {},
        redirect: {
          destination: `/pds/${employee.employmentDetails.userId}`,
          permanent: false,
        },
      };
    } catch (error) {
      return {
        props: {},
        redirect: {
          destination: `${process.env.NEXT_PUBLIC_PORTAL_FE_URL}/login`,
          permanent: false,
        },
      };
    }
  }
);
